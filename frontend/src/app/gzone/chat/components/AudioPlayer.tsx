"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';
import { useAudioContext } from '../context/AudioPlayerContext';

// Define the component's props with types
type AudioPlayerProps = {
  url: string;
  id: string | number; // Unique identifier for the audio, useful for tracking
  sentbyMe: boolean
  onReady?: () => void;
}

// Define the options object for WaveSurfer, using the imported type
// The `container` property is required, so we ensure it's present.
const formWaveSurferOptions = (ref: HTMLDivElement, sentbyMe: boolean) => ({
  container: ref,
  waveColor: '#A8A8A8',
  progressColor: `${sentbyMe ? '#FFFFFF' : '#F59E0B'}`,
  cursorColor: 'transparent',
  barWidth: 1.7,
  barRadius: 3,
  responsive: true,
  height: 25,
  normalize: true,
  partialRender: true,
  interact: true,
});


const Loader = ({sentbyMe} : {sentbyMe: boolean}) => (
  <div className="w-7 h-7">
    <svg viewBox="0 0 32 32" className="animate-spin -rotate-90">
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="3"
      ></circle>
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke={`${sentbyMe ? '#FFFFFF' : '#F59E0B'}`}
        strokeWidth="3"
        strokeDasharray="40 100"
      ></circle>
    </svg>
  </div>
);

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, id, onReady, sentbyMe }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Type the ref to hold either a WaveSurfer instance or null
  const { playingId, setPlayingId } = useAudioContext();
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  
  // Type the state variables
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [duration, setDuration] = useState<string>('0:00');

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  useEffect(() => {
    // If the globally playing ID is NOT me, I must pause.
    if (playingId !== id) {
      setIsPlaying(false);
      wavesurferRef.current?.pause();
    }
  }, [playingId, id]);

  // Main effect for initializing WaveSurfer
  useEffect(() => {
    // Ensure the container ref is available before proceeding
    if (!waveformRef.current) return;

    setIsLoading(true);
    const options = formWaveSurferOptions(waveformRef.current, sentbyMe);
    const wavesurfer = WaveSurfer.create(options);
    wavesurferRef.current = wavesurfer;

    // Load the audio from the URL
    wavesurfer.load(url);

    // --- Typed Event Listeners ---
    
    // 'ready' event provides the duration as a number
    wavesurfer.on('ready', (durationSeconds: number) => {
      setDuration(formatTime(durationSeconds));
      setIsLoading(false); // Audio is ready, stop loading
      if (onReady) onReady();
    });

    // 'audioprocess' provides the current time as a number
    wavesurfer.on('audioprocess', (currentTimeSeconds: number) => {
      setCurrentTime(formatTime(currentTimeSeconds));
    });
    
    wavesurfer.on('finish', () => {
      setIsPlaying(false);
      wavesurfer.seekTo(0); // Reset to the beginning on finish
      if (playingId === id) {
        setPlayingId(null);
      }
    });

    // The cleanup function is crucial
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [url]);

  const handlePlayPause = useCallback(() => {

    if (wavesurferRef.current?.isPlaying()) {
      wavesurferRef.current.pause();
      // If I am pausing myself, tell the context that nothing is playing.
      setIsPlaying(prev => !prev);
      setPlayingId(null); 
    } else {
      // Before I play, I must tell the context that I AM the one playing now.
      // This will trigger the useEffect in all other players to pause.
      setIsPlaying(prev => !prev);
      setPlayingId(id); 
      wavesurferRef.current?.play();
    }
  }, [id, setPlayingId]);

  return (
    // here i should add the with to controle the with of the audio.
    <div className="flex items-center gap-1 flex-1 rounded-2xl"> 
      {/* <button onClick={handlePlayPause} className="text-white hover:text-amber-400">
        {isPlaying ? <Pause size={28} /> : <Play size={28} />}
      </button> */}
       

      <div className="flex-1 flex flex-col justify-center">
        <div className='flex gap-0.5'>
        {isLoading ? (
              <Loader sentbyMe={sentbyMe} />
            ) : (
              <button onClick={handlePlayPause} className="text-white hover:text-amber-400">
                {isPlaying ? <Pause size={25} /> : <Play size={25} />}
              </button>
            )}
            <div id="waveform" ref={waveformRef} className="w-[87%]" />
        </div>
        <div className="flex justify-end text-xs text-white mt-1">
          <span>{currentTime}</span>
          <span className="mx-1">/</span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
};