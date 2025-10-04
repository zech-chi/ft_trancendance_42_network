"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, Palette, Grid3X3, Zap } from "lucide-react"
import { useEffect , useMemo} from "react"
import type {BoardTheme, DiceSkin, PieceSkin} from '@/types/game'
import {boardSkins, diceSkins, getPieceSkins} from '@/types/data'

type BoxProps = {
  label: string
  className?: string
  isHovered?: boolean
  isOtherHovered?: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}


function Box({ label, className, isHovered, isOtherHovered, onHover, onLeave, onClick }: BoxProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-[80%] h-[80%] flex items-center justify-center rounded-2xl 
        sm:w-[90%] sm:h-[90%] ${className}
        transition duration-300 cursor-pointer
        ${isOtherHovered ? "brightness-50" : "brightness-100"}
        ${isHovered ? "scale-105" : "scale-100"}
        bg-cover bg-center
      `}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
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

const colors = ["red", "blue", "green", "yellow"];



export default function HomePage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const router = useRouter()

  const [showCustomization, setShowCustomization] = useState(false)
  const [selectedPieceSkin, setSelectedPieceSkin] = useState("classic")
  const [selectedDiceSkin, setSelectedDiceSkin] = useState("classic")
  const [selectedBoardTheme, setSelectedBoardTheme] = useState("classic")
  const [customizationTab, setCustomizationTab] = useState<"pieces" | "dice" | "board">("pieces")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [randomColor, setRandomColor] = useState("red");
  

 const pieceSkins = useMemo(() => getPieceSkins(randomColor), [randomColor]);

  useEffect(() => {
    setRandomColor(colors[Math.floor(Math.random() * colors.length)]);

  }, [showCustomization]);


  const gameModes = [
    {
      id: 0,
      label: "Local Multiplayer",
      description: "Play with friends on the same device",
      pageLink: "/local",
      className:
        "costum-path bg-[url('https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/aa16f627-43da-4c63-9ff1-b305f96ae03d/1816037850/parchisi-star-online-3.webp')]",
    },
    {
      id: 1,
      label: "AI",
      description: "Challenge computer opponents",
      pageLink: "/ai",
      className:
        "costum-path-1 bg-[url('https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/aa16f627-43da-4c63-9ff1-b305f96ae03d/1816037850/parchisi-star-online-3.webp')]",
    },
    {
      id: 2,
      label: "Online Multiplayer",
      description: "Play with players around the world",
      pageLink: "/online",
      className:
        "costum-path-2 bg-[url('https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/aa16f627-43da-4c63-9ff1-b305f96ae03d/1816037850/parchisi-star-online-3.webp')]",
    },
    {
      id: 3,
      label: "Tournament",
      description: "Compete in a series of matches",
      pageLink: "/tournament",
      className:
        "costum-path-3 bg-[url('https://images.sftcdn.net/images/t_app-cover-s,f_auto/p/aa16f627-43da-4c63-9ff1-b305f96ae03d/1816037850/parchisi-star-online-3.webp')]",
    },
  ]

  const handleCustomizationSave = () => {
    console.log("Saving customization:", { selectedPieceSkin, selectedDiceSkin, selectedBoardTheme })
    setShowCustomization(false)
  }

  // const currentDiceSkin = dice_skiin.find((d) => d.id === selectedDiceSkin) || dice_skiin[0]
  // const currentBoardTheme = boardSkins.find((t) => t.id === selectedBoardTheme) || boardSkins[0]

  return (
     <div className="flex h-screen w-screen flex-col items-center justify-start overflow-hidden settings-bg bg-cover bg-center">
      <div className="absolute top-18 right-5 z-50 min">
        <button
          onClick={() => setShowCustomization(!showCustomization)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 rounded-xl transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Customize</span>
          {/* <Zap className="h-4 w-4 animate-pulse" /> */}
        </button>
      </div>

      <div className="flex flex-col h-[calc(100%-120px)] w-full settings-bg bg-cover bg-center overflow-hidden items-center justify-center">
      {/* Title and Description */}
      <div className="items-center gap-2">
        <h1 className="text-5xl font-bold text-center mb-2 text-gray-800">Parshichi</h1>
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
            />
          ))}
        </div>
      </div>

     {showCustomization && (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-40 p-4">
    <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full max-h-[60vh] flex flex-col border border-cyan-400/30">
      
      {/* Scrollable content */}
      <div className="p-6 space-y-8 overflow-y-auto flex-1">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            🎨 Customization Setting
          </h2>
          <button
            onClick={() => setShowCustomization(false)}
            className="text-cyan-400 hover:text-purple-400 text-2xl transition-colors duration-300"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-inner border border-cyan-400/20">
          <button
            onClick={() => setCustomizationTab("pieces")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              customizationTab === "pieces"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow-lg transform scale-105 border border-cyan-400/50"
                : "text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50"
            }`}
          >
            <Palette className="h-5 w-5" />
            <span className="hidden sm:inline">Pieces</span>
          </button>

          <button
            onClick={() => setCustomizationTab("dice")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              customizationTab === "dice"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow-lg transform scale-105 border border-cyan-400/50"
                : "text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50"
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
            <span className="hidden sm:inline">Dice</span>
          </button>

          <button
            onClick={() => setCustomizationTab("board")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              customizationTab === "board"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow-lg transform scale-105 border border-cyan-400/50"
                : "text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50"
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
            <span className="hidden sm:inline">Board</span>
          </button>
        </div>

        {/* Tab Content */}
        {customizationTab === "pieces" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pieceSkins.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => setSelectedPieceSkin(skin.id)}
                  onMouseEnter={() => setHoveredItem(skin.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform ${
                    selectedPieceSkin === skin.id
                      ? "border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-xl scale-105 shadow-cyan-400/20"
                      : "border-gray-700 hover:border-cyan-400/50 bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-lg hover:scale-102"
                  } ${hoveredItem === skin.id ? "shadow-2xl shadow-cyan-400/30" : ""}`}
                >
                  <div className="space-y-3">
                    <div className="w-full h-24 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={skin.image || "/placeholder.svg"}
                        alt={skin.name}
                        className="w-full h-full object-contain bg-gray-800"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-200">{skin.name}</div>
                      {selectedPieceSkin === skin.id && (
                        <div className="text-xs text-cyan-400 font-semibold mt-1">✨ Selected</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {customizationTab === "dice" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {diceSkins.map((dice) => (
                <button
                  key={dice.id}
                  onClick={() => setSelectedDiceSkin(dice.id)}
                  onMouseEnter={() => setHoveredItem(dice.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform ${
                    selectedDiceSkin === dice.id
                      ? "border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-xl scale-105 shadow-cyan-400/20"
                      : "border-gray-700 hover:border-cyan-400/50 bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-lg hover:scale-102"
                  } ${hoveredItem === dice.id ? "shadow-2xl shadow-cyan-400/30" : ""}`}
                >
                  <div className="space-y-3">
                    <div className="w-full h-24 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={dice.image || "/placeholder.svg"}
                        alt={dice.name}
                        className="w-full h-full object-contain bg-gray-800"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-200">{dice.name}</div>
                      {selectedDiceSkin === dice.id && (
                        <div className="text-xs text-cyan-400 font-semibold mt-1">✨ Selected</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {customizationTab === "board" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boardSkins.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedBoardTheme(theme.id)}
                  onMouseEnter={() => setHoveredItem(theme.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform ${
                    selectedBoardTheme === theme.id
                      ? "border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-xl scale-105 shadow-cyan-400/20"
                      : "border-gray-700 hover:border-cyan-400/50 bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-lg hover:scale-102"
                  } ${hoveredItem === theme.id ? "shadow-2xl shadow-cyan-400/30" : ""}`}
                >
                  <div className="space-y-3">
                    <div className="w-full h-32 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={theme.image || "/placeholder.svg"}
                        alt={theme.name}
                        className="w-full h-full object-contain bg-gray-800"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-200">{theme.name}</div>
                      {selectedBoardTheme === theme.id && (
                        <div className="text-xs text-cyan-400 font-semibold mt-1">✨ Selected</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Save button */}
      <div className="pt-6 border-t-2 border-gray-700 flex-shrink-0">
        <button
          onClick={handleCustomizationSave}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-cyan-400/50"
        >
          💾 Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}
