// // types/game.ts

// export interface Piece {
//   id: string;
//   position: number;
//   isHome: boolean;
//   isFinished: boolean;
// }

// export interface Player {
//   id: string;
//   name: string;
//   userName: string;
//   color: string;
//   isAI: boolean;
//   pieces: Piece[];
//   score: number;
//   isReady: boolean;
// }

// export interface DiceRoll {
//   value: number;
//   isDouble: boolean;
// }

// export interface GameState {
//   id: string;
//   status: 'waiting' | 'playing' | 'paused' | 'finished';
//   players: Player[];
//   currentPlayer: string;
//   currentDiceRoll: DiceRoll;
//   winner: string | null;
//   mode: 'local' | 'ai' | 'online' | 'tournament';
//   validMoves: { pieceId: string; position: number }[];
// }

export interface Lobby {
  id: string;
  players: Player[];
}

export type PieceSkin = {
  id: string
  name: string
  image: string // Added image property for pieces
}

export type DiceSkin = {
  id: string
  name: string
  image: string // Added image property for dice
}

export type BoardTheme = {
  id: string
  name: string
  image: string
}