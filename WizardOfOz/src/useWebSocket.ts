import { useEffect, useRef, useCallback, useState } from 'react';

// WebSocket URL configuration
const WS_URL = import.meta.env.VITE_WS_URL ||
  (window.location.hostname === 'localhost'
    ? 'ws://localhost:3001'
    : 'wss://parking-system-189958237522.us-central1.run.app');

interface WebSocketMessage {
  event: string;
  [key: string]: any;
}

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('WebSocket connected to backend');
        setIsConnected(true);
        // Register as wizard-of-oz client
        ws.current?.send(JSON.stringify({
          type: 'register',
          clientType: 'wizard-of-oz'
        }));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected, reconnecting in 3s...');
        setIsConnected(false);
        reconnectTimeout.current = setTimeout(connect, 3000);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
      reconnectTimeout.current = setTimeout(connect, 3000);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log('Sent message:', message);
    } else {
      console.error('WebSocket not connected');
    }
  }, []);

  return { sendMessage, isConnected };
}
