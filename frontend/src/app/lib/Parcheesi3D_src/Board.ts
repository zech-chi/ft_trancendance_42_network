import { Parcheesi3D } from "./parcheesi3d";
import * as BABYLON from "babylonjs";
import { BOARD_TILE_SIZE, PADDING, BOARD_HEIGHT } from "./consts";
import { COLORS1, COLORS2 } from "./consts";
import { PlayerColor, Position } from "./types";
import { PLAYERS_BOARD_POSITIONS } from "./config/boardConfig";

export class Board {
    private scene: BABYLON.Scene;

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }

    private createBoard() {
        const padding = BABYLON.MeshBuilder.CreateBox("board", 
            {
                width: BOARD_TILE_SIZE + PADDING,
                depth: BOARD_TILE_SIZE + PADDING,
                height: 0.1
            }, this.scene
        );

        const boardMaterial = new BABYLON.StandardMaterial("boardMaterial", this.scene);
        boardMaterial.diffuseColor = BABYLON.Color3.FromHexString("#000000");
        padding.material = boardMaterial;
        padding.position = new BABYLON.Vector3(0, -0.2, 0);
        const parchisiBoard = BABYLON.MeshBuilder.CreateBox("parchisiBoard", {
            width: BOARD_TILE_SIZE,      // official length in meters
            depth: BOARD_TILE_SIZE,     // official width
            height: BOARD_HEIGHT      // thin surface
        }, this.scene);
        const parchisiBoardMaterial = new BABYLON.StandardMaterial("parchisiBoardMaterial", this.scene);
        parchisiBoardMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.3, 0.1);
        parchisiBoard.material = parchisiBoardMaterial;
    }

    private createPlayersBoardBig(type: PlayerColor, position: Position) {
        const playerBoard = BABYLON.MeshBuilder.CreateBox(`${type}Board_big`,
            {
                width: BOARD_TILE_SIZE / 3,
                depth: BOARD_TILE_SIZE / 3,
                height: BOARD_HEIGHT
            }, this.scene
        );

        const playerBoardMaterial = new BABYLON.StandardMaterial(`${type}BoardMaterial_big`, this.scene);
        playerBoardMaterial.diffuseColor = BABYLON.Color3.FromHexString(COLORS1[type]);
        playerBoard.material = playerBoardMaterial;
        playerBoard.position = new BABYLON.Vector3(position.x, position.y, position.z);
    }

    private createPlayersBoardSmall(type: PlayerColor, position: Position) {
        const playerBoard = BABYLON.MeshBuilder.CreateBox(`${type}Board_small`,
            {
                width: BOARD_TILE_SIZE / 3 - PADDING * 20,
                depth: BOARD_TILE_SIZE / 3 - PADDING * 20,
                height: BOARD_HEIGHT
            }, this.scene
        );

        const playerBoardMaterial = new BABYLON.StandardMaterial(`${type}BoardMaterial_small`, this.scene);
        playerBoardMaterial.diffuseColor = BABYLON.Color3.FromHexString(COLORS2[type]);
        playerBoard.material = playerBoardMaterial;
        playerBoard.position = new BABYLON.Vector3(position.x, position.y + 0.2, position.z);
    }

    public initialize() {
        // Create the main board
        this.createBoard();
        // Create the players boards
        Object.entries(PLAYERS_BOARD_POSITIONS).forEach(([type, position]) => {
            this.createPlayersBoardBig(type as PlayerColor, position);
            this.createPlayersBoardSmall(type as PlayerColor, position);
        });
    }   
}