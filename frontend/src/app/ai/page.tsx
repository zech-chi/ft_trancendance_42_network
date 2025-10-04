'use client';

import React, { useState } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import GameBoard from '@/components/game/Board';
import GameControls from '@/components/game/Controls';
import StatusPanel from '@/components/game/StatusPanel';
import { useAIGame } from '@/hooks/useAIGame';
import { createAIGame } from '@/utils/gameHelpers';

export default function AIGamePage() {
  const [gameId, setGameId] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  const { simulateAITurn } = useAIGame();

  const initializeGame = () => {
    const gameState = createAIGame(difficulty);
    setGameId(gameState.id);
  };

  if (!gameId) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Play vs AI</h2>
          <div className="mb-4">
            <label className="block mb-2">AI Difficulty:</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button 
            onClick={initializeGame}
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
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