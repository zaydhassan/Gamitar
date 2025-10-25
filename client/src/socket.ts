import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.PROD 
  ? window.location.origin 
  : "http://localhost:3000";

console.log(' Connecting to:', SOCKET_URL);

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});