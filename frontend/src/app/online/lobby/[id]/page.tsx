"use client"

import { useEffect, useRef, useState } from "react"
import React from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/GameContext"
import { useSocket } from "@/contexts/SocketContext"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { Crown, Users, Check, Clock, Copy } from "lucide-react"
import { useLoggedUserName } from "@/contexts/LoggedUserNameContext";

export default function LobbyPage({ params }: { params: { id: string } }) {

  const { state, joinLobby, leaveLobby, toggleReady, startGame } = useGame()
  const { socket } = useSocket()
  const router = useRouter()
  const gameId = params.id
  const [copied, setCopied] = useState(false)
  const [animatingPlayers, setAnimatingPlayers] = useState<Set<string>>(new Set())

  const joinedRef = useRef(false); // to track if user has joined the lobby
  const {loggedUserName, setLoggedUserName} = useLoggedUserName();
  useEffect(() => {
    // mark as joined when lobby state is ready
    if (state.lobby && state.lobby.gameId === gameId) {
      joinedRef.current = true;
    }
  }, [state.lobby, gameId]);
  
  useEffect(() => {
    
    
    // leave lobby on unmount / page navigation
    return () => {
      const currentPath = window.location.pathname;
      // // only leave if navigating away from this lobby AND not going to the game
      if (joinedRef.current && currentPath !== `/online/lobby/${gameId}` && !currentPath.startsWith(`/game/${gameId}`)) {
        leaveLobby(gameId);
      }
      joinedRef.current = false; // reset joined status
    };
}, [gameId, leaveLobby]);

useEffect(() => {
  if (state.lobby === null) {
    router.push("/")
  }
}, [state.lobby])

useEffect(() => {
  if (state.gameStarted && state.lobby) {
    router.push(`/game/${state.lobby.gameId}`);
    const userlog = "zech-chi";
    setLoggedUserName(userlog);
    if (!loggedUserName)
        console.log("user empty")
  }
}, [state.gameStarted, state.lobby, router]);



  const handleReady = () => {
    if (!state.lobby || !socket) return
    const currentPlayer = state.lobby.players.find((p) =>p.id === socket.id)
  if (!currentPlayer || currentPlayer.isReady) return  
    setAnimatingPlayers((prev) => new Set(prev).add(currentPlayer.id))

    setTimeout(() => {
      setAnimatingPlayers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(currentPlayer.id)
        return newSet
      })
    }, 600)

    toggleReady(gameId, currentPlayer.userName)
  }

  const handleStartGame = () => {
    if (!state.lobby) return
    if (!state.lobby.gameId)
    {
      alert("not ready to start")
      return
    }
    startGame(state.lobby.gameId)
  }

  const handleLeave = () => {
    if (!state.lobby) return
    leaveLobby(state.lobby.gameId)
    //need to notify user if they are host and leaving
    //nedd to remove lobby from game state and backend


    router.push("/online")
    
  }

  const handleCopyGameId = async () => {
    try {
      await navigator.clipboard.writeText(gameId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy game ID:", err)
    }
  }

  if (!state.lobby) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600">Loading lobby...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const isHost = state.lobby.hostId === socket?.id
  const allReady = state.lobby.players.every((p) => p.isReady)
  const readyCount = state.lobby.players.filter((p) => p.isReady).length
  console.log("isHost:", isHost);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card title="Game Lobby" className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Game Lobby</h1>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-sm">Game ID:</span>
              <button
                onClick={handleCopyGameId}
                className="flex items-center gap-1 font-mono text-lg bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors cursor-pointer"
                title="Click to copy Game ID"
              >
                {gameId}
                <Copy className="h-4 w-4" />
              </button>
              {copied && <span className="text-green-600 text-sm font-medium">Copied!</span>}
            </div>
            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {state.lobby.players.length} {state.lobby.players.length === 1 ? "Player" : "Players"}
            </span>
          </div>
        </Card>

        <Card
          title="Connected Players"
          actions={
            <span
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                allReady ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
              }`}
            >
              {readyCount}/{state.lobby.players.length} Ready
            </span>
          }
        >
          <div className="space-y-3">
            {state.lobby.players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-all duration-300 ${
                  animatingPlayers.has(player.id) ? "scale-105 shadow-lg" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center transition-all duration-300 ${
                      player.isReady ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    <span
                      className={`font-semibold transition-colors duration-300 ${
                        player.isReady ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      {player.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{player.userName}</span>
                      {state.lobby && player.id === state.lobby.hostId && <Crown className="h-4 w-4 text-yellow-500" />}
                    </div>
                    {state.lobby && player.id === state.lobby.hostId && <span className="text-xs text-gray-500">Host</span>}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all duration-500 transform ${
                    player.isReady ? "bg-green-100 text-green-800 scale-110" : "bg-gray-200 text-gray-700"
                  } ${animatingPlayers.has(player.id) ? "animate-pulse" : ""}`}
                >
                  {player.isReady ? (
                    <>
                      <Check className="h-3 w-3 animate-bounce" />
                      Ready
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      Waiting
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <div className="w-full">
              <Button onClick={handleReady} > { state.lobby.players.find((p) => p.id === socket?.id)?.isReady ? "✓ You are Ready!" : "Mark as Ready" }</Button>
            </div>

            {isHost && (
  <div className="w-full">
    <Button onClick={allReady && state.lobby.players.length >= 2 ? handleStartGame : undefined} >
      {
        allReady && state.lobby.players.length >= 2
          ? "▶ Start Game"
          : `Waiting for ${
              state.lobby.players.length < 2
                ? "at least 2 players"
                : state.lobby.players.length - readyCount + " more players"
            }`
      } </Button>
  </div>
)}


            <div className="w-full">
              <Button onClick={handleLeave} > ← Leave Lobby</Button>
            </div>
          </div>
        </Card>

        {!allReady && (
          <Card className="border-dashed border-2 border-gray-300 transition-all duration-300">
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {isHost
                  ? "Waiting for all players to be ready before you can start the game"
                  : "Mark yourself as ready when you're prepared to play"}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}