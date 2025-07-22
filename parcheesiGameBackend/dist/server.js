"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket");
const chalk_1 = __importDefault(require("chalk"));
// create http server instance using Fastify
const server = new app_1.FastifyServer();
// add socket.io support 
const io = new socket_io_1.Server(server.getInstance().server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
// create socket manager instance
const socketManager = new socket_1.SocketManager(io);
// start the server
server.start().then(() => {
    console.log(chalk_1.default.green('Server started successfully'));
}).catch((error) => {
    console.error(chalk_1.default.red('Error starting server:', error));
    process.exit(1);
});
