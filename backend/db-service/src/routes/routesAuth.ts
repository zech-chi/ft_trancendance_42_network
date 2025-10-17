import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function routesAuth(fastify: FastifyInstance) {
    const db = fastify.db;
    fastify.get('/test', async (request: FastifyRequest, reply: FastifyReply) => {
        return { hello: '/api/auth/test work' };
    });
    
    // function to find user by email
    fastify.post('/findUserByEmail', async (request: FastifyRequest, reply: FastifyReply) => {
        const { email } = request.body as { email: string }
        const stmt = db.prepare('SELECT * FROM Users WHERE email = ?');
        const user = stmt.get(email);
        return user || null;
    });

    // find user if exists by userName or email
    fastify.post('/findUserByEmailOrUserName',  async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, userName } = request.body as { email: string, userName: string };
        const stmt = db.prepare('SELECT * FROM Users WHERE email = ? OR userName = ?');
        const user = stmt.get(email, userName);
        return user || null;
    });

    fastify.post('/createUser', async (request: FastifyRequest, reply: FastifyReply) => {
        const { fullName, userName, email, password, imageUrl } = request.body as { fullName: string, userName: string, email: string, password: string, imageUrl: string};
        const stmt = db.prepare('INSERT INTO Users (fullName, userName, email, password, imageUrl) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(fullName, userName, email, password, imageUrl);
        return { id: info.lastInsertRowid, fullName, userName, email };
    });

    fastify.post('/addNewRadarDataRow', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request.body as { userId: number };
        const stmt = db.prepare('INSERT INTO RadarData (userId) VALUES (?)');
        const info = stmt.run(userId);
        return info.lastInsertRowid;
    });

    fastify.post('/addNewChartsDataRows', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request.body as { userId: number };
        const stmt = db.prepare(`
            INSERT INTO ChartsData (userId, game)
            VALUES (?, 'parcheesi'), (?, 'pong')
        `);
        const info = stmt.run(userId, userId);
        return info.lastInsertRowid;
    });

    fastify.post('/deleteUserById', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request.body as { userId: number };
        const stmt = db.prepare('DELETE FROM Users WHERE id = ?');
        const info = stmt.run(userId);
        return { deleted: info.changes };
    });
}