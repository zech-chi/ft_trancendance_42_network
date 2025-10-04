'use client';

import React, { useState, useEffect } from 'react';
import { useDiceRoll } from '@/hooks/useDiceRoll';

interface DiceProps {
  onRollComplete?: (value: number) => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRollComplete, disabled = false }) => {
  const [isRolling, setIsRolling] = useState(false);
  const { diceValue, animateRoll } = useDiceRoll();

  const handleClick = async () => {
    if (disabled || isRolling) return;
    
    setIsRolling(true);
    const value = await animateRoll();
    setIsRolling(false);
    
    if (onRollComplete) {
      onRollComplete(value);
    }
  };

  // Dice faces based on value
  const renderDiceFace = () => {
    const dots = [];
    const positions = [
      [], // 0 (not used)
      ['center'], // 1
      ['top-left', 'bottom-right'], // 2
      ['top-left', 'center', 'bottom-right'], // 3
      ['top-left', 'top-right', 'bottom-left', 'bottom-right'], // 4
      ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'], // 5
      ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'] // 6
    ];

    if (diceValue > 0 && diceValue <= 6) {
      for (let i = 0; i < positions[diceValue].length; i++) {
        dots.push(<div key={i} className={`dice-dot ${positions[diceValue][i]}`} />);
      }
    }

    return dots;
  };

  return (
    <div 
      className={`dice ${isRolling ? 'rolling' : ''} ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
      onClick={handleClick}
    >
      <div className="dice-inner">
        {renderDiceFace()}
      </div>
    </div>
  );
};

export default Dice;