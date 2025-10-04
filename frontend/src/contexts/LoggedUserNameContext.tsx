'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoggedUserNameContextType {
  loggedUserName: string | null;
  setLoggedUserName: (name: string | null) => void;
};

const LoggedUserNameContext = createContext<LoggedUserNameContextType | undefined>(undefined);

export const LoggedUserNameProvider = ({ children } : { children : ReactNode }) => {
    const [loggedUserName, setLoggedUserName] = useState<string | null>(null);

    return (
        <LoggedUserNameContext.Provider value={{ loggedUserName, setLoggedUserName }}>
            {children}
        </LoggedUserNameContext.Provider>
    );
};

export const useLoggedUserName = () => {
    const context = useContext(LoggedUserNameContext);
    if (!context) {
        throw new Error('useLoggedUserName must be used within a UserNameProvider');
    }
    return context;
};