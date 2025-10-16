'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/parchisiContexts/SocketContext';
import { useGame } from '@/context/parchisiContexts/GameContext';

export default function LocalGamePage() {
  const [players, setPlayers] = useState(2);
  const router = useRouter();
  const { setNamespace } = useSocket();
  const { createGame, state } = useGame();

  // Set namespace to local when entering the page
 useEffect(() => {
  setNamespace("local");
}, []);

  // If lobby (game) is created → redirect automatically
  // useEffect(() => {
  //   if (state?.lobby?.gameId) {
  //     router.push(`/game/${state.lobby.gameId}`);
  //   }
  // }, [state?.lobby?.gameId, router]);

  const handleStartGame = async () => {
    try {
      const gameId = await createGame(players);
      console.log("Redirecting to game:", gameId);
      router.push(`/protected/games/parchisi/game/${gameId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create game. Please try again.");
    }
  };

  return (
<div className="flex items-center justify-center h-[calc(100vh-75px)]">
  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-bold mb-4 text-center">Local Multiplayer</h2>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Number of Players:</label>
          <select
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {[2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleStartGame}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
