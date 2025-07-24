import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { BOARD_TILE_SIZE, PADDING, BOARD_HEIGHT } from "./consts";
import { COLORS_LOW_DARK, COLORS_MEDIUM_DARK, COLORS_VERY_DARK } from "./consts";
import { PlayerColor, Position, SphereDataType, DiceDataType } from "./types";
import { PLAYERS_BOARD_POSITIONS } from "./config/boardConfig";
import { CYLINDERS } from "./config/CylindersConfig";
import { PathType } from "./config/pathConfig";
import { PATH_OF_PLAYERS } from "./config/pathConfig";
import { TheEndPlace } from "./config/TheEndPlacesConfig";
import { THE_END_PLACES } from "./config/TheEndPlacesConfig";
import { SphereType, RED_SPHERES, GREEN_SPHERES, BLUE_SPHERES, YELLOW_SPHERES } from "./config/spheresConfig";
import { PLAYERS_AVATAR_POSITIONS } from "./config/PlayersConfig";
import { fetchUser } from "@/app/lib/apiDashboard";
import { th } from "framer-motion/client";

interface User {
    fullName: string;
    userName: string;
    bio: string;
    imageUrl: string;
    rank: number;
    level: number;
    progress: number;
    online: boolean;
  }

export class Board {
    private scene: BABYLON.Scene;
    private redLabel?: GUI.TextBlock;
    private greenLabel?: GUI.TextBlock;
    private blueLabel?: GUI.TextBlock;
    private yellowLabel?: GUI.TextBlock;
    private gui: GUI.AdvancedDynamicTexture;
    

    constructor(scene: BABYLON.Scene, gui: GUI.AdvancedDynamicTexture) {
        this.scene = scene;
        this.gui = gui;
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

    private createDestination() {
        const padding = BABYLON.MeshBuilder.CreateBox("padding", 
            {
                width: 15 + PADDING,
                depth: 15 + PADDING,
                height: 0.1
            }, this.scene
        );
        const paddingMaterial = new BABYLON.StandardMaterial("paddingMaterial", this.scene);
        paddingMaterial.diffuseColor = BABYLON.Color3.FromHexString("#000000");
        padding.material = paddingMaterial;
        padding.position = new BABYLON.Vector3(0, BOARD_HEIGHT - 0.02, 0);
        const goldBoard = BABYLON.MeshBuilder.CreateBox("goldBoard", 
            {
                width: 15 - PADDING,
                depth: 15 - PADDING,
                height: 0.1
            }, this.scene
        );
        // goldBoard is the destination for each player
        const goldBoardMaterial = new BABYLON.StandardMaterial("goldBoardMaterial", this.scene);
        goldBoardMaterial.diffuseColor = BABYLON.Color3.FromHexString("#000000");
        goldBoard.material = goldBoardMaterial;
        goldBoard.position = new BABYLON.Vector3(0, BOARD_HEIGHT, 0);
    }

    private createPath(pathObj : PathType) {
        // create black padding like html you know!
        const padding = BABYLON.MeshBuilder.CreateBox("padding", 
            {
                width: pathObj.dimension.width + PADDING,
                depth: pathObj.dimension.depth + PADDING,
                height: 0.1
            }, this.scene
        );

        const paddingMaterial = new BABYLON.StandardMaterial("paddingMaterial", this.scene);
        paddingMaterial.diffuseColor = BABYLON.Color3.FromHexString("#000000");
        padding.material = paddingMaterial;
        padding.position = new BABYLON.Vector3(
            pathObj.position.x,
            pathObj.position.y - 0.02 - 0.25,
            pathObj.position.z
        );

        // create the path
        const path = BABYLON.MeshBuilder.CreateBox(pathObj.id, {
            width: pathObj.dimension.width - PADDING,
            depth: pathObj.dimension.depth - PADDING,
            height: 0.1
        }, this.scene);

        const pathMaterial = new BABYLON.StandardMaterial(pathObj.id + "Material", this.scene);
        pathMaterial.diffuseColor = BABYLON.Color3.FromHexString(pathObj.color);
        path.material = pathMaterial;
        path.position = new BABYLON.Vector3(pathObj.position.x, pathObj.position.y - 0.25, pathObj.position.z);
    }

    private createPathText(pathObj: PathType) {
        // create text:
        // Create a plane to hold the text
        const plane = BABYLON.MeshBuilder.CreatePlane("textPlane", { width: 3, height: 1 }, this.scene);

        // Create dynamic texture
        const dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width:512, height:256 }, this.scene, false);
        dynamicTexture.hasAlpha = true;


