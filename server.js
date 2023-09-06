const express = require('express');
const path = require('path');
const http = require('http');

const app = express(); 
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);

  socket.on('move made', (data) => {
    console.log(`Received 'move made' from socket ID: ${socket.id}. Data:`, data);
    // Broadcast the move to the other player
    socket.broadcast.emit('update board', data);
  });

  socket.on('disconnect', () => {
    console.log(`User with socket ID: ${socket.id} disconnected.`);
  });
});
server.listen(3000,'0.0.0.0', () => {
  console.log('Listening on port 3000');
});