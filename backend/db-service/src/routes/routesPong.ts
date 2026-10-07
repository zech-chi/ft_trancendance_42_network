import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const skills = [
  "Quick_Reflexes",
  "Strategic_Thinking",
  "Precision_Shots",
  "Pattern_Recognition",
  "Anticipating_Moves",
  "Board_Control",
  "Adaptive_Playstyle",
  "Risk_Management",
  "Mind_Games",
];

export async function updateCalendarData(fastify: FastifyInstance, userId: number) {
  const db = fastify.db;

  // add 0.1 to the current day in current year 
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  // day from 1 to 366
  const day = Math.floor(
    (currentDate.getTime() - new Date(year, 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );

  //console.log(`✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅Updating Calendar for user ${userId} on ${year}-${day}`);
  // if day and year already exist, update the activity += 0.1 else insert new row with activity 0.1
  try {
    const existing = db.prepare("SELECT * FROM Calendar WHERE userId = ? AND year = ? AND day = ?").get(userId, year, day);
    if (existing) {
      db.prepare("UPDATE Calendar SET activity = activity + 0.1 WHERE userId = ? AND year = ? AND day = ?").run(userId, year, day);
      //console.log(`✅ Calendar updated for user ${userId} on ${year}-${day}`);
    } else {
      db.prepare("INSERT INTO Calendar (userId, year, day, activity) VALUES (?, ?, ?, ?)").run(userId, year, day, 0.1);
      //console.log(`✅ Calendar inserted for user ${userId} on ${year}-${day}`);
    }
  } catch (err) {
    //console.error("❌ Error updating calendar:", err);
  }
}

interface RadarData {
  userId: number;
  Quick_Reflexes: number;
  Strategic_Thinking: number;
  Precision_Shots: number;
  Pattern_Recognition: number;
  Anticipating_Moves: number;
  Board_Control: number;
  Adaptive_Playstyle: number;
  Risk_Management: number;
  Mind_Games: number;
  [key: string]: number;
}


export async function updateRadarData(fastify: FastifyInstance, userId: number, winner: boolean) {
  try {
    const db = fastify.db;
  
    const skills = [
      "Quick_Reflexes",
      "Strategic_Thinking",
      "Precision_Shots",
      "Pattern_Recognition",
      "Anticipating_Moves",
      "Board_Control",
      "Adaptive_Playstyle",
      "Risk_Management",
      "Mind_Games",
    ];
  
    const clamp = (val: number) => Math.max(0, Math.min(20, val));
  
    // ✅ use prepared statement instead of db.get()
    const currentStmt = db.prepare("SELECT * FROM RadarData WHERE userId = ?");
    const current = currentStmt.get(userId) as RadarData;
    if (!current) {
      console.warn(`⚠️ No RadarData found for user ${userId}`);
      return;
    }
  
    const updates: Record<string, number> = {};
    for (const skill of skills) {
      const change = Math.random() < 0.5 ? 0.1 : 0;
      const delta = winner ? change : -change;
      updates[skill] = clamp((current[skill] ?? 0) + delta);
    }
  
    const setClause = skills.map((s) => `${s} = ?`).join(", ");
    const values = [...skills.map((s) => updates[s]), userId];
  
    //console.log(`Updating RadarData for user ${userId}:`, updates);
  
    // ✅ use prepared UPDATE
    const updateStmt = db.prepare(`UPDATE RadarData SET ${setClause} WHERE userId = ?`);
    updateStmt.run(...values);
  
  } catch (err) {
    //console.error("❌ Error updating RadarData:", err);
  }
}

interface UserLevelData {
  level: number;
  progress: number;
}

export async function updateLevel(fastify: FastifyInstance, userId: number) {
  try {
    const db = fastify.db;

    // get user
    const user = db.prepare("SELECT level, progress FROM Users WHERE id = ?").get(userId) as UserLevelData;
    if (!user) {
      //console.error("User not found");
      return;
    }

    let { level, progress } = user;

    // increase progress (simple example: +0.1)
    progress += 0.37;

    // check if level up
    if (progress >= 1) {
      level += 1;
      progress -= 1;
    }

    // update user in db
    db.prepare(`
      UPDATE Users 
      SET level = ?, progress = ? 
      WHERE id = ?
    `).run(level, progress, userId);

    //console.log(`✅ User ${userId}: level=${level}, progress=${progress}`);
  } catch (err) {
    //console.error("❌ Error updating level:", err);
  }
}


export default async function routesPong(fastify: FastifyInstance) {
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
      //console.error(err);
      reply.code(400);
      return { success: false, error: "something went wrong try again later!" };
    }
  });


  // add winner to a game


  fastify.post("/addwinner", async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const { player1, player2, score1, score2, winner } = request.body as {
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
  
      //console.log(player1, player2, score1, score2, winner, '<<<<<<<<<<');
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
  
      // update radar chart data for both players
      await updateRadarData(fastify, winnerId, true);
      await updateRadarData(fastify, loserId, false);
      await updateCalendarData(fastify, winnerId);
      await updateCalendarData(fastify, loserId);
      await updateLevel(fastify, winnerId);
  
      //console.log('===========> Game result added with ID:', info.lastInsertRowid);
      return { success: true, gameId: info.lastInsertRowid };
    
    } catch (error) {
      reply.status(400).send({ success: false, error: 'something went wrong try again later!' });
    }
  });

  fastify.get("/user/:id", async (request: FastifyRequest, reply: FastifyReply) => {
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
