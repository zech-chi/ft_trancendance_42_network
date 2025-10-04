import React from 'react';

interface PieceProps {
  piece: any;
  playerColor: string;
  position: { top: string; left: string };
  onClick?: () => void;
  isSelectable?: boolean;
}

const playerpieces = function (p:number)
{
  const p_id = "P" + p;
  return (
    <div className="player-pieces">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="player-piece"
          data-player-id={p_id}
          data-piece-id={i.toString()}
        />
      ))}
    </div>
  );
}

const Piece: React.FC<PieceProps> = ({ 
  piece, 
  playerColor, 
  position, 
  onClick,
  isSelectable = false 
}) => {
  return (
    <div
      className={`absolute w-6 h-6 rounded-full border-2 border-white transition-transform duration-300 ${
        isSelectable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
      }`}
      style={{
        backgroundColor: playerColor,
        top: position.top,
        left: position.left,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      }}
      onClick={onClick}
      title={`Position: ${piece.position}`}
    >
      {piece.isHome && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">H</span>
        </div>
      )}
      
      {piece.isFinished && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">F</span>
        </div>
      )}
    </div>
  );
};

export default Piece;