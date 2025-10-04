
import {SocketProvider} from "@/context/parchisiContexts/SocketContext";
import {GameProvider} from "@/context/parchisiContexts/GameContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-center bg-no-repeat bg-cover">
          <SocketProvider namespace="online">
          <GameProvider>{children}</GameProvider>
        </SocketProvider>
      </body>
    </html>
  );
}