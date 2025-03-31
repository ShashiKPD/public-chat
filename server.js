const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const expressWs = require('express-ws');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const { generateUniqueName, colors } = require("./helper");

const app = express();
const wsinstance = expressWs(app);
const port = 8080;

app.use(cookieParser());
dotenv.config();
// app.use(cors({origin: '*'}))

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://vartalap-kpd.vercel.app', 'http://127.0.0.1:3000', 'http://192.168.10.12:3000', 'http://192.168.10.6:5500']
    if(allowedOrigins.includes(origin)){
      callback(null, true);
    }else{
      callback(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true
}));

app.get('/healthcheck', function (req, res) {
  res.json({ status: 'ok' });
});

app.get('/connect', function (req, res) {
  const userId = req.cookies.userId;
  if(userId){
    res.json({userId: userId});
    return;
  }
  const user = {
    userId: uuidv4(), // Generate a unique ID
    name: generateUniqueName(),
    userColor: colors[Math.floor(Math.random() * 100)]
  }
  cookieOptions = { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: (process.env.NODE_ENV === "production") ? 'none' : '',
    maxAge: 24 * 60 * 60 * 1000
  }
  if(req.headers['user-agent'] == process.env.THAT_USER_AGENT) {
    cookieOptions.httpOnly = false;
    console.log("That device detected. httpOnly set to false");
  }
  
  res
  .cookie('userId', user.userId, cookieOptions)
  .cookie('name', user.name, cookieOptions)
  .cookie('userColor', user.userColor, cookieOptions)
  .json(user);
});

try{
  // WebSocket endpoint
  app.ws('/ws', function (ws, req) {

    if (!req.cookies.userId) {
      console.log('No userId found. Closing connection');
      ws.send(JSON.stringify({message: "Cookie not found, disconnecting.", from: {userId: 'ADMINUSER', name: 'ADMIN', userColor: '#ff0000'}}), () => {
        ws.close();
      });    
      return;
    }
    ws.clientId = req.cookies.userId;
    ws.clientName = req.cookies.name;
    ws.clientColor = req.cookies.userColor;

    console.log(`Client connected with ID: ${ws.clientId}`);

    ws.on('message', function (message) {
      console.log(`Message from ${ws.clientId}:`, message);

      // Broadcast to all connected clients
      wsinstance.getWss().clients.forEach(function (client) {
        const msg = JSON.parse(message)
        msg.from = {}
        msg.from.userId = ws.clientId;
        msg.from.name = ws.clientName;
        msg.from.userColor = ws.clientColor;
        
        if (client.readyState === 1) { // 1 corresponds to OPEN state
          client.send(JSON.stringify(msg));
        }
      });
    });

    ws.on('error', function (error) {
      console.error(`WebSocket error for client ${ws.clientId}:`, error);
    });

    ws.on('close', function () {
      console.log('Client disconnected');
    });
  });
} catch(error) {
  console.log("Error:", error);
}


// Start the server (single listen call)
app.listen(port, function () {
  console.log('Server is running on http://localhost:' + port);
  console.log('WebSocket endpoint available at ws://localhost:' + port + '/ws');
  console.log('Health check endpoint available at http://localhost:' + port + '/healthcheck');
});