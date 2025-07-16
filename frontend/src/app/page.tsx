'use client'

import { JSX, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import Login from "@/components/Login";
import { TopDashboard } from "@/components/TopDashboard";
import { Friends } from "@/components/Friends";
import { History } from "@/components/History";
import { Rank } from "@/components/Rank";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { SelectGame } from "@/components/History";
import Cookies from 'js-cookie';

type GameName = 'pong' | 'parchesi';

export function SearchForm(): JSX.Element {
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
			bg-black/10 backdrop-blur
			rounded-[25px]
			text-white
			overflow-y-auto custom-scrollbar
		">
			<TopDashboard />
		</div>
	);
}

function RightComponent({ show }: { show: boolean }): JSX.Element {
	const [buttonChoice, setButtonChoice] = useState<string>('history');
	const [game, setGame] = useState<GameName>((Cookies.get('SelectedGameHistory') as GameName) || 'pong');

	return (
	  <div
		className={`
		  flex flex-col items-center space-x-4 h-full
		  transition-all duration-300 ease-in-out
		  bg-black/40
		  rounded-[25px]
		  backdrop-blur
		  mr-2.5
		  transform
		  ${show
			? "translate-x-0 opacity-100 pointer-events-auto"
			: "translate-x-full opacity-0 pointer-events-none"}
		  w-[calc(100%-20px)] md:w-[50%] xl:w-[50%] 2xl:w-[30%]
		  absolute right-0 top-0
		  2xl:static 2xl:translate-x-0 2xl:opacity-100 2xl:pointer-events-auto
		  py-2.5
		`}
	  >
		<SearchForm />
		<div className="flex flex-col h-[calc(100%-50px)] w-full px-2.5 overflow-x-auto">
			{/* select game if buttonChoice is History */}
			{buttonChoice === 'history' && <SelectGame game={game} setGame={setGame} />}
			<div className="rounded-[25px] w-full  bg-black/60 overflow-y-auto overflow-x-auto min-w-[270px] custom-scrollbar mt-2.5 ">
				{buttonChoice === 'friends' && <Friends />}
				{buttonChoice === 'history' && <History game={game} setGame={setGame}/>}
				{buttonChoice === 'rank' && <Rank />}
			</div>
		</div>
	  </div>
	);
}
    
export default function Home() : JSX.Element {
	const { loggedUserName, setLoggedUserName } = useLoggedUserName();
	const [showRightComp, setShowRightComp] = useState<boolean>(true);

	useEffect(() => {
	  if (loggedUserName) {
		console.log(`Logged in user: ${loggedUserName}`);
	  }
	}
	, [loggedUserName]);

	if (!loggedUserName) {
		return <Login onLogin={setLoggedUserName} />;
	}

	return (
    	<>
			<div className="h-screen flex items-center">
				<Sidebar />
				<Navbar />
				<main className="flex flex-row items-center justify-center relative overflow-x-hidden
					xl:pl-20 2xl:pl-24 w-full
					h-[calc(100%-130px)]
					xl:h-[calc(100%-75px)]
					2xl:h-[calc(100%-85px)]
					2xl:mt-[67px] xl:mt-[60px]
				">
					<button className="text-white absolute top-1 right-3 border border-amber-500 2xl:hidden bg-red-500 z-13"
					onClick={() => setShowRightComp(prev => !prev)}
					>show</button>
					<LeftComponent />
					<RightComponent show={showRightComp} />
				</main>
			</div>
		</>
  );
}
