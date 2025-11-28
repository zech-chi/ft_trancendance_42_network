"use client";
import { motion } from "framer-motion";
import Image from "next/image";
export default function PopupWinner({
  winner,
  onClose,
}: {
  winner: { winner: string; color: string; avatar?: string };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 14 }}
        className="
          p-8 rounded-2xl text-center flex flex-col items-center
          bg-[#0d0d0f]/90 border border-[#1CBABA]/30
          shadow-lg shadow-black/60
        "
      >
        <h1 className="text-3xl font-bold text-[#1CBABA] mb-3 tracking-wide">
          Winner
        </h1>

        {winner.avatar && (
        <Image
        src={winner.avatar}
        alt="Winner Avatar"
        width={80} 
        height={80}   
        className="rounded-full border border-[#1CBABA]/50 mb-3"
        style={{ objectFit: "cover" }}
      />
        )}

        <h2 className="text-xl text-[#1CBABA]/90 font-semibold">
          {winner.winner}
        </h2>

        <p className="text-sm text-[#1CBABA]/60 mt-1">
          Color: {winner.color}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="
            mt-5 py-2 px-6 rounded-lg font-medium
            bg-[#1CBABA]/20 border border-[#1CBABA]/40
            text-[#1CBABA] hover:bg-[#1CBABA]/30 transition
          "
          onClick={onClose}
        >
          Close
        </motion.button>
      </motion.div>
    </div>
  );
}
