"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = exports.RealtimeSubscription = void 0;
class RealtimeSubscription {
    constructor(service, topic, options = {}) {
        this.callbacks = new Set();
        this.isSubscribed = false;
        this.service = service;
        this.topic = topic;
        this.options = options;
    }
    on(event, callback) {
        this.callbacks.add(callback);
        return this;
    }
    subscribe() {
        if (this.isSubscribed)
            return this;
        this.service._send({
            type: 'subscribe',
            topic: this.topic,
            filter: this.options.filter
        });
        this.isSubscribed = true;
        return this;
    }
    unsubscribe() {
        if (!this.isSubscribed)
            return;
        this.service._send({
            type: 'unsubscribe',
            topic: this.topic
        });
        this.isSubscribed = false;
        this.callbacks.clear();
    }
    /** @internal */
    _emit(payload) {
        const event = payload.operation;
        const requestedEvent = this.options.event || '*';
        if (requestedEvent === '*' || requestedEvent === event) {
            for (const cb of this.callbacks) {
                cb(payload);
            }
        }
    }
}
exports.RealtimeSubscription = RealtimeSubscription;
class RealtimeService {
    constructor(apiKey, baseUrl) {
        this.ws = null;
        this.subscriptions = new Map();
        this.reconnectTimer = null;
        this.heartbeatTimer = null;
        this.reconnectAttempts = 0;
        this.projectId = '';
        // Convert https://api.aerostack.ai/v1 to ws://api.aerostack.ai/realtime
        this.baseUrl = baseUrl.replace('/v1', '').replace(/^http/, 'ws') + '/realtime';
        this.apiKey = apiKey;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ws)
                return;
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
                    }
                    catch (e) {
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
        });
    }
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
        this.stopReconnect();
    }
    channel(topic, options = {}) {
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
    _send(data) {
        if (this.ws && this.ws.readyState === 1) { // 1 is OPEN
            this.ws.send(JSON.stringify(data));
        }
    }
    handleMessage(data) {
        if (data.type === 'db_change' || data.type === 'chat_message') {
            const sub = this.subscriptions.get(data.topic);
            if (sub) {
                sub._emit(data);
            }
        }
    }
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            this._send({ type: 'ping' });
        }, 30000);
    }
    stopHeartbeat() {
        if (this.heartbeatTimer)
            clearInterval(this.heartbeatTimer);
    }
    /** Exponential backoff with jitter: 1s → 2s → 4s → ... → 30s */
    scheduleReconnect() {
        this.stopReconnect();
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        const jitter = delay * 0.3 * Math.random();
        this.reconnectAttempts++;
        this.reconnectTimer = setTimeout(() => {
            this.connect().catch(() => { });
        }, delay + jitter);
    }
    stopReconnect() {
        if (this.reconnectTimer)
            clearTimeout(this.reconnectTimer);
    }
}
exports.RealtimeService = RealtimeService;
