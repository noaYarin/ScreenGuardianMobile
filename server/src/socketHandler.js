import { Server } from "socket.io";

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      if (userId == null || userId === "") return;
      socket.join(String(userId));
    });
  });

  return io;
}


export function emitNotification(targetId, event, data) {
  if (!io) return;
  io.to(String(targetId)).emit(event, data);
}
