"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "../../../context/settings/SettingsContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";
import { useTreeTournament } from "../context/TreeTournamentContext";
import { Player, Match, TreeTournament } from "../context/TreeTournamentContext";

export default function JoinTournament() {
  const { tournamentTree, initializeTournament, JoinTournament, resetTournament } = useTreeTournament();
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

  const makePlayersFromIds = (ids: number[]): Player[] => {
    return ids.map(id => ({
        id,
        name: `playerId_${id}`,
        avatarUrl: 'https://i.pravatar.cc/150?u=' + id,
        status: "pending",
    }));
}

  // 🔥 Fetch public tournaments on mount
  useEffect(() => {
    initializeTournament();
    resetTournament();
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
    

      

    socketContext.socket?.on("joined_tournament", (data) => {
        console.log("✅ Join tournament response:", data);
        if (data.message === "Joined successfully") {
            if (data.newUserJoinedId !== loggedUserId) { 
              toast.success(data.newUserJoinedId);
            }
            JoinTournament(makePlayersFromIds(data.allPlayersJoinedIds));
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
