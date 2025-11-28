"use client"

import { useEffect, useRef, useState } from "react"
import React from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/context/parchisiContexts/GameContext"
import { useSocket } from "@/context/parchisiContexts/SocketContext"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { Crown, Users, Check, Clock, Copy } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import ThemePopup from '@/components/parchisi_game/ThemePopup';
import { AiOutlineSkin } from 'react-icons/ai';

export default function LobbyPage({ params }: { params: Promise<{ id: string }> }) {

  const { state, joinLobby, leaveLobby, toggleReady, startGame } = useGame()
  const { socket } = useSocket()
  const router = useRouter()
  const { id: gameId } = React.use(params)
  const [copied, setCopied] = useState(false)
  const [animatingPlayers, setAnimatingPlayers] = useState<Set<string>>(new Set())
  const joinedRef = useRef(false);
  const [showThemePopup, setShowThemePopup] = useState(false);

  useEffect(() => {
    // Joined state
    if (state.lobby && state.lobby.gameId === gameId) {
      joinedRef.current = true;
    }
  
    // Cleanup (leave lobby on unmount)
    return () => {
      const currentPath = window.location.pathname;
  
      const leavingLobby =
        joinedRef.current &&
        currentPath !== `/protected/games/parchisi/online/lobby/${gameId}` &&
        !currentPath.startsWith(`/protected/games/parchisi/game/${gameId}`);
  
      if (leavingLobby) {
        leaveLobby(gameId);
      }
  
      joinedRef.current = false;
    };
  }, [state.lobby, gameId, leaveLobby]);
  
  useEffect(() => {
    // Lobby deleted → redirect
    if (state.lobby === null && !state.gameStarted) {
      router.push("/protected/games/parchisi/");
      return;
    }
  
    // Game started → navigate to game page
    if (state.gameStarted && state.lobby) {
      router.replace(`/protected/games/parchisi/game/${state.lobby.gameId}`);
    }
  }, [state.lobby, state.gameStarted, router]);
  

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
    router.push("/protected/games/parchisi")
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
            {/* Loading Spinner Color */}
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1CBABA] mx-auto"></div>
            <p className="text-[#1CBABA]/80">Loading lobby...</p>
          </div>
        </div>
      </div>
    )
  }

  const isHost = state.lobby.hostId === socket?.id
  const allReady = state.lobby.players.every((p) => p.isReady)
  const readyCount = state.lobby.players.filter((p) => p.isReady).length

//   return (
//     <div className="relative h-screen w-full bg-black/40 backdrop-blur-md overflow-hidden">
//   {/* 
//       Assuming Sidebar and Navbar are Fixed/Absolute positioned.
//       If they are not, they will sit on top of the content visually due to z-index.
//     */}
//   <Sidebar />
//   <Navbar />

//   {/* MAIN CONTENT CONTAINER */}
//   <main
//     className="
//       absolute inset-0 z-0
//       w-full h-full
//       flex flex-col items-center justify-start
//       overflow-y-auto overflow-x-hidden
      
//       /* Mobile Spacing: Push content down so it clears the Navbar */
//       pt-24 px-4 pb-10
      
//       /* Desktop Spacing (XL): Push content right to clear Sidebar & down for Navbar */
//       xl:pl-24 xl:pt-24
//       2xl:pl-28 2xl:pt-28
      
//       transition-all duration-300 ease-in-out
//       "
//       >
//     {/* 
//         GAME LOBBY CARD 
//         Removed 'h-screen' dependency, added margin-bottom for scrolling space 
//       */}
//     <div className="relative w-full max-w-2xl flex flex-col gap-6 
//       bg-gradient-to-b bg-gray-800/40
//       border border-[#1CBABA]/30 rounded-3xl shadow-[0_0_40px_rgba(28,186,186,0.45)]
//       p-6 mb-10"
//       >
//       {/* HEADER */}
//       <button
//         onClick={() => setShowThemePopup(true)}
//         className="absolute top-4 right-4 text-white/90 hover:text-[#1CBABA] text-2xl transition-colors"
//         title="Customize"
//         >
//         <AiOutlineSkin />
//       </button>

//       {showThemePopup && <ThemePopup onClose={() => setShowThemePopup(false)} />}
      
//       <div className="flex flex-col items-center justify-center gap-4">
//         <div className="flex items-center gap-2 justify-center">
//           <Users className="h-6 w-6 text-[#1CBABA]" />
//           <h1 className="text-2xl sm:text-3xl font-bold text-[#1CBABA]">Game Lobby</h1>
//         </div>

