"use client";

import React, { useState, useRef, useEffect } from "react";
import Paddle from "./Paddle";

const width = 900;
const height = 600;

// // Enhanced clipped circle image function
// function drawClippedCircleImage(
//   ctx: CanvasRenderingContext2D,
//   img: HTMLImageElement,
//   cx: number,
//   cy: number,
//   r: number
// ) {
//   ctx.save();
//   ctx.beginPath();
//   ctx.arc(cx, cy, r, 0, Math.PI * 2);
//   ctx.closePath();
//   ctx.clip();

//   ctx.imageSmoothingEnabled = true;
//   ctx.imageSmoothingQuality = "high";

//   ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
//   ctx.restore();
// }

// type BallType = {
//   x: number;
//   y: number;
//   radius: number;
//   speedX: number;
//   speedY: number;
//   speed: number;
//   draw: (ctx: CanvasRenderingContext2D) => void;
//   updatePosition: () => void;
//   checkGoal: () => void;
//   checkWallCollision: () => void;
//   checkPaddleCollision: (leftPaddle: Paddle, rightPaddle: Paddle) => void;
//   reset: () => void;
// };
// export function PingPongCanvas({
//   paddleColor,
//   tableUrl,
//   ballUrl,
// }: {
//   paddleColor: string;
//   tableUrl: string;
//   ballUrl: string;
// }) {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const bgImgRef = useRef<HTMLImageElement | null>(null);
//   const ballImgRef = useRef<HTMLImageElement | null>(null);
//   const colorRef = useRef<string>(paddleColor);

//   // Game state with enhanced physics
//   const gameStateRef = useRef({
//     ball: {
//       x: 400,
//       y: 300,
//       dx: 4,
//       dy: 3,
//       radius: 12,
//       trail: [] as { x: number; y: number; alpha: number }[],
//     },
//     leftPaddle: { x: 20, y: 250, width: 15, height: 100, targetY: 250 },
//     rightPaddle: { x: 765, y: 250, width: 15, height: 100, targetY: 250 },
//     particles: [] as {
//       x: number;
//       y: number;
//       vx: number;
//       vy: number;
//       life: number;
//     }[],
//   });

//   // const [paddleColor, changePaddle] = useState("red");

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     colorRef.current = paddleColor;

//     if (!canvas) return;

//     const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;

//     if (!ctx) {
//       console.log("CANVAS PROBLEM");
//       return;
//     }

//     const imgtable = new window.Image();
//     imgtable.src = tableUrl;
//     imgtable.onload = () => {
//       bgImgRef.current = imgtable;
//     };
//     const img = new window.Image();
//     img.src = ballUrl;
//     img.onload = () => {
//       ballImgRef.current = img;
//     };
//     img.onerror = () => {
//       console.warn("Failed to load ball image:", ballUrl);
//       ballImgRef.current = null;
//     };
//     let leftScore = 0;
//     let rightScore = 0;
//     let isPaused = true;

//     canvas.width = width;
//     canvas.height = height;

//     const leftPaddle = new Paddle(0, 200, 15, 200, 10, paddleColor, false);
//     const rightPaddle = new Paddle(885, 200, 15, 200, 10, paddleColor, true);

//     const ball: BallType = {
//       x: width / 2,
//       y: height / 2,
//       radius: 10,
//       speed: 6,
//       speedX: 6,
//       speedY: 6,

//       draw(ctx) {
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//         ctx.fillStyle = "yellow";
//         ctx.fill();
//       },

//       updatePosition() {
//         this.x += this.speedX;
//         this.y += this.speedY;
//       },

//       checkWallCollision() {
//         if (this.y - this.radius <= 0 || this.y + this.radius >= height) {
//           this.speedY *= -1;
//         }
//       },

