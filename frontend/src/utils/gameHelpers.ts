import { GameState, Player, Piece } from '@/types/game';

export function createLocalGame(playerCount: number): GameState {
  const players: Player[] = [];
  const colors = ['red', 'blue', 'green', 'yellow'];
  
  for (let i = 0; i < playerCount; i++) {
    players.push({
      id: `player-${i}`,
      name: `Player ${i + 1}`,
      color: colors[i],
      isAI: false,
      pieces: Array(4).fill(0).map((_, idx) => ({
        id: `player-${i}-piece-${idx}`,
        position: -1, // Starting at home
        isHome: true,
        isFinished: false
      })),
      score: 0
    });
  }
  
  return {
    id: `local-${Date.now()}`,
    status: 'playing',
    players,
    currentPlayer: players[0].id,
    currentDiceRoll: { value: 0, isDouble: false },
    winner: null,
    mode: 'local',
    validMoves: []
  };
}

export function createAIGame(difficulty: 'easy' | 'medium' | 'hard'): GameState {
  const humanPlayer: Player = {
    id: 'human',
    name: 'You',
    color: 'red',
    isAI: false,
    pieces: Array(4).fill(0).map((_, idx) => ({
      id: `human-piece-${idx}`,
      position: -1,
      isHome: true,
      isFinished: false
    })),
    score: 0
  };
  
  const aiPlayer: Player = {
    id: 'ai',
    name: `AI (${difficulty})`,
    color: 'blue',
    isAI: true,
    pieces: Array(4).fill(0).map((_, idx) => ({
      id: `ai-piece-${idx}`,
      position: -1,
      isHome: true,
      isFinished: false
    })),
    score: 0
  };
  
  return {
    id: `ai-${Date.now()}`,
    status: 'playing',
    players: [humanPlayer, aiPlayer],
    currentPlayer: humanPlayer.id,
    currentDiceRoll: { value: 0, isDouble: false },
    winner: null,
    mode: 'ai',
    validMoves: []
  };
}

export function getBoardPosition(position: number, playerId: string) {
  // This is a simplified version - you'll need to implement the actual board layout
  const basePositions = [
    { top: '10%', left: '10%' },
    { top: '10%', left: '30%' },
    { top: '10%', left: '50%' },
    { top: '10%', left: '70%' },
    { top: '30%', left: '70%' },
    { top: '50%', left: '70%' },
    { top: '70%', left: '70%' },
    { top: '70%', left: '50%' },
    { top: '70%', left: '30%' },
    { top: '70%', left: '10%' },
    { top: '50%', left: '10%' },
    { top: '30%', left: '10%' },
  ];
  
  if (position < 0) {
    // Piece is at home
    const playerIndex = playerId === 'player-0' ? 0 : 
                        playerId === 'player-1' ? 1 :
                        playerId === 'player-2' ? 2 : 3;
    const homePositions = [
      { top: '5%', left: '5%' },
      { top: '5%', left: '85%' },
      { top: '85%', left: '85%' },
      { top: '85%', left: '5%' }
    ];
    return homePositions[playerIndex];
  }
  
  return basePositions[position % basePositions.length];
}

export function createTournament(playerCount: number): any {
  // This is a simplified tournament structure
  return {
    id: `tournament-${Date.now()}`,
    rounds: [
      {
        games: [`game-1-${Date.now()}`, `game-2-${Date.now()}`],
        winners: []
      },
      {
        games: [`final-game-${Date.now()}`],
        winners: []
      }
    ],
    players: Array(playerCount).fill(0).map((_, i) => `Player ${i + 1}`),
    status: 'pending'
  };
}