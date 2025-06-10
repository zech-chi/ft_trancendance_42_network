import { BOARD_TILE_SIZE, SPHERE_HEIGHT } from "../constants";
import { SphereConfig } from "../types";

export const yellowSpheresConf: SphereConfig[] = [
  {
    id: "1",
    name: "yellow_sphere_1",
    type: "yellow",
    color: "#ffff00",
    x: BOARD_TILE_SIZE / 3 + 3,
    y: SPHERE_HEIGHT + 0.2,
    z: -BOARD_TILE_SIZE / 3 + 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "2",
    name: "yellow_sphere_2",
    type: "yellow",
    color: "#ffff00",
    x: BOARD_TILE_SIZE / 3 - 3,
    y: SPHERE_HEIGHT + 0.2,
    z: -BOARD_TILE_SIZE / 3 + 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "3",
    name: "yellow_sphere_3",
    type: "yellow",
    color: "#ffff00",
    x: BOARD_TILE_SIZE / 3 + 3,
    y: SPHERE_HEIGHT + 0.2,
    z: -BOARD_TILE_SIZE / 3 - 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "4",
    name: "yellow_sphere_4",
    type: "yellow",
    color: "#ffff00",
    x: BOARD_TILE_SIZE / 3 - 3,
    y: SPHERE_HEIGHT + 0.2,
    z: -BOARD_TILE_SIZE / 3 - 3,
    diameter: SPHERE_HEIGHT
  }
];
