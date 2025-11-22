// this file is used to handle socket connections and events
import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer} from "http";
import db from "../db/connectiondb";
import { blob } from "stream/consumers";
import { getTime } from "../utils/getTime";

let ioInstance: SocketIoServer | null = null;


// this Map is used to store online users
// key is user ID, value is socket ID
// this allows us to track which user is connected to which socket
const onlineUsers = new Map<string, Set<string>>();

// this function sets up the socket.io server
// it takes an HTTP server as an argument and returns the socket.io server instance
export function setupSocket(server: HttpServer) {
  const io = new SocketIoServer(server, {
    cors: {
      origin: ["http://localhost:3000", "http://10.32.125.111:3000"],
      methods: ["GET", "POST"],
    },
  });

    ioInstance = io;  // ✅ save for later global access

  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);

    // add the new user to the online users map
    // assuming the user ID is sent in the handshake query
    const userId = socket.handshake.query.userId as string;
     if (userId) {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId)!.add(socket.id);
      console.log(`User ${userId} connected on socket ${socket.id}`);

      // Set the online status in the database
      await setOnlineTodb(userId, true, false);
    }

    console.log("Online users:", onlineUsers);

    // Emit the updated list of online users to all clients
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    // Handle incoming messages
    socket.on("message", (data) => {
      console.log("Message received:", data);
      // Broadcast the message to all connected clients
      io.emit("message", data);
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log("A user disconnected:", socket.id);
     // Remove socket from all users
      for (const [uid, sockets] of onlineUsers) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(uid);
        }
      }

      // Emit the updated list of online users to all clients
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      // Set the online status in the database
      await setOnlineTodb(userId, false, true);

      console.log(`keys of onlineUsers after disconnection:`, Array.from(onlineUsers.keys()));
      console.log("Online users after disconnection:", onlineUsers);
    });
  
  
  // --- WEB RTC SIGNALING EVENTS ---

    // A user wants to initiate a call
    socket.on('call-user', (data) => {
      const { to, offer, from, type, fromName } = data;
      const targetSockets = onlineUsers.get(to.toString());
      
      if (targetSockets) {
        targetSockets.forEach(socketId => {
          // Forward the offer to the user being called
          io.to(socketId).emit('call-made', { offer, from, fromName, type });
        });
      }
    });

    // A user has answered the call
    socket.on('make-answer', (data) => {
      const { to, answer } = data;
      const targetSockets = onlineUsers.get(to.toString());
      const answererId = socket.handshake.query.userId as string;

      if (targetSockets) {
        targetSockets.forEach(socketId => {
          // Forward the answer back to the original caller
          io.to(socketId).emit('answer-made', { answer, from: socket.handshake.query.userId });
        });
      }

      const answererSockets = onlineUsers.get(answererId);
      if (answererSockets) {
        console.log("==========> Emitting call-accepted to answerer:", answererId);
        answererSockets.forEach(socketId => {
          io.to(socketId).emit('call-accepted', { from: answererId, to });
        });
      }

    });

    // A user has generated a network candidate
    socket.on('ice-candidate', (data) => {
      const { to, candidate } = data;
      const targetSockets = onlineUsers.get(to.toString());

      if (targetSockets) {
        targetSockets.forEach(socketId => {
          // Forward the ICE candidate to the other peer
          io.to(socketId).emit('ice-candidate', { candidate, from: socket.handshake.query.userId });
        });
      }
    });

    // A user has ended the call
    socket.on('end-call', (data) => {
      console.log("Call ended by user:", data);
      const { to, from } = data;
      const targetSockets = onlineUsers.get(to.toString());

      if (targetSockets) {
        targetSockets.forEach(socketId => {
          io.to(socketId).emit('end-call', {to: to, from: from});
        });
      }
      else {
        console.log(`User ${to} is not online, cannot end call.`);
      }
    });

    // A user rejected the call
    socket.on('call-rejected', (data) => {
        const { to } = data;
        const targetSockets = onlineUsers.get(to.toString());
        const rejectorId = socket.handshake.query.userId as string;


        if(targetSockets) {
            targetSockets.forEach(socketId => {
                io.to(socketId).emit('call-rejected');
            });
        }

        // Notify the rejector in all their sessions
        const rejectorSockets = onlineUsers.get(rejectorId);
        if (rejectorSockets) {
          rejectorSockets.forEach(socketId => {
            io.to(socketId).emit('call-rejected', { from: rejectorId, to });
          });
        }
    });});

  console.log("Socket.io server is set up and listening for connections.");
}

export function getSocketIoServer(): SocketIoServer | null {
  return ioInstance;
}

