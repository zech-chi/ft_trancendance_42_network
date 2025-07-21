'use client'
import { JSX } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import Login from "@/components/Login";

export default function Settings() : JSX.Element {
	const { loggedUserName, setLoggedUserName } = useLoggedUserName();

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
			<Sidebar />
			<Navbar />
			<main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
				<h1 className="text-4xl font-bold text-[#FEDF7F]">
				Settings
				</h1>
			</main>
		</>
  );
}