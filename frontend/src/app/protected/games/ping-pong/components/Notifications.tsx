"use client";
import { useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";
import { useInvite, InviteState } from "../context/InviteContext";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  name?: string;
  iat?: number;
  game?: string;
}

export default function Notifications() {
  const router = useRouter();
  const { socket, isConnected, currentUser } = useSocket();
  const { updateInviteStatus, setInviteStates } = useInvite();

  // Fonction stable pour réinitialiser tous les états d'invitation
  const resetAllInviteStates = useCallback(() => {
    setInviteStates(prev => {
      const resetStates: { [friendId: number]: InviteState } = {};
      Object.keys(prev).forEach(friendId => {
        resetStates[Number(friendId)] = { status: 'idle' };
      });
      return resetStates;
    });
  }, [setInviteStates]);

  // 1. Gérer la réception des invitations
  useEffect(() => {
    if (!socket || !isConnected || !currentUser) {
      console.log("Waiting for socket/user to be ready for invite listener.");
      return;
    }

    const handleReceiveInvite = ({ from, fromName, message, inviteId }: { from: User; fromName: string; message: string; inviteId: string }) => {
      //  alert("handleReceiveInvite called" + fromName); 
      console.log(`📩 Invitation received from ${fromName}`, from, "inviteId:", inviteId);

      toast.custom((t) => (
        <div className={`${t.visible ? "animate-custom-enter" : "animate-custom-leave"} max-w-md w-full bg-black/20 backdrop-blur-xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-xl font-bold text-white">
                  Invitation from {fromName}
                </p>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                console.log(`✅ Accepting invite from ${fromName}`, "inviteId:", inviteId);
                socket.emit("accept_invite", {
                  inviter: from,
                  inviterName: fromName,
                  accepter: currentUser,
                  inviteId: inviteId,
                });
                toast.dismiss(t.id);
              }}
              className="p-4 font-bold text-green-600 hover:text-green-800 cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={() => {
                console.log(`❌ Declining invite from ${fromName}`, "inviteId:", inviteId);
                socket.emit("decline_invite", {
                  decliner: currentUser,
                  inviter: from,
                  inviteId: inviteId,
                });
                toast.dismiss(t.id);
              }}
              className="p-4 font-bold text-red-600 hover:text-red-800 cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      ));
    };

    socket.on("receive_invite", handleReceiveInvite); 
    console.log("Listening for 'receive_invite' events.");
    
    return () => {
      socket.off("receive_invite", handleReceiveInvite);
    };
  }, [socket, isConnected, currentUser]);

  // 2. Gérer les déclins d'invitation
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("Waiting for socket to be ready for decline listener.", socket, isConnected  );
      return;
    }

    const handleDecline = ({ from, message }: { from: User; message: string }) => {
      console.log(`Decline received from ${from.username}: ${message}`);
      toast.error(`${message}`, { position: "top-right", duration: 9000 });
      updateInviteStatus(from.id, 'declined');
    };

    socket.on("receive_decline", handleDecline);
    console.log("Listening for 'receive_decline' events.");

    return () => {
      socket.off("receive_decline", handleDecline);
    };
  }, [socket, isConnected, updateInviteStatus]);

  // 3. CORRECTION CRUCIALE : Écouter game_started pour la redirection
  useEffect(() => {
    if (!socket || !isConnected || !router) return;

    const handleGameStarted = ({ roomId }: { roomId: string; opponent: User }) => {
      console.log("✅ Game started received, redirecting to:", `/game/${roomId}`);
      toast.dismiss(); // Fermer toutes les toasts
      router.push(`/protected/games/ping-pong/modes/${roomId}`);
    };

    socket.on("game_started", handleGameStarted);

    return () => {
      socket.off("game_started", handleGameStarted);
    };
  }, [socket, isConnected, router]);

  // 4. Handle game errors
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleGameError = (error: { message?: string } | string | unknown) => {
      let errorMessage = "Unknown game error";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error && typeof (error as { message?: string }).message === "string") {
        errorMessage = (error as { message: string }).message;
      } else if (error && typeof error === "object") {
        errorMessage = JSON.stringify(error);
      }
      
      console.error("❌ Game error received:", errorMessage);
      toast.error(`Game Error: ${errorMessage}`, {
        position: "top-right",
        duration: 5000,
      });
    };

    socket.on("game_error", handleGameError);

    return () => {
      socket.off("game_error", handleGameError);
    };
  }, [socket, isConnected, resetAllInviteStates]);

  // 5. Gérer l'expiration des invitations
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleInviteExpired = ({ inviteId, to, reason }: { inviteId: string; to: number; reason: string }) => {
      console.log(`⏰ Invitation expired: ${inviteId}, reason: ${reason}`);
      updateInviteStatus(to, 'expired');
      
      toast("Invitation expired", {
        position: "top-right", 
        duration: 3000,
        icon: "⏰",
      });

      // Remettre à 'idle' après 5 secondes pour permettre une nouvelle invitation
      setTimeout(() => {
        updateInviteStatus(to, 'idle');
      }, 5000);
    };

    socket.on("invite_expired", handleInviteExpired);

    return () => {
      socket.off("invite_expired", handleInviteExpired);
    };
  }, [socket, isConnected, updateInviteStatus]);

  // 6. Gérer la fin de jeu pour réinitialiser les états d'invitation
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleGameEnded = ({ reason }: { reason: string; leftPlayer?: string; disconnectedPlayer?: string }) => {
      console.log(`🏁 Game ended: ${reason}`);
      
      // Quand un jeu se termine, réinitialiser tous les états d'invitation à 'idle'
      // car les joueurs sont maintenant disponibles pour de nouvelles invitations
      setTimeout(() => {
        // Utiliser un timeout court pour permettre aux autres événements de se traiter
        resetAllInviteStates();
      }, 1000);
    };

    socket.on("game_ended", handleGameEnded);

    return () => {
      socket.off("game_ended", handleGameEnded);
    };
  }, [socket, isConnected, resetAllInviteStates]);

  // 7. Gérer le départ d'un joueur pour réinitialiser les états d'invitation
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handlePlayerLeft = ({ leftPlayer }: { leftPlayer: string }) => {
      console.log(`👋 Player left: ${leftPlayer}`);
      
      // Réinitialiser tous les états d'invitation immédiatement
      resetAllInviteStates();
    };

    socket.on("player_left", handlePlayerLeft);

    return () => {
      socket.off("player_left", handlePlayerLeft);
    };
  }, [socket, isConnected, resetAllInviteStates]);

  // 8. Gérer le départ forcé d'un joueur (quand l'adversaire quitte)
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleForceLeaveGame = ({ reason, message }: { reason: string; message: string; timestamp: number }) => {
      console.log(`🚨 Force leave game: ${reason} - ${message}`);
      
      // Réinitialiser tous les états d'invitation immédiatement
      resetAllInviteStates();
      
      // Afficher un message à l'utilisateur
      toast(message, {
        position: "top-right",
        duration: 3000,
        icon: "🚪",
      });
      
      // Si l'utilisateur n'est pas déjà sur la page de jeu, le rediriger
      if (window.location.pathname.includes('/game/')) {
        router.push('/gameMode');
      }
    };

    socket.on("force_leave_game", handleForceLeaveGame);

    return () => {
      socket.off("force_leave_game", handleForceLeaveGame);
    };
  }, [socket, isConnected, resetAllInviteStates, router]);

  // 9. Gérer l'envoi confirmé des invitations
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleInviteSent = ({ to, inviteId }: { to: number; inviteId: string }) => {
      console.log(`✅ Invitation sent confirmed for user ${to}, inviteId: ${inviteId}`);
      
      updateInviteStatus(to, 'pending', {
        inviteId,
        expiresAt: Date.now() + 30000, // 30 secondes
      });
    };

    socket.on("invite_sent", handleInviteSent);

    return () => {
      socket.off("invite_sent", handleInviteSent);
    };
  }, [socket, isConnected, updateInviteStatus]);

  // 10. Gérer l'acceptation des invitations
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleInviteAccepted = ({ from }: { from: User }) => {
      console.log(`✅ Invitation accepted by ${from.username}`);
      updateInviteStatus(from.id, 'accepted');
      
      // Après 3 secondes, remettre à idle pour permettre de nouvelles invitations
      setTimeout(() => {
        updateInviteStatus(from.id, 'idle');
      }, 3000);
    };

    socket.on("invite_accepted", handleInviteAccepted);

    return () => {
      socket.off("invite_accepted", handleInviteAccepted);
    };
  }, [socket, isConnected, updateInviteStatus]);

  // 11. Gérer les erreurs d'invitation
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleInviteError = ({ message, to, currentState, targetState }: { 
      message: string; 
      to: number; 
      currentState?: string; 
      targetState?: string;
    }) => {
      console.error(`❌ Invite error for user ${to}: ${message}`);
      console.log(`Your state: ${currentState}, Target user state: ${targetState}`);
      
      // Remettre l'état à idle en cas d'erreur
      updateInviteStatus(to, 'idle');
      
      // Messages d'erreur plus informatifs selon le type d'erreur
      let userMessage = message;
      if (message.includes("currently in_game")) {
        userMessage = "This friend is currently playing. Try again later!";
      } else if (message.includes("offline")) {
        userMessage = "This friend is offline.";
      } else if (message.includes("already has a pending")) {
        userMessage = "This friend already has a pending invitation.";
      } else if (message.includes("cannot send invites while")) {
        userMessage = "You need to finish your current game first.";
      }
      
      // Afficher l'erreur à l'utilisateur
      toast.error(userMessage, {
        position: "top-right",
        duration: 5000,
      });
    };

    socket.on("invite_error", handleInviteError);

    return () => {
      socket.off("invite_error", handleInviteError);
    };
  }, [socket, isConnected, updateInviteStatus]);

  // 12. Gérer l'annulation des invitations
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleInviteCancelled = ({ reason, inviteId, message, from }: { 
      reason: string; 
      inviteId: string; 
      message: string;
      from: User;
    }) => {
      console.log(`❌ Invitation cancelled: ${inviteId}, reason: ${reason}`);
      
      // Update the invite status for the sender
      if (from) {
        updateInviteStatus(from.id, 'idle'); // Reset to idle immediately
      }
      
      // Show notification to the user
      toast(message, {
        position: "top-right",
        duration: 3000,
        icon: "❌",
      });
    };

    const handleInviteCancelConfirmed = ({ targetUserId, inviteId, message }: { 
      targetUserId: number; 
      inviteId: string; 
      message: string;
    }) => {
      console.log(`✅ Invitation cancel confirmed: ${inviteId} for user ${targetUserId}`);
      
      // Update local state to reflect cancellation
      updateInviteStatus(targetUserId, 'idle');
      
      toast(message, {
        position: "top-right",
        duration: 2000,
        icon: "✅",
      });
    };

    socket.on("invite_cancelled", handleInviteCancelled);
    socket.on("invite_cancel_confirmed", handleInviteCancelConfirmed);

    return () => {
      socket.off("invite_cancelled", handleInviteCancelled);
      socket.off("invite_cancel_confirmed", handleInviteCancelConfirmed);
    };
  }, [socket, isConnected, updateInviteStatus]);

  // Gérer la confirmation de nettoyage
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleCleanupCompleted = ({ message }: { message: string }) => {
      console.log("🧹 Cleanup completed:", message);
      
      toast("✅ Cleanup done! Try again.", {
        position: "top-right",
        duration: 3000,
        icon: "🧹",
      });
    };

    socket.on("cleanup_completed", handleCleanupCompleted);

    return () => {
      socket.off("cleanup_completed", handleCleanupCompleted);
    };
  }, [socket, isConnected]);

  // DEBUG TEMPORAIRE - Réactivé pour diagnostiquer le problème
  useEffect(() => {
    if (!socket || !isConnected) return;

    const debugAllEvents = (eventName: string) => (data: unknown) => {
      console.log(`🔍 DEBUG Event received: ${eventName}`, data);
    };

    // Écouter tous les événements liés aux invitations
    socket.on("invite_sent", debugAllEvents("invite_sent"));
    socket.on("invite_error", debugAllEvents("invite_error"));
    socket.on("receive_invite", debugAllEvents("receive_invite"));
    socket.on("invite_accepted", debugAllEvents("invite_accepted"));
    socket.on("receive_decline", debugAllEvents("receive_decline"));
    socket.on("invite_expired", debugAllEvents("invite_expired"));
    socket.on("invite_cancelled", debugAllEvents("invite_cancelled"));
    socket.on("invite_cancel_confirmed", debugAllEvents("invite_cancel_confirmed"));
    socket.on("game_started", debugAllEvents("game_started"));
    socket.on("game_ended", debugAllEvents("game_ended"));
    socket.on("force_leave_game", debugAllEvents("force_leave_game"));

    return () => {
      socket.off("invite_sent", debugAllEvents("invite_sent"));
      socket.off("invite_error", debugAllEvents("invite_error"));
      socket.off("receive_invite", debugAllEvents("receive_invite"));
      socket.off("invite_accepted", debugAllEvents("invite_accepted"));
      socket.off("receive_decline", debugAllEvents("receive_decline"));
      socket.off("invite_expired", debugAllEvents("invite_expired"));
      socket.off("invite_cancelled", debugAllEvents("invite_cancelled"));
      socket.off("invite_cancel_confirmed", debugAllEvents("invite_cancel_confirmed"));
      socket.off("game_started", debugAllEvents("game_started"));
      socket.off("game_ended", debugAllEvents("game_ended"));
      socket.off("force_leave_game", debugAllEvents("force_leave_game"));
    };
  }, [socket, isConnected]);

  return null;
}