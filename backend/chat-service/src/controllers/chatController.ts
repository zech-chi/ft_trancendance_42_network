import { FastifyRequest, FastifyReply } from "fastify";
// import db from "../db/connectiondb";
import { MessageRequestBody, MessageRow, Message } from "../types/message";
import {
  showAllUsers,
  showAllFriends,
  deleteAllMessages,
  checkIds,
  checkUserExists,
  checkFriendship,
  insertMessageToDatabase,
  getFormattedMessages,
  getAllFriends,
  checkMessageRequestBody,
  checkUserBlockedBy,
  checkRequestBody,
  checkMessageId,
  deleteMessageFromDatabase,
} from "../utils/utilsControllerChat";
import {sendBlockEventToUser, sendDeleteOrUpdateMessageEventToUser, sendMessageToUser } from "../socket/socket";
import { getTime } from "../utils/getTime";
import { ApidataBase } from "../utils/ApiDataBase";

// this function will be used to fetch all friends of the user from the database
export async function getFriends(request: FastifyRequest, reply: FastifyReply) {
  try {

    if (!checkRequestBody(reply, request)) {
      return;
    }
    // Uncomment the line below when you have user authentication middleware
    // const user = request.user; // Assuming you have user authentication middleware
    const { userId } = request.body as { userId: string };

    // check if the from user is provided
    if (!userId) {
      return reply
        .status(400)
        .send({
          status: "error",
          message: "Invalid request. Please provide user.",
        });
    }

    // check if the user exists in the database
    // const userExistsStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    // const userExists = userExistsStmt.get(user);
    // if (!userExists) {
    //     return reply.status(404).send({ status: 'error', message: 'User not found.' });
    // }
    if (!(await checkUserExists(reply, userId))) {
      return; // If the user does not exist, exit the function
    }

    // showAllFriends(); // show all friends in the database
    // showAllUsers(); // show all users in the database

    //         const stmt = db.prepare(`
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
    // `);

    //         const friends = stmt.all(user, user);
    const friends = await getAllFriends(userId);
    console.log("Friends fetched from database:", friends);

    reply.status(200).send({ status: "ok", friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return reply
      .status(400)
      .send({ status: "error", message: "Bad request! hhhhhh 1" });
  }
}

// this function will be used to handle incoming messages and store them
// in a database
// FastifyRequest<{Body: MessageRequestBody}> to add it later
export async function addMessage(request: FastifyRequest, reply: FastifyReply) {
  try {

    if (!checkRequestBody(reply, request)) {
      return;
    }
    // Extract the message from the request body
    const { from, to, message } = request.body as MessageRequestBody;

    // this line should be uncommented when you have user authentication from middleware
    // const user = request.user;

    // check from user and to user
    // if (!from || !to || !message) {
    //    return reply.status(400).send({
    //         status: 'error',
    //         message: 'Invalid request. Please provide from, to, and message.' });
    // }

    // // check if the to user is not the same as from user
    // if (from === to) {
    //     return reply.status(400).send({
    //         status: 'error',
    //         message: 'You cannot send a message to yourself.' });
    // }
    const trimmedMessage = message.trim();

    if (!checkIds(reply, from, to, "You cannot send a message to yourself.")) {
      return; // If the IDs are invalid, exit the function
    }


    // check the message is valid
    if (!checkMessageRequestBody(reply, trimmedMessage)) {
      return; // If the message is invalid, exit the function
    }

    // check if the to user exists in the database
    // const userExistsStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    // const userExists = userExistsStmt.get(to);
    // if (!userExists) {
    //     return reply.status(404).send({
    //         status: 'error',
    //         message: 'User not found.' });
    // }
    if (!(await checkUserExists(reply, to))) {
      return; // If the user does not exist, exit the function
    }

    // check if the users are friends or not

    // that the correct way to check friendship
    // SELECT * FROM friends
    // WHERE
    //     ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
    //     AND status = 'accepted'
    // const checkFriendshipStmt = db.prepare(`
    //     SELECT * FROM friends
    //     WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    // `);

    // const friendship = checkFriendshipStmt.get(from, to, to, from);
    // if (!friendship) {
    //     return reply.status(403).send({
    //         status: 'error',
    //         message: 'You can only send messages to friends.' });
    // }

    if (!(await checkFriendship(
        reply,
        from,
        to,
        "You can only send messages to friends.",
        true
      ))
    ) {
      return; // If the users are not friends, exit the function
    }

    console.log("Message received from:", from, "to:", to, "message:", trimmedMessage);

    // Insert the message into the database
    const messageData = await insertMessageToDatabase(reply, from, to, trimmedMessage);
    if (!messageData) {
      return; // If the message could not be inserted, exit the function
    }

    // // prepare the statement to insert the message into the database
    // const stmt = db.prepare(`
    //     INSERT INTO messages (sender_id, receiver_id, message, timestamp)
    //     VALUES (?, ?, ?, ?)
    // `);

    // const timeSendMessage = getTime();

    // // execute the statement with the provided data
    // const info = stmt.run(from, to, message, timeSendMessage);
    // console.log("Message added successfully:", info);

    // // check if the message was added successfully
    // if (info.changes === 0) {
    //     return reply.status(500).send({ status: 'error', message: 'Failed to add message AWEDi 1.' });
    // }

  // send the message via socket io 
  messageData.sent = false; // Mark the message as sent
  sendMessageToUser(to.toString(), messageData);
  return reply;

  } catch (error) {
    console.error("Error adding message:", error);
    return reply
      .status(400)
      .send({ status: "error", message: "Bad request! hhhhhh 2." });
  }
  
}

// This function will be used to fetch messages from a database
export async function getMessages(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // fetch messages logic
  try {
    if (!checkRequestBody(reply, request)) {
      return;
    }
    const { from, to, limit = 20, offset = 0 } = request.body as MessageRequestBody & { limit?: number; offset?: number };

    // Uncomment the line below when you have user authentication middleware
    // const from = request.user; // Assuming you have user authentication middleware

    // Validate the request body
    // if (!from || !to) {
    //     return reply.status(400).send({
    //         status: 'error',
    //         message: 'Invalid request. Please provide from and to.' });
    // }

    // // check if the from user is not the same as to user
    // if (from === to) {
    //     return reply.status(400).send({
    //         status: 'error',
    //         message: 'You cannot fetch messages with yourself.' });
    // }

    if (
      !checkIds(reply, from, to, "You cannot fetch messages with yourself.")
    ) {
      return; // If the IDs are invalid, exit the function
    }

    if (!(await checkUserExists(reply, to))) {
      return; // If the user does not exist, exit the function
    }

    // fetch all row in friends table
    showAllFriends();

    // check if the users are friends or not
    // const checkFriendshipStmt = db.prepare(`
    //     SELECT * FROM friends
    //     WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    // `);

    // const friendship = checkFriendshipStmt.get(from, to, to, from);
    // if (!friendship) {
    //     return reply.status(403).send({
    //         status: 'error',
    //         message: 'You can only fetch messages with friends.' });
    // }

    if (!(await checkFriendship(
        reply,
        from,
        to,
        "You can only fetch messages with friends.",
        false
      ))
    ) {
      return; // If the users are not friends, exit the function
    }

    // show all users
    // showAllUsers();

    console.log("Fetching messages from:", from, "to:", to);

    // Prepare the SQL statement to fetch messages between the two users
    // const stmt = db.prepare(`
    //     SELECT * FROM messages
    //     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    // `);

    // // Execute the statement with the provided data
    // const rows = stmt.all(from, to, to, from) as MessageRow[];

    // console.log("Messages fetched from database:", rows);

    // rows.forEach(msg => {console.log(`===========>  ${typeof msg.timestamp}  <==========`)});
    // const messages: Message[] = rows.map(msg => ({
    //                 id: msg.id,
    //                 message: msg.message,
    //                 sent: msg.sender_id == from,
    //                 url: msg.url, // Assuming the message can have a URL for images or files
    //                 fileName: msg.file_name, // Assuming the message can have a file name for files
    //                 thumbnailUrl: msg.thumbnail_url, // Assuming the message can have a thumbnail URL for files
    //                 time: msg.timestamp.slice(11, 16), // Extracts "HH:MM"
    //                 type: msg.type // Assuming all messages are text for now
    // }));
    const messages = await getFormattedMessages(reply, from, to, limit, offset);
    console.log("Messages fetched:", messages);

    reply.status(200).send({ status: "ok", messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return reply
      .status(400)
      .send({ status: "error", message: "Bad request! hhhhhh 3" });
  }
}

// this function will be used to block a user in chat
// it will update the status of the friendship to 'blocked'
export async function blockUser(request: FastifyRequest, reply: FastifyReply) {

  // to remove 
  console.log("Blocking user request body:", request.body);
  try {

    if (!checkRequestBody(reply, request)) {
      return;
    }

    const { from, to } = request.body as MessageRequestBody;
    // Uncomment the line below when you have user authentication middleware
    // const from = request.user; // Assuming you have user authentication middleware

    // Validate the request body
    // if (!from || !to) {
    //     return reply.status(400).send({ status: 'error', message: 'Invalid request. Please provide userId and friendId.' });
    // }

    // // check if the from user is not the same as to user
    // if (from === to) {
    //     return reply.status(400).send({ status: 'error', message: 'You cannot block yourself.' });
    // }

    if (!checkIds(reply, from, to, "You cannot block yourself.")) {
      return; // If the IDs are invalid, exit the function
    }

    //Check if the users are friends or not
    // const checkFriendshipStmt = db.prepare(`
    //     SELECT * FROM friends
    //     WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    // `);

    // const friendship = checkFriendshipStmt.get(from, to, to, from);

    // if (!friendship) {
    //     return reply.status(403).send({ status: 'error', message: 'You can only block friends.' });
    // }

    if (!(await checkFriendship(reply, from, to, "You can only block friends.", true))) {
      return; // If the users are not friends, exit the function
    }

    // Prepare the SQL statement to block the user
    // ? change later to 'blocked' status 
    // const stmt = db.prepare(`Update friends
    //         SET status = 'blocked', blocked_by = ?
    //         WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    //     `);

    // // Execute the statement with the provided data
    // const info = stmt.run(from, from, to, to, from);
    const response = await fetch(ApidataBase.blockUser, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to }),
    });

    if (!response.ok) {
      return reply.status(400).send({ status: 'error', message: 'Failed to block user.' });
    }
    const data = await response.json();
    if (data.success !== true) {
      return reply.status(400).send({ status: 'error', message: 'Failed to block user.' });
    }

    // send the block user event to the specific user
    sendBlockEventToUser(from.toString(), "blockUser", to.toString());
    reply
      .status(200)
      .send({ status: "ok", message: "User blocked successfully.", blockUser: true, blockedBy: from });
  } catch (error) {
    console.error("Error blocking user:", error);
    return reply
      .status(400)
      .send({
        status: "error",
        message: "Bad request! hhhhhh 4",
      });
  }
}


// this function will be used to unblock a user in chat
// it will update the status of the friendship to 'accepted'
export async function unblockUser(request: FastifyRequest, reply: FastifyReply) {
  try {

    if (!checkRequestBody(reply, request)) {
      return;
    }
    
    const { from, to } = request.body as MessageRequestBody;
    // Uncomment the line below when you have user authentication middleware
    // const from = request.user; // Assuming you have user authentication middleware

    // Validate the request body
    // if (!from || !to) {
    //     return reply.status(400).send({ status: 'error', message: 'Invalid request. Please provide userId and friendId.' });
    // }

    // // check if the from user is not the same as to user
    // if (from === to) {
    //     return reply.status(400).send({ status: 'error', message: 'You cannot unblock yourself.' });
    // }

    if (!checkIds(reply, from, to, "You cannot unblock yourself.")) {
      return; // If the IDs are invalid, exit the function
    }

    //Check if the users are friends or not
    // const checkFriendshipStmt = db.prepare(`
    //     SELECT * FROM friends
    //     WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    // `);

    // const friendship = checkFriendshipStmt.get(from, to, to, from);

    // if (!friendship) {
    //     return reply.status(403).send({ status: 'error', message: 'You can only unblock friends.' });
    // }

    if (!(await checkFriendship(reply, from, to, "You can only unblock friends.", false))) {
      return; // If the users are not friends, exit the function
    }

    if (!(await checkUserBlockedBy(reply, from, to))) {
      return ;
    }

    // Prepare the SQL statement to unblock the user
    // const stmt = db.prepare(`Update friends
    //         SET status = 'accepted', blocked_by = NULL
    //         WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    //     `);

    // // Execute the statement with the provided data
    // const info = stmt.run(from, to, to, from);

    const response = await fetch(ApidataBase.unblockUser, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to }),
    });
    if (!response.ok) {
      return reply.status(400).send({ status: 'error', message: 'Failed to unblock user.' });
    }
    const data = await response.json();
    if (data.success !== true) {
      return reply.status(400).send({ status: 'error', message: 'Failed to unblock user.' });
    }

    // send the unblock user event to the specific user
    sendBlockEventToUser(from.toString(), "unblockUser", to.toString());
    reply
      .status(200)
      .send({ status: "ok", message: "User unblocked successfully.", blockUser: false });
  } catch (error) {
    console.error("Error unblocking user:", error);
    return reply
    .status(400)
    .send({ status: "error", message: "Bad request! hhhhhh 5" });
  }
}


