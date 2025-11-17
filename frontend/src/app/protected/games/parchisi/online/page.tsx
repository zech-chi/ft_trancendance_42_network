'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/parchisiContexts/SocketContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useGame } from "@/context/parchisiContexts/GameContext";
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { X } from 'lucide-react';
import { name } from '@babylonjs/gui';

export default function OnlineGamePage() {
  return <OnlinePageContent />;
}

function OnlinePageContent() {
  const [activeTab, setActiveTab] = useState<'existing' | 'join' | 'create'>('join');
  const [gameCode, setGameCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [rooms, setRooms] = useState<{ id: string; players: number; status: string }[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const router = useRouter();
  const { socket, setNamespace, isConnected, namespace } = useSocket();
  const { state, createGame, joinLobby } = useGame();

  useEffect(() => {
    setNamespace("online");
  }, []);

  // Fetch rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/parchisi/online/rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Failed to load rooms", err);
      } finally {
        setIsLoadingRooms(false);
      }
    }
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinRoom = async (roomId: string) => {
    setGameCode(roomId);
    await handleJoinGame(roomId);
  };

  const handleCreateGame = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const gameId = await createGame();
      router.push(`/protected/games/parchisi/online/lobby/${gameId}?role=host`);
    } catch (err) {
      alert(err);
    } finally {
      setTimeout(() => setIsCreating(false), 500);
    }
  };

  const handleJoinGame = async (roomId?: string) => {
    if (isJoining) return;
    setIsJoining(true);
    try {
      const code = roomId || gameCode;
      await joinLobby(code);
      router.push(`/protected/games/parchisi/online/lobby/${code}?role=guest`);
    } catch (err) {
      alert(err);
    } finally {
      setTimeout(() => setIsJoining(false), 500);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center min-w-[200px] w-full overflow-x-auto bg-black/40 backdrop-blur-md">
      <Sidebar />
      <Navbar />
      <main className="flex flex-col items-center justify-center w-full max-w-3xl p-6 rounded-3xl
          border border-[#ffb86b]/30
          shadow-[0_0_40px_rgba(255,160,90,0.45)]
          bg-gradient-to-b from-[rgba(5,47,74,1)] to-[rgba(0,166,244,1)]">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#ffb86b] mb-2">Parcheesi Online</h1>
          <p className="text-[#ffb86b]/80">Play Parcheesi with friends in real-time</p>
        </div>

        {/* Connection Status remove after */}
        <div className={`flex items-center justify-center mb-6 text-sm font-medium ${
          isConnected ? 'text-green-400' : 'text-yellow-400'
        }`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-[#1e0d24]/80 rounded-xl p-1 border border-[#ffb86b]/30">
          {['join', 'create', 'existing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#ffb86b] text-black'
                  : 'text-[#ffb86b]/70 hover:text-white'
              }`}
            >
              {tab === 'join' ? 'Join Game' : tab === 'create' ? 'Create Game' : 'Join Existing'}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <Card className="rounded-2xl overflow-auto p-6">
          {activeTab === 'join' && (
            <div className="flex flex-col items-center gap-4">
              <Input
                type="text"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="w-full text-center text-white bg-black/25 border border-[#ffb86b]/40 focus:ring-[#ffb86b]"
              />
              <Button
                onClick={() => handleJoinGame()}
                disabled={!gameCode || gameCode.length < 4}
                loading={isJoining}
                className="w-full bg-gradient-to-r from-[#ff6f91] to-[#ff9671] hover:opacity-90 text-white"
              >
                Join Game
              </Button>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleCreateGame}
                loading={isCreating}
                className="w-full bg-gradient-to-r from-[#ff6f91] to-[#ff9671] hover:opacity-90 text-white"
              >
                Create New Game
              </Button>
            </div>
          )}

          {activeTab === 'existing' && (
            <div className="flex flex-col gap-4">
              {isLoadingRooms ? (
                <p className="text-[#ffb86b]/80 text-center">Loading rooms...</p>
              ) : rooms.length === 0 ? (
                <p className="text-[#ffb86b]/80 text-center">No rooms available. Try creating one!</p>
              ) : (
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  {rooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex items-center justify-between p-3 border border-[#ffb86b]/20 rounded-xl hover:bg-[#ffb86b]/10 gap-3.5"
                    >
                      <div>
                        <p className="font-medium text-[#ffb86b]">Room {room.id}</p>
                        <p className="text-sm text-[#ffb86b]/70">{room.players} players · {room.status}</p>
                      </div>
                      <Button
                        onClick={() => handleJoinRoom(room.id)}
                        disabled={room.status !== "waiting"}

                      >
                        Join
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Card>

        <div className="mt-6 text-center text-sm text-[#ffb86b]/70">
          🚧 Invite Friends feature coming soon...
        </div>
      </main>
    </div>
  );
}
