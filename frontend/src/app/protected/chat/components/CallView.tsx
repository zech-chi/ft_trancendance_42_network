"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import CallTimer from "./CallTimer";

interface CallViewProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
  contactName: string;
  type: "audio" | "video";
  avatar?: string;
  isCallStarted?: boolean; // Optional prop to indicate if the call is active
}

export const CallView: React.FC<CallViewProps> = ({
  localStream,
  remoteStream,
  onEndCall,
  contactName,
  type,
  avatar = "",
  isCallStarted,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);

  const toggleMic = () => {
    if (!localStream) return;
    alert("toggle mic");
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      alert("the mic is now " + (isMicMuted ? "unmuted" : "muted"));
      const isEnabled = audioTracks[0].enabled;
      audioTracks[0].enabled = !isEnabled;
      setIsMicMuted(prev => !prev);
    }
  };


  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      console.warn("Local video stream set successfully.", localStream.id);
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.warn("Remote video stream set successfully.", remoteStream.id);
    }
  }, [remoteStream]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-2xl">
      {/* Remote Video (Full screen) */}
      <div className="absolute top-[5%] right-1/2 translate-x-1/2 text-yellow-300 text-lg font-bold py-1 px-2 bg-[rgba(0,0,0,0.7)] rounded-[10px]">
        <h2>{contactName}</h2>
      </div>
      { !isCallStarted && <p>calling...</p> }
      { isCallStarted && <CallTimer/> }

      {/* show  the time just if the call start */}

      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full"
      />

      {/* Local Video (Picture-in-picture style) */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted // Your own video should be muted to prevent echo
        className={`absolute bottom-15 right-4 w-[40%] md:w-[25%] rounded-lg border-2 border-white shadow-lg  transform -scale-x-100 ${type === "video" ? "" : "hidden"}`}
      />

      {/* Call Controls */}
      <div className="absolute bottom-20 left-[10%] md:left-[50%] flex items-center justify-center gap-4">
        <button
          onClick={onEndCall}
          className="bg-[#FFB700] rounded-full p-3 hover:bg-[#FFB700] transition-colors cursor-pointer"
          title="End Call"
        >
          <PhoneOff size={28} className="text-white" />
        </button>
        {/* You can add Mute/Unmute and Video On/Off buttons here */}
        {/* add the button of mute/umute */}
        <button onClick={toggleMic} title={isMicMuted ? "Unmute" : "Mute"} 
          className={`border cursor-pointer ${isMicMuted ? "border-[#FFB700]" : "border-[#1CBABA]"} rounded-full p-3`}>
          {isMicMuted ? (
            <MicOff size={28} className="text-[#FFB700]" />
          ) : (
            <Mic size={28} className="text-[#1CBABA]" />
          )}
        </button>
      </div>
      <div className={` ${type === "audio" ? "" : "hidden"}
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg`}>
        <p className="text-white">
          {type === "audio" ? "call audio" : "call video"}
        </p>
        <img src={avatar} alt="profile Frineds" className="rounded-full" />
      </div>
    </div>
  );
};
