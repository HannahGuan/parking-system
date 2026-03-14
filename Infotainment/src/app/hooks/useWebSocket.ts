import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';

// 生产环境 WebSocket URL
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
  const navigate = useNavigate();
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('WebSocket connected to backend');
        // Register as infotainment client
        ws.current?.send(JSON.stringify({
          type: 'register',
          clientType: 'infotainment'
        }));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          // Handle navigation events from backend
          switch (data.event) {
            case 'SPOT_FOUND':
              navigate('/spot-found');
              break;
            case 'NAVIGATE_TO_SESSION_STARTED':
              // Dispatch custom event with duration for SessionStarted component
              window.dispatchEvent(new CustomEvent('sessionStarted', {
                detail: { duration: data.duration }
              }));
              navigate('/session-started');
              break;
            case 'GO_BLACK':
              navigate('/black-screen');
              break;
            case 'NAVIGATE_TO_SESSION_ACTIVE':
              // Dispatch custom event with duration for SessionActive component
              window.dispatchEvent(new CustomEvent('sessionActive', {
                detail: { duration: data.duration }
              }));
              navigate('/session-active');
              break;
            case 'UPDATE_PLATE':
              // Dispatch custom event for plate number update
              window.dispatchEvent(new CustomEvent('updatePlate', {
                detail: { plateNumber: data.plateNumber }
              }));
              console.log('Plate number updated:', data.plateNumber);
              break;
            case 'PAYMENT_METHODS_RESPONSE':
              // Dispatch custom event for payment methods update
              window.dispatchEvent(new CustomEvent('paymentMethodsUpdated', {
                detail: { paymentMethods: data.paymentMethods }
              }));
              console.log('Payment methods updated:', data.paymentMethods);
              break;
            case 'TIME_EXTENDED':
              // Another client extended time -> update local timer
              window.dispatchEvent(new CustomEvent('timeExtended', {
                detail: { extensionMinutes: data.extensionMinutes }
              }));
              console.log('Time extended by another client:', data.extensionMinutes, 'minutes');
              break;
            case 'NAVIGATE_TO_END_SESSION':
              // App ended session -> Infotainment should also navigate to end session
              console.log('App ended session, navigating to end-session');
              navigate('/end-session');
              break;
            default:
              console.log('Unhandled event:', data.event);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected, reconnecting in 3s...');
        reconnectTimeout.current = setTimeout(connect, 3000);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      reconnectTimeout.current = setTimeout(connect, 3000);
    }
  }, [navigate]);

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

  return { sendMessage };
}
