'use client';

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSettings } from "../../../context/settings/SettingsContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";

export default function Play() {
    const router = useRouter();
    const socketContext = useSocket();
    const pathname = usePathname(); 
    const tournamentId = pathname.split("/").pop();

    useEffect(() => {
        console.log("📡 Emitting canWeStartTournament...");
        socketContext.socket?.emit("canWeStartTournament", { tournamentId: tournamentId });
        socketContext.socket?.on("tournament_started", (data) => {
            console.log("✅ Tournament started:", data);
            toast.success(data.message);
            // You can add more logic here to handle the start of the tournament
        });
    }, [socketContext]);

    return <div>Ping Pong Tournament Play Page</div>;
}