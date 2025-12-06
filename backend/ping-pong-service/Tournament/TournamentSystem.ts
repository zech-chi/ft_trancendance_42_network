// tournamentSystem.ts 
import { Tournament } from "./Tournament";
import { Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";

export class TournamentSystem {
    // key: tournament ID, value: Tournament instance
    private tournaments: Map<string, Tournament>;
    // users that already joined tournaments
    private ocupiedUsers: Set<number> = new Set<number>();
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
            //console.log(`🏆 [TournamentSystem] Created tournament: ${name} (ID: ${id}) by ${createdBy}`);
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
        // all public tournaments that has less than 4 joined players
        return Array.from(this.tournaments.values()).filter(t => !t.getIsPrivate() && t.getNumberOfJoinedPlayers() < 4);
    }

    deleteTournament(id: string): boolean {
        return this.tournaments.delete(id);
    }

    addPlayerToTournament(tournamentId: string, playerId: number, playerSocket: Socket): {status : boolean, message: string} {
        // check if player is already in a tournament
        if (this.ocupiedUsers.has(playerId)) {
            if (this.DEBUG) {
                //console.log(`⚠️ [TournamentSystem] Player ${playerId} is already in a tournament and cannot join another.`);
            }
            return {status: false, message: "you already in a tournament"};
        }
        const tournament = this.tournaments.get(tournamentId);
        if (tournament) {
            const status : boolean = tournament.addPlayer(playerId, playerSocket);
            if (status) {
                this.ocupiedUsers.add(playerId);
                if (this.DEBUG) {
                    //console.log(`👥 [TournamentSystem] Player ${playerId} joined tournament: ${tournament.getName()} (ID: ${tournamentId})`);
                }
                return {status: status, message: "Player joined the tournament successfully"};
            }
        }
        return {status: false, message: "the tournament is full or does not exist"};
    }

    canPlayerJoinTournament(playerId: number): boolean {
        return !this.ocupiedUsers.has(playerId);
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
        // remove data of all players who joined this tournament from ocupiedUsers
        for (const playerId of this.ocupiedUsers) {
            const tournament = this.tournaments.get(tournamentId);
            if (tournament && tournament.getJoinedPlayersIds().includes(playerId)) {
                this.ocupiedUsers.delete(playerId);
            }
        }
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

    // clean all tournament with state completed
    cleanCompletedTournaments(): void {
        for (const [id, tournament] of this.tournaments.entries()) {
            if (tournament.getState() === 'completed') {
                this.tournaments.delete(id);
                if (this.DEBUG) {
                    //console.log(`🧹 [TournamentSystem] Removed completed tournament: ${tournament.getName()} (ID: ${id})`);
                }
            }
            // delete players from ocupiedUsers
            for (const playerId of tournament.getJoinedPlayersIds()) {
                this.ocupiedUsers.delete(playerId);
            }
        }
    }

    handlePlayerDisconnect(playerSocket: Socket) : string {
        for (const [tournamentId, tournament] of this.tournaments.entries()) {
            if (!tournament.istournamentFull() && tournament.isThisSocketExist(playerSocket)) {
                // remove tournament
                tournament.setState('completed');
                if (this.DEBUG) {
                    //console.log(`❌ [TournamentSystem] Removed tournament: ${tournament.getName()} (ID: ${tournamentId}) due to player disconnect`);
                }
                return tournamentId;
            }
        }
        return "";
    }

    removeOccupiedPlayerBySocket(playerSocket: Socket): void {
        for (const [tournamentId, tournament] of this.tournaments.entries()) {
            const playerId : number | null = tournament.getIdOfPlayerFromSocket(playerSocket);
            if (playerId !== null && this.ocupiedUsers.has(playerId)) {
                // tournament.addPlayertoDeconnected(playerId);
                // if (tournament.isAllPlayersDeconnected()) {
                //     tournament.setState('completed');
                //     if (this.DEBUG) {
                //         //console.log(`❌ [TournamentSystem] All players disconnected. Marked tournament: ${tournament.getName()} (ID: ${tournamentId}) as completed`);
                //     }
                // }
                this.ocupiedUsers.delete(playerId);
                if (this.DEBUG) {
                    //console.log(`🗑️ [TournamentSystem] Removed occupied player: ${playerId} from tournament: ${tournament.getName()} (ID: ${tournamentId})`);
                }
            }
        }
        // this.cleanCompletedTournaments();
    }

}