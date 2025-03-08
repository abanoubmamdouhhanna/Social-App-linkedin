import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

const userSocketMap = new Map();

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

const sendMessage = async (message) => {
  try {
   
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap.set(userId, socket.id);
    console.log(`Mapped user ${userId} to socket ${socket.id}`);
  }

  socket.on("join", (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room: ${roomID}`);
  });

  socket.on("sendMessage", sendMessage);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`Removed user ${userId} from socket map`);
        break;
      }
    }
  });

  socket.on("error", (err) => {
    console.error(`⚠️ Socket.IO Error: ${err.message}`);
  });
});

export { io, app, server };
