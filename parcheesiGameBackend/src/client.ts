import { io } from "socket.io-client";

const socket = io("http://localhost:5555");

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

// Receive welcome message
socket.on("welcome", (data) => {
  console.log("💬 Server says:", data.message);
});
