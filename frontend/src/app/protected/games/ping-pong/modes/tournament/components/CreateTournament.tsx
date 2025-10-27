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
import { useTreeTournament } from "../context/TreeTournamentContext";
import { Player, Match, TreeTournament } from "../context/TreeTournamentContext";
import { getNameAndAvatarFromId } from "../[tournamentID]/page";
import { makePlayersFromIds } from "../[tournamentID]/page";

export default function CreateTournament() {
    const { tournamentTree, initializeTournament, JoinTournament, resetTournament } = useTreeTournament();
    const router = useRouter() ;
    const socketContext = useSocket();
    const { loggedUserId } = useLoggedUserId();
    const { loggedUserName } = useLoggedUserName();
    const { settings } = useSettings();
    const [ t_name, t_setName ] = useState("");
    const [ t_number_of_players, t_setNumberOfPlayers ] = useState(4);   // default to 4 players ( 4 or 8 )
    const [ t_isPrivate, t_setIsPrivate ] = useState(false); // default to public ( public or private )

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();
        initializeTournament();
        resetTournament();
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
        socketContext.socket?.on("created_tournament", (data: any) => {
            if (data.message !== "Tournament created successfully") {
                toast.error(data.message, { id: data.message });
                return;
            }
            toast.success("Tournament created successfully!");
            router.push(`/protected/games/ping-pong/modes/tournament/${data.tournamentId}`);
            console.log("Tournament successfully created:", data);
        });
        socketContext.socket?.on("joined_tournament", async (data) => {
            console.log("✅ Join tournament response:", data);
            if (data.message === "Joined successfully") {
                if (data.newUserJoinedId !== loggedUserId) { 
                    toast.success(data.newUserJoinedId);
                }
                const players = await makePlayersFromIds(data.allPlayersJoinedIds);
                JoinTournament(players);
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