import { Parcheesi3D } from "./parcheesi3d";
import * as BABYLON from "babylonjs";
import { BOARD_TILE_SIZE, PADDING, BOARD_HEIGHT } from "./consts";
import { COLORS_LOW_DARK, COLORS_MEDIUM_DARK, COLORS_VERY_DARK } from "./consts";
import { PlayerColor, Position } from "./types";
import { PLAYERS_BOARD_POSITIONS } from "./config/boardConfig";
import { CYLINDERS } from "./config/CylindersConfig";

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
        playerBoardMaterial.diffuseColor = BABYLON.Color3.FromHexString(COLORS_LOW_DARK[type]);
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
        playerBoardMaterial.diffuseColor = BABYLON.Color3.FromHexString(COLORS_MEDIUM_DARK[type]);
        playerBoard.material = playerBoardMaterial;
        playerBoard.position = new BABYLON.Vector3(position.x, position.y + 0.2, position.z);
    }

    private createCylinder(type: PlayerColor, position: Position, id: number) {
        const cylider = BABYLON.MeshBuilder.CreateCylinder(`${type}Cylinder_${id}`, {
            height: 1.5,
            diameter: 4
        });

        const cylinderMaterial = new BABYLON.StandardMaterial(`${type}CylinderMaterial_${id}`, this.scene);
        cylinderMaterial.diffuseColor = BABYLON.Color3.FromHexString(COLORS_VERY_DARK[type]);
        cylider.material = cylinderMaterial;
        cylider.position = new BABYLON.Vector3(position.x, position.y + 0.25, position.z);
    }


    public initialize() {
        // Create the main board
        this.createBoard();
        // Create the players boards
        Object.entries(PLAYERS_BOARD_POSITIONS).forEach(([type, position]) => {
            this.createPlayersBoardBig(type as PlayerColor, position);
            this.createPlayersBoardSmall(type as PlayerColor, position);
        });

        // Create the cylinders for each player
        for (const playerColor of Object.keys(CYLINDERS)) {
            const cylinders = CYLINDERS[playerColor as PlayerColor];
            for (const [id, position] of Object.entries(cylinders)) {
                this.createCylinder(playerColor as PlayerColor, position as Position, parseInt(id));
            }
        }

    }   
}