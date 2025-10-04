
import "../styles/globals.css";
import {SocketProvider} from "@/contexts/SocketContext";
import {GameProvider} from "@/contexts/GameContext";
import { LoggedUserNameProvider } from '@/contexts/LoggedUserNameContext';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[url(/background.png)] bg-center bg-no-repeat bg-cover">
      <LoggedUserNameProvider>
          <SocketProvider namespace="online">
          <GameProvider>{children}</GameProvider>
        </SocketProvider>
      </LoggedUserNameProvider>
      </body>
    </html>
  );
}
