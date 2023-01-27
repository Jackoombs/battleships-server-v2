import { Server } from 'socket.io';
import dotenv from 'dotenv';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from './types.js';

dotenv.config();
const PORT = Number(process.env.PORT) || 8080;

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(PORT, {
  cors: {
    origin: ['http://localhost:5173', '*'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('test', () => {
    console.log('test');
  });
  socket.on('requestRoom', (room: string, createOrJoin: 'create' | 'join') => {
    const isRoom = io.sockets.adapter.rooms.has(room);
    if (createOrJoin === 'create') {
      if (isRoom) {
        socket.emit('roomRequestError', 'Sorry that room is taken');
      } else {
        socket.join(room);
        socket.emit('connectToRoom', room);
      }
    }
    if (createOrJoin === 'join') {
      if (isRoom) {
        const users = io.sockets.adapter.rooms.get(room);
        if (users.size === 1) {
          socket.join(room);
          socket.emit('connectToRoom', room);
          io.to(room).emit('updateGamePhase', 'planning');
        } else {
          socket.emit('roomRequestError', 'Sorry that room is full');
        }
      } else {
        socket.emit('roomRequestError', "Sorry that room doesn't exist");
      }
    }
  });
  socket.on('disconnectFromRoom', (room: string) => {
    socket.leave(room);
    socket.emit('disconnectFromRoom', room);
  });
});
