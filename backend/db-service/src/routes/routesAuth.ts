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
        return user;
    });
}