'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function Games() {
  const router = useRouter();

  // Navigation handlers
  const handleNavigation = (path : string) => {
    router.push(path);
  };

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
                            bg-gradient-to-br from-gray-900 via-black to-gray-900
                        "
        >
           <div className="h-full flex items-center min-w-[300px] w-full overflow-hidden">
          <div className='flex flex-col h-full w-full items-center justify-center'>
          <div className="text-center mb-10 md:mb-16 z-10 animate-fade-in-down">
            <h1 className="text-4xl md:text-6xl font-extrabold  bg-clip-text bg-gradient-to-r text-[#1CBABA]  mb-4 drop-shadow-lg">
              Game Zone
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Select your Game. Will it be the retro fury of Pong or the strategic moves of Parchisi?
            </p>
          </div>

          {/* Cards Container */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-center w-full h-[70%] max-w-6xl z-10">
            
            {/* --- PONG CARD --- */}
            <div 
              onClick={() => handleNavigation('/gzone/games/ping-pong')}
              className="group relative w-[90%] max-w-sm h-[60%] rounded-3xl overflow-hidden cursor-pointer 
                          shadow-2xl transition-all duration-500 
                         hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105 border border-white/20"
            >
              {/* Background Image */}
              <Image 
                src="/assets/pong.jpeg" // Make sure this file exists in public/assets/
                alt="Neon Pong Game"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

              {/* Card Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                  <span className="text-cyan-400">Neon</span> Pong
                </h2>
                <div className="w-full h-[2px] bg-cyan-500/50 mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <button className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full 
                                   shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all duration-300 
                                   transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  Play Now
                </button>
              </div>
            </div>

            {/* --- PARCHISI CARD --- */}
            <div 
              onClick={() => handleNavigation('/gzone/games/parchisi')}
              className="group relative w-[90%] max-w-sm h-[60%] rounded-3xl overflow-hidden cursor-pointer 
                         shadow-2xl transition-all duration-500 
                         hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-105 border border-white/20"
            >
              {/* Background Image */}
              <Image 
                src="/assets/parchsi.jpeg" // Make sure this file exists in public/assets/
                alt="3D Parchisi Board"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

              {/* Card Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center">
                <h2 className="text-4xl font-black text-white mb-2 tracking-wide uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                  <span className="text-green-500">Parch</span>isi
                </h2>
                <div className="w-full h-[2px] bg-green-500/50 mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <button className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full 
                                   shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all duration-300 
                                   transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  Roll Dice
                </button>
              </div>
            </div>

          </div>
          </div>
    </div>
        </main>
      </div>
  );
}
   