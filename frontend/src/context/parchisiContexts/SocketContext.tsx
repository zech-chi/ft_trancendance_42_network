"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  namespace: "online" | "local"  | null;
  setNamespace: (ns: "online" | "local" | null) => void;

}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  namespace: "online",
  setNamespace: () => {},
})

const socketMap: Record<"online" | "local", Socket | null> = {
  online: null,
  local: null,
};

export function SocketProvider({ children}: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentNamespace, setCurrentNamespace] = useState<"online" | "local" | null>(null);

  const allowedNamespaces = ["online", "local"] as const;

  useEffect(() => {
     if (!currentNamespace) {
    // Disconnect any existing socket if namespace is null
    if (socket) {
      console.log("Disconnecting socket because namespace is null or change to the orther value");
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
    return;
  }
    if (!allowedNamespaces.includes(currentNamespace)) {
      alert(`[SocketProvider] Invalid namespace: ${currentNamespace}`);
      return;
    }

    Object.entries(socketMap).forEach(([ns, s]) => {
      if (ns !== currentNamespace && s) {
        console.log(`===> Closing previous socket for namespace: ${ns}`);
        s.disconnect();
        socketMap[ns as "online" | "local"] = null; // Cast ns to the appropriate type
      }
    });

    if (socketMap[currentNamespace]) {
      if (!socketMap[currentNamespace]?.connected) {
        socketMap[currentNamespace]?.connect();
      }
    
      setSocket(socketMap[currentNamespace]);
      setIsConnected(socketMap[currentNamespace]?.connected || false);
      return;
    }


    // Initialize socket connection

    const socketInstance = io(`/games/parchisi/${currentNamespace}`,
      {
        transports: ["websocket"],
        path: `/socket.io/parchisi`,
      })
    socketInstance.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from server")
      // window.location.href = "/" // Redirect to home on disconnect

      setIsConnected(false)
    })
    socketMap[currentNamespace] = socketInstance; // Save socket for reuse
    setSocket(socketInstance);

    return () => {
      console.log("Cleaning up socket connection")
      socketInstance.disconnect();
      socketMap[currentNamespace] = null;
      setIsConnected(false);
    }
  }, [currentNamespace])

  const setNamespace = (ns: "online" | "local" | null) => {
    setCurrentNamespace(ns);
  };

return (
    <SocketContext.Provider value={{ socket, isConnected, namespace: currentNamespace ,setNamespace }}>
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