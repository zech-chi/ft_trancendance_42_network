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
        const [rawCommand, ...rest] = input.split('>');
        const command = rawCommand.trim();
        const instructions = rest.join('>').trim();
        
        console.log(command);
        console.log(instructions);
        
        if (!command) {
            console.log(chalk.red('❗ Command cannot be empty'));
            return;
        }
        
        try {
            const parsedMessage = JSON.parse(instructions); // Parse the JSON string
            console.log(`📤 Broadcasting command: ${command}`, parsedMessage);
            io.emit(command, parsedMessage);
        } catch (e) {
            console.log(chalk.red('❌ Invalid JSON:', instructions));
        }
    });

    console.log(chalk.green('Server started successfully'));
}).catch((error) => {
    console.error(chalk.red('Error starting server:', error));
    process.exit(1);
});

