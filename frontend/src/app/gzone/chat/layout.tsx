// layout chat 
import { SocketProvider } from "./context/SocketContext";
import { Metadata } from "next";
// import {UserProvider} from "./context/UserContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";




export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with your friends",
}

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
    {/* <UserProvider> */}
        <SocketProvider>
            <AudioPlayerProvider>

            {children}
            </AudioPlayerProvider>
        </SocketProvider>

    {/* </UserProvider> */}
    </>
  );
}