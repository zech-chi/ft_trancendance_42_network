import { GameState } from './game';

export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface CreateGameRequest {
  mode: 'local' | 'ai' | 'online' | 'tournament';
  players: number;
  playerName?: string;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
}

export interface JoinGameRequest {
  gameId: string;
  playerName: string;
}

export interface MovePieceRequest {
  gameId: string;
  playerId: string;
  pieceId: string;
}

export type CreateGameResponse = ApiResponse<{ gameId: string }>;
export type GetGameResponse = ApiResponse<GameState>;
export type JoinGameResponse = ApiResponse<GameState>;
export type MovePieceResponse = ApiResponse<GameState>;
export type ListGamesResponse = ApiResponse<Array<{ id: string, players: number, maxPlayers: number }>>;
export type CreateTournamentResponse = ApiResponse<{ tournamentId: string }>;