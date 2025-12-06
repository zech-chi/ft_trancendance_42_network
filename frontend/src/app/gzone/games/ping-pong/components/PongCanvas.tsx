"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Paddle from "./Paddle";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const width = 1200;
const height = 800;

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

type TrailPoint = {
  x: number;
  y: number;
  alpha: number;
  size: number;
};

type BallType = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  speed: number;
  trail: TrailPoint[];
  draw: (ctx: CanvasRenderingContext2D) => void;
  updatePosition: () => void;
  updateTrail: () => void;
  drawTrail: (ctx: CanvasRenderingContext2D) => void;
  checkGoal: () => void;
  checkWallCollision: () => void;
  checkPaddleCollision: (leftPaddle: Paddle, rightPaddle: Paddle) => void;
  reset: () => void;
};

export function PingPongCanvas({
  paddleColor,
  tableUrl,
  ballUrl,
  maxScore,
}: {
  paddleColor: string;
  tableUrl: string;
  ballUrl: string;
  maxScore: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const ballImgRef = useRef<HTMLImageElement | null>(null);
  const colorRef = useRef<string>(paddleColor);
  const [winner, setWinner] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    colorRef.current = paddleColor;

    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;

    if (!ctx) {
      //console.log("CANVAS PROBLEM");
      return;
    }

    const imgtable = new window.Image();
    imgtable.src = tableUrl;
    imgtable.onload = () => {
      bgImgRef.current = imgtable;
    };

    const img = new window.Image();
    img.src = ballUrl;
    img.onload = () => {
      ballImgRef.current = img;
    };
    img.onerror = () => {
      console.warn("Failed to load ball image:", ballUrl);
      ballImgRef.current = null;
    };

    let localLeftScore = leftScore;
    let localRightScore = rightScore;
    let isPaused = true;

    canvas.width = width;
    canvas.height = height;

    const leftPaddle = new Paddle(0, 300, 20, 200, 20, paddleColor, false);
    const rightPaddle = new Paddle(1180, 300, 20, 200, 20, paddleColor, true);

    const ball: BallType = {
      x: width / 2,
      y: height / 2,
      radius: 15,
      speed: 15,
      speedX: 15,
      speedY: 15,
      trail: [],

      draw(ctx) {
        const ballImg = ballImgRef.current;
        const r = this.radius;

        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 20;

        if (ballImg?.complete) {
          drawClippedCircleImage(ctx, ballImg, this.x, this.y, r);
        } else {
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
      },

      updatePosition() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.updateTrail();
      },

      updateTrail() {
        this.trail.push({
          x: this.x,
          y: this.y,
          alpha: 1.0,
          size: this.radius,
        });

        for (let i = this.trail.length - 1; i >= 0; i--) {
          const point = this.trail[i];
          point.alpha -= 0.08;
          point.size *= 0.95;

          if (point.alpha <= 0) {
            this.trail.splice(i, 1);
          }
        }

        const maxTrailLength = 15;
        if (this.trail.length > maxTrailLength) {
          this.trail = this.trail.slice(-maxTrailLength);
        }
      },

      drawTrail(ctx) {
        this.trail.forEach((point) => {
          if (point.alpha <= 0) return;

          ctx.save();

          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            point.size
          );

          const ballImg = ballImgRef.current;
          if (ballImg?.complete) {
            gradient.addColorStop(
              0,
              `rgba(255, 255, 255, ${point.alpha * 0.8})`
            );
            gradient.addColorStop(
              0.5,
              `rgba(255, 255, 255, ${point.alpha * 0.4})`
            );
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
          } else {
            gradient.addColorStop(0, `rgba(255, 255, 0, ${point.alpha * 0.8})`);
            gradient.addColorStop(
              0.5,
              `rgba(255, 255, 0, ${point.alpha * 0.4})`
            );
            gradient.addColorStop(1, `rgba(255, 255, 0, 0)`);
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size * 0.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      },

      checkWallCollision() {
        if (this.y - this.radius <= 0 || this.y + this.radius >= height) {
          this.speedY *= -1;

          for (let i = 0; i < 5; i++) {
            this.trail.push({
              x: this.x + (Math.random() - 0.5) * 20,
              y: this.y + (Math.random() - 0.5) * 20,
              alpha: 0.8,
              size: this.radius * 0.5,
            });
          }
        }
      },

      checkPaddleCollision(leftPaddle: Paddle, rightPaddle: Paddle) {
        if (
          this.x - this.radius <= leftPaddle.x + leftPaddle.width &&
          this.y >= leftPaddle.y &&
          this.y <= leftPaddle.y + leftPaddle.height &&
          this.speedX < 0
        ) {
          this.speedX *= -1;
          this.x = leftPaddle.x + leftPaddle.width + this.radius;

          for (let i = 0; i < 8; i++) {
            this.trail.push({
              x: this.x + (Math.random() - 0.5) * 30,
              y: this.y + (Math.random() - 0.5) * 30,
              alpha: 1.0,
              size: this.radius * (0.3 + Math.random() * 0.4),
            });
          }
        }

        // Collision avec paddle droite
        if (
          this.x + this.radius >= rightPaddle.x &&
          this.y >= rightPaddle.y &&
          this.y <= rightPaddle.y + rightPaddle.height &&
          this.speedX > 0 // Only if moving towards paddle
        ) {
          this.speedX *= -1;
          this.x = rightPaddle.x - this.radius;

          // Add collision effect
          for (let i = 0; i < 8; i++) {
            this.trail.push({
              x: this.x + (Math.random() - 0.5) * 30,
              y: this.y + (Math.random() - 0.5) * 30,
              alpha: 1.0,
              size: this.radius * (0.3 + Math.random() * 0.4),
            });
          }
        }
      },

      reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.speedX = this.speed * (Math.random() < 0.5 ? -1 : 1);
        this.speedY = this.speed * (Math.random() < 0.5 ? -1 : 1);
        this.trail = []; // Clear trail on reset
      },

      checkGoal() {
        if (this.x + this.radius < 0) {
          localRightScore++;
          setRightScore(localRightScore);
          this.reset();
          isPaused = true;
        }

        if (this.x - this.radius > width) {
          localLeftScore++;
          setLeftScore(localLeftScore);
          this.reset();
          isPaused = true;
        }
        
        const score = +maxScore;
        if (localRightScore >= score) setWinner("right");
        else if (localLeftScore >= score) setWinner("left");
      },
    };

    ball.reset();

    // Initial canvas setup
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, width, height);

    leftPaddle.draw(ctx);
    rightPaddle.draw(ctx);

    const pressedKeys = {
      w: false,
      s: false,
      ArrowUp: false,
      ArrowDown: false,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w") pressedKeys.w = true;
      if (e.key === "s") pressedKeys.s = true;
      if (e.key === "ArrowDown") pressedKeys.ArrowDown = true;
      if (e.key === "ArrowUp") pressedKeys.ArrowUp = true;
      if (e.key === "Enter" && isPaused) {
        ball.reset();
        isPaused = false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w") pressedKeys.w = false;
      if (e.key === "s") pressedKeys.s = false;
      if (e.key === "ArrowDown") pressedKeys.ArrowDown = false;
      if (e.key === "ArrowUp") pressedKeys.ArrowUp = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Game Loop
    const loop = () => {
      // Clear canvas with slight transparency for motion blur effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Semi-transparent black
      ctx.fillRect(0, 0, width, height);

      // Handle input
      if (pressedKeys.w) leftPaddle.moveUp();
      if (pressedKeys.s) leftPaddle.moveDown(height);
      if (pressedKeys.ArrowUp) rightPaddle.moveUp();
      if (pressedKeys.ArrowDown) rightPaddle.moveDown(height);

      // Update ball if not paused
      if (!isPaused) {
        ball.updatePosition();
        ball.checkWallCollision();
        ball.checkPaddleCollision(leftPaddle, rightPaddle);
        ball.checkGoal();
      }

      // Draw background
      if (bgImgRef.current?.complete) {
        ctx.globalAlpha = 0.9; // Slight transparency for trail effect
        ctx.drawImage(bgImgRef.current, 0, 0, width, height);
        ctx.globalAlpha = 1.0;
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#1a1a2e");
        gradient.addColorStop(1, "#0f0f23");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw center line with glow effect
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#fff";
      ctx.setLineDash([15, 15]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Draw ball trail BEFORE drawing the ball
      ball.drawTrail(ctx);

      // Draw ball
      ball.draw(ctx);

      // Draw paddles
      leftPaddle.draw(ctx);
      rightPaddle.draw(ctx);

      requestAnimationFrame(loop);
    };

    loop();

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, paddleColor, tableUrl, ballUrl, maxScore, leftScore, rightScore]);

  const handleStartGame = useCallback(() => {
    if (player1Name.trim() && player2Name.trim()) {
      setGameStarted(true);
    }
  }, [player1Name, player2Name]);

  if (!gameStarted) {
    return (
      <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
        <Sidebar />
        {/* <Navbar /> */}
        {/* <main
          className="flex flex-row items-center justify-center relative overflow-x-hidden
                    xl:pl-20 2xl:pl-24 w-full
                    h-[calc(100%-130px)]
                    xl:h-[calc(100%-75px)]
                    2xl:h-[calc(100%-85px)]
                    2xl:mt-[67px] xl:mt-[60px] overflow-y-hidden"
        > */}
          <PlayerNamesInput
            player1Name={player1Name}
            player2Name={player2Name}
            setPlayer1Name={setPlayer1Name}
            setPlayer2Name={setPlayer2Name}
            maxScore={maxScore}
            onStartGame={handleStartGame}
          />
        {/* </main> */}
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
      <Sidebar />
      {/* <Navbar /> */}
      {/* <main
        className="flex flex-row items-center justify-center relative overflow-x-hidden
                  xl:pl-20 2xl:pl-24 w-full
                  h-[calc(100%-130px)]
                  xl:h-[calc(100%-75px)]
                  2xl:h-[calc(100%-85px)]
                  2xl:mt-[67px] xl:mt-[60px] overflow-y-auto"
      > */}
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="p-4 md:p-6 lg:p-8 bg-black/60 backdrop-blur-sm rounded-2xl shadow-2xl">
            <Scoreboard />
            
            <div className="relative mt-6">
              <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg shadow-2xl bg-black border-2 border-white/20"
                style={{ aspectRatio: "3 / 2", maxHeight: "800px" }}
              />
              <WinnerModal winner={winner} />
            </div>
          </div>
        </div>
      {/* </main> */}
    </div>
  );

  function Scoreboard() {
    return (
      <div className="relative bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-md border-2 border-white/30 rounded-2xl p-4 md:p-6 shadow-2xl">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-left">
            <div className="text-[#FFB700] font-bold text-sm md:text-base mb-1 uppercase tracking-wider">
              {player1Name}
            </div>
            <div className="text-4xl md:text-6xl font-bold text-white">
              {leftScore}
            </div>
            <div className="text-white/60 text-xs md:text-sm mt-1">Left Paddle</div>
          </div>

          <div className="text-center">
            <div className="text-white/40 text-xs md:text-sm mb-1">SCORE</div>
            <div className="text-4xl md:text-3xl font-bold text-white bg-clip-text bg-gradient-to-r from-yellow-400 to-white/30">
              VS
            </div>
            <div className="text-white/40 text-xs md:text-sm mt-1">
              First to {maxScore} {parseInt(maxScore) === 1 ? 'win' : 'wins'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[#1CBABA] font-bold text-sm md:text-base mb-1 uppercase tracking-wider">
              {player2Name}
            </div>
            <div className="text-4xl md:text-6xl font-bold text-white">
              {rightScore}
            </div>
            <div className="text-white/60 text-xs md:text-sm mt-1">Right Paddle</div>
          </div>
        </div>
      </div>
    );
  }

  function WinnerModal({ winner }: { winner: string }) {
    if (!winner) return null;

    const winnerName = winner === "left" ? player1Name : player2Name;
    const winnerColor = winner === "left" ? "yellow" : "pink";

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-[#1CBABA] p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-2xl mx-4">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className={`text-4xl md:text-6xl font-bold mb-4 ${
              winnerColor === "yellow" ? "text-[#FFB700]" : "text-[#1CBABA]"
            } animate-pulse`}>
              {winnerName} Wins!
            </h2>
            <p className="text-white/80 mb-2 text-xl">Congratulations on your victory!</p>
            <div className="text-white/60 text-lg">
              Final Score: <span className="text-[#FFB700] font-bold">{leftScore}</span> - <span className="text-[#1CBABA] font-bold">{rightScore}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setLeftScore(0);
                setRightScore(0);
                setWinner("");
                setGameStarted(true);
              }}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-[#1CBABA] hover:from-yellow-500 hover:to-[#1CBABA] text-black transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                setLeftScore(0);
                setRightScore(0);
                setWinner("");
                setGameStarted(false);
                setPlayer1Name("");
                setPlayer2Name("");
              }}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Change Players
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function PlayerNamesInput({
  player1Name,
  player2Name,
  setPlayer1Name,
  setPlayer2Name,
  maxScore,
  onStartGame,
}: {
  player1Name: string;
  player2Name: string;
  setPlayer1Name: (name: string) => void;
  setPlayer2Name: (name: string) => void;
  maxScore: string;
  onStartGame: () => void;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/30 p-6 md:p-8 lg:p-10 xl:p-12 rounded-3xl shadow-2xl w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
        <div className="text-center mb-6 md:mb-8 lg:mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1CBABA] to-white/30 mb-3">
            Pong Zone
          </h1>
          <p className="text-white/80 text-lg md:text-xl lg:text-2xl">Enter player names to begin</p>
        </div>

        <div className="space-y-5 md:space-y-6 lg:space-y-7">
          <div className="relative">
            <label className="block text-[#FFB700] font-bold mb-3 text-lg md:text-xl lg:text-2xl">
              Player 1 (Left Paddle)
            </label>
            <div className="relative">
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Enter Player 1 name"
                maxLength={15}
                autoComplete="off"
                className="w-full px-5 md:px-7 lg:px-8 py-4 md:py-5 lg:py-6 bg-black/50 border-2 border-[#FFB700] rounded-xl text-white text-lg md:text-xl lg:text-2xl font-semibold placeholder-white/30 focus:border-[#FFB700] focus:outline-none focus:ring-2 focus:ring-[#FFB700] transition-all"
              />
              <div className="absolute right-4 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 text-[#FFB700] font-bold pointer-events-none text-base md:text-lg lg:text-xl">
                W/S
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-[#1CBABA] font-bold mb-3 text-lg md:text-xl lg:text-2xl">
              Player 2 (Right Paddle)
            </label>
            <div className="relative">
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Enter Player 2 name"
                maxLength={15}
                autoComplete="off"
                className="w-full px-5 md:px-7 lg:px-8 py-4 md:py-5 lg:py-6 bg-black/50 border-2 border-[#1CBABA] rounded-xl text-white text-lg md:text-xl lg:text-2xl font-semibold placeholder-white/30 focus:border-[#1CBABA] focus:outline-none focus:ring-2 focus:ring-[#1CBABA] transition-all"
              />
              <div className="absolute right-4 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 text-[#1CBABA] font-bold pointer-events-none text-base md:text-lg lg:text-xl">
                ↑/↓
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-xl p-4 md:p-5 lg:p-6 text-center">
            <p className="text-white/80 text-sm md:text-base lg:text-lg">
              First to <span className="text-[#FFB700] font-bold text-lg md:text-xl lg:text-2xl">{maxScore}</span> {parseInt(maxScore) === 1 ? 'win' : 'wins'}!
            </p>
            <p className="text-white/60 text-xs md:text-sm lg:text-base mt-2">
              Press <span className="text-white font-bold">ENTER</span> to start each round
            </p>
          </div>

          <button
            onClick={onStartGame}
            disabled={!player1Name.trim() || !player2Name.trim()}
            className={`w-full py-4 md:py-5 lg:py-6 rounded-xl font-bold text-xl md:text-2xl lg:text-3xl transition-all duration-300 transform cursor-pointer ${
              player1Name.trim() && player2Name.trim()
                ? "bg-[#1CBABA] text-white hover:scale-105 shadow-lg hover:shadow-2xl"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {player1Name.trim() && player2Name.trim() ? "Start Game" : "Enter Both Names"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PingPongCanvas;