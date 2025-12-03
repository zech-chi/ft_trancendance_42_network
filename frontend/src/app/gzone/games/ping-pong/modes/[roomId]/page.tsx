"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import PingPongCanvasRemote from "../../components/PingPongCanvasRemote";
import { useParams } from "next/navigation";
import { useSettings } from "../../context/settings/SettingsContext";

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

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="text-xl text-red-400 mb-2">Error</div>
          <div className="text-lg mb-4">{error}</div>
          <button
            onClick={() => (window.location.href = "/gzone/games/ping-pong")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="text-xl mb-4">User not authenticated</div>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Header with room info - mobile friendly */}
      <div className="absolute top-2 left-2 z-20 bg-black/50 text-white px-2 py-1 rounded text-xs">
        <div className="text-xs">Room: {roomId.slice(-8)}</div>
        <div className="text-xs opacity-75">{user.username}</div>
        {!isConnected && (
          <div className="text-xs text-yellow-400">Connecting...</div>
        )}
      </div>

      {/* Game container - full screen on mobile */}
      {/* <div className="relative z-10 w-full h-full flex justify-center items-center p-1"> */}
      {/* Remove the backdrop container on mobile for more space */}
      {/* <div className="w-full h-full sm:bg-black/30 sm:backdrop-blur-xl sm:rounded-3xl sm:p-8 sm:shadow-2xl sm:border sm:border-white/10 sm:w-auto sm:h-auto"> */}
      <PingPongCanvasRemote
        tableUrl={settings.bgTable}
        paddleColor={settings.paddle}
        ballUrl={settings.ball}
        maxScore={settings.score}
        roomId={roomId}
        userId={user.id}
      />
      {/* </div>
      </div> */}

      {/* Footer with instructions - mobile friendly */}
      {/* <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 bg-black/50 text-white px-2 py-1 rounded text-xs">
        <span className="hidden sm:inline">Press M to toggle controls</span>
        <span className="sm:hidden">Touch to play</span>
      </div> */}
    </div>
  );
}
//       </div> */}

//       {/* Footer with instructions - mobile friendly */}
//       <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 bg-black/50 text-white px-2 py-1 rounded text-xs">
//         <span className="hidden sm:inline">Press M to toggle controls</span>
//         <span className="sm:hidden">Touch to play</span>
//       </div>
//     </div>
//   );
// }
