import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { origin: '*' },
  transports: ['websocket', 'polling']
});

let grid: string[][] = Array(10).fill(null).map(() => Array(10).fill(''));
let onlineUsers = 0;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  onlineUsers++;
  io.emit('onlineUsers', onlineUsers);
  socket.emit('gridUpdate', grid);

  socket.on('selectCell', ({ row, col, char }: { row: number; col: number; char: string }) => {
    if (grid[row] && grid[row][col] === '') {
      grid[row][col] = char;
      console.log(`Cell updated: [${row}, ${col}] = ${char}`);
      io.emit('gridUpdate', grid);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    onlineUsers--;
    io.emit('onlineUsers', onlineUsers);
  });
});

const clientBuildPath = path.join(__dirname, '../../client/dist');
console.log('Client build path:', clientBuildPath);
app.use(express.static(clientBuildPath));
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    players: onlineUsers,
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${clientBuildPath}`);
});