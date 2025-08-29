
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
    lastMessage: MessageEvent | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

    useEffect(() => {
        // IMPORTANT: Replace this with your actual WebSocket server URL
        const ws = new WebSocket('ws://127.0.0.1:8000/ws');

        ws.onopen = () => {
            console.log('WebSocket connected');
            // You can send a message on connection if needed
            // ws.send(JSON.stringify({ message: 'Hello from client!' }));
        };

        ws.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            setLastMessage(event);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        // Cleanup on component unmount
        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ lastMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
