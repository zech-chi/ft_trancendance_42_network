import Fastify from "fastify";
import { Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";
// import db from "./DataBase/db"; // Assuming this path is correct for your database connection
import { FastifyInstance } from "fastify/types/instance";
import { v4 as uuidv4 } from "uuid";
import { on } from "events";
import { TournamentSystem } from "./TournamentSystem";

interface Player {
  id: number;
  username: string;
  side: "left" | "right";
  paddleY: number;
  score: number;
  lastUpdate: number; // Timestamp for last paddle update
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface GameRoom {
  players: Player[];
  ball: Ball;
  width: number;
  height: number;
  paddleWidth: number;
  paddleHeight: number;
  maxScore: number;
  interval?: NodeJS.Timeout;
  isRunning: boolean;
  lastStateUpdate: number; // For throttling game state broadcasts
  gameEnded: boolean; // Flag to prevent disconnect messages after natural game end
}

interface GameSettings {
  maxScore: number;
  paddle: string; // e.g., "small", "medium", "large"
  bgTable: string; // URL or identifier for table background
  ball: string; // URL or identifier for ball sprite
}

const rooms: Map<string, GameRoom> = new Map();
const playerRooms: Map<number, string> = new Map(); // Map userId to roomId for quick lookup
const inviteLocks: Set<string> = new Set(); // Prevent race conditions in invitations
const pendingInvitations: Map<number, { from: number; timestamp: number; inviteId: string }> = new Map(); // Track pending invitations
const userInvitationStates: Map<number, 'available' | 'sending' | 'pending_response' | 'in_game'> = new Map(); // Track user states

// Helper functions for invitation management
function generateInviteId(): string {
  return `invite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function updateUserState(userId: number, state: 'available' | 'sending' | 'pending_response' | 'in_game') {
  userInvitationStates.set(userId, state);
  console.log(`📋 User ${userId} state updated to: ${state}`);
}

function getUserState(userId: number): 'available' | 'sending' | 'pending_response' | 'in_game' {
  return userInvitationStates.get(userId) || 'available';
}

function cleanupInvitation(inviteId: string, fromUserId: number, toUserId: number) {
  // Remove pending invitation
  pendingInvitations.delete(toUserId);
  
  // Reset user states to available
  updateUserState(fromUserId, 'available');
  updateUserState(toUserId, 'available');
  
  console.log(`🧹 Cleaned up invitation ${inviteId} between users ${fromUserId} and ${toUserId}`);
}


// 🔹 Game state update function (runs periodically for each active game room)
// function updateGameState(roomId: string, room: GameRoom) {
//     const { ball, players, width, height, paddleWidth, paddleHeight } = room;
//     if (!room.isRunning) return;

//     const now = Date.now();
    
//     // Optimized for 120 FPS for smoother gameplay
//     if (now - room.lastStateUpdate < 8) { // ~1000ms / 120fps = 8.33ms
//       return; 
//     }
//     room.lastStateUpdate = now;

//     // 1. Update ball position
//     ball.x += ball.dx;
//     ball.y += ball.dy;

//     // 2. Collision with top/bottom walls
//     if (ball.y <= 0 || ball.y >= height) {
//       ball.dy = -ball.dy;
//       // Ensure ball doesn't get stuck
//       ball.y = ball.y <= 0 ? 1 : height - 1;
//     }

//     // 3. Collision with paddles
//     players.forEach((player) => {
//       const paddleX = player.side === "left" ? 0 : width - paddleWidth;
//       const paddleRight = paddleX + paddleWidth;
//       const paddleTop = player.paddleY;
//       const paddleBottom = player.paddleY + paddleHeight;

//       // Simple AABB collision detection
//       if (
//         ball.x >= paddleX && // Ball's right edge past paddle's left edge
//         ball.x <= paddleRight && // Ball's left edge before paddle's right edge
//         ball.y >= paddleTop && // Ball's bottom edge past paddle's top edge
//         ball.y <= paddleBottom // Ball's top edge before paddle's bottom edge
//       ) {
//         // Reverse horizontal direction and slightly increase speed
//         ball.dx = -ball.dx * 1.02; // Small speed boost

//         // Adjust vertical direction based on where the ball hit the paddle
//         const hitPos = (ball.y - paddleTop) / paddleHeight - 0.5; // -0.5 to 0.5
//         ball.dy = hitPos * 8; // Adjust angle, 8 is a sensitivity factor

//         // Prevent ball from getting stuck in paddle (push it out slightly)
//         if (player.side === "left") {
//           ball.x = paddleRight + 1;
//         } else {
//           ball.x = paddleX - 1;
//         }
//       }
//     });

//     // 4. Check for scoring
//     let scored = false;
//     let scorer: Player | undefined;

//     if (ball.x < 0) { // Ball went past left wall
//       scorer = players.find((p) => p.side === "right");
//       if (scorer) {
//         scorer.score++;
//         scored = true;
//       }
//     } else if (ball.x > width) { // Ball went past right wall
//       scorer = players.find((p) => p.side === "left");
//       if (scorer) {
//         scorer.score++;
//         scored = true;
//       }
//     }

//     if (scored && scorer) {
//       resetBall(room); // Reset ball position and direction
//       // Emit a specific event for score updates
//       io.to(roomId).emit("score_updated", { 
//         players: room.players,
//         scorer: scorer.id,
//         timestamp: now
//       });
//       console.log(`⚽ Score! ${scorer.username} has ${scorer.score} points.`);
//     }

//     // 5. Broadcast game state to all players in the room
//     io.to(roomId).emit("game_state", { 
//       ball: { ...ball }, 
//       players: room.players.map(p => ({ ...p })), // Deep copy to avoid direct mutation issues
//       timestamp: now
//     });


//     // 6. Check for game end condition
//     const winner = players.find((p) => p.score >= room.maxScore);
//     if (winner) {
//       // Set flag to prevent disconnect messages from overriding win message
//       room.gameEnded = true;
      
//       if (room.interval) {
//         clearInterval(room.interval);
//         room.interval = undefined;
//       }
//       room.isRunning = false; // Stop the game loop

//       // this should be handled by the fetch in the db-service
//       // Store the match result in the database
//       // try {
//       //   const player1 = room.players[0];
//       //   const player2 = room.players[1];
        
//       //   const insertMatch = db.prepare(`
//       //     INSERT INTO matches (game_type, player1_id, player2_id, score_player1, score_player2, winner_id)
//       //     VALUES (?, ?, ?, ?, ?, ?)
//       //   `);
        
//       //   insertMatch.run(
//       //     'pingpong',
//       //     player1.id,
//       //     player2.id,
//       //     player1.score,
//       //     player2.score,
//       //     winner.id
//       //   );
        
//       //   console.log(`💾 Match result stored: ${player1.username} (${player1.score}) vs ${player2.username} (${player2.score}), Winner: ${winner.username}`);
//       // } catch (error) {
//       //   console.error('❌ Error storing match result:', error);
//       // }

//       // Reset player states to available
//       room.players.forEach(player => {
//         updateUserState(player.id, 'available');
//       });

//       io.to(roomId).emit("game_ended", { 
//         winner,
//         finalScore: room.players.map(p => ({ id: p.id, username: p.username, score: p.score })),
//         reason: "max_score_reached",
//         timestamp: now
//       });
//       console.log(`🏆 Game in room ${roomId} ended. Winner: ${winner.username}`);
      
//       // Force cleanup of any orphaned states after game ends
//       setTimeout(() => {
//         cleanupOrphanedStates();
//       }, 1000);
      
//       // Clean up the room after a short delay to allow clients to receive final state
//       setTimeout(() => {
//         if (rooms.has(roomId)) {
//           rooms.delete(roomId);
//           room.players.forEach(p => playerRooms.delete(p.id));
//           console.log(`🗑️ Room ${roomId} fully removed.`);
//         }
//       }, 10000); // 10 seconds delay
//     }
// }

// Function to reset ball to center with random initial direction
// function resetBall(room: GameRoom) {
//     room.ball = {
//         x: room.width / 2,
//         y: room.height / 2,
//         dx: (Math.random() > 0.5 ? 6 : -6), // Random horizontal direction
//         dy: (Math.random() - 0.5) * 6, // Random vertical angle
//     };
//     console.log("🔄 Ball reset:", room.ball);
// }

export async function  createTornamentGame(tournamentId: string, tournamentSystem: TournamentSystem, io: SocketIOServer ) {
    console.log("2 ->>>>> tournament id : ", tournamentId);
    io.to(tournamentId).emit("tournament_game_starting", { message: "Tournament game is starting!" });
}



// export function createTornamentGame(socket: Socket) {
//     socket.on("start_tournament_game", () => {
//         console.log("🎮 Registering game events for:", socket.id);
//     });

//     // 🔹 Handle paddle movement from clients (optimized for 120 FPS)
//     socket.on("move_paddle", ({ roomId, yPosition, timestamp }) => {
//         const room = rooms.get(roomId);
//         if (!room || !room.isRunning) {
//           socket.emit("paddle_move_rejected", { reason: "Game not running or room not found" });
//           return;
//         }
  
//         const player = room.players.find((p) => p.id === socket.data.user?.id);
//         if (!player) {
//           socket.emit("paddle_move_rejected", { reason: "Player not found in room" });
//           return;
//         }
  
//         // Prevent data race: Check if this update is newer than the last one
//         if (timestamp && timestamp < player.lastUpdate) {
//           return; // Ignore older updates
//         }
  
//         const newY = Math.max(0, Math.min(room.height - room.paddleHeight, yPosition));
        
//         // Anti-cheat: limit max paddle movement per frame (adjusted for 120 FPS)
//         const maxMovement = 25; // Reduced for higher FPS
//         if (Math.abs(newY - player.paddleY) > maxMovement) {
//           socket.emit("paddle_move_rejected", { 
//             reason: "Movement too large",
//             current: player.paddleY,
//             attempted: newY
//           });
//           return;
//         }
  
//         // Atomic update to prevent race conditions
//         player.paddleY = newY;
//         player.lastUpdate = Date.now();
  
//         // Immediate broadcast for low latency (will be throttled by game loop)
//         io.to(roomId).emit("paddle_moved", {
//           playerId: player.id,
//           yPosition: player.paddleY,
//           side: player.side,
//           timestamp: player.lastUpdate,
//           authoritative: true
//         });
//     });

//     // 🔹 Handle client disconnect (browser closed, tab closed, network issue)
//     socket.on("disconnect", async () => {
//         console.log("❌ Client disconnected:", socket.id);
    
//         if (socket.data.user) {
//             const userId = socket.data.user.id;
            
//             try {
//             // this should be handled by the fetch in the db-service
//             // Update user state in DB
//             // await db
//             //   .prepare("UPDATE users SET state='offline' WHERE id=?")
//             //   .run(userId);
            
//             onlineUsers.delete(userId); // Remove from online users map
            
//             // Check if the disconnected user was in a game FIRST
//             const roomId = playerRooms.get(userId);
//             const wasInActiveGame = roomId && rooms.has(roomId);
            
//             // Clean up any pending invitations involving this user
//             // BUT preserve invitations if user was in an active game
//             const userPendingInvite = pendingInvitations.get(userId);
//             if (userPendingInvite) {
//                 if (wasInActiveGame) {
//                 // User was in an active game - DON'T clean up the invitation
//                 // Just notify the inviter that user temporarily left during game
//                 console.log(`⚠️ User ${socket.data.user.username} disconnected during active game. Keeping invitation ${userPendingInvite.inviteId} pending.`);
                
//                 const inviterSocketId = onlineUsers.get(userPendingInvite.from);
//                 if (inviterSocketId) {
//                     io.to(inviterSocketId).emit("invite_status_update", {
//                     inviteId: userPendingInvite.inviteId,
//                     status: "player_left_during_game",
//                     message: "Player temporarily left during game. Invitation remains pending."
//                     });
//                 }
//                 } else {
//                 // User had a pending invitation but wasn't in active game, clean it up normally
//                 cleanupInvitation(userPendingInvite.inviteId, userPendingInvite.from, userId);
                
//                 // Notify the inviter that the invitation was cancelled due to disconnect
//                 const inviterSocketId = onlineUsers.get(userPendingInvite.from);
//                 if (inviterSocketId) {
//                     io.to(inviterSocketId).emit("invite_cancelled", {
//                     reason: "target_disconnected",
//                     inviteId: userPendingInvite.inviteId,
//                     message: "User disconnected"
//                     });
//                 }
//                 }
//             }
            
//             // Also check if this user was the sender of any pending invitations
//             for (const [targetUserId, invitation] of pendingInvitations.entries()) {
//                 if (invitation.from === userId) {
//                 // Check if the target user is in an active game
//                 const targetRoomId = playerRooms.get(targetUserId);
//                 const targetInActiveGame = targetRoomId && rooms.has(targetRoomId);
                
//                 if (targetInActiveGame) {
//                     // Target is in active game - keep invitation pending
//                     console.log(`⚠️ Invitation sender ${socket.data.user.username} disconnected but target is in active game. Keeping invitation ${invitation.inviteId} pending.`);
                    
//                     const targetSocketId = onlineUsers.get(targetUserId);
//                     if (targetSocketId) {
//                     io.to(targetSocketId).emit("invite_status_update", {
//                         inviteId: invitation.inviteId,
//                         status: "sender_disconnected_during_game",
//                         message: "Invitation sender disconnected. Invitation remains pending."
//                     });
//                     }
//                 } else {
//                     // Target not in active game - clean up normally
//                     cleanupInvitation(invitation.inviteId, userId, targetUserId);
                    
//                     // Notify the target that the invitation was cancelled
//                     const targetSocketId = onlineUsers.get(targetUserId);
//                     if (targetSocketId) {
//                     io.to(targetSocketId).emit("invite_cancelled", {
//                         reason: "sender_disconnected",
//                         inviteId: invitation.inviteId,
//                         message: "Sender disconnected"
//                     });
//                     }
//                 }
//                 }
//             }
            
//             // Remove user state only if not preserving invitations due to active game
//             if (!wasInActiveGame) {
//                 userInvitationStates.delete(userId);
//             }
            
//             // Handle game room cleanup
//             if (roomId) {
//                 const room = rooms.get(roomId);
//                 if (room) {
//                 // Only send disconnect message if game hasn't already ended naturally
//                 if (!room.gameEnded) {
//                     // Stop the game for this room
//                     if (room.interval) {
//                     clearInterval(room.interval);
//                     room.interval = undefined; // Clear interval reference
//                     }
//                     room.isRunning = false; // Mark game as not running
//                     room.gameEnded = true; // Mark as ended due to disconnect
    
//                     // Notify the OTHER player(s) in the room that the game has ended
//                     socket.to(roomId).emit("game_ended", {
//                     reason: "player_disconnected",
//                     disconnectedPlayer: socket.data.user.username,
//                     timestamp: Date.now()
//                     });
//                     console.log(`🛑 Game in room ${roomId} ended due to ${socket.data.user.username} disconnection.`);
                    
//                     // 🔧 FIX: Reset the disconnected player's state to available
//                     updateUserState(userId, 'available');
                    
//                     // 🔧 FIX: Reset ALL players in the room to available (since game ended)
//                     room.players.forEach(player => {
//                     if (player.id !== userId) { // Don't reset the disconnected player twice
//                         updateUserState(player.id, 'available');
//                         console.log(`🔄 Reset state to available for remaining player: ${player.username}`);
//                     }
//                     });
                    
//                     // Force cleanup of any orphaned states
//                     setTimeout(() => {
//                     cleanupOrphanedStates();
//                     }, 1000);
//                 } else {
//                     console.log(`⚠️ ${socket.data.user.username} disconnected but game already ended naturally.`);
//                 }
                
//                 // Clean up the room from memory after a short delay
//                 // This delay gives the client a chance to receive the game_ended event
//                 setTimeout(() => {
//                     if (rooms.has(roomId)) { // Check if it still exists before deleting
//                     rooms.delete(roomId);
//                     room.players.forEach(p => playerRooms.delete(p.id));
//                     console.log(`🗑️ Room ${roomId} cleaned up.`);
//                     }
//                 }, 5000); // 5 seconds to ensure client gets notification
//                 }
//                 playerRooms.delete(userId); // Remove player's room tracking
//             }
            
//             // 🔧 FIX: Always reset user state to available on disconnect
//             // (unless we're preserving invitations due to active game)
//             if (!wasInActiveGame) {
//                 updateUserState(userId, 'available');
//             }
//             } catch (error) {
//             console.error("❌ Error handling disconnect for user:", userId, error);
//             }
//         }
//     });

//     // 🔹 Handle a player explicitly leaving a game room
//     socket.on("leave_game", ({ roomId }: { roomId: string }) => {
//         const userId = socket.data.user?.id;
//         if (!userId) return;
    
//         socket.leave(roomId); // Remove socket from the room
        
//         const room = rooms.get(roomId);
//         if (room) {
//             // Only send leave message if game hasn't already ended naturally
//             if (!room.gameEnded) {
//             // Stop the game for this room
//             if (room.interval) {
//                 clearInterval(room.interval);
//                 room.interval = undefined;
//             }
//             room.isRunning = false;
//             room.gameEnded = true; // Mark as ended due to leave
    
//             // Notify the OTHER player(s) in the room
//             socket.to(roomId).emit("game_ended", {
//                 reason: "player_left",
//                 leftPlayer: socket.data.user.username,
//                 timestamp: Date.now()
//             });
//             console.log(`🚪 User ${socket.data.user.username} explicitly left game room ${roomId}.`);
            
//             // 🔧 FIX: Reset the leaving player's state to available
//             updateUserState(userId, 'available');
            
//             // 🔧 FIX: Reset ALL players in the room to available (since game ended)
//             room.players.forEach(player => {
//                 if (player.id !== userId) { // Don't reset the leaving player twice
//                 updateUserState(player.id, 'available');
//                 console.log(`🔄 Reset state to available for remaining player: ${player.username}`);
//                 }
//             });
            
//             // Force cleanup of any orphaned states
//             setTimeout(() => {
//                 cleanupOrphanedStates();
//             }, 1000);
//             } else {
//             console.log(`⚠️ ${socket.data.user.username} left but game already ended naturally.`);
//             }
    
//             // Clean up the room immediately (or after a very short delay)
//             setTimeout(() => {
//             if (rooms.has(roomId)) {
//                 rooms.delete(roomId);
//                 room.players.forEach(p => playerRooms.delete(p.id));
//                 console.log(`🗑️ Room ${roomId} cleaned up.`);
//             }
//             }, 1000);
//         }
//         playerRooms.delete(userId); // Remove player's room tracking
//     });
// }

// Synchronized invitation acceptance with race condition prevention
// socket.on("accept_invite", async ({ inviter, inviterName ,accepter, inviteId }) => {
//   try {
//     const roomId = `game-${uuidv4()}`;
//     const now = Date.now();

//     const gameRoom: GameRoom = {
//       players: [
//         { 
//           id: inviter, 
//           username: inviterName, 
//           side: "left", 
//           paddleY: 250, 
//           score: 0,
//           lastUpdate: now
//         },
//         { 
//           id: accepter.id, 
//           username: accepter.username, 
//           side: "right", 
//           paddleY: 250, 
//           score: 0,
//           lastUpdate: now
//         },
//       ],
//       ball: { x: 400, y: 300, dx: 6, dy: 3 },
//       width: 800,
//       height: 600,
//       paddleWidth: 15,
//       paddleHeight: 120,
//       maxScore: 8,
//       isRunning: false,
//       lastStateUpdate: now,
//       gameEnded: false // Initialize game end flag
//     };

//     // Atomic operations to prevent race conditions
//     rooms.set(roomId, gameRoom);
//     playerRooms.set(inviter, roomId);
//     playerRooms.set(accepter.id, roomId);

//     // Update user states to in_game
//     updateUserState(inviter, 'in_game');
//     updateUserState(accepter.id, 'in_game');

//     // Clean up the invitation
//     pendingInvitations.delete(accepter.id);

//     // Join both sockets to the room
//     io.to(inviterSocketId).socketsJoin(roomId);
//     io.to(accepterSocketId).socketsJoin(roomId);

//     const gameStartData = {
//       roomId,
//       players: gameRoom.players,
//       ball: gameRoom.ball,
//       gameState: "waiting",
//       inviteId: inviteId,
//       timestamp: now
//     };

//     // Send to room
//     io.to(roomId).emit("game_started", gameStartData);
//     console.log(`🎮 Game started event sent to room ${roomId} (invite: ${inviteId})`);

//     // Auto-start the game with proper synchronization
//     setTimeout(() => {
//       const room = rooms.get(roomId);
//       if (room && !room.isRunning) {
//         room.isRunning = true;
//         room.interval = setInterval(() => updateGameState(roomId, room), 8); // 120 FPS
//         io.to(roomId).emit("game_state_change", {
//           state: "playing",
//           timestamp: Date.now()
//         });
//         console.log(`🚀 Game auto-started in room ${roomId}`);
//       }
//     }, 2000);

//   } finally {
//     // Always release the lock after a delay to prevent rapid re-invites
//     setTimeout(() => {
//       inviteLocks.delete(lockKey);
//     }, 1000);
//   }
// });

