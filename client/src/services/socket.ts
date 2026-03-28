import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "../config/env";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
    if (!socket) {
        socket = io(API_BASE_URL);
        
        socket?.on("connect", () => {
            socket?.emit("join", userId);
        });
    }
    return socket;
};

export const onEvent = (event: string, handler: (...args: any[]) => void) => {
    socket?.on(event, handler);
    // Return a function to clean up the event listener
    return () => socket?.off(event, handler);
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};