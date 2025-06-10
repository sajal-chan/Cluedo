const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

const rooms = {};//need to completely change the structure of this, make this uuid centric

app.post('/newRoom', (req, res) => {
  const { roomID } = req.body;

  if (rooms[roomID]) {
    res.status(500).json("The room already exists");
  } else {
    rooms[roomID] = {
      adminID: null,
      users: {},
      gameStarted: false
    };
    res.status(200).json("Room has been created");
  }
});

app.post('/joinRoom', (req, res) => {
  const { roomID } = req.body;

  if (!rooms[roomID]) {
    return res.status(500).json("The room does not exist");
  }

  const numUsers = Object.keys(rooms[roomID].users).length;
  if (numUsers >= 6 && !rooms[roomID].gameStarted) {
    return res.status(500).json("The room is full or the game has already started");
  }
  res.status(200).json("The user has joined the room");
});

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on("connection", (socket) => {
  // console.log("Client connected:", socket.id);

  socket.on("create room", ({roomID,userID}) => {
    socket.join(roomID);
    rooms[roomID] = {
      adminID: userID,
      users: {
        [userID]: { username: null }
      },
      gameStarted: false
    };
    console.log(`user ${userID} has created the room`);
    console.log(`Room: ${roomID} has ${Object.keys(rooms[roomID].users)}`);
  });

  socket.on("join room", ({roomID,userID}) => {
    if (rooms[roomID]) {
      socket.join(roomID);
      rooms[roomID].users[userID] = { username: null };
      console.log(`Client with ${userID} has joined the room ${roomID}`);
      console.log(`Room: ${roomID} has ${Object.keys(rooms[roomID].users)}`);
    }
  });

  socket.on("current_room",({roomID})=>{
    io.to(roomID).emit("room_status", {
      users: Object.entries(rooms[roomID].users),
      roomID,
      adminID: rooms[roomID].adminID,
    });
  });

  socket.on("set_username", ({ username, roomID,userID }) => {
    if (rooms[roomID] && rooms[roomID].users[userID]) {
      rooms[roomID].users[socket.id].username = username;
    }
  });
  
  socket.on("start_game",(roomID)=>{
    rooms[roomID].gameStarted=true;
  })

  //this needs change, try if we can get the roomID that the socket has disconnected from so we can have a O(1) lookup
  socket.on("disconnect", () => {
    for (const roomID in rooms) {
      if (rooms[roomID].users[socket.id]) {
        delete rooms[roomID].users[socket.id];
        if (socket.id === rooms[roomID].adminID) {
          rooms[roomID].adminID = null;
        }
        if (Object.keys(rooms[roomID].users).length === 0) {
          delete rooms[roomID];
        }
        break;
      }
    }
  });
});

httpServer.listen(5000, () => {
  console.log("The server is running on PORT 5000");
});
