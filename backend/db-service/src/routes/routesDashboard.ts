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



    fastify.get('/friends/sentrequest/:userId', async (
    request: FastifyRequest<{ Params: { userId: string }; Querystring: { status: string } }>,
    reply: FastifyReply
  ) => {
    const { userId } = request.params;
    const { status } = request.query;

    console.log("request params: ", request.params);
    console.log("request query: ", request.query);

    let stmt;
    let params: any[] = [];

    if (status === 'pending') {
      stmt = db.prepare(
        `SELECT * FROM Friends WHERE sender_id = ? AND status = ?;`
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

    // get status of friendship between two users
     fastify.get('/friends/status', async (request: FastifyRequest<{ Querystring: { userId1: string; userId2: string } }>, reply: FastifyReply) => {
        const { userId1, userId2 } = request.query;
        if (!userId1 || !userId2) {
            return reply.code(400).send({ error: 'Missing userId1 or userId2' });
        }
        try {
            if (userId1 === userId2) {
                return reply.send({ status: 'self' });
            }
            const stmt = db.prepare(`
                SELECT status, blocked_by FROM Friends
                WHERE (sender_id = ? AND receiver_id = ?)
                   OR (sender_id = ? AND receiver_id = ?);
            `);
            const friendship = stmt.get(userId1, userId2, userId2, userId1);
            if (!friendship) {
                return reply.send({ status: 'no_relationship' });
            }
            return reply.send(friendship);
        } catch (err) {
            return reply.code(400).send({ error: '❌ Error running query' });
        }
    }
    );

    // same logic to unblock a user
    fastify.put('/friends/unblock', async (request: FastifyRequest<{ Body: { sender_id: string; receiver_id: string } }>, reply: FastifyReply) => {
        const { sender_id, receiver_id } = request.body;
        if (!sender_id || !receiver_id) {
            return reply.code(400).send({ error: 'Missing sender_id or receiver_id' });
        }
        try {
            const stmt = db.prepare(`
                UPDATE Friends
                SET status = 'accepted', blocked_by = NULL
                WHERE (blocked_by = ? AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)))
                  AND status = 'blocked';
            `);
            const result = stmt.run(sender_id, sender_id, receiver_id, receiver_id, sender_id);
            if (result.changes === 0) {
                return reply.code(404).send({ error: 'No blocked friendship found to unblock' });
            }
            return reply.send({ message: 'User unblocked successfully' });
        } catch (err) {
            return reply.code(400).send({ error: '❌ Error running query' });
        }
    });


    // sent friend request
    fastify.post('/friends/requestfriend', async (request: FastifyRequest<{ Body: { sender_id: string; receiver_id: string } }>, reply: FastifyReply) => {
        const { sender_id, receiver_id } = request.body;
        if (!sender_id || !receiver_id) {
            return reply.code(400).send({ error: 'Missing sender_id or receiver_id' });
        }
        if (sender_id === receiver_id) {
            return reply.code(400).send({ error: 'Cannot send friend request to yourself' });
        }
        try {
            // Check if a friendship or request already exists
            const checkStmt = db.prepare(`
                SELECT * FROM Friends
                WHERE (sender_id = ? AND receiver_id = ?)
                   OR (sender_id = ? AND receiver_id = ?);
            `);
            const existing = checkStmt.get(sender_id, receiver_id, receiver_id, sender_id);
            if (existing) {
                return reply.code(400).send({ error: 'Friendship or request already exists' });
            }

            const insertStmt = db.prepare(`
                INSERT INTO Friends (sender_id, receiver_id, status)
                VALUES (?, ?, 'pending');
            `);
            insertStmt.run(sender_id, receiver_id);
            return reply.send({ message: 'Friend request sent successfully' });
        } catch (err) {
            return reply.code(400).send({ error: '❌ Error running query' });
        }
    });



    // get charts data for a game by userId and a query param game
    fastify.get('/chartsdata/:userId', async (request: FastifyRequest<{ Params: { userId: string }; Querystring: { game: string } }>, reply: FastifyReply) => {
        const { userId } = request.params;
        const { game } = request.query;
        if (!game) {
            return reply.status(400).send({ success: "ko", message: "Missing game query parameter" });
        }
        const stmt = db.prepare("SELECT * FROM ChartsData WHERE userId = ? AND game = ?");
        const stats = stmt.get(userId, game);
        if (!stats) {
            reply.status(404).send({ success: "ko", message: "No stats found for this user and game" });
            return null;
        }
        return { status: "ok", stats: stats };
    });

    // get rank data for all users
    fastify.get('/rank', async (request: FastifyRequest, reply: FastifyReply) => {
        const stmt = db.prepare(`
            SELECT id, userName, fullName, imageUrl, level, progress, rank, progress, online
            FROM Users
            ORDER BY level DESC, progress DESC
        `);
        const users = stmt.all();
        return users;
    });

    // get games history by userName and a query param gameType
    fastify.get('/Games/:userId', async (request: FastifyRequest<{ Params: { userId: number }; Querystring: { gameType: string } }>, reply: FastifyReply) => {
        const { userId } = request.params;
        const { gameType } = request.query;
        if (!userId || !gameType) {
            return reply.code(400).send({ error: 'Missing userId or gameType' });
        }
        try {
            const stmt = db.prepare(`
                SELECT * FROM Games
                WHERE user1 = ? OR user2 = ?
                AND game_type = ?
                ORDER BY date_played DESC
            `);
            const allGames = stmt.all(userId, userId, gameType);
            let filteredGames;
            if (gameType === 'all') {
                filteredGames = allGames;
            } else if (gameType === 'pong' || gameType === 'parcheesi') {
                filteredGames = allGames.filter((game: any) => game.game_type === gameType);
            } else {
                return reply.code(400).send({ error: 'Invalid gameType. Must be "all", "ranked", or "unranked"' });
            }
            return reply.send(filteredGames);
        } catch (err) {
            return reply.code(500).send({ error: '❌ Error running query' });
        }
    });
}