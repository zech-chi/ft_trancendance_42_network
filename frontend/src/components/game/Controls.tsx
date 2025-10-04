'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import Dice from './Dice';

const GameControls: React.FC = () => {
  const { gameState, rollDice, makeMove } = useGame();
  
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
  const isCurrentPlayerHuman = currentPlayer && !currentPlayer.isAI;
  
  const handleDiceRoll = (value: number) => {
    console.log('Dice rolled:', value);
    // In a real implementation, this would communicate with the backend
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Game Controls</h2>
      
      <div className="flex flex-col items-center">
        <Dice 
          onRollComplete={handleDiceRoll} 
          disabled={!isCurrentPlayerHuman || gameState.status !== 'playing'}
        />
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Valid Moves:</h3>
          <div className="flex flex-wrap gap-2">
            {gameState.validMoves?.map(move => (
              <button
                key={move.pieceId}
                onClick={() => makeMove(move.pieceId)}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Move Piece {move.pieceId.split('-').pop()}
              </button>
            ))}
            
            {(!gameState.validMoves || gameState.validMoves.length === 0) && (
              <p className="text-gray-500">No valid moves available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;