const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');

const app = express();
const wsInstance = expressWs(app); // Store express-ws instance

const port = 8080;

app.use(cors({
  origin: '*' // Allow all origins (for testing purposes)
}));

// Health check endpoint
app.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok' });
});

// WebSocket endpoint
app.ws('/ws', (ws, req) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);

    // ✅ FIX: Use wsInstance.getWss() instead of app.getWss()
    wsInstance.getWss().clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`WebSocket endpoint available at ws://localhost:${port}/ws`);
  console.log(`Health check endpoint available at http://localhost:${port}/healthcheck`);
});
