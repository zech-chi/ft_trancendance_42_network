import {COLORS_LOW_DARK} from "../consts";
import { Position } from "../types";
import { Demension } from "../types";
import { BOARD_HEIGHT, BOARD_TILE_SIZE, PADDING } from "../consts";

export type PathType = {
    id: string;
    color: string;
    position: Position;
    dimension: Demension
    drawText: boolean;
    diff_x?: number;
    diff_y?: number;
    diff_z?: number;
}

export const PATH_OF_PLAYERS : PathType[] = [
    // 12 |  (*)13(*) | 14
    {
        id: "12",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 0,
            y: BOARD_HEIGHT + 0.1,
            z: +7
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "13 {*}",
        color: "#808080",
        position: {
            x: -30 + 3 * 0,
            y: BOARD_HEIGHT + 0.1,
            z: 0
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT
        },
        drawText: false
    },
    {
        id: "14",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 0,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension : {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 11 | (1)green(1) | 15
    {
        id: "11",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 1,
            y: BOARD_HEIGHT + 0.1,
            z: +7
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "green1",
        color: "#7ac943",
        position: {
            x: -30 + 3 * 1,
            y: BOARD_HEIGHT + 0.1,
            z: 0
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },

    {
        id: "15",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 1,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 10 | (2)green(2) | 16
    {
        id: "10",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 2,
            y: BOARD_HEIGHT + 0.1,
            z: +7
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "green2",
        color: "#7ac943",
        position: {
            x: -30 + 3 * 2,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "16",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 2,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 9 | (3)green(3) | 17
    {
        id: "9",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 3,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "green3",
        color: "#7ac943",
        position: {
            x: -30 + 3 * 3,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "17",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 3,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // (*)8(*) | (4)green(4) | (green)18(green)
    {
        id: "8 {*}",
        color: "#808080",
        position: {
            x: -30 + 3 * 4,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "green4",
        color: "#7ac943",
        position: {
            x: -30 + 3 * 4,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "18 {green}",
        color: "#7ac943",
        position: {
            x: -30 + 3 * 4,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 7 | (5)green(5) | 19
    {
        id: "7",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 5,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "green5",
        color: "#7ac943",
        position: {
            x: -30 + 3 * 5,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "19",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 5,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 6 | (6)green(6) | 20
    {
        id: "6",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 6,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "green6",
        color: "#7ac943",
        position: {
            x: -30 + 3 * 6,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "20",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 6,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },
  
    // 5 | (7)green(7) | 21    
    {
        id: "5",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 7,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "green7",
        color: "#7ac943",
        position: {
            x: -30 + 3 * 7,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "21",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 7,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 55 | (7)blue(7) | 39
    {
        id: "55",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 13,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "blue7",
        color: "#3fa9f5",
        position: {
            x: -30 + 3 * 13,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "39",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 13,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 54 | (6)blue(6) | 40
    {
        id: "54",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 14,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "blue6",
        color: "#3fa9f5",
        position: {
            x: -30 + 3 * 14,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "40",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 14,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 53 | (5)blue(5) | 41
    {
        id: "53",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 15,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "blue5",
        color: "#3fa9f5",
        position: {
            x: -30 + 3 * 15,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "41",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 15,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // (blue)52(blue) | (4)blue(4) | (*)42(*)
    {
        id: "52 {blue}",
        color: "#3fa9f5",
        position: {
            x: -30 + 3 * 16,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "blue4",
        color: "#3fa9f5",
        position: {
            x: -30 + 3 * 16,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "42 {*}",
        color: "#808080",
        position: {
            x: -30 + 3 * 16,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },

    // 51 | (3)blue(3) | 43
    {
        id: "51",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 17,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "blue3",
        color: "#3fa9f5",
        position: {
            x: -30 + 3 * 17,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "43",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 17,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 50 | (2)blue(2) | 44
    {
        id: "50",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 18,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "blue2",
        color: "#3fa9f5",
        position: {
            x: -30 + 3 * 18,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "44",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 18,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 49 | (1)blue(1) | 45
    {
        id: "49",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 19,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "blue1",
        color: "#3fa9f5",
        position: {
            x: -30 + 3 * 19,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "45",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 19,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 48 | (*)47(*) | 46
    {
        id: "48",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 20,
            y: BOARD_HEIGHT + 0.1,
            z: +7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: -2.7
    },
    {
        id: "47 {*}",
        color: "#808080",
        position: {
            x: -30 + 3 * 20,
            y: BOARD_HEIGHT + 0.1,
            z: 0,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "46",
        color: "#ffffff",
        position: {
            x: -30 + 3 * 20,
            y: BOARD_HEIGHT + 0.1,
            z: -7,
        },
        dimension: {
            width: 3,
            depth: 7,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 0.7,
        diff_y: 0.1,
        diff_z: +2.7
    },

    // 29 | (*)30(*) | 31
    {
        id: "29",
        color: "#ffffff",
        position: {
            x: -7,
            y: BOARD_HEIGHT + 0.1,
            z: -30 + 3 * 0,
        },
        dimension: {
            width: 7,
            depth: 3,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: 2.7,
        diff_y: 0.1,
        diff_z: +0.7
    },
    {
        id: "30 {*}",
        color: "#808080",
        position: {
            x: 0,
            y: BOARD_HEIGHT + 0.1,
            z: -30 + 3 * 0,
        },
        dimension: {
            width: 7,
            depth: 3,
            height: BOARD_HEIGHT,
        },
        drawText: false
    },
    {
        id: "31",
        color: "#ffffff",
        position: {
            x: +7,
            y: BOARD_HEIGHT + 0.1,
            z: -30 + 3 * 0,
        },
        dimension: {
            width: 7,
            depth: 3,
            height: BOARD_HEIGHT,
        },
        drawText: true,
        diff_x: -2.7,
        diff_y: 0.1,
        diff_z: +0.7
    },
]