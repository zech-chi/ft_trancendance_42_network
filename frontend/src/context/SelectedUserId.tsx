'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedUserIdContextType {
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;
}

const SelectedUserIdContext = createContext<SelectedUserIdContextType | undefined>(undefined);

export const SelectedUserIdProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <SelectedUserIdContext.Provider value={{ selectedUserId, setSelectedUserId }}>
      {children}
    </SelectedUserIdContext.Provider>
  );
};

export const useSelectedUserId = () => {
  const context = useContext(SelectedUserIdContext);
  if (!context) {
    throw new Error('useSelectedUserId must be used within a SelectedUserIdProvider');
  }
  return context;
};
