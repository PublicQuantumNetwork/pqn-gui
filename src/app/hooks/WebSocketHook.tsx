
'use client';

import { useEffect, useState, useRef } from 'react';

export const useWebSocket = () => {
    // `open` tracks the desired connection state. True means we want to be connected.
    const [open, setOpen] = useState(false);
    // `isConnected` tracks the actual real-time connection state.
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
    const ws = useRef<WebSocket | null>(null);

    const connect = () => setOpen(true);
    const disconnect = () => setOpen(false);

    useEffect(() => {
        if (open) {
            const socket = new WebSocket('ws://127.0.0.1:8000/coordination/ws');
            ws.current = socket;

            socket.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
            };

            socket.onmessage = (event) => {
                console.log('WebSocket message received:', event.data);
                setLastMessage(event);
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected');
                ws.current = null;
                setIsConnected(false);
                // If the socket closes, update the desired state to reflect this.
                setOpen(false);
            };

            // The cleanup function is called when the component unmounts or `open` changes.
            return () => {
                socket.close();
            };
        }
    }, [open]);

    const sendMessage = (message: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(message);
            console.log('Sent message:', message);
        } else {
            console.error('WebSocket is not connected or not open.');
        }
    };

    return { lastMessage, sendMessage, connect, disconnect, isConnected };
};