//       checkPaddleCollision(leftPaddle: Paddle, rightPaddle: Paddle) {
//         // Collision avec paddle gauche
//         if (
//           this.x - this.radius <= leftPaddle.x + leftPaddle.width &&
//           this.y >= leftPaddle.y &&
//           this.y <= leftPaddle.y + leftPaddle.height
//         ) {
//           this.speedX *= -1;
//           this.x = leftPaddle.x + leftPaddle.width + this.radius; // éviter que la balle reste collée
//         }
//         // Collision avec paddle droite
//         if (
//           this.x + this.radius >= rightPaddle.x &&
//           this.y >= rightPaddle.y &&
//           this.y <= rightPaddle.y + rightPaddle.height
//         ) {
//           this.speedX *= -1;
//           this.x = rightPaddle.x - this.radius; // éviter que la balle reste collée
//         }
//       },

//       reset() {
//         this.x = width / 2;
//         this.y = height / 2;
//         this.speedX = this.speed * (Math.random() < 0.5 ? -1 : 1);
//         this.speedY = this.speed * (Math.random() < 0.5 ? -1 : 1);
//       },
//       checkGoal() {
//         if (this.x + this.radius < 0) {
//           // Ball went out left
//           rightScore++;
//           this.reset();
//           isPaused = true;
//         }

//         if (this.x - this.radius > width) {
//           // Ball went out right
//           leftScore++;
//           this.reset();
//           isPaused = true;
//         }
//       },
//     };

//     ball.reset();

//     ctx.fillStyle = "rgba(0, 0, 0, 1)";
//     ctx.fillRect(0, 0, width, height);

//     leftPaddle.draw(ctx);
//     rightPaddle.draw(ctx);

//     const pressedKeys = {
//       w: false,
//       s: false,
//       ArrowUp: false,
//       ArrowDown: false,
//     };

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "w") pressedKeys.w = true;
//       if (e.key === "s") pressedKeys.s = true;
//       if (e.key === "ArrowDown") pressedKeys.ArrowDown = true;
//       if (e.key === "ArrowUp") pressedKeys.ArrowUp = true;
//       if (e.key === "Enter" && isPaused) {
//         ball.reset();
//         isPaused = false;
//       }
//     };

//     const handleKeyUp = (e: KeyboardEvent) => {
//       if (e.key === "w") pressedKeys.w = false;
//       if (e.key === "s") pressedKeys.s = false;
//       if (e.key === "ArrowDown") pressedKeys.ArrowDown = false;
//       if (e.key === "ArrowUp") pressedKeys.ArrowUp = false;
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     ctx.shadowColor = "#ffffff";
//     ctx.shadowBlur = 10;
//     ctx.strokeStyle = "#fff";
//     ctx.setLineDash([15, 15]);
//     ctx.lineWidth = 3;
//     ctx.beginPath();
//     ctx.moveTo(width / 2, 0);
//     ctx.lineTo(width / 2, height);
//     ctx.stroke();
//     ctx.setLineDash([]);
//     ctx.shadowBlur = 0;

//     if (bgImgRef.current?.complete) {
//       ctx.drawImage(bgImgRef.current, 0, 0, width, height);
//     } else {
//       const gradient = ctx.createLinearGradient(0, 0, width, height);
//       gradient.addColorStop(0, "#1a1a2e");
//       gradient.addColorStop(1, "#0f0f23");
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, width, height);
//     }

//     // ball.draw(ctx);
//     // Ball
//     const ballImg = ballImgRef.current;
//     const r = ball.radius;

//     ctx.shadowColor = "#ffffff";
//     ctx.shadowBlur = 20;

//     if (ballImg?.complete) {
//       drawClippedCircleImage(ctx, ballImg, ball.x, ball.y, r);
//     } else {
//       ctx.fillStyle = "#fff";
//       ctx.beginPath();
//       ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2);
//       ctx.fill();
//     }

//     /* GAME LOOP() */

//     const loop = () => {

