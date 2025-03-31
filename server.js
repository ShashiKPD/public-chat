const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
const { v4: uuidv4 } = require('uuid');
const { generateUniqueName, colors } = require("./helper");
// Initialize express and express-ws
const app = express();
const wsinstance = expressWs(app);
const port = 8080;

// Use CORS middleware to allow requests from specific origins
app.use(cors({
  origin: 'https://vartalap-kpd.vercel.app' 
}));

// Health check endpoint
app.get('/healthcheck', function (req, res) {
  res.json({ status: 'ok' });
});

try{
  // WebSocket endpoint
  app.ws('/ws', function (ws, req) {
    ws.clientId = uuidv4(); // Generate a unique ID
    ws.clientName = generateUniqueName();
    ws.clientColor = colors[Math.floor(Math.random() * 100)];

    console.log(`Client connected with ID: ${ws.clientId}`);

    ws.on('message', function (message) {
      console.log(`Message from ${ws.clientId}:`, message);

      // Broadcast to all connected clients
      wsinstance.getWss().clients.forEach(function (client) {
        const msg = JSON.parse(message)
        msg.from = {}
        msg.from.userID = ws.clientId;
        msg.from.name = ws.clientName;
        msg.fromUserColor = ws.clientColor;
        // console.log(msg);
        
        if (client.readyState === 1) { // 1 corresponds to OPEN state
          client.send(JSON.stringify(msg));
        }
      });
    });

    ws.on('close', function () {
      console.log('Client disconnected');
    });
  });
}catch(error){
  console.log(error);
}
// Start the server (single listen call)
app.listen(port, function () {
  console.log('Server is running on http://localhost:' + port);
  console.log('WebSocket endpoint available at ws://localhost:' + port + '/ws');
  console.log('Health check endpoint available at http://localhost:' + port + '/healthcheck');
});