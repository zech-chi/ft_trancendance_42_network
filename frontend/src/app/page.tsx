'use client'

import { JSX, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import Login from "@/components/Login";
import { pre } from "framer-motion/client";

function LeftComponent({ loggedUserName } : { loggedUserName : string }): JSX.Element {
	return (
		<div className="flex items-center space-x-4 bg-black h-full w-full lg:w-[75%]
		    m-2.5
			text-white
		">
			LeftComponent
		</div>
	);
}
  
// function RightComponent({ loggedUserName, show }: { loggedUserName: string; show: boolean }): JSX.Element {
// 	return (
// 	  <div
// 		className={`
// 		  flex items-center space-x-4 h-full
// 		  transition-all duration-300 ease-in-out
// 		  mr-2.5
// 		  transform bg-white/10 right-2.5
// 		  ${show
// 			? `
// 			  translate-x-0 opacity-100 pointer-events-auto
// 			  w-[calc(100%-20px)] md:w-[75%] lg:w-[25%]
// 			  absolute
// 			`
// 			: `
// 			  translate-x-full opacity-0 pointer-events-none
// 			  w-[calc(100%-20px)] md:w-[75%] lg:w-[25%]
// 			`}
// 		  lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto
// 		`}
// 	  >
// 		rightComponent
// 	  </div>
// 	);
//   }

function RightComponent({ loggedUserName, show }: { loggedUserName: string; show: boolean }): JSX.Element {
	return (
	  <div
		className={`
		  flex items-center space-x-4 h-full
		  transition-all duration-300 ease-in-out
		  bg-white/30
		  mr-2.5
		  transform
		  ${show
			? "translate-x-0 opacity-100 pointer-events-auto"
			: "translate-x-full opacity-0 pointer-events-none"}
		  w-[calc(100%-20px)] md:w-[75%] lg:w-[25%]
		  absolute right-0 top-0
		  lg:static lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto
		`}
	  >
		RightComponent
	  </div>
	);
  }
  
  
export default function Home() : JSX.Element {
	const { loggedUserName, setLoggedUserName } = useLoggedUserName();
	const [showRightComp, setShowRightComp] = useState<boolean>(false);

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
				<LeftComponent loggedUserName={loggedUserName} />
				<RightComponent loggedUserName={loggedUserName} show={showRightComp} />
			</main>
			</div>
		</>
  );
}