//       // Effacer le canvas
//       ctx.clearRect(0, 0, width, height);
//       ctx.fillStyle = "rgba(0, 0, 0,0.5)";
//       ctx.fillRect(0, 0, width, height);
//       if (pressedKeys.w) leftPaddle.moveUp();
//       if (pressedKeys.s) leftPaddle.moveDown(height);
//       if (pressedKeys.ArrowUp) rightPaddle.moveUp();
//       if (pressedKeys.ArrowDown) rightPaddle.moveDown(height);
//       // supprime les pixels de l'image précédente
//       if (!isPaused) {
//         ball.updatePosition();
//         ball.checkWallCollision();
//         ball.checkPaddleCollision(leftPaddle, rightPaddle);
//         ball.checkGoal(); // 👈 nouvelle méthode
//       }

//       /*TABLE COLOR */
//       if (bgImgRef.current?.complete) {
//         ctx.drawImage(bgImgRef.current, 0, 0, width, height);
//       } else {
//         const gradient = ctx.createLinearGradient(0, 0, width, height);
//         gradient.addColorStop(0, "#1a1a2e");
//         gradient.addColorStop(1, "#0f0f23");
//         ctx.fillStyle = gradient;
//         ctx.fillRect(0, 0, width, height);
//       }
//       /////////////////////////////

//       // Center line with glow effect
//       ctx.shadowColor = "#ffffff";
//       ctx.shadowBlur = 10;
//       ctx.strokeStyle = "#fff";
//       ctx.setLineDash([15, 15]);
//       ctx.lineWidth = 3;
//       ctx.beginPath();
//       ctx.moveTo(width / 2, 0);
//       ctx.lineTo(width / 2, height);
//       ctx.stroke();
//       ctx.setLineDash([]);
//       ctx.shadowBlur = 0;
//       //////////////////////////
//       // Ball trail
//       const state = gameStateRef.current;

//       state.ball.trail.forEach((point, index) => {
//         if (point.alpha <= 0) return;
//         ctx.fillStyle = `rgba(255, 255, 255, ${point.alpha * 0.5})`;
//         ctx.beginPath();
//         ctx.arc(
//           point.x,
//           point.y,
//           state.ball.radius * (point.alpha * 0.8),
//           0,
//           Math.PI * 2
//         );
//         ctx.fill();
//       });

//       if (ballImg?.complete) {
//         drawClippedCircleImage(ctx, ballImg, ball.x, ball.y, r);
//       } else {
//         ctx.fillStyle = "#fff";
//         ctx.beginPath();
//         ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2);
//         ctx.fill();
//       }
//       ctx.shadowColor = "#ffffff";
//       ctx.shadowBlur = 20;

//       leftPaddle.draw(ctx);
//       rightPaddle.draw(ctx);

//       ctx.shadowBlur = 0;

//       ctx.fillStyle = "#ffffff";
//       ctx.font = "30px Arial";
//       ctx.fillText(String(leftScore), 300, 50);
//       ctx.fillText(String(rightScore), 600, 50);

//       // Redessiner la raquette

//       requestAnimationFrame(loop);
//     };

//     loop();

//     // Nettoyer les listeners clavier
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   });
//   return (
//     <>
//       {/* <div className="flex items-center justify-center h-screen " > */}

//       <div className="flex items-center justify-center h-screen">
//         <canvas ref={canvasRef} className="rounded-md shadow-lg " />
//       </div>
//     </>
//   );
// }

// export default PingPongCanvas;

