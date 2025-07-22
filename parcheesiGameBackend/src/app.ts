import Fastify, { FastifyInstance } from 'fastify';
import chalk from 'chalk';

export class FastifyServer {
    private app: FastifyInstance;

    constructor() {
        this.app = Fastify({
            logger: true,
            ignoreTrailingSlash: true,
        });

        this.registerRoutes();
    }
    
    private registerRoutes(): void {
        this.app.get('/', async (request, reply) => {
            return { message: 'Welcome to the Parcheesi Game Backend!' };
        });
    };

    public async start(port: number = 5555) {
        try {
            await this.app.listen({port});
            console.log(chalk.green(`Server is running on http://localhost:${port}`));
        } catch (error) {
            this.app.log.error(chalk.red(error));
            process.exit(1);
        }
    }

    public getInstance(): FastifyInstance {
        return this.app;
    } 
}
