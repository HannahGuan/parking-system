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
  infotainment: new Set()
};

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
          console.log('Broadcasting START_SESSION');

          // App goes to Active page
          broadcast(clients.app, {
            event: 'NAVIGATE_TO_ACTIVE',
            timestamp: Date.now()
          });

          // Infotainment goes to Session Started
          broadcast(clients.infotainment, {
            event: 'NAVIGATE_TO_SESSION_STARTED',
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
