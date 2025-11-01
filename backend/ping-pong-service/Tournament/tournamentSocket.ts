// tornamentSocket.ts

import { Socket } from "socket.io";
import { TournamentSystem } from "./TournamentSystem";
import { CreateTournamentOBJ } from "./types";
import { JoinedPlayerOBJ } from "./types";
import { TournamentID } from "./types";
import { Server as SocketIOServer } from "socket.io";
import { stringify } from "flatted";
import { createTornamentGame, createTornamentGameFinal } from "./tournamentGame";
import { WinnerOBJ } from "./types";


export function registerTournamentEvents(socket: Socket, tournamentSystem: TournamentSystem, io: SocketIOServer) {
  console.log("🎮 Registering tournament events for:", socket.id);

  socket.on("create_tournament", async (obj : CreateTournamentOBJ) => {
    console.log("🏆 Tournament creation requested");
    if (!tournamentSystem.isValidTournamentName(obj.name)) {
      socket.emit("created_tournament", { message: "Failed to create tournament, name already taken or empty" });
      return;
    }
    const tournament = tournamentSystem.createTournament(
        obj.name,
        obj.number_of_players,
        obj.isPrivate,
        obj.createdBy,
        io
    );
    const success = tournamentSystem.addPlayerToTournament(tournament.getId(), obj.createdBy, socket);
    if (success) {
      io.to(tournament.getId()).emit("joined_tournament", {
        message: "Joined successfully",
        round: 1,
        tournamentId: tournament.getId(),
        newUserJoinedId: obj.createdBy,
        allPlayersJoinedIds: tournamentSystem.getTournament(tournament.getId())?.getJoinedPlayersIds() || []
      });
    } else {
        socket.emit("joined_tournament", { message: "Failed to join tournament" });
    }

    socket.emit("created_tournament", { message: "Tournament created successfully", tournamentId: tournament.getId() });
  });

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
        io.to(obj.tournamentId).emit("joined_tournament", {
          message: "Joined successfully",
          round: 1,
          tournamentId: obj.tournamentId,
          newUserJoinedId: obj.playerId,
          allPlayersJoinedIds: tournamentSystem.getTournament(obj.tournamentId)?.getJoinedPlayersIds() || []
        });
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

  socket.on("canWeStartFinal", async (obj : TournamentID) => {
    console.log("🚀 Checking if tournament can start");
    // Here you would typically check if the tournament can start
    if (tournamentSystem.canWeStartFinal(obj.tournamentId)) {
      io.to(obj.tournamentId).emit("tournament_started", { message: "Tournament started!" }, );
      // lets start the tournament
      // player at index 0 vs player at index 1 of joinedPlayers --> Room1
      // and player at index 2 vs player at index 3  join Room1 as spectators
      // and so on...

      console.log("1 ->>>>> tournament id : ", obj.tournamentId);
      createTornamentGameFinal(
        obj.tournamentId,
        tournamentSystem,
        io
      );
    } else {
      io.to(obj.tournamentId).emit("tournament_started", { message: "Tournament not started!" });
    }
});  

socket.on("winner_of_round1", async (obj : WinnerOBJ) => {
  console.log("🏅 Winner reported for tournament:", obj);
  tournamentSystem.addPlayertofinal(obj.tournamentId, obj.winnerId, socket);
  console.log(" final players so far: ", tournamentSystem.getTournament(obj.tournamentId)?.getFinalPlayersIds());
  const finalPlayerIds = tournamentSystem.getTournament(obj.tournamentId)?.getFinalPlayersIds();
    io.to(obj.tournamentId).emit("winner_reported_round1", {
      message: `Winner ${obj.winnerId} reported for tournament ${obj.tournamentId}`,
      playerIds: finalPlayerIds
    });
    // You can add logic to check if the tournament is over and declare overall winner
});

socket.on("laddies_and_gentlemen_we_have_a_winner", async (obj : WinnerOBJ) => {
  if (!tournamentSystem.getTournament(obj.tournamentId)) {
    console.log("Tournament not found:", obj.tournamentId);
    return;
  }

  const finalPlayerIds = tournamentSystem.getTournament(obj.tournamentId)?.getFinalPlayersIds();
  if (finalPlayerIds?.length !== 2) {
    console.log("tournament not done yet! to announce winner:", obj.tournamentId);
    return ;
  }

  console.log("🏆🏆🏆🏆 Tournament Winner announced:", obj.winnerId);
  // set winnerId,
  tournamentSystem.setTournamentWinner(obj.tournamentId, obj.winnerId);
  io.to(obj.tournamentId).emit("catch_the_winner", {
    message: `Tournament Winner is ${obj.winnerId} for tournament ${obj.tournamentId}`,
    winnerId: obj.winnerId
  });
});


socket.on("touranment_finished", async (obj : TournamentID) => {
  console.log("🧹 Cleaning up tournament:", obj.tournamentId);
  tournamentSystem.removeTournament(obj.tournamentId);
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
