import { useState, useEffect } from 'react';
import { GameState } from '@/types/game';
import { api } from '@/utils/api';

export const useGameState = (gameId: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        setLoading(true);
        const state = await api.getGame(gameId);
        setGameState(state);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch game state');
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGameState();
    }
  }, [gameId]);

  const updateGameState = (newState: GameState) => {
    setGameState(newState);
  };

  return { gameState, loading, error, updateGameState };
};