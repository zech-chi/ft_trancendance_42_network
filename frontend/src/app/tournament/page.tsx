'use client';

import React, { useState } from 'react';
import TournamentBracket from '@/components/game/TournamentBracket';
import { createTournament } from '@/utils/gameHelpers';

export default function TournamentPage() {
  const [tournament, setTournament] = useState<any>(null);
  const [playerCount, setPlayerCount] = useState(4);

  const initializeTournament = () => {
    const newTournament = createTournament(playerCount);
    setTournament(newTournament);
  };

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Tournament Mode</h2>
          <div className="mb-4">
            <label className="block mb-2">Number of Players:</label>
            <select 
              value={playerCount} 
              onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[4, 8, 16].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={initializeTournament}
            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            Create Tournament
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tournament Bracket</h1>
        <TournamentBracket tournament={tournament} />
      </div>
    </div>
  );
}