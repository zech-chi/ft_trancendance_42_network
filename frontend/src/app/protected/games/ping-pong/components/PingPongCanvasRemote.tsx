"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSocket } from "../context/SocketContext";
import { useInvite } from "../context/InviteContext";
import { useRouter } from 'next/navigation';

// Define interfaces for game state
interface Player {
  id: number;
  username: string;
  side: "left" | "right";
  paddleY: number;
  score: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface GameState {
  ball: Ball;
  players: Player[];
}

// Props for the component
interface PingPongCanvasRemoteProps {
  paddleColor: string;
  tableUrl: string;
  ballUrl: string;
  maxScore: string;
  roomId: string;
  userId: number;
}

const PingPongCanvasRemote: React.FC<PingPongCanvasRemoteProps> = ({
  paddleColor,
  tableUrl,
  ballUrl,
  maxScore,
  roomId,
  userId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { socket } = useSocket();
  const { updateInviteStatus } = useInvite();
  const router = useRouter();

  // State variables
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [localPlayer, setLocalPlayer] = useState<Player | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<Player | null>(null);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [winner, setWinner] = useState<Player | null>(null);
  const [endGameReason, setEndGameReason] = useState<string | null>(null);
  
  // Image assets
  const [tableImage, setTableImage] = useState<HTMLImageElement | null>(null);
  const [ballImage, setBallImage] = useState<HTMLImageElement | null>(null);
  
  // Input handling
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [controlMode, setControlMode] = useState<'mouse' | 'keyboard' | 'touch'>('keyboard');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Responsive game dimensions
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Game dimensions
  const width = 800;
  const height = 600;
  const paddleWidth = 10;
  const paddleHeight = 100;
  const ballSize = 10;
  const paddleSpeed = 8;

  // Timestamp for movement throttling (optimized for 120 FPS)
  const lastMoveTime = useRef<number>(0);
  const MOVE_THROTTLE_MS = 8; // 120 FPS for ultra-smooth movement

  // Effect to detect device type and touch capabilities
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const screenWidth = window.innerWidth;
      
      setIsTouchDevice(hasTouch);
      
      // Detect device type based on screen size and touch capability
      if (hasTouch) {
        if (screenWidth <= 640) {
          setDeviceType('mobile');
          setControlMode('touch');
        } else if (screenWidth <= 1024) {
          setDeviceType('tablet');
          setControlMode('touch');
        } else {
          setDeviceType('desktop');
          setControlMode('keyboard');
        }
      } else {
        setDeviceType('desktop');
        setControlMode('keyboard');
      }
      
      // Update container size based on device
      const maxWidth = Math.min(screenWidth - 40, 800);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      const aspectRatio = 800 / 600;
      
      let newWidth = maxWidth;
      let newHeight = newWidth / aspectRatio;
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }
      
      setContainerSize({ width: newWidth, height: newHeight });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', () => {
      setTimeout(detectDevice, 100); // Delay for orientation change
    });

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  // Touch control handlers
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!localPlayer || gameStatus !== 'playing' || controlMode !== 'touch') return;

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // Scale touch coordinates to game coordinates
    const scaleX = rect.width / containerSize.width;
    const scaleY = rect.height / containerSize.height;
    const gameX = touchX / scaleX;
    const gameY = touchY / scaleY;

    const paddleY = localPlayer.paddleY * (containerSize.height / 600);
    const paddleX = localPlayer.side === "left" ? 0 : containerSize.width - (paddleWidth * (containerSize.width / 800));
    const scaledPaddleHeight = paddleHeight * (containerSize.height / 600);

    // Larger touch area for mobile
    const touchArea = deviceType === 'mobile' ? 60 : 40;
    const isNearPaddle =
      (localPlayer.side === "left" && gameX >= paddleX && gameX <= paddleX + touchArea) ||
      (localPlayer.side === "right" && gameX <= paddleX + (paddleWidth * (containerSize.width / 800)) && gameX >= paddleX - touchArea);

    if (isNearPaddle && gameY >= paddleY && gameY <= paddleY + scaledPaddleHeight) {
      setIsDragging(true);
      setLastMouseY(gameY);
    }
  }, [localPlayer, gameStatus, controlMode, containerSize, paddleWidth, paddleHeight, deviceType]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !localPlayer || !socket || gameStatus !== 'playing' || controlMode !== 'touch') return;

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchY = touch.clientY - rect.top;

    // Scale touch coordinates to game coordinates
    const scaleY = rect.height / containerSize.height;
    const gameY = touchY / scaleY;
    const deltaY = gameY - lastMouseY;

    // Convert to game coordinates
    const actualDeltaY = deltaY * (600 / containerSize.height);
    let newPaddleY = localPlayer.paddleY + actualDeltaY;
    newPaddleY = Math.max(0, Math.min(600 - paddleHeight, newPaddleY));

    setLastMouseY(gameY);

    const now = Date.now();
    if (now - lastMoveTime.current >= MOVE_THROTTLE_MS) {
      socket.emit("move_paddle", { 
        roomId, 
        yPosition: newPaddleY,
        timestamp: now
      });
      lastMoveTime.current = now;
    }
    
    setLocalPlayer(prev => prev ? { ...prev, paddleY: newPaddleY } : null);
  }, [isDragging, localPlayer, socket, roomId, lastMouseY, containerSize, paddleHeight, gameStatus, controlMode]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Effect to proactively send 'leave_game' when component unmounts
  useEffect(() => {
    return () => {
      if (socket && gameStatus === 'playing') {
        console.log("📤 Client proactively leaving game room:", roomId);
        socket.emit("leave_game", { roomId });
      }
    };
  }, [socket, roomId, gameStatus]);

  // Effect to load game asset images
  useEffect(() => {
    const loadTableImage = () => {
      const img = new Image();
      img.onload = () => setTableImage(img);
      img.onerror = () => {
        console.warn("Table image failed to load, using default background");
        setTableImage(null);
      };
      img.src = tableUrl;
    };

    const loadBallImage = () => {
      const img = new Image();
      img.onload = () => setBallImage(img);
      img.onerror = () => {
        console.warn("Ball image failed to load, using default ball");
        setBallImage(null);
      };
      img.src = ballUrl;
    };

    loadTableImage();
    loadBallImage();
  }, [tableUrl, ballUrl]);

  // Effect for keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (['arrowup', 'arrowdown', 'w', 's'].includes(key)) {
        keysPressed.current[key] = true;
        e.preventDefault(); 
      }
      if (key === 'm') {
        setControlMode(prev => prev === 'mouse' ? 'keyboard' : 'mouse');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'w', 's'].includes(key)) {
        keysPressed.current[key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse control handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!localPlayer || gameStatus !== 'playing' || controlMode !== 'mouse') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    const paddleY = localPlayer.paddleY;
    const paddleX = localPlayer.side === "left" ? 0 : width - paddleWidth;

    const clickX = e.clientX - rect.left;
    const isNearPaddle =
      (localPlayer.side === "left" && clickX >= paddleX && clickX <= paddleX + paddleWidth + 20) ||
      (localPlayer.side === "right" && clickX <= paddleX + paddleWidth && clickX >= paddleX - 20);

    if (isNearPaddle && mouseY >= paddleY && mouseY <= paddleY + paddleHeight) {
      setIsDragging(true);
      setLastMouseY(mouseY);
    }
  }, [localPlayer, gameStatus, controlMode, width, paddleWidth, paddleHeight]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !localPlayer || !socket || gameStatus !== 'playing' || controlMode !== 'mouse') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const deltaY = mouseY - lastMouseY;

    let newPaddleY = localPlayer.paddleY + deltaY;
    newPaddleY = Math.max(0, Math.min(height - paddleHeight, newPaddleY));

    setLastMouseY(mouseY);

    // Optimized paddle movement with instant local feedback (120 FPS)
    const now = Date.now();
    if (now - lastMoveTime.current >= MOVE_THROTTLE_MS) {
      socket.emit("move_paddle", { 
        roomId, 
        yPosition: newPaddleY,
        timestamp: now
      });
      lastMoveTime.current = now;
    }
    
    // Instant local update for zero perceived lag
    setLocalPlayer(prev => prev ? { ...prev, paddleY: newPaddleY } : null);
  }, [isDragging, localPlayer, socket, roomId, lastMouseY, height, paddleHeight, gameStatus, controlMode]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Toggle control mode function
  const toggleControlMode = useCallback(() => {
    setControlMode(prev => {
      if (isTouchDevice) {
        // On touch devices, cycle between touch and keyboard
        return prev === 'touch' ? 'keyboard' : 'touch';
      } else {
        // On desktop, cycle between keyboard and mouse
        return prev === 'keyboard' ? 'mouse' : 'keyboard';
      }
    });
  }, [isTouchDevice]);

  // UI Actions
  const handleLeaveGame = useCallback(() => {
    if (socket) {
      console.log("🚪 User clicked 'Leave Game'. Emitting leave_game event.");
      socket.emit("leave_game", { roomId });
    }
    // setInviteState(prev => ({ ...prev, [userId]: true })); // Removed - using new invitation system
    router.push('/gameMode');
  }, [socket, roomId, router]);

  const startGameManually = useCallback(() => {
    if (socket) {
      console.log("▶️ User clicked 'Start Game'. Emitting start_game event.");
      socket.emit("start_game", { roomId });
    }
  }, [socket, roomId]);

  // Canvas drawing logic
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw table background
    if (tableImage) {
      ctx.drawImage(tableImage, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(0, 0, width, height);
      
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw players' paddles
    if (gameState?.players) {
      gameState.players.forEach(player => {
        ctx.fillStyle = paddleColor;
        const paddleX = player.side === "left" ? 0 : width - paddleWidth;
        ctx.fillRect(paddleX, player.paddleY, paddleWidth, paddleHeight);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(
          paddleX + (player.side === "left" ? paddleWidth : -2),
          player.paddleY,
          2,
          paddleHeight
        );
      });
    }

    // Draw the ball
    if (gameState?.ball) {
      if (ballImage) {
        ctx.drawImage(
          ballImage,
          gameState.ball.x - ballSize / 2,
          gameState.ball.y - ballSize / 2,
          ballSize,
          ballSize
        );
      } else {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, ballSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw scores with responsive font size
    if (gameState?.players) {
      const fontSize = deviceType === 'mobile' ? 24 : 32;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const leftPlayer = gameState.players.find(p => p.side === "left");
      const rightPlayer = gameState.players.find(p => p.side === "right");
      
      ctx.fillText(leftPlayer?.score.toString() || '0', width / 4, 40);
      ctx.fillText(rightPlayer?.score.toString() || '0', (3 * width) / 4, 40);
    }

    // Display game status messages with responsive sizing
    const statusFontSize = deviceType === 'mobile' ? 16 : 20;
    const overlayWidth = deviceType === 'mobile' ? width * 0.8 : 300;
    const overlayHeight = deviceType === 'mobile' ? 80 : 60;
    
    if (gameStatus === 'waiting') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(width / 2 - overlayWidth / 2, height / 2 - overlayHeight / 2, overlayWidth, overlayHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `${statusFontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for game to start...', width / 2, height / 2);
    }
    else if (gameStatus === 'finished') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#ffffff';
      const titleFontSize = deviceType === 'mobile' ? 24 : 30;
      ctx.font = `${titleFontSize}px Arial`;
      ctx.textAlign = 'center';
      
      if (winner) {
        ctx.fillText(`🎉 ${winner.username} wins!`, width / 2, height / 2 - 20);
        ctx.font = `${statusFontSize}px Arial`;
        ctx.fillText('Game over', width / 2, height / 2 + 20);
      } else if (endGameReason) {
        ctx.fillText('Game Over', width / 2, height / 2 - 20);
        ctx.font = `${statusFontSize}px Arial`;
        ctx.fillText(endGameReason, width / 2, height / 2 + 20);
      } else {
        ctx.fillText('Game Ended', width / 2, height / 2);
      }
    }

    // Display current control mode with responsive font
    const controlFontSize = deviceType === 'mobile' ? 10 : 14;
    ctx.fillStyle = '#ffffff';
    ctx.font = `${controlFontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`Controls: ${controlMode} (Press M to change)`, 10, height - 10);
  }, [tableImage, ballImage, gameState, gameStatus, winner, endGameReason, paddleColor, controlMode, width, height, paddleWidth, paddleHeight, deviceType]);

  // Handle keyboard input in the animation loop
  const gameLoop = useCallback(() => {
    // Handle keyboard input
    if (localPlayer && socket && gameStatus === 'playing' && controlMode === 'keyboard') {
      let newPaddleY = localPlayer.paddleY;
      
      if (keysPressed.current['arrowup'] || keysPressed.current['w']) {
        newPaddleY -= paddleSpeed;
      }
      if (keysPressed.current['arrowdown'] || keysPressed.current['s']) {
        newPaddleY += paddleSpeed;
      }

      newPaddleY = Math.max(0, Math.min(height - paddleHeight, newPaddleY));

      if (newPaddleY !== localPlayer.paddleY) {
        const now = Date.now();
        if (now - lastMoveTime.current >= MOVE_THROTTLE_MS) {
          socket.emit("move_paddle", { 
            roomId, 
            yPosition: newPaddleY,
            timestamp: now
          });
          lastMoveTime.current = now;
        }
        setLocalPlayer(prev => prev ? { ...prev, paddleY: newPaddleY } : null);
      }
    }
    
    // Draw the game state
    draw();
    
    // Continue the animation loop
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [localPlayer, socket, gameStatus, controlMode, roomId, height, paddleHeight, paddleSpeed, draw]);

  // Effect for animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  // Effect for responsive canvas resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      let scale = 1;
      
      if (deviceType === 'mobile') {
        // Mobile: Use almost full screen space
        const mobileScaleX = (screenWidth - 10) / width; // Minimal padding
        const mobileScaleY = (screenHeight - 120) / height; // Space for UI elements
        scale = Math.min(mobileScaleX, mobileScaleY); // Use natural scale, no limit
        scale = Math.max(scale, 0.8); // Minimum scale of 0.8
      } else if (deviceType === 'tablet') {
        // Tablet: Use most of the screen space
        const tabletScaleX = (screenWidth - 20) / width;
        const tabletScaleY = (screenHeight - 100) / height;
        scale = Math.min(tabletScaleX, tabletScaleY);
        scale = Math.max(scale, 1.0); // Minimum scale of 1.0 for tablets
      } else {
        // Desktop: Conservative scaling within container
        const container = canvas.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          const desktopScaleX = (containerWidth - 40) / width;
          const desktopScaleY = (containerHeight - 40) / height;
          scale = Math.min(desktopScaleX, desktopScaleY, 1); // No scaling up on desktop
        }
      }
      
      canvas.style.transform = `scale(${scale})`;
      canvas.style.transformOrigin = 'center center';
      
      console.log(`🎮 Canvas scaled to: ${scale.toFixed(2)}x for ${deviceType} (${screenWidth}x${screenHeight})`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 200); // Delay for orientation change
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [deviceType]);

  // Effect for socket event listeners
  useEffect(() => {
    if (!socket) return;

    console.log("🎮 Attempting to join game room:", roomId);
    // setInviteState(prev => ({ ...prev, [userId]: false })); // Removed - using new invitation system
    socket.emit("join_game_room", { roomId });

    // Socket event handlers
    socket.on("game_state", (state: GameState) => {
      setGameState(state);
      setGameStatus('playing');
      
      if (state.players) {
        const local = state.players.find(p => p.id === userId);
        const opponent = state.players.find(p => p.id !== userId);
        
        if (local) setLocalPlayer(local);
        if (opponent) setOpponentPlayer(opponent);
      }
    });

    socket.on("paddle_moved", (data: { playerId: number; yPosition: number; side: "left" | "right"; authoritative: boolean }) => {
      setGameState(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map(player => 
            player.id === data.playerId 
              ? { ...player, paddleY: data.yPosition }
              : player
          )
        };
      });
      
      if (data.playerId === userId && data.authoritative) {
        setLocalPlayer(prev => prev ? { ...prev, paddleY: data.yPosition } : null);
      }
    });

    socket.on("score_updated", (data: { players: Player[]; scorer: number }) => {
      setGameState(prev => {
        if (!prev) return prev;
        return { ...prev, players: data.players };
      });
      console.log(`Score updated. Scorer ID: ${data.scorer}`);
    });

    socket.on("game_ended", (data: { winner?: Player; finalScore?: Player[]; reason?: string; disconnectedPlayer?: string; leftPlayer?: string ; tournamentId?: string }) => {
      console.log("🛑 Game ended event received:", data);
      setGameStatus('finished');
      
      if (data.winner) {
        setWinner(data.winner);
        setEndGameReason(null);
      } else if (data.reason === "player_disconnected" && data.disconnectedPlayer) {
        setWinner(null); 
        setEndGameReason(`${data.disconnectedPlayer} disconnected. Game Over.`);
      } else if (data.reason === "player_left" && data.leftPlayer) {
        setWinner(null);
        setEndGameReason(`${data.leftPlayer} left the game. Game Over.`);
      } else {
        setWinner(null);
        setEndGameReason("Game ended unexpectedly.");
      }
      
      setTimeout(() => {
        // setInviteState(prev => ({ ...prev, [userId]: true })); // Removed - using new invitation system
        if (data.tournamentId) {
          router.push(`/protected/games/ping-pong/modes/tournament/${data.tournamentId}`);
        } else {
          router.push('/protected/games/ping-pong'); 
        }
      }, 5000);
    });

    // Handle forced leave when opponent leaves
    socket.on("force_leave_game", (data: { reason: string; message: string; timestamp: number }) => {
      console.log("🚨 Force leave game event received:", data);
      console.log("🚨 Current game status:", gameStatus);
      console.log("🚨 Current location:", window.location.pathname);
      
      setGameStatus('finished');
      setWinner(null);
      setEndGameReason(data.message);
      
      // Immediately redirect without delay since opponent left
      console.log("🚨 Redirecting to /gameMode in 2 seconds...");
      setTimeout(() => {
        console.log("🚨 Executing redirect to /gameMode");
        router.push('/gameMode');
      }, 2000); // Shorter delay for force leave
    });

    socket.on("game_error", (error: { message?: string } | string | unknown) => {
      let errorMessage = "Unknown game error";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error && typeof (error as { message?: string }).message === "string") {
        errorMessage = (error as { message: string }).message;
      } else if (error && typeof error === "object") {
        errorMessage = JSON.stringify(error);
      }
      
      console.error("❌ Game error received:", errorMessage);
      setEndGameReason(`Game Error: ${errorMessage}`);
      setGameStatus('finished');
      setTimeout(() => {
        // setInviteState(prev => ({ ...prev, [userId]: true })); // Removed - using new invitation system
        router.push('/gameMode');
      }, 3000);
    });

    socket.on("paddle_move_rejected", (data: { reason: string; current?: number; attempted?: number }) => {
      console.warn("Paddle move rejected by server:", data.reason);
    });

    return () => {
      socket.off("game_state");
      socket.off("paddle_moved");
      socket.off("score_updated");
      socket.off("game_ended");
      socket.off("force_leave_game");
      socket.off("game_error");
      socket.off("paddle_move_rejected");
    };
  }, [socket, roomId, userId, router, gameStatus]); // Added gameStatus dependency

  if (!socket) {
    return (
      <div className="text-white text-center py-20">
        <div className="text-xl">Connecting to game server...</div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center w-full h-full">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border-2 border-gray-600 rounded-lg shadow-xl max-w-full max-h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor: gameStatus === 'playing' && controlMode === 'mouse' ? (isDragging ? 'grabbing' : 'grab') : 'default',
            backgroundColor: '#2c3e50',
            touchAction: 'none' // Prevent scrolling on touch devices
          }}
        />

        {/* Dynamic Instructions */}
        {localPlayer && gameStatus === 'playing' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
            {controlMode === 'keyboard' ? (
              <>Use ↑↓ arrows or W/S keys to move</>
            ) : controlMode === 'touch' ? (
              <>Tap and drag your {localPlayer.side} paddle to move</>
            ) : (
              <>Drag your {localPlayer.side} paddle to move</>
            )}
          </div>
        )}

        {/* Connection Info */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-xs">
          Room: {roomId} | Status: {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}
        </div>

        {/* Control Mode Display & Toggle */}
        <div 
          className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-700" 
          onClick={toggleControlMode}
        >
          Controls: {controlMode} (Click or Press M)
        </div>

        {/* Manual Start Game Button */}
        {gameStatus === 'waiting' && (
          <button
            onClick={startGameManually}
            className="absolute top-12 right-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Start Game
          </button>
        )}

        {/* Leave Game Button */}
        {gameStatus !== 'finished' && (
          <button
            onClick={handleLeaveGame}
            className="absolute top-20 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Leave Game
          </button>
        )}
      </div>
    </div>
  );
};

export default PingPongCanvasRemote;