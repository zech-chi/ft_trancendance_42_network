// tornamentSocket.ts

import { Socket } from "socket.io";
import { TournamentSystem } from "./TournamentSystem";
import { CreateTournamentOBJ } from "./types";
import { JoinedPlayerOBJ } from "./types";
import { TournamentID } from "./types";
import { Server as SocketIOServer } from "socket.io";
import { stringify } from "flatted";
import { createTornamentGame } from "./tournamentGame";


export function registerTournamentEvents(socket: Socket, tournamentSystem: TournamentSystem, io: SocketIOServer) {
  console.log("🎮 Registering tournament events for:", socket.id);

  socket.on("create_tournament", async (obj : CreateTournamentOBJ) => {
    console.log("🏆 Tournament creation requested");
    const tournament = tournamentSystem.createTournament(
        obj.name,
        obj.number_of_players,
        obj.isPrivate,
        obj.createdBy,
        io
    );
    const success = tournamentSystem.addPlayerToTournament(tournament.getId(), obj.createdBy, socket);
    if (success) {
        socket.emit("joined_tournament", { message: "Joined successfully" , tournamentId: tournament.getId()});
    } else {
        socket.emit("joined_tournament", { message: "Failed to join tournament" });
    }

    socket.emit("created_tournament", { message: "Tournament created successfully", tournamentId: tournament.getId() });
  });


  // socket.on("get_all_available_public_tournaments", async () => {
  //   console.log("📋 Fetching all available public tournaments");
  //   const publicTournaments = tournamentSystem.getAllPublicTournaments();
  //   // socket.emit("all_available_public_tournaments", { tournaments: stringify(publicTournaments) });
  //   socket.emit("all_available_public_tournaments", { tournaments: publicTournaments });
  // });

  socket.on("get_all_available_public_tournaments", async () => {
    console.log("📋 Fetching all available public tournaments");
    const publicTournaments = tournamentSystem.getAllPublicTournaments();
    // send Id and Name and joinded only to reduce data size
    socket.emit("all_available_public_tournaments", { tournaments: publicTournaments.map(t => ({ id: t.getId(),
      name: t.getName(),
      numberOfJoinedPlayer: t.getNumberOfJoinedPlayers(),
      numberOfPlayers: t.getNumberOfPlayers()
     })) });
  });

  socket.on("join_tournament", async (obj : JoinedPlayerOBJ) => {
    console.log("👥 Player Want to Join:", obj);
    const success = tournamentSystem.addPlayerToTournament(obj.tournamentId, obj.playerId, socket);
    if (success) {
        socket.emit("joined_tournament", { message: "Joined successfully" , tournamentId: obj.tournamentId});
    } else {
        socket.emit("joined_tournament", { message: "Failed to join tournament" });
    }
  });

  socket.on("canWeStartTournament", async (obj : TournamentID) => {
    console.log("🚀 Checking if tournament can start");
    // Here you would typically check if the tournament can start
    if (tournamentSystem.canWeStartTournament(obj.tournamentId)) {
      io.to(obj.tournamentId).emit("tournament_started", { message: "Tournament started!" }, );
      // lets start the tournament
      // player at index 0 vs player at index 1 of joinedPlayers --> Room1
      // and player at index 2 vs player at index 3  join Room1 as spectators
      // and so on...

      console.log("1 ->>>>> tournament id : ", obj.tournamentId);
      createTornamentGame(
        obj.tournamentId,
        tournamentSystem,
        io
      );
    } else {
      io.to(obj.tournamentId).emit("tournament_started", { message: "Tournament not started!" });
    }
  });

  
//   socket.on("join_tournament", (data) => {
//     console.log("👥 Player joined tournament:", data);
//     socket.emit("joined_tournament", { message: "Joined successfully" });
//   });

//   socket.on("start_tournament", (data) => {
//     console.log("🚀 Starting tournament:", data);
//     socket.emit("tournament_started", { message: "Tournament started!" });
//   });

  // ...add more tournament events later
}
