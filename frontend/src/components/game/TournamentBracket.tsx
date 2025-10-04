import React from 'react';

interface TournamentProps {
  tournament: any;
}

const TournamentBracket: React.FC<TournamentProps> = ({ tournament }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Tournament Bracket</h2>
      
      <div className="flex justify-between">
        {/* Semi-finals */}
        <div className="space-y-8">
          <h3 className="font-semibold text-lg mb-4">Semi-Finals</h3>
          {tournament.rounds[0]?.games.map((gameId: string, index: number) => (
            <div key={gameId} className=" p-4 rounded border border-gray-300">
              <div className="font-medium">Match {index + 1}</div>
              <div className="text-sm text-gray-600">Game ID: {gameId}</div>
              <div className="mt-2 text-sm">
                {tournament.rounds[0]?.winners[index] ? (
                  <span className="text-green-600">Winner: Player {tournament.rounds[0]?.winners[index]}</span>
                ) : (
                  <span className="text-blue-600">In progress</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Final */}
        <div className="self-center">
          <h3 className="font-semibold text-lg mb-4">Final</h3>
          <div className=" p-4 rounded border border-gray-300">
            <div className="font-medium">Championship</div>
            <div className="text-sm text-gray-600">Game ID: {tournament.rounds[1]?.games[0]}</div>
            <div className="mt-2 text-sm">
              {tournament.rounds[1]?.winners[0] ? (
                <span className="text-green-600">Champion: Player {tournament.rounds[1]?.winners[0]}</span>
              ) : (
                <span className="text-blue-600">Waiting for semi-finals</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-4">Participants</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tournament.players.map((player: string, index: number) => (
            <div key={index} className=" p-3 rounded text-center">
              {player}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;