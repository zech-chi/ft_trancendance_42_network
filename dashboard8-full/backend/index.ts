import Fastify, { FastifyInstance } from 'fastify';
import { Users } from './Database/users';
import sqlite3 from "sqlite3";


// games 
type GameType = 'pong' | 'parchesi';

type Game = {
  id: number;
  user1: string; // user.id
  user2: string; // user.id
  user1_score: number;
  user2_score: number;
  user1_win: boolean;
  date_played: string; // ISO string
  game_type: GameType;
};

export const Games = [
  { id: 1,  user1: 'user1',    user2: 'user2',    user1_score: 5, user2_score: 3, user1_win: true,  date_played: '2025-07-01T10:00:00Z', game_type: 'pong' },
  { id: 2,  user1: 'user3',    user2: 'user4',    user1_score: 2, user2_score: 6, user1_win: false, date_played: '2025-07-01T11:00:00Z', game_type: 'parchesi' },
  { id: 3,  user1: 'user5',    user2: 'user6',    user1_score: 7, user2_score: 7, user1_win: true,  date_played: '2025-07-01T12:00:00Z', game_type: 'pong' },
  { id: 4,  user1: 'user7',    user2: 'user8',    user1_score: 4, user2_score: 2, user1_win: true,  date_played: '2025-07-02T10:00:00Z', game_type: 'parchesi' },
  { id: 5,  user1: 'user9',    user2: 'user10',   user1_score: 3, user2_score: 5, user1_win: false, date_played: '2025-07-02T11:00:00Z', game_type: 'pong' },
  { id: 6,  user1: 'user11',   user2: 'user12',   user1_score: 1, user2_score: 1, user1_win: true,  date_played: '2025-07-02T12:00:00Z', game_type: 'parchesi' },
  { id: 7,  user1: 'user13',   user2: 'user14',   user1_score: 9, user2_score: 8, user1_win: true,  date_played: '2025-07-03T10:00:00Z', game_type: 'pong' },
  { id: 8,  user1: 'user15',   user2: 'user1',    user1_score: 2, user2_score: 4, user1_win: false, date_played: '2025-07-03T11:00:00Z', game_type: 'parchesi' },
  { id: 9,  user1: 'user2',    user2: 'user3',    user1_score: 3, user2_score: 3, user1_win: true,  date_played: '2025-07-03T12:00:00Z', game_type: 'pong' },
  { id: 10, user1: 'user4',    user2: 'user5',    user1_score: 5, user2_score: 7, user1_win: false, date_played: '2025-07-04T10:00:00Z', game_type: 'pong' },
  { id: 11, user1: 'user6',    user2: 'user7',    user1_score: 6, user2_score: 5, user1_win: true,  date_played: '2025-07-04T11:00:00Z', game_type: 'parchesi' },
  { id: 12, user1: 'user8',    user2: 'user9',    user1_score: 2, user2_score: 2, user1_win: true,  date_played: '2025-07-04T12:00:00Z', game_type: 'pong' },
  { id: 13, user1: 'user10',   user2: 'user11',   user1_score: 8, user2_score: 4, user1_win: true,  date_played: '2025-07-05T10:00:00Z', game_type: 'parchesi' },
  { id: 14, user1: 'user12',   user2: 'user13',   user1_score: 6, user2_score: 9, user1_win: false, date_played: '2025-07-05T11:00:00Z', game_type: 'pong' },
  { id: 15, user1: 'user14',   user2: 'user15',   user1_score: 1, user2_score: 0, user1_win: true,  date_played: '2025-07-05T12:00:00Z', game_type: 'parchesi' },
  { id: 16, user1: 'hunterGon', user2: 'zech-chi', user1_score: 5, user2_score: 7, user1_win: false, date_played: '2025-07-06T10:00:00Z', game_type: 'pong' },
  { id: 17, user1: 'killzold', user2: 'saw',      user1_score: 4, user2_score: 4, user1_win: true,  date_played: '2025-07-06T11:00:00Z', game_type: 'parchesi' },
  { id: 18, user1: 'user1',    user2: 'user4',    user1_score: 6, user2_score: 1, user1_win: true,  date_played: '2025-07-06T12:00:00Z', game_type: 'pong' },
  { id: 19, user1: 'user6',    user2: 'user8',    user1_score: 7, user2_score: 7, user1_win: true,  date_played: '2025-07-07T10:00:00Z', game_type: 'parchesi' },
  { id: 20, user1: 'user10',   user2: 'user2',    user1_score: 9, user2_score: 6, user1_win: true,  date_played: '2025-07-07T11:00:00Z', game_type: 'pong' },
  { id: 21, user1: 'user3',    user2: 'user7',    user1_score: 2, user2_score: 2, user1_win: true,  date_played: '2025-07-07T12:00:00Z', game_type: 'parchesi' },
  { id: 22, user1: 'user5',    user2: 'user9',    user1_score: 0, user2_score: 3, user1_win: false, date_played: '2025-07-08T10:00:00Z', game_type: 'pong' },
  { id: 23, user1: 'user11',   user2: 'user13',   user1_score: 4, user2_score: 4, user1_win: true,  date_played: '2025-07-08T11:00:00Z', game_type: 'parchesi' },
  { id: 24, user1: 'user14',   user2: 'hunterGon', user1_score: 3, user2_score: 5, user1_win: false, date_played: '2025-07-08T12:00:00Z', game_type: 'pong' },
  { id: 25, user1: 'zech-chi', user2: 'user12',   user1_score: 5, user2_score: 5, user1_win: true,  date_played: '2025-07-09T10:00:00Z', game_type: 'parchesi' },
  { id: 26, user1: 'user6',    user2: 'killzold', user1_score: 8, user2_score: 6, user1_win: true,  date_played: '2025-07-09T11:00:00Z', game_type: 'pong' },
  { id: 27, user1: 'saw',      user2: 'user9',    user1_score: 2, user2_score: 2, user1_win: true,  date_played: '2025-07-09T12:00:00Z', game_type: 'parchesi' },
];

  