// this function will be used to delete a message in chat
export async function deleteMessage(request: FastifyRequest, reply: FastifyReply) {
  try {

    if (!checkRequestBody(reply, request)) {
      return;
    }
    
    // Uncomment the line below when you have user authentication middleware
    // const from = request.user; // Assuming you have user authentication middleware

    // Extract the IdMessage from the request parameters
    const { messageId } = request.params as { messageId: string };
    // check if the IdMessage is provided
    if (!messageId) {
      return reply
        .status(400)
        .send({ status: "error", message: "Invalid request. Please provide IdMessage." });
    }
    
    const { from, to } = request.body as MessageRequestBody;
    
    if (!checkIds(reply, from, to, "You cannot delete a message with yourself.")) {
      return; // If the IDs are invalid, exit the function
    }

    if (!(await checkUserExists(reply, to))) {
      return; // If the user does not exist, exit the function
    }

    if (!(await checkFriendship(reply, from, to, "You can only delete messages with friends.", false))) {
      return; // If the users are not friends, exit the function
    }


    if (!(await checkMessageId(reply, messageId, from, to))) {
      return; // If the message ID is invalid, exit the function
    }

    if (!(await deleteMessageFromDatabase(reply, messageId))) {
      return; // If the message could not be deleted, exit the function
    }

    sendDeleteOrUpdateMessageEventToUser(to.toString(), from.toString() ,"deleteMessage", messageId, "");

    return reply;

  } catch (error) {
    console.error("Error deleting message:", error);
    return reply
      .status(400)
      .send({ status: "error", message: "Bad request! hhhhhh 6" });
  }
}

