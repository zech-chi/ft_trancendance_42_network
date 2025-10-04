// import { useEffect } from 'react';
// import { useSocket } from '@/contexts/SocketContext';
// import { useGame } from '@/contexts/GameContext';
// import { GameEvent } from '@/types/socket';

// export const useGameSocket = (gameId?: string) => {
//   const { socket, isConnected } = useSocket();
//   const { dispatch } = useGame();

//   useEffect(() => {
//     if (!socket || !gameId) return;

//     // Join game room
//     socket.emit(GameEvent.JOIN_GAME, gameId);

//     // Set up event listeners
//     socket.on(GameEvent.GAME_UPDATED, (gameState) => {
//       dispatch({ type: 'SET_GAME_STATE', payload: gameState });
//     });

//     socket.on(GameEvent.PLAYER_JOINED, (player) => {
//       // Update game state with new player
//       console.log('Player joined:', player);
//     });

//     socket.on(GameEvent.DICE_ROLLED, (rollResult) => {
//       dispatch({ type: 'SET_DICE_ROLL', payload: rollResult });
//     });

//     socket.on(GameEvent.PIECE_MOVED, (data) => {
//       dispatch({ 
//         type: 'UPDATE_PIECE', 
//         payload: { playerId: data.playerId, piece: data.piece } 
//       });
//     });

//     socket.on(GameEvent.TURN_CHANGED, (playerId) => {
//       dispatch({ type: 'SET_CURRENT_PLAYER', payload: playerId });
//     });

//     // Clean up on unmount
//     return () => {
//       socket.off(GameEvent.GAME_UPDATED);
//       socket.off(GameEvent.PLAYER_JOINED);
//       socket.off(GameEvent.DICE_ROLLED);
//       socket.off(GameEvent.PIECE_MOVED);
//       socket.off(GameEvent.TURN_CHANGED);
      
//       if (gameId) {
//         socket.emit(GameEvent.LEAVE_GAME, gameId);
//       }
//     };
//   }, [socket, gameId, dispatch, isConnected]);

//   const emitMovePiece = (pieceId: string) => {
//     if (!socket || !gameId) return;
//     socket.emit(GameEvent.MOVE_PIECE, { gameId, pieceId });
//   };

//   const emitRollDice = () => {
//     if (!socket || !gameId) return;
//     socket.emit(GameEvent.ROLL_DICE, { gameId });
//   };

//   return {
//     emitMovePiece,
//     emitRollDice,
//     isConnected
//   };
// };