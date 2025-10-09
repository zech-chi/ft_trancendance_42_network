'use client'

import { JSX, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { TopDashboard } from "@/components/dashboardComponents/TopDashboard";
import  CalendarDashboard  from "@/components/dashboardComponents/CalendarDashboard";
import { Friends } from "@/components/dashboardComponents/Friends";
import { History } from "@/components/dashboardComponents/History";
import { Rank } from "@/components/dashboardComponents/Rank";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { SelectGame } from "@/components/dashboardComponents/History";
import Cookies from 'js-cookie';
import { SelectedChoiceFriends } from "@/components/dashboardComponents/Friends";
import { fetchUser } from "../(auth)/login/page";
import { useRouter } from "next/navigation";
import Statistics from "@/components/dashboardComponents/Statistics";
import { useSelectedUserId } from "@/context/SelectedUserId";
import Image from 'next/image';

type GameName = 'pong' | 'parcheesi';
type FriendsChoice = 'friends' | 'friend request' | 'sent request' | 'blocked';

function SearchForm(): JSX.Element {
    return (
      <form className="max-w-xl mx-auto flex-1">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full py-2 rounded-full text-[#B2B2B2] outline-none
			px-5 xl:px-9 2xl:px-11
			text-[10px] md:text-sm xl:text-base 2xl:text-lg
			border-1 border-black/20
			xl:border-2 2xl:border-3
			"
            style={{
              background:
                'linear-gradient(to right, rgba(47,25,37,1) 0%, rgba(72,28,43,1) 50%, rgba(100,33,52,1) 100%)',
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2
		  	hidden xl:block
		  	h-3 w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5
		   transform -translate-y-1/2 text-[#B2B2B2]" />
        </div>
      </form>
    );
}


function LeftComponent(): JSX.Element {
	return (
		<div className="flex flex-col items-center space-x-4 h-full 2xl:w-[70%]
			w-[calc(100%-20px)] xl:w-full
			ml-2.5 xl:ml-0
			mr-2.5
			bg-black/50 backdrop-blur
			rounded-[25px]
			text-white
			overflow-y-auto custom-scrollbar 
		">
			<div className="flex flex-col w-full gap-1">
				<TopDashboard />
				<div className="p-2.5 m-2.5 rounded-2xl justify-center items-center flex"
				style={{
					background:
					'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), linear-gradient(to top, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
					backgroundBlendMode: 'overlay',
				}}
				>
					<CalendarDashboard/>
				</div>
				<Statistics />
			</div>
		</div>
	);
}

function RightComponent({ show }: { show: boolean }): JSX.Element {
	const [buttonChoice, setButtonChoice] = useState<string>('friends');
	const [game, setGame] = useState<GameName>((Cookies.get('SelectedGameHistory') as GameName) || 'pong');
	const [choice, setChoice] = useState<FriendsChoice>((Cookies.get('SelectedChoiceFriends') as FriendsChoice) || 'friends');
	const [hovered, setHovered] = useState<number | null>(null);

	return (
	  <div
		className={`
		  flex flex-col items-center space-x-4 h-full
		  transition-all duration-300 ease-in-out
		  bg-black/60
		  rounded-[25px]
		  backdrop-blur
		  mr-2.5
		  transform
		  ${show
			? "translate-x-0 opacity-100 pointer-events-auto"
			: "translate-x-full opacity-0 pointer-events-none"}
		  w-[calc(100%-20px)] md:w-[60%] xl:w-[50%] 2xl:w-[35%]
		  absolute right-0 top-0
		  2xl:static 2xl:translate-x-0 2xl:opacity-100 2xl:pointer-events-auto
		  py-2.5
		`}
	  >
		<SearchForm />
		<div className="flex flex-col h-[calc(100%-50px)] w-full px-2.5 overflow-x-auto ">
			{/* select game if buttonChoice is History */}
			{buttonChoice === 'history' && <SelectGame game={game} setGame={setGame} />}
			{buttonChoice === 'friends' && <SelectedChoiceFriends choice={choice} setChoice={setChoice} />}
			<div className="rounded-[25px] w-full  bg-black/45 overflow-y-auto overflow-x-auto min-w-[270px] custom-scrollbar mt-2.5 ">
				{buttonChoice === 'friends' && <Friends choice={choice} />}
				{buttonChoice === 'history' && <History game={game} setGame={setGame} />}
				{buttonChoice === 'rank' && <Rank />}
			</div>
			<div className="flex justify-center items-center">

			{/* <svg width="200" height="200" viewBox="0 0 150 150"> */}
  {/* <g transform="rotate(45, 75, 75)"> */}
    {/* Circle background */}
    {/* <circle cx="75" cy="75" r="60" fill="red" stroke="none" /> */}

    {/* Slice paths acting as buttons */}
    {/* {[
      { d: "M75 75 L135 75 A60 60 0 0 1 75 135 Z", choice: "friends", img: ["/friends.png","/friends_pink.png"] },
      { d: "M75 75 L75 135 A60 60 0 0 1 15 75 Z", choice: "history", img: ["/history.png","/history_pink.png"] },
      { d: "M75 75 L15 75 A60 60 0 0 1 75 15 Z", choice: "rank", img: ["/rank.png","/rank_pink.png"] },
      { d: "M75 75 L75 15 A60 60 0 0 1 135 75 Z", choice: "other", img: ["/other.png","/other_pink.png"] },
    ].map((slice, i) => (
      <g
        key={i}
        onClick={() => setButtonChoice(slice.choice)}
        onMouseEnter={() => setHovered(i)}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: "pointer", transformOrigin: "75px 75px", transition: "all 0.3s ease" }}
      >
        <path
          d={slice.d}
          fill={hovered === i || buttonChoice === slice.choice ? "#ff0077" : "black"}
          transform={hovered === i ? "scale(1.05)" : ""}
        />
        <image
          href={buttonChoice === slice.choice ? slice.img[1] : slice.img[0]}
          x={50} // Adjust x,y to center the icon inside the slice
          y={50}
          width={25}
          height={25}
          style={{ pointerEvents: "none" }} // So click passes to <g>
        />
      </g>
    ))}
  </g>
</svg> */}



			</div>

			<aside className="fixed right-2 top-1/2 -translate-y-1/2 h-113 w-23 rounded-full bg-black/60 backdrop-blur p-4 z-10 flex flex-col item-center justify-center gap-10">
                <button className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex item-center justify-center transition"
                  onClick={() => setButtonChoice('friends')}
                >
                  <Image
                    src={buttonChoice === 'friends' ? '/friends_pink.png' : '/friends.png'}
                    alt='friends'
                    width={27}
                    height={27}
                    className="object-contain"
                  />
                </button>
                <button className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex item-center justify-center transition"
                  onClick={() => setButtonChoice('history')}
                >
                  <Image
                    src={buttonChoice === 'history' ? '/history_pink.png' : '/history.png'}
                    alt='history'
                    width={27}
                    height={27}
                    className="object-contain"
                  />
                </button>
                <button className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex item-center justify-center transition"
                  onClick={() => setButtonChoice('rank')}
                >
                  <Image
                    src={buttonChoice === 'rank' ? '/rank_pink.png' : '/rank.png'}
                    alt='rank'
                    width={27}
                    height={27}
                    className="object-contain"
                  />
                </button>
            </aside>
		</div>
	  </div>
	);
}

    
export default function Home() : JSX.Element {
	const { loggedUserName, setLoggedUserName } = useLoggedUserName();
	const { selectedUserName, setSelectedUserName } = useSelectedUserName();
	const { selectedUserId, setSelectedUserId } = useSelectedUserId();
	const { loggedUserId, setLoggedUserId } = useLoggedUserId();
	const [showRightComp, setShowRightComp] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
	  async function checkAuth() {
		const user = await fetchUser();
		console.log("Fetched user:", user);
		if (!user || !user.userName) {
			setLoggedUserName(null);
			setSelectedUserName(null);
			setLoggedUserId(0);
			setSelectedUserId(0);
			router.push("/login");
		} else {
			setLoggedUserName(user.userName);
			setSelectedUserName(user.userName);
			setLoggedUserId(user.id);
			setSelectedUserId(user.id);
		}
		setLoading(false);
	  }
	  checkAuth();
	}
	, []);

	if (loading) {
		return (
			<div className="h-screen flex items-center justify-center text-white">
			Loading...
			</div>
		);
	}

	return (
    	<>
			{/* update here was added w-full may can make some issues !!!!! */}
			<div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto"> 
				<Sidebar />
				<Navbar />
				<main className="flex flex-row items-center justify-center relative overflow-x-hidden
					xl:pl-20 2xl:pl-24 w-full
					h-[calc(100%-130px)]
					xl:h-[calc(100%-75px)]
					2xl:h-[calc(100%-85px)]
					2xl:mt-[67px] xl:mt-[60px]
				">
					<button className="text-white absolute top-1 right-3 2xl:hidde z-13"
					onClick={() => setShowRightComp(prev => !prev)}
					>
						{!showRightComp ? <img src="/show.png" alt="show" className="w-auto h-[30px] md:h-[40px] lg:h-[50px] xl:h-[60px] opacity-70 hover:opacity-100 2xl:hidden"/> : 
						<img src="/hide.png" alt="hide" className="w-auto h-[30px] md:h-[40px] lg:h-[50px] xl:h-[60px] opacity-60 hover:opacity-100 2xl:hidden"/>} 
					</button>

					<LeftComponent />
					<RightComponent show={showRightComp} />
				</main>
			</div>
		</>
  );
}