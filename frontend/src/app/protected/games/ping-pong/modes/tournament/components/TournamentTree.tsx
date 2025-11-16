"use client";

import React, { useState } from "react";
import { useTreeTournament } from "../context/TreeTournamentContext";

export default function TournamentBracket() {
  const { tournamentTree } = useTreeTournament();
  const [hoveredMatchLabel, setHoveredMatchLabel] = useState<string | null>(null);

  if (!tournamentTree) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-gray-500">No tournament initialized yet.</p>
      </div>
    );
  }

  const renderPlayer = (player: any) => {
    if (!player || !player.name)
      return <span className="text-gray-400">Not played</span>;

    return (
      <div className="flex items-center gap-2">
        {player.avatarUrl ? (
          <img
            src={player.avatarUrl}
            alt={player.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-yellow-600">
            {player.name[0]}
          </div>
        )}
        <span className="font-medium">{player.name}</span>
        {player.status === "win" && (
          <span className="text-green-600 text-sm">🏆</span>
        )}
        {player.status === "lose" && (
          <span className="text-red-500 text-sm">❌</span>
        )}
      </div>
    );
  };

  const handleEnter = (label: string) => setHoveredMatchLabel(label);
  const handleLeave = () => setHoveredMatchLabel(null);

  const renderMatch = (match: any, label: string) => (
    <div
      key={label}
      className="border rounded-lg p-4 shadow-sm bg-white w-64 hover:cursor-pointer"
      onMouseEnter={() => handleEnter(label)}
      onMouseLeave={handleLeave}
    >
      <h3 className="font-semibold mb-2 text-center">{label}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          {renderPlayer(match?.Player1)}
          <span className="text-gray-500">
            {match?.score ? match.score[0] : "-"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          {renderPlayer(match?.Player2)}
          <span className="text-gray-500">
            {match?.score ? match.score[1] : "-"}
          </span>
        </div>
      </div>
    </div>
  );

  // {hoveredMatchLabel && (
  //   <div
  //     className="fixed h-[50%] w-[50%] inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[9999] pointer-events-none"
  //     aria-hidden
  //   >
  //     {/* This inner div is also non-interactive (pointer-events-none) so the overlay
  //         will not block mouse events on underlying elements. */}
  //     <div className="text-white text-2xl font-semibold select-none">
  //       {hoveredMatchLabel}
  //     </div>
  //   </div>
  // )}

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Overlay (visual only) */}


      <div className="flex flex-col items-center gap-10 p-8">
        {/* Round 1 */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-bold text-blue-700">Round 1</h2>
          <div className="flex gap-6">
            {renderMatch(tournamentTree.round1.match1, "Match 1")}
            {renderMatch(tournamentTree.round1.match2, "Match 2")}
          </div>
        </div>

        {/* Round 2 */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-bold text-blue-700">Round 2 (Final)</h2>
          {renderMatch(tournamentTree.round2.match1, "Final Match")}
        </div>

        {/* Winner */}
        <div className="flex flex-col items-center gap-2 mt-8">
          <h2 className="text-lg font-bold text-green-700">🏆 Winner</h2>
          {tournamentTree.winner ? (
            renderPlayer(tournamentTree.winner)
          ) : (
            <p className="text-gray-400">Not played</p>
          )}
        </div>
      </div>
    </div>
  );
}
