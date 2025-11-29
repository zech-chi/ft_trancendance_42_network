import { Position } from "../types"
import { BOARD_HEIGHT, BOARD_TILE_SIZE } from "../consts"
import { PlayerColor } from "../types"

export const PLAYERS_BOARD_POSITIONS: { [key: string]: Position } = {
    // Red player board position
    [PlayerColor.RED]: {
        x: -BOARD_TILE_SIZE / 3,
        y: BOARD_HEIGHT,
        z: +BOARD_TILE_SIZE / 3
    },

    // Green player board position
    [PlayerColor.GREEN]: {
        x: -BOARD_TILE_SIZE / 3,
        y: BOARD_HEIGHT,
        z: -BOARD_TILE_SIZE / 3
    },

    // Yellow player board position
    [PlayerColor.YELLOW]: {
        x: +BOARD_TILE_SIZE / 3,
        y: BOARD_HEIGHT,
        z: -BOARD_TILE_SIZE / 3
    },

    // Blue player board position
    [PlayerColor.BLUE]: {
        x: +BOARD_TILE_SIZE / 3,
        y: BOARD_HEIGHT,
        z: +BOARD_TILE_SIZE / 3
    }
}
