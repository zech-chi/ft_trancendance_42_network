import { useEffect, useRef, useState } from "react";


const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}`;
  };
  
  const CallTimer = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      startTimeRef.current = Date.now();
  
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Date.now() - startTimeRef.current);
        }
      }, 1000);
  
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, []);
  
    return (
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2  text-white text-md font-mono bg-[rgba(0,0,0,0.7)] px-4 py-1 mt-1 rounded-xl">
        {formatTime(elapsedTime)}
      </div>
    );
  };
  
  export default CallTimer;