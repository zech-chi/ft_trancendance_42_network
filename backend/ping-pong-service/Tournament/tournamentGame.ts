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
  //console.log(`📋 User ${userId} state updated to: ${state}`);
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
  
  //console.log(`🧹 Cleaned up invitation ${inviteId} between users ${fromUserId} and ${toUserId}`);
}

export async function  createTornamentGame(tournamentId: string, tournamentSystem: TournamentSystem, io: SocketIOServer ) {
    //console.log("2 ->>>>> tournament id : ", tournamentId);

    // player at index 0 vs player at index 1 of joinedPlayers --> Room1
    // and player at index 2 vs player at index 3  join Room1 as spectators
    // and so on...

    const tournament = tournamentSystem.getTournament(tournamentId);
    if (!tournament) {
        //console.error(`❌ Tournament with ID ${tournamentId} not found.`);
        return;
    }
    const joinedPlayers = tournament.getJoinedPlayersIds();
    //console.log("3 ->>>>> joinedPlayers : ", joinedPlayers);
    for (let i = 0; i < joinedPlayers.length; i += 2) {
        const player1Id = joinedPlayers[i];
        const player2Id = joinedPlayers[i + 1];

        // const roomId = `tournament-game-${tournamentId}-room-${i/2}-${uuidv4()}`;
        // //console.log(`🎮 Creating game room ${roomId} for players ${player1Id} and ${player2Id}`);

        // Here you would create the game room, initialize game state, etc.
        // For simplicity, we'll just emit an event to the players to join the room.

        //console.log(`🚀 Emitting tournament_game_starting to players ${player1Id}  ---------VS--------- ${player2Id} in tournament ${tournamentId}`);
        io.to(tournamentId).emit("tournament_game_starting", 
        {
          message: "Tournament game is starting!",
          reciverId: player1Id,
          opponentId: player2Id,
          spectators: joinedPlayers.filter((id, index) => index !== i && index !== i + 1)
        });
        // Additional logic to actually start the game can be added here
    }
}


export async function  createTornamentGameFinal(tournamentId: string, tournamentSystem: TournamentSystem, io: SocketIOServer ) {
  //console.log("2 ->>>>> tournament id : ", tournamentId);

  // player at index 0 vs player at index 1 of joinedPlayers --> Room1
  // and player at index 2 vs player at index 3  join Room1 as spectators
  // and so on...

  const tournament = tournamentSystem.getTournament(tournamentId);
  if (!tournament) {
      //console.error(`❌ Tournament with ID ${tournamentId} not found.`);
      return;
  }
  const joinedPlayers = tournament.getJoinedPlayersIds();
  const finalPlayerIds = tournament.getFinalPlayersIds();
  //console.log("3 ->>>>> finalPlayerIds : ", finalPlayerIds);
  for (let i = 0; i < finalPlayerIds.length; i += 2) {
      const player1Id = finalPlayerIds[i];
      const player2Id = finalPlayerIds[i + 1];

      // const roomId = `tournament-game-${tournamentId}-room-${i/2}-${uuidv4()}`;
      // //console.log(`🎮 Creating game room ${roomId} for players ${player1Id} and ${player2Id}`);

      // Here you would create the game room, initialize game state, etc.
      // For simplicity, we'll just emit an event to the players to join the room.

      //console.log(`🚀 Emitting tournament_game_starting to players ${player1Id}  ---------VS--------- ${player2Id} in tournament ${tournamentId}`);
      io.to(tournamentId).emit("tournament_game_starting", 
      {
        message: "Tournament game is starting!",
        reciverId: player1Id,
        opponentId: player2Id,
        spectators: joinedPlayers.filter((id, index) => index !== i && index !== i + 1)
      });
      // Additional logic to actually start the game can be added here
  }
}
