'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type UserEmailContextType = {
  userEmail: string;
  setUserEmail: (email: string) => void;
};

const UserEmailContext = createContext<UserEmailContextType | undefined>(undefined);

export function UserEmailProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState('');
  return (
    <UserEmailContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserEmailContext.Provider>
  );
}

export function useUserEmail() {
  const context = useContext(UserEmailContext);
  if (!context) {
    throw new Error('useUserEmail must be used within a UserEmailProvider');
  }
  return context;
}
