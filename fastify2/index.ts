import Fastify, { FastifyInstance } from 'fastify';
import { cars, Car } from './cars';

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


const app: FastifyInstance = Fastify({
  logger: true,
});

app.get('/', getCarOpts, async (request, reply) => {
  reply.send(cars);
});

// Define the shape of params for this route
interface CarParams {
  id: string; // Comes as string from URL params
}

app.get<{ Params: CarParams }>('/:id', getCarOpt, async (request, reply) => {
  const { id } = request.params;
  const car = cars.find((car) => car.id === parseInt(id)); // Convert id to number
  if (!car) {
    reply.code(404).send({ error: 'Car not found' });
  } else {
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
