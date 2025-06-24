import Fastify, { FastifyInstance } from 'fastify';
import { Users, daysDataMap, chartsDataMap, radarDataMap } from './Data/users';
import sqlite3 from "sqlite3";

import cors from '@fastify/cors';

const db = new sqlite3.Database('Database/DataBase.db', (err) => {
    if (err) {
        console.log("❌ Error opening database: ", err);
    } else {
        console.log("✅ Connected to DataBase.db");
    }
});

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

function dbGetAsync(sqlQuery: string, params: any[]) : Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sqlQuery, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    })
  });
}


async function getUser(userName: string) {
  try {
    const row = await dbGetAsync('SELECT * FROM Users WHERE userName = ?', [userName]);
    if (!row)
      return null;
    return row;
  } catch (err) {
    throw err;
  }
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
      try {
        const user = await getUser(userName);
        if (!user)
          reply.code(404).send({ error: 'user not found' });
        return reply.send(user);
      } catch (err) {
        return reply.code(500).send({ error: '❌ Error running query' });
      }
    });

    // get Dashboard
    app.get<{ Params: UserParams }>('/daysData/:userName', async (request, reply) => {
      const { userName } = request.params;
      const user = Users.find((user) => user.userName === userName);
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

    // get chartData
    app.get<{ Params: UserParams }>('/chartsData/:userName', async (request, reply) => {
      const { userName } = request.params;
      const user = Users.find((user) => user.userName === userName); 
      if (!user) {
        reply.code(404).send({ error: 'user not found' });
      } else {
        const chartsData = chartsDataMap[user.id];
        if (chartsData)
          reply.send(chartsData);
        else
          reply.code(404).send({ error: 'chartsData not found' });
      }  
    });

    // get radarData
    app.get<{ Params: UserParams }>('/radarData/:userName', async (request, reply) => {
      const { userName } = request.params;
      const user = Users.find((user) => user.userName === userName); 
      if (!user) {
        reply.code(404).send({ error: 'user not found' });
      } else {
        const radarData = radarDataMap[user.id];
        if (radarData)
          reply.send(radarData);
        else
          reply.code(404).send({ error: 'radarData not found' });
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
