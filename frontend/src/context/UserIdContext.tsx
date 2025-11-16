'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoggedUserIdContextType {
  loggedUserId: number | null;
  setLoggedUserId: (id: number | null) => void;
};

const LoggedUserIdContext = createContext<LoggedUserIdContextType | undefined>(undefined);

export const LoggedUserIdProvider = ({ children } : { children : ReactNode }) => {
    const [loggedUserId, setLoggedUserId] = useState<number | null>(null);

    return (
        <LoggedUserIdContext.Provider value={{ loggedUserId, setLoggedUserId }}>
            {children}
        </LoggedUserIdContext.Provider>
    );
};

export const useLoggedUserId = () => {
    const context = useContext(LoggedUserIdContext);
    if (!context) {
        throw new Error('useLoggedUserId must be used within a UserIdProvider');
    }
    return context;
};