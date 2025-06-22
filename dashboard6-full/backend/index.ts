import Fastify, { FastifyInstance } from 'fastify';
import { Users, daysDataMap } from './Data/users';

import cors from '@fastify/cors';


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

// Define the shape of params for this route
interface UserParams {
  userName: string; // Comes as string from URL params
}


async function setupServer() {
    const app: FastifyInstance = Fastify({
      logger: true,
      ignoreTrailingSlash: true,
    });
    
    await app.register(cors, {
      origin: '*',
    });

    app.get('/users', getUserOpts, async (request, reply) => {
      reply.send(Users);
    });

    app.get<{ Params: UserParams }>('/users/:userName', getUserOpt, async (request, reply) => {
      const { userName } = request.params;
      const user = Users.find((user) => user.userName === userName); // Convert id to number
      if (!user) {
        reply.code(404).send({ error: 'user not found' });
      } else {
        reply.send(user);
      }  
    });

    // get Dashboard data
    app.get<{ Params: UserParams }>('/daysData/:userName', async (request, reply) => {
      const { userName } = request.params;
      const user = Users.find((user) => user.userName === userName); // Convert id to number
      if (!user) {
        reply.code(404).send({ error: 'user not found' });
      } else {
        const daysData = daysDataMap[user.id];
        if (daysData)
          reply.send(daysData);
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
