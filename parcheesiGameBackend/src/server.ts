import {FastifyServer} from './app';
import { Server } from 'socket.io';
import { SocketManager } from './socket';
import chalk from 'chalk';
import readLine from 'readline';

// create http server instance using Fastify
const server = new FastifyServer();


// start the server
server.start().then(() => {
    // add socket.io support 
    const io = new Server(server.getInstance().server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    // create socket manager instance
    const socketManager = new SocketManager(io);

    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // prompt for user input
    rl.on('line', (input: string) => {
        console.log(`📤 Broadcasting message: ${input}`);
        io.emit('command', {
            message: input,
            time: new Date().toISOString(),
        });
    });

    console.log(chalk.green('Server started successfully'));
}).catch((error) => {
    console.error(chalk.red('Error starting server:', error));
    process.exit(1);
});

