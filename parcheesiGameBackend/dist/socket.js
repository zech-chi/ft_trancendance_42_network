"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const chalk_1 = __importDefault(require("chalk"));
class SocketManager {
    constructor(io) {
        this.connectedSockets = new Set();
        this.io = io;
        this.registerEvents();
        this.displayConnectedSockets();
    }
    ;
    registerEvents() {
        // Handle connection event
        this.io.on('connection', (socket) => {
            console.log(chalk_1.default.green(`New client connected socket: ${socket.id}`));
            // Emit a welcome message to the newly connected client
            socket.emit("welcome", {
                message: "Hello from server!",
                id: socket.id,
                time: new Date().toISOString(),
            });
            this.connectedSockets.add(socket);
            // Handle disconnection event
            socket.on('disconnect', () => {
                console.log(chalk_1.default.red(`Client disconnected socket: ${socket.id}`));
                this.connectedSockets.delete(socket);
            });
        });
    }
    displayConnectedSockets() {
        setInterval(() => {
            console.clear();
            console.log(chalk_1.default.yellow('Connected sockets:'));
            console.log(chalk_1.default.blue(this.connectedSockets.size));
            console.log(chalk_1.default.blue(`Connected sockets: ${Array.from(this.connectedSockets).map(s => s.id).join(', ')}`));
        }, 100000);
    }
    ;
}
exports.SocketManager = SocketManager;
