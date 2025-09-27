// this file contains all the routes for the chat application.
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

type FileMessageBody = {
    from: string;
    to: string;
    message: string;
    fileType: string;
    fileUrl: string;
    filename: string;
    thumbnailPath: string;
    timeSendMessage: string;
};

export default async function routesChat(fastify: FastifyInstance) {

    // access the db instance
    const db = fastify.db;

    fastify.get("/hello", async (request:FastifyRequest , reply: FastifyReply) => {
        const stmt = db.prepare("SELECT * from users");
        const users = stmt.all();
        console.log(users);
        return { status: "ok", message: "Hello from DB service!" , users: users};
    });

    // route that check if the user exists in the database
    fastify.post("/checkuser", async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request.body as { userId: string };
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        const user = stmt.get(userId);
        if (user) {
            return { exists: true };
        } else {
            return { exists: false };
        }
    });


    // route check if the users are friends
    fastify.post("/arefriends", async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId1, userId2 } = request.body as { userId1: string, userId2: string };
         // that the correct way to check friendship
    // SELECT * FROM friends
    // WHERE
    //     ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
    //     AND status = 'accepted'
        const stmt =  db.prepare(`
            SELECT * FROM friends
            WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND status = 'accepted'
        `);

        const friendship = stmt.get(userId1, userId2, userId2, userId1);
        if (friendship) {
            return { areFriends: true };
        } else {
            return { areFriends: false };
        }
    }
    );


    // route to add the message between two users to the database
    fastify.post("/addmsg", async (request: FastifyRequest, reply: FastifyReply) => {
        const { from, to, message, timeSendMessage } = request.body as { from: string, to: string, message: string, timeSendMessage: string };
        const stmt = db.prepare(`
            INSERT INTO messages (sender_id, receiver_id, message, timestamp)
            VALUES (?, ?, ?, ?)
        `);

        const info = stmt.run(from, to, message, timeSendMessage);
        
        if (info.changes === 0) {
            reply.status(400).send({success: false ,  error: 'Failed to add message' });
            return;
        }
         
        return { success: true, messageId: info.lastInsertRowid };
    });


    // this route will be responsible for getting all messages between two users
    fastify.post("/getmsgs", async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId1, userId2, limit, offset } = request.body as { userId1: string, userId2: string, limit: number, offset: number };
        const stmt = db.prepare(`
            SELECT * FROM messages
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY timestamp DESC
            LIMIT ? OFFSET ?
        `);
        const messages = stmt.all(userId1, userId2, userId2, userId1, limit, offset);
        console.log(messages);
        return { messages };
    });


    // route that will be used to block a user
    fastify.post("/blockuser", async (request: FastifyRequest, reply: FastifyReply) => {
        const { from, to } = request.body as { from: string, to: string };
        const stmt = db.prepare(`Update friends
            SET status = 'blocked', blocked_by = ?
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        `);
        try {
            const info = stmt.run(from, from, to, to, from);
            if (info.changes === 0) {
                reply.status(400).send({ success: false, error: 'Failed to block user' });
                return;
            }
            return { success: true };
        } catch (error) {
            // Handle unique constraint violation (user already blocked)
           return reply.status(400).send({ success: false, error: 'Failed to block user' });
        }
    });

    // check if the user that wants to unblock is the one who blocked
    fastify.post("/canunblock", async (request: FastifyRequest, reply: FastifyReply) => {
        const { from, to } = request.body as { from: string, to: string };
        const stmt = db.prepare(`
            SELECT * FROM friends
            WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
            AND status = 'blocked'
            AND blocked_by = ?
        `);
        const friendship = stmt.get(from, to, to, from, from);
        if (friendship) {
            return { canUnblock: true };
        } else {
            return { canUnblock: false };
        }
    });

    // route that will be used to unblock a user
    fastify.post("/unblockuser", async (request: FastifyRequest, reply: FastifyReply) => {
        const { from, to } = request.body as { from: string, to: string };
        const stmt = db.prepare(`Update friends
            SET status = 'accepted', blocked_by = NULL
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        `);
        try {
            const info = stmt.run(from, to, to, from);
            if (info.changes === 0) {
                reply.status(400).send({ success: false, error: 'Failed to unblock user' });
                return;
            }
            return { success: true };
        } catch (error) {
            // Handle unique constraint violation (user already blocked)
           return reply.status(400).send({ success: false, error: 'Failed to unblock user' });
        }
    });

    // route to check if the message exists and belongs to the sender
    fastify.post("/checkMesg", async (request: FastifyRequest, reply: FastifyReply) => {
        const {from, to, messageId } = request.body as {from: string, to: string, messageId: string};
        const stmt = db.prepare('SELECT * FROM messages WHERE id = ? AND (sender_id = ? AND receiver_id = ?)');
        const message = stmt.get(messageId, from, to);

        if (message) {
            return { exists: true };
        } else {
            return { exists: false };
        }
    });

    // route to delete a message
    fastify.post("/deletemsg", async (request: FastifyRequest, reply: FastifyReply) => {
        const { messageId } = request.body as { messageId: string };
        const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
        const info = stmt.run(messageId);

        if (info.changes === 0) {
            reply.status(400).send({ success: false , message: 'Failed to delete message.' });
            return false;
        }

        return { success: true };
    });

    // route to edit a message
    fastify.post("/editmsg", async (request: FastifyRequest, reply: FastifyReply) => {
        const {from, to ,messageId, newMessage } = request.body as {from:string, to: string,  messageId: string, newMessage: string };
        const stmt = db.prepare(`
            UPDATE messages
            SET message = ?
            WHERE id = ? AND sender_id = ? AND receiver_id = ?
        `);
        const info = stmt.run(newMessage, messageId, from, to);

        if (info.changes === 0) {
            reply.status(400).send({ success: false , message: 'Failed to edit message.' });
            return false;
        }

        return { success: true };
    });


    // route to get all friends of a user and the last message exchanged with each friend
    fastify.post("/friends", async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request.body as { userId: string };
        const sql = `
        -- Step 1: Same as before, but corrected to use 'accepted' and 'blocked' for message searching
        WITH UserRelationships AS (
          SELECT receiver_id AS contact_id, status, blocked_by, sender_id as initiator FROM friends
          WHERE sender_id = ? AND status IN ('accepted', 'blocked')
          UNION
          SELECT sender_id AS contact_id, status, blocked_by, sender_id as initiator FROM friends
          WHERE receiver_id = ? AND status IN ('accepted', 'blocked')
        ),
        
        -- Step 2: Same as before
        LastMessages AS (
          SELECT
            message,
            type,
            sender_id,
            receiver_id,
            ROW_NUMBER() OVER(
              PARTITION BY CASE WHEN sender_id > receiver_id THEN receiver_id || ':' || sender_id ELSE sender_id || ':' || receiver_id END
              ORDER BY timestamp DESC
            ) as rn
          FROM messages
          WHERE sender_id = ? OR receiver_id = ?
        )
    
        -- Step 3: Combine everything with the simplified JOIN
        SELECT
          u.id,
          u.fullName,
          u.userName,
          u.imageUrl,
          u.online,
          u.last_seen AS lastSeen,
          ur.status,
          ur.blocked_by AS blockedBy,
          lm.message AS lastMessageContent,
          lm.type AS lastMessageType
        FROM UserRelationships ur
        JOIN users u ON u.id = ur.contact_id
        
        -- ----------- THE FIX IS HERE -----------
        -- Instead of rebuilding the key, we check the IDs directly.
        -- This is much more reliable.
        LEFT JOIN LastMessages lm ON (
            (lm.sender_id = ur.contact_id AND lm.receiver_id = ?) OR
            (lm.sender_id = ? AND lm.receiver_id = ur.contact_id)
        ) AND lm.rn = 1; -- Only join with the most recent message
      `;
    
        const stmt = db.prepare(sql);
        const friends = stmt.all(
            userId, // for UserRelationships
            userId, // for UserRelationships
            userId, // for LastMessages
            userId, // for LastMessages
            userId, // for the new JOIN condition (receiver_id)
            userId  // for the new JOIN condition (sender_id)
        )

        return { friends };
    });


    // route insert a message if it's a file
    fastify.post("/addfilemsg", async (request: FastifyRequest, reply: FastifyReply) => {
        const { from, to, message, fileType, fileUrl,  filename, thumbnailPath,timeSendMessage } = request.body as FileMessageBody;
        const stmt = db.prepare(`
            INSERT INTO messages (sender_id, receiver_id, message,type, url, file_name, thumbnail_url, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);
        

        const info = stmt.run(
            from, // sender_id
            to, // receiver_id
            message,
            fileType, // type
            fileUrl, // url
            filename, // file_name
            thumbnailPath,
            timeSendMessage, // timestamp
          );
        
        if (info.changes === 0) {
            reply.status(400).send({success: false ,  error: 'Failed to add message' });
            return;
        }
         
        return { success: true, messageId: info.lastInsertRowid };
    });

}