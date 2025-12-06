"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import PingPongCanvasRemote from "../../components/PingPongCanvasRemote";
import { useParams } from "next/navigation";
import { useSettings } from "../../context/settings/SettingsContext";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  name?: string;
  iat?: number;
  game?: string;
}

export default function GamePage() {
  const { socket, isConnected, currentUser } = useSocket();
  const { settings } = useSettings();
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setUser(currentUser);

      if (socket && isConnected) {
        console.log("🎮 Joining game room:", roomId);
        socket.emit("join_game_room", { roomId });
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, [socket, isConnected, currentUser, roomId]);

  useEffect(() => {
    if (socket && isConnected) {
      console.log("✅ Socket connected, joining room:", roomId);
      socket.emit("join_game_room", { roomId });
    }
  }, [socket, isConnected, roomId]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl">Loading game...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    // router.push("/gzone/games/ping-pong");
    window.location.href = "/gzone/games/ping-pong";
    return null;
  }

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Header with room info - mobile friendly */}
      <div className="absolute top-2 left-2 z-20 bg-black/50 text-white px-2 py-1 rounded text-xs">
        <div className="text-xs">Room: {roomId.slice(-8)}</div>
        <div className="text-xs opacity-75">{user?.username}</div>
        {!isConnected && (
          <div className="text-xs text-yellow-400">Connecting...</div>
        )}
      </div>

     <PingPongCanvasRemote
        tableUrl={settings.bgTable}
        paddleColor={settings.paddle}
        ballUrl={settings.ball}
        maxScore={settings.score}
        roomId={roomId}
        userId={user!.id}
      />
    </div>
  );
}
