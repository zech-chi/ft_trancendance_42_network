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
import { fetchWithAuth } from '@/utils/fetchWithAuth';

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
  // show to user messages from context
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(state.message);
  }, [state.message]);


  useEffect(() => {
    setNamespace("online");
  }, []);

  // Fetch rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetchWithAuth("/api/parchisi/online/rooms", {
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          setRooms([]);
        }
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
      router.replace(`/gzone/games/parchisi/online/lobby/${gameId}?role=host`);
    } catch (err) {
      console.error(err);
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
      router.replace(`/gzone/games/parchisi/online/lobby/${code}?role=guest`);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsJoining(false), 500);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center min-w-[200px] w-full overflow-x-auto  backdrop-blur-md">
      <Sidebar />
      <Navbar />
      <main className="flex flex-col items-center justify-center w-full max-w-3xl p-6 rounded-3xl
          shadow-[0_0_40px_rgba(28,186,186,0.45)]
          bg-gradient-to-b bg-gray-800/40  p-6  border border-white/20">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Parcheesi Online</h1>
          <p className="text-[#1CBABA]/80">Play Parcheesi with friends in real-time</p>
          {errorMessage && (
            <div className="bg-[#ffb86b]/80 text-white text-sm rounded-2xl px-4 py-2">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Connection Status remove after */}
        <div className={`flex items-center justify-center mb-6 text-sm font-medium ${isConnected ? 'text-green-400' : 'text-yellow-400'
          }`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>

        {/* Tabs */}
        <div className="flex mb-6rounded-xl p-1 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 rounded-2xl">
          {['join', 'create', 'existing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${activeTab === tab
                  ? 'bg-[#1CBABA]/70 text-white'
                  : 'text-white hover:text-[#1CBABA]/80'
                }`}
            >
              {tab === 'join' ? 'Join Game' : tab === 'create' ? 'Create Game' : 'Join Existing'}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <Card className="rounded-2xl overflow-auto p-6">
          {activeTab === 'join' && (
            <div className="flex flex-col items-center gap-4 ">
              <Input
                type="text"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="w-full text-center text-white  from-black/40 to-black/20 backdrop-blur-sm rounded-2xl"
              />
              <Button
                onClick={() => handleJoinGame()}
                disabled={!gameCode || gameCode.length < 4}
                loading={isJoining}
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
              >
                Create New Game
              </Button>
            </div>
          )}

          {activeTab === 'existing' && (
            <div className="flex flex-col gap-4 border rounded-2xl">
              {isLoadingRooms ? (
                <p className="text-[#ffb86b]/80 text-center">Loading rooms...</p>
              ) : rooms.length === 0 ? (
                <p className="text-[#ffb86b]/80 text-center">No rooms available. Try creating one!</p>
              ) : (
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  {rooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex items-center justify-between p-3 border border-[#ffb86b]/20 rounded-xl hover:bg-[#000000]/15 gap-3.5"
                    >
                      <div>
                        <p className="font-medium text-white">Room {room.id.slice(0, 6)}</p>
                        <p className="text-sm text-white/70">{room.players} players · {room.status}</p>
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
      </main>
    </div>
  );
}
