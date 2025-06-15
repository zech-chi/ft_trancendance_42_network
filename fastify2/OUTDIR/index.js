"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cars_1 = require("./cars");
const getCarOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' }
                    },
                    required: ['id', 'name']
                }
            }
        }
    }
};
const getCarOpt = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    model: { type: 'string' },
                    color: { type: 'string' },
                },
                required: ['id', 'name', 'model', 'color', 'maxSpeed', 'acceleration']
            }
        }
    }
};
const app = (0, fastify_1.default)({
    logger: true,
});
app.get('/', getCarOpts, async (request, reply) => {
    reply.send(cars_1.cars);
});
app.get('/:id', getCarOpt, async (request, reply) => {
    const { id } = request.params;
    const car = cars_1.cars.find((car) => car.id === parseInt(id)); // Convert id to number
    if (!car) {
        reply.code(404).send({ error: 'Car not found' });
    }
    else {
        reply.send(car);
    }
});
app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server listening on ${address}`);
});
