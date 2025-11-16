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
      SELECT u.id, u.fullName, u.userName, u.imageUrl, f.status
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


    // add winner to a game


    fastify.post("/addwinner", async (request: FastifyRequest, reply: FastifyReply) => {
      const { player1, player2, score1, score2, winner} = request.body as {
        player1: number,
        player2: number,
        score1: number,
        score2: number,
        winner: number,
      };
    
      const stmt = db.prepare(`
        INSERT INTO Games (user1, user2, user1_score, user2_score, user1_win)
        VALUES (?, ?, ?, ?, ?)
      `);
    
      const info = stmt.run(player1, player2, score1, score2, winner);
    
      if (info.changes === 0) {
        return reply.status(400).send({ success: false, error: 'Failed to add game result' });
      }

      console.log(player1, player2, score1, score2, winner, '<<<<<<<<<<');
      // update  data in ChartsData table
      // update friendsTotalGames for both players
      const loserId = player1 === winner ? player2 : player1;
      const winnerId = player1 === loserId ? player2 : player1;
      db.prepare(`
      UPDATE ChartsData 
      SET friendsTotalGames = friendsTotalGames + 1
      WHERE userId IN (?, ?)
      AND game = 'pong'
      `).run(player1, player2);

      // update winner's friendsWins
      db.prepare(`
      UPDATE ChartsData 
      SET friendsWins = friendsWins + 1
      WHERE userId = ?
      AND game = 'pong'
      `).run(winnerId);
      // update loser’s friendsLosses
      

      db.prepare(`
        UPDATE ChartsData
        SET friendsLosses = friendsLosses + 1
        WHERE userId = ?
        AND game = 'pong'
      `).run(loserId);

        console.log('===========> Game result added with ID:', info.lastInsertRowid);
        return { success: true, gameId: info.lastInsertRowid };
      });

    fastify.get("/user/:id", async (request:FastifyRequest, reply: FastifyReply) => {
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