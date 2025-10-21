'use client';
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";
import { useTreeTournament } from "../context/TreeTournamentContext"; 
import TournamentBracket from "../components/TournamentTree";

export default function Play() {
  const { tournamentTree, JoinTournament, resetTournament } = useTreeTournament();
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
      socket.emit("accept_invite_tournament", {
        inviter: data.opponentId === socketContext.currentUser?.id ? data.reciverId : data.opponentId,
        inviterName: `playerId_${data.opponentId}`,
        accepter: socketContext.currentUser,
      });
    };

    socket.on("tournament_started", handleStarted);
    socket.on("tournament_game_starting", handleGameStarting);

    // 🧹 Clean up on unmount
    return () => {
      socket.off("tournament_started", handleStarted);
      socket.off("tournament_game_starting", handleGameStarting);
    };
  }, [socketContext.socket, tournamentId]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4">
      <h1 className="text-2xl font-bold mb-4">Tournament Bracket</h1>
      <TournamentBracket />
    </div>
  )
}
