import { Parcheesi3D } from "./parcheesi3d";
import * as BABYLON from "babylonjs";
import { BOARD_TILE_SIZE, PADDING } from "./consts";

export class Board {
    private scene: BABYLON.Scene;

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }

    private createBoard() {
        const board = BABYLON.MeshBuilder.CreateBox("padding", 
        {
            width: BOARD_TILE_SIZE + PADDING,
            depth: BOARD_TILE_SIZE + PADDING,
            height: 0.1
        }, this.scene);

        
    }
}