'use client';
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";
import { useTreeTournament } from "../context/TreeTournamentContext";
import { Player, Match, TreeTournament } from "../context/TreeTournamentContext";
import TournamentBracket from "../components/TournamentTree";
import { useSearchParams, useParams } from "next/navigation";
import { fetchUserById } from "@/app/lib/apiDashboard";

export async function getNameAndAvatarFromId(id: number) {
  try {
    const data = await fetchUserById(id);
    return {
      name: data.userName,
      avatarUrl: data.imageUrl,
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return {
      name: `playerId_${id}`,
      avatarUrl: `https://i.pravatar.cc/150?u=${id}`,
    };
  }
}

export const makePlayersFromIds = async (ids: number[]): Promise<Player[]> => {
  const players = await Promise.all(
    ids.map(async (id) => {
      const { name, avatarUrl } = await getNameAndAvatarFromId(id);
      return { id, name, avatarUrl, status: "pending" as const };
    })
  );
  return players;
};

export const makePlayerFromId = async (id: number): Promise<Player> => {
  const { name, avatarUrl } = await getNameAndAvatarFromId(id);
  return { id, name, avatarUrl, status: "pending" as const };
}


export default function Play() {
  const { tournamentTree, JoinTournament, add_players_to_round2, resetTournament, setTheWinner, getfinalPlayed, setFinalPlayed } = useTreeTournament();
  const router = useRouter();
  const socketContext = useSocket();
  const pathname = usePathname();
  const tournamentId = pathname.split("/").pop();
  const searchParams = useSearchParams();
  const round = searchParams.get("round");
  let hasEmitted = false;
  console.log(" hasEmitted value:", hasEmitted);

  console.log("🏆 Tournament ID from URL:", tournamentId);
  console.log("🔄 Current Tournament round:", round);
  useEffect(() => {
    const socket = socketContext.socket;
    if (!socket || !tournamentId) return;
    
    const handleStarted = (data: any) => {
      console.log("✅ Tournament started:", data);
      toast.success(data.message);
    };
    
    const handleGameStarting = async (data: any) => {
      console.log("🚀 Tournament game is starting:", data);
      toast.success("Tournament game is starting!");
      const inviterId = data.opponentId === socketContext.currentUser?.id ? data.reciverId : data.opponentId;
      const inviter_name = await getNameAndAvatarFromId(inviterId).then(res => res.name);
      const accepterId = socketContext.currentUser?.id;
      if (inviterId === data.reciverId) {
        console.log("---->>>>>>>>>>>>>>> ids of opponents:", inviterId, accepterId);
        socket.emit("accept_invite_tournament", {
          inviter: inviterId,
          inviterName: inviter_name,
          accepter: socketContext.currentUser,
          tournamentId: tournamentId,
        });
      }
    };

    /// first round
    if (!round) {
        const emitOnce = () => {
          if (!hasEmitted) {
            hasEmitted = true;
            console.log("📡 Emitting canWeStartTournament...");
            socket.emit("canWeStartTournament", { tournamentId });
          }
        };
      
        setTimeout(emitOnce, 2000);
        
        // console.log("📡 Emitting canWeStartTournament...");
        // setTimeout(() => {
        //   socket.emit("canWeStartTournament", { tournamentId });
        // }, 1000);
    } else {
      const emitOnce = () => {
        if (!hasEmitted) {
          hasEmitted = true;
          console.log("📡 Emitting canWeStartTournament...");
          socket.emit("canWeStartFinal", { tournamentId });
        } 
        };
        
        setTimeout(emitOnce, 5000);
      }

      if (!getfinalPlayed()) {
        socket.on("tournament_started", handleStarted);
        socket.on("tournament_game_starting", handleGameStarting);
        socket.on("winner_reported_round1", async (data: {message : string ; playerIds: number[]}) => {
          console.log("📢 to the final --> :", data.playerIds);
          const players = await makePlayersFromIds(data.playerIds); 
          add_players_to_round2(players);
        });
        setFinalPlayed();
      } else {
        console.log(" Final already played.");
      }

    socket.on("catch_the_winner", async (data: {message : string ; winnerId: number}) => {
      console.log("🏆 Tournament Winner is --> :", data.winnerId);
      toast.success(`🏆 Tournament Winner is playerId_${data.winnerId}`);
      const player = await makePlayerFromId(data.winnerId);
      setTheWinner(player);

      // send that tournament if finished to backend to reset
      setTimeout(() => {
        router.push('/protected/games/ping-pong'); 
        socket.emit("touranment_finished", { tournamentId : tournamentId });
      }, 5000);
    });

    // 🧹 Clean up on unmount
    return () => {
      socket.off("tournament_started", handleStarted);
      socket.off("tournament_game_starting", handleGameStarting);
    };
  }, [socketContext.socket, tournamentId, TournamentBracket]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-black/40">
      <h1 className="text-2xl font-bold mb-4">Tournament Bracket</h1>
      <TournamentBracket />
    </div>
  )
}
