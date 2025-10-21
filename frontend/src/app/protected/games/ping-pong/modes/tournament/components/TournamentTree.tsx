"use client";

import React from "react";
import { useTreeTournament } from "../context/TreeTournamentContext";

export default function TournamentBracket() {
  const { tournamentTree } = useTreeTournament();

  if (!tournamentTree) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-gray-500">No tournament initialized yet.</p>
      </div>
    );
  }

  const renderPlayer = (player: any) => {
    if (!player || !player.name) return <span className="text-gray-400">Not played</span>;
    return (
      <div className="flex items-center gap-2">
        {player.avatarUrl ? (
          <img src={player.avatarUrl} alt={player.name} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-700">
            {player.name[0]}
          </div>
        )}
        <span className="font-medium">{player.name}</span>
        {player.status === "win" && <span className="text-green-600 text-sm">🏆</span>}
        {player.status === "lose" && <span className="text-red-500 text-sm">❌</span>}
      </div>
    );
  };

  const renderMatch = (match: any, label: string) => (
    <div className="border rounded-lg p-4 shadow-sm bg-white w-64">
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

  return (
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
  );
}
