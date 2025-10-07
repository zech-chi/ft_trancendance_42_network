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
  
  
  const remote = io.of("/games/parchisi/online");
  // const local = io.of("/games/parchisi/local");
  remote.on("connection", (socket: Socket) => {
    console.log(chalk.green(`Client connected: ${socket.id}`));
    /**
     * When a player creates a new game
     */
    socket.on("createGame", (data: { username: string }) => {
      const gameId = randomUUID(); // generate unique game id
      const room = new GameRoom(gameId, remote);
      room.onGameOver = (id: string) => {
        console.log(chalk.red(`Cleaning up game ${id}`));
        room.destroy();
        rooms.delete(id);
      };
      rooms.set(gameId, room); // remove old room if there is only one player or game over or host leave or all players leave

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
        console.log("event sent to clients: lobbyUpdate", lobbyData);

    });

    socket.on("readyToPlayX", async (data: { gameId: string; userName: string }) => {
      const room = rooms.get(data.gameId);
      if (!room) return;
      
      console.log((`Player ${data.userName} is ready to x ${data.gameId}`));
      const player = room.players.find(p => p.userName === data.userName);
      if (!player)
        return;
      room.readyPlayers++;
      if (room.readyPlayers > room.players.length)
        {
          //mean someone realoded the page and clicked ready again so need to send him all the playes places with the current player
          room.readyPlayers = room.players.length;
          for (const p of room.players)
          {
            //send each player his places i dont need socket , because i user this.broadcast
           //loop thorght all peices of p 
            for (const piece of p.pieces)
            {
              room.emitJumpEvent(piece, p.color, piece.position, 'center')
            }
          }
        }
      if (room.readyPlayers === room.players.length)
        {
          await room.startGame();
        }

    });

  //   socket.on("join-request", (data: { gameId: string; username: string}) => {

  //     const room = rooms.get(data.gameId);
  //     if (!room) {
  //       socket.emit("error", { message: "Game not found" });
  //       return;
  //     }
  //     if (room?.gamestarted) {
  //       socket.emit("error", { message: "Game already started" });
  //       return;
  //     }
      
  //     if (room.players.length >= 4) {
  //       socket.emit("roomFull", { message: "Room is full" });
  //       return;
  //     }
  //     const hostId = room.players[0].id;
  //     const hostSocketId = room.sockets.get(hostId);
  //     if (hostSocketId)
  //       {
  //         room.namespaceIO.to(hostSocketId.id).emit("join-notification", {
  //           gameId: data.gameId,
  //           username: data.username,
  //       });
  //       }
  //   })

  // socket.on("join-response", (data :{ gameId:string; username:string; accepted:boolean}) => {
      
  //     const room = rooms.get(data.gameId);
  //     if (!room) {
  //       socket.emit("error", { message: "Game not found" });
  //       return;
  //     }
  //     if (room?.gamestarted) {
  //       socket.emit("error", { message: "Game already started" });
  //       return;
  //     }
      
  //     if (room.players.length >= 4) {
  //       socket.emit("roomFull", { message: "Room is full" });
  //       return;
  //     }

  //       socket.emit("join-response", { accepted:data.accepted });
  //   })

  
    socket.on("readyToPlay", (data: { gameId: string; username: string }) => {
      const room = rooms.get(data.gameId);
      if (!room) return;
      
      console.log((`Player ${data.username} is ready in game ${data.gameId}`));
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
    socket.on("requestRollDices", async (data: { gameId: string }) => {
      const room = rooms.get(data.gameId);
      if (!room) return;

      const currentSocket = room.sockets.get(room.currentPlayer.id);
      if (!currentSocket || socket.id !== currentSocket.id) {
        socket.emit("error", { message: "Not your turn" });
        return;
      }

      await room.handleRollDice();
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

      if (room.board.peekGoal(room.currentPlayer.id - 1).occupiedBy.length === 4) {
        room.broadcast("gameOver", {
          winner: room.currentPlayer.userName,
          color: room.currentPlayer.color,
        });
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
        console.log(chalk.yellow(`Player ${player.userName} left game ${data.lobbyId}`));
        // If the host leaves, room should be deleted, and all players notified

        if (playerIndex === 0 || room.players.length === 0) {
          room.broadcast("lobbyClosed", { message: "Room destroyed by host" });
          if (playerIndex === 0){
          console.log(chalk.magenta(`Host has left the lobby. Lobby is closed`));
          }
          else if (room.players.length === 0)
          {
          console.log(chalk.magenta(`Game ${data.lobbyId} deleted (no players left).`));
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
    
    // still need to hundle if the player want to leave the game and if the host leave the game
    //still need to hundle if the game is over

    socket.on("disconnect", () => {
      console.log(chalk.red(`Client disconnected: ${socket.id}`));

      // find the room this socket belongs to
      for (const [id, room] of rooms) {
        const playerIndex = room.players.findIndex(
          (p) => room.sockets.get(p.id)?.id === socket.id
        );
        if (playerIndex !== -1) {
          const player = room.players[playerIndex];
          room.players.splice(playerIndex, 1);
          room.sockets.delete(player.id);

          room.broadcast("removePlayer", { id: player.id });
          console.log(chalk.yellow(`Player ${player.userName} removed from game ${id}`));

          // cleanup if room empty
          if (room.players.length === 0) {
            room.broadcast("lobbyClosed", { message: "Room destroyed (no players left)" });
            room.destroy();
            rooms.delete(id);
            console.log(chalk.magenta(`Game ${id} deleted (no players left).`));
          }
          break;
        }
      }
    });
  });


  // local.on("connection", (socket: Socket) => {
  //   console.log(chalk.red(`Client connected locally: ${socket.id}`));

  //   socket.on("createGame", (data: {playersnumber:number}) => {
  //     const gameId = "saw"
      
  //     // randomUUID(); // generate unique game id
  //     const room = new localRoom(gameId, local, data.playersnumber);

  //     room.onGameOver = (id: string) => {
  //       console.log(chalk.red(`Cleaning up game ${id}`));
  //       room.destroy();
  //       localRooms.delete(id);
  //     };
  //     localRooms.set(gameId, room);
  //     console.log(chalk.blue(`Game created with ID: ${gameId} with ${data.playersnumber} players`));
  //     room.socket = socket; // assign the socket to the room for local play
  //   });

  //   socket.on("startGame",(data: { gameId: string }) => {
  //     const room = localRooms.get(data.gameId);
  //     if (!room)
  //     {
  //       console.log(chalk.red(`Game not found: ${data.gameId}`));
  //       socket.emit("error", { message: "Game not found" });
  //       return;
  //     }
  //     if (room.players.length < 2 && room.players.find(p => !p.isReady)) {
  //       socket.emit("error", { message: "Not all players are ready" });
  //       return;
          
  //       }
  //     room.broadcast("gameStarted", { gameId: room.id, players: room.players, board: room.board.toJSON(), currentPlayerId: room.currentPlayer });
  //      room.startGame();
  //   });

  //   socket.on("requestRollDices", async (data: { gameId: string, color:string }) => {
  //     const room = localRooms.get(data.gameId);
  //     if (!room) return;

  //     const currentcolor = room.currentPlayer.color;
  //     if (data.color !== currentcolor) {
  //       socket.emit("error", { message: "Not your turn" });
  //       return;
  //     }
  //     await room.handleRollDice();
  //   });

  //   socket.on("moveRequest", async(data: { gameId: string; sphere_id: number; sphere_type: string; choice: number, color:string }) => {
  //     const room = localRooms.get(data.gameId);
  //     if (!room) return;

  //     const currentcolor = room.currentPlayer.color;
  //     if (data.color !== currentcolor) {
  //       socket.emit("error", { message: "Not your turn" });
  //       return;
  //     }
  //     await room.handleMovePiece(data.sphere_id, data.sphere_type, data.choice);
  //     if (room.board.peekGoal(room.currentPlayer.id - 1).occupiedBy.length === 4) {
  //       room.broadcast("gameOver", {
  //         winner: room.currentPlayer.userName,
  //         color: room.currentPlayer.color,
  //       });
  //     }
  //   });
    
  //   // still need to hundle if the player want to leave the game and if the host leave the game
  //   //still need to hundle if the game is over

  //   socket.on("disconnect", () => {
  //     console.log(chalk.red(`Client disconnected: ${socket.id}`));

  //     // find the room this socket belongs to
  //     for (const [id, room] of localRooms) {
  //       if (room.socket?.id === socket.id) {
  //         socket.emit("lobbyClosed", { message: "Room destroyed by host" });
  //         room.destroy();
  //         localRooms.delete(id);
  //         console.log(chalk.magenta(`Local Game ${id} deleted (no players left).`));
  //         break;
  //       }
  //     }

  // });

  // });

}