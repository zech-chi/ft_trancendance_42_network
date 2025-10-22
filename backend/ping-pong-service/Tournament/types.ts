export interface CreateTournamentOBJ {
    name: string;
    number_of_players: number;
    isPrivate: boolean;
    createdBy: number;
}

export interface JoinedPlayerOBJ {
    tournamentId: string;
    playerId: number;
}

export interface TournamentID {
    tournamentId: string;
}

export interface WinnerOBJ {
    tournamentId: string;
    winnerId: number;
}