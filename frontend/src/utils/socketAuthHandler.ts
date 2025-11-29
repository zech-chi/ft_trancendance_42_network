/**
 * Socket.IO helper to handle authentication errors and token refresh
 * Add this to your socket initialization to automatically refresh tokens on auth errors
 */

import { Socket } from 'socket.io-client';

export function setupSocketAuthHandler(socket: Socket) {
  // Handle authentication errors
  socket.on('connect_error', async (error) => {
    if (error.message.includes('401') || error.message.includes('403') || 
        error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
      console.log('Socket authentication error. Attempting token refresh...');
      
      try {
        // Try to refresh the token
        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshRes.ok) {
          console.log('Token refreshed successfully. Reconnecting socket...');
          // Reconnect the socket with the new token
          socket.connect();
        } else {
          console.warn('Token refresh failed. Redirecting to login...');
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Error refreshing token:', err);
        window.location.href = '/login';
      }
    }
  });

  // Handle explicit unauthorized errors from server
  socket.on('unauthorized', async () => {
    console.log('Socket unauthorized event. Attempting token refresh...');
    
    try {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        console.log('Token refreshed. Reconnecting socket...');
        socket.disconnect();
        socket.connect();
      } else {
        console.warn('Token refresh failed. Redirecting to login...');
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Error refreshing token:', err);
      window.location.href = '/login';
    }
  });

  return socket;
}
