"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const users_1 = require("./Data/users");
const sqlite3_1 = __importDefault(require("sqlite3"));
const cors_1 = __importDefault(require("@fastify/cors"));
const db = new sqlite3_1.default.Database('Database/DataBase.db', (err) => {
    if (err) {
        console.log("❌ Error opening database: ", err);
    }
    else {
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
function dbGetAsync(sqlQuery, params) {
    return new Promise((resolve, reject) => {
        db.get(sqlQuery, params, (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
}
async function getUser(userName) {
    try {
        const row = await dbGetAsync('SELECT * FROM Users WHERE userName = ?', [userName]);
        if (!row)
            return null;
        return row;
    }
    catch (err) {
        throw err;
    }
}
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
        // db.get(
        //   `SELECT * FROM Users WHERE userName = ?`, [userName],
        //   (err, row) => {
        //       if (err)
        //           return reply.code(500).send({ error: '❌ Error running query' });
        //       if (row)
        //           return reply.send(row);
        //       return reply.code(404).send({ error: 'user not found' });
        //   }
        // )
        try {
            const user = await getUser(userName);
            if (!user)
                reply.code(404).send({ error: 'user not found' });
            return reply.send(user);
        }
        catch (err) {
            return reply.code(500).send({ error: '❌ Error running query' });
        }
    });
    // get Dashboard
    app.get('/daysData/:userName', async (request, reply) => {
        const { userName } = request.params;
        const user = users_1.Users.find((user) => user.userName === userName);
        if (!user) {
            reply.code(404).send({ error: 'user not found' });
        }
        else {
            const daysData = users_1.daysDataMap[user.id];
            if (daysData)
                reply.send(daysData);
            else
                reply.code(404).send({ error: 'daysData not found' });
        }
    });
    // get chartData
    app.get('/chartsData/:userName', async (request, reply) => {
        const { userName } = request.params;
        const user = users_1.Users.find((user) => user.userName === userName);
        if (!user) {
            reply.code(404).send({ error: 'user not found' });
        }
        else {
            const chartsData = users_1.chartsDataMap[user.id];
            if (chartsData)
                reply.send(chartsData);
            else
                reply.code(404).send({ error: 'chartsData not found' });
        }
    });
    // get radarData
    app.get('/radarData/:userName', async (request, reply) => {
        const { userName } = request.params;
        const user = users_1.Users.find((user) => user.userName === userName);
        if (!user) {
            reply.code(404).send({ error: 'user not found' });
        }
        else {
            const radarData = users_1.radarDataMap[user.id];
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