function Hello() {
  return (
    <>
      <div className="h-[20%] w-[20%] bg-amber-300 rounded-2xl">
        <h1>PLAYER X WIN</h1>
      </div>
    </>
  );
}
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

  useEffect(() => {
    const canvas = canvasRef.current;
    colorRef.current = paddleColor;

    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;

    if (!ctx) {
      console.log("CANVAS PROBLEM");
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

    let leftScore = 0;
    let rightScore = 0;
    let isPaused = true;

    canvas.width = width;
    canvas.height = height;

    const leftPaddle = new Paddle(0, 200, 15, 200, 10, paddleColor, false);
    const rightPaddle = new Paddle(885, 200, 15, 200, 10, paddleColor, true);

    const ball: BallType = {
      x: width / 2,
      y: height / 2,
      radius: 10,
      speed: 6,
      speedX: 6,
      speedY: 6,
      trail: [], // Initialize trail array

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
        this.updateTrail(); // Update trail after position change
      },

      updateTrail() {
        // Add current position to trail
        this.trail.push({
          x: this.x,
          y: this.y,
          alpha: 1.0,
          size: this.radius,
        });

        // Update existing trail points
        for (let i = this.trail.length - 1; i >= 0; i--) {
          const point = this.trail[i];
          point.alpha -= 0.08; // Fade speed
          point.size *= 0.95; // Shrink speed

          // Remove faded points
          if (point.alpha <= 0) {
            this.trail.splice(i, 1);
          }
        }

        // Limit trail length for performance
        const maxTrailLength = 15;
        if (this.trail.length > maxTrailLength) {
          this.trail = this.trail.slice(-maxTrailLength);
        }
      },

      drawTrail(ctx) {
        // Draw trail points from oldest to newest
        this.trail.forEach((point, index) => {
          if (point.alpha <= 0) return;

          ctx.save();

          // Create gradient for each trail point
          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            point.size
          );

          // Use white with varying opacity, or match ball color
          const ballImg = ballImgRef.current;
          if (ballImg?.complete) {
            // For image balls, use white trail
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
            // For solid color balls, use colored trail
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

          // Add burst effect on wall collision
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
        // Collision avec paddle gauche
        if (
          this.x - this.radius <= leftPaddle.x + leftPaddle.width &&
          this.y >= leftPaddle.y &&
          this.y <= leftPaddle.y + leftPaddle.height &&
          this.speedX < 0 // Only if moving towards paddle
        ) {
          this.speedX *= -1;
          this.x = leftPaddle.x + leftPaddle.width + this.radius;

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
          rightScore++;

          this.reset();
          isPaused = true;
        }

        if (this.x - this.radius > width) {
          leftScore++;
          this.reset();
          isPaused = true;
        }
        let score = +maxScore;
        if (rightScore >= 5) setWinner("right");
        else if (leftScore >= 5) setWinner("left");
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

      // Draw scores
      ctx.fillStyle = "#ffffff";
      ctx.font = "30px Arial";
      ctx.fillText(String(leftScore), 300, 50);
      ctx.fillText(String(rightScore), 600, 50);

      requestAnimationFrame(loop);
    };

    loop();

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  return (
    <div className="w-full max-w-2xl">
      <div className="p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={900}
            height={800}
            className="w-full h-full rounded-lg shadow-2xl bg-black border-2 border-white/20"
            style={{ aspectRatio: "4 / 3", maxHeight: "450px" }}
          />
        <WinnerModal
        winner={winner}
        // onClose={() => setWinner( )}
      />
        </div>
      </div>
    </div>
  );
  // Winner Modal Component
  function WinnerModal({ winner}:{winner :string}) {
    if (!winner) return null;

    return (
      <div className="fixed inset-0 rounded-2xl flex items-center justify-center">
        <div className="bg-balck/60 p-8 rounded-lg shadow-xl text-center max-w-md ">
          <h2 className="text-xl font-bold mb-4 text-black">
            {winner === "left" ? "PLAYER 1" : "PLAYER 2"} Wins!
          </h2>
          <p className="text-pink-600 mb-6">Congratulations on your victory!</p>
          <div className="space-x-3">
            <button
              // onClick={onClose}
              className="px-6  rounded-2xl py-2 font-bold bg-gradient-to-r from-yellow-600 to-pink-500 hover:from-yellow-600 hover:to-violet-700"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

}

export default PingPongCanvas;
