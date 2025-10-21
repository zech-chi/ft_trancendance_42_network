import React, { useState } from 'react';
import { Trophy, User } from 'lucide-react';

const TournamentBracket = () => {
  const [matches, setMatches] = useState({
    // Semi-finals (4 players)
    semi1: {
      player1: {
        name: 'None',
        image: null,
        status: 'not played',
      },
      player2: { name: 'None', image: null, status: 'not played' },
    },
    semi2: {
      player1: { name: 'None', image: null, status: 'not played' },
      player2: { name: 'None', image: null, status: 'not played' },
    },
    // Final (2 players)
    final: {
      player1: { name: 'None', image: null, status: 'not played' },
      player2: { name: 'None', image: null, status: 'not played' },
    },
    // Winner
    winner: { name: 'None', image: null },
  });

  const PlayerCard = ({ player, size = 'normal' }) => {
    const isLarge = size === 'large';
    const cardHeight = isLarge ? 80 : 60;
    const imgSize = isLarge ? 50 : 40;
    const fontSize = isLarge ? 16 : 14;

    let bgColor = '#ffffff';
    if (player.status === 'win') bgColor = '#10b981';
    if (player.status === 'lose') bgColor = '#ef4444';

    return (
      <g>
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
            <g transform={`translate(${imgSize / 2 + 15}, ${cardHeight / 2})`}>
              <User
                size={imgSize * 0.6}
                stroke="#0ea5e9"
                strokeWidth="2"
                x={-imgSize * 0.3}
                y={-imgSize * 0.3}
              />
            </g>
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
    <div className="w-full min-h-screen bg-black/70 from-slate-900  to-slate-900 p-4 md:p-8">
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
            {/* Semi-Finals Label */}
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
            <g transform="translate(50, 80)">
              <PlayerCard player={matches.semi1.player1} />
            </g>
            <g transform="translate(50, 160)">
              <PlayerCard player={matches.semi1.player2} />
            </g>

            {/* Semi-Final 2 */}
            <g transform="translate(50, 280)">
              <PlayerCard player={matches.semi2.player1} />
            </g>
            <g transform="translate(50, 360)">
              <PlayerCard player={matches.semi2.player2} />
            </g>

            {/* Connector lines from Semi 1 to Final */}
            <line x1="230" y1="110" x2="320" y2="110" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="230" y1="190" x2="320" y2="190" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="320" y1="110" x2="320" y2="190" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="320" y1="150" x2="420" y2="150" stroke="#0ea5e9" strokeWidth="3" />

            {/* Connector lines from Semi 2 to Final */}
            <line x1="230" y1="310" x2="320" y2="310" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="230" y1="390" x2="320" y2="390" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="320" y1="310" x2="320" y2="390" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="320" y1="350" x2="420" y2="350" stroke="#0ea5e9" strokeWidth="3" />

            {/* Final Label */}
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

            {/* Final Match */}
            <g transform="translate(420, 120)">
              <PlayerCard player={matches.final.player1} />
            </g>
            <g transform="translate(420, 320)">
              <PlayerCard player={matches.final.player2} />
            </g>

            {/* Connector lines from Final to Winner */}
            <line x1="600" y1="150" x2="720" y2="150" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="600" y1="350" x2="720" y2="350" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="720" y1="150" x2="720" y2="350" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="720" y1="250" x2="820" y2="250" stroke="#0ea5e9" strokeWidth="3" />

            {/* Winner Label */}
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

            {/* Winner */}
            <g transform="translate(820, 210)">
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
              <g transform="translate(60, 50)">
                <User size={24} stroke="#0ea5e9" strokeWidth="2" x={-12} y={-12} />
              </g>
              <text
                x="110"
                y="45"
                fill="#000000"
                fontSize="20"
                fontWeight="700"
                fontFamily="Arial, sans-serif"
              >
                {matches.winner.name}
              </text>
              <g transform="translate(240, 50)">
                <Trophy
                  size={32}
                  fill="#fbbf24"
                  stroke="#1e293b"
                  strokeWidth="2"
                  x={-16}
                  y={-16}
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white border-2 border-slate-800"></div>
            <span className="text-white">Not Played</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500 border-2 border-slate-800"></div>
            <span className="text-white">Winner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-500 border-2 border-slate-800"></div>
            <span className="text-white">Eliminated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
