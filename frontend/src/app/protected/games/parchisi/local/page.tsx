'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/parchisiContexts/SocketContext';
import { useGame } from '@/context/parchisiContexts/GameContext';
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function LocalGamePage() {
  const [players, setPlayers] = useState(2);
  const router = useRouter();
  const { setNamespace } = useSocket();
  const { createGame, state } = useGame();

  // Set namespace to local when entering the page
 useEffect(() => {
  setNamespace("local");
}, []);

  // If lobby (game) is created → redirect automatically
  // useEffect(() => {
  //   if (state?.lobby?.gameId) {
  //     router.push(`/game/${state.lobby.gameId}`);
  //   }
  // }, [state?.lobby?.gameId, router]);

  const handleStartGame = async () => {
    try {
      const gameId = await createGame(players);
      console.log("Redirecting to game:", gameId);
      router.push(`/protected/games/parchisi/game/${gameId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create game. Please try again.");
    }
  };

  return (
    // <div className="flex items-center justify-center h-[calc(100vh-75px)]">
    //   <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
    //         <h2 className="text-4xl font-bold mb-4 text-center">Local Multiplayer</h2>
    //         <div className="mb-4">
    //           <label className="block mb-2 text-gray-700">Number of Players:</label>
    //           <select
    //             value={players}
    //             onChange={(e) => setPlayers(parseInt(e.target.value))}
    //             className="w-full p-2 border rounded"
    //           >
    //             {[2, 3, 4].map((num) => (
    //               <option key={num} value={num}>
    //                 {num}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //         <button
    //           onClick={handleStartGame}
    //           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
    //         >
    //           Start Game
    //         </button>
    //       </div>
    //     </div>

        <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
<Sidebar />
<Navbar />
<main
  className="flex flex-row items-center justify-center relative overflow-x-hidden
                    xl:pl-20 2xl:pl-24 w-full
                    h-[calc(100%-130px)]
                    xl:h-[calc(100%-75px)]
                    2xl:h-[calc(100%-85px)]
                    2xl:mt-[67px] xl:mt-[60px] overflow-y-hidden
                "
>
<div className="flex items-center justify-center h-[calc(100vh-75px)]">
  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-bold mb-4 text-center">Local Multiplayer</h2>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Number of Players:</label>
          <select
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {[2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleStartGame}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
</main>
</div>

    
  );
}

