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
      <form className="max-w-xl mx-auto w-[60%]">
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
			bg-gray/10 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]  border border-white/30
			rounded-[25px]
			text-white
			overflow-y-auto custom-scrollbar 
		">
			<div className="flex flex-col w-full gap-1">
				<TopDashboard />
				<div className="p-2.5 m-2.5 rounded-2xl justify-center items-center flex
					    bg-gray-800/40 backdrop-blur-md p-6 shadow-xl border border-white/20
				"
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
	const [hide, setHide] = useState<boolean>(false);

	return (
			<div
				className={`
				flex flex-col items-center space-x-4 h-full
				transition-all duration-300 ease-in-out
				bg-gray/10 backdrop-blur-2xl p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]  border border-white/30
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
				<div className="w-full flex flex-row items-center justify-center gap-1 my-3">
				{/* <SearchForm /> */}
				<aside
						className="
						bg-black/10 backdrop-blur-md
						flex flex-row items-center justify-center
						gap-10 p-2
						rounded-full
						border border-white/10
						z-50
						transition-all duration-300
						"
						>
							{[
							{ key: "friends", img: ["/friends.png", "/friends_pink.png"], alt: "Friends" },
							{ key: "history", img: ["/history.png", "/history_pink.png"], alt: "History" },
							{ key: "rank", img: ["/rank.png", "/rank_pink.png"], alt: "Rank" },
							].map((btn) => (
							<button
								key={btn.key}
								onClick={() => setButtonChoice(btn.key)}
								className={`
								w-6 h-6 rounded-full flex items-center justify-center
								bg-black/40 hover:bg-black/70
								transition-all duration-200
								${buttonChoice === btn.key ? "ring-2" : ""}
								`}
							>
								<Image
								src={buttonChoice === btn.key ? btn.img[1] : btn.img[0]}
								alt={btn.alt}
								width={27}
								height={27}
								className="object-contain"
								/>
							</button>
							))}
					</aside>
				</div>
				<div className="flex flex-col h-[calc(100%-50px)] w-full px-2.5 overflow-x-auto ">
					{/* select game if buttonChoice is History */}
					{buttonChoice === 'history' && <SelectGame game={game} setGame={setGame} />}
					{buttonChoice === 'friends' && <SelectedChoiceFriends choice={choice} setChoice={setChoice} />}
					<div className="rounded-[25px] w-full  bg-black/45 overflow-y-auto overflow-x-auto min-w-[270px] custom-scrollbar mt-2.5 ">
						{buttonChoice === 'friends' && <Friends choice={choice} />}
						{buttonChoice === 'history' && <History game={game} setGame={setGame} />}
						{buttonChoice === 'rank' && <Rank />}
					</div>
					{/* <aside
						className=" fixed
						right-4 top-1/2 -translate-y-1/2
						bg-black/60 backdrop-blur-md
						flex flex-col items-center justify-center
						gap-6 p-4
						rounded-full
						border border-white/10
						z-50
						transition-all duration-300
						"
						>
							{[
							{ key: "friends", img: ["/friends.png", "/friends_pink.png"], alt: "Friends" },
							{ key: "history", img: ["/history.png", "/history_pink.png"], alt: "History" },
							{ key: "rank", img: ["/rank.png", "/rank_pink.png"], alt: "Rank" },
							].map((btn) => (
							<button
								key={btn.key}
								onClick={() => setButtonChoice(btn.key)}
								className={`
								w-14 h-14 rounded-full flex items-center justify-center
								bg-black/40 hover:bg-black/70
								transition-all duration-200
								${buttonChoice === btn.key ? "ring-2" : ""}
								`}
							>
								<Image
								src={buttonChoice === btn.key ? btn.img[1] : btn.img[0]}
								alt={btn.alt}
								width={27}
								height={27}
								className="object-contain"
								/>
							</button>
							))}
					</aside> */}
				</div>
			</div>

	);
}

    
export default function Home() : JSX.Element {
	// const { loggedUserName, setLoggedUserName } = useLoggedUserName();
	// const { selectedUserName, setSelectedUserName } = useSelectedUserName();
	const { selectedUserId, setSelectedUserId } = useSelectedUserId();
	// const { loggedUserId, setLoggedUserId } = useLoggedUserId();
	const [showRightComp, setShowRightComp] = useState<boolean>(false);
	// const [loading, setLoading] = useState(true);
	const router = useRouter();

	// useEffect(() => {
	// 	// wait until AuthUserProvider sets selectedUserId
	// 	if (selectedUserId !== null) {
	// 		router.push("/protected");
	// 	}
	// }, [selectedUserId, router]);

	// if (selectedUserId === null) {
	// 	return <div></div>;
	// }

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
						<button className="text-white absolute top-1 right-7 2xl:hidde z-13 cursor-pointer"
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