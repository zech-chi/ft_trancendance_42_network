'use client';

import { useEffect } from "react";

export type IncomingCallData = {
  from: string;       // user ID
  fromName: string;   // display name
  type: 'video' | 'audio';
  offer: RTCSessionDescriptionInit;
};

type IncomingCallProps = {
  call: IncomingCallData;
  onAccept: () => void;
  onReject: () => void;
};

let callSound: HTMLAudioElement;

export const IncomingCall = ({ call, onAccept, onReject }: IncomingCallProps) => {
  
  useEffect(() => {
    try {
      callSound = new Audio("/sounds/callSound.mp3");
      callSound.loop = true;        // loop the ringtone
      callSound.play().catch((err) => console.error("Failed to play sound:", err));
    } catch (error) {
      //console.error("Error initializing call sound:", error);
    }
    return () => {
      callSound.pause();
      callSound.currentTime = 0;  // reset audio
    };
  }, []);

  return (
    <div className="fixed top-[6.5%] right-[3%] text-white p-2 rounded-2xl z-50 bg-gray-800/40 backdrop-blur-md shadow-xl border border-white/20">
      <p>Incoming {call.type} call from {call.fromName}</p>
      <div className="flex justify-around mt-2">
        <button
          onClick={() => {
            callSound.pause();
            callSound.currentTime = 0;
            onAccept();
          }}
          className="bg-[#1CBABA]/80 p-2 rounded hover:bg-[#1CBABA] cursor-pointer transition-colors duration-300 rounded-2xl"
        >
          Accept
        </button>
        <button
          onClick={() => {
            callSound.pause();
            callSound.currentTime = 0;
            onReject();
          }}
          className="bg-[#FFB700]/80 p-2 rounded hover:bg-[#FFB700] cursor-pointer transition-colors duration-300 rounded-2xl"
        >
          Decline
        </button>
      </div>
    </div>
  );
};
