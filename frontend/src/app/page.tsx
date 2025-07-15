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

export function SearchForm(): JSX.Element {
    return (
      <form className="max-w-xl mx-auto flex-1">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full py-2 rounded-full text-[#B2B2B2] outline-none
			px-5 md:px-9 lg:px-11
			text-sm md:text-base lg:text-lg
			"
            style={{
              background:
                'linear-gradient(to right, rgba(47,25,37,0.7) 0%, rgba(72,28,43,0.7) 50%, rgba(100,33,52,0.7) 100%)',
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2
		  	hidden md:block
		  	h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5
		   transform -translate-y-1/2 text-[#B2B2B2]" />
        </div>
      </form>
    );
}


function LeftComponent(): JSX.Element {
	return (
		<div className="flex flex-col items-center space-x-4 h-full lg:w-[65%]
			w-[calc(100%-20px)] md:w-full
			ml-2.5 md:ml-0
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

	return (
	  <div
		className={`
		  flex items-center space-x-4 h-full
		  transition-all duration-300 ease-in-out
		  bg-black/40
		  rounded-[25px]
		  backdrop-blur
		  mr-2.5
		  transform
		  ${show
			? "translate-x-0 opacity-100 pointer-events-auto"
			: "translate-x-full opacity-0 pointer-events-none"}
		  w-[calc(100%-20px)] md:w-[65%] lg:w-[35%]
		  absolute right-0 top-0
		  lg:static lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto
		  py-2.5
		`}
	  >
		<div className="flex flex-col h-full w-full px-2.5">
		<SearchForm />
		<div className="rounded-[25px] w-full  bg-black/60 overflow-y-auto custom-scrollbar mt-2">
			{buttonChoice === 'friends' && <Friends />}
			{buttonChoice === 'history' && <History />}
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
			md:pl-20 lg:pl-24 w-full
			h-[calc(100%-130px)]
			md:h-[calc(100%-75px)]
			lg:h-[calc(100%-85px)]
			lg:mt-[67px] md:mt-[60px]
			">
				<button className="text-white absolute top-1 right-3 border border-amber-500 lg:hidden bg-red-500 z-13"
				onClick={() => setShowRightComp(prev => !prev)}
				>show</button>
				<LeftComponent />
				<RightComponent show={showRightComp} />
			</main>
			</div>
		</>
  );
}
