const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Add JSON parsing middleware
app.use(express.json());

// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend typically runs on port 3000, not 5000
  methods: ['GET', 'POST'],
  credentials: true
}));

// Map to track rooms and number of users
const roomMap = new Map();

// Create Room Route
app.post('/newRoom', (req, res) => {
  const { roomID } = req.body;

  if (roomMap.has(roomID)) {
    res.status(500).json("The room already exists");
  } else {
    roomMap.set(roomID, 1);
    res.status(200).json("Room has been created");
  }
});

// Join Room Route
app.post('/joinRoom', (req, res) => {
  const { roomID } = req.body;

  if (!roomMap.has(roomID)) {
    return res.status(500).json("The room does not exist");
  }

  if (roomMap.get(roomID) >= 6) {
    return res.status(500).json("The room is full");
  }

  roomMap.set(roomID, roomMap.get(roomID) + 1);
  res.status(200).json("The user has joined the room");
});

// Server setup
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  // socket handling logic here
});

httpServer.listen(5000, () => {
  console.log("The server is running on PORT 5000");
});
