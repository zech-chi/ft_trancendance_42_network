import { BOARD_TILE_SIZE, SPHERE_HEIGHT } from "../constants";
import { SphereConfig } from "../types";

export const blueSpheresConf: SphereConfig[] = [
  {
    id: "1",
    name: "blue_sphere_1",
    type: "blue",
    color: "#0000ff",
    x: BOARD_TILE_SIZE / 3 + 3,
    y: SPHERE_HEIGHT + 0.2,
    z: BOARD_TILE_SIZE / 3 + 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "2",
    name: "blue_sphere_2",
    type: "blue",
    color: "#0000ff",
    x: BOARD_TILE_SIZE / 3 - 3,
    y: SPHERE_HEIGHT + 0.2,
    z: BOARD_TILE_SIZE / 3 + 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "3",
    name: "blue_sphere_3",
    type: "blue",
    color: "#0000ff",
    x: BOARD_TILE_SIZE / 3 + 3,
    y: SPHERE_HEIGHT + 0.2,
    z: BOARD_TILE_SIZE / 3 - 3,
    diameter: SPHERE_HEIGHT
  },
  {
    id: "4",
    name: "blue_sphere_4",
    type: "blue",
    color: "#0000ff",
    x: BOARD_TILE_SIZE / 3 - 3,
    y: SPHERE_HEIGHT + 0.2,
    z: BOARD_TILE_SIZE / 3 - 3,
    diameter: SPHERE_HEIGHT
  }
];