        let name = pathObj.id;
        if (!pathObj.drawText) name = "";
        // Draw text
        dynamicTexture.drawText(name, null, 150, "bold 150px Arial", "gray", "transparent");

        // Create material
        const mat = new BABYLON.StandardMaterial("textMat", this.scene);
        mat.diffuseTexture = dynamicTexture;
        mat.backFaceCulling = false;

        plane.material = mat;

        // Rotate to make it parallel to Y-axis
        plane.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, 0);
        if (
            pathObj.diff_x !== undefined &&
            pathObj.diff_y !== undefined &&
            pathObj.diff_z !== undefined
        )
            plane.position = new BABYLON.Vector3(pathObj.position.x + pathObj.diff_x, pathObj.position.y + pathObj.diff_y - 0.24, pathObj.position.z + pathObj.diff_z);
        else
            plane.position = new BABYLON.Vector3(pathObj.position.x, pathObj.position.y + 0.1, pathObj.position.z);
    }

    private createTriangle(triangleObj: TheEndPlace) {
        // 1. Create the 3 points of the triangle
        const p1 = new BABYLON.Vector3(triangleObj.x1, triangleObj.y1, triangleObj.z1);
        const p2 = new BABYLON.Vector3(triangleObj.x2, triangleObj.y2, triangleObj.z2);
        const p3 = new BABYLON.Vector3(triangleObj.x3, triangleObj.y3, triangleObj.z3);
        
        // 2. Create custom mesh
        const triangle = new BABYLON.Mesh("triangle", this.scene);

        // 3. Define vertex data
        const vertexData = new BABYLON.VertexData();

        // Positions (3 points → 9 numbers)
        vertexData.positions = [
            p1.x, p1.y, p1.z,
            p2.x, p2.y, p2.z,
            p3.x, p3.y, p3.z,
        ];

        // Indices (just one face with 3 vertices)
        vertexData.indices = [triangleObj.i0, triangleObj.i1, triangleObj.i2];

        // Normals (needed for lighting/shading)
        vertexData.normals = [];
        BABYLON.VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);

        // 4. Apply vertex data to mesh
        vertexData.applyToMesh(triangle);
        const mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString(triangleObj.color);
        triangle.material = mat;
        mat.backFaceCulling = false;
    }

    private createSphere(sphere: SphereType) {
        const sphereMesh = BABYLON.MeshBuilder.CreateSphere("sphere" + sphere.type + String(sphere.id), {
            diameter: sphere.diameter,
            segments: 32,
          },  this.scene);
        const sphereMaterial = new BABYLON.StandardMaterial("sphere", this.scene);
        sphereMaterial.bumpTexture = new BABYLON.Texture("Parcheesi3D_Media/texture.png", this.scene);
        // sphereMaterial.diffuseTexture = new BABYLON.Texture("Parcheesi3D_Media/background.png", this.scene);
        sphereMaterial.diffuseColor =  BABYLON.Color3.FromHexString(sphere.color);
        sphereMesh.material = sphereMaterial;
        sphereMesh.position = new BABYLON.Vector3(sphere.position.x, sphere.position.y, sphere.position.z);
    }


    public createSpheres(type: PlayerColor) {
        switch (type) {
            case PlayerColor.RED:
                RED_SPHERES.forEach(sphere => {
                    this.createSphere(sphere);
                });
                break;
            case PlayerColor.GREEN:
                GREEN_SPHERES.forEach(sphere => {
                    this.createSphere(sphere);
                });
                break;
            case PlayerColor.YELLOW:
                YELLOW_SPHERES.forEach(sphere => {
                    this.createSphere(sphere);
                });
                break;
            case PlayerColor.BLUE:
                BLUE_SPHERES.forEach(sphere => {
                    this.createSphere(sphere);
                });
                break;
        }
    }

    private createButton(type: PlayerColor) {
        // Create a button
        const button = GUI.Button.CreateSimpleButton(`${type}Button`, `Roll Dice`);
        button.width = "150px";
        button.height = "40px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = COLORS_LOW_DARK[type];
        button.zIndex = 10;

        // Set the position of the button
        if (type === PlayerColor.RED) {
            button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        } else if (type === PlayerColor.GREEN) {
            button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        } else if (type === PlayerColor.YELLOW) {
            button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        } else if (type === PlayerColor.BLUE) {
            button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        }
            
        // Proper hover effects
        button.onPointerEnterObservable.add(() => {
            button.background = COLORS_MEDIUM_DARK[type];
            this.scene.render();
        });
        
        button.onPointerOutObservable.add(() => {
            button.background = COLORS_LOW_DARK[type];
            this.scene.render();
        });
        
        button.onPointerDownObservable.add(() => {
            console.log(`${type} button clicked`);
        });

        this.gui.addControl(button);
    }
    
    private createLabel(type: PlayerColor) {
        // Create the TextBlock control
        const label = new GUI.TextBlock(`${type}Label`, `dice1: 0, dice2: 0`);
        label.color = COLORS_LOW_DARK[type];
        label.fontSize = 24;
        label.fontFamily = "Arial";
        label.fontWeight = "bold";
    
        label.paddingLeft = "10px";
        label.paddingRight = "10px";
        label.paddingTop = "10px";
        label.paddingBottom = "10px";

        this.createButton(type);

        switch (type) {
            case PlayerColor.RED:
                label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                label.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                label.top = "-40px"; // position above the button
                this.redLabel = label;
                break;
    
            case PlayerColor.GREEN:
                label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                label.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                label.top = "-40px"; // position above the button
                this.greenLabel = label;
                break;
    
            case PlayerColor.YELLOW:
                label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                label.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                label.top = "40px"; // position under the button
                this.yellowLabel = label;
                break;
                
                case PlayerColor.BLUE:
                    label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    label.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    label.top = "40px"; // position under the button
                    this.blueLabel = label;
                break;
        }
        this.gui.addControl(label);
        this.scene.render();
    } 

    public updateLabel(data: DiceDataType) {
        const labelText = `dice1: ${data.dice1}, dice2: ${data.dice2}`;
        switch (data.color) {
            case PlayerColor.RED:
                if (this.redLabel) {
                    this.redLabel.text = labelText;          
                }
                break;
            case PlayerColor.GREEN:
                if (this.greenLabel) {
                    this.greenLabel.text = labelText;
                    }
                    break;
                case PlayerColor.YELLOW:
                    if (this.yellowLabel) {
                        this.yellowLabel.text = labelText;
                    }
                    break;
                case PlayerColor.BLUE:
                    if (this.blueLabel) {
                        this.blueLabel.text = labelText;
                    }
                    break;
        }

        this.scene.render();
    }

    public async addPlayerAvatar(obj: SphereDataType) {
        // fetch the avatar image from the server
        // and create a cylinder with the avatar image as texture
        const user : User =  await fetchUser(obj.userName);
        
        var cylinder = BABYLON.MeshBuilder.CreateCylinder(`${obj.color}Cylinder_${obj.userName}`, {
            height: 0.5,
            diameter: 10
        }, this.scene);
    
        const cylinderMaterial = new BABYLON.StandardMaterial(`${obj.color}CylinderMaterial_${obj.userName}`, this.scene);
        cylinderMaterial.diffuseTexture = new BABYLON.Texture(user.imageUrl, this.scene);;
        cylinder.material = cylinderMaterial;
        cylinder.position = new BABYLON.Vector3(-BOARD_TILE_SIZE / 2 - 5 , BOARD_HEIGHT, +BOARD_TILE_SIZE / 2 + 5);
        cylinder.position = new BABYLON.Vector3(
            PLAYERS_AVATAR_POSITIONS[obj.color].position.x,
            PLAYERS_AVATAR_POSITIONS[obj.color].position.y,
            PLAYERS_AVATAR_POSITIONS[obj.color].position.z
        );
        cylinder.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;

        // for debugging add a label with the user name
        // this contain the dice values
        this.createLabel(obj.color);
    }

    public initialize() {
        // Create the main board
        this.createBoard();
        // Create the destination area 
        this.createDestination();
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

        // Create paths
        for (const path of PATH_OF_PLAYERS) {
            this.createPath(path);
            this.createPathText(path);
        }

        // create the triangles for the end places
        for (const triangle of THE_END_PLACES) {
            this.createTriangle(triangle);
        }
    }
}
