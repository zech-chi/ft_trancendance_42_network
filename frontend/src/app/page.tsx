'use client'

import { JSX } from "react";
// import { useUserName } from "@/context/UserNameContext";


export default function Home() : JSX.Element {
  // fill days data
//   const { username, setUserName } = useUserName();


  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
        <h1 className="text-4xl font-bold text-[#FEDF7F]">
		  Home
        </h1>
      </main>
  );
}