// this function is used to send a message to a specific user
export function sendMessageToUser(userId: string, message: any) {
  const sockets = onlineUsers.get(userId);
  console.log(`Sending message to user ${userId}:`, message);
  if (sockets) {
    sockets.forEach((socketId) => {
      ioInstance?.to(socketId).emit("receive-message", message);
    });
    console.log(`Message sent to user ${userId}:`, message);
  } else {
    console.log(`User ${userId} is not online.`);
  }
}

// send the event block or unblock user to the specific user
// export function sendBlockEventToUser(userId: string, event: string, friendId: string) {
//   const sockets = onlineUsers.get(friendId); 
//   console.log("=====> sockets:", sockets);
//   console.log("onlineUsers:", onlineUsers);
//   console.log(`Sending ${event} event to user ${friendId} for contact ${userId}`);
//   if (sockets) {
//     sockets.forEach((socketId) => {
//       ioInstance?.to(socketId).emit(event, {
//         userId, // the user who blocked or unblocked
//         friendId, // the user who is blocked or unblocked
//       }); // !to change to friendId
//     });
//     console.log(`Event ${event} sent to user ${friendId} for contact ${userId}`);
//   } else {
//     console.log(`User ${friendId} is not online.`);
//   }
// }
// /backend/controllers/blockUser.ts

export function sendBlockEventToUser(userId: string, event: string, friendId: string) {
  const friendSockets = onlineUsers.get(friendId);
  const userSockets = onlineUsers.get(userId);

  console.log(`[sendBlockEventToUser] Emitting ${event} event`);
  console.log(`→ To blocker (${userId}) sockets:`, userSockets);
  console.log(`→ To blocked (${friendId}) sockets:`, friendSockets);

  // Notify the blocked user (userB)
  if (friendSockets) {
    friendSockets.forEach((socketId) => {
      ioInstance?.to(socketId).emit(event, {
        userId,      // who blocked
        friendId,    // who got blocked
      });
    });
  } else {
    console.log(`User ${friendId} is not online.`);
  }

  // 🔥 Also notify the blocker (userA) in all their sessions
  if (userSockets) {
    userSockets.forEach((socketId) => {
      ioInstance?.to(socketId).emit(event, {
        userId,      // who blocked
        friendId,    // who got blocked
      });
    });
  } else {
    console.log(`User ${userId} is not online.`);
  }

  console.log(`Event ${event} emitted to both users.`);
}


// this function will be used to set the online status of a user in back-end
export async function setOnlineTodb(userId: string, status: boolean, updateLastSeen: boolean) {

  console.log(`Setting online status for user ${userId} to ${status}`);

  // let stmt;
  // let result;
  // if (updateLastSeen) { 
  //     stmt = db.prepare(`UPDATE users SET online = ?, last_seen = ? WHERE id = ?`);
  //     result = stmt.run(status ? 1 : 0, getTime(), userId);
  // } else {
  //     stmt = db.prepare(`UPDATE users SET online = ? WHERE id = ?`);
  //     result = stmt.run(status ? 1 : 0, userId);
  // }

  // if (result.changes === 0) {
  //   console.log(`Failed to update online status for user ${userId}`);
  // } else {
  //   console.log(`User ${userId} online status updated to ${status}`);
  // }

  try {
        // send the request to db-service
      const res = await fetch('http://db-service:5000/api/chat/setOnlineStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, status, updateLastSeen, time: getTime() }),
      });

      if (!res.ok) {
        console.log(`Failed to update online status for user ${userId}`);
      }
      else {
        console.log(`User ${userId} online status updated to ${status}`);
      }
  } catch (error) {
      console.error('Error updating online status:', error);
  }

}

// this function will be used to send the event delete message or update a message to the specific user
export function sendDeleteOrUpdateMessageEventToUser(userId: string, from: string ,event: string, messageId: string, Updatemessage: string) {
  const sockets = onlineUsers.get(userId);
  const fromSockets = onlineUsers.get(from);
  console.log(`Sending ${event} event to user ${userId} for message ${messageId}`);
  if (sockets) {
    sockets.forEach((socketId) => {
      ioInstance?.to(socketId).emit(event, {
        from, // the user who sent the message
        userId,
        messageId,
        Updatemessage
      });
    });
    console.log(`Event ${event} sent to user ${userId} for message ${messageId}`);
  } else {
    console.log(`User ${userId} is not online.`);
  }

  // 🔥 Also notify the sender (from) in all their session
  if (fromSockets) {
    fromSockets.forEach((socketId) => {
      ioInstance?.to(socketId).emit(event, {
        from, // the user who sent the message
        userId,
        messageId,
        Updatemessage
      });
    });
    console.log(`Event ${event} sent to sender ${from} for message ${messageId}`);
  } else {
    console.log(`Sender ${from} is not online.`);
  }
}