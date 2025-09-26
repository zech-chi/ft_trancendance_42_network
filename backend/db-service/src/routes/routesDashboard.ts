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

     // fetch User by userId
    fastify.get('/usersId/:userId', async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
        const { userId } = request.params;
        const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
        const user = stmt.get(userId);
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


    //    app.delete('/Friends/Reject', async (request, reply) => {
    //   const { user1, user2 } = request.body as { user1: string, user2: string };
    //   if (!user1 || !user2) {
    //     return reply.code(400).send({ error: 'Missing user1 or user2' });
    //   }
    //   try {
    //     const rows = await dbGetAsyncAll(`
    //       DELETE FROM Friends
    //       WHERE status = 'pending'
    //         AND (
    //           (sender_userName = ? AND receiver_userName = ?)
    //       OR (sender_userName = ? AND receiver_userName = ?)
    //       );
    //     `, [user1, user2, user2, user1]);
    //     return reply.send({ message: 'Friend request rejected' });
    //   } catch (err) {
    //     return reply.code(400).send({ error: '❌ Error running query' });
    //   }
    // }
    // );

        // delete friend request or friendship using the db same logic just in this case use fastify.delete in body
    fastify.delete('/friends/reject', async (request: FastifyRequest<{ Body: { sender_id: string; receiver_id: string } }>, reply: FastifyReply) => {
        const { sender_id, receiver_id } = request.body;
        if (!sender_id || !receiver_id) {
            return reply.code(400).send({ error: 'Missing sender_id or receiver_id' });
        }
        try {
            const stmt = db.prepare(`
                DELETE FROM Friends
                WHERE (sender_id = ? AND receiver_id = ?)
                   OR (sender_id = ? AND receiver_id = ?);
            `);
            const result = stmt.run(sender_id, receiver_id, receiver_id, sender_id);
            if (result.changes === 0) {
                return reply.code(404).send({ error: 'No friendship or request found to delete' });
            }
            return reply.send({ message: 'Friendship or friend request deleted successfully' });
        } catch (err) {
            return reply.code(400).send({ error: '❌ Error running query' });
        }
    });


    // same logic accept friend request
    fastify.put('/friends/accept', async (request: FastifyRequest<{ Body: { sender_id: string; receiver_id: string } }>, reply: FastifyReply) => {
        const { sender_id, receiver_id } = request.body;
        if (!sender_id || !receiver_id) {
            return reply.code(400).send({ error: 'Missing sender_id or receiver_id' });
        }
        try {
            const stmt = db.prepare(`
                UPDATE Friends
                SET status = 'accepted'
                WHERE sender_id = ? AND receiver_id = ? AND status = 'pending';
            `);
            const result = stmt.run(sender_id, receiver_id);
            if (result.changes === 0) {
                return reply.code(404).send({ error: 'No pending friend request found to accept' });
            }
            return reply.send({ message: 'Friend request accepted successfully' });
        } catch (err) {
            return reply.code(400).send({ error: '❌ Error running query' });
        }
    });

}