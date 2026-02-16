export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface RealtimeMessage {
    type: string;
    topic: string;
    [key: string]: any;
}

export interface RealtimeSubscriptionOptions {
    event?: RealtimeEvent;
    filter?: Record<string, any>;
}

export type RealtimeCallback = (payload: any) => void;

export class RealtimeSubscription {
    private service: RealtimeService;
    private topic: string;
    private options: RealtimeSubscriptionOptions;
    private callbacks: Set<RealtimeCallback> = new Set();
    private isSubscribed: boolean = false;

    constructor(service: RealtimeService, topic: string, options: RealtimeSubscriptionOptions = {}) {
        this.service = service;
        this.topic = topic;
        this.options = options;
    }

    on(event: RealtimeEvent, callback: RealtimeCallback): this {
        this.callbacks.add(callback);
        return this;
    }

    subscribe(): this {
        if (this.isSubscribed) return this;
        this.service._send({
            type: 'subscribe',
            topic: this.topic,
            filter: this.options.filter
        });
        this.isSubscribed = true;
        return this;
    }

    unsubscribe(): void {
        if (!this.isSubscribed) return;
        this.service._send({
            type: 'unsubscribe',
            topic: this.topic
        });
        this.isSubscribed = false;
        this.callbacks.clear();
    }

    /** @internal */
    _emit(payload: any): void {
        const event = payload.operation as RealtimeEvent;
        const requestedEvent = this.options.event || '*';

        if (requestedEvent === '*' || requestedEvent === event) {
            for (const cb of this.callbacks) {
                cb(payload);
            }
        }
    }
}

export class RealtimeService {
    private baseUrl: string;
    private apiKey: string;
    private ws: WebSocket | null = null;
    private subscriptions: Map<string, RealtimeSubscription> = new Map();
    private reconnectTimer: any = null;
    private heartbeatTimer: any = null;
    private reconnectAttempts: number = 0;
    private projectId: string = '';

    constructor(apiKey: string, baseUrl: string) {
        // Convert https://api.aerostack.ai/v1 to ws://api.aerostack.ai/realtime
        this.baseUrl = baseUrl.replace('/v1', '').replace(/^http/, 'ws') + '/realtime';
        this.apiKey = apiKey;
    }

    async connect(): Promise<void> {
        if (this.ws) return;

        return new Promise((resolve, reject) => {
            const url = new URL(this.baseUrl);
            url.searchParams.set('apiKey', this.apiKey);

            this.ws = new WebSocket(url.toString());

            this.ws.onopen = () => {
                console.log('Aerostack Realtime Connected');
                this.reconnectAttempts = 0;
                this.startHeartbeat();
                // Re-subscribe to existing topics
                for (const sub of this.subscriptions.values()) {
                    sub.subscribe();
                }
                resolve();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (e) {
                    console.error('Realtime message parse error:', e);
                }
            };

            this.ws.onclose = () => {
                console.log('Aerostack Realtime Disconnected');
                this.stopHeartbeat();
                this.ws = null;
                this.scheduleReconnect();
            };

            this.ws.onerror = (err) => {
                console.error('Realtime connection error:', err);
                reject(err);
            };
        });
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
        this.stopReconnect();
    }

    channel(topic: string, options: RealtimeSubscriptionOptions = {}): RealtimeSubscription {
        // If it's just a table name, we need the projectId. 
        // In RN SDK, we might need a way to get projectId from apiKey or have it passed.
        // Assuming for now the topic is already full or we'll fix backend to handle table names with apiKey context.

        let sub = this.subscriptions.get(topic);
        if (!sub) {
            sub = new RealtimeSubscription(this, topic, options);
            this.subscriptions.set(topic, sub);
        }
        return sub;
    }

    /** @internal */
    _send(data: any) {
        if (this.ws && this.ws.readyState === 1) { // 1 is OPEN
            this.ws.send(JSON.stringify(data));
        }
    }

    private handleMessage(data: RealtimeMessage) {
        if (data.type === 'db_change' || data.type === 'chat_message') {
            const sub = this.subscriptions.get(data.topic);
            if (sub) {
                sub._emit(data);
            }
        }
    }

    private startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            this._send({ type: 'ping' });
        }, 30000);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    }

    /** Exponential backoff with jitter: 1s → 2s → 4s → ... → 30s */
    private scheduleReconnect() {
        this.stopReconnect();
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        const jitter = delay * 0.3 * Math.random();
        this.reconnectAttempts++;
        this.reconnectTimer = setTimeout(() => {
            this.connect().catch(() => { });
        }, delay + jitter);
    }

    private stopReconnect() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    }
}