// this function will be used to edit a message in chat
export async function editMessage(request: FastifyRequest, reply: FastifyReply) {
  try {

    if (!checkRequestBody(reply, request)) {
      return;
    }

    // Uncomment the line below when you have user authentication middleware
    // const from = request.user; // Assuming you have user authentication middleware

    // Extract the IdMessage from the request parameters
    const { messageId } = request.params as { messageId: string };
    // check if the IdMessage is provided
    if (!messageId) {
      return reply
        .status(400)
        .send({ status: "error", message: "Invalid request. Please provide IdMessage." });
    }

    const { from, to, message } = request.body as MessageRequestBody;
    
    if (!checkIds(reply, from, to, "You cannot edit a message with yourself.")) {
      return; // If the IDs are invalid, exit the function
    }

    if (!(await checkUserExists(reply, to))) {
      return; // If the user does not exist, exit the function
    }

    if (!(await checkFriendship(reply, from, to, "You can only edit messages with friends.", false))) {
      return; // If the users are not friends, exit the function
    }

    if (!(await checkMessageId(reply, messageId, from, to))) {
      return; // If the message ID is invalid, exit the function
    }

    const trimmedMessage = message.trim();
    
    if (!checkMessageRequestBody(reply, trimmedMessage)) {
      return; // If the message is invalid, exit the function
    }

    // const stmt = db.prepare(`
    //         UPDATE messages
    //         SET message = ?
    //         WHERE id = ? AND sender_id = ? AND receiver_id = ?
    //     `);

    const timeUpdateMessage = getTime();

    // const info = stmt.run(trimmedMessage, messageId, from, to);

    // if (info.changes === 0) {
    //   return reply.status(404).send({ status: "error", message: "Message not found or you are not authorized to edit it." });
    // }
    // console.log("Message updated successfully:", info);

    const response = await fetch(ApidataBase.editMsg, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, messageId, newMessage: trimmedMessage }),
    });

    if (!response.ok) {
      return reply.status(400).send({ status: 'error', message: 'Failed to edit message.' });
    }

    const data = await response.json();
    if (data.success !== true) {
      return reply.status(400).send({ status: 'error', message: 'Failed to edit message.' });
    }

    sendDeleteOrUpdateMessageEventToUser(to.toString(), from.toString() ,"editMessage", messageId, trimmedMessage);

    return reply.status(200).send({status: "ok", message: "Message edited successfully.", time: timeUpdateMessage.slice(11, 16)});

  } catch (error) {
    console.error("Error editing message:", error);
    return reply
      .status(400)
      .send({ status: "error", message: "Bad request! hhhhhh 7" });
  }
}