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

async function getRadarData(userName: string) {
  try {
    const row = await dbGetAsync(`
      SELECT
        quick_reflexes,
        strategic_thinking,
        precision_shots,
        pattern_recognition,
        anticipating_moves,
        board_control,
        adaptive_playstyle,
        risk_management,
        mind_games
      FROM
        Users
      JOIN
        RadarData ON Users.id = RadarData.userId
      WHERE
        Users.userName = ?;
    `, [userName]);
    if (!row)
      return null;
    return row;
  } catch (err) {
    throw err;
  }
}

async function getChartsData(userName: string, game: string) {
  try {
    const row = await dbGetAsync(
      `
        SELECT
          totalGamesWithAi ,
          gamesWithAiEasy  ,
          gamesWithAiMedium,
          gamesWithAiHard  ,
          totalWins        ,
          easyWins         ,
          mediumWins       ,
          hardWins         ,
          friendsWins      ,
          friendsLosses    ,
          friendsTotalGames
        FROM
          Users
        JOIN 
          ChartsData ON Users.id = ChartsData.userId
        WHERE
          Users.userName = ? AND ChartsData.game = ? ;
      `, [userName, game]);
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

    // get all users info
    app.get('/users', getUserOpts, async (request, reply) => {
      reply.send(Users);
    });

    // get user info
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

    // get radar data info for a user
    app.get<{ Params: UserParams }>('/radarData/:userName', async (request, reply) => {
      const { userName } = request.params;
      try {
        const radarData = await getRadarData(userName);
        if (!radarData)
          reply.code(404).send({ error: 'radarData not found' });
        return reply.send(radarData);
      } catch (err) {
        return reply.code(500).send({ error: '❌ Error running query' });
      }
    });

    // get chartData info for a user
    app.get<{ Params: UserParams }>('/chartsData/:userName', async (request, reply) => {
      const { userName } = request.params;
      try {
        const chartsDataPong = await getChartsData(userName, 'pong');
        const chartsDataParchesi = await getChartsData(userName, 'parchesi');
        if (!chartsDataPong || !chartsDataParchesi)
          reply.code(404).send({ error: 'chartsData not found' });
        const chartsData = {
          pong: chartsDataPong,
          parchesi: chartsDataParchesi
        }
        return reply.send(chartsData);
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

    // // get chartData
    // app.get<{ Params: UserParams }>('/chartsData/:userName', async (request, reply) => {
    //   const { userName } = request.params;
    //   const user = Users.find((user) => user.userName === userName); 
    //   if (!user) {
    //     reply.code(404).send({ error: 'user not found' });
    //   } else {
    //     const chartsData = chartsDataMap[user.id];
    //     if (chartsData)
    //       reply.send(chartsData);
    //     else
    //       reply.code(404).send({ error: 'chartsData not found' });
    //   }  
    // });

    // get radarData
    // app.get<{ Params: UserParams }>('/radarData/:userName', async (request, reply) => {
    //   const { userName } = request.params;
    //   const user = Users.find((user) => user.userName === userName); 
    //   if (!user) {
    //     reply.code(404).send({ error: 'user not found' });
    //   } else {
    //     const radarData = radarDataMap[user.id];
    //     if (radarData)
    //       reply.send(radarData);
    //     else
    //       reply.code(404).send({ error: 'radarData not found' });
    //   }  
    // });

    
    app.listen({ port: 5000 }, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }  
      app.log.info(`Server listening on ${address}`);
    });  
}  


setupServer();
