'use client';

import React, { createContext, useContext, useState } from 'react';

// ✅ Player type now includes playerId
type Player = {
  playerId: number | null;
  name: string;
  image: string | null;
  status?: string;
};

type Match = {
  player1: Player;
  player2: Player;
};

type Matches = {
  semi1: Match;
  semi2: Match;
  final: Match;
  winner: Player;
};

type TournamentContextType = {
  matches: Matches;
  updateMatch: (
    round: Exclude<keyof Matches, 'winner'>, // ✅ only semi1, semi2, final
    playerKey: keyof Match, // ✅ only player1 | player2
    data: Partial<Player>
  ) => void;
  setWinner: (winner: Player) => void;
  resetTournament: () => void;
};

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultPlayer: Player = { playerId: null, name: 'None', image: null, status: 'not played' };

  const [matches, setMatches] = useState<Matches>({
    semi1: { player1: { ...defaultPlayer }, player2: { ...defaultPlayer } },
    semi2: { player1: { ...defaultPlayer }, player2: { ...defaultPlayer } },
    final: { player1: { ...defaultPlayer }, player2: { ...defaultPlayer } },
    winner: { playerId: null, name: 'None', image: null },
  });

  // ✅ Update player data for semi1, semi2, or final
  const updateMatch = (
    round: Exclude<keyof Matches, 'winner'>,
    playerKey: keyof Match,
    data: Partial<Player>
  ) => {
    setMatches((prev) => ({
      ...prev,
      [round]: {
        ...prev[round],
        [playerKey]: {
          ...prev[round][playerKey],
          ...data,
        },
      },
    }));
  };

  // ✅ Set tournament winner
  const setWinner = (winner: Player) => {
    setMatches((prev) => ({ ...prev, winner }));
  };

  // ✅ Reset all matches
  const resetTournament = () => {
    setMatches({
      semi1: { player1: { ...defaultPlayer }, player2: { ...defaultPlayer } },
      semi2: { player1: { ...defaultPlayer }, player2: { ...defaultPlayer } },
      final: { player1: { ...defaultPlayer }, player2: { ...defaultPlayer } },
      winner: { playerId: null, name: 'None', image: null },
    });
  };

  return (
    <TournamentContext.Provider value={{ matches, updateMatch, setWinner, resetTournament }}>
      {children}
    </TournamentContext.Provider>
  );
};

// ✅ Hook for easy access
export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) throw new Error('useTournament must be used within a TournamentProvider');
  return context;
};
