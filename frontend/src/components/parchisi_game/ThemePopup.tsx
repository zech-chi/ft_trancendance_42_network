"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGame } from "@/context/parchisiContexts/GameContext";
import { CustomizationType } from "@/types/game";
import themes from "@/types/data"; // your array of theme objects

interface ThemePopupProps {
  onClose: () => void;
}

export default function ThemePopup({ onClose }: ThemePopupProps) {
  const { setTheme, state } = useGame();

  const handleSelectTheme = (theme: CustomizationType) => {
    setTheme(theme); // save selected theme in context
    onClose();       // close the popup
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111] p-6 rounded-2xl w-[420px] max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold text-center text-white mb-4">
          Choose Your Game Theme
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {themes.map((theme, index) => (
            <button
              key={index}
              onClick={() => handleSelectTheme(theme)}
              className={`bg-[#1a1a1a] hover:scale-105 transition rounded-xl overflow-hidden border ${
                state.theme.theme_ds === theme.theme_ds ? "border-yellow-400" : "border-gray-700"
              }`}
            >
              <Image
                src={theme.showpic}
                alt="Theme Preview"
                width={200}
                height={120}
                className="w-full h-28 object-cover"
                loading="lazy"
                priority={false}
              />
              <p className="text-sm text-gray-300 p-2">
                {theme.theme_ds}
              </p>
            </button>
          ))}
        </div>

        <button
          className="mt-6 w-full py-2 bg-gray-800 rounded-xl text-white hover:bg-gray-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
