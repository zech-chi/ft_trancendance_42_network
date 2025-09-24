'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedUserNameContextType {
  selectedUserName: string | null;
  setSelectedUserName: (name: string | null) => void;
};

const SelectedUserNameContext = createContext<SelectedUserNameContextType | undefined>(undefined);

export const SelectedUserNameProvider = ({ children } : { children : ReactNode }) => {
    const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

    return (
        <SelectedUserNameContext.Provider value={{ selectedUserName, setSelectedUserName }}>
            {children}
        </SelectedUserNameContext.Provider>
    );
};

export const useSelectedUserName = () => {
    const context = useContext(SelectedUserNameContext);
    if (!context) {
        throw new Error('useSelectedUserName must be used within a UserNameProvider');
    }
    return context;
};