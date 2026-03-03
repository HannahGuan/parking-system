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
        // Register as app client
        ws.current?.send(JSON.stringify({
          type: 'register',
          clientType: 'app'
        }));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          // Handle navigation events from backend
          switch (data.event) {
            case 'NAVIGATE_TO_CONFIRM':
              navigate('/confirm');
              break;
            case 'NAVIGATE_TO_ACTIVE':
              navigate('/active');
              break;
            case 'NAVIGATE_TO_PAYMENT':
              navigate('/payment');
              break;
            case 'SHOW_PAYMENT_NOTIFICATION':
              // Show notification prompting user to pay for parking
              if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                  new Notification('Parking Payment Reminder', {
                    body: 'Please pay for your parking session.',
                    icon: '/icon.png'
                  });
                } else if (Notification.permission !== 'denied') {
                  Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                      new Notification('Parking Payment Reminder', {
                        body: 'Please pay for your parking session.',
                        icon: '/icon.png'
                      });
                    }
                  });
                }
              }
              // Also show an alert as fallback
              alert('Parking Payment Reminder: Please pay for your parking session.');
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
