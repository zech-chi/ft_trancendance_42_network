"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// This defines the "shape" of the data our context will provide.
interface AudioPlayerContextType {
  playingId: string | number | null; // The ID of the message/audio currently playing
  setPlayingId: (id: string | number | null) => void; // A function to set the playing ID
}

// Create the context.
const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

// Create a custom hook for easy access. This is best practice.
export const useAudioContext = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioPlayerProvider');
  }
  return context;
};

// Create the Provider component that will wrap your app.
export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playingId, setPlayingId] = useState<string | number | null>(null);

  const value = { playingId, setPlayingId };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};