//         <div className="flex items-center gap-2 mt-4 justify-center">
//           <button
//             onClick={handleCopyGameId}
//             className="flex items-center gap-2 font-mono bg-black/25 text-white border border-[#1CBABA]/40 hover:bg-black/40 hover:border-[#1CBABA] transition-all px-4 py-2 rounded-lg group"
//             >
//             <span className="tracking-wider">{gameId.slice(0, 6)}</span>
//             <Copy className="h-4 w-4 group-hover:text-[#1CBABA]" />
//           </button>

//           {copied && <span className="text-green-400 text-sm animate-pulse">Copied!</span>}
//         </div>

//         <span className="bg-[#1CBABA]/10 text-[#1CBABA] border border-[#1CBABA]/20 px-4 py-1 rounded-full text-sm font-medium">
//           {state.lobby.players.length} Players Connected
//         </span>
//       </div>

//       {/* PLAYERS LIST */}
//       <Card
//         title="Connected Players"
//         actions={
//           <span className={`px-3 py-1 text-sm rounded-full font-medium transition-colors
//           ${allReady ? "bg-green-600/20 text-green-400 border border-green-500/30" : "bg-[#1CBABA]/10 text-[#1CBABA] border border-[#1CBABA]/20"}`}>
//             {readyCount}/{state.lobby.players.length} Ready
//           </span>
//         }
//         >
//         <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
//           {state.lobby.players.map((player) => (
//             <div
//             key={player.id}
//             className={`flex items-center justify-between p-3 rounded-xl
//             bg-black/20 border 
//             transition-all duration-300 
//             ${animatingPlayers.has(player.id) ? "scale-[1.02] shadow-lg border-[#1CBABA]" : "border-[#1CBABA]/30"}
//             `}
//             >
//               <div className="flex items-center gap-3">
//                 <div className={`h-10 w-10 rounded-full flex items-center justify-center border
//                   ${player.isReady ? "bg-green-600/10 border-green-500/50" : "bg-[#1CBABA]/10 border-[#1CBABA]/30"}`}>
//                   <span className={`font-bold ${player.isReady ? "text-green-400" : "text-[#1CBABA]"}`}>
//                     {player.userName.charAt(0).toUpperCase()}
//                   </span>
//                 </div>

//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="font-medium text-white">{player.userName}</span>
//                     {player.id === state.lobby?.hostId && <Crown className="h-4 w-4 text-yellow-500" />}
//                   </div>
//                   {player.id === state.lobby?.hostId && (
//                     <span className="text-xs text-[#1CBABA]/70">Host</span>
//                   )}
//                 </div>
//               </div>

//               <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
//                 ${player.isReady 
//                   ? "bg-green-600/10 text-green-400 border-green-500/30" 
//                   : "bg-[#1CBABA]/10 text-[#1CBABA] border-[#1CBABA]/30"}`}>
//                 {player.isReady ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
//                 {player.isReady ? "Ready" : "Waiting"}
//               </span>
//             </div>
//           ))}
//         </div>
//       </Card>

//       {/* ACTIONS */}
//       <Card>
//         <div className="flex flex-col gap-3">
//           <Button onClick={handleReady}>
//             {state.lobby.players.find((p) => p.id === socket?.id)?.isReady
//               ? "✓ You are Ready!"
//               : "Mark as Ready"}
//           </Button>

//           {isHost && (
//             <Button
//             onClick={allReady && state.lobby.players.length >= 2 ? handleStartGame : undefined}
//             disabled={!allReady || state.lobby.players.length < 2}
//             className={!allReady || state.lobby.players.length < 2 ? "opacity-50 cursor-not-allowed" : ""}
//             >
//               {allReady && state.lobby.players.length >= 2
//                 ? "▶ Start Game"
//                 : `Waiting ${state.lobby.players.length < 2
//                   ? "for more players"
//                   : (state.lobby.players.length - readyCount) + " more players"
//                 }`}
//             </Button>
//           )}

