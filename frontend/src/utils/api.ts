import { CreateGameRequest, JoinGameRequest, MovePieceRequest } from '@/types/api';
import { GameState } from '@/types/game';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Game management API calls
export const api = {
  // Create a new game
  createGame: (data: CreateGameRequest): Promise<{ gameId: string }> => 
    apiRequest('/games', { method: 'POST', body: JSON.stringify(data) }),

  // Get game state
  getGame: (gameId: string): Promise<GameState> => 
    apiRequest(`/games/${gameId}`),

  // Join a game
  joinGame: (gameId: string, data: JoinGameRequest): Promise<GameState> => 
    apiRequest(`/games/${gameId}/join`, { method: 'POST', body: JSON.stringify(data) }),

  // Make a move
  movePiece: (gameId: string, data: MovePieceRequest): Promise<GameState> => 
    apiRequest(`/games/${gameId}/move`, { method: 'POST', body: JSON.stringify(data) }),

  // Roll dice
  rollDice: (gameId: string, playerId: string): Promise<{ value: number, isDouble: boolean }> => 
    apiRequest(`/games/${gameId}/roll`, { method: 'POST', body: JSON.stringify({ playerId }) }),

  // List available games
  listGames: (): Promise<Array<{ id: string, players: number, maxPlayers: number }>> => 
    apiRequest('/games'),

  // Create tournament
  createTournament: (data: { playerCount: number }): Promise<{ tournamentId: string }> => 
    apiRequest('/tournaments', { method: 'POST', body: JSON.stringify(data) }),
};