import { useEffect, useState, useRef } from 'react';
import { RealtimeService, RealtimeSubscriptionOptions, RealtimeStatus } from '../services/RealtimeService';

/**
 * Hook to subscribe to Aerostack realtime events in React Native.
 *
 * @param realtime The RealtimeService instance
 * @param topic The topic to subscribe to (e.g., 'orders' or 'table/orders/projectId')
 * @param options Event type and filtering options
 */
export function useSubscription<T = any>(
    realtime: RealtimeService,
    topic: string,
    options: RealtimeSubscriptionOptions = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const optionsRef = useRef(options);
    optionsRef.current = options;

    useEffect(() => {
        let isMounted = true;

        if (!realtime) {
            setError(new Error('RealtimeService instance is required'));
            setLoading(false);
            return;
        }

        const channel = realtime.channel(topic, optionsRef.current);

        const setup = async () => {
            try {
                await realtime.connect();

                channel.on('*', (payload: any) => {
                    if (isMounted) {
                        setData(payload);
                    }
                });

                channel.subscribe();
                if (isMounted) setLoading(false);
            } catch (err: any) {
                if (isMounted) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        setup();

        return () => {
            isMounted = false;
            channel.unsubscribe();
        };
    }, [realtime, topic]);

    return { data, error, loading };
}

/**
 * Hook to observe the realtime connection status in React Native.
 */
export function useRealtimeStatus(realtime: RealtimeService): RealtimeStatus {
    const [status, setStatus] = useState<RealtimeStatus>(realtime?.status ?? 'idle');

    useEffect(() => {
        if (!realtime?.onStatusChange) return;
        const unsub = realtime.onStatusChange((s: RealtimeStatus) => setStatus(s));
        return unsub;
    }, [realtime]);

    return status;
}
