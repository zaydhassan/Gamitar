import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let grid = Array(10).fill(null).map(() => Array(10).fill(''));
let onlineUsers = 0;

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('onlineUsers', onlineUsers);
  socket.emit('gridUpdate', grid);

  socket.on('selectCell', ({ row, col, char }) => {
  if (grid[row] && grid[row][col] === '') {
    grid[row][col] = char;
    io.emit('gridUpdate', grid);
  }
});

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('onlineUsers', onlineUsers);
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));