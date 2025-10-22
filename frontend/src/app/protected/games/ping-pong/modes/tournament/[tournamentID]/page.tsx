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
  let hasEmitted = false;

  useEffect(() => {
    const socket = socketContext.socket;
    if (!socket || !tournamentId) return;

    
    const handleStarted = (data: any) => {
      console.log("✅ Tournament started:", data);
      toast.success(data.message);
    };
    
    const handleGameStarting = (data: any) => {
      console.log("🚀 Tournament game is starting:", data);
      toast.success("Tournament game is starting!");
      const inviterId = data.opponentId === socketContext.currentUser?.id ? data.reciverId : data.opponentId;
      const accepterId = socketContext.currentUser?.id;
      if (inviterId === data.reciverId) {
        console.log("---->>>>>>>>>>>>>>> ids of opponents:", inviterId, accepterId);
        socket.emit("accept_invite_tournament", {
          inviter: inviterId,
          inviterName: `playerId_${data.opponentId}`,
          accepter: socketContext.currentUser,
          tournamentId: tournamentId,
        });
      }
    };

    const emitOnce = () => {
      if (!hasEmitted) {
        hasEmitted = true;
        console.log("📡 Emitting canWeStartTournament...");
        socket.emit("canWeStartTournament", { tournamentId });
      }
    };
  
    setTimeout(emitOnce, 1000);
    
    // console.log("📡 Emitting canWeStartTournament...");
    // setTimeout(() => {
    //   socket.emit("canWeStartTournament", { tournamentId });
    // }, 1000);
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
