const WebSocket = require('ws');
const http = require('http');

const port = 8080;
const healthCheckPort = 8081;

// Create an HTTP server for health check
const healthCheckServer = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/healthcheck') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

healthCheckServer.listen(healthCheckPort, () => {
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