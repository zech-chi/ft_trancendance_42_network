'use client';
import { useRef, useEffect, use, useState } from "react";
import { Parcheesi3D } from "@/app/lib/Parcheesi3D_src/parcheesi3d";
import { Board } from "@/app/lib/Parcheesi3D_src/Board";
import { Player } from "@/app/lib/Parcheesi3D_src/Player";
import { io, Socket } from "socket.io-client";
import { PlayerColor, SphereDataType, DiceDataType, JumpDataType, MoveAbleType } from "@/app/lib/Parcheesi3D_src/types";
import chalk from 'chalk';
import * as BABYLON from "@babylonjs/core";
import { useLoggedUserName } from "@/contexts/LoggedUserNameContext";
import {MoveDataType} from "@/app/lib/Parcheesi3D_src/types";
import { useSocket } from "@/contexts/SocketContext"



export function Parcheesi3DComponent() {
    const { loggedUserName, setLoggedUserName } = useLoggedUserName();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Parcheesi3D | null>(null);
    // const socketRef = useRef<Socket| null>(null);
    const boardRef = useRef<Board | null>(null);
    const { socket : socketRef } = useSocket()
    const onResize = () => {
        gameRef.current?.resize();
    };

    // setLoggedUserName('zech-chi');
    // connect to server
    useEffect(() => {
        if (canvasRef.current) {
            if (!socketRef) return

            console.log(chalk.green("Connected to server:", socketRef?.id));
            console.log(chalk.green("Socket connection initialized:", socketRef?.id));
            
            console.log(chalk.green("Initializing Parcheesi3D..."));
            // Initialize the Parcheesi3D game with the canvas
            if (canvasRef.current) gameRef.current = new Parcheesi3D(canvasRef.current);
            // Start the render loop
            gameRef.current?.runRenderLoop();
            if (gameRef.current) {
                boardRef.current = new Board(gameRef.current?.scene, gameRef.current.gui, loggedUserName as string, socketRef as Socket);
                boardRef.current.initialize();
            }
            
            if (!socketRef)
                    return;
            // Handle welcome message from the server
            socketRef.on("welcome", (data) => {
                console.log(chalk.blue("💬 Server says:", data.message));
            });
            
            socketRef.on("addPlayer", async (data: SphereDataType) => {
                console.log("📥 Sphere data received:", data);
                await boardRef.current?.addPlayerAvatar(data);
                boardRef.current?.createSpheres(data.color);
            });
            
            socketRef.on("setPlayerTurn", (data: { color: PlayerColor }) => {
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
        }
        window.addEventListener("resize", onResize);
        }, []);

    return (
        <canvas ref={canvasRef} className="w-full h-full" id="renderCanvas"/>
    );
}
