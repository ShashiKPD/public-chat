const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');

// Initialize express and express-ws
const app = express();
const wsinstance = expressWs(app);

const port = 8080;

// Use CORS middleware to allow requests from specific origins
app.use(cors({
  origin: '*' // Replace with the allowed origin
}));

// Health check endpoint
app.get('/healthcheck', function (req, res) {
  res.json({ status: 'ok' });
});

// WebSocket endpoint
app.ws('/ws', function (ws, req) {
  console.log('Client connected');

  ws.on('message', function (message) {
    console.log('Received:', message);

    // Broadcast to all connected clients
    wsinstance.getWss().clients.forEach(function (client) {
      if (client.readyState === 1) { // 1 corresponds to OPEN state
        client.send(message);
      }
    });
  });

  ws.on('close', function () {
    console.log('Client disconnected');
  });
});

// Start the server (single listen call)
app.listen(port, function () {
  console.log('Server is running on http://localhost:' + port);
  console.log('WebSocket endpoint available at ws://localhost:' + port + '/ws');
  console.log('Health check endpoint available at http://localhost:' + port + '/healthcheck');
});