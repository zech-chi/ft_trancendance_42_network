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

export type JumpDataType = {
    sphere_id: number;
    sphere_type: PlayerColor;
    place?: number;
    where?: "center" | "left" | "right";
    speed?: number;
    maxHeight?: number;
    toStartPosition: boolean;
    final?: boolean;
    se7en?: boolean;
}

export type MoveDataType = {
    sphere_id: number;
    sphere_type: PlayerColor;
    place: number;
    where?: "center" | "left" | "right";
    speed?: number;
    se7en?: boolean;
    final?: boolean;
}

export type MoveAbleType = {
    sphere_id: number;
    sphere_type: PlayerColor;
    choice1: number;
    choice2?: number;
}

export type MoveRequestType = {
    sphere_id: number;
    sphere_type: PlayerColor;
    choice: number;
}