//             <Button onClick={handleLeave}>← Leave Lobby</Button>
//         </div>
//       </Card>
//     </div>
//   </main>
// </div>
//   )
  return(
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar />
      
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 lg:left-16 right-0 z-50">
        <Navbar />
      </div>

      {/* Scrollable main content - bg prevents content showing through navbar */}
      <main className="flex-1 ml-0 lg:ml-16 pt-16 sm:pt-20 pb-6 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 pb-8">
          {/* GAME LOBBY CARD */}
          <div className="relative w-full max-w-2xl flex flex-col gap-3 sm:gap-5
            bg-gradient-to-b bg-gray-800/40
            border border-[#1CBABA]/30 rounded-3xl shadow-[0_0_40px_rgba(28,186,186,0.45)]
            p-4 sm:p-6"
          >
          {/* HEADER (Customize Button) */}
          <button
            onClick={() => setShowThemePopup(true)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/90 hover:text-[#1CBABA] text-xl sm:text-2xl transition-colors z-10"
            title="Customize"
          >
            <AiOutlineSkin />
          </button>

          {showThemePopup && <ThemePopup onClose={() => setShowThemePopup(false)} />}

          {/* TITLE SECTION (Fixed Height - Does not shrink) */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2 justify-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#1CBABA]" />
              <h1 className="text-xl sm:text-3xl font-bold text-[#1CBABA]">Game Lobby</h1>
            </div>

            <div className="flex items-center gap-2 mt-1 justify-center">
              <button
                onClick={handleCopyGameId}
                className="flex items-center gap-2 font-mono bg-black/25 text-white border border-[#1CBABA]/40 hover:bg-black/40 hover:border-[#1CBABA] transition-all px-3 py-1 sm:px-4 sm:py-2 rounded-lg group text-xs sm:text-base"
              >
                <span className="tracking-wider">{gameId.slice(0, 6)}</span>
                <Copy className="h-3 w-3 sm:h-4 sm:w-4 group-hover:text-[#1CBABA]" />
              </button>

              {copied && <span className="text-green-400 text-xs sm:text-sm animate-pulse">Copied!</span>}
            </div>

            <span className="bg-[#1CBABA]/10 text-[#1CBABA] border border-[#1CBABA]/20 px-3 py-0.5 sm:px-4 sm:py-1 rounded-full text-[10px] sm:text-sm font-medium">
              {state.lobby.players.length} Players Connected
            </span>
          </div>

          {/* PLAYERS LIST SECTION with internal scroll */}
          <div className="w-full"> 
            <Card
              title="Connected Players"
              actions={
                <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-sm rounded-full font-medium transition-colors
                ${allReady ? "bg-green-600/20 text-green-400 border border-green-500/30" : "bg-[#1CBABA]/10 text-[#1CBABA] border border-[#1CBABA]/20"}`}>
                  {readyCount}/{state.lobby.players.length} Ready
                </span>
              }
            >
              {/* Scrollable players list - fixed height for 2.5 players */}
              <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1" style={{ maxHeight: 'calc(2.5 * (3.5rem + 0.5rem))' }}>
                {state.lobby.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl
                    bg-black/20 border 
                    transition-all duration-300 
                    ${animatingPlayers.has(player.id) ? "scale-[1.02] shadow-lg border-[#1CBABA]" : "border-[#1CBABA]/30"}
                    `}
                  >
                    {/* LEFT: Avatar + Name */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-full flex items-center justify-center border
                        ${player.isReady ? "bg-green-600/10 border-green-500/50" : "bg-[#1CBABA]/10 border-[#1CBABA]/30"}`}>
                        <span className={`font-bold text-sm sm:text-base ${player.isReady ? "text-green-400" : "text-[#1CBABA]"}`}>
                          {player.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-white text-sm sm:text-base truncate">
                            {player.userName}
                          </span>
                          {player.id === state.lobby?.hostId && <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />}
                        </div>
                        {player.id === state.lobby?.hostId && (
                          <span className="text-[10px] sm:text-xs text-[#1CBABA]/70">Host</span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Status Badge */}
                    <div className="flex-shrink-0">
                      <span className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border w-[75px] sm:w-[85px]
                        ${player.isReady 
                          ? "bg-green-600/10 text-green-400 border-green-500/30" 
                          : "bg-[#1CBABA]/10 text-[#1CBABA] border-[#1CBABA]/30"}`}>
                        {player.isReady ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {player.isReady ? "Ready" : "Wait"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ACTIONS FOOTER */}
          <div className="w-full">
            <Card>
              <div className="flex flex-col gap-2">
                <Button onClick={handleReady}>
                  {state.lobby.players.find((p) => p.id === socket?.id)?.isReady
                    ? "✓ You are Ready!"
                    : "Mark as Ready"}
                </Button>

                {isHost && (
                  <Button
                    onClick={allReady && state.lobby.players.length >= 2 ? handleStartGame : undefined}
                    disabled={!allReady || state.lobby.players.length < 2}
                    className={!allReady || state.lobby.players.length < 2 ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {allReady && state.lobby.players.length >= 2
                      ? "▶ Start Game"
                      : `Waiting ${state.lobby.players.length < 2
                        ? "for players"
                        : (state.lobby.players.length - readyCount) + " more"
                      }`}
                  </Button>
                )}

                <Button onClick={handleLeave}>← Leave</Button>
              </div>
            </Card>
          </div>
          </div>
        </div>
      </main>
    </div>
  )
}