"use client";
import { JSX } from "react";
// import Navbar from "@/components/layout/Navbar";
// import Sidebar from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
// import Login from "@/components/Login";
import { usePathname } from "next/navigation";
import { useSocket } from "@/context/parchisiContexts/SocketContext";
import { Parcheesi3DComponent } from "@/components/parchisi_game/Parcheesi3D";

export default function Games() : JSX.Element {
	const { loggedUserName, setLoggedUserName } = useLoggedUserName();
	  const pathname = usePathname();
  const { namespace, setNamespace } = useSocket();

  useEffect(() => {
    // If user leaves /game/[id] page, reset namespace to null → disconnect
    if (!pathname.startsWith('/protected/games/parchisi/game/')) {
      if (namespace !== null) {
        setNamespace(null);
      }
    }
    // If user is in /game/[id], do nothing → keep socket connected
  }, [pathname, namespace, setNamespace]);

	return (
    	<>
			<div className="h-screen flex items-center min-w-[200px] overflow-x-auto">
				{/* <Sidebar />
				<Navbar /> */}
				<main className="flex flex-row items-center justify-center relative overflow-x-hidden
					xl:pl-20 2xl:pl-24
					h-[calc(100%-130px)]
					xl:h-[calc(100%-75px)]
					2xl:h-[calc(100%-85px)]
					2xl:mt-[67px] xl:mt-[60px]
					w-full
					p-2.5
					bg-black/30
				">
					<Parcheesi3DComponent />
				</main>
			</div>
		</>
  );
}

