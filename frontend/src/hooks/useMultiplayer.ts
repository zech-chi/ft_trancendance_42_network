import { useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useSocket } from '@/contexts/SocketContext';
import { GameEvent } from '@/types/data';
import { GameSocketHandler } from '@/utils/socket';

export const useMultiplayer = (gameId: string) => {
  const { gameState, dispatch } = useGame();
  const { socket } = useSocket();
  
  useEffect(() => {
    if (!socket || !gameId) return;
    
    const gameSocket = new GameSocketHandler(socket);
    
    // Join the game room
    gameSocket.joinGame({ gameId, playerName: 'Player' });
    
    // Set up event listeners
    gameSocket.onGameUpdated((gameData) => {
      dispatch({ type: 'SET_GAME_STATE', payload: gameData });
    });
    
    gameSocket.onPlayerJoined((playerData) => {
      // Handle player joined
      console.log('Player joined:', playerData);
    });
    
    gameSocket.onDiceRolled((rollData) => {
      dispatch({ type: 'SET_DICE_ROLL', payload: rollData });
    });
    
    gameSocket.onPieceMoved((moveData) => {
      dispatch({
        type: 'UPDATE_PIECE',
        payload: {
          playerId: moveData.playerId,
          piece: moveData.piece
        }
      });
    });
    
    gameSocket.onTurnChanged((turnData) => {
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: turnData.playerId });
    });
    
    gameSocket.onGameOver((gameOverData) => {
      console.log('Game over, winner:', gameOverData.winner);
    });
    
    gameSocket.onError((errorData) => {
      console.error('Socket error:', errorData);
    });
    
    return () => {
      gameSocket.removeAllListeners();
      gameSocket.leaveGame({ gameId, playerId: 'current-player-id' });
    };
  }, [socket, gameId, dispatch]);
  
  const rollDice = () => {
    if (!socket) return;
    const gameSocket = new GameSocketHandler(socket);
    gameSocket.rollDice({ gameId, playerId: 'current-player-id' });
  };
  
  const movePiece = (pieceId: string) => {
    if (!socket) return;
    const gameSocket = new GameSocketHandler(socket);
    gameSocket.movePiece({ gameId, playerId: 'current-player-id', pieceId });
  };
  
  return {
    rollDice,
    movePiece
  };
};