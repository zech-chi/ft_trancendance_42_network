import React from 'react';
import { useGame } from '@/contexts/GameContext';

const StatusPanel: React.FC = () => {
  const { gameState } = useGame();
  
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Game Status</h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="font-semibold">Status:</span>
          <span className="ml-2 capitalize">{gameState.status}</span>
        </div>
        
        {currentPlayer && (
          <div className="flex items-center">
            <span className="font-semibold">Current Turn:</span>
            <span 
              className="ml-2 px-2 py-1 rounded text-white"
              style={{ backgroundColor: currentPlayer.color }}
            >
              {currentPlayer.name}
            </span>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Players:</h3>
        <ul>
          {gameState.players.map(player => (
            <li key={player.id} className="flex items-center mb-1">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: player.color }}
              ></div>
              <span>{player.name}</span>
              {player.isAI && <span className="ml-2 text-gray-500">(AI)</span>}
            </li>
          ))}
        </ul>
      </div>
      
      {gameState.currentDiceRoll.value > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Last Dice Roll:</h3>
          <div className="text-2xl font-bold">
            {gameState.currentDiceRoll.value}
            {gameState.currentDiceRoll.isDouble && <span className="ml-2 text-sm">(Double!)</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPanel;