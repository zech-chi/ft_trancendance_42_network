import { FastifyRequest, FastifyReply } from 'fastify';
// import db from '../db/connectiondb'
import { MessageRequestBody, MessageRow, Message } from '../types/message';
import { getTime } from '../utils/getTime';
import { MAX_LENGTH_MESSAGE } from './constants';
import { ApidataBase } from './ApiDataBase';

// Validates that the authenticated user matches the user making the request
export function checkAuthenticatedUser(
  reply: FastifyReply,
  from: string | number,
  authenticatedUserId: string | number | undefined
): boolean {
  if (from != authenticatedUserId) {
    reply.status(403).send({
      status: 'error',
      message: 'Forbidden. User does not match authenticated user.'
    });
    return false;
  }
  return true;
}

// this function will be used to check if the request body is undifined or not
export function checkRequestBody(reply: FastifyReply, request: FastifyRequest ): boolean {
    if (!request.body) {
        reply.status(400).send({ status: 'error', message: 'Invalid request body.' });
        return false;
    }
    return true;
}

// this function will be used to check if the message request body is valid
export function checkMessageRequestBody(reply: FastifyReply, message: string): boolean {

    // check if the message is provided
    if (!message) {
        reply.status(400).send({ status: 'error', message: 'Message cannot be empty.' });
        return false;
    }
    // check if the message is too long
    if (message.length > MAX_LENGTH_MESSAGE) {
        reply.status(400).send({ status: 'error', message: 'Message is too long. it excedded the limit of 2000 characters' });
        return false;
    }
    return true;
}


// this function will be used to check the Ids provided in the request body
export function checkIds(reply:FastifyReply ,from: string, to: string, errorMessage: string): boolean {
    // check if the from user is provided
    if (!from || !to) {
        reply.status(400).send({ status: 'error', message: 'Invalid request. Please provide from and to.' });
        return false;
    }
    // check if the from user is not the same as to user
    if (from == to) {
        reply.status(400).send({ status: 'error', message: errorMessage });
        return false;
    }
    return true;
}

// this function will be user to check if the user exists in the database
export async function checkUserExists(reply:FastifyReply ,userId: string): Promise<boolean> {
    // check if the user exists in the database
    // const userExistsStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    // const userExists = userExistsStmt.get(userId);
    const response = await fetch(ApidataBase.checkUser, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    });

    if (!response.ok) {
        reply.status(400).send({ status: 'error', message: 'Failed to verify user existence.' });
        return false;
    }

    const data = await response.json();
    const userExists = data.exists;

    if (!userExists) {
        reply.status(404).send({ status: 'error',  message: 'to User not found.' });
        return false;
    }
    console.log("========> User exists:", userExists);
    return (true);
}

// this function will be used to check if the users are friends or not
export async function checkFriendship(reply: FastifyReply,from: string, to: string, errorMessage: string, accepted: boolean): Promise<boolean> {
    // that the correct way to check friendship
    // SELECT * FROM friends
    // WHERE
    //     ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
    //     AND status = 'accepted'
    // const checkFriendshipStmt = db.prepare(`
    //     SELECT * FROM friends
    //     WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
    // `);
    // const friendship = checkFriendshipStmt.get(from, to, to, from);
    const response = await fetch(ApidataBase.areFriends, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId1: from, userId2: to, checkAccepted: accepted })
      });
    
    if (!response.ok) {
        reply.status(400).send({ status: 'error', message: 'Failed to verify friendship.' });
        return false;
    }

    const data = await response.json();
    const friendship = data.areFriends;
    if (!friendship) {
        reply.status(403).send({ status: 'error', message: errorMessage });
        return false;
    }
    console.log("========> Are friends:", friendship);
    return (true);
}


// this function will be used to insert a new message into the database

export async function insertMessageToDatabase(
  reply: FastifyReply,
  from: string,
  to: string,
  message: string
): Promise<any | null> {
  // const stmt = db.prepare(`
  //   INSERT INTO messages (sender_id, receiver_id, message, timestamp)
  //   VALUES (?, ?, ?, ?)
  // `);

  const timeSendMessage = getTime();

  const response = await fetch(ApidataBase.addMsg, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to, message, timeSendMessage: timeSendMessage })
  });

  if (!response.ok) {
    reply.status(400).send({ status: 'error', message: 'Failed to add message.' });
    return null;
  }
  const info = await response.json();

  // const info = stmt.run(from, to, message, timeSendMessage);

  // if (info.changes === 0) {
  //   reply.status(400).send({ status: 'error', message: 'Failed to add message.' });
  //   return null;
  // }

  const messageData = {
    id: info.messageId,
    message,
    sent: true,
    time: timeSendMessage.slice(11, 16),
    type: 'text',
    url: null,
    fileName: null,
    thumbnailUrl: null,
    from,
    to,
  };

  reply.status(200).send({
    status: 'success',
    message: 'Message added successfully.',
    data: messageData,
  });

  return messageData;
}

