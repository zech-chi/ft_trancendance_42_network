"use client"
// a component for the games page display welcome to games
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSocket } from "@/context/parchisiContexts/SocketContext";
import { useGame } from "@/context/parchisiContexts/GameContext";




type BoxProps = {
  label: string
  className?: string
  isHovered?: boolean
  isOtherHovered?: boolean
  disabled?: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}


function Box({ label, className, isHovered, isOtherHovered, onHover, onLeave, onClick, disabled }: BoxProps) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        w-[80%] h-[80%] flex items-center justify-center rounded-2xl 
        shadow-xl backdrop-blur-md border border-white/30
        sm:w-[90%] sm:h-[90%] ${className}
        transition duration-300
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${!disabled && isOtherHovered ? "brightness-50" : ""}
        ${!disabled && isHovered ? "scale-105" : "scale-100"}
        bg-cover bg-center
      `}
      onMouseEnter={!disabled ? onHover : undefined}
      onMouseLeave={!disabled ? onLeave : undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <h3 className="truncate text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 font-bold text-2xl sm:text-2xl md:text-4xl">
        {label}
      </h3>
    </div>
  )
}




export default function HomePage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const router = useRouter();
  const {dispatch } = useGame();
  const { socket, namespace, setNamespace, isConnected } = useSocket();
  // if there is any socket connection i want to disconnect it when entering this page
 useEffect(() => {
   if (namespace !== null || isConnected || socket) {
    if (socket) socket.disconnect();
    setNamespace(null);
    dispatch({ type: "CLEAR_LOBBY" });
  }
}, []);

  const gameModes = [
    {
      id: 0,
      label: "Local Multiplayer",
      description: "Play with friends on the same device",
      pageLink: "/gzone/games/parchisi/local",
      className:
      "bg-[url('/parchisi_src/local.png')]",
        disable : false
    },
    {
      id: 1,
      label: "Online Multiplayer",
      description: "Play with players around the world",
      pageLink: "/gzone/games/parchisi/online",
      className:
      "bg-[url('/parchisi_src/online.png')]",
    
      disable: false
      },
    {
      id: 2,
      label: "AI",
      description: "Challenge computer opponents",
      pageLink: "/gzone/games/parchisi/ai",
      className:
      "bg-[url('/parchisi_src/ia.png')]",
       disable: true 
      },
    {
      id: 3,
      label: "Tournament",
      description: "Compete in a series of matches",
      pageLink: "/gzone/games/parchisi/tournament",
      className:
      "bg-[url('/parchisi_src/tournament.png')]",
        disable: true
      },
  ]


  // if there is any socket connection i want to disconnect it when entering this page


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
                        2xl:mt-[67px] xl:mt-[60px]
                    "
    >
        <div className="flex h-full w-full flex-col items-center justify-start overflow-hidden">
  <div className="absolute top-18 right-5 z-50 min">
  </div>

  <div className="flex flex-col h-full w-full  overflow-hidden items-center justify-center">
  {/* Title and Description */}
  <div className="items-center gap-2">
    <h1 className="text-5xl font-bold text-center mb-2 text-[#1CBABA] mb-7">Parcheesi</h1>
  </div>
    <div
      className="bg-gray-800/40 backdrop-blur-md p-6 shadow-xl border border-white/20 p-6 w-[90%] md:w-[70%] h-[80%] flex flex-col items-center gap-2 justify-center 
                    sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:place-items-center rounded-2xl"
    >
      {gameModes.map(({ id, label, className, pageLink }) => (
        <Box
          key={id}
          label={label}
          className={className}
          isHovered={hoveredIndex === id}
          isOtherHovered={hoveredIndex !== null && hoveredIndex !== id}
          onHover={() => setHoveredIndex(id)}
          onLeave={() => setHoveredIndex(null)}
          onClick={() => router.push(pageLink)}
          disabled={gameModes[id].disable}
        />
      ))}
    </div>
  </div>
        </div>
    </main>
</div>
  )
}
