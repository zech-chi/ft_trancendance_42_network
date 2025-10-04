import { Position } from "../types"
import { BOARD_HEIGHT, BOARD_TILE_SIZE, PADDING } from "../consts"
import { PlayerColor } from "../types"

type PlayerCylinders = {
    1: Position,
    2: Position,
    3: Position,
    4: Position,
}

type Cylinder = {
    [key in PlayerColor]: PlayerCylinders
}

export const CYLINDERS : Cylinder = {
    // red cylinders
    [PlayerColor.RED]: {
        1: {
            x : -BOARD_TILE_SIZE / 3 + 3,
            y : BOARD_HEIGHT, 
            z : +BOARD_TILE_SIZE / 3 + 3,
        },
        2: {
            x : -BOARD_TILE_SIZE / 3 - 3,
            y : BOARD_HEIGHT, 
            z : +BOARD_TILE_SIZE / 3 + 3,
        },
        3: {
            x : -BOARD_TILE_SIZE / 3 + 3,
            y : BOARD_HEIGHT, 
            z : +BOARD_TILE_SIZE / 3 - 3,
        },
        4: {
            x : -BOARD_TILE_SIZE / 3 - 3,
            y : BOARD_HEIGHT, 
            z : +BOARD_TILE_SIZE / 3 - 3,
        }
    },

    // green cylinders
    [PlayerColor.GREEN]: {
        1: {
            x : -BOARD_TILE_SIZE / 3 + 3,
            y : BOARD_HEIGHT, 
            z : -BOARD_TILE_SIZE / 3 + 3,
        },
        2: {
            x : -BOARD_TILE_SIZE / 3 - 3,
            y : BOARD_HEIGHT, 
            z : -BOARD_TILE_SIZE / 3 + 3,
        },
        3: {
            x : -BOARD_TILE_SIZE / 3 + 3,
            y : BOARD_HEIGHT, 
            z : -BOARD_TILE_SIZE / 3 - 3,
        },
        4: {
            x : -BOARD_TILE_SIZE / 3 - 3,
            y : BOARD_HEIGHT, 
            z : -BOARD_TILE_SIZE / 3 - 3,
        }
    },

    // yellow cylinders
    [PlayerColor.YELLOW]: {
        1: {
            x : +BOARD_TILE_SIZE / 3 + 3,
            y : BOARD_HEIGHT, 
            z : -BOARD_TILE_SIZE / 3 + 3,
        },
        2: {
            x : +BOARD_TILE_SIZE / 3 - 3,
            y : BOARD_HEIGHT, 
            z : -BOARD_TILE_SIZE / 3 + 3,
        },
        3: {
            x : +BOARD_TILE_SIZE / 3 + 3,
            y : BOARD_HEIGHT, 
            z : -BOARD_TILE_SIZE / 3 - 3,
        },
        4: {
            x : +BOARD_TILE_SIZE / 3 - 3,
            y : BOARD_HEIGHT, 
            z : -BOARD_TILE_SIZE / 3 - 3,
        }
    },

    // blue cylinders
    [PlayerColor.BLUE]: {
        1: {
            x : +BOARD_TILE_SIZE / 3 + 3,
            y : BOARD_HEIGHT, 
            z : +BOARD_TILE_SIZE / 3 + 3,
        },
        2: {
            x : +BOARD_TILE_SIZE / 3 - 3,
            y : BOARD_HEIGHT, 
            z : +BOARD_TILE_SIZE / 3 + 3,
        },
        3: {
            x : +BOARD_TILE_SIZE / 3 + 3,
            y : BOARD_HEIGHT, 
            z : +BOARD_TILE_SIZE / 3 - 3,
        },
        4: {
            x : +BOARD_TILE_SIZE / 3 - 3,
            y : BOARD_HEIGHT, 
            z : +BOARD_TILE_SIZE / 3 - 3,
        }
    },
}