// this function will fetch all messages between two users and format them to a structured format
export async function getFormattedMessages(reply: FastifyReply, from: string, to: string, limit: number, offset: number): Promise<Message[]> {

  console.log("Fetching messages from:", from, "to:", to, "with limit:", limit, "and offset:", offset);
    // const stmt = db.prepare(`
    //     SELECT * FROM messages
    //     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    //     ORDER BY timestamp DESC
    //     LIMIT ? OFFSET ?
    // `);

    // Execute the statement with the provided data
    // const rows = stmt.all(from, to, to, from, limit, offset) as MessageRow[];
    const response = await fetch(ApidataBase.getMsgs, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId1: from, userId2: to, limit, offset })
    });
    
    if (!response.ok) {
        reply.status(400).send({ status: 'error', message: 'Failed to fetch messages.' });
        return [];
    }
    const data = await response.json();
    const rows = data.messages as MessageRow[];

    console.log("Messages fetched from database:", rows);
    rows.forEach(msg => {console.log(`===========>  ${typeof msg.timestamp}  <==========`)});
    return rows.map(msg => ({
        id: msg.id,
        message: msg.message,
        sent: msg.sender_id == from,
        url: msg.url, // Assuming the message can have a URL for images or files
        fileName: msg.file_name, // Assuming the message can have a file name for files
        thumbnailUrl: msg.thumbnail_url, // Assuming the message can have a thumbnail URL for files
        time: msg.timestamp.slice(11, 16), // Extracts "HH:MM"
        type: msg.type // Assuming all messages are text for now
    }));
}

// this function will be used to fetch all friends of the user from the database
// export function getAllFriends(userId: string) {
//     // Prepare the SQL statement to fetch all friends of the user
//     const stmt = db.prepare(`
//     SELECT
//         f.friend_id,
//         u.name,
//         u.username,
//         u.avatar,
//         u.online,
//         u.last_seen,
//         u.message
//     FROM
//         friends f
//     JOIN
//         users u ON f.friend_id = u.id
//     WHERE
//         f.user_id = ? -- i should add the status of the relationship later ->  AND f.status = 'accepted' -- Where I am the initiator (user_id)
    
//     UNION
    
//     SELECT
//         f.user_id,
//         u.name,
//         u.username,
//         u.avatar,
//         u.online,
//         u.last_seen,
//         u.message
//     FROM
//         friends f
//     JOIN
//         users u ON f.user_id = u.id
//     WHERE
//         f.friend_id = ? -- i should add the status of the relationship later -> (AND f.status = 'accepted') -- Where I am the one being added (friend_id)
//     `);


//     return stmt.all(userId, userId);
// }


// Your frontend types for clarity
export type LastMessage = {
  content: string | null;
  type: 'text' | 'image' | 'file' | 'audio';
};

export type Contact = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  lastSeen: number;
  lastMessage?: LastMessage;
  blocked: boolean;
  blockedBy?: number | null;
};

