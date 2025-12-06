"use client";

import { useInvite } from "../context/InviteContext";
import { useSocket } from "../context/SocketContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InviteStatusButton from "./InviteStatusButton";
import { useInviteTimer } from "../hooks/useInviteTimer";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { fetchUser } from "@/app/(auth)/login/page";
import { useRouter } from "next/navigation";
import { handleInvite } from "../utils/handleInvite";
import { fetchWithAuth } from "@/utils/fetchWithAuth";


interface User {
  id: number;
  userName: string;
  name: string;
  iat: number;
  game: string;
}

interface TestUserResponse {
  user: User | null; // null if not authenticated
  authenticated: boolean;
}
interface Friend {
  id: number;
  userName: string;
  fullName: string;
  imageUrl: string;
}

export default function InviteToPlay() {
  const { socket } = useSocket();
  // use the logged userId from the context
  const { loggedUserId, setLoggedUserId } = useLoggedUserId();
  const { loggedUserName, setLoggedUserName } = useLoggedUserName();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [friends, setFriends] = useState<Friend[]>([]);
  const { updateInviteStatus, getInviteStatus, setInviteStates } = useInvite();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Activer le système de timer pour les invitations
  useInviteTimer();

  const listFriends = async (): Promise<void> => {
    try {
      const response = await fetchWithAuth(`/api/pong/friends/${loggedUserId}`, {
      });

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      //console.log("Fetched friends data:", data);
      if (Array.isArray(data)) {
        setFriends(data);
      } else if (Array.isArray(data.friends)) {
        setFriends(data.friends);
      } else {
        setFriends([]);
      }
    } catch (error) {
      //console.error("Error fetching friends:", error);
    }
  };

  // fetch current user only once
  // useEffect(() => {
  //   const init = async () => {
  //     const res = await fetch("http://localhost:5500/test-user", {
  //       credentials: "include",
  //     });
  //     const dataUser: TestUserResponse = await res.json();
  //     if (!dataUser.authenticated) return;
  //     setCurrentUser(dataUser.user);
  //   };

  //   init();
  // }, []);

  useEffect(() => {
    if (loggedUserId)  {
      setLoading(false);
      return;
    }
      async function checkAuth() {
          const user = await fetchUser();
          //console.log("Fetched user:", user);
          if (!user || !user.userName) {
              setLoggedUserName(null);
              setLoggedUserId(0);
              router.push("/login");
          } else {
              setLoggedUserName(user.userName);
              setLoggedUserId(user.id);
          }
          setLoading(false);
        }
        checkAuth();
  }, []);

  // fetch friends on mount
  useEffect(() => {
    if (loggedUserId) {
      listFriends();
    }
    // listFriends();
  }, [loggedUserId]);

  // Réinitialiser les états d'invitation au montage du composant
  useEffect(() => {
    // Réinitialiser tous les états d'invitation quand on arrive sur cette page
    // Cela garantit qu'on repart toujours avec un état propre
    setInviteStates({});
  }, [setInviteStates]); // Se déclenche seulement au montage

  // const handleInvite = (friendId: number) => {
  //   // Vérifier si une invitation est déjà en cours pour cet ami
  //   const currentState = getInviteStatus(friendId);
  //   //console.log(`🎯 Attempting to invite friend ${friendId}, current state:`, currentState.status);
    
  //   if (currentState.status !== 'idle') {
  //     //console.log(`⚠️ Invitation already in progress for friend ${friendId}:`, currentState.status);
  //     return; // Empêcher les clics multiples
  //   }
    
  //   // Marquer comme "sending" immédiatement
  //   //console.log(`🔄 Setting state to 'sending' for friend ${friendId}`);
  //   updateInviteStatus(friendId, 'sending');
    
  //   //console.log(`📤 Emitting send_invite event for friend ${friendId}`);
  //   socket?.emit("send_invite", {
  //     from: loggedUserId,
  //     fromName: loggedUserName,
  //     to: friendId,
  //     game: "Ping Pong",
  //   });
    
  //   toast.success("Invitation sent!", {
  //     position: "top-right",
  //     duration: 2000,
  //   });
  // };

  const handleInviteClick = (friendId: number) => {
    if (loggedUserId !== null) {
      handleInvite({
        socket,
        loggedUserId,
        loggedUserName,
        friendId,
        getInviteStatus,
        updateInviteStatus,
      });
    } else {
      //console.error("loggedUserId is null, cannot send invite.");
    }
  };

  const handleCancelInvite = (friendId: number) => {
    const currentState = getInviteStatus(friendId);
    
    // Only cancel if there's actually a pending invitation
    if (currentState.status === 'pending' && currentState.inviteId) {
      //console.log(`❌ Cancelling invitation ${currentState.inviteId} to friend ${friendId}`);
      
      // Send cancel request to backend
      socket?.emit("cancel_invite", {
        targetUserId: friendId,
        inviteId: currentState.inviteId
      });
      
      toast("Cancelling invitation...", {
        position: "top-right",
        duration: 2000,
        icon: "❌",
      });
    } else {
      // Just reset local state if no backend invitation to cancel
      updateInviteStatus(friendId, 'idle');
      toast("Invitation cancelled", {
        position: "top-right",
        duration: 2000,
        icon: "❌",
      });
    }
  };

  // Écouter les réponses d'invitation pour mettre à jour les statuts
  useEffect(() => {
    if (!socket) return;

    // ⚠️ SUPPRIMÉ : Les écouteurs sont maintenant centralisés dans Notifications.tsx
    // pour éviter les conflits d'états
    
    return () => {
      // Cleanup si nécessaire
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center items-center z-10 w-full px-2 sm:px-4 py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="inline-block mb-2 sm:mb-3 md:mb-4">
            <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto bg-[#1CBABA] rounded-full flex items-center justify-center shadow-lg transition-all">
              <svg className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 md:mb-3 px-2">
            Invite Friends to Play
          </h1>
          <p className="text-white/70 text-xs xs:text-sm sm:text-base md:text-lg px-2">
            Select a friend and challenge them to a game!
          </p>
        </div>

        {/* Friends List - Enhanced Responsive */}
        <div className="bg-black/40 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl border border-white/20">
          {friends.length === 0 ? (
            <div className="text-center py-6 xs:py-8 sm:py-12 md:py-16">
              <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-2 xs:mb-3 sm:mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-white/60 text-xs xs:text-sm sm:text-base md:text-lg px-2">No friends found.</p>
              <p className="text-white/40 text-xs sm:text-sm mt-1 sm:mt-2 px-2">Add some friends to start playing together!</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              {friends.map((friend, index) => (
                <li
                  key={friend.id}
                  className="group relative flex flex-row justify-between items-center w-full border border-white/10 hover:border-white/30 rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-full p-2 xs:p-2.5 sm:p-2 sm:pr-3 md:pr-4 gap-2 bg-gradient-to-r from-black/40 to-black/20 hover:from-black/60 hover:to-black/40 transition-all duration-300 hover:shadow-lg animate-slideIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 min-w-0 flex-1 z-10">
                    <div className="relative flex-shrink-0">
                      <img
                        src={friend.imageUrl}
                        className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-white/20"
                        alt="Profile"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-xs xs:text-sm sm:text-base md:text-lg truncate">
                        {friend.fullName}
                      </p>
                      <p className="font-serif text-gray-400 text-xs sm:text-sm truncate group-hover:text-gray-300 transition-colors">
                        @{friend.userName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative flex justify-end w-auto min-w-[100px] xs:min-w-[120px] sm:min-w-[140px] z-10">
                    <InviteStatusButton
                      friendId={friend.id}
                      friendName={friend.fullName}
                      inviteState={getInviteStatus(friend.id)}
                      onInvite={() => handleInviteClick(friend.id)}
                      onCancel={() => handleCancelInvite(friend.id)}
                      showDebug={false}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
