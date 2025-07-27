'use client';
import { useRef, useEffect, use, useState } from "react";
import { Parcheesi3D } from "@/app/lib/Parcheesi3D_src/parcheesi3d";
import { Board } from "@/app/lib/Parcheesi3D_src/Board";
import { Player } from "@/app/lib/Parcheesi3D_src/Player";
import { io, Socket } from "socket.io-client";
import { PlayerColor, SphereDataType, DiceDataType, JumpDataType, MoveAbleType } from "@/app/lib/Parcheesi3D_src/types";
import chalk from 'chalk';
import * as BABYLON from "@babylonjs/core";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";


export function Parcheesi3DComponent() {
    const { loggedUserName } = useLoggedUserName();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Parcheesi3D | null>(null);
    const socketRef = useRef<Socket| null>(null);
    const boardRef = useRef<Board | null>(null);
    const onResize = () => {
        gameRef.current?.resize();
    };

    // connect to server
    useEffect(() => {
        if (canvasRef.current) {
            if (!socketRef.current) { 
                // Initialize the socket connection
                socketRef.current = io("http://localhost:5555", {
                    transports: ["websocket"],
                    autoConnect: true,
                });

                // Handle socket connection events
                socketRef.current.on("connect", () => {
                    console.log(chalk.green("Connected to server:", socketRef.current?.id));
                    console.log(chalk.green("Socket connection initialized:", socketRef.current?.id));
                    
                    console.log(chalk.green("Initializing Parcheesi3D..."));
                    // Initialize the Parcheesi3D game with the canvas
                    if (canvasRef.current) gameRef.current = new Parcheesi3D(canvasRef.current);
                    // Start the render loop
                    gameRef.current?.runRenderLoop();
                    if (gameRef.current) {
                        boardRef.current = new Board(gameRef.current?.scene, gameRef.current.gui, loggedUserName as string, socketRef.current as Socket);
                        boardRef.current.initialize();
                    }
                });

                // Handle welcome message from the server
                socketRef.current.on("welcome", (data) => {
                    console.log(chalk.blue("💬 Server says:", data.message));
                });
                
                socketRef.current.on("addPlayer", async (data: SphereDataType) => {
                    console.log("📥 Sphere data received:", data);
                    await boardRef.current?.addPlayerAvatar(data);
                    boardRef.current?.createSpheres(data.color);
                });
                
                socketRef.current.on("setPlayerTurn", (data: { color: PlayerColor }) => {
                    console.log(chalk.green("📥 Player turn set:", data.color));
                    boardRef.current?.setPlayerTurn(data.color);
                });

                socketRef.current.on("rollDices", (data: DiceDataType) => {
                    console.log(chalk.green("📥 Dice update received:", data), data);
                    boardRef.current?.updateLabel(data);
                });

                socketRef.current.on("moveAble", (data: MoveAbleType) => {
                    boardRef.current?.setMoveAble(data);
                });

                socketRef.current.on("jump", (data: JumpDataType) => {
                    console.log(chalk.green("📥 Jump data received:", data));
                    boardRef.current?.jump(data);
                });
                
                // Handle incoming commands from the server
                socketRef.current.on("command", (data) => {
                    console.log(chalk.yellow("📥 Command received:", data.message, "at", data.time));
                });

                // Handle disconnection event
                socketRef.current.on("disconnect", () => {
                    console.log(chalk.red("Disconnected from server"));
                });
            }
            window.addEventListener("resize", onResize);
        }
    }, []);

    return (
        <canvas ref={canvasRef} className="w-full h-full" id="renderCanvas"/>
    );
}
