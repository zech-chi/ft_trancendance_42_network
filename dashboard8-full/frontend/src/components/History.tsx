'use client'

import next from "next";
import { JSX } from "react";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from "next/image";
import Cookies from "js-cookie";

type GameName = 'pong' | 'parchesi';

interface User {
  fullName: string;
  userName: string;
  imageUrl: string;
  rank: number;
  level: number;
  progress: number;
  online: boolean;
}

export function SearchForm(): JSX.Element {
    return (
      <form className="max-w-xl mx-auto flex-1 mt-7">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full px-10 py-2 rounded-full text-[#B2B2B2] outline-none"
            style={{
              background:
                'linear-gradient(to right, rgba(47,25,37,0.7) 0%, rgba(72,28,43,0.7) 50%, rgba(100,33,52,0.7) 100%)',
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-[#B2B2B2]" />
        </div>
      </form>
    );
}

const userX = {
  fullName    :   "Gon Freecss",
  userName    :   "hunterGon",
  imageUrl    :   "/kilwa.png",
  rank	    :   1337,
  level	    :   9,
  progress    :   0.75,
  online	    :   true
}

const userY = {
  fullName    :   "Gon Freecss",
  userName    :   "hunterGon",
  imageUrl    :   "/gon.jpg",
  rank	    :   1337,
  level	    :   9,
  progress    :   0.75,
  online	    :   true
}

function ProfileImage({ imageUrl }: { imageUrl: string }): JSX.Element {
  return (
    <div className="relative rounded-full w-[80px] h-[80px] overflow-hidden border-2 border-black m-3">
      <Image
        src={imageUrl}
        alt="Profile"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority
      />
    </div>
  );
}

function DisplayData({ user1, user2, user1Won }: { user1: User, user2: User, user1Won: Boolean }): JSX.Element {
  return (
    <div className="w-full flex items-center h-25 justify-between rounded-full bg-[#612132]/30 text-white border-[1px] border-white/8">
      {/* Left Profile (user1) */}
      <div className="relative w-[100px] h-[100px]">
        <div className="w-full h-full rounded-full border-[15px] 
          border-[#F63737] border-l-transparent border-b-transparent 
          border-t-[#F63737] border-r-[#F63737] flex items-center justify-center overflow-hidden rotate-225">
          <img src={user1.imageUrl} alt={user1.userName} className="w-full h-full object-cover rounded-full -rotate-225 border-5 border-black" />
        </div>
        <div className="absolute bottom-[18px] right-[23px] w-3 h-3 bg-[#00FF04] rounded-full border-2 border-black" />
      </div>

      {/* Center Score & Date */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl font-bold">
          {user1Won ? (
            <>
              9  <span>–</span>  4
            </>
          ) : (
            <>
              4  <span>–</span>  9
            </>
          )}
        </div>

        <div className="text-[#FEDF7F] text-sm mt-2">09.03.2024</div>
      </div>

      {/* Right Profile (user2) */}
      <div className="relative w-[100px] h-[100px]">
        <div className="w-full h-full rounded-full border-[15px] 
          border-[#56BA1C] border-r-transparent border-b-transparent 
          border-t-[#56BA1C] border-l-[#56BA1C] flex items-center justify-center overflow-hidden -rotate-225">
          <img src={user2.imageUrl} alt={user2.userName} className="w-full h-full object-cover rounded-full border-5 border-black rotate-225" />
        </div>
      </div>
    </div>
  );
}


export default function History(): JSX.Element {
    const [game, setGame] = useState<GameName>((Cookies.get('SelectedGameHistory') as GameName) || 'pong');
    
    function handleChangeGame(newGame: GameName) {
      setGame(newGame);
    }

    useEffect(() => {
        Cookies.set('SelectedGameHistory', game, { expires: 365 });
    }, [game]);


    return (
        <div className="h-full flex flex-col">

          {/* search */}
          <div className="shrink-0">
            <SearchForm />
          </div>
          
          {/* select game */}
          <div className="mt-5 flex justify-center">
                <div className="inline-flex bg-white/5 gap-3 rounded-4xl">
                    <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => handleChangeGame('pong')}>
                        <Image src={game === 'pong' ? '/pong_pink.png' : '/pong_white.png'} alt="pong" width={40} height={40} 
                            className="p-2 cursor-pointer object-contain"
                        />
                    </div>
                    <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => handleChangeGame('parchesi')}>
                        <Image src={game === 'parchesi' ? '/parchesi_pink.png' : '/parchesi_white.png'} alt="parchesi" width={40} height={40}
                            className="p-2 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

          {/* display data */}
          <div className="m-3 flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-2  custom-scrollbar" >
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
            <DisplayData user1={userX} user2={userY} user1Won={false}/>
          </div>
        </div>
    )
}
