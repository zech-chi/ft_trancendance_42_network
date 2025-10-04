import { useState, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Piece, Player } from '@/types/game';

export const useAIGame = () => {
  const { gameState, dispatch } = useGame();
  const [isAIThinking, setIsAIThinking] = useState(false);

  const simulateAITurn = useCallback(async () => {
    if (gameState.status !== 'playing' || 
        !gameState.currentPlayer || 
        !gameState.players.find(p => p.id === gameState.currentPlayer)?.isAI) {
      return;
    }

    setIsAIThinking(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
    if (!aiPlayer) return;
    
    // Simple AI logic - just move the first available piece
    const movablePieces = aiPlayer.pieces.filter(piece => 
      !piece.isHome && !piece.isFinished
    );
    
    if (movablePieces.length > 0) {
      const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
      
      // Simulate move
      dispatch({
        type: 'UPDATE_PIECE',
        payload: {
          playerId: aiPlayer.id,
          piece: {
            ...randomPiece,
            position: (randomPiece.position + 1) % 12 // Simple circular movement
          }
        }
      });
    }
    
    // End AI turn
    const nextPlayerIndex = (gameState.players.findIndex(p => p.id === gameState.currentPlayer) + 1) % gameState.players.length;
    dispatch({
      type: 'SET_CURRENT_PLAYER',
      payload: gameState.players[nextPlayerIndex].id
    });
    
    setIsAIThinking(false);
  }, [gameState, dispatch]);

  return {
    simulateAITurn,
    isAIThinking
  };
};