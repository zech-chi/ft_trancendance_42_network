'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type UserContextType = {
  userId: string | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem('tempUserId');
    if (!id) {
      id = prompt('Enter your temporary user ID:') || '';
      localStorage.setItem('tempUserId', id);
    }
    setUserId(id);
  }, []);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
