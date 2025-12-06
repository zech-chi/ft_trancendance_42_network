// components/InviteStatusButton.tsx
'use client';

import { useEffect, useState } from "react";
import { InviteState } from "../context/InviteContext";
import { useSocket } from "../context/SocketContext";

interface InviteStatusButtonProps {
  friendId: number;
  friendName: string;
  inviteState: InviteState;
  onInvite: () => void;
  onCancel: () => void;
  showDebug?: boolean; // Pour afficher les options de debug
}

export default function InviteStatusButton({ 
  friendId, 
  friendName, 
  inviteState, 
  onInvite, 
  onCancel,
  showDebug = false
}: InviteStatusButtonProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { socket } = useSocket();

  // Fonction pour vérifier l'état de l'ami
  const checkFriendState = () => {
    if (socket) {
      //console.log(`🔍 Checking state for friend ${friendId}`);
      socket.emit("check_user_state", { userId: friendId });
    }
  };

  useEffect(() => {
    if (inviteState.status === 'pending' && inviteState.expiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, inviteState.expiresAt! - Date.now());
        setTimeLeft(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [inviteState.expiresAt, inviteState.status]);

  const renderButton = () => {
    switch (inviteState.status) {
      case 'idle':
        return (
          <div className="mr-4 flex items-center">
            <button
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={onInvite}
              title={`Invite ${friendName} to play`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 28"
                width={42}
                height={28}
                className="fill-white hover:fill-green-400"
              >
                <path d="M11.0905 0C6.57855 0 0 8.75345 0 19.7712C0 23.2229 2.44529 28 5.13447 28C10.5193 28 11.5333 22.1584 21 22.1584C30.4667 22.1584 31.4807 28 36.8655 28C39.5547 28 42 23.2229 42 19.7712C42 8.75345 35.4215 0 30.9095 0C26.3976 0 25.5119 3.33643 21 3.33643C16.4881 3.33643 15.6024 0 11.0905 0ZM30.4474 6.46154C30.5822 6.43393 30.717 6.46154 30.8582 6.46154C32.0006 6.46154 32.912 7.43491 32.912 8.67061C32.912 9.90632 32.0006 10.8797 30.8582 10.8797C29.7158 10.8797 28.8044 9.90632 28.8044 8.67061C28.8044 7.59369 29.504 6.66864 30.4474 6.46154ZM9.49878 6.90336H12.7848V10.4379H16.0709V13.9724H12.7848V17.5069H9.49878V13.9724H6.21271V10.4379H9.49878V6.90336ZM27.1614 9.99606C27.2961 9.96844 27.4309 9.99606 27.5721 9.99606C28.721 9.99606 29.6259 10.9694 29.6259 12.2051C29.6259 13.4408 28.721 14.4142 27.5721 14.4142C26.4233 14.4142 25.5183 13.4339 25.5183 12.2051C25.5183 11.1282 26.2115 10.2032 27.1614 9.99606ZM33.7335 9.99606C33.8683 9.96844 34.0031 9.99606 34.1443 9.99606C35.2931 9.99606 36.198 10.9694 36.198 12.2051C36.198 13.4408 35.2931 14.4142 34.1443 14.4142C32.9954 14.4142 32.0905 13.4408 32.0905 12.2051C32.0905 11.1282 32.7836 10.2032 33.7335 9.99606ZM30.4474 13.5306C30.5822 13.503 30.717 13.5306 30.8582 13.5306C32.007 13.5306 32.912 14.5039 32.912 15.7396C32.912 16.9753 32.0006 17.9487 30.8582 17.9487C29.7158 17.9487 28.8044 16.9753 28.8044 15.7396C28.8044 14.6558 29.504 13.7377 30.4474 13.5306Z" />
              </svg>
            </button>
            {showDebug && (
              <button
                onClick={checkFriendState}
                className="ml-2 text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded"
                title="Check friend's state"
              >
                🔍
              </button>
            )}
          </div>
        );

      case 'sending':
        return (
          <div className="mr-4 flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-sm text-blue-400">Sending...</span>
          </div>
        );

      case 'pending':
        return (
          <div className="mr-4 flex flex-col items-center">
            <div className="flex items-center mb-1">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-4 border-orange-200">
                  <div 
                    className="w-full h-full rounded-full border-4 border-orange-500 border-t-transparent animate-pulse"
                    style={{
                      transform: `rotate(${((30 - timeLeft) / 30) * 360}deg)`
                    }}
                  ></div>
                </div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-orange-500">
                  {timeLeft}
                </span>
              </div>
              <button
                onClick={onCancel}
                className="ml-2 hover:scale-110 transition-transform"
                title="Cancel invitation"
              >
                <img src="/images/cancel.png" className="w-5 h-5" alt="Cancel" />
              </button>
            </div>
            <span className="text-xs text-orange-400">Pending...</span>
          </div>
        );

      case 'accepted':
        return (
          <div className="mr-4 flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-2 text-sm text-green-400">Accepted!</span>
          </div>
        );

      case 'declined':
        return (
          <div className="mr-4 flex flex-col items-center">
            <div className="flex items-center mb-1">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <button
                onClick={onInvite}
                className="ml-2 hover:scale-110 transition-transform"
                title="Send another invitation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  className="fill-gray-400 hover:fill-white"
                >
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
            <span className="text-xs text-red-400">Declined</span>
          </div>
        );

      case 'expired':
        return (
          <div className="mr-4 flex flex-col items-center">
            <div className="flex items-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <button
                onClick={onInvite}
                className="ml-2 hover:scale-110 transition-transform"
                title="Send another invitation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  className="fill-gray-400 hover:fill-white"
                >
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
            <span className="text-xs text-gray-400">Expired</span>
          </div>
        );

      default:
        return null;
    }
  };

  return renderButton();
}
