'use client';
import { useRef, useEffect, use } from "react";
import { Parcheesi3D } from "@/app/lib/Parcheesi3D_src/parcheesi3d";
import { Board } from "@/app/lib/Parcheesi3D_src/Board";

export function Parcheesi3DComponent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Parcheesi3D | null>(null);
    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            // Initialize the Parcheesi3D game with the canvas
            gameRef.current = new Parcheesi3D(canvasRef.current);
            // Start the render loop
            gameRef.current.runRenderLoop();

            const board = new Board(gameRef.current.scene);
            board.initialize();

            const onResize = () => {
                gameRef.current?.resize();
            };
            window.addEventListener("resize", onResize);
        }
    }, []);

    return (
        <canvas ref={canvasRef} className="w-full h-full" id="renderCanvas"/>
    );
}