//  this context is used to provide the socket instance and online users to the components
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {io ,Socket } from 'socket.io-client';
import { SocketContextType } from '../types/typesChat';
import { useUser } from './UserContext';
import { host } from '@/app/protected/chat/utils/ApiRoutes';
import { useLoggedUserId } from '@/context/UserIdContext';

const SocketContext = createContext<SocketContextType | null>(null);

// this hook is used to provide the socket instance and online users to the components
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// this component is used to provide the socket instance and online users to the components
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    // const { userId } = useUser() as { userId: number | null };
    const { loggedUserId: userId } = useLoggedUserId() as { loggedUserId: number | null };
    
    useEffect(() => {
        if (!userId) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            console.log("No user ID found, socket disconnected.");
            return
        }

        const newSocket = io({
            path: "/socket.io/chat",
            query: { userId: userId.toString() },
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(`Socket connected with ID: ${newSocket.id}`);
        });

        newSocket.on('onlineUsers', (users: string[]) => {
            setOnlineUsers(users);
            console.log("Updated online users:", users);
        });

        return () => {
            newSocket.disconnect();
            newSocket.off('getOnlineUsers');
            console.log("Socket disconnected");
        };
       
    }, [userId]);
    
    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
        {children}
        </SocketContext.Provider>
    );
}