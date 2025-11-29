"use client";

import PingPongCanvas from "../../components/PongCanvas";
import { useSettings } from "../../context/settings/SettingsContext";
import React, { use, useState } from "react";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import CreateTournament from "./components/CreateTournament";
import { useSocket } from "../../context/SocketContext";
import JoinTournament from "./components/JoinTournament";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function Tournament() {
    const socketContext = useSocket();
    const [isCreating, setIsCreating] = useState(true); // toggle between create and join tournament

    // rendreing this after each event happend in the socket


    return (
        // <div>
        //     <Sidebar />
        //     <Navbar />
        //     <div className="flex flex-col h-screen w-screen bg-cover bg-center overflow-auto justify-center items-center text-white bg-black/50">
        //         <div className="flex gap-4 mb-6">
        //             <button
        //             className={`px-6 py-2 rounded-2xl ${
        //                 isCreating ? "bg-blue-600" : "bg-gray-700"
        //             }`}
        //             onClick={() => setIsCreating(true)}
        //             >
        //             Create Tournament
        //             </button>
        //             <button
        //             className={`px-6 py-2 rounded-2xl ${
        //                 !isCreating ? "bg-blue-600" : "bg-gray-700"
        //             }`}
        //             onClick={() => setIsCreating(false)}
        //             >
        //             Join Tournament
        //             </button>
        //         </div>
        //         {isCreating ? <CreateTournament  /> : <JoinTournament />}
        //     </div>
        // </div>

        <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
            <Sidebar />
            <Navbar />
            <main
                className="flex flex-row items-center justify-center relative overflow-x-hidden
                    xl:pl-20 2xl:pl-24 w-full
                    h-[calc(100%-130px)]
                    xl:h-[calc(100%-75px)]
                    2xl:h-[calc(100%-85px)]
                    2xl:mt-[67px] xl:mt-[60px] overflow-y-hidden px-4
                "
            >
                <div className="flex flex-col h-full flex-1 bg-cover bg-center  justify-center items-center text-white bg-black/50 rounded-[50px]">
                    <div className="flex gap-4 mb-6">
                        <button
                            className={`px-6 py-2 rounded-2xl ${isCreating ? "bg-blue-600" : "bg-gray-700"
                                }`}
                            onClick={() => setIsCreating(true)}
                        >
                            Create Tournament
                        </button>
                        <button
                            className={`px-6 py-2 rounded-2xl ${!isCreating ? "bg-blue-600" : "bg-gray-700"
                                }`}
                            onClick={() => setIsCreating(false)}
                        >
                            Join Tournament
                        </button>
                    </div>
                    {isCreating ? <CreateTournament /> : <JoinTournament />}
                </div>
            </main>
        </div>
    );
}

