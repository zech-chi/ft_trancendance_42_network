import { Position } from "../types"
import { BOARD_TILE_SIZE, SPHERE_HIGHT } from "../consts"
import { PlayerColor } from "../types"

export type SphereType = {
    id: string,
    type: PlayerColor,
    color: string,
    position: Position,
    diameter: number,
}

// red
export const RED_SPHERES : SphereType[] = [
       {
           id: "1",
           type: PlayerColor.RED,
           color: "#ff0000",
           position: {
               x : -BOARD_TILE_SIZE / 3 + 3,
               y : SPHERE_HIGHT + 0.6, 
               z : +BOARD_TILE_SIZE / 3 + 3,
           },
           diameter: SPHERE_HIGHT,
       },
       {
           id: "2",
           type: PlayerColor.RED,
           color: "#ff0000",
           position: {
               x : -BOARD_TILE_SIZE / 3 - 3,
               y : SPHERE_HIGHT + 0.6, 
               z : +BOARD_TILE_SIZE / 3 + 3,
           },
           diameter: SPHERE_HIGHT,
       },
       {
           id: "3",
           type: PlayerColor.RED,
           color: "#ff0000",
           position: {
               x : -BOARD_TILE_SIZE / 3 + 3,
               y : SPHERE_HIGHT + 0.6, 
               z : +BOARD_TILE_SIZE / 3 - 3,
           },
           diameter: SPHERE_HIGHT,
       },
       {
           id: "4",
           type: PlayerColor.RED,
           color: "#ff0000",
           position: {
               x : -BOARD_TILE_SIZE / 3 - 3,
               y : SPHERE_HIGHT + 0.6, 
               z : +BOARD_TILE_SIZE / 3 - 3,
           },
           diameter: SPHERE_HIGHT,
       },
]



// green
export const GREEN_SPHERES : SphereType[] = [
    {
        id: "1",
        type: PlayerColor.GREEN,
        color: "#00ff00",
        position: {
            x : -BOARD_TILE_SIZE / 3 + 3,
            y : SPHERE_HIGHT + 0.6,
            z : -BOARD_TILE_SIZE / 3 + 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "2",
        type: PlayerColor.GREEN,
        color: "#00ff00",
        position: {
            x : -BOARD_TILE_SIZE / 3 - 3,
            y : SPHERE_HIGHT + 0.6,
            z : -BOARD_TILE_SIZE / 3 + 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "3",
        type: PlayerColor.GREEN,
        color: "#00ff00",
        position: {
            x : -BOARD_TILE_SIZE / 3 + 3,
            y : SPHERE_HIGHT + 0.6,
            z : -BOARD_TILE_SIZE / 3 - 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "4",
        type: PlayerColor.GREEN,
        color: "#00ff00",
        position: {
            x : -BOARD_TILE_SIZE / 3 - 3,
            y : SPHERE_HIGHT + 0.6,
            z : -BOARD_TILE_SIZE / 3 - 3,
        },
        diameter: SPHERE_HIGHT
    },
]


// blue
export const BLUE_SPHERES : SphereType[] = [
    {
        id: "1",
        type: PlayerColor.BLUE,
        color: "#0000ff",
        position: {
            x : +BOARD_TILE_SIZE / 3 + 3,
            y : SPHERE_HIGHT + 0.6,
            z : +BOARD_TILE_SIZE / 3 + 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "2",
        type: PlayerColor.BLUE,
        color: "#0000ff",
        position: {
            x : +BOARD_TILE_SIZE / 3 - 3,
            y : SPHERE_HIGHT + 0.6,
            z : +BOARD_TILE_SIZE / 3 + 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "3",
        type: PlayerColor.BLUE,
        color: "#0000ff",
        position: {
            x : +BOARD_TILE_SIZE / 3 + 3,
            y : SPHERE_HIGHT + 0.6,
            z : +BOARD_TILE_SIZE / 3 - 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "4",
        type: PlayerColor.BLUE,
        color: "#0000ff",
        position: {
            x : +BOARD_TILE_SIZE / 3 - 3,
            y : SPHERE_HIGHT + 0.6,
            z : +BOARD_TILE_SIZE / 3 - 3,
        },
        diameter: SPHERE_HIGHT
    }, 
]



// yellow
export const YELLOW_SPHERES : SphereType[] = [
    {
        id: "1",
        type: PlayerColor.YELLOW,
        color: "#ffff00",
        position: {
            x : +BOARD_TILE_SIZE / 3 + 3,
            y : SPHERE_HIGHT + 0.6, 
            z : -BOARD_TILE_SIZE / 3 + 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "2",
        type: PlayerColor.YELLOW,
        color: "#ffff00",
        position: {
            x : +BOARD_TILE_SIZE / 3 - 3,
            y : SPHERE_HIGHT + 0.6, 
            z : -BOARD_TILE_SIZE / 3 + 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "3",
        type: PlayerColor.YELLOW,
        color: "#ffff00",
        position: {
            x : +BOARD_TILE_SIZE / 3 + 3,
            y : SPHERE_HIGHT + 0.6, 
            z : -BOARD_TILE_SIZE / 3 - 3,
        },
        diameter: SPHERE_HIGHT
    },
    {
        id: "4",
        type: PlayerColor.YELLOW,
        color: "#ffff00",
        position: {
            x : +BOARD_TILE_SIZE / 3 - 3,
            y : SPHERE_HIGHT + 0.6, 
            z : -BOARD_TILE_SIZE / 3 - 3,
        },
        diameter: SPHERE_HIGHT
    },
]