'use client';

import React, { useEffect } from 'react';
import { Trophy, User } from 'lucide-react';
import { useTournament } from '../context/TournamentTreeContext';

// ✅ Define PlayerType (must match your TournamentContext)
type PlayerType = {
  playerId: string | number | null;
  name: string;
  image: string | null;
  status?: string;
};

type PlayerCardProps = {
  player: PlayerType;
  size?: 'normal' | 'large';
};

const TournamentBracket: React.FC = () => {
  const { matches } = useTournament();

  // ✅ Debug: log when matches update (you can remove this later)
  useEffect(() => {
    console.log('🎨 Updated matches:', matches);
  }, [matches]);

  // ✅ Inner component for each player box
  const PlayerCard: React.FC<PlayerCardProps> = ({ player, size = 'normal' }) => {
    const isLarge = size === 'large';
    const cardHeight = isLarge ? 80 : 60;
    const imgSize = isLarge ? 50 : 40;
    const fontSize = isLarge ? 16 : 14;

    // ✅ background color based on player status
    let bgColor = '#ffffff';
    if (player.status === 'win') bgColor = '#10b981';
    else if (player.status === 'lose') bgColor = '#ef4444';

    return (
      <g key={player.playerId ?? player.name}>
        {/* Card background */}
        <rect
          width={isLarge ? 220 : 180}
          height={cardHeight}
          rx="8"
          fill={bgColor}
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Player image or fallback icon */}
        {player.image ? (
          <image
            key={player.image}
            href={player.image}
            x={15}
            y={cardHeight / 2 - imgSize / 2}
            width={imgSize}
            height={imgSize}
            style={{ clipPath: 'circle(50%)' }}
          />
        ) : (
          <>
            <circle
              cx={imgSize / 2 + 15}
              cy={cardHeight / 2}
              r={imgSize / 2}
              fill="#e0f2fe"
              stroke="#0ea5e9"
              strokeWidth="2"
            />
            <User
              x={imgSize / 2 + 15 - imgSize * 0.3}
              y={cardHeight / 2 - imgSize * 0.3}
              size={imgSize * 0.6}
              stroke="#0ea5e9"
              strokeWidth="2"
            />
          </>
        )}

        {/* Player name */}
        <text
          x={imgSize + 30}
          y={cardHeight / 2 + 5}
          fill="#000000"
          fontSize={fontSize}
          fontWeight="600"
          fontFamily="Arial, sans-serif"
        >
          {player.name}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full min-h-screen bg-black/70 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Ping Pong Tournament
          </h1>
          <p className="text-sky-300 text-lg">Championship Bracket</p>
        </div>

        {/* SVG Bracket */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/10">
          <svg
            viewBox="0 0 1200 700"
            className="w-full h-auto"
            style={{ maxHeight: '80vh' }}
          >
            {/* ===== SEMI-FINALS ===== */}
            <text
              x="120"
              y="30"
              fill="#ffffff"
              fontSize="24"
              fontWeight="700"
              fontFamily="Arial, sans-serif"
            >
              SEMI-FINALS
            </text>

            {/* Semi-Final 1 */}
            <g key="semi1-p1" transform="translate(50, 80)">
              <PlayerCard key={matches.semi1.player1.playerId ?? 's1p1'} player={matches.semi1.player1} />
            </g>
            <g key="semi1-p2" transform="translate(50, 160)">
              <PlayerCard key={matches.semi1.player2.playerId ?? 's1p2'} player={matches.semi1.player2} />
            </g>

            {/* Semi-Final 2 */}
            <g key="semi2-p1" transform="translate(50, 280)">
              <PlayerCard key={matches.semi2.player1.playerId ?? 's2p1'} player={matches.semi2.player1} />
            </g>
            <g key="semi2-p2" transform="translate(50, 360)">
              <PlayerCard key={matches.semi2.player2.playerId ?? 's2p2'} player={matches.semi2.player2} />
            </g>

            {/* Connectors Semi → Final */}
            <line x1="230" y1="110" x2="320" y2="110" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="230" y1="190" x2="320" y2="190" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="320" y1="110" x2="320" y2="190" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="320" y1="150" x2="420" y2="150" stroke="#0ea5e9" strokeWidth="3" />

            <line x1="230" y1="310" x2="320" y2="310" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="230" y1="390" x2="320" y2="390" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="320" y1="310" x2="320" y2="390" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="320" y1="350" x2="420" y2="350" stroke="#0ea5e9" strokeWidth="3" />

            {/* ===== FINAL ===== */}
            <text
              x="500"
              y="30"
              fill="#ffffff"
              fontSize="24"
              fontWeight="700"
              fontFamily="Arial, sans-serif"
            >
              FINAL
            </text>

            <g key="final-p1" transform="translate(420, 120)">
              <PlayerCard key={matches.final.player1.playerId ?? 'f1'} player={matches.final.player1} size="large" />
            </g>
            <g key="final-p2" transform="translate(420, 320)">
              <PlayerCard key={matches.final.player2.playerId ?? 'f2'} player={matches.final.player2} size="large" />
            </g>

            {/* Connectors Final → Winner */}
            <line x1="600" y1="150" x2="720" y2="150" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="600" y1="350" x2="720" y2="350" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="720" y1="150" x2="720" y2="350" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="720" y1="250" x2="820" y2="250" stroke="#0ea5e9" strokeWidth="3" />

            {/* ===== CHAMPION ===== */}
            <text
              x="900"
              y="30"
              fill="#ffffff"
              fontSize="24"
              fontWeight="700"
              fontFamily="Arial, sans-serif"
            >
              CHAMPION
            </text>

            <g key="winner" transform="translate(820, 210)">
              <rect
                width="280"
                height="100"
                rx="12"
                fill="#fbbf24"
                stroke="#1e293b"
                strokeWidth="3"
              />
              <circle
                cx="60"
                cy="50"
                r="35"
                fill="#e0f2fe"
                stroke="#0ea5e9"
                strokeWidth="3"
              />
              <User x={48} y={38} size={24} stroke="#0ea5e9" strokeWidth="2" />
              <text
                x="110"
                y="55"
                fill="#000000"
                fontSize="20"
                fontWeight="700"
                fontFamily="Arial, sans-serif"
              >
                {matches.winner.name}
              </text>
              <g transform="translate(240, 50)">
                <Trophy size={32} fill="#fbbf24" stroke="#1e293b" strokeWidth="2" />
              </g>
            </g>
          </svg>
        </div>

        {/* ===== Legend ===== */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white border-2 border-slate-800" />
            <span className="text-white">Not Played</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500 border-2 border-slate-800" />
            <span className="text-white">Winner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-500 border-2 border-slate-800" />
            <span className="text-white">Eliminated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
