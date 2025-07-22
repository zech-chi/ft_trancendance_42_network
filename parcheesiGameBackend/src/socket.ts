import {Server, Socket} from 'socket.io';
import chalk from 'chalk';

export class SocketManager {
    private io: Server;
    public connectedSockets : Set<Socket> = new Set();

    constructor(io: Server) {
        this.io = io;
        this.registerEvents();
        this.displayConnectedSockets();
    };

    private registerEvents(): void {
        // Handle connection event
        this.io.on('connection', (socket: Socket) => {
            console.log(chalk.green(`New client connected socket: ${socket.id}`));
            // Emit a welcome message to the newly connected client
            socket.emit("welcome", {
                message: "Hello from server!",
                id: socket.id,
                time: new Date().toISOString(),
            });

            this.connectedSockets.add(socket);
            // Handle disconnection event
            socket.on('disconnect', () => {
                console.log(chalk.red(`Client disconnected socket: ${socket.id}`));
                this.connectedSockets.delete(socket);
            });
        });
    }

    private displayConnectedSockets(): void {
        setInterval(() => {
            console.clear();
            console.log(chalk.yellow('Connected sockets:'));
            console.log(chalk.blue(this.connectedSockets.size));
            console.log(chalk.blue(`Connected sockets: ${Array.from(this.connectedSockets).map(s => s.id).join(', ')}`));
        }
        , 100000);
    };
}