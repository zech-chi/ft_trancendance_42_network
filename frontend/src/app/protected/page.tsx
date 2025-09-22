'use client'

import { JSX, useState } from "react";

export default function Home() : JSX.Element {

	// useEffect(() => {
	//   async function checkAuth() {
	// 	const user = await fetchUser();
	// 	console.log("Fetched user:", user);
	// 	if (!user || !user.userName) {
	// 		setLoggedUserName(null);
	// 	} else {
	// 		setLoggedUserName(user.userName);
	// 	}
	// 	setLoading(false);
	//   }
	//   checkAuth();
	// }
	// , []);

	// if (loading) {
	// 	return (
	// 		<div className="h-screen flex items-center justify-center text-white">
	// 		Loading...
	// 		</div>
	// 	);
	// }

	// if (loading) {
	// 	return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
	// }

	return (
    	<>
			<div className="h-screen flex items-center min-w-[200px] overflow-x-auto">
				<h1 className="text-white">Welcome,  this your profile!</h1>
			</div>
		</>
  );
}

    
// export default function Home() : JSX.Element {
// 	const { loggedUserName, setLoggedUserName } = useLoggedUserName();
// 	const [showRightComp, setShowRightComp] = useState<boolean>(false);

// 	useEffect(() => {
// 	  if (loggedUserName) {
// 		console.log(`Logged in user: ${loggedUserName}`);
// 	  }
// 	}
// 	, [loggedUserName]);

// 	if (!loggedUserName) {
// 		return <Login onLogin={setLoggedUserName} />;
// 	}

// 	return (
//     	<>
// 			<div className="h-screen flex items-center min-w-[200px] overflow-x-auto">
// 				<Sidebar />
// 				<Navbar />
// 				<main className="flex flex-row items-center justify-center relative overflow-x-hidden
// 					xl:pl-20 2xl:pl-24 w-full
// 					h-[calc(100%-130px)]
// 					xl:h-[calc(100%-75px)]
// 					2xl:h-[calc(100%-85px)]
// 					2xl:mt-[67px] xl:mt-[60px]
// 				">
// 					<button className="text-white absolute top-1 right-3 2xl:hidde z-13"
// 					onClick={() => setShowRightComp(prev => !prev)}
// 					>
// 						{!showRightComp ? <img src="/show.png" alt="show" className="w-auto h-[30px] md:h-[40px] lg:h-[50px] xl:h-[60px] opacity-70 hover:opacity-100 2xl:hidden"/> : 
// 						<img src="/hide.png" alt="hide" className="w-auto h-[30px] md:h-[40px] lg:h-[50px] xl:h-[60px] opacity-60 hover:opacity-100 2xl:hidden"/>} 
// 					</button>
// 					<LeftComponent />
// 					<RightComponent show={showRightComp} />
// 				</main>
// 			</div>
// 		</>
//   );
// }