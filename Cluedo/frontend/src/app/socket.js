// socket.js
import { io } from 'socket.io-client';

// Make sure this matches the backend port (5000)
const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"], // optional: ensures websocket is used
});

export { socket };