type FriendDbRow = {
    id: number;
    fullName: string;
    userName: string;
    imageUrl: string;
    online_in_chat: number; // SQLite often returns booleans as 0 or 1
    lastSeen: number;
    status: 'accepted' | 'blocked';
    blockedBy: number | null;
    lastMessageContent: string | null;
    lastMessageType: 'text' | 'image' | 'file' | 'audio' | null;
  };

  export async function getAllFriends(userId: string): Promise<Contact[]> {
    
    // const sql = `
    //   -- Step 1: Same as before, but corrected to use 'accepted' and 'blocked' for message searching
    //   WITH UserRelationships AS (
    //     SELECT friend_id AS contact_id, status, blocked_by, user_id as initiator FROM friends
    //     WHERE user_id = ? AND status IN ('accepted', 'blocked', 'pending')
    //     UNION
    //     SELECT user_id AS contact_id, status, blocked_by, user_id as initiator FROM friends
    //     WHERE friend_id = ? AND status IN ('accepted', 'blocked', 'pending')
    //   ),
      
    //   -- Step 2: Same as before
    //   LastMessages AS (
    //     SELECT
    //       message,
    //       type,
    //       sender_id,
    //       receiver_id,
    //       ROW_NUMBER() OVER(
    //         PARTITION BY CASE WHEN sender_id > receiver_id THEN receiver_id || ':' || sender_id ELSE sender_id || ':' || receiver_id END
    //         ORDER BY timestamp DESC
    //       ) as rn
    //     FROM messages
    //     WHERE sender_id = ? OR receiver_id = ?
    //   )
  
    //   -- Step 3: Combine everything with the simplified JOIN
    //   SELECT
    //     u.id,
    //     u.name,
    //     u.username,
    //     u.avatar,
    //     u.online,
    //     u.last_seen AS lastSeen,
    //     ur.status,
    //     ur.blocked_by AS blockedBy,
    //     lm.message AS lastMessageContent,
    //     lm.type AS lastMessageType
    //   FROM UserRelationships ur
    //   JOIN users u ON u.id = ur.contact_id
      
    //   -- ----------- THE FIX IS HERE -----------
    //   -- Instead of rebuilding the key, we check the IDs directly.
    //   -- This is much more reliable.
    //   LEFT JOIN LastMessages lm ON (
    //       (lm.sender_id = ur.contact_id AND lm.receiver_id = ?) OR
    //       (lm.sender_id = ? AND lm.receiver_id = ur.contact_id)
    //   ) AND lm.rn = 1; -- Only join with the most recent message
    // `;
  
    // const stmt = db.prepare(sql);
    
    // // We now need 6 parameters instead of 7 for the new JOIN condition
    // const rows = stmt.all(
    //     userId, // for UserRelationships
    //     userId, // for UserRelationships
    //     userId, // for LastMessages
    //     userId, // for LastMessages
    //     userId, // for the new JOIN condition (receiver_id)
    //     userId  // for the new JOIN condition (sender_id)
    // ) as FriendDbRow[];
  
    // console.log(">>>>>>>>>>>> rows as a resulst : ", rows);

    const response = await fetch(ApidataBase.getFriends, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    });
    if (!response.ok) {
        console.error('Failed to fetch friends from DB service');
        return [];
    }
    const data = await response.json();
    const rows = data.friends as FriendDbRow[];
    console.log(">>>>>>>>>>>> rows as a resulst : ", rows);
    
    // Map the database rows to your frontend Contact type
    const contacts: Contact[] = rows.map(row => ({
      id: row.id,
      name: row.fullName,
      username: row.userName,
      avatar: row.imageUrl,
      online: !!row.online_in_chat,
      lastSeen: row.lastSeen,
      blocked: row.status === 'blocked',
      blockedBy: row.blockedBy,
      // The mapping logic can stay the same, but we add a type assertion for safety
      lastMessage: row.lastMessageType ? {
        content: row.lastMessageContent,
        type: row.lastMessageType,
      } : undefined,
    }));
  
    return contacts;
  }



//  this function will check if the user that wants to unblock the user is the one who blocked him
export async function checkUserBlockedBy(reply: FastifyReply, from: string, to: string): Promise<boolean> {
    // const stmt = db.prepare(`
    //     SELECT * FROM friends
    //     WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
    //     AND status = 'blocked'
    //     AND blocked_by = ?
    // `);
    
    // const blocked = stmt.get(from, to, to, from, from);
    const response = await fetch(ApidataBase.canUnblock, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to })
    });

    if (!response.ok) {
        reply.status(400).send({ status: 'error', message: 'Failed to verify unblock permission.' });
        return false;
    }
    
    const data = await response.json();
    const blocked = data.canUnblock;
    
    if (!blocked) {
        reply.status(403).send({
            status: 'error',
            message: 'You can only unblock users you have blocked.'
        });
        return false;
    }

    return true;
}

// this function will check the id of the message is valid or not
export async function checkMessageId(reply: FastifyReply, messageId: string, from: string, to: string): Promise<boolean> {
      // const stmt = db.prepare('SELECT * FROM messages WHERE id = ? AND (sender_id = ? AND receiver_id = ?)');
      // const message = stmt.get(messageId, from, to) as MessageRow;
      const response = await fetch(ApidataBase.checkMesg, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to, messageId })
    });

    if (!response.ok) {
      reply.status(400).send({ status: 'error', message: 'Failed to verify message.' });
      return false;
    }

    const data = await response.json();
    const message = data.exists;

    console.log("Message that will be deleted is ===> ", message);
    
    if (!message) {
      reply.status(404).send({ status: 'error', message: 'Message not found or your are not the sender' });
      return false;
    }

    return true;
}

// this function will delete the message from the database
export async function deleteMessageFromDatabase(reply: FastifyReply, messageId: string): Promise<boolean> {
    // const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
    // const info = stmt.run(messageId);

    // if (info.changes === 0) {
    //     reply.status(400).send({ status: 'error', message: 'Failed to delete message.' });
    //     return false;
    // }

    const response = await fetch(ApidataBase.deleteMsg, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messageId })
    });

    if (!response.ok) {
        reply.status(400).send({ status: 'error', message: 'Failed to delete message.' });
        return false;
    }

    const data = await response.json();
    const success = data.success;
    if (!success) {
        reply.status(400).send({ status: 'error', message: 'Failed to delete message.' });
        return false;
    }

    reply.status(200).send({ status: 'success', message: 'Message deleted successfully.' });
    return true;
}