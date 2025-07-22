"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)("http://localhost:5555");
socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});
// Receive welcome message
socket.on("welcome", (data) => {
    console.log("💬 Server says:", data.message);
});
