import { FastifyRequest, FastifyReply } from "fastify";
// import db from "../db/connectiondb";
import { MessageRequestBody, MessageRow, Message } from "../types/message";
import {
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
  checkAuthenticatedUser,
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

    if (!checkAuthenticatedUser(reply, userId, request.user?.id)) {
      return;
    }

    // check if the user exists in the database
    if (!(await checkUserExists(reply, userId))) {
      return; // If the user does not exist, exit the function
    }

    const friends = await getAllFriends(userId);
    // console.log("Friends fetched from database:", friends);

    reply.status(200).send({ status: "ok", friends });
  } catch (error) {
    // console.error("Error fetching friends:", error);
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


    if (!checkIds(reply, from, to, "You cannot send a message to yourself.")) {
      return; // If the IDs are invalid, exit the function
    }
    // check if from user is not the same as to user
   if (!checkAuthenticatedUser(reply, from, request.user?.id)) {
      return;
   }
    
    const trimmedMessage = message.trim();
        
    // check the message is valid
    if (!checkMessageRequestBody(reply, trimmedMessage)) {
      return; // If the message is invalid, exit the function
    }

    if (!(await checkUserExists(reply, to))) {
      return; // If the user does not exist, exit the function
    }

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

    // console.log("Message received from:", from, "to:", to, "message:", trimmedMessage);

    // Insert the message into the database
    const messageData = await insertMessageToDatabase(reply, from, to, trimmedMessage);
    if (!messageData) {
      return; // If the message could not be inserted, exit the function
    }

    // send to the sender all sessions that the message was sent successfully
  sendMessageToUser(from.toString(), messageData); 
  // send the message via socket io 
  messageData.sent = false; // Mark the message as sent
  sendMessageToUser(to.toString(), messageData);
  return reply;

  } catch (error) {
    // console.error("Error adding message:", error);
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

    if (!checkIds(reply, from, to, "You cannot fetch messages with yourself.")) {
      return; // If the IDs are invalid, exit the function
    }

    if (!checkAuthenticatedUser(reply, from, request.user?.id)) {
      return;
    }



    if (!(await checkUserExists(reply, to))) {
      return; // If the user does not exist, exit the function
    }


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


    // console.log("Fetching messages from:", from, "to:", to);

    const messages = await getFormattedMessages(reply, from, to, limit, offset);
    // console.log("Messages fetched:", messages);

    reply.status(200).send({ status: "ok", messages });
  } catch (error) {
    // console.error("Error fetching messages:", error);
    return reply
      .status(400)
      .send({ status: "error", message: "Bad request! hhhhhh 3" });
  }
}

// this function will be used to block a user in chat
// it will update the status of the friendship to 'blocked'
export async function blockUser(request: FastifyRequest, reply: FastifyReply) {

  // to remove 
  // console.log("Blocking user request body:", request.body);
  try {

    if (!checkRequestBody(reply, request)) {
      return;
    }

    const { from, to } = request.body as MessageRequestBody;

    if (!checkIds(reply, from, to, "You cannot block yourself.")) {
      return; // If the IDs are invalid, exit the function
    }

    if (!checkAuthenticatedUser(reply, from, request.user?.id)) {
      return;
    }


    if (!(await checkFriendship(reply, from, to, "You can only block friends.", true))) {
      return; // If the users are not friends, exit the function
    }

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
    // console.error("Error blocking user:", error);
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

    if (!checkIds(reply, from, to, "You cannot unblock yourself.")) {
      return; // If the IDs are invalid, exit the function
    }

    if (!checkAuthenticatedUser(reply, from, request.user?.id)) {
      return;
    }


    if (!(await checkFriendship(reply, from, to, "You can only unblock friends.", false))) {
      return; // If the users are not friends, exit the function
    }

    if (!(await checkUserBlockedBy(reply, from, to))) {
      return ;
    }


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
    // console.error("Error unblocking user:", error);
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

    if (!checkAuthenticatedUser(reply, from, request.user?.id)) {
      return;
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
    // console.error("Error deleting message:", error);
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

    if (!checkAuthenticatedUser(reply, from, request.user?.id)) {
      return;
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

    const timeUpdateMessage = getTime();

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
    // console.error("Error editing message:", error);
    return reply
      .status(400)
      .send({ status: "error", message: "Bad request! hhhhhh 7" });
  }
}