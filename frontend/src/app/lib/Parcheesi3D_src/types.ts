export enum PlayerColor {
    RED = "RED",
    GREEN = "GREEN",
    YELLOW = "YELLOW",
    BLUE = "BLUE"
}

export type Position = {
    x: number;
    y: number;
    z: number;
};

export type Demension = {
    width: number;
    depth: number;
    height: number;
};

export type SphereDataType = {
    color: PlayerColor;
    userName: string;
}

export type DiceDataType = {
    color: PlayerColor;
    dice1: number;
    dice2: number;
}