import cors from '@fastify/cors';
import { callbackify } from 'util';

type YearData = {
  totalGames: number;
  totalActiveDays: number;
  maxStreak: number;
  DaysData: { [key: string]: number };
}

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

const getUserRankOpts = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
            userName: { type: 'string' },
            imageUrl: { type: 'string' },
            rank: { type: 'number' },
            level: { type: 'number' },
            progress: { type: 'number' },
            online: { type: 'boolean' },
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


async function getGames(userName: string, gameType: string) {
  try {
    const rows = await dbGetAsyncAll('SELECT * FROM Games WHERE (user1 = ? OR user2 = ?) AND game_type = ? ORDER BY date_played DESC;', [userName, userName, gameType]);
    return rows;
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


function dbGetAsyncAll(sqlQuery: string, params: any[]) : Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(sqlQuery, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    })
  });
}


function dbGetAllUsers() : Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Users`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    })
  });
} 

async function getUsers() {
  try {
    const rows = await dbGetAllUsers();
    if (!rows)
      return null;
    return rows;
  } catch (err) {
    throw err;
  }
}


async function dbGetDailyActivity (yearlyStatsId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      db.all(
        `
            SELECT day, activity
            FROM DailyActivity
            WHERE yearlyStatsId = ? ;
        `, [yearlyStatsId], (err, rows) => {
            if (err) return (reject(err));
            return resolve(rows);
      })
    });
}

async function getDailyActivityData(userName: string) {
  try {
    const data: { [year: number]: {
      totalGames: number,
      totalActiveDays: number,
      maxStreak: number,
      DaysData: { [day: number]: number }
    }} = {};

    const rows = await dbGetAsyncAll(
      `SELECT YearlyStats.id, year, totalGames, totalActiveDays, maxStreak FROM Users JOIN YearlyStats ON Users.id == YearlyStats.userId WHERE Users.userName = ?;`,
      [userName]
    )

    if (!rows)
        return null;

    for (const elem of rows) {
        data[Number(elem.year)] = {
            totalGames: elem.totalGames,
            totalActiveDays: elem.totalActiveDays,
            maxStreak: elem.maxStreak,
            DaysData: {}
        }

        //   console.log(elem.id);
        const dailyActivityRows = await dbGetDailyActivity(Number(elem.id));
        // console.log(dailyActivityRows);
        dailyActivityRows.forEach(({day, activity} : { day: number, activity: number}) => {
            // console.log(day, activity);
            data[Number(elem.year)].DaysData[day] = activity;
        });
    };

    return data;
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
    // app.get('/users', getUserOpts, async (request, reply) => {
    //   reply.send(Users);
    // });

    app.get('/users', getUserOpts, async (request, reply) => {
      try {
        const users = await getUsers();
        return reply.send(users);

      } catch (err) {
        return reply.code(500).send({ error: '❌ Error running query' });
      }
    });

    app.get('/Games/:userName', async (request, reply) => {
      const { userName } = request.params as UserParams;
      const query = request.query as { gameType: string };
      const gameType = query.gameType;

      if (!userName || !gameType) {
        return reply.code(400).send({ error: 'Missing userName or gameType' });
      }
      
      try {
        const games = await getGames(userName, gameType);
        return reply.send(games);

      } catch (err) {
        return reply.code(500).send({ error: '❌ Error running query' });
      }
    });
    // app.get('/Games/:userName', async (request, reply) => {
    //   const { userName } = request.params as UserParams;
    //   const query = request.query as { gameType: string };
    //   const gameType = query.gameType;

    //   if (!userName || !gameType) {
    //     return reply.code(400).send({ error: 'Missing userName or gameType' });
    //   }

    //   let filteredGames = Games.filter(
    //     (game) =>
    //       game.user1 === userName || game.user2 === userName
    //   );
    
    //   console.log(filteredGames);
    //   if (gameType) {
    //     filteredGames = filteredGames.filter((game) => game.game_type === gameType);
    //   }
    //   console.log(gameType);
    //   if (filteredGames.length === 0) {
    //     return reply.code(404).send({ error: 'No games found for this user' });
    //   }
    //     return reply.send(filteredGames);
    // });

    app.get('/rank', getUserRankOpts, async (request, reply) => {
      try {
        const users = await getUsers();
        const sortedUsersByRank = users.sort((u1: { rank: number; }, u2: { rank: number; }) => u1.rank - u2.rank);
        return reply.send(sortedUsersByRank);

      } catch (err) {
        return reply.code(500).send({ error: '❌ Error running query' });
      }
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
      try {
        const DailyActivityData = await getDailyActivityData(userName);
        if (!DailyActivityData)
          reply.code(404).send({ error: 'chartsData not found' });
        return reply.send(DailyActivityData);
      } catch (err) {
        return reply.code(500).send({ error: '❌ Error running query' });
      }
    });

    // // get Dashboard
    // app.get<{ Params: UserParams }>('/daysData/:userName', async (request, reply) => {
    //   const { userName } = request.params;
    //   const user = Users.find((user) => user.userName === userName);
    //   if (!user) {
    //     reply.code(404).send({ error: 'user not found' });
    //   } else {
    //     const daysData = daysDataMap[user.id];
    //     if (daysData)
    //       reply.send(daysData);
    //     else
    //       reply.code(404).send({ error: 'daysData not found' });
    //   }  
    // });

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

function callback(err: Error): void {
  throw new Error('err' + err);
}

