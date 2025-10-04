import { useState, useCallback } from 'react';

export const useDiceRoll = () => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = useCallback((): number => {
    return Math.floor(Math.random() * 6) + 1;
  }, []);

  const animateRoll = useCallback(async (): Promise<number> => {
    setIsRolling(true);
    
    // Animate rolling for 1 second
    const startTime = Date.now();
    const rollDuration = 1000;
    
    const animate = () => {
      if (Date.now() - startTime < rollDuration) {
        setDiceValue(rollDice());
        requestAnimationFrame(animate);
      } else {
        const finalValue = rollDice();
        setDiceValue(finalValue);
        setIsRolling(false);
        return finalValue;
      }
    };
    
    return new Promise<number>((resolve) => {
      const finalValue = animate();
      resolve(finalValue);
    });
  }, [rollDice]);

  return {
    diceValue,
    isRolling,
    rollDice,
    animateRoll
  };
};