
export enum PlayerColor {
  RED = "RED",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
  BLUE = "BLUE"
}

export type saved = 'RED' | 'YELLOW' | 'BLUE' | 'GREEN' | 'all';

export interface Piece {
  id: number; // 1–4 for each player
  playerId: number; // 1–4
  position: BoardPosition;
  // where: 'center' | 'left' | 'right'; // where the piece is on the board
}
export interface Player {
  id: number;
userName: string;
  color: PlayerColor;
  startIndex: number;
  homeEntryIndex: number;
  pieces: Piece[];
  Remain_moves: { piece: Piece; moves: number[] }[]; // Store available moves for the current player
  bonus_moves: { piece: Piece; moves: number[] }[];
  isReady: boolean;
}
export interface HomeTile {
  index: number; // from 0 to 6 representing steps in home path if 7 mean its home
  playerId: number; // whose home path it is
  occupiedBy: Piece[]; // pieces on this tile, usually 0 or 1 piece
  color : string;
}

export interface HomePath{
  Hometile:HomeTile[]; // 7 step 
}



export interface SharedTile {
  index: number;
  isSafe: boolean;
  toWhom: saved;
  occupiedBy: Piece[]; // Empty if no piece is there
}

// maybe not needed, but useful for game state management
export interface GameBoard {
  sharedPath: SharedTile[]; // 68 steps
}

export interface GameState {
  board: GameBoard;
  players: Player[]; // can be from 2 to 4 players
  currentPlayerIndex: number; // whose turn is it
}

// Distinguish the final home (goal) and the base area per player
export interface GoalTile {
  type: 'goal';
  playerId: number;
  color: string;
  occupiedBy: Piece[]; // can hold multiple of your own pieces
}

export interface BaseArea {
  type: 'base';
  playerId: number;
  color: string;
  pieces: Piece[]; // pieces still in base
}

// One convenient union for any board position
export type BoardPosition =
  | number // shared path index (0..67)
  | 'base' // player's base (use piece.playerId to locate which base)
  | 'home' // player's final goal (use piece.playerId to locate which goal)
  | { homeIndex: number}; // inside home path steps (0..6)

  

  /**
 * MoveDecision describes what GameLogic decided should happen for a move.
 * GameRoom will execute these decisions (remove/add pieces, emit events).
 */
export type MoveDecision = {
  piece: Piece;
  from: BoardPosition | undefined;
  to: BoardPosition;
  path: BoardPosition[]; // intermediate shared indices for animation (empty if not on shared)
  capture: { id: number; playerId: number; position: BoardPosition } | null; // opponent pieces to send to base
  allowed: boolean;
  reason?: string;
  placeTojump?: BoardPosition [];
};