"use client"

import { useEffect, useRef, useState } from "react"
import React from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/context/parchisiContexts/GameContext"
import { useSocket } from "@/context/parchisiContexts/SocketContext"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { Crown, Users, Check, Clock, Copy } from "lucide-react"
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"

export default function LobbyPage({ params }: { params: Promise<{ id: string }> }) {

  const { state, joinLobby, leaveLobby, toggleReady, startGame } = useGame()
  const { socket } = useSocket()
  const router = useRouter()
  const { id: gameId } = React.use(params)
  const [copied, setCopied] = useState(false)
  const [animatingPlayers, setAnimatingPlayers] = useState<Set<string>>(new Set())
  const joinedRef = useRef(false);
  const { loggedUserName } = useLoggedUserName();

  useEffect(() => {
    if (state.lobby && state.lobby.gameId === gameId) {
      joinedRef.current = true;
    }
  }, [state.lobby, gameId]);

  useEffect(() => {
    return () => {
      const currentPath = window.location.pathname;
      if (
        joinedRef.current &&
        currentPath !== `/protected/games/parchisi/online/lobby/${gameId}` &&
        !currentPath.startsWith(`/protected/games/parchisi/game/${gameId}`)
      ) {
        leaveLobby(gameId);
      }
      joinedRef.current = false;
    };
  }, [gameId, leaveLobby]);

  useEffect(() => {
    if (state.lobby === null) {
      router.push("/protected/games/parchisi/")
    }
  }, [state.lobby])

  useEffect(() => {
    if (state.gameStarted && state.lobby) {
      router.push(`/protected/games/parchisi/game/${state.lobby.gameId}`);
    }
  }, [state.gameStarted, state.lobby, router]);


  const handleReady = () => {
    if (!state.lobby || !socket) return
    const currentPlayer = state.lobby.players.find((p) => p.id === socket.id)
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
    if (!state.lobby?.gameId) return alert("Not ready to start")
    startGame(state.lobby.gameId)
  }

  const handleLeave = () => {
    if (!state.lobby) return
    leaveLobby(state.lobby.gameId)
    router.push("/protected/games/parchisi/online")
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
      <div className="min-h-screen w-full flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffb86b] mx-auto"></div>
              <p className="text-[#ffb86b]/80">Loading lobby...</p>
            </div>
          </div>
      </div>
    )
  }

  const isHost = state.lobby.hostId === socket?.id
  const allReady = state.lobby.players.every((p) => p.isReady)
  const readyCount = state.lobby.players.filter((p) => p.isReady).length

  return (
    <div className="h-screen flex flex-col xl:flex-row items-center justify-center w-full 
    bg-black/40 backdrop-blur-md overflow-x-hidden p-4">

      <Sidebar />
      <Navbar />

      <main className="w-full max-w-3xl flex flex-col gap-6 p-4
        bg-gradient-to-b from-[rgba(65,7,33,0.85)] to-[rgba(22,4,18,0.9)]
        border border-[#ffb86b]/30 rounded-3xl shadow-[0_0_40px_rgba(255,160,90,0.45)]">

        {/* HEADER */}
        {/* <Card title="Game Lobby" className="text-center"> */}
          <div className="items-center justify-center gap-4">
            <div className="flex items-center gap-2 justify-center">
              <Users className="h-6 w-6 text-[#ffb86b]" />
              <h1 className="text-2xl sm:text-3xl font-bold text-[#ffb86b]">Game Lobby</h1>
            </div>

            <div className="flex items-center gap-2 m-8 justify-center">
              <button
                onClick={handleCopyGameId}
                className="flex items-center gap-1 font-mono bg-black/25 text-white border border-[#ffb86b]/40 hover:bg-black/40 px-3 py-1 rounded-lg"
              >
                {gameId}
                <Copy className="h-4 w-4" />
              </button>
              {copied && <span className="text-green-400 text-sm">Copied!</span>}
            </div>

            <span className="bg-[#ffb86b]/20 text-[#ffb86b] px-3 py-1 rounded-full text-sm">
              {state.lobby.players.length} Players
            </span>
          </div>
        {/* </Card> */}

        {/* PLAYERS LIST */}
        <Card
          title="Connected Players"
          actions={
            <span className={`px-3 py-1 text-sm rounded-full
              ${allReady ? "bg-green-600/20 text-green-400" : "bg-[#ffb86b]/20 text-[#ffb86b]"}`}>
              {readyCount}/{state.lobby.players.length} Ready
            </span>
          }
        >
          <div className="space-y-3">
            {state.lobby.players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl
                  bg-black/20 border border-[#ffb86b]/30
                  transition-all duration-300 ${
                    animatingPlayers.has(player.id) ? "scale-105 shadow-lg" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center
                    ${player.isReady ? "bg-green-600/20" : "bg-[#ffb86b]/20"}`}>
                    <span className={`${player.isReady ? "text-green-400" : "text-[#ffb86b]"}`}>
                      {player.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{player.userName}</span>
                      {player.id === state.lobby.hostId && <Crown className="h-4 w-4 text-yellow-500" />}
                    </div>
                    {player.id === state.lobby.hostId && (
                      <span className="text-xs text-[#ffb86b]/50">Host</span>
                    )}
                  </div>
                </div>

                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm
                  ${player.isReady ? "bg-green-600/20 text-green-400" : "bg-[#ffb86b]/20 text-[#ffb86b]"}`}>
                  {player.isReady ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {player.isReady ? "Ready" : "Waiting"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* ACTIONS */}
        <Card>
          <div className="flex flex-col gap-3">
            <Button onClick={handleReady}>
              {state.lobby.players.find((p) => p.id === socket?.id)?.isReady
                ? "✓ You are Ready!"
                : "Mark as Ready"}
            </Button>

            {isHost && (
              <Button
                onClick={allReady && state.lobby.players.length >= 2 ? handleStartGame : undefined}
              >
                {allReady && state.lobby.players.length >= 2
                  ? "▶ Start Game"
                  : `Waiting ${state.lobby.players.length < 2
                    ? "for more players"
                    : (state.lobby.players.length - readyCount ) + " more players to be ready"
                  }`}
              </Button>
            )}

            <Button onClick={handleLeave}>← Leave Lobby</Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
