"use client";

import PingPongCanvas from "../../../components/PongCanvas";
import { useSettings } from "../../../context/settings/SettingsContext";
import React, { use, useState } from "react";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useTournament } from "../context/TournamentTreeContext";

export default function CreateTournament() {
    const router = useRouter() ;
    const socketContext = useSocket();
    const { loggedUserId } = useLoggedUserId();
    const { loggedUserName } = useLoggedUserName();
    const { settings } = useSettings();
    const [ t_name, t_setName ] = useState("");
    const [ t_number_of_players, t_setNumberOfPlayers ] = useState(4);   // default to 4 players ( 4 or 8 )
    const [ t_isPrivate, t_setIsPrivate ] = useState(false); // default to public ( public or private )
    const { updateMatch, matches, resetTournament } = useTournament();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., send data to the server
        console.log("Tournament Created:", {
            name: t_name,
            number_of_players: t_number_of_players,
            isPrivate: t_isPrivate,
            createdBy: loggedUserId,
        });
        socketContext.socket?.emit("create_tournament", {
            name: t_name,
            number_of_players: t_number_of_players,
            isPrivate: t_isPrivate,
            createdBy: loggedUserId,
        });
        // socketContext.socket?.on("created_tournament", (data: any) => {
        //     toast.success("Tournament created successfully!");
        //     router.push(`/protected/games/ping-pong/modes/tournament/${data.tournamentId}`);
        //     console.log("Tournament successfully created:", data);
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
    }


    return (
        <>
            <form className="flex flex-col gap-4 bg-black/70 p-6 rounded-lg">
                <label>
                    Tournament Name:
                    <input
                        type="text"
                        value={t_name}
                        onChange={(e) => t_setName(e.target.value)}
                        className="ml-2 p-1 rounded bg-white/10 border border-white/20"
                    />
                </label>
                <label>
                    Number of Players:
                    <select
                        value={t_number_of_players}
                        onChange={(e) => t_setNumberOfPlayers(parseInt(e.target.value))}
                        className="ml-2 p-1 rounded bg-white/10 border border-white/20"
                    >
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                    </select>
                </label>
                <label>
                    Privacy:
                    <select
                        value={t_isPrivate ? "private" : "public"}
                        onChange={(e) => t_setIsPrivate(e.target.value === "private")}
                        className="ml-2 p-1 rounded bg-white/10 border border-white/20"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </label>
                <button
                    type="submit"
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSubmit}
                >
                    Create Tournament
                </button>
            </form>
        </>
    )
}