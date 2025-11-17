import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { updateCalendarData, updateRadarData } from "./routesPong";
// import { get } from "https";

type UserRow = {
  id: number;
  userName: string;
};
type ParchisiGame = {
    id: number;
    player1_id: number;
    player2_id: number;
    player3_id: number | null;
    player4_id: number | null;
    winner_id: number | null;
    started_at: string;
    ended_at: string | null;
    status: string;
};

export default async function routesParchisi(fastify: FastifyInstance) {
  // Start a new Parchisi game

    const db = fastify.db;
fastify.post("/startGame", async (request:FastifyRequest<{Body: { players: string[] }}>, reply: FastifyReply) => {
// Validate and extract players array from the request body
const body = request.body;
if (!body || !Array.isArray(body.players) || !body.players.every(p => typeof p === "string")) {
    return reply.code(400).send({ error: "Invalid request body: expected { players: string[] }" });
}
const players = body.players as string[];
if (players.length < 2) {
    return reply.code(400).send({ error: "At least two players are required" });
}

  // Get user IDs
  const rows = players.map(username => 
    db.prepare("SELECT id FROM Users WHERE userName = ?").get(username) as UserRow | undefined
  );

  if (rows.includes(undefined))
    return reply.code(400).send({ error: "Some players not found" });

  const placeholders = [rows[0]?.id, rows[1]?.id, rows[2]?.id || null, rows[3]?.id || null];
  const stmt = db.prepare(`
    INSERT INTO ParchisiGames (player1_id, player2_id, player3_id, player4_id, started_at, status)
    VALUES (?, ?, ?, ?, datetime('now'), 'playing')
  `);
  const { lastInsertRowid: gameId } = stmt.run(...placeholders);

  reply.send({ gameId });
});

fastify.patch("/end/:id", async (request : FastifyRequest<{ Params: { id: number }, Body: { winner: string}  }>, reply : FastifyReply) => {
  const { winner } = request.body; // winner username
  const { id } = request.params; // game ID
  
  // validate game exists
  const game = db.prepare("SELECT * FROM ParchisiGames WHERE id = ?").get(id);
  if (!game) return reply.code(404).send({ error: "Game not found" });

  // get winner ID
  const winnerId = (db.prepare("SELECT id FROM Users WHERE userName = ?").get(winner) as UserRow | undefined)?.id;
  if (!winnerId) return reply.code(404).send({ error: "Winner not found" });

  const loserIds = [
    game.player1_id,
    game.player2_id,
    game.player3_id,
    game.player4_id,
  ].filter((pid): pid is number => pid != null && pid !== winnerId);

  // update ChartsData for winner and losers
  db.prepare(`
    UPDATE ChartsData 
    SET friendsTotalGames = friendsTotalGames + 1,
        friendsWins = friendsWins + 1
    WHERE userId = ?
    AND game = 'parcheesi'
  `).run(winnerId);

  for (const loserId of loserIds) {
    db.prepare(`
      UPDATE ChartsData 
      SET friendsTotalGames = friendsTotalGames + 1,
          friendsLosses = friendsLosses + 1
      WHERE userId = ?
      AND game = 'parcheesi'
    `).run(loserId);
  }

  // update Games table
  if (loserIds.length === 1)
  {
    // 1 vs 1
      const stmt = db.prepare(`
      INSERT INTO Games (user1, user2, user1_score, user2_score, user1_win, game_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(winnerId, loserIds[0], 1, 0, 1, 'parcheesi');
        
    if (info.changes === 0) {
      return reply.status(400).send({ success: false, error: 'Failed to add game result' });
    }
  }

  // update radar chart data for winner and losers
  // update calendar data for winner and losers
  await updateRadarData(fastify, winnerId, true);
  await updateCalendarData(fastify, winnerId);
  for (const loserId of loserIds) {
    await updateRadarData(fastify, loserId, false);
    await updateCalendarData(fastify, loserId);
  }


  // update ParchisiGames table
  db.prepare(`
    UPDATE ParchisiGames
    SET winner_id = ?, ended_at = datetime('now'), status = 'finished'
    WHERE id = ?
  `).run(winnerId, id);

  reply.send({ success: true });
});

fastify.get("/game/:id", async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const { id } = request.params; // game ID

  const game = db.prepare("SELECT * FROM ParchisiGames WHERE id = ?").get(id);
  if (!game) return reply.code(404).send({ error: "Game not found" });

  reply.send({ game });
});


fastify.get<{ Params: { username: string } }>( "/user/:username/games", async (request: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply) => {
      const { username } = request.params;

      const user = db.prepare("SELECT id FROM Users WHERE userName = ?").get(username) as UserRow | undefined;
      
      if (!user) return reply.code(404).send({ error: "User not found" });
      
      const games = db .prepare(` SELECT * FROM ParchisiGames WHERE player1_id = ? OR player2_id = ? OR player3_id = ? OR player4_id = ?`).all(user.id, user.id, user.id, user.id) as ParchisiGame[];
        
    const totalGames = games.length;
    let wins = 0;
    let loses = 0;
    
    for (const game of games) {
        if (game.winner_id === user.id) wins++;
        else loses++;
    }


    // you can here also calculate all other factores depending on time spent number of games played ... etc

    return reply.send({
        username,
        totalGames,
        wins,
        loses,
    });
}
);
}
