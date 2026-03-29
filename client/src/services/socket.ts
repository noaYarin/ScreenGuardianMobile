import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "../config/env";

let socket: Socket | null = null;
export const connectSocket = (userId: string) => {
    if (!socket) {
      console.log("Creating Singleton Socket...");
      socket = io(API_BASE_URL);
    }
  
    if (socket.connected) {
      socket.emit("join", userId);
    } else {
        // Child is joining the socket or reconnecting
      socket.once("connect", () => {
        socket?.emit("join", userId);
      });
    }
  
    return socket;
  };


// Emit events to the server
export const emitEvent = (event: string, data: any) => {
    if (socket && socket.connected) {
        socket.emit(event, data);
    } else {
        console.warn(`Socket not connected. Could not emit: ${event}`);
    }
};


// Listen to events from the server
export const onEvent = (event: string, handler: (...args: any[]) => void) => {
    socket?.on(event, handler);
    // Return a function to clean up the event listener
    return () => socket?.off(event, handler);
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};