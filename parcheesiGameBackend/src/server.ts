import {FastifyServer} from './app';
import { Server } from 'socket.io';
import { SocketManager } from './socket';
import chalk from 'chalk';

// create http server instance using Fastify
const server = new FastifyServer();


// add socket.io support 
const io = new Server(server.getInstance().server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// create socket manager instance
const socketManager = new SocketManager(io);

// start the server
server.start().then(() => {
    console.log(chalk.green('Server started successfully'));
}).catch((error) => {
    console.error(chalk.red('Error starting server:', error));
    process.exit(1);
});