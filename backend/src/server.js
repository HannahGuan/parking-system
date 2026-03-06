import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend applications
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store connected clients with their types
const clients = {
  app: new Set(),
  infotainment: new Set(),
  'wizard-of-oz': new Set()
};

// Store payment methods in memory (simple demo version)
let paymentMethods = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connections: {
      app: clients.app.size,
      infotainment: clients.infotainment.size
    }
  });
});

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log('New client connected');

  let clientType = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received:', data);

      // Register client type
      if (data.type === 'register') {
        clientType = data.clientType; // 'app' or 'infotainment'
        clients[clientType]?.add(ws);
        console.log(`Client registered as: ${clientType}`);

        ws.send(JSON.stringify({
          type: 'registered',
          clientType: clientType
        }));
        return;
      }

      // Handle events and broadcast to appropriate clients
      switch (data.event) {
        case 'SIMULATE_PARK_ON':
          // Infotainment sends this -> App should show Confirm page
          console.log('Broadcasting SIMULATE_PARK_ON to App clients');
          broadcast(clients.app, {
            event: 'NAVIGATE_TO_CONFIRM',
            timestamp: Date.now()
          });
          break;

        case 'START_SESSION':
          // Infotainment confirms parking -> Both apps navigate
          console.log('Broadcasting START_SESSION with duration:', data.duration);

          // App goes to Active page
          broadcast(clients.app, {
            event: 'NAVIGATE_TO_ACTIVE',
            duration: data.duration,
            timestamp: Date.now()
          });

          // Infotainment goes to Session Started
          broadcast(clients.infotainment, {
            event: 'NAVIGATE_TO_SESSION_STARTED',
            duration: data.duration,
            timestamp: Date.now()
          });
          break;

        case 'END_SESSION':
          // Infotainment ends session -> App goes to Payment
          console.log('Broadcasting END_SESSION to App clients');
          broadcast(clients.app, {
            event: 'NAVIGATE_TO_PAYMENT',
            timestamp: Date.now()
          });
          break;

        case 'SESSION_COMPLETE':
          // Session review complete -> Both App and Infotainment go to home
          console.log('Broadcasting SESSION_COMPLETE - navigate to home');
          broadcast(clients.app, {
            event: 'NAVIGATE_TO_HOME',
            timestamp: Date.now()
          });
          break;

        case 'USER_LEAVES_CAR':
          // WizardOfOz triggers this -> Infotainment goes black
          console.log('Broadcasting GO_BLACK to Infotainment clients');
          broadcast(clients.infotainment, {
            event: 'GO_BLACK',
            timestamp: Date.now()
          });
          break;

        case 'USER_RETURNS_CAR':
          // WizardOfOz triggers this -> Infotainment shows session-active
          console.log('Broadcasting NAVIGATE_TO_SESSION_ACTIVE to Infotainment clients');
          broadcast(clients.infotainment, {
            event: 'NAVIGATE_TO_SESSION_ACTIVE',
            timestamp: Date.now()
          });
          break;

        case 'PAYMENT_REMINDER':
          // WizardOfOz triggers this -> App shows notification
          console.log('Broadcasting SHOW_PAYMENT_NOTIFICATION to App clients');
          broadcast(clients.app, {
            event: 'SHOW_PAYMENT_NOTIFICATION',
            timestamp: Date.now()
          });
          break;

        case 'CONFIGURE_SPOT_TRIGGER':
          broadcast(clients.app, {
            event: 'CONFIGURE_SPOT_TRIGGER',
            enabled: data.enabled,
            feet: data.feet
          });
          break;

        case 'SPOT_FOUND':
          // WizardOfOz triggers this -> Both App and Infotainment show spot found notification
          console.log('Broadcasting SPOT_FOUND to App and Infotainment clients');
          broadcast(clients.app, {
            event: 'SPOT_FOUND',
            timestamp: Date.now()
          });
          broadcast(clients.infotainment, {
            event: 'SPOT_FOUND',
            timestamp: Date.now()
          });
          break;

        case 'GPS_COORDS':
          // App sends GPS coords -> forward to wizard-of-oz
          broadcast(clients['wizard-of-oz'], {
            event: 'GPS_COORDS',
            lat: data.lat,
            lng: data.lng
          });
          break;

        case 'SET_PLATE_NUMBER':
          // WizardOfOz sets plate number -> broadcast to App and Infotainment
          console.log('Broadcasting plate number update:', data.plateNumber);
          broadcast(clients.app, {
            event: 'UPDATE_PLATE',
            plateNumber: data.plateNumber
          });
          broadcast(clients.infotainment, {
            event: 'UPDATE_PLATE',
            plateNumber: data.plateNumber
          });
          break;

        case 'GET_PAYMENT_METHODS':
          // Client requests payment methods
          console.log('Sending payment methods to client');
          ws.send(JSON.stringify({
            event: 'PAYMENT_METHODS_RESPONSE',
            paymentMethods: paymentMethods
          }));
          break;

        case 'ADD_PAYMENT_METHOD':
          // Client adds a payment method
          console.log('Adding payment method:', data.paymentMethod);
          paymentMethods.push(data.paymentMethod);
          // Broadcast to all clients
          broadcast(clients.app, {
            event: 'PAYMENT_METHODS_RESPONSE',
            paymentMethods: paymentMethods
          });
          broadcast(clients.infotainment, {
            event: 'PAYMENT_METHODS_RESPONSE',
            paymentMethods: paymentMethods
          });
          break;

        case 'REMOVE_PAYMENT_METHOD':
          // Client removes a payment method
          console.log('Removing payment method:', data.paymentMethodId);
          paymentMethods = paymentMethods.filter(pm => pm.id !== data.paymentMethodId);
          // Broadcast to all clients
          broadcast(clients.app, {
            event: 'PAYMENT_METHODS_RESPONSE',
            paymentMethods: paymentMethods
          });
          broadcast(clients.infotainment, {
            event: 'PAYMENT_METHODS_RESPONSE',
            paymentMethods: paymentMethods
          });
          break;

        case 'SET_DEFAULT_PAYMENT_METHOD':
          // Client sets default payment method
          console.log('Setting default payment method:', data.paymentMethodId);
          paymentMethods = paymentMethods.map(pm => ({
            ...pm,
            isDefault: pm.id === data.paymentMethodId
          }));
          // Broadcast to all clients
          broadcast(clients.app, {
            event: 'PAYMENT_METHODS_RESPONSE',
            paymentMethods: paymentMethods
          });
          broadcast(clients.infotainment, {
            event: 'PAYMENT_METHODS_RESPONSE',
            paymentMethods: paymentMethods
          });
          break;

        case 'PROCESS_PAYMENT':
          // Mock payment processing
          console.log('Processing payment:', data);
          const success = !data.paymentMethodId || data.paymentMethodId !== 'fail';

          setTimeout(() => {
            ws.send(JSON.stringify({
              event: 'PAYMENT_RESULT',
              success: success,
              transactionId: success ? `txn_${Date.now()}` : null,
              amount: data.amount,
              message: success ? 'Payment successful' : 'Payment declined'
            }));
          }, 2000); // Simulate 2s processing time
          break;

        default:
          console.log('Unknown event:', data.event);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (clientType) {
      clients[clientType]?.delete(ws);
      console.log(`${clientType} client removed`);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Helper function to broadcast messages to specific client set
function broadcast(clientSet, message) {
  const messageStr = JSON.stringify(message);
  clientSet.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(messageStr);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});
