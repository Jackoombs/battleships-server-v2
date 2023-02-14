import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const PORT = Number(process.env.PORT) || 8080;

const io = new Server(PORT, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://battleships-client-v2.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("requestRoom", (room, createOrJoin) => {
    const isRoom = io.sockets.adapter.rooms.has(room);
    if (createOrJoin === "create") {
      if (isRoom) {
        socket.emit("roomRequestError", "Sorry that room is taken");
      } else {
        socket.join(room);
        socket.emit("connectToRoom", room);
      }
    }
    if (createOrJoin === "join") {
      if (isRoom) {
        const users = io.sockets.adapter.rooms.get(room);
        if (users.size === 1) {
          socket.join(room);
          socket.emit("connectToRoom", room);
          io.to(room).emit("updateGamePhase", "planning");
        } else {
          socket.emit("roomRequestError", "Sorry that room is full");
        }
      } else {
        socket.emit("roomRequestError", "Sorry that room doesn't exist");
      }
    }
  });
  socket.on("disconnectFromRoom", (room) => {
    socket.leave(room);
    socket.emit("disconnectFromRoom", room);
  });
  socket.on("checkOpponentReady", (room) => {
    socket.to(room).emit("checkPlayerReady");
  });
  socket.on("beginGame", (room) => {
    let randomBoolean = Math.random() < 0.5;
    const users = io.sockets.adapter.rooms.get(room);
    for (const user of users) {
      io.to(user).emit("updateGamePhase", "battle", randomBoolean);
      randomBoolean = !randomBoolean;
    }
  });
  socket.on("playerFire", (room, coord) => {
    socket.to(room).emit("opponentReceiveFire", coord);
  });
  socket.on("endRound", (room, coord, isHit, isSunk) => {
    io.to(room).emit("endRound", coord, isHit, isSunk);
  });
  socket.on("isWin", (room) => {
    socket.emit("gameResult", false);
    socket.to(room).emit("gameResult", true);
  });
});
