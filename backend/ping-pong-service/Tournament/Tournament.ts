// Tournament.ts
import { Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";

export class Tournament {
    private id : string; // tournament ID and room ID
    private name : string;
    private numberOfPlayers : number; // 4 | 8
    private joinedPlayersIds : number[] = [];
    private joinedPlayersSockets : Socket[] = [];
    private finalPlayersIds : number[] = [];
    private finalPlayersSockets : Socket[] = [];
    private isPrivate : boolean;
    private createdBy : number;
    private creatrionDate : Date = new Date();
    private state: 'pending' | 'ongoing' | 'completed' = 'pending';
    private io: SocketIOServer;

    constructor(id: string, name: string, numberOfPlayers: number, isPrivate: boolean, createdBy: number, io: SocketIOServer) {
        this.id = id;
        this.name = name;
        this.numberOfPlayers = numberOfPlayers;
        this.isPrivate = isPrivate;
        this.createdBy = createdBy;
        this.io = io;
    }

    // getters for all properties
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getNumberOfPlayers(): number {
        return this.numberOfPlayers;
    }

    getIsPrivate(): boolean {
        return this.isPrivate;
    }

    getCreatedBy(): number {
        return this.createdBy;
    }

    getCreationDate(): Date {
        return this.creatrionDate;
    }

    getfinalPlayersIds(): number[] {
        return this.finalPlayersIds;
    }

    // set state
    setState(newState: 'pending' | 'ongoing' | 'completed'): void {
        this.state = newState;
    }

    getNumberOfJoinedPlayers(): number {
        return this.joinedPlayersIds.length;
    }

    getJoinedPlayersIds(): number[] {
        return this.joinedPlayersIds;
    }

    addPlayer(playerId: number, playerSocket: Socket): boolean {
        if (this.joinedPlayersIds.length >= this.numberOfPlayers) {
            return false; // tournament is full
        }
        if (this.joinedPlayersIds.includes(playerId)) {
            return false; // player already joined
        }
        this.joinedPlayersIds.push(playerId);
        // join player to room using socket
        this.joinedPlayersSockets.push(playerSocket);
        this.io.to(playerSocket.id).socketsJoin(this.id);
        return true;
    }

    addPlayerToFinal(playerId: number, playerSocket: Socket): void {
        // check if player is in finals already
        if (this.finalPlayersIds.includes(playerId)) {
            return;
        }
        this.finalPlayersIds.push(playerId);
        this.finalPlayersSockets.push(playerSocket);
    }

    getFinalPlayersIds(): number[] {
        return this.finalPlayersIds;
    }
};