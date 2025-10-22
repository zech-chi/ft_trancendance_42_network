// "use client";
// import { JSX } from "react";
// // import Navbar from "@/components/layout/Navbar";
// // import Sidebar from "@/components/layout/Sidebar";
// import { useEffect, useState } from "react";
// import { useLoggedUserName } from "@/context/LoggedUserNameContext";
// // import Login from "@/components/Login";
// import { usePathname } from "next/navigation";
// import { useSocket } from "@/context/parchisiContexts/SocketContext";
// import { Parcheesi3DComponent } from "@/components/parchisi_game/Parcheesi3D";
// import { useGame } from "@/context/parchisiContexts/GameContext";
// import {useRouter} from "next/navigation";
// import PopupWinner from "@/components/parchisi_game/winner-announcement";
// import { useLoggedUserId } from "@/context/UserIdContext";

// export default function Games() : JSX.Element {
// 	const { loggedUserName, setLoggedUserName } = useLoggedUserName();
// 	  const pathname = usePathname();
//   const { namespace, setNamespace } = useSocket();
//   const{state} = useGame();
//   const router = useRouter();
//   const [showWinner, setShowWinner] = useState(false);
//   const { loggedUserId } = useLoggedUserId();
//   const [winnerData, setWinnerData] = useState<any>(null);

//   useEffect(() => {
//     if (state.winner) {
// 	//here im going to fetch the user id from the database based on the username
	
// 		const data = async () => {
// 			const response = await fetch('/http://localhost:5555/games/parchisi/users/' + state.winner);
// 			if (response.ok) {
// 				const userData = await response.json();
// 				console.log("Fetched user data:", userData);
// 				setWinnerData(userData);
// 			}
// 		}
//       setShowWinner(true);
//     }
//   }, [state.winner]);

//   useEffect(() => {
//     // If user leaves /game/[id] page, reset namespace to null → disconnect
//     if (!pathname.startsWith('/protected/games/parchisi/game/')) {
//       if (namespace !== null) {
//         setNamespace(null);
//       }
//     }
//     // If user is in /game/[id], do nothing → keep socket connected
//   }, [pathname, namespace, setNamespace]);

//   useEffect(() => {
// 	if (state.lobby === null) {
// 	  router.push("/protected/games/parchisi/")
// 	}
//   }, [state.lobby])

// 	return (
//     	<>
// 			<div className="h-screen flex items-center min-w-[200px] overflow-x-auto">
// 				{/* <Sidebar />
// 				<Navbar /> */}
// 				<main className="flex flex-row items-center justify-center relative overflow-x-hidden
// 					xl:pl-20 2xl:pl-24
// 					h-[calc(100%-130px)]
// 					xl:h-[calc(100%-75px)]
// 					2xl:h-[calc(100%-85px)]
// 					2xl:mt-[67px] xl:mt-[60px]
// 					w-full
// 					p-2.5
// 					bg-black/30
// 				">
// 					<Parcheesi3DComponent />
// 				</main>
// 			</div>
// 						{showWinner && state.winner && (
// 							<PopupWinner
// 								winner={{ winner: state.winner, color: state.winnerColor || "red", avatar: winnerData.avatar }}
// 								onClose={() => setShowWinner(false)}
// 							/>
// 						)}
// 		</>
//   );
// }




"use client";
import { JSX, useEffect, useState } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "@/context/parchisiContexts/SocketContext";
import { Parcheesi3DComponent } from "@/components/parchisi_game/Parcheesi3D";
import { useGame } from "@/context/parchisiContexts/GameContext";
import PopupWinner from "@/components/parchisi_game/winner-announcement";
import { useLoggedUserId } from "@/context/UserIdContext";

export default function Games(): JSX.Element {

  const pathname = usePathname();
  const router = useRouter();
  const { namespace, setNamespace } = useSocket();
  const { state } = useGame();

  const [showWinner, setShowWinner] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);

  // ✅ Fetch winner data when gameOver happens
  useEffect(() => {
    const fetchWinner = async () => {
      if (state.winner) {
        try {
          // ✅ Fixed URL — removed extra "/"
          const response = await fetch(`http://localhost:5555/games/parchisi/users/${state.winner}`);

          if (!response.ok) throw new Error("Failed to fetch winner data");

          const userData = await response.json();
          console.log("Fetched user data:", userData);
          setWinnerData(userData);
        } catch (error) {
          console.error("Error fetching winner:", error);
        } finally {
          setShowWinner(true);
        }
      }
    };

    fetchWinner();
  }, [state.winner]);

  // ✅ Disconnect socket if leaving the page
  useEffect(() => {
    if (!pathname.startsWith("/protected/games/parchisi/game/")) {
      if (namespace !== null) setNamespace(null);
    }
  }, [pathname, namespace, setNamespace]);

  // ✅ Redirect if lobby no longer exists
  useEffect(() => {
    if (state.lobby === null && state.winner === null) {
      router.push("/protected/games/parchisi/");
    }
  }, [state.lobby, router]);

  // ✅ Handle closing the popup
  const handleClosePopup = () => {
    setShowWinner(false);
    router.push("/protected/games/parchisi/")
  };

  return (
    <>
      <div className="h-screen flex items-center min-w-[200px] overflow-x-auto">
        <main
          className="flex flex-row items-center justify-center relative overflow-x-hidden
            xl:pl-20 2xl:pl-24
            h-[calc(100%-130px)]
            xl:h-[calc(100%-75px)]
            2xl:h-[calc(100%-85px)]
            2xl:mt-[67px] xl:mt-[60px]
            w-full
            p-2.5
            bg-black/30"
        >
          <Parcheesi3DComponent />
        </main>
      </div>

      {/* ✅ Show popup only when winner info exists */}
      {showWinner && state.winner && (
        <PopupWinner
          winner={{
            winner: state.winner,
            color: state.winnerColor || "red",
            avatar: winnerData?.avatar || "/default-avatar.png",
          }}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}
