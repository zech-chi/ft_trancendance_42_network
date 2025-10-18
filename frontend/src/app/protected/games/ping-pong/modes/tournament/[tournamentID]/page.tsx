'use client';
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";

export default function Play() {
  const router = useRouter();
  const socketContext = useSocket();
  const pathname = usePathname();
  const tournamentId = pathname.split("/").pop();

  useEffect(() => {
    const socket = socketContext.socket;
    if (!socket || !tournamentId) return;

    console.log("📡 Emitting canWeStartTournament...");
    socket.emit("canWeStartTournament", { tournamentId });

    const handleStarted = (data: any) => {
      console.log("✅ Tournament started:", data);
      toast.success(data.message);
    };

    const handleGameStarting = (data: any) => {
      console.log("🚀 Tournament game is starting:", data);
      toast.success("Tournament game is starting!");
    };

    socket.on("tournament_started", handleStarted);
    socket.on("tournament_game_starting", handleGameStarting);

    // 🧹 Clean up on unmount
    return () => {
      socket.off("tournament_started", handleStarted);
      socket.off("tournament_game_starting", handleGameStarting);
    };
  }, [socketContext.socket, tournamentId]);

  return <div>Ping Pong Tournament Play Page</div>;
}
