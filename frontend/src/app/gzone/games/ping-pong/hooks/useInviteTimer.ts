// hooks/useInviteTimer.ts
'use client';

import { useEffect } from 'react';
import { useInvite } from '../context/InviteContext';

export const useInviteTimer = () => {
  const { inviteStates, updateInviteStatus } = useInvite();

  useEffect(() => {
    const intervals: { [key: number]: NodeJS.Timeout } = {};

    // Pour chaque invitation en cours, démarrer un timer si nécessaire
    Object.entries(inviteStates).forEach(([friendIdStr, state]) => {
      const friendId = parseInt(friendIdStr);
      
      if (state.status === 'pending' && state.expiresAt) {
        const timeLeft = state.expiresAt - Date.now();
        
        if (timeLeft > 0) {
          // Programmer l'expiration
          intervals[friendId] = setTimeout(() => {
            updateInviteStatus(friendId, 'expired');
            
            // Remettre à 'idle' après 5 secondes
            setTimeout(() => {
              updateInviteStatus(friendId, 'idle');
            }, 5000);
          }, timeLeft);
        } else {
          // Déjà expiré
          updateInviteStatus(friendId, 'expired');
        }
      }
    });

    // Nettoyer les timers à la fin
    return () => {
      Object.values(intervals).forEach(interval => {
        clearTimeout(interval);
      });
    };
  }, [inviteStates, updateInviteStatus]);
};
