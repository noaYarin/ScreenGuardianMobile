import { Server } from "socket.io";
import { REQUEST_CHILD_LOCATION, REQUEST_REFRESH_FROM_PARENT, LOCATION_LIVE_UPDATE } from "./constants/socketEvents.js";

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
      if (!userId) return;
      socket.join(String(userId));
      console.log(`User ${userId} joined room`);
    });

    socket.on(REQUEST_REFRESH_FROM_PARENT, (data) => {
      console.log(`Parent ${data.parentId} requesting location from ${data.childId}`);
      io.to(String(data.childId)).emit(REQUEST_CHILD_LOCATION, { parentId: data.parentId });
    });
  
    socket.on(REQUEST_CHILD_LOCATION, (data) => {
      const { parentId, location, childId, lastUpdated } = data;
      
      console.log(`Child ${childId} sent location directly to parent ${parentId}`);
      
      io.to(String(parentId)).emit(LOCATION_LIVE_UPDATE, {
        childId,
        location,
        lastUpdated
      });
    });
  });

  return io;
}