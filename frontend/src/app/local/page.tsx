'use client';

import React, { useState } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import GameBoard from '@/components/game/Board';
import GameControls from '@/components/game/Controls';
import StatusPanel from '@/components/game/StatusPanel';
import { createLocalGame } from '@/utils/gameHelpers';
import { useSocket } from '@/contexts/SocketContext';

export default function LocalGamePage() {
  const [gameId, setGameId] = useState<string>('');
  const [players, setPlayers] = useState(2); // Default to 2 players
  const { setNamespace } = useSocket();
  setNamespace("local");
  const initializeGame = () => {
    const gameState = createLocalGame(players);
    setGameId(gameState.id);
  };

  if (!gameId) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Local Multiplayer</h2>
          <div className="mb-4">
            <label className="block mb-2">Number of Players:</label>
            <select 
              value={players} 
              onChange={(e) => setPlayers(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={initializeGame}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
      <div className="min-h-screen  p-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GameBoard />
          </div>
          <div className="space-y-6">
            <StatusPanel />
            <GameControls />
          </div>
        </div>
      </div>
    </GameProvider>
  );
}