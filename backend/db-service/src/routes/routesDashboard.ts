import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";


export default async function routesDashboard(fastify: FastifyInstance) {
    const db = fastify.db;
    fastify.get('/hello1', async (request: FastifyRequest, reply: FastifyReply) => {
        return { hello: 'world' };
    });

    fastify.get('/hello2', async (request: FastifyRequest, reply: FastifyReply) => {
        const stmt = db.prepare("SELECT * from users");
        const users = stmt.all();
        console.log(users);
        return { status: "ok", message: "Hello from DB service!" , users: users};
    });
}