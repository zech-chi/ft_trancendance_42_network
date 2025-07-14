'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserNameContextType {
  username: string | null;
  setUserName: (name: string | null) => void;
};

const UserNameContext = createContext<UserNameContextType | undefined>(undefined);

export const UserNameProvider = ({ children } : { children : ReactNode }) => {
    const [username, setUserName] = useState<string | null>(null);

    return (
        <UserNameContext.Provider value={{ username, setUserName }}>
            {children}
        </UserNameContext.Provider>
    );
};

export const useUserName = () => {
    const context = useContext(UserNameContext);
    if (!context) {
        throw new Error('useUserName must be used within a UserNameProvider');
    }
    return context;
};