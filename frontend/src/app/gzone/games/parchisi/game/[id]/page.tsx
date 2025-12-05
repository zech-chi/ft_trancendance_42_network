"use client";
import { JSX, useEffect, useState } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "@/context/parchisiContexts/SocketContext";
import { Parcheesi3DComponent } from "@/components/parchisi_game/Parcheesi3D";
import { useGame } from "@/context/parchisiContexts/GameContext";
import PopupWinner from "@/components/parchisi_game/winner-announcement";
import { useLoggedUserId } from "@/context/UserIdContext";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function Games(): JSX.Element {

  const pathname = usePathname();
  const router = useRouter();
  const { namespace, setNamespace, isConnected } = useSocket();
  const { state, dispatch } = useGame();

  const [showWinner, setShowWinner] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);

  // Fetch winner data when gameOver happens
  useEffect(() => {
    const fetchWinner = async () => {
      if (state.winner) {
        try {
          const response = await fetchWithAuth(`/api/parchisi/users/${state.winner}`, {
          });

          if (!response.ok) throw new Error("Failed to fetch winner data");

          const userData = await response.json();
          // console.log("Fetched user data:", userData);
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

  // Disconnect socket if leaving the page
  useEffect(() => {
    if (!pathname.startsWith("/gzone/games/parchisi/game/")) {
      if (namespace !== null) setNamespace(null);
    }
  }, [pathname, namespace]);

  // Redirect if lobby no longer exists
  useEffect(() => {
    if (state.lobby === null && state.winner === null) {
      router.push("/gzone/games/parchisi/");
    }
  }, [state.lobby, router]);

  const handleClosePopup = () => {
    setShowWinner(false);
    setNamespace(null);
    dispatch({ type: "CLEAR_LOBBY" });
    router.push("/gzone/games/parchisi/")
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

      {/* Show popup only when winner info exists */}
      {showWinner && state.winner && (
        <PopupWinner
          winner={{
            winner: state.winner,
            color: state.winnerColor || "",
            avatar: winnerData?.avatar || "",
          }}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}