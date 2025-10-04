// utils/socket.ts
import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types/data";

export function createSocket(token?: string): Socket<ClientToServerEvents, ServerToClientEvents> {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined");

  return io(url, {
    path: "/socket.io",
    transports: ["websocket"],
    // Optional auth; backend can validate token if you have one
    auth: token ? { token } : undefined,
    autoConnect: true,
    reconnectionAttempts: 5,
  });
}
