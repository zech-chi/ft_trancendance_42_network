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
import { fetchWithAuth } from '@/utils/fetchWithAuth';


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
      console.log("Fetched friends data:", data);
      if (Array.isArray(data)) {
        setFriends(data);
      } else if (Array.isArray(data.friends)) {
        setFriends(data.friends);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // fetch current user only once
  // useEffect(() => {
  //   const init = async () => {
  //     const res = await fetchWithAuth("http://localhost:5500/test-user", {
  //       
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
          console.log("Fetched user:", user);
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
  //   console.log(`🎯 Attempting to invite friend ${friendId}, current state:`, currentState.status);
    
  //   if (currentState.status !== 'idle') {
  //     console.log(`⚠️ Invitation already in progress for friend ${friendId}:`, currentState.status);
  //     return; // Empêcher les clics multiples
  //   }
    
  //   // Marquer comme "sending" immédiatement
  //   console.log(`🔄 Setting state to 'sending' for friend ${friendId}`);
  //   updateInviteStatus(friendId, 'sending');
    
  //   console.log(`📤 Emitting send_invite event for friend ${friendId}`);
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
      console.error("loggedUserId is null, cannot send invite.");
    }
  };

  const handleCancelInvite = (friendId: number) => {
    const currentState = getInviteStatus(friendId);
    
    // Only cancel if there's actually a pending invitation
    if (currentState.status === 'pending' && currentState.inviteId) {
      console.log(`❌ Cancelling invitation ${currentState.inviteId} to friend ${friendId}`);
      
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
        <p className="text-white text-lg">Loading... in PONG</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center items-center z-10 container mx-auto px-4 py-8">
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Invite a Friend To play
          </h1>
          {/* Bouton de test temporaire */}
          {/* <button
            onClick={() => {
              socket?.emit("cleanup_orphaned_states");
              toast("🧹 Forcing cleanup...", { duration: 2000 });
            }}
            className="mt-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            🧹 Force Cleanup Now
          </button>
          
          {/* Test force leave button */}
          {/* <button
            onClick={() => {
              if (friends.length > 0) {
                socket?.emit("debug_force_leave", { targetUserId: friends[0].id });
                toast("🐛 Testing force leave...", { duration: 2000 });
              }
            }}
            className="mt-2 ml-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-sm"
          >
            🐛 Test Force Leave (First Friend)
          </button>  */}
          
          {/* Test cancel invitation button */}
          {/* <button
            onClick={() => {
              if (friends.length > 0) {
                const friend = friends[0];
                const inviteState = getInviteStatus(friend.id);
                if (inviteState.status === 'pending' && inviteState.inviteId) {
                  socket?.emit("cancel_invite", {
                    targetUserId: friend.id,
                    inviteId: inviteState.inviteId
                  });
                  toast("🧪 Testing invite cancellation...", { duration: 2000 });
                } else {
                  toast("🧪 No pending invitation to cancel", { duration: 2000 });
                }
              }
            }}
            className="mt-2 ml-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded text-sm"
          >
            🧪 Test Cancel Invite
          </button> */}
        </div>

        {friends.length === 0 ? (
          <p className="text-center text-white">No friends found.</p>
        ) : (
          <ul className="flex flex-col gap-5 items-center justify-center">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="flex justify-between items-center w-125 h-20 border-2 rounded-full"
              >
                <div className="flex items-center ml-4 gap-2">
                  <img
                    // src="/images/tkannane.jpeg"
                    src={friend.imageUrl}
                    className="w-15 h-15 rounded-full border-2"
                    alt="Profile"
                  />
                  <div>
                    <p className="font-bold text-white">{friend.fullName}</p>
                    <p className="font-serif text-gray-400">@{friend.userName}</p>
                  </div>
                </div>
                <InviteStatusButton
                  friendId={friend.id}
                  friendName={friend.fullName}
                  inviteState={getInviteStatus(friend.id)}
                  onInvite={() => handleInviteClick(friend.id)}
                  onCancel={() => handleCancelInvite(friend.id)}
                  showDebug={false} // Debug désactivé pour la production
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
