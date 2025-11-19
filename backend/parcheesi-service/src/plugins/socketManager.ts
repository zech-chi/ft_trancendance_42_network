// socketManager.ts
// io.to(roomName).emit(...) to send to all sockets in that room (including sender).
// socket.to(roomName).emit(...) to send to all sockets in the room except sender.


import { Server, Socket } from "socket.io";
import chalk from "chalk";
import { GameRoom } from "../game/gameRoom";
import localRoom from "../game/localRoom";
import { Player } from "../types/index";
import { randomUUID } from "crypto"; // to generate unique IDs
import { rooms, localRooms  } from "../game/GameManager";
// Store multiple rooms
export default async function socketManager(io: Server) {
  
  io.on("connection", (socket: Socket) => {
    console.log(chalk.green(`Client connected to main namespace: ${socket.id}`));
  });
  
  const remote = io.of("/games/parchisi/online");
  const local = io.of("/games/parchisi/local");
  remote.on("connection", (socket: Socket) => {
    console.log(chalk.green(`Client connected: ${socket.id}`));
    /**
     * When a player creates a new game
     */
    socket.on("createGame", (data: { username: string }) => {
      
      const usernameExists = Array.from(rooms.values()).some(room =>
        room.players.some(player => player.userName === data.username)
      );
    
      if (usernameExists) {
        socket.emit("error", { message: "User already in a room" });
        return; 
      }    
      const gameId = randomUUID(); // generate unique game id
      const room = new GameRoom(gameId, remote);
      rooms.set(gameId, room); // remove old room if there is only one player or game over or host leave or all players leave
      //check if the player name is already in this game or other games
      
      console.log(chalk.blue(`Game created with ID: ${gameId} by ${data.username} --> remote game`));
      // Join creator into room
      socket.join(room.id);

      const player: Player = room.newPlayer(data.username);
      room.addPlayer(player, socket);
      // 🔹 Emit the lobby info to creator
      socket.emit("lobbyUpdate", {
        gameId: room.id,
        hostId: room.sockets.get(room.players[0].id)?.id,
        players: room.players.map(p => ({
          id: room.sockets.get(p.id)?.id || '',
          userName: p.userName,
          isReady: p.isReady,
        })),
      });
      socket.emit("gameCreated", { gameId:gameId , hostId: room.sockets.get(room.players[0].id)?.id});
    });

    /**
     * When a player joins an existing game
     */
    socket.on("joinGame", (data: { gameId: string; username: string}) => {
      const room = rooms.get(data.gameId);

      if (!room) {
        socket.emit("error", { message: "Game not found" });
        return;
      }
      if (room?.gamestarted) {
        socket.emit("error", { message: "Game already started" });
        return;
      }
      
      if (room.players.length >= 4) {
        socket.emit("roomFull", { message: "Room is full" });
        return;
      }
      const usernameExists = Array.from(rooms.values()).some(room =>
        room.players.some(player => player.userName === data.username)
      );
    
      if (usernameExists) {
        socket.emit("error", { message: "User already in a room" });
        return; 
      } 
      socket.join(room.id);

      const player: Player = room.newPlayer(data.username);
      room.addPlayer(player, socket);
      socket.emit("gameJoined", { success: true });

        const lobbyData = {
          gameId: room.id,
          hostId:  room.sockets.get(room.players[0].id)?.id, // assume first player is host
          players: room.players.map(p => ({
            id: room.sockets.get(p.id)?.id || '',
            userName: p.userName,
            isReady: p.isReady,
          })),
        };
        room.broadcast("lobbyUpdate", lobbyData); // everyone in the room
        // socket.emit("lobbyUpdate", lobbyData); // the joining player too 

    });

    socket.on("readyToPlayX", async (data: { gameId: string; userName: string }) => {
      const room = rooms.get(data.gameId);
      if (!room) return;
      const player = room.players.find(p => p.userName === data.userName);
      if (!player)
        return;
      if (room.players.length < 2)
      {
        room.destroy();
        rooms.delete(data.gameId);
        socket.emit("error", { message: "Not enough players to start the game" });
        return;
      }
      room.readyPlayers++;
      if (room.readyPlayers === room.players.length)
        {
          await room.storeGameStartInDB();
          await room.startGame();
        }

    });



  
    socket.on("readyToPlay", (data: { gameId: string; username: string }) => {
      const room = rooms.get(data.gameId);
      if (!room) return;
        
      const player = room.players.find(p => p.userName === data.username);
      if (player) {
        player.isReady = true;
        // room.broadcast("playerReady", { username: data.username });
        room.broadcast("lobbyUpdate", {
          gameId: room.id,
          hostId: room.sockets.get(room.players[0].id)?.id, // assume first player is host  
          players: room.players.map(p => ({
            id: room.sockets.get(p.id)?.id || '',
            userName: p.userName,
            isReady: p.isReady,
          })),
        });
        
      }
    });

    
    socket.on("startGame", async(data: { gameId: string }) => {
      const room = rooms.get(data.gameId);
      if (!room)
      {
        console.log(chalk.red(`Game not found: ${data.gameId}`));
        socket.emit("error", { message: "Game not found" });
        return;
      }
      if (room.players.length < 2 && room.players.find(p => !p.isReady)) {
        socket.emit("error", { message: "Not all players are ready" });
        return;
        }
      room.broadcast("gameStarted", { gameId: room.id, players: room.players, board: room.board.toJSON(), currentPlayerId: room.currentPlayer });
    });


// need to implement a way to hundle if the player is not ready after a certain time

//need to hundle if leave the game before starting

    /**
     * Other events like requestRollDices, moveRequest, disconnect…
     * should now first check the correct room
     */
    socket.on("requestRollDices", async (data: { gameId: string}) => {
      const room = rooms.get(data.gameId);
      if (!room) return;

      const currentSocket = room.sockets.get(room.currentPlayer.id);
      if (!currentSocket || socket.id !== currentSocket.id) {
        socket.emit("error", { message: "Not your turn" });
        return;
      }

      await room.handleRollDice();

      if (room.gameOver) {
        await room.storeGameEndInDB(room.currentPlayer.userName);
          room.broadcast("gameOver", {
              winner: room.currentPlayer.userName,
              color: room.currentPlayer.color,
            })
          const id = room.id;
          console.log(chalk.red(`Cleaning up game ${id}`));
          room.destroy();
          rooms.delete(id);
      }
    });

    socket.on("moveRequest", async (data: { gameId: string; sphere_id: number; sphere_type: string; choice: number }) => {
      const room = rooms.get(data.gameId);
      if (!room) return;

      const currentSocket = room.sockets.get(room.currentPlayer.id);
      if (!currentSocket || socket.id !== currentSocket.id) {
        socket.emit("error", { message: "Not your turn" });
        return;
      }

      await room.handleMovePiece(data.sphere_id, data.sphere_type, data.choice);

      if (room.gameOver) {
        await room.storeGameEndInDB(room.currentPlayer.userName);
        room.broadcast("gameOver", {
            winner: room.currentPlayer.userName,
            color: room.currentPlayer.color,
        });
          const id = room.id;
          console.log(chalk.red(`Cleaning up game ${id}`));
          room.destroy();
          rooms.delete(id);
      }
    });
    
    socket.on("leaveLobby", (data: { lobbyId: string }) => {
      const room = rooms.get(data.lobbyId);
      if (!room) return;
      const playerIndex = room.players.findIndex(
        (p) => room.sockets.get(p.id)?.id === socket.id
      );
      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        room.players.splice(playerIndex, 1);
        room.sockets.delete(player.id);
        room.broadcast("removePlayer", { id: player.id });
        console.log(chalk.red(`Player ${player.userName} left game ${data.lobbyId}`));
        // If the host leaves, room should be deleted, and all players notified

        if (playerIndex === 0 || room.players.length === 0) {
          room.broadcast("lobbyClosed", { message: "Room destroyed by host" });
          if (playerIndex === 0){
          console.log(chalk.red(`Host has left the lobby. Lobby is closed`));
          }
          else if (room.players.length === 0)
          {
          console.log(chalk.red(`Game ${data.lobbyId} deleted (no players left).`));
          }
          rooms.delete(data.lobbyId);
        } else {
          // Emit updated lobby state
          room.broadcast("lobbyUpdate", {
            gameId: room.id,
            hostId: room.sockets.get(room.players[0].id)?.id, // assume first player is host
            players: room.players.map(p => ({
              id: room.sockets.get(p.id)?.id || '',
              userName: p.userName,
              isReady: p.isReady,
            })),
          });
        }
      }
    });
    
    socket.on("disconnect", async () => {
      console.log(chalk.red(`Client disconnected: ${socket.id}`));
    
      for (const [id, room] of rooms) {
        // Try to find the player belonging to this socket
        const playerIndex = room.players.findIndex(
          (p) => room.sockets.get(p.id)?.id === socket.id
        );
    
        if (playerIndex === -1) continue; // not in this room, move to next
    
        const player = room.players[playerIndex];
    
        // Reset pieces safely
        await room.resetPieces(player);
    
        // Remove player from the room
        room.players.splice(playerIndex, 1);
        room.sockets.delete(player.id);
    
        room.broadcast("removePlayer", { id: player.id });
        console.log(chalk.red(`Player ${player.userName} removed from game ${id}`));
    
        console.log(
          chalk.red(
            `Checking ==> Players left in game ${id}: ${room.players.length}`
          )
        );
    
        // ⚠️ ROOM CLEANUP LOGIC
        const remaining = room.players.length;
    
        // Case 1: Only 1 player left AND game had started => declare winner
        if (remaining === 1 && room.gamestarted) {
          const winnerPlayer = room.players[0];
    
          await room.storeGameEndInDB(winnerPlayer.userName);
    
          room.gameOver = true;
    
          room.broadcast("gameOver", {
            winner: winnerPlayer.userName,
            color: winnerPlayer.color,
          });
    
          // room is closing
    
          room.destroy();
          rooms.delete(id);
          console.log(chalk.red(`Game ${id} deleted (winner declared).`));
          break;
        }
    
        // Case 2: 0 players OR 1 player but game not started => close the lobby
        if (remaining === 0 || remaining === 1) {
          room.broadcast("lobbyClosed", { message: "Room destroyed (no players left)" });
    
          room.destroy();
          rooms.delete(id);
    
          console.log(chalk.red(`Game ${id} deleted (no players left).`));
          break;
        }
        if (room.currentPlayer) room.currentturn();
        else room.nextTurn();
        // If room still has 2+ players => nothing else happens
        break;
      }
    });
    
  });


  local.on("connection", (socket: Socket) => {
    console.log(chalk.yellow(`Client connected locally: ${socket.id}`));

    socket.on("createGame", (data: {playersnumber:number}) => {
      const gameId = randomUUID(); // generate unique game id
      const room = new localRoom(gameId, local, data.playersnumber);
      room.socket = socket; // assign the socket to the room for local play
      localRooms.set(gameId, room);

      //create game mean the game started immediatly
      room.broadcast("gameStarted", { gameId: room.id, players: room.players, currentPlayerId: room.currentPlayer });
    });
    

    socket.on("readyToPlayX", async (data: { gameId: string;}) => {
      const room = localRooms.get(data.gameId);
      if (!room) return;

        await room.startGame();
    });

    socket.on("requestRollDices", async (data: { gameId: string, color:string }) => {
      const room = localRooms.get(data.gameId);
      if (!room) return;

      const currentcolor = room.currentPlayer.color;
      if (data.color !== currentcolor) {
        socket.emit("error", { message: "Not your turn" });
        return;
      }
      await room.handleRollDice();
      if (room.gameOver) {
          room.broadcast("gameOver", {
              winner: room.currentPlayer.userName,
              color: room.currentPlayer.color,
            });
          const id = room.id;
          console.log(chalk.red(`Cleaning up game ${id}`));
          room.destroy();
          localRooms.delete(id);
      }

    });





    socket.on("moveRequest", async(data: { gameId: string; sphere_id: number; sphere_type: string; choice: number }) => {
      const room = localRooms.get(data.gameId);
      if (!room) return;

      const currentcolor = room.currentPlayer.color;
      if (data.sphere_type !== currentcolor) {
        socket.emit("error", { message: "Not your turn" });
        return;
      }
      await room.handleMovePiece(data.sphere_id, data.sphere_type, data.choice);
       
      if (room.gameOver) {
        console.log("game over detected in moveRequest");
        room.broadcast("gameOver", {
            winner: room.currentPlayer.userName,
            color: room.currentPlayer.color,
        });
          const id = room.id;
          console.log(chalk.red(`Cleaning up game ${id}`));
          room.destroy();
          localRooms.delete(id);
      }
    });
    
    // still need to hundle if the player want to leave the game and if the host leave the game
    //still need to hundle if the game is over

    socket.on("disconnect", () => {
      console.log(chalk.red(`Client disconnected: ${socket.id}`));

      // find the room this socket belongs to
      for (const [id, room] of localRooms) {
        if (room.socket?.id === socket.id) {
          socket.emit("lobbyClosed", { message: "Room destroyed by host" });
          room.destroy();
          localRooms.delete(id);
          console.log(chalk.magenta(`Local Game ${id} deleted (no players left).`));
          break;
        }
      }

  });

  });

}