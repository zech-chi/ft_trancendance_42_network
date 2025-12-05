import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function routesAuth(fastify: FastifyInstance) {
    const db = fastify.db;
    fastify.get('/test', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            return { hello: '/api/auth/test work' };
        } catch (error) {
            return reply.code(400).send({ message: 'Error in test route', error });
        }
    });
    
    // function to find user by email
    fastify.post('/findUserByEmail', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email } = request.body as { email: string }
            const stmt = db.prepare('SELECT * FROM Users WHERE email = ?');
            const user = stmt.get(email);
            return user || null;
        } catch(error) {
            return reply.code(400).send({ message: 'Error finding user by email', error });
        }
    });

    // find user if exists by userName or email
    fastify.post('/findUserByEmailOrUserName',  async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email, userName } = request.body as { email: string, userName: string };
            const stmt = db.prepare('SELECT * FROM Users WHERE email = ? OR userName = ?');
            const user = stmt.get(email, userName);
            return user || null;
        } catch(error) {    
            return reply.code(400).send({ message: 'Error finding user by email or userName', error });
        }
    });

    fastify.post('/createUser', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { fullName, userName, email, password, imageUrl } = request.body as { fullName: string, userName: string, email: string, password: string, imageUrl: string};
            const stmt = db.prepare('INSERT INTO Users (fullName, userName, email, password, imageUrl) VALUES (?, ?, ?, ?, ?)');
            const info = stmt.run(fullName, userName, email, password, imageUrl);
            return { id: info.lastInsertRowid, fullName, userName, email };
        } catch (error) {
            return reply.code(400).send({ message: 'Error creating user', error });
        }
    });

    fastify.post('/addNewRadarDataRow', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.body as { userId: number };
            const stmt = db.prepare('INSERT INTO RadarData (userId) VALUES (?)');
            const info = stmt.run(userId);
            return info.lastInsertRowid;    
        } catch (error) {
            return reply.code(400).send({ message: 'Error adding new radar data row', error });
        }
    });

    fastify.post('/addNewChartsDataRows', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.body as { userId: number };
            const stmt = db.prepare(`
                INSERT INTO ChartsData (userId, game)
                VALUES (?, 'parcheesi'), (?, 'pong')
            `);
            const info = stmt.run(userId, userId);
            return info.lastInsertRowid;
        } catch (error) {
            return reply.code(400).send({ message: 'Error adding new charts data rows', error });
        }
    });

    fastify.post('/deleteUserById', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.body as { userId: number };
            const stmt = db.prepare('DELETE FROM Users WHERE id = ?');
            const info = stmt.run(userId);
            return { deleted: info.changes };
        } catch (error) {
            return reply.code(400).send({ message: 'Error deleting user by id', error });
        }
    });



     // add by youssef
    fastify.post('/saveVerificationCode', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { userId, code, expiresAt } = request.body as { userId: number, code: string, expiresAt: string };
                const stmt = db.prepare('INSERT INTO EmailVerifications (userId, verificationCode, expiresAt) VALUES (?, ?, ?)');
                const info = stmt.run(userId, code, expiresAt);
                return { id: info.lastInsertRowid };
            } catch (error) {
                return reply.code(400).send({ message: 'Error saving verification code', error });
            }
    });

    fastify.post('/getVerificationCode', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.body as { userId: number };
            const stmt = db.prepare('SELECT * FROM EmailVerifications WHERE userId = ? ORDER BY id DESC LIMIT 1');
            const row = stmt.get(userId);
            return row || null;
        } catch (error) {
            return reply.code(400).send({ message: 'Error getting verification code', error });
        }
    });

    fastify.put("/updateVerificationCode", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId, code, expiresAt } = request.body as { userId: number; code: string; expiresAt: string };
            if (!userId || !code || !expiresAt) {
                return reply.code(400).send({ message: "Missing required fields" });
            }
            const stmt = db.prepare("UPDATE EmailVerifications SET verificationCode = ?, expiresAt = ? WHERE userId = ?");
            const info = stmt.run(code, expiresAt, userId);
            return { updated: info.changes };
        } catch (error) {
            return reply.code(400).send({ message: "Error updating verification code", error });
        }
    });

    fastify.post('/verifyUserEmail', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            // have to check if email is already verified or not before calling this
            const { userId } = request.body as { userId: number };
            const stmt = db.prepare('SELECT email_verified FROM Users WHERE id = ?');
            const user = stmt.get(userId) as { email_verified: boolean };
            if (!user) return reply.code(404).send({ message: "User not found" });
            if (user.email_verified) return reply.code(400).send({ message: "Email already verified" });
            const updateStmt = db.prepare('UPDATE Users SET email_verified = 1 WHERE id = ?');
            updateStmt.run(userId);
            // also mark the verification code as used or delete it
            const deleteStmt = db.prepare('DELETE FROM EmailVerifications WHERE userId = ?');
            deleteStmt.run(userId);
            return { message: "Email verified" };
        } catch (error) {
            return reply.code(400).send({ message: 'Error verifying user email', error });
        }
    });

    fastify.post('/findUserById', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.body as { userId: number };
            const stmt = db.prepare('SELECT * FROM Users WHERE id = ?');
            const user = stmt.get(userId);
            return user || null;
        } catch(error) {
            return reply.code(400).send({ message: 'Error finding user by id', error });
        }
    });

    fastify.post('/twoFASetup', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId, twofa_secret } = request.body as { userId: number, twofa_secret: string };
            if (!twofa_secret) {
                return reply.code(400).send({ message: "twofa_secret is required" });
            }
            if (!userId) {
                return reply.code(400).send({ message: "userId is required" });
            }
            const stmt = db.prepare('UPDATE Users SET twofa_secret = ? WHERE id = ?');
            const info = stmt.run(twofa_secret, userId);
            return { updated: info.changes };
        } catch (error) {
            return reply.code(400).send({ message: 'Error setting up 2FA', error } );
        }
    });

    fastify.post('/twoFAEnable', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.body as { userId: number };
            const stmt = db.prepare('UPDATE Users SET twofa_enabled = 1 WHERE id = ?');
            const info = stmt.run(userId);
            return { updated: info.changes };
        } catch (error) {
            return reply.code(400).send({ message: 'Error enabling 2FA', error } );
        }
    });

    fastify.post('/twoFADisable', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.body as { userId: number };
            const stmt = db.prepare('UPDATE Users SET twofa_enabled = 0, twofa_secret = NULL WHERE id = ?');
            const info = stmt.run(userId);
            return { updated: info.changes };
        } catch (error) {
            return reply.code(400).send({ message: 'Error disabling 2FA', error } );
        }
    });
}