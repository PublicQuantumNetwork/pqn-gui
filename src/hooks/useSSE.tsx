'use client';

import { useEffect, useState, useRef } from 'react';

interface SSEMessage {
  event: string;
  current?: number;
  total?: number;
  [key: string]: unknown;
}

export const useSSE = (url: string, enabled: boolean = true) => {
  const [lastMessage, setLastMessage] = useState<SSEMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fullUrl = `http://${process.env.NEXT_PUBLIC_API_ADDRESS}${url}`;
    const eventSource = new EventSource(fullUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE: Connected');
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SSE: Message received', data);
        setLastMessage(data);
      } catch (e) {
        console.error('SSE: Failed to parse message', e);
      }
    };

    eventSource.onerror = (e) => {
      console.error('SSE: Error', e);
      setIsConnected(false);
      setError('Connection error');
      eventSource.close();
    };

    return () => {
      console.log('SSE: Disconnecting');
      eventSource.close();
      setIsConnected(false);
    };
  }, [url, enabled]);

  return { lastMessage, isConnected, error };
};
