// hooks/useCall.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { IncomingCall } from "@/app/protected/chat/types/typesChat";
import { useAudioContext } from "../context/AudioPlayerContext";
import { FromHalfFloat } from "@babylonjs/core";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// add Timeout for the call
const CALL_TIMEOUT = 15000; // 15 seconds
export function useCall(currentUserId: number | null, currentName: string) {
  const { socket } = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const activePeerIdRef = useRef<string | null>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the timeout
  const [type, setType] = useState<"audio" | "video">("audio");
  const [isCallStarted, setIsCallStarted] = useState(false);

  const { setPlayingId } = useAudioContext();

  // --- Core Functions ---

  const clearCallTimeout = useCallback(() => {
    if (callTimeoutRef.current) {
      // alert("timeout cleared successfully.");
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
  }, []);

  const closeCall = useCallback(() => {
    clearCallTimeout(); // Clear any existing timeout
    localStream?.getTracks().forEach(t => t.stop());
    remoteStream?.getTracks().forEach(t => t.stop());
    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach(sender => {
        if (sender.track) sender.track.stop();
      });
    }
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setIsCallStarted(false);
    setIncomingCall(null);
    setType("audio");
    // alert("Call ended successfully.");
    // Reset the active peer ID
    activePeerIdRef.current = null;
  }, [localStream]);

  const createPeerConnection = useCallback((otherUserId: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice-candidate", { to: otherUserId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    return pc;
  }, [socket]);

  // --- Public Functions (to be returned by the hook) ---

  const startCall = useCallback(async (contactId: number, type: "audio" | "video") => {
    if (!socket || !currentUserId) return;
    // pause all audio tracks when starting a call
    setPlayingId(null); // Clear the currently playing audio

    try {
      if(type === 'video') {
        setType("video");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        
        video: type === 'video',
        audio: true,
      });
      setLocalStream(stream);
      setIsCallActive(true);

      const pc = createPeerConnection(contactId.toString());
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // save the id : activePeerIdRef.current = contactId.toString();
      activePeerIdRef.current = contactId.toString();

      socket.emit("call-user", { offer, to: contactId, from: currentUserId, type, fromName: currentName });

      // set timeout for the call
      console.warn("Call started. Waiting for the other user to answer...");

      callTimeoutRef.current = setTimeout(() => {
        // alert("Call timed out. No answer from the other user.");
        // const otherUserId = activePeerIdRef.current;
        // if(socket && otherUserId ) {
        //   socket.emit("end-call", { to: otherUserId });
        // }
        endCall();
      }, CALL_TIMEOUT); // 15 seconds timeout

    } catch (error) {
      console.error("Failed to start call:", error);
      closeCall();
    }
  }, [socket, currentUserId, createPeerConnection, closeCall]);

  const answerCall = useCallback(async () => {
    if (!socket || !incomingCall || !currentUserId) return;
    // pause all audio tracks when answering a call
    setPlayingId(null); // Clear the currently playing audio

    try {
      // alert("Answering call from " + incomingCall.type);
      if(incomingCall.type === 'video') {
        setType("video");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: incomingCall.type === 'video',
        audio: true,
      });
      setLocalStream(stream);
      setIsCallActive(true);
      
      const pc = createPeerConnection(incomingCall.from);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      // save the is : activePeerIdRef.current = incomingCall.from;
      activePeerIdRef.current = incomingCall.from;
      socket.emit("make-answer", { answer, to: incomingCall.from });
      setIsCallStarted(true);
      // alert("Call answered successfully." + isCallStarted);
      // setIncomingCall(null); // Clear the incoming call notification
    } catch (error) {
      console.error("Failed to answer call:", error);
      closeCall();
    }
  }, [socket, incomingCall, currentUserId, createPeerConnection, closeCall]);

  const rejectCall = useCallback(() => {
    if (socket && incomingCall) {
      socket.emit("call-rejected", { to: incomingCall.from });
    }
    setIncomingCall(null);
  }, [socket, incomingCall]);
  
  const endCall = useCallback(() => {
      const otherUserId = activePeerIdRef.current;
      console.warn("the user is =====>>>::", incomingCall);
      console.warn("Ending call with user:", otherUserId, isCallStarted);
      // alert("Ending call with user: " + otherUserId + isCallStarted);
      if(socket && otherUserId) {
          socket.emit("end-call", { to: otherUserId, from: currentUserId });
      }
      console.warn("Call ended by user.");
      setIncomingCall(null);
      activePeerIdRef.current = null;
      closeCall();
  }, [socket, closeCall, incomingCall]);

  // --- Socket Event Listeners ---
  useEffect(() => {
    if (!socket) return;

    const handleOffer = (data: IncomingCall) => {
      setIncomingCall(data);
    };
    const handleAnswer = (data: { answer: RTCSessionDescriptionInit }) => {
      clearCallTimeout();
      setIsCallStarted(true);
      peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
    };
    const handleIceCandidate = (data: { candidate: RTCIceCandidateInit }) => {
      peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
    };
    const handleCallRejected = () => {
        console.log("Call was rejected by the other user.");
        clearCallTimeout();
        closeCall();
    };

    const handleEndCall = (data: {from: string}) => {
      console.log("++++++++++=======> Call ended by the other user.", data.from);
      if (activePeerIdRef.current == data.from || activePeerIdRef.current === null) {
          closeCall();
      }
    }

    const handleBeforeUnload = () => {
      // Check if this user is in an active call
      console.log("=======> Handling beforeunload event.");
      const peerId = activePeerIdRef.current;
      if (peerId) {
        // If so, send a final "end-call" message to the other user.
        // This is a "best effort" attempt.
        socket.emit("end-call", { to: peerId, from: currentUserId });
      }
    };

    const handleCallAccepted = (data: { from: string, to?: string }) => {
      // Another session of this user accepted the call — clear incoming UI in this session
      console.log('call accepted event received', data);
      setIncomingCall(null);
      // Do NOT set this session to active — only the answering session should become active
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    socket.on("call-made", handleOffer);
    socket.on("answer-made", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("end-call", handleEndCall);

    return () => {
      socket.off("call-made", handleOffer);
      socket.off("answer-made", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("call-rejected", handleCallRejected);
      socket.off("end-call", handleEndCall);
      socket.off("call-accepted", handleCallAccepted);
      // clearCallTimeout(); // Clear the timeout when the component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, closeCall]);

  return {
    localStream,
    remoteStream,
    isCallActive,
    incomingCall,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    type,
    isCallStarted,
  };
}