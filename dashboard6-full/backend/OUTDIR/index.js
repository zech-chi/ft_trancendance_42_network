"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const users_1 = require("./Data/users");
const cors_1 = __importDefault(require("@fastify/cors"));
const getUserOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        userName: { type: 'string' },
                    },
                }
            }
        }
    }
};
const getUserOpt = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    fullName: { type: 'string' },
                    userName: { type: 'string' },
                    bio: { type: 'string' },
                    imageUrl: { type: 'string' },
                    rank: { type: 'number' },
                    level: { type: 'number' },
                    progress: { type: 'number' },
                    online: { type: 'boolean' },
                },
            }
        }
    }
};
async function setupServer() {
    const app = (0, fastify_1.default)({
        logger: true,
        ignoreTrailingSlash: true,
    });
    await app.register(cors_1.default, {
        origin: '*',
    });
    app.get('/users', getUserOpts, async (request, reply) => {
        reply.send(users_1.Users);
    });
    app.get('/users/:userName', getUserOpt, async (request, reply) => {
        const { userName } = request.params;
        const user = users_1.Users.find((user) => user.userName === userName); // Convert id to number
        if (!user) {
            reply.code(404).send({ error: 'user not found' });
        }
        else {
            reply.send(user);
        }
    });
    // get Dashboard data
    app.get('/daysData/:userName', async (request, reply) => {
        const { userName } = request.params;
        const user = users_1.Users.find((user) => user.userName === userName); // Convert id to number
        if (!user) {
            reply.code(404).send({ error: 'user not found' });
        }
        else {
            const daysData = users_1.daysDataMap[user.id];
            if (daysData)
                reply.send(user);
            else
                reply.code(404).send({ error: 'daysData not found' });
        }
    });
    app.listen({ port: 5000 }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`Server listening on ${address}`);
    });
}
setupServer();
