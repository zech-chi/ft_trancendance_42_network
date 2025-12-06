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
import { getNameAndAvatarFromId } from "../[tournamentID]/page";
import { makePlayersFromIds } from "../[tournamentID]/page";

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

  // 🔥 Fetch public tournaments on mount
  useEffect(() => {
    initializeTournament();
    resetTournament();
    //console.log("📡 Requesting all public tournaments...");
    socketContext.socket?.emit("get_all_available_public_tournaments");

    // socketContext.socket?.on("all_available_public_tournaments", (data) => {
    //   //console.log("✅ Received tournaments:", data);
    //   setPublicTournaments(data.tournaments || []);
    // });

    socketContext.socket?.on("all_available_public_tournaments", (data) => {
      //console.log("✅ Received tournaments:", data);
    
      if (data && Array.isArray(data.tournaments)) {
        //console.log("🏆 Tournaments List:", data.tournaments);
        setPublicTournaments(data.tournaments);
      } else {
        console.warn("⚠️ Unexpected tournament data format:", data);
        setPublicTournaments([]);
      }
    });
    

      

    socketContext.socket?.on("joined_tournament", async (data) => {
        //console.log("✅ Join tournament response:", data);
        if (data?.status) {
            if (data.newUserJoinedId !== loggedUserId) {
              const playerInfo = await getNameAndAvatarFromId(data.newUserJoinedId);
              toast.success(`${playerInfo.name} joined`, {id: data.newUserJoinedId} );
            }
            const players = await makePlayersFromIds(data.allPlayersJoinedIds);
            JoinTournament(players);
            router.push(`/gzone/games/ping-pong/modes/tournament/${data.tournamentId}`);
        } else {
            toast.error(data.message, {id: data.message});
        }
    });

  }, [socketContext.socket]);

  return (
    <>
      <h1 className="text-2xl font-bold text-center">🏓 Join a Tournament</h1>
    <div className="p-6 bg-black/30 h-full overflow-y-auto rounded-2xl custom-scrollbar w-full max-w-md">

      {publicTournaments.length === 0 ? (
        <p className="text-gray-500 text-center ">No public tournaments available right now.</p>
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
                className="bg-[#1CBABA]/60 text-white px-4 py-2 rounded-lg hover:bg-[#1CBABA]/80 transition-colors duration-200 cursor-pointer"
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}
