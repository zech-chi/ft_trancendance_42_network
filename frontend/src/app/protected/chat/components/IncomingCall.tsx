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
      console.error("Error initializing call sound:", error);
    }
    return () => {
      callSound.pause();
      callSound.currentTime = 0;  // reset audio
    };
  }, []);

  return (
    <div className="fixed top-[5%] right-[10%] bg-[rgba(0,0,0,0.4)] border border-yellow-100 text-white p-2 rounded-lg shadow-lg z-50 backdrop-blur-sm">
      <p>Incoming {call.type} call from {call.fromName}</p>
      <div className="flex justify-around mt-2">
        <button
          onClick={() => {
            callSound.pause();
            callSound.currentTime = 0;
            onAccept();
          }}
          className="bg-green-500 p-2 rounded hover:bg-green-700 transition-colors duration-300"
        >
          Accept
        </button>
        <button
          onClick={() => {
            callSound.pause();
            callSound.currentTime = 0;
            onReject();
          }}
          className="bg-red-500 p-2 rounded hover:bg-red-700"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

// export const IncomingCall = ({ call, onAccept, onReject }: IncomingCallProps) => (
//   console.log('IncomingCall component rendered with call:', call),
//   <div className="fixed top-[5%] right-[10%] bg-[rgba(0,0,0,0.4)] border border-yellow-100 text-white p-2 rounded-lg shadow-lg z-50 backdrop-blur-sm">
//     <p>Incoming {call.type} call from {call.fromName}</p>
//     <div className="flex justify-around mt-2">
//       <button onClick={onAccept} className="bg-green-500 p-2 rounded hover:bg-green-700 transition-colors duration-300">Accept</button>
//       <button onClick={onReject} className="bg-red-500 p-2 rounded hover:bg-red-700">Decline</button>
//     </div>
//   </div>
// );