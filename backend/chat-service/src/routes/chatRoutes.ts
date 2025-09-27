// src/routes/messagesRoutes.ts
import { FastifyInstance } from 'fastify';
import { addMessage, blockUser, deleteMessage, editMessage, getFriends, getMessages, unblockUser } from '../controllers/chatController';
import { getFile, uploadFile } from '../controllers/uploadFilesController';

export async function chatRoutes(fastify: FastifyInstance) {

    // get all friends of the user
    fastify.post('/friends', getFriends); // should be a GET request, but for simplicity we use POST here

    // Define a route for adding a message between two users
    fastify.post('/addmsg', addMessage);

    // get all messages between two users
    fastify.post('/getmsgs', getMessages);


    // send file route
    fastify.post('/sendfile/:from/:to', uploadFile);

    // get file route
    fastify.get('/uploads/*', getFile);

    // block user route
    fastify.post('/blockuser', blockUser);

    // unblock user route
    fastify.post('/unblockuser', unblockUser);

    // delete message route
    fastify.post('/deletemsg/:messageId', deleteMessage);

    // edit message route
    fastify.post('/editmsg/:messageId', editMessage);
}