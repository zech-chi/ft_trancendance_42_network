
import { SocketProvider } from "@/context/parchisiContexts/SocketContext";
import { GameProvider } from "@/context/parchisiContexts/GameContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <GameProvider>{children}</GameProvider>
    </SocketProvider>
  );
}