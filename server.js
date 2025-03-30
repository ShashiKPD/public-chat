const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const port = 8080;
const healthCheckPort = 8081;

// Use CORS middleware to allow requests from specific origins
app.use(cors({
  origin: 'http://localhost:3000' // Replace with the allowed origin
}));


// Health check endpoint
app.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the health check server
app.listen(healthCheckPort, () => {
  console.log(`Health check server is running on http://localhost:${healthCheckPort}/healthcheck`);
});

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: port }, () => {
  console.log(`WebSocket server is running on ws://localhost:${port}`);
});

// Broadcast incoming messages to all connected clients
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // Broadcast to every connected client
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});