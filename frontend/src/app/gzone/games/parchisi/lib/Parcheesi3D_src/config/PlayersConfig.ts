import { BOARD_HEIGHT, BOARD_TILE_SIZE } from "../consts"
import { PlayerColor } from "../types"
import { Position } from "../types"

type playerAvatar = {
    position: Position;
}

type CylinderAvatar = {
    [key in PlayerColor]: playerAvatar
}

export const PLAYERS_AVATAR_POSITIONS: CylinderAvatar = {
    [PlayerColor.RED]: {
        position: {
            x: -BOARD_TILE_SIZE / 2 - 5,
            y: BOARD_HEIGHT,
            z: +BOARD_TILE_SIZE / 2 + 5
        }
    },
    [PlayerColor.GREEN]: {
        position: {
            x: -BOARD_TILE_SIZE / 2 - 5,
            y: BOARD_HEIGHT,
            z: -BOARD_TILE_SIZE / 2 - 5
        }
    },
    [PlayerColor.YELLOW]: {
        position: {
            x: +BOARD_TILE_SIZE / 2 + 5,
            y: BOARD_HEIGHT,
            z: -BOARD_TILE_SIZE / 2 - 5
        }
    },
    [PlayerColor.BLUE]: {
        position: {
            x: +BOARD_TILE_SIZE / 2 + 5,
            y: BOARD_HEIGHT,
            z: +BOARD_TILE_SIZE / 2 + 5
        }
    }
}