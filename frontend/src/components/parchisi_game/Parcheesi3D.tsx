'use client';
import { useRef, useEffect, use, useState } from "react";
import { Parcheesi3D } from "@/app/protected/games/parchisi/lib/Parcheesi3D_src/parcheesi3d";
import { Board } from "@/app/protected/games/parchisi/lib/Parcheesi3D_src/Board";
import { Player } from "@/app/protected/games/parchisi/lib/Parcheesi3D_src/Player";
import { io, Socket } from "socket.io-client";
import { PlayerColor, SphereDataType, DiceDataType, JumpDataType, MoveAbleType } from "@/app/protected/games/parchisi/lib/Parcheesi3D_src/types";
import chalk from 'chalk';
import * as BABYLON from "@babylonjs/core";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import {MoveDataType} from "@/app/protected/games/parchisi/lib/Parcheesi3D_src/types";
import { useSocket } from "@/context/parchisiContexts/SocketContext"
import {useGame } from "@/context/parchisiContexts/GameContext";
import { CustomizationType } from "@/types/game";


export function Parcheesi3DComponent() {
    const { loggedUserName, setLoggedUserName } = useLoggedUserName();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Parcheesi3D | null>(null);
    // const socketRef = useRef<Socket| null>(null);
    const boardRef = useRef<Board | null>(null);
    const { socket : socketRef } = useSocket();
    const { state } = useGame();
    const gameId = state.gameId;
    let isLocal = false;
    if (state.gametype === "local") isLocal = true;
    const onResize = () => {
        gameRef.current?.resize();
    };
    const hasEmitted = useRef(false);

    // const [isLoaded, setIsLoaded] = useState(false);

    // setLoggedUserName('zech-chi');
    // connect to server
    useEffect(() => {
        // if (isLoaded) return;
        if (hasEmitted.current) return; // 🚫 Prevent duplicate emit
        hasEmitted.current = true;

        if (canvasRef.current) {
            if (!socketRef) return

            console.log(chalk.green("Connected to server:", socketRef?.id));
            console.log(chalk.green("Socket connection initialized:", socketRef?.id));
            
            console.log(chalk.green("Initializing Parcheesi3D..."));
            // Initialize the Parcheesi3D game with the canvas
            if (canvasRef.current) gameRef.current = new Parcheesi3D(canvasRef.current, state.theme as CustomizationType);
            // Start the render loop
            gameRef.current?.runRenderLoop();
            if (gameRef.current) {
                boardRef.current = new Board(gameRef.current?.scene, gameRef.current.gui, loggedUserName as string, socketRef as Socket, gameId as string, isLocal);
                boardRef.current.initialize();
            }
            
            if (!socketRef)
                    return;

            socketRef.on("welcome", (data) => {
                console.log(chalk.blue("💬 Server says:", data.message));
            });
            
            console.log("ready to play");
            socketRef.emit("readyToPlayX", { userName: loggedUserName, gameId: gameId });
            // Handle welcome message from the server
            socketRef.on("addPlayer", async (data: SphereDataType) => {
                console.log("📥 Sphere data received:", data);
                await boardRef.current?.addPlayerAvatar(data);
                boardRef.current?.createSpheres(data.color);
            });
            
            socketRef.on("setPlayerTurn", async(data: { color: PlayerColor }) => {
                console.log(chalk.green("📥 Player turn set:", data.color));
                boardRef.current?.setPlayerTurn(data.color);
            });

            socketRef.on("rollDices", (data: DiceDataType) => {
                console.log(chalk.green("📥 Dice update received:", data), data);
                boardRef.current?.updateLabel(data);
            });

            socketRef.on("moveAble", (data: MoveAbleType) => {
                boardRef.current?.setMoveAble(data);
            });

            socketRef.on("move", (data: MoveDataType) => {
                console.log(chalk.green("📥 Move data received:", data), data);
                boardRef.current?.move(data);
            });

            socketRef.on("jump", (data: JumpDataType) => {
                console.log(chalk.green("📥 Jump data received:", data));
                boardRef.current?.jump(data);
            });
            
            // Handle incoming commands from the server
            socketRef.on("command", (data) => {
                console.log(chalk.yellow("📥 Command received:", data.message, "at", data.time));
            });

            // Handle disconnection event
            socketRef.on("disconnect", () => {
                console.log(chalk.red("Disconnected from server"));
            });
            // setIsLoaded(true);
        }
        window.addEventListener("resize", onResize);
        }, [canvasRef.current]);

    return (
        <canvas ref={canvasRef} className="w-full h-full" id="renderCanvas"/>
    );
}
