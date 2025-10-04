"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  setNamespace: (ns: "online" | "local") => void;

}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  setNamespace: () => {},
})

const socketMap: Record<"online" | "local", Socket | null> = {
  online: null,
  local: null,
};

export function SocketProvider({ children, namespace}: { children: ReactNode,  namespace: "online" | "local"  }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentNamespace, setCurrentNamespace] = useState<"online" | "local">(namespace);

  const allowedNamespaces = ["online", "local"] as const;

  useEffect(() => {
     if (!allowedNamespaces.includes(namespace)) {
      alert(`[SocketProvider] Invalid namespace: ${namespace}`);
      return;
    }
    if (socketMap[namespace]) {
      setSocket(socketMap[namespace]);
      setIsConnected(socketMap[namespace]?.connected || false);
      setCurrentNamespace(namespace);
      return;
    }

    // Initialize socket connection
    
    const socketInstance = io(`${process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5555"}/games/parchisi/${namespace}`,
      {
        transports: ["websocket"],
      })
    socketInstance.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from server")
      alert("Connection lost. Returning to home page.")
      window.location.href = "/" // Redirect to home on disconnect
      setIsConnected(false)
    })
    socketMap[namespace] = socketInstance; // Save socket for reuse
    setSocket(socketInstance);
    setCurrentNamespace(namespace);

    return () => {
      // socketInstance.disconnect()
    }
  }, [namespace])

  const setNamespace = (ns: "online" | "local") => {
    if (!allowedNamespaces.includes(ns)) {
      console.error(`[SocketProvider] Invalid namespace: ${ns}`);
      return;
    }
    setCurrentNamespace(ns);
  };

return (
    <SocketContext.Provider value={{ socket, isConnected, setNamespace }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}