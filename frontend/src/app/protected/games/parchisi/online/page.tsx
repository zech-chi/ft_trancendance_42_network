// app/online/page.tsx
'use client';

import React, { useState , useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/parchisiContexts/SocketContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {useGame } from "@/context/parchisiContexts/GameContext";
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';


export default function OnlineGamePage() {
  return (
  
            <OnlinePageContent  />
  )
}

function OnlinePageContent() {
  const [activeTab, setActiveTab] = useState<'existing' |'join' | 'create'>('join');
  const [gameCode, setGameCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [rooms, setRooms] = useState<{id:string; players:number; status:string}[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const router = useRouter();
  const { socket, setNamespace, isConnected } = useSocket();
  const { state , createGame, joinLobby } = useGame();

useEffect(() => {
  setNamespace("online");
}, []);

  /* EXISTING ROOMS  */
    // Fetch rooms every 5 seconds
  useEffect(() => {
  async function fetchRooms() {
    try {
      const res = await fetch("http://localhost:5555/games/parchisi/online/rooms");
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


const handleJoinRoom = async(roomId: string) => {
    setGameCode(roomId);
    await handleJoinGame(roomId); // reuse your existing join logic
};

  /** CREATE GAME */
  const handleCreateGame = async () => {
    if (isCreating) return; // Prevent double click
    setIsCreating(true);
    try {
      setIsCreating(true);
      const gameId = await createGame();
      router.push(`/protected/games/parchisi/online/lobby/${gameId}?role=host`);
    } catch (err) {
      alert(err);
    } finally {
      setTimeout(() => setIsCreating(false), 1500);
    }
  };

  /** JOIN GAME */
   const handleJoinGame = async (roomId?: string) => {
    if (isJoining) return; // Prevent double click
    setIsJoining(true);
    try {
      setIsJoining(true);
      const code  = roomId || gameCode
      await joinLobby(code);
      router.push(`/protected/games/parchisi/online/lobby/${code}?role=guest`);
    } catch (err) {
      alert(err);
    } finally {
      setTimeout(() => setIsJoining(false), 1500);
    }
  };

  return (
    <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
<Sidebar />
<Navbar />
<main
  className="flex flex-row items-center justify-center relative overflow-x-hidden
                    xl:pl-20 2xl:pl-24 w-full
                    h-[calc(100%-130px)]
                    xl:h-[calc(100%-75px)]
                    2xl:h-[calc(100%-85px)]
                    2xl:mt-[67px] xl:mt-[60px]
                "
>
    <div className="min-h-screen from-purple-900 to-indigo-800 p-4  flex-1 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Parcheesi</h1>
          <p className="text-purple-200">Play Parcheesi online with friends</p>
        </div>

        {/* Connection Status */}
        <div
          className={`flex items-center justify-center mb-6 ${
            isConnected ? 'text-green-400' : 'text-yellow-400'
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-400' : 'bg-yellow-400'
            }`}
          ></div>
          <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-indigo-700 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'join'
                ? 'bg-white text-indigo-800'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Join Game
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-white text-indigo-800'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Create Game
          </button>
          <button
  onClick={() => setActiveTab('existing')}
  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
    activeTab === 'existing'
      ? 'bg-white text-indigo-800'
      : 'text-indigo-200 hover:text-white'
  }`}
>
  Join Existing Games
</button>
        </div>
        {/* Content */}
        <Card className="bg-white overflow-auto">
          {activeTab === 'join' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Join a Game</h2>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter game code"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  className="w-full text-center break-all" // ✅ allows UUID
                />
                <Button
                  onClick={() => handleJoinGame()}
                  disabled={!gameCode || gameCode.length < 4}
                  loading={isJoining}
                  className="w-full"
                >
                  Join Game
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Create a Game</h2>
              <p className="text-gray-600 mb-6">
                Start a new game and invite friends to your room.
              </p>
              <Button
                onClick={handleCreateGame}
                loading={isCreating}
                className="w-full"
              >
                Create New Game
              </Button>
            </div>
          )}
        {activeTab === 'existing' && (
  <div className="p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Available Rooms</h2>
    {isLoadingRooms ? (
      <p className="text-gray-500">Loading rooms...</p>
    ) : rooms.length === 0 ? (
      <p className="text-gray-500">No rooms available. Try creating one!</p>
    ) : (
      <ul className="space-y-3">
        {rooms.map((room) => (
          <li
            key={room.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
          >
            <div>
              <p className="font-medium text-gray-800">
                Room {room.id}
              </p>
              <p className="text-sm text-gray-500">
                {room.players} players · {room.status}
              </p>
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

        {/* Invite Friends placeholder */}
        <div className="mt-6 text-center text-sm text-purple-200">
          🚧 Invite Friends feature coming soon...
        </div>
      </div>
    </div>
</main>
</div>
  );
}