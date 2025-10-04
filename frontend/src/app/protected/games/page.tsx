'use client';
// a component for the games page display welcome to games
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/navigation"; 
export default function Games() {
  const router = useRouter();
  // adding two buttons pong, and parchisi
  // pong button redirect to /Games/pong
  // parchisi button redirect to / Games/parchisi
  return (
    <>
      {/* update here was added w-full may can make some issues !!!!! */}
      <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
        <Sidebar />
        <Navbar />
        <main
          className="flex flex-row items-center justify-center relative overflow-x-hidden
                            xl:pl-20 2xl:pl-24 w-full
                            h-[calc(100%-130px)]
                            xl:h-[calc(100%-75px)]
                            2xl:h-[calc(100%-85px)]
                            2xl:mt-[67px] xl:mt-[60px]
                        "
        >
          <div className="flex flex-col items-center justify-center w-full h-full text-white">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to the Games Page! Choose
            </h1>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
              onClick={() => router.push('/protected/games/pong')}  
            >
              Pong  
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
              onClick={() => router.push('/protected/games/parchisi')}
            >
              parchisi
            </button>
            <p className="text-lg">Here you can find and play various games.</p>
          </div>
        </main>
      </div>
    </>
  );
}
