import { BOARD_TILE_SIZE, SPHERE_HEIGHT } from "../constants";
import { SphereConfig } from "../types";

export const greenSpheresConf: SphereConfig[] = [
  {
    id: "1",
    name: "green_sphere_1",
    type: "green",
    color: "#00ff00",
    x: -BOARD_TILE_SIZE / 3 + 3,
    y: SPHERE_HEIGHT + 0.2,
    z: -BOARD_TILE_SIZE / 3 + 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "2",
    name: "green_sphere_2",
    type: "green",
    color: "#00ff00",
    x: -BOARD_TILE_SIZE / 3 - 3,
    y: SPHERE_HEIGHT + 0.2,
    z: -BOARD_TILE_SIZE / 3 + 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "3",
    name: "green_sphere_3",
    type: "green",
    color: "#00ff00",
    x: -BOARD_TILE_SIZE / 3 + 3,
    y: SPHERE_HEIGHT + 0.2,
    z: -BOARD_TILE_SIZE / 3 - 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "4",
    name: "green_sphere_4",
    type: "green",
    color: "#00ff00",
    x: -BOARD_TILE_SIZE / 3 - 3,
    y: SPHERE_HEIGHT + 0.2,
    z: -BOARD_TILE_SIZE / 3 - 3,
    diameter: SPHERE_HEIGHT
  }
];
