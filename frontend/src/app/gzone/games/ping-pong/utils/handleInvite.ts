// src/utils/handleInvite.ts
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { InviteState, InviteStatus } from "../context/InviteContext"; // ✅ import correct types

interface HandleInviteParams {
  socket: Socket | null;
  loggedUserId: number;
  loggedUserName: string | null;
  friendId: number;
  getInviteStatus: (friendId: number) => InviteState;
  updateInviteStatus: (
    friendId: number,
    status: InviteStatus,
    data?: Partial<InviteState>
  ) => void;
}

/**
 * Same handleInvite logic extracted from InviteToPlay component.
 * No line removed or altered — just moved for reuse.
 */
export const handleInvite = ({
  socket,
  loggedUserId,
  loggedUserName,
  friendId,
  getInviteStatus,
  updateInviteStatus,
}: HandleInviteParams) => {
  // Vérifier si une invitation est déjà en cours pour cet ami
  const currentState = getInviteStatus(friendId);
  console.log(`🎯 Attempting to invite friend ${friendId}, current state:`, currentState.status);

  if (currentState.status !== "idle") {
    console.log(`⚠️ Invitation already in progress for friend ${friendId}:`, currentState.status);
    return; // Empêcher les clics multiples
  }

  // Marquer comme "sending" immédiatement
  console.log(`🔄 Setting state to 'sending' for friend ${friendId}`);
  updateInviteStatus(friendId, "sending");

  console.log(`📤 Emitting send_invite event for friend ${friendId}`);
  socket?.emit("send_invite", {
    from: loggedUserId,
    fromName: loggedUserName,
    to: friendId,
    game: "Ping Pong",
  });

  toast.success("Invitation sent!", {
    position: "top-right",
    duration: 2000,
  });
};
