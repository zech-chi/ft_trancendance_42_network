"use client";

import PingPongCanvas from "../../components/PongCanvas";
import { useSettings } from "../../context/settings/SettingsContext";
import React, { use, useState } from "react";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import CreateTournament from "./components/CreateTournament";
import { useSocket } from "../../context/SocketContext";
import JoinTournament from "./components/JoinTournament";

export default function Tournament() {
    const socketContext = useSocket();
    const [ isCreating, setIsCreating ] = useState(true); // toggle between create and join tournament

    // rendreing this after each event happend in the socket


    return (
        <div className="flex flex-col h-screen w-screen bg-cover bg-center overflow-auto justify-center items-center text-white bg-black/50">
            <div className="flex gap-4 mb-6">
                <button
                className={`px-6 py-2 rounded-2xl ${
                    isCreating ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setIsCreating(true)}
                >
                Create Tournament
                </button>
                <button
                className={`px-6 py-2 rounded-2xl ${
                    !isCreating ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setIsCreating(false)}
                >
                Join Tournament
                </button>
            </div>
            {isCreating ? <CreateTournament  /> : <JoinTournament />}
        </div>
    );
}

