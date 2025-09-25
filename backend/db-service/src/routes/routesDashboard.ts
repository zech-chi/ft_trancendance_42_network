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

    // fetch User by userName
    fastify.get('/users/:userName', async (request: FastifyRequest<{ Params: { userName: string } }>, reply: FastifyReply) => {
        const { userName } = request.params;
        const stmt = db.prepare("SELECT * FROM users WHERE userName = ?");
        const user = stmt.get(userName);
        if (!user) {
            reply.status(404).send({success: "ko", message: "User not found" }); 
            return null;
        }
        return user;
    });

    // fetch all users by search term limited by 7
    fastify.get('/search', async (request: FastifyRequest<{ Querystring: { prefix: string } }>, reply: FastifyReply) => {
        const { prefix } = request.query;
        const stmt = db.prepare("SELECT * FROM users WHERE userName LIKE ? ORDER BY userName ASC LIMIT 7");
        const users = stmt.all(`${prefix}%`);
        return { status: "ok", users: users };
    });


    // fetch radar stats for a user
    fastify.get('/radarData/:userName', async (request: FastifyRequest<{ Params: { userName: string } }>, reply: FastifyReply) => {
        const { userName } = request.params;
        const stmt = db.prepare(`
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
        `);
        const stats = stmt.get(userName);
        if (!stats) {
            reply.status(404).send({ success: "ko", message: "User not found" });
            return null;
        }
        return stats;
    });

    fastify.get('/friends/:userId', async (
    request: FastifyRequest<{ Params: { userId: string }; Querystring: { status: string } }>,
    reply: FastifyReply
  ) => {
    const { userId } = request.params;
    const { status } = request.query;

    console.log("request params: ", request.params);
    console.log("request query: ", request.query);

    let stmt;
    let params: any[] = [];

    if (status === 'accepted') {
      stmt = db.prepare(
        `SELECT * FROM Friends WHERE (sender_id = ? OR receiver_id = ?) AND status = ?;`
      );
      params = [userId, userId, status];
    } else if (status === 'pending') {
      stmt = db.prepare(
        `SELECT * FROM Friends WHERE receiver_id = ? AND status = ?;`
      );
      params = [userId, status];
    } else if (status === 'blocked') {
      stmt = db.prepare(
        `SELECT * FROM Friends WHERE blocked_by = ? AND status = ?;`
      );
      params = [userId, status];
    } else {
      reply.status(400).send({ success: 'ko', message: 'Invalid status' });
      return null;
    }

    const friends = stmt.all(...params);
    return { status: 'ok', friends };
  }
);


}