"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "../../../context/settings/SettingsContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";
import { useTournament } from "../context/TournamentTreeContext";


export default function JoinTournament() {
  const router = useRouter();
  const socketContext = useSocket();
  const { loggedUserId } = useLoggedUserId();
  const { loggedUserName } = useLoggedUserName();
  const { settings } = useSettings();

  const [t_name, t_setName] = useState("");
  const [t_number_of_players, t_setNumberOfPlayers] = useState(4);
  const [t_isPrivate, t_setIsPrivate] = useState(false);
  const [t_nakeName, t_setNakeName] = useState("");
  const [publicTournaments, setPublicTournaments] = useState<Array<any>>([]);
  const [ joinedUserIds, setJoinedUserIds ] = useState<Array<number>>([]);
  const { updateMatch, matches, resetTournament } = useTournament();


  // 🔥 Fetch public tournaments on mount
  useEffect(() => {

    console.log("📡 Requesting all public tournaments...");
    socketContext.socket?.emit("get_all_available_public_tournaments");

    // socketContext.socket?.on("all_available_public_tournaments", (data) => {
    //   console.log("✅ Received tournaments:", data);
    //   setPublicTournaments(data.tournaments || []);
    // });

    socketContext.socket?.on("all_available_public_tournaments", (data) => {
      console.log("✅ Received tournaments:", data);
    
      if (data && Array.isArray(data.tournaments)) {
        console.log("🏆 Tournaments List:", data.tournaments);
        setPublicTournaments(data.tournaments);
      } else {
        console.warn("⚠️ Unexpected tournament data format:", data);
        setPublicTournaments([]);
      }
    });
    

      

    // socketContext.socket?.on("joined_tournament", (data) => {
    //     console.log("✅ Join tournament response:", data);
    //     if (data.message === "Joined successfully") {
    //         if (loggedUserId !== data.newUserJoinedId) {
    //           toast.success(data.newUserJoinedId + " joined the tournament!");
    //         }
    //         setJoinedUserIds((prev) => [...prev, data.newUserJoinedId]);

            
    //         router.push(`/protected/games/ping-pong/modes/tournament/${data.tournamentId}`);
    //     } else {
    //         toast.error(data.message);
    //     }
    // });

    socketContext.socket?.on("joined_tournament", (data) => {
      console.log("✅ Join tournament response:", data);
    
      if (data.message === "Joined successfully") {

        const { allPlayersJoinedIds, newUserJoinedId, round } = data;
    
        if (loggedUserId !== newUserJoinedId) {
          toast.success(`Player ${newUserJoinedId} joined the tournament!`);
        }
        // reset tournament context before updating
        resetTournament();
  
        // ✅ Update Tournament Context
        // Example: 4-player tournament → round 1 fills semi1 first, then semi2
        allPlayersJoinedIds.forEach((pid: number, index: number) => {
          const playerData = {
            playerId: pid,
            name: `Player ${pid}`,
            image: `https://api.dicebear.com/9.x/thumbs/svg?seed=${pid}`,
            status: "waiting",
          };
        
          if (index === 0) updateMatch("semi1", "player1", playerData);
          else if (index === 1) updateMatch("semi1", "player2", playerData);
          else if (index === 2) updateMatch("semi2", "player1", playerData);
          else if (index === 3) updateMatch("semi2", "player2", playerData);
        });
    
        // ✅ Redirect once context is updated
        router.push(`/protected/games/ping-pong/modes/tournament/${data.tournamentId}`);
      } else {
        toast.error(data.message);
      }
    });
    

  }, [socketContext]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏓 Join a Tournament</h1>

      {publicTournaments.length === 0 ? (
        <p className="text-gray-500">No public tournaments available right now.</p>
      ) : (
        <ul className="space-y-3">
          {publicTournaments.map((tournament: any, index: number) => (
            <li
              key={index}
              className="border border-gray-300 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{tournament.name}</p>
                <p className="text-sm text-white/80">
                  Players: {tournament.numberOfJoinedPlayer ?? 0} /{" "}
                  {tournament.numberOfPlayers}
                </p>
              </div>
              <button
                onClick={() => {
                    socketContext.socket?.emit("join_tournament", {
                    tournamentId: tournament.id,
                    playerId: loggedUserId,
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
