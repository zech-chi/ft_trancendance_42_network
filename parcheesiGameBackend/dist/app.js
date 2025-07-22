"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastifyServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
const chalk_1 = __importDefault(require("chalk"));
class FastifyServer {
    constructor() {
        this.app = (0, fastify_1.default)({
            logger: true,
            ignoreTrailingSlash: true,
        });
        this.registerRoutes();
    }
    registerRoutes() {
        this.app.get('/', async (request, reply) => {
            return { message: 'Welcome to the Parcheesi Game Backend!' };
        });
    }
    ;
    async start(port = 5555) {
        try {
            this.app.listen({ port });
            console.log(chalk_1.default.green(`Server is running on http://localhost:${port}`));
        }
        catch (error) {
            this.app.log.error(chalk_1.default.red(error));
            process.exit(1);
        }
    }
    getInstance() {
        return this.app;
    }
}
exports.FastifyServer = FastifyServer;
