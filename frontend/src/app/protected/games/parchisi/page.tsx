"use client"
// a component for the games page display welcome to games
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/navigation"
import { useState } from "react"


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
      <h1 className="truncate text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 font-bold text-2xl sm:text-2xl md:text-4xl">
        {label}
      </h1>
    </div>
  )
}




export default function HomePage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const router = useRouter()
  const gameModes = [
    {
      id: 0,
      label: "Local Multiplayer",
      description: "Play with friends on the same device",
      pageLink: "/protected/games/parchisi/local",
      className:
        "bg-[url('https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/aa16f627-43da-4c63-9ff1-b305f96ae03d/1816037850/parchisi-star-online-3.webp')]",
        disable : false
    },
    {
      id: 1,
      label: "Online Multiplayer",
      description: "Play with players around the world",
      pageLink: "/protected/games/parchisi/online",
      className:
        "bg-[url('https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/aa16f627-43da-4c63-9ff1-b305f96ae03d/1816037850/parchisi-star-online-3.webp')]",
    
      disable: false
      },
    {
      id: 2,
      label: "AI",
      description: "Challenge computer opponents",
      pageLink: "/protected/games/parchisi/ai",
      className:
        "bg-[url('https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/aa16f627-43da-4c63-9ff1-b305f96ae03d/1816037850/parchisi-star-online-3.webp')]",
       disable: true 
      },
    {
      id: 3,
      label: "Tournament",
      description: "Compete in a series of matches",
      pageLink: "/protected/games/parchisi/tournament",
      className:
        "bg-[url('https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/aa16f627-43da-4c63-9ff1-b305f96ae03d/1816037850/parchisi-star-online-3.webp')]",
        disable: true
      },
  ]


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
        <div className="flex h-screen w-screen flex-col items-center justify-start overflow-hidden ">
  <div className="absolute top-18 right-5 z-50 min">
  </div>

  <div className="flex flex-col h-[calc(100%-120px)] w-full  overflow-hidden items-center justify-center">
  {/* Title and Description */}
  <div className="items-center gap-2">
    <h1 className="text-5xl font-bold text-center mb-2 text-gray-800">Parcheesi</h1>
    <p className="text-xl text-center mb-4 text-gray-600">The classic Parcheesi-style board game</p>
  </div>
    <div
      className="bg-[rgba(0,0,0,0.6)] p-6 w-[70%] h-[80%] flex flex-col items-center gap-2 justify-center 
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
