"use client"

import Button  from "@/components/ui/Button"
import  Card  from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Star } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Player {
  id: number
  name: string
  avatar: string
}

interface WinnerAnnouncementProps {
  player: Player
}

export default function WinnerAnnouncement({ player }: WinnerAnnouncementProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d946a6] via-[#ec4899] to-[#f97316] overflow-hidden relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {i % 3 === 0 ? "⭐" : i % 3 === 1 ? "🎉" : "✨"}
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Header Section with Stars */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Star className="w-12 h-12 text-yellow-300 fill-yellow-300 animate-pulse" />
            <Star className="w-16 h-16 text-yellow-300 fill-yellow-300" />
            <Star className="w-12 h-12 text-yellow-300 fill-yellow-300 animate-pulse" />
          </div>

          {/* Winner Banner */}
          <div className="relative inline-block">
            <div className="bg-red-600 text-white px-12 py-3 rounded-lg shadow-2xl transform -rotate-1">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">Well Played!</h1>
            </div>
            <div className="bg-red-600 text-white px-16 py-4 rounded-lg shadow-2xl mt-2">
              <h2 className="text-5xl md:text-6xl font-bold tracking-wider">WINNER</h2>
            </div>
          </div>
        </div>

        {/* Winner Spotlight */}
        <div className="flex justify-center mb-8 animate-scale-in">
          <Card className="bg-white/95 backdrop-blur-sm p-8 shadow-2xl border-4 border-yellow-400">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-yellow-400 shadow-lg">
                  <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                  <AvatarFallback className="bg-pink-600 text-white text-3xl">{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 rounded-full p-3">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-purple-900">{player.name}</h3>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/online">
            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700 px-8 py-6 text-lg font-bold shadow-xl">
              Play Again
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-xl border-2"
            >
              Exit
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out 0.3s both;
        }
      `}</style>
    </div>
  )
}
