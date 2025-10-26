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



  // add by youssef
  fastify.post('/saveVerificationCode', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId, code, expiresAt } = request.body as { userId: number, code: string, expiresAt: string };
        const stmt = db.prepare('INSERT INTO EmailVerifications (userId, verificationCode, expiresAt) VALUES (?, ?, ?)');
        const info = stmt.run(userId, code, expiresAt);
        return { id: info.lastInsertRowid };
    });

    fastify.post('/getVerificationCode', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request.body as { userId: number };
        const stmt = db.prepare('SELECT * FROM EmailVerifications WHERE userId = ? ORDER BY id DESC LIMIT 1');
        const row = stmt.get(userId);
        return row || null;
    });
    fastify.post('/verifyUserEmail', async (request: FastifyRequest, reply: FastifyReply) => {
        // have to check if email is already verified or not before calling this
        const { userId } = request.body as { userId: number };
        const stmt = db.prepare('SELECT email_verified FROM Users WHERE id = ?');
        const user = stmt.get(userId);
        if (!user) return reply.code(404).send({ message: "User not found" });
        if (user.email_verified) return reply.code(400).send({ message: "Email already verified" });
        const updateStmt = db.prepare('UPDATE Users SET email_verified = 1 WHERE id = ?');
        updateStmt.run(userId);
        return { message: "Email verified" };
    });
}