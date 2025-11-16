"use client";

import NextImage from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "../../context/settings/SettingsContext";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

// Types
interface PadColor {
  id: number;
  color: string;
  imgSrc: string;
}

interface TableBg {
  id: number;
  imgSrc: string;
  name?: string;
}

interface BallOption {
  id: number;
  ballImg: string;
  name?: string;
}

// Improved rounded rectangle function with better performance
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// Enhanced clipped circle image function
function drawClippedCircleImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  r: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

// Enhanced Background Table Selector
function BgTable({
  table,
  onSelect,
  selectedTable,
}: {
  table: TableBg[];
  onSelect: (imgSrc: string) => void;
  selectedTable: string;
}) {
  return (
    <div className="flex flex-col space-y-4">
      {/* <NextImage src={BgSelect} alt="Background select text" className="mx-auto" /> */}
      <div className="w-full p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="grid grid-cols-4 gap-4">
          {table.map(({ id, imgSrc, name }) => (
            <button
              key={id}
              onClick={() => onSelect(imgSrc)}
              className={`
                relative p-2 rounded-xl transition-all duration-300 transform hover:scale-105
                ${
                  selectedTable === imgSrc
                    ? "ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50"
                    : "hover:ring-2 hover:ring-white/60 hover:shadow-md"
                }
              `}
              title={name || `Table ${id + 1}`}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square">
                <NextImage
                  src={imgSrc}
                  alt={`Table ${id + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 200px"
                />
              </div>
              {selectedTable === imgSrc && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Paddle Selector
function PadList({
  pads,
  onSelect,
  selectedColor,
}: {
  pads: PadColor[];
  onSelect: (color: string) => void;
  selectedColor: string;
}) {
  return (
    <div className="w-full p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="grid grid-cols-4 gap-4">
        {pads.map(({ id, color, imgSrc }) => (
          <button
            key={id}
            onClick={() => onSelect(color)}
            className={`
              relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105
              ${
                selectedColor === color
                  ? "ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50"
                  : "hover:ring-2 hover:ring-white/60 hover:shadow-md"
              }
            `}
            title={`${color.charAt(0).toUpperCase() + color.slice(1)} Paddle`}
          >
            <div className="relative overflow-hidden rounded-lg aspect-square">
              <NextImage
                src={imgSrc}
                alt={`${color} Paddle`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 25vw, 200px"
                style={{
                  filter:
                    color !== "white"
                      ? `hue-rotate(${getHueRotation(color)}deg) saturate(150%)`
                      : "none",
                }}
              />
            </div>
            <div className="mt-2 text-xs text-white/80 capitalize font-medium">
              {color}
            </div>
            {selectedColor === color && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Enhanced Ball Selector
function Balls({
  balls,
  onSelect,
  selectedBall,
}: {
  balls: BallOption[];
  onSelect: (ballImg: string) => void;
  selectedBall: string;
}) {
  return (
    <div className="flex flex-col space-y-4">
      {/* <NextImage src={SelectBall} alt="Select ball text" className="mx-auto" /> */}
      <div className="w-full p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="grid grid-cols-4 gap-4">
          {balls.map(({ id, ballImg, name }) => (
            <button
              key={id}
              onClick={() => onSelect(ballImg)}
              className={`
                relative p-3 rounded-2xl transition-all duration-300 transform hover:scale-110
                ${
                  selectedBall === ballImg
                    ? "ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50"
                    : "hover:ring-2 hover:ring-white/60 hover:shadow-md"
                }
              `}
              title={name || `Ball ${id + 1}`}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square">
                <NextImage
                  src={ballImg}
                  alt={`Ball ${id + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedBall === ballImg && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Max Score Selector
function MaxScoreList({
  maxScore,
  onSelect,
  selectedScore,
}: {
  maxScore: { id: number; score: string }[];
  onSelect: (score: string) => void;
  selectedScore: string;
}) {
  return (
    <div className="flex flex-col space-y-4">
      {/* <NextImage src={MaxScoreImg} alt="Max score select" className="mx-auto" /> */}
      <div className="w-full p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="flex flex-col gap-3">
          {maxScore.map(({ id, score }) => (
            <button
              key={id}
              onClick={() => onSelect(score)}
              className={`
                relative py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                ${
                  selectedScore === score
                    ? "bg-yellow-400 text-black ring-4 ring-yellow-400/50 shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20 hover:shadow-md"
                }
              `}
              title={`Max Score: ${score}`}
            >
              {score} Points
              {selectedScore === score && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced MiniPong with better performance and effects
function MiniPong({
  paddleColor,
  tableUrl,
  ballUrl,
}: {
  paddleColor: string;
  tableUrl: string;
  ballUrl: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const ballImgRef = useRef<HTMLImageElement | null>(null);
  const colorRef = useRef<string>(paddleColor);
  const lastTimeRef = useRef<number>(0);

  // Game state with enhanced physics
  const gameStateRef = useRef({
    ball: {
      x: 400,
      y: 300,
      dx: 4,
      dy: 3,
      radius: 12,
      trail: [] as { x: number; y: number; alpha: number }[],
    },
    leftPaddle: { x: 20, y: 250, width: 15, height: 100, targetY: 250 },
    rightPaddle: { x: 765, y: 250, width: 15, height: 100, targetY: 250 },
    particles: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }[],
  });

  // Color ref update
  useEffect(() => {
    colorRef.current = paddleColor;
  }, [paddleColor]);

  // Image loading effects
  useEffect(() => {
    if (!tableUrl) return;

    const img = new window.Image();
    img.src = tableUrl;
    img.onload = () => {
      bgImgRef.current = img;
    };
    img.onerror = () => {
      console.warn("Failed to load table image:", tableUrl);
      bgImgRef.current = null;
    };
  }, [tableUrl]);

  useEffect(() => {
    if (!ballUrl) return;

    const img = new window.Image();
    img.src = ballUrl;
    img.onload = () => {
      ballImgRef.current = img;
    };
    img.onerror = () => {
      console.warn("Failed to load ball image:", ballUrl);
      ballImgRef.current = null;
    };
  }, [ballUrl]);

  // Enhanced game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;
    const PADDLE_SPEED = 8;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const state = gameStateRef.current;

      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Collisions avec les murs haut et bas
      if (
        state.ball.y - state.ball.radius <= 0 ||
        state.ball.y + state.ball.radius >= CANVAS_HEIGHT
      ) {
        state.ball.dy = -state.ball.dy;
        state.ball.y =
          state.ball.y - state.ball.radius <= 0
            ? state.ball.radius
            : CANVAS_HEIGHT - state.ball.radius;
      }

      // Enhanced AI with smoothing
      const lc = state.leftPaddle.y + state.leftPaddle.height / 2;
      state.leftPaddle.targetY = state.ball.y - state.leftPaddle.height / 2;
      state.leftPaddle.y +=
        (state.leftPaddle.targetY - state.leftPaddle.y) * 0.1;
      state.leftPaddle.y = Math.max(
        0,
        Math.min(CANVAS_HEIGHT - state.leftPaddle.height, state.leftPaddle.y)
      );

      const rc = state.rightPaddle.y + state.rightPaddle.height / 2;
      state.rightPaddle.targetY = state.ball.y - state.rightPaddle.height / 2;
      state.rightPaddle.y +=
        (state.rightPaddle.targetY - state.rightPaddle.y) * 0.1;
      state.rightPaddle.y = Math.max(
        0,
        Math.min(CANVAS_HEIGHT - state.rightPaddle.height, state.rightPaddle.y)
      );

      // Paddle collisions with enhanced effects
      if (
        state.ball.x - state.ball.radius <=
          state.leftPaddle.x + state.leftPaddle.width &&
        state.ball.y >= state.leftPaddle.y &&
        state.ball.y <= state.leftPaddle.y + state.leftPaddle.height &&
        state.ball.dx < 0
      ) {
        state.ball.dx = -state.ball.dx * 1.05; // Slight speed increase
        state.ball.dy += (Math.random() - 0.5) * 3;

        // Add hit particles
        for (let i = 0; i < 8; i++) {
          state.particles.push({
            x: state.leftPaddle.x + state.leftPaddle.width,
            y: state.ball.y,
            vx: Math.random() * 6,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
          });
        }
      }

      if (
        state.ball.x + state.ball.radius >= state.rightPaddle.x &&
        state.ball.y >= state.rightPaddle.y &&
        state.ball.y <= state.rightPaddle.y + state.rightPaddle.height &&
        state.ball.dx > 0
      ) {
        state.ball.dx = -state.ball.dx * 1.05;
        state.ball.dy += (Math.random() - 0.5) * 3;

        // Add hit particles
        for (let i = 0; i < 8; i++) {
          state.particles.push({
            x: state.rightPaddle.x,
            y: state.ball.y,
            vx: -Math.random() * 6,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
          });
        }
      }

      // Ball reset on out of bounds
      if (state.ball.x < -50 || state.ball.x > CANVAS_WIDTH + 50) {
        state.ball.x = CANVAS_WIDTH / 2;
        state.ball.y = CANVAS_HEIGHT / 2;
        state.ball.dx = state.ball.x < CANVAS_WIDTH / 2 ? 4 : -4;
        state.ball.dy = (Math.random() - 0.5) * 6;
        state.ball.trail = [];
      }

      // Speed limits
      state.ball.dx = Math.max(-12, Math.min(12, state.ball.dx));
      state.ball.dy = Math.max(-10, Math.min(10, state.ball.dy));

      // Update particles
      state.particles = state.particles.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // Gravity
        particle.life -= 0.02;
        return particle.life > 0;
      });

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      // ---- Enhanced Rendering ----
      // Background
      if (bgImgRef.current?.complete) {
        ctx.drawImage(bgImgRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
        gradient.addColorStop(0, "#1a1a2e");
        gradient.addColorStop(1, "#0f0f23");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      // Center line with glow effect
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#fff";
      ctx.setLineDash([15, 15]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Ball trail
      state.ball.trail.forEach((point, index) => {
        if (point.alpha <= 0) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${point.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(
          point.x,
          point.y,
          state.ball.radius * (point.alpha * 0.8),
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      // Paddles with glow effect
      ctx.shadowColor = colorRef.current;
      ctx.shadowBlur = 15;
      ctx.fillStyle = colorRef.current;

      drawRoundedRect(
        ctx,
        state.leftPaddle.x,
        state.leftPaddle.y,
        state.leftPaddle.width,
        state.leftPaddle.height,
        8
      );

      drawRoundedRect(
        ctx,
        state.rightPaddle.x,
        state.rightPaddle.y,
        state.rightPaddle.width,
        state.rightPaddle.height,
        8
      );

      ctx.shadowBlur = 0;

      // Ball
      const ballImg = ballImgRef.current;
      const r = state.ball.radius;

      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 20;

      if (ballImg?.complete) {
        drawClippedCircleImage(ctx, ballImg, state.ball.x, state.ball.y, r);
      } else {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Particles
      state.particles.forEach((particle) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div className="p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full rounded-lg shadow-2xl bg-black border-2 border-white/20"
            style={{ aspectRatio: "4 / 3", maxHeight: "450px" }}
          />
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
            Preview
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for color hue rotation
function getHueRotation(color: string): number {
  const colorMap: { [key: string]: number } = {
    red: 0,
    green: 120,
    blue: 240,
    pink: 320,
    purple: 280,
    teal: 180,
    fuchsia: 300,
    white: 0,
  };
  return colorMap[color] || 0;
}

// Main component with enhanced layout
export default function GameSettings() {
  const handleClick = () => {
    setShowComponent(true); // Affiche le composant
    router.push("../game/local"); // Change le lien (URL)
  };

  const handleStart = () => {
    // 1) sauvegarde complète (remplace tout)
    setSettings({
      bgTable: tableImg,
      paddle: customPaddleColor,
      score: maxScore,
      ball: ballImg,
    });

    // 2) navigate after saving
    router.push("/protected/games/ping-pong/modes/local"); // ou la route correcte
  };
  const [showComponent, setShowComponent] = useState(false);
  const [customPaddleColor, setCustomPaddleColor] = useState("red");
  const [tableImg, setTableImg] = useState("/images/table1.webp");
  const [ballImg, setBallImg] = useState("/images/Balls/ball1.png");
  const [maxScore, setMaxScore] = useState("5");
  const { setSettings, updateSettings } = useSettings();

  const router = useRouter();

  // Enhanced data with names
  const Pad: PadColor[] = [
    { id: 0, color: "white", imgSrc: "/images/WhitePaddle.png" },
    { id: 1, color: "red", imgSrc: "/images/WhitePaddle.png" },
    { id: 2, color: "green", imgSrc: "/images/WhitePaddle.png" },
    { id: 3, color: "pink", imgSrc: "/images/WhitePaddle.png" },
    { id: 4, color: "purple", imgSrc: "/images/WhitePaddle.png" },
    { id: 5, color: "teal", imgSrc: "/images/WhitePaddle.png" },
    { id: 6, color: "blue", imgSrc: "/images/WhitePaddle.png" },
    { id: 7, color: "fuchsia", imgSrc: "/images/WhitePaddle.png" },
  ];

  const Table: TableBg[] = [
    { id: 0, imgSrc: "/images/table1.webp", name: "Classic Wood" },
    { id: 1, imgSrc: "/images/table2.jpeg", name: "Modern Blue" },
    { id: 2, imgSrc: "/images/table3.webp", name: "Neon Cyber" },
    { id: 3, imgSrc: "/images/table4.jpeg", name: "Retro Green" },
    { id: 4, imgSrc: "/images/table5.png", name: "Space Theme" },
    { id: 5, imgSrc: "/images/table6.png", name: "Ocean Depth" },
    { id: 6, imgSrc: "/images/table7.jpeg", name: "Fire Arena" },
    { id: 7, imgSrc: "/images/table8.jpeg", name: "Ice Palace" },
  ];

  const BallsList: BallOption[] = [
    { id: 0, ballImg: "/images/Balls/ball1.png", name: "Classic" },
    { id: 1, ballImg: "/images/Balls/ball2.png", name: "Fire" },
    { id: 2, ballImg: "/images/Balls/ball3.png", name: "Ice" },
    { id: 3, ballImg: "/images/Balls/ball4.png", name: "Lightning" },
    { id: 4, ballImg: "/images/Balls/ball5.png", name: "Galaxy" },
    { id: 5, ballImg: "/images/Balls/ball6.png", name: "Neon" },
    { id: 6, ballImg: "/images/Balls/ball4.png", name: "Magic" },
    { id: 7, ballImg: "/images/Balls/ball5.png", name: "Crystal" },
  ];

  const ScoreList = [
    { id: 0, score: "3" },
    { id: 1, score: "5" },
    { id: 2, score: "8" },
    { id: 3, score: "10" },
  ];

  return (
     <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
        <Sidebar />
        <Navbar />
        <main
          className="flex flex-row items-center justify-center relative overflow-x-hidden
                            xl:pl-20 2xl:pl-24 w-full
                            h-[calc(100%-130px)]
                            xl:h-[calc(100%-75px)]
                            2xl:h-[calc(100%-85px)]
                            2xl:mt-[67px] xl:mt-[60px] overflow-y-hidden
                        "
        >
          <div className="flex h-screen w-screen  bg-cover bg-center overflow-auto justify-center">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120, 119, 198, 0.7),rgba(255,255,255,0.9))]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center">
        {/* <div className="bg-black backdrop-blur-5xl rounded-3xl p-8 shadow-2xl border border-white/10"> */}
        <div className="bg-black/50 backdrop-blur-[5px] rounded-3xl p-8 shadow-2xl border border-white/10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Game Settings
            </h1>
            <p className="text-white/70">Customize your Pong experience</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Controls */}
            <div className="xl:col-span-2 space-y-8">
              {/* Paddle & Ball Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* <div className="flex items-center justify-center gap-4 mb-4">
                    <NextImage src={PaddleLogo} alt="Paddle logo" className="h-8 w-auto" />
                    <NextImage src={PaddleColor} alt="Choose Paddle color" className="h-8 w-auto" />
                  </div> */}
                  <PadList
                    pads={Pad}
                    onSelect={setCustomPaddleColor}
                    selectedColor={customPaddleColor}
                  />
                </div>

                <div className="space-y-2">
                  <MaxScoreList
                    maxScore={ScoreList}
                    onSelect={setMaxScore}
                    selectedScore={maxScore}
                  />
                </div>
                <Balls
                  balls={BallsList}
                  onSelect={setBallImg}
                  selectedBall={ballImg}
                />
                <BgTable
                  table={Table}
                  onSelect={setTableImg}
                  selectedTable={tableImg}
                />
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <MiniPong
                  paddleColor={customPaddleColor}
                  tableUrl={tableImg}
                  ballUrl={ballImg}
                />

                {/* Settings Summary */}
                <div className="mt-6 p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                  <h3 className="text-white font-semibold mb-3">
                    Current Settings
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/80">
                      <span>Paddle Color:</span>
                      <span
                        className="capitalize font-bold"
                        style={{ color: customPaddleColor }}
                      >
                        {customPaddleColor}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Max Score:</span>
                      <span className="font-bold">{maxScore} Points</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Table:</span>
                      <span className="font-bold">
                        {Table.find((t) => t.imgSrc === tableImg)?.name ||
                          "Custom"}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Ball:</span>
                      <span className="font-bold">
                        {BallsList.find((b) => b.ballImg === ballImg)?.name ||
                          "Custom"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleStart}
                      className="flex-1 bg-gradient-to-r from-yellow-600 to-pink-500 hover:from-yellow-600 hover:to-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Start Game
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
</div>
  );
}


