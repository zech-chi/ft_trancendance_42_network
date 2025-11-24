'use client';
// a component for the games page display welcome to games
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/navigation"; 
export default function Games() {
  const router = useRouter();
  // Style the page to have 2 images one for parchisi start style and one for pong style
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
              onClick={() => router.push('/protected/games/ping-pong')}  
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
// 'use client';
// import { useState } from 'react';
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Sidebar from "@/components/layout/Sidebar";
// import Navbar from "@/components/layout/Navbar";

// export default function Games() {
//   const router = useRouter();

//   // Navigation handlers
//   const handleNavigation = (path) => {
//     router.push(path);
//   };

//   return (
//     <div className="h-screen flex items-center min-w-[300px] w-full overflow-hidden bg-[#0a0a0a]">
//       <Sidebar />
      
//       {/* Main Content Wrapper */}
//       <div className="flex flex-col w-full h-full relative">
//         <Navbar />
        
//         <main
//           className="flex flex-col items-center justify-center relative w-full h-full overflow-y-auto overflow-x-hidden
//                      px-4 md:px-8 pb-10
//                      bg-gradient-to-br from-gray-900 via-black to-gray-900"
//         >
//           {/* Header Text */}
//           <div className="text-center mb-10 md:mb-16 z-10 animate-fade-in-down">
//             <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 drop-shadow-lg">
//               Game Zone
//             </h1>
//             <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
//               Select your arena. Will it be the retro fury of Pong or the strategic chaos of Parchisi?
//             </p>
//           </div>

//           {/* Cards Container */}
//           <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-center w-full max-w-6xl z-10">
            
//             {/* --- PONG CARD --- */}
//             <div 
//               onClick={() => handleNavigation('/protected/games/ping-pong')}
//               className="group relative w-full max-w-sm h-[450px] rounded-3xl overflow-hidden cursor-pointer 
//                          border border-white/10 shadow-2xl transition-all duration-500 
//                          hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105"
//             >
//               {/* Background Image */}
//               <Image 
//                 src="/assets/pong-card.jpg" // Make sure this file exists in public/assets/
//                 alt="Neon Pong Game"
//                 fill
//                 className="object-cover transition-transform duration-700 group-hover:scale-110"
//               />
              
//               {/* Dark Gradient Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

//               {/* Card Content */}
//               <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center">
//                 <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
//                   <span className="text-cyan-400">Neon</span> Pong
//                 </h2>
//                 <div className="w-full h-[2px] bg-cyan-500/50 mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
//                 <button className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full 
//                                    shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all duration-300 
//                                    transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
//                   Play Now
//                 </button>
//               </div>
//             </div>

//             {/* --- PARCHISI CARD --- */}
//             <div 
//               onClick={() => handleNavigation('/protected/games/parchisi')}
//               className="group relative w-full max-w-sm h-[450px] rounded-3xl overflow-hidden cursor-pointer 
//                          border border-white/10 shadow-2xl transition-all duration-500 
//                          hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-105"
//             >
//               {/* Background Image */}
//               <Image 
//                 src="/assets/parchisi-card.jpg" // Make sure this file exists in public/assets/
//                 alt="3D Parchisi Board"
//                 fill
//                 className="object-cover transition-transform duration-700 group-hover:scale-110"
//               />
              
//               {/* Dark Gradient Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

//               {/* Card Content */}
//               <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center">
//                 <h2 className="text-4xl font-black text-white mb-2 tracking-wide uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
//                   <span className="text-green-500">Parch</span>isi
//                 </h2>
//                 <div className="w-full h-[2px] bg-green-500/50 mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
//                 <button className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full 
//                                    shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all duration-300 
//                                    transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
//                   Roll Dice
//                 </button>
//               </div>
//             </div>

//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }