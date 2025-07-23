import * as BABYLON from "@babylonjs/core";
import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";

export class Parcheesi3D {
    /* the canvas element where the 3D scene will be rendered */
    public canvas: HTMLCanvasElement;
    /* the Babylon.js engine that handles rendering */
    public engine: BABYLON.Engine;
    /* the Babylon.js scene where all 3D objects are placed */
    public scene: BABYLON.Scene;
    /* trust me, I’ll assign it later */
    private camera!: BABYLON.ArcRotateCamera | BABYLON.FreeCamera | BABYLON.UniversalCamera;
    private light!: BABYLON.HemisphericLight;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        // background color of the scene black
        // this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        this.setupCamera();
        this.setupLights();
        this.setupSky();
        this.addAxes(); // for debugging
    }

    private setupCamera() {
        this.camera = new BABYLON.ArcRotateCamera(
            "Camera", // name
            Math.PI / 2, // alpha (horizontal angle)
            BABYLON.Tools.ToRadians(45), // beta (vertical angle)
            70, // radius (distance from target)
            BABYLON.Vector3.Zero(), // target (where the camera looks at)
            this.scene // scene to attach the camera to
        );

        this.camera.attachControl(this.canvas, true); // make camera moveAble
        // beta controls the vertical rotation angle (how far the camera is from the horizontal plane).
        // restricts how high the camera can tilt upward.
        // this.camera.upperBetaLimit = Math.PI / 2 - Math.PI / 13;
        // control the minimum and maximum distance from the target.
        // this.camera.lowerRadiusLimit = 5;
        // this.camera.upperRadiusLimit = 130;
    }

    private setupLights() {
        // Create a hemispheric light that simulates sunlight
        // The direction of the light is from the sky to the ground
        // The first parameter is the name of the light, the second is the direction vector
        // The direction vector is normalized, meaning it has a length of 1
        // The third parameter is the scene to which the light belongs
        this.light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), this.scene);
        // Set the intensity of the light
        this.light.intensity = 1;
        // Set the diffuse color of the light (the color of the light that illuminates the scene)
        this.light.diffuse = new BABYLON.Color3(1, 1, 1);
    }

    private addAxes() {
        // new BABYLON.Debug.AxesViewer(this.scene, 2);
        new AxesViewer(this.scene, 2);
    }

    private setupSky() {
        const skybox = BABYLON.MeshBuilder.CreateBox("BackgroundSkybox", {
            size: 500,
            sideOrientation: BABYLON.Mesh.BACKSIDE
        }, this.scene);
    
        const backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", this.scene);
        backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/TropicalSunnyDay", this.scene);
        // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/skybox2", this.scene);
        // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/environment.env", this.scene);
        backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    
        skybox.material = backgroundMaterial;
    }
    

    public runRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    public resize() {
        // Resize the engine when the canvas size changes
        this.engine.resize();
    }

    public dispose() {
        // Dispose of the engine and scene when no longer needed
        this.engine.dispose();
        this.scene.dispose();
    }
}