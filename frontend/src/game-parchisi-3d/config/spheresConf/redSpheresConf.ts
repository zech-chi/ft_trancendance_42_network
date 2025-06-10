import { BOARD_TILE_SIZE, SPHERE_HEIGHT } from "../constants";
import { SphereConfig } from "../types";

export const redSpheresConf: SphereConfig[] = [
  {
    id: "1",
    name: "red_sphere_1",
    type: "red",
    color: "#ff0000",
    x: -BOARD_TILE_SIZE / 3 + 3,
    y: SPHERE_HEIGHT + 0.2,
    z: BOARD_TILE_SIZE / 3 + 3,
    diameter: SPHERE_HEIGHT,
  },
  {
    id: "2",
    name: "red_sphere_2",
    type: "red",
    color: "#ff0000",
    x: -BOARD_TILE_SIZE / 3 - 3,
    y: SPHERE_HEIGHT + 0.2,
    z: BOARD_TILE_SIZE / 3 + 3,
    diameter: SPHERE_HEIGHT,
  },
  {
    id: "3",
    name: "red_sphere_3",
    type: "red",
    color: "#ff0000",
    x: -BOARD_TILE_SIZE / 3 + 3,
    y: SPHERE_HEIGHT + 0.2,
    z: BOARD_TILE_SIZE / 3 - 3,
    diameter: SPHERE_HEIGHT,
  },
  {
    id: "4",
    name: "red_sphere_4",
    type: "red",
    color: "#ff0000",
    x: -BOARD_TILE_SIZE / 3 - 3,
    y: SPHERE_HEIGHT + 0.2,
    z: BOARD_TILE_SIZE / 3 - 3,
    diameter: SPHERE_HEIGHT,
  },
];
