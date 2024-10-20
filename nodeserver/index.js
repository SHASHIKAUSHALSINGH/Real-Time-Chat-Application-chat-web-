// Node server which will handle socket.io connections
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const cors = require('cors'); // Import the cors package

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors());

// Initialize Socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // The origin of your client app
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', socket => {
  // If any new user joins then let other connected user know about it
  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
  // If someone sends any message then broadcast it to others
  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });
  // If someone leaves the chat, broadcast it to others (here disconnect is an in-built event)
  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
