"use client";
import { motion } from "framer-motion";

export default function PopupWinner({ winner, onClose }: { 
  winner: { winner: string; color: string; avatar?: string }; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white text-black rounded-2xl shadow-2xl p-8 flex flex-col items-center"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">🎉 Winner! 🎉</h1>
        {winner.avatar && (
          <img
            src={winner.avatar}
            alt="Winner Avatar"
            className="w-24 h-24 rounded-full border-4 border-yellow-400 mb-3"
          />
        )}
        <h2 className="text-2xl font-semibold">{winner.winner}</h2>
        <p className="text-gray-600 mt-2">Color: {winner.color}</p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl"
          onClick={onClose}
        >
          Close
        </motion.button>
      </motion.div>
    </div>
  );
}
