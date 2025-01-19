// server/src/app.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { coinbaseProService } from "./services/coinbaseProService";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("subscribe", (productId) => {
    coinbaseProService.subscribe(productId, socket);
  });

  socket.on("unsubscribe", (productId) => {
    coinbaseProService.unsubscribe(productId, socket);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

export { server, io };
