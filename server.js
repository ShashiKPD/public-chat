const WebSocket = require('ws');
const port = 8080;

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: port }, () => {
  console.log(`WebSocket server is running on ws://localhost:${port}`);
});

// Broadcast incoming messages to all connected clients.
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // Broadcast to every connected client.
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});
