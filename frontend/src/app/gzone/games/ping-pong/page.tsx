"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import InviteToPlay from "./components/InviteFriendtoPlay";
import GameSettingsContent from "./modes/gameSettings2D/GameSettingsContent";

type BoxProps = {
  label: string;
  className: string;
  isHovered: boolean;
  isOtherHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
};

function Box({
  label,
  className,
  isHovered,
  isOtherHovered,
  onHover,
  onLeave,
  onClick,
}: BoxProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-full h-full flex flex-col items-center justify-center rounded-xl sm:rounded-2xl ${className}
        transition-all duration-300 ease-out cursor-pointer
        ${isOtherHovered ? "brightness-90" : "brightness-100"}
        ${isHovered ? "brightness-110" : "brightness-100"}
        before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
      `}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative z-10 px-2">
        <h1 className="truncate text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 font-bold text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          {label}
        </h1>
      </div>
    </div>
  );
}

export default function Test() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showInviteFriend, setShowInviteFriend] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();
  
  const boxes = [
    {
      id: 0,
      label: "LOCAL",
      className: "costum-path",
      pageLink: "../games/ping-pong/modes/local",
      action: "navigate"
    },
    {
      id: 1,
      label: "FRIEND",
      className: "costum-path-2",
      pageLink: "../games/ping-pong/modes/invitefriend",
      action: "popup"
    },
    {
      id: 2,
      label: "TOURNEMENT",
      className: "costum-path-3",
      pageLink: "../games/ping-pong/modes/tournament",
      action: "navigate"
    },
  ];

  const handleBoxClick = (box: typeof boxes[0]) => {
    if (box.action === "popup") {
      setShowInviteFriend(true);
    } else {
      router.push(box.pageLink);
    }
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
                  2xl:mt-[67px] xl:mt-[60px] overflow-y-hidden"
      >
        <div className="relative flex flex-col h-screen w-screen bg-cover bg-center overflow-hidden items-center justify-center p-2 xs:p-3 sm:p-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
          {/* Title - Enhanced Responsive */}
          <div className="text-center px-2">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white drop-shadow-2xl">
              Choose Your Preferred Mode
            </h2>
          </div>

          <div className="relative bg-gray/10 backdrop-blur-2xl rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] border border-white/30 w-full max-w-7xl h-[70vh] xs:h-[75vh] sm:h-[80vh] md:h-[75vh] lg:h-[70vh] p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
            {/* Settings Button - Enhanced Responsive */}
            <button
              onClick={() => setShowSettings(true)}
              className="absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-20 group bg-gray/10 backdrop-blur-2xl text-white font-semibold py-1 px-2 xs:py-1.5 xs:px-2.5 sm:py-2 sm:px-3 md:py-2.5 md:px-4 rounded-md xs:rounded-lg sm:rounded-xl transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-2xl cursor-pointer"
              title="Customize Game Settings"
            >
              <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                <svg
                  className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin-slow group-hover:animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="hidden sm:inline text-xs md:text-sm">Game Settings</span>
              </div>
            </button>

            {/* Game Mode Boxes Grid - Fully Responsive */}
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 p-0.5 xs:p-1 sm:p-2 md:p-3 lg:p-4">
              {boxes.map((box) => (
                <Box
                  key={box.id}
                  label={box.label}
                  className={box.className}
                  isHovered={hoveredIndex === box.id}
                  isOtherHovered={hoveredIndex !== null && hoveredIndex !== box.id}
                  onHover={() => setHoveredIndex(box.id)}
                  onLeave={() => setHoveredIndex(null)}
                  onClick={() => handleBoxClick(box)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Invite Friend Popup Modal - Responsive */}
        {showInviteFriend && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-md p-2 xs:p-3 sm:p-4 animate-fadeIn"
            onClick={() => setShowInviteFriend(false)}
          >
            <div 
              className="relative w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] bg-gray/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-white/30 overflow-hidden animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowInviteFriend(false)}
                className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 z-50 bg-[#FFB507] text-white rounded-full w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-lg xs:text-xl sm:text-2xl font-bold transition-all duration-300 shadow-lg hover:scale-110 hover:rotate-90 backdrop-blur-sm"
                aria-label="Close"
              >
                ×
              </button>
              
              <div className="relative overflow-y-auto max-h-[90vh] sm:max-h-[85vh] custom-scrollbar">
                <InviteToPlay />
              </div>
            </div>
          </div>
        )}

        {/* Settings Popup Modal - Responsive */}
        {showSettings && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-md p-2 xs:p-3 sm:p-4 animate-fadeIn"
            onClick={() => setShowSettings(false)}
          >
            <div
              className="relative w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] bg-gray/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-white/30 overflow-hidden animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 z-50 bg-[#FFB507] text-white rounded-full w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-lg xs:text-xl sm:text-2xl font-bold transition-all duration-300 shadow-lg hover:scale-110 hover:rotate-90 backdrop-blur-sm "
                aria-label="Close"
              >
                ×
              </button>
              
              <div className="relative overflow-y-auto max-h-[95vh] sm:max-h-[90vh] custom-scrollbar">
                <GameSettingsContent onClose={() => setShowSettings(false)} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
