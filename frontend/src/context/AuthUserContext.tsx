// AuthUserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUser } from "@/app/(auth)/login/page";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useSelectedUserId } from "@/context/SelectedUserId";
import { useRouter } from "next/navigation";

interface AuthUserContextType {
  selectedUserId: number | null;
  selectedUserName: string | null;
  setSelectedUserId: (id: number | null) => void;
  setSelectedUserName: (name: string | null) => void;
}

const AuthUserContext = createContext<AuthUserContextType | undefined>(undefined);

export const AuthUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {selectedUserName, setSelectedUserName} = useSelectedUserName();
    const {selectedUserId, setSelectedUserId} = useSelectedUserId();
    const { setLoggedUserName } = useLoggedUserName();
    const { setLoggedUserId } = useLoggedUserId();

  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const user = await fetchUser();
      console.log("Fetched user in AuthUserProvider:", user);
      if (!user || !user.userName) {
        setSelectedUserId(0);
        setSelectedUserName(null);
        setLoggedUserName(null);
        setLoggedUserId(0);
        router.push("/login");
      } else {
        setLoggedUserName(user.userName);
        setSelectedUserName(user.userName);
        setSelectedUserId(user.id);
        setLoggedUserId(user.id);
      }
    }
    checkAuth();
  } , []);

  return (
    <AuthUserContext.Provider value={{ selectedUserId, selectedUserName, setSelectedUserId, setSelectedUserName }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUser = (): AuthUserContextType => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuthUser must be used within an AuthUserProvider");
  }
  return context;
};