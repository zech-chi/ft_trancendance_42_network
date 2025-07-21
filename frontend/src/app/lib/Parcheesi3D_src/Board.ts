import { Parcheesi3D } from "./parcheesi3d";
import * as BABYLON from "babylonjs";
import { BOARD_TILE_SIZE, PADDING, BOARD_HEIGHT } from "./consts";

export class Board {
    private scene: BABYLON.Scene;

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }

    private createBoard() {
        const board = BABYLON.MeshBuilder.CreateBox("board", 
            {
                width: BOARD_TILE_SIZE + PADDING,
                depth: BOARD_TILE_SIZE + PADDING,
                height: 0.1
            }, this.scene
        );

        const boardMaterial = new BABYLON.StandardMaterial("boardMaterial", this.scene);
        boardMaterial.diffuseColor = BABYLON.Color3.FromHexString("#000000");
        board.material = boardMaterial;
        board.position = new BABYLON.Vector3(0, -0.2, 0);
        const parchisiBoard = BABYLON.MeshBuilder.CreateBox("parchisiBoard", {
            width: BOARD_TILE_SIZE,      // official length in meters
            depth: BOARD_TILE_SIZE,     // official width
            height: BOARD_HEIGHT      // thin surface
        }, this.scene);
        const parchisiBoardMaterial = new BABYLON.StandardMaterial("parchisiBoardMaterial", this.scene);
        parchisiBoardMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.3, 0.1);
        parchisiBoard.material = parchisiBoardMaterial;
    }

    public initialize() {
        this.createBoard();
    }
}