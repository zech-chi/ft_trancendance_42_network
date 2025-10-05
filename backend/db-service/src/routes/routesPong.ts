import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function routesPong(fastify: FastifyInstance){
    // get the db instance
    const db = fastify.db;

    // define a simple route to say hello from the pong service
    fastify.get('/pong', async (request: FastifyRequest, reply: FastifyReply) => {
        return { message: 'Hello from the Pong service!' };
    });

    // fetch friends list for a user
    fastify.get('/friends/:userId', async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
        const { userId } = request.params;
    try {
      const stmt = db.prepare(`
      SELECT u.id, u.fullName, u.userName, f.status
      FROM friends f
      JOIN users u
        ON (u.id = f.receiver_id AND f.sender_id = ?)
        OR (u.id = f.sender_id AND f.receiver_id = ?)
      WHERE f.status = 'accepted'
    `);
    //AND u.state = 'online'
      const friends = stmt.all(userId, userId);
      if (!friends) {
        reply.code(404);
        return { success: false, error: "The user has no friends" };
      }

      return {
        success: true,
        friends,
      };
    } catch (err) {
        console.error(err);
      reply.code(400);
      return { success: false, error: "something went wrong try again later!" };
    }
    });

    fastify.get("/user/:id", async (request, reply) => {
    const { id } = request.params as { id: number };
    if (!id) {
      reply.code(400);
      return { success: false, error: "User ID is required" };
    }

    try {
      const stmt = db.prepare("SELECT id, fullName, userName FROM users WHERE id = ?");
      const user = stmt.get(id) as any;

      if (!user) {
        reply.code(404);
        return { success: false, error: "User not found" };
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.fullName,
          username: user.userName,
        },
      };
    } catch (error) {
      reply.code(400);
      return { success: false, error: "something went wrong try again later!" };
    }
  });
}