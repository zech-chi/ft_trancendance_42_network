'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/parchisiContexts/SocketContext';
import { useGame } from '@/context/parchisiContexts/GameContext';
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Button from '@/components/ui/Button';
import ThemePopup from '@/components/parchisi_game/ThemePopup';
import { AiOutlineSkin } from 'react-icons/ai'; 

export default function LocalGamePage() {
  const [players, setPlayers] = useState(2);
  const router = useRouter();
  const { setNamespace } = useSocket();
  const { createGame } = useGame();
  const [isCreating, setIsCreating] = useState(false);
  const [showThemePopup, setShowThemePopup] = useState(false);

  useEffect(() => {
    setNamespace("local");
  }, []);

  const handleStartGame = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const gameId = await createGame(players);
      router.push(`/protected/games/parchisi/game/${gameId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create game. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col xl:flex-row items-center justify-center min-w-[200px] w-full overflow-x-auto bg-black/40 backdrop-blur-md p-4">
      <Sidebar />
      <Navbar />

      <main className="relative flex flex-col items-center justify-center w-full max-w-md xl:max-w-lg p-6 rounded-3xl
          border border-[#ffb86b]/30
          shadow-[0_0_40px_rgba(255,160,90,0.45)]
          bg-gradient-to-b from-[rgba(65,7,33,0.85)] to-[rgba(22,4,18,0.9)]
          gap-6">

        {/* Customize Icon */}
        <button
          onClick={() => setShowThemePopup(true)}
          className="absolute top-4 right-4 text-[#ffb86b]/90 hover:text-[#ffb86b] text-2xl"
          title="Customize"
        >
          <AiOutlineSkin />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#ffb86b] mb-2">Local Multiplayer</h2>
          <p className="text-[#ffb86b]/80 text-sm sm:text-base">Play with up to 4 players on the same device</p>
        </div>

        {/* Players Selection */}
        <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center">
          <label className="text-[#ffb86b]/80 font-medium text-sm sm:text-base whitespace-nowrap">
            Number of Players:
          </label>

          <select
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value))}
            className="w-40 sm:w-32 p-3 sm:p-4 bg-black/25 text-white border border-[#ffb86b]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb86b] text-center"
          >
            {[2, 3, 4].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>

          <button
            onClick={handleStartGame}
            className="w-full sm:w-auto mt-4 sm:mt-0 py-2 sm:py-4 px-4 rounded-3xl font-semibold
            bg-red-500 hover:opacity-90 text-white transition"
          >
            Start Game
          </button>
        </div>
      </main>

      {showThemePopup && <ThemePopup onClose={() => setShowThemePopup(false)} />}
    </div>
  );
}
