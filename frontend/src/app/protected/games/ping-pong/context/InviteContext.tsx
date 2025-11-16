// context/InviteContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from "react";

// États possibles d'une invitation
export type InviteStatus = 'idle' | 'sending' | 'pending' | 'accepted' | 'declined' | 'expired';

export interface InviteState {
  status: InviteStatus;
  timestamp?: number;
  expiresAt?: number;
  inviteId?: string;
  remainingTime?: number;
}

interface InviteContextType {
  inviteStates: { [friendId: number]: InviteState };
  setInviteStates: React.Dispatch<React.SetStateAction<{ [friendId: number]: InviteState }>>;
  updateInviteStatus: (friendId: number, status: InviteStatus, data?: Partial<InviteState>) => void;
  getInviteStatus: (friendId: number) => InviteState;
}

const InviteContext = createContext<InviteContextType | undefined>(undefined);

export const InviteProvider = ({ children }: { children: ReactNode }) => {
  const [inviteStates, setInviteStates] = useState<{ [friendId: number]: InviteState }>({});
  
  const updateInviteStatus = (friendId: number, status: InviteStatus, data?: Partial<InviteState>) => {
    setInviteStates(prev => ({
      ...prev,
      [friendId]: {
        ...prev[friendId],
        status,
        timestamp: Date.now(),
        ...data
      }
    }));
  };

  const getInviteStatus = (friendId: number): InviteState => {
    return inviteStates[friendId] || { status: 'idle' };
  };

  return (
    <InviteContext.Provider value={{ 
      inviteStates, 
      setInviteStates, 
      updateInviteStatus, 
      getInviteStatus 
    }}>
      {children}
    </InviteContext.Provider>
  );
};

export const useInvite = () => {
  const context = useContext(InviteContext);
  if (!context) throw new Error("useInvite must be used within InviteProvider");
  return context;
};
