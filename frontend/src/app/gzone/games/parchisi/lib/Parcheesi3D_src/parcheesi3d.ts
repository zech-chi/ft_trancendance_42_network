import * as BABYLON from "@babylonjs/core";
import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";
import * as GUI from "@babylonjs/gui";
import { text } from "stream/consumers";
import { CustomizationType } from "@/types/game";

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
    public gui: GUI.AdvancedDynamicTexture;
    private costumization: CustomizationType;

    constructor(canvas: HTMLCanvasElement, conf: CustomizationType) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.costumization = conf;

        // background color of the scene black
        // this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        this.setupCamera();
        this.setupLights();
        if (this.costumization.istextureonline) {
            this.setupSky_babylong();
        }else{
            this.setupSky_local();
        }
        this.addAxes(); // for debugging
        this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
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
        this.camera.upperBetaLimit = Math.PI / 2 - Math.PI / 24;
        // control the minimum and maximum distance from the target.
        this.camera.lowerRadiusLimit = 5;
        this.camera.upperRadiusLimit = 130;
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

    // addSky(scene) {
    //     var skydome = BABYLON.Mesh.CreteSphere('dome', 64, 700, scene);
    //     skydome.scaling = new BABYLON.Vector3(1.5, .5, 1.5);
    //     skydome.position.y = -30;
    //     var env_mat = new BABYLON.StandardMaterial("domemat", scene);
    //     // var envtext = new BABYLON.Texture("https://cdn.eso.org/images/large/mmb-coatn-tank-pano2.jpg", scene);
    //     var envtext = new BABYLON.Texture('./1337.jpg', scene);
    //     env_mat.diffuseTexture = envtext;
    //     env_mat.diffuseTexture.vScale = -1;
    //     env_mat.emissiveTexture = envtext;
    //     env_mat.emissiveColor = new BABYLON.Color3(1,1,1);
    //     env_mat.backFaceCulling = false;
    //     skydome.material = env_mat;
    // }

    private setupSky_local() {
        const skydome = BABYLON.MeshBuilder.CreateSphere("SkyDome", {
            segments: 64,
            diameter: 1000
        }, this.scene);
        skydome.scaling = new BABYLON.Vector3(1.5, .5, 1.5);
    
        skydome.position.y = -30;
    
        const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", this.scene);
    
        const panoTexture = new BABYLON.Texture(this.costumization.textureimage, this.scene);
        panoTexture.vScale = -1; // flip vertical to fix inversion
    
        skyMaterial.diffuseTexture = panoTexture;
        skyMaterial.emissiveTexture = panoTexture;
        skyMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        skyMaterial.backFaceCulling = false;
    
        skydome.material = skyMaterial;
    }
    
    
    private setupSky_babylong() {
        const skybox = BABYLON.MeshBuilder.CreateBox("BackgroundSkybox", {
            size: 500,
            sideOrientation: BABYLON.Mesh.BACKSIDE
        }, this.scene);
    
        const backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", this.scene);
        // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/TropicalSunnyDay", this.scene);
        // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/SpecularHDR.dds", this.scene);
        backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture(this.costumization.textureimage, this.scene);
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