
import {SocketProvider} from "@/context/parchisiContexts/SocketContext";
import {GameProvider} from "@/context/parchisiContexts/GameContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <SocketProvider namespace="online">
          <GameProvider>{children}</GameProvider>
        </SocketProvider>
  );
}