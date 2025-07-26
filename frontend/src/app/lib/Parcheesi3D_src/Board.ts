import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { io, Socket } from "socket.io-client";
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
import { LOCATIONS, Location } from "./config/locationsConfig";
import { se7enRed, se7enGreen, se7enYellow, se7enBlue } from "./config/locationsConfig";
import { finalRed, finalGreen, finalYellow, finalBlue } from "./config/locationsConfig";

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
    // socket
    private socket!: Socket;

    private scene: BABYLON.Scene;
    private redLabel?: GUI.TextBlock;
    private greenLabel?: GUI.TextBlock;
    private blueLabel?: GUI.TextBlock;
    private yellowLabel?: GUI.TextBlock;
    /// button for each player
    private redButton?: GUI.Button;
    private greenButton?: GUI.Button;
    private blueButton?: GUI.Button;
    private yellowButton?: GUI.Button;

    private gui: GUI.AdvancedDynamicTexture;
    // Dice values for each player 
    private redDice1: number = 0;
    private redDice2: number = 0;
    private greenDice1: number = 0;
    private greenDice2: number = 0;
    private yellowDice1: number = 0;
    private yellowDice2: number = 0;
    private blueDice1: number = 0;
    private blueDice2: number = 0;
    // player turn
    private playerTurn: PlayerColor = PlayerColor.RED; // default to RED
    // player userName
    private playerUserName: string = "";
    private playerColor!: PlayerColor;

    constructor(scene: BABYLON.Scene, gui: GUI.AdvancedDynamicTexture, loggedUserName: string, socket: Socket) {
        this.scene = scene;
        this.gui = gui;
        this.socket = socket;
        this.playerUserName = loggedUserName;
        console.log("You are playing as :", this.playerUserName);
        console.log("Socket initialized:", this.socket.id);
    }

    public setPlayerTurn(color: PlayerColor) {
        this.playerTurn = color;
        // hide all buttons expect the current player's button
        if (this.redButton) this.redButton.isVisible = false;
        if (this.greenButton) this.greenButton.isVisible = false;
        if (this.yellowButton) this.yellowButton.isVisible = false;
        if (this.blueButton) this.blueButton.isVisible = false;

        if (this.playerColor === color) {
            switch (color) {
                case PlayerColor.RED:
                    if (this.redButton) this.redButton.isVisible = true;
                    break;
                case PlayerColor.GREEN:
                    if (this.greenButton) this.greenButton.isVisible = true;
                    break;
                case PlayerColor.YELLOW:
                    if (this.yellowButton) this.yellowButton.isVisible = true;
                    break;
                case PlayerColor.BLUE:
                    if (this.blueButton) this.blueButton.isVisible = true;
                    break;
            }
        }
        this.scene.render();
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
        console.log("->sphere" + sphere.type + String(sphere.id));
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
        button.color = COLORS_VERY_DARK[type];
        button.cornerRadius = 20;
        button.background = COLORS_LOW_DARK[type];
        button.zIndex = 10;
        button.isVisible = false; // initially hidden, will be shown when it's the player's turn

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
            // Emit the roll dice event to the server
            // this.socket.emit("requestRollDices", { color: type });
            if (this.socket.connected) {
                this.socket.emit("requestRollDices", { color: type });
                console.log("Dice rolled for color:", type);
            } else {
                console.error("Socket not connected!");
            }
            // console.log("Dice rolled for color:", type);
            button.isVisible = false; // hide the button after clicking
        });

        // store the buttons
        switch (type) {
            case PlayerColor.RED:
                this.redButton = button;
                break;
            case PlayerColor.GREEN:
                this.greenButton = button;
                break;
            case PlayerColor.YELLOW:
                this.yellowButton = button;
                break;
            case PlayerColor.BLUE:
                this.blueButton = button;
                break;
        }
        this.gui.addControl(button);
    }
    
    private createLabel(type: PlayerColor) {
        // Create the TextBlock control
        let label: GUI.TextBlock;

        switch (type) {
            case PlayerColor.RED:
                label = new GUI.TextBlock(`${type}Label`, `dice1: ${this.redDice1}, dice2: ${this.redDice2}`);
                break;
            case PlayerColor.GREEN:
                label = new GUI.TextBlock(`${type}Label`, `dice1: ${this.greenDice1}, dice2: ${this.greenDice2}`);
                break;
            case PlayerColor.YELLOW:
                label = new GUI.TextBlock(`${type}Label`, `dice1: ${this.yellowDice1}, dice2: ${this.yellowDice2}`);
                break;
            case PlayerColor.BLUE:
                label = new GUI.TextBlock(`${type}Label`, `dice1: ${this.blueDice1}, dice2: ${this.blueDice2}`);
                break;
        }

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
                this.redDice1 = data.dice1;
                this.redDice2 = data.dice2;
                if (this.redLabel) {
                    this.redLabel.text = labelText;          
                }
                break;
            case PlayerColor.GREEN:
                this.greenDice1 = data.dice1;
                this.greenDice2 = data.dice2;
                if (this.greenLabel) {
                    this.greenLabel.text = labelText;
                }
                break;
            case PlayerColor.YELLOW:
                this.yellowDice1 = data.dice1;
                this.yellowDice2 = data.dice2;
                if (this.yellowLabel) {
                    this.yellowLabel.text = labelText;
                }
                break;
            case PlayerColor.BLUE:
                this.blueDice1 = data.dice1;
                this.blueDice2 = data.dice2;
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
        if (!obj.userName || !obj.color) {
            console.error("Invalid player data:", obj);
            return;
        }

        if (this.playerUserName === obj.userName) {
            this.playerColor = obj.color;
        }

        console.log(this.playerColor, "   ", this.playerUserName);
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


    // playing
    private jumpAnimation(meshName: string, positions: Position, speed = 1.0, maxY = 5) {
        return new Promise<void>((resolve) => {
            const mesh = this.scene.getMeshByName(meshName);
            if (!mesh) {
                console.error(`Error in jumpAnimation: Mesh with name ${meshName} not found.`);
                resolve();
                return;
            }
    
            const start = mesh.position.clone();
            const end = new BABYLON.Vector3(positions.x, positions.y, positions.z);
            const frameRate = 60;
            const jumpDuration = 1.0 / speed; // Duration of the jump in seconds
    
            // Create a more realistic parabolic jump animation
            const jumpKeys = [];
            const numKeys = 30; // More keys for a smoother arc
    
            for (let i = 0; i <= numKeys; i++) {
                const frame = (frameRate * jumpDuration * i) / numKeys;
                const progress = i / numKeys;
    
                // Linear interpolation for X and Z
                const currentPos = BABYLON.Vector3.Lerp(start, end, progress);
    
                // Parabolic curve for Y
                // Formula: y = -4 * maxY * x^2 + 4 * maxY * x
                currentPos.y += (-4 * maxY * progress * progress + 4 * maxY * progress);
    
                jumpKeys.push({
                    frame: frame,
                    value: currentPos
                });
            }
    
            const positionAnim = new BABYLON.Animation(
                "jumpPositionAnimation",
                "position",
                frameRate,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            positionAnim.setKeys(jumpKeys);
    
            // --- Rotation Animation ---
            // Make the mesh face the direction of the jump
            const direction = end.subtract(start);
            if (direction.length() > 0.01) { // Only rotate if there is movement
                const targetRotation = BABYLON.Quaternion.FromLookDirectionLH(direction.normalize(), new BABYLON.Vector3(0, 1, 0));
    
                const rotationAnim = new BABYLON.Animation(
                    "jumpRotationAnimation",
                    "rotationQuaternion",
                    frameRate,
                    BABYLON.Animation.ANIMATIONTYPE_QUATERNION,
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );
    
                // Use current rotation if it exists, otherwise create a new one
                const startQuat = mesh.rotationQuaternion ? mesh.rotationQuaternion.clone() : BABYLON.Quaternion.Identity();
    
                rotationAnim.setKeys([
                    { frame: 0, value: startQuat },
                    { frame: (frameRate * jumpDuration) / 4, value: BABYLON.Quaternion.Slerp(startQuat, targetRotation, 0.5) }, // Start turning early
                    { frame: frameRate * jumpDuration, value: targetRotation }
                ]);
                mesh.animations.push(rotationAnim);
            }
            
            mesh.animations = [positionAnim];
    
            const animation = this.scene.beginAnimation(mesh, 0, frameRate * jumpDuration, false, 1.0, () => {
                // Ensure final state is set correctly
                mesh.position = end;
                if (mesh.rotationQuaternion) {
                    const direction = end.subtract(start);
                    if (direction.length() > 0.01) {
                        mesh.rotationQuaternion = BABYLON.Quaternion.FromLookDirectionLH(direction.normalize(), new BABYLON.Vector3(0, 1, 0));
                    }
                }
                console.log(`Jump animation finished for ${meshName} at position:`, positions);
                resolve();
            });
        });
    }

    public async jump() {
        await this.jumpAnimation("sphereRED1", LOCATIONS[1]["center"], 1.0, 2).then(() => {
            console.log("Jump animation completed");
        }); 
        await this.jumpAnimation("sphereRED2", LOCATIONS[2]["center"], 1.0, 2).then(() => {
            console.log("Jump animation completed");
        }); 
        await this.jumpAnimation("sphereRED3", LOCATIONS[3]["center"], 1.0, 2).then(() => {
            console.log("Jump animation completed");
        }); 
        await this.jumpAnimation("sphereRED4", LOCATIONS[4]["center"], 1.0, 2).then(() => {
            console.log("Jump animation completed");
        });

        await this.jumpAnimation("sphereRED1", finalRed[1], 1.0, 2).then(() => {
            console.log("Jump animation completed");
        }); 
        await this.jumpAnimation("sphereRED2", finalRed[2], 1.0, 2).then(() => {
            console.log("Jump animation completed");
        }); 
        await this.jumpAnimation("sphereRED3", finalRed[3], 1.0, 2).then(() => {
            console.log("Jump animation completed");
        }); 
        await this.jumpAnimation("sphereRED4", finalRed[4], 1.0, 2).then(() => {
            console.log("Jump animation completed");
        }); 
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
