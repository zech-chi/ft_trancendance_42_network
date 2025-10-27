// tournamentSystem.ts 
import { Tournament } from "./Tournament";
import { Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";

export class TournamentSystem {
    // key: tournament ID, value: Tournament instance
    private tournaments: Map<string, Tournament>;
    private DEBUG = true;

    constructor() {
        this.tournaments = new Map<string, Tournament>();
    }

    createTournament(name: string, numberOfPlayers: number, isPrivate: boolean, createdBy: number, io: SocketIOServer): Tournament {
        // generate unique ID for the tournament
        const id = `tournament_${crypto.randomUUID()}`;
        const tournament = new Tournament(id, name, numberOfPlayers, isPrivate, createdBy, io);
        this.tournaments.set(id, tournament);
        if (this.DEBUG) {
            console.log(`🏆 [TournamentSystem] Created tournament: ${name} (ID: ${id}) by ${createdBy}`);
        }
        // add player who created the tournament as the first player
        return tournament;
    }

    getTournament(id: string): Tournament | undefined {
        return this.tournaments.get(id);
    }

    getAllTournaments(): Tournament[] {
        return Array.from(this.tournaments.values());
    }

    getAllPublicTournaments(): Tournament[] {
        return Array.from(this.tournaments.values()).filter(t => !t.getIsPrivate());
    }

    deleteTournament(id: string): boolean {
        return this.tournaments.delete(id);
    }

    addPlayerToTournament(tournamentId: string, playerId: number, playerSocket: Socket): boolean {
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            return tournament.addPlayer(playerId, playerSocket);
        }
        return false;
    }

    canWeStartTournament(tournamentId: string): boolean {
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            return tournament.getNumberOfJoinedPlayers() === tournament.getNumberOfPlayers();
        }
        return false;
    }

    canWeStartFinal(tournamentId: string): boolean {
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            return tournament.getfinalPlayersIds().length === 2;
        }
        return false;
    }

    getFinalPlayersIds(tournamentId: string): number[] | null {
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            return tournament.getfinalPlayersIds();
        }
        return null;
    }

    getJoinedPlayersIds(tournamentId: string): number[] | null {
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            return tournament.getJoinedPlayersIds();
        }
        return null;
    }

    addPlayertofinal(tournamentId: string, playerId: number, playerSocket: Socket): void {
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            tournament.addPlayerToFinal(playerId, playerSocket);
        }
    }

    getWinnerId(tournamentId: string): number | null {
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            return tournament.getWinnerId();
        }
        return null;
    }

    setTournamentWinner(tournamentId: string, playerId: number): void {
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            tournament.setWinnerId(playerId);
        }
    }

    removeTournament(tournamentId: string): void {
        this.tournaments.delete(tournamentId);
    }

    isValidTournamentName(name: string): boolean {
        if (name === undefined || name === null || name === "") return false;
        // if already exist tournament with the same name
        for (const tournament of this.tournaments.values()) {
            if (tournament.getName() === name) {
                return false;
            }
        }
        return true;    
    }

}