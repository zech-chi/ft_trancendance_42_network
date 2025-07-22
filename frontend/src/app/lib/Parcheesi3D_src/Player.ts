import { Socket } from 'socket.io-client';

export class Player {
    private _id!: string; // Unique identifier for the player
    private _socket!: Socket; // The client-side socket instance (manages connection to the server).
    private _name!: string; // The player's name.
    private _isConnected!: boolean; // Indicates if the player is currently connected to the game.   
    private _isReady!: boolean; // Indicates if the player is ready to play.
    private _roomId!: string; // The ID of the room the player is currently in.
    private _color!: string; // The color assigned to the player in the game for parcheesi.

    constructor() {
        this._id = '';
        this._socket = {} as Socket; // Initialize with an empty socket instance
        this._name = '';
        this._isConnected = false;
        this._isReady = false;
        this._roomId = '';
        this._color = '';
    }



    // game management methods
    public connect(socket: Socket): void {}

    public disconnect() : void {}

    public reconnect(): void {}

    joinRoom(roomId: string): void {}

    sendMessageToServer(message: string): void {}

    // getters and setters for the properties
    public get id(): string {
        return this.id;
    }
    public set id(value: string) {
        this._id = value;
    }

    public get socket(): Socket {
        return this._socket;
    }
    public set socket(value: Socket) {
        this._socket = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get isConnected(): boolean {
        return this._isConnected;
    }
    public set isConnected(value: boolean) {
        this._isConnected = value;
    }

    public get isReady(): boolean {
        return this._isReady;
    }
    public set isReady(value: boolean) {
        this._isReady = value;
    }

    public get roomId(): string {
        return this._roomId;
    }
    public set roomId(value: string) {
        this._roomId = value;
    }

    public get color(): string {
        return this._color;
    }
    public set color(value: string) {
        this._color = value;
    }
}