"use client";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { fetchUser } from "@/app/(auth)/login/page";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  name?: string;
  iat?: number;
  game?: string;
}

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  currentUser: User | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { loggedUserName, setLoggedUserName } = useLoggedUserName();
  const { loggedUserId, setLoggedUserId } = useLoggedUserId();
  const router = useRouter();

  useEffect(() => {
    if (loggedUserId && loggedUserName) return; // If we already have user data, skip fetching
    async function checkAuth() {
      const user = await fetchUser();
      console.log("Fetched user:", user);
      if (!user || !user.userName) {
        setLoggedUserName(null);
        setLoggedUserId(0);
        router.push("/login");
      } else {
        setLoggedUserName(user.userName);
        setLoggedUserId(user.id);
      }
    }
    checkAuth();
  }, []);

  // // store the logedUserId and loggedUserName in the  localstorage
  // useEffect(() => {
  //   if (loggedUserId) {
  //     localStorage.setItem("loggedUserId", loggedUserId.toString());
  //   }
  //   if (loggedUserName) {
  //     localStorage.setItem("loggedUserName", loggedUserName);
  //   }
  // }, [loggedUserId, loggedUserName]);


  // // load the logedUserId and loggedUserName from the localstorage
  // useEffect(() => {
  //   const storedUserId = localStorage.getItem("loggedUserId");
  //   const storedUserName = localStorage.getItem("loggedUserName");
  //   if (storedUserId && !loggedUserId) {
  //     setLoggedUserId(parseInt(storedUserId));
  //   }
  //   if (storedUserName && !loggedUserName) {
  //     setLoggedUserName(storedUserName);
  //   }
  // }, []); // Empty dependency array to run only once on mount

  //   useEffect(() => {
  //     async function checkAuth() {
  //         const user = await fetchUser();
  //         console.log("Fetched user:", user);
  //         if (!user || !user.userName) {
  //             setLoggedUserName(null);
  //             setLoggedUserId(0);
  //             router.push("/login");
  //         } else {
  //             setLoggedUserName(user.userName);
  //             setLoggedUserId(user.id);
  //         }
  //         setLoading(false);
  //       }
  //       checkAuth();
  // }, []);

  useEffect(() => {
    // Don't initialize socket until we have user data
    if (!loggedUserId || !loggedUserName) {
      return;
    }

    const newSocket = io("http://localhost:5006", {
      path: "/socket.io/ping-pong",
      withCredentials: true,
       query: { userId: loggedUserId?.toString(), username: loggedUserName },
    });

    newSocket.on("connect", async () => {
      try {
        setIsConnected(true);
        const res = await fetch(`http://localhost:5500/api/pong/get-user/${loggedUserId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data?.user) {
          setCurrentUser(data.user);
          newSocket.emit("register", {
            id: loggedUserId,
            username: loggedUserName,
          });
          console.log("✅ User registered on socket:", loggedUserId);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setIsConnected(false);
        setCurrentUser(null);
        console.error("Failed to register user on socket:", err);
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [loggedUserId, loggedUserName]); // Add dependencies to re-run when user data is available

  return (
    <SocketContext.Provider value={{ socket, isConnected, currentUser }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};