'use client'

import next from "next";
import { JSX, use } from "react";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from "next/image";
import Cookies from "js-cookie";
import { useUserName } from "@/context/UserNameContext";
import { data } from "framer-motion/client";

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

type Game = {
  id: number;
  user1: string;
  user2: string;
  user1_score: number;
  user2_score: number;
  user1_win: boolean;
  date_played: string;
  game_type: string;
};


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


const fetchUser = async (userName: string) => {
  const response = await fetch(`http://localhost:5000/users/${userName}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

function DisplayData({ game }: { game: Game }): JSX.Element {
  const [userCur, setUserCur] = useState<any | null>(null);
  const [userOther, setUserOther] = useState<any | null>(null);
  const { username } = useUserName();

  const isCurrentUserUser1 = username === game.user1;
  const currentUserWon = (game.user1_win && isCurrentUserUser1) || (!game.user1_win && !isCurrentUserUser1);
  const opponentWon = !currentUserWon;

  useEffect(() => {
    setTimeout(() => {
      const fetchData = async () => {
        const cur = await fetchUser(isCurrentUserUser1 ? game.user1 : game.user2);
        const other = await fetchUser(isCurrentUserUser1 ? game.user2 : game.user1);
        setUserCur(cur);
        setUserOther(other);
      };
      fetchData();
    }, 500);
  }, [game, username]);

  if (!userCur || !userOther) {
    return (
      <div className="w-full flex items-center justify-center h-25 rounded-full bg-[#612132]/30 text-white border-[1px] border-white/8">
        <div className="flex justify-center items-center h-full">
          <div className="w-5 h-5 border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex items-center h-25 justify-between rounded-full bg-[#612132]/30 text-white border-[1px] border-white/8">
      
      {/* Left Profile (Opponent) */}
      <div className="relative w-[100px] h-[100px]">
        <div className={`w-full h-full rounded-full border-[15px] 
          ${opponentWon ? 'border-[#56BA1C]' : 'border-[#F63737]'} 
          border-l-transparent border-b-transparent 
          border-t-${opponentWon ? '[#56BA1C]' : '[#F63737]'} 
          border-r-${opponentWon ? '[#56BA1C]' : '[#F63737]'} 
          flex items-center justify-center overflow-hidden rotate-225`}>
          <img
            src={userOther.imageUrl}
            alt={userOther.userName}
            className="w-full h-full object-cover rounded-full -rotate-225 border-5 border-black"
          />
        </div>
        {
          userOther.online && <div className="absolute bottom-[18px] right-[23px] w-3 h-3 bg-[#00FF04] rounded-full border-2 border-black" />
        }
        {
          !userOther.online && <div className="absolute bottom-[18px] right-[23px] w-3 h-3 bg-[#FF0000] rounded-full border-2 border-black" />
        }
      </div>

      {/* Center Score & Date */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl font-bold">
          {isCurrentUserUser1 ? (
            <>
              {game.user2_score} <span>–</span> {game.user1_score}
            </>
          ) : (
            <>
              {game.user1_score} <span>–</span> {game.user2_score}
            </>
          )}
        </div>
        <div className="text-[#FEDF7F]/70 text-sm mt-2">
          {game.date_played.slice(0, 16)}
        </div>
      </div>

      {/* Right Profile (Current User) */}
      <div className="relative w-[100px] h-[100px]">
        <div className={`w-full h-full rounded-full border-[15px] 
          ${currentUserWon ? 'border-[#56BA1C]' : 'border-[#F63737]'} 
          border-r-transparent border-b-transparent 
          border-t-${currentUserWon ? '[#56BA1C]' : '[#F63737]'} 
          border-l-${currentUserWon ? '[#56BA1C]' : '[#F63737]'} 
          flex items-center justify-center overflow-hidden -rotate-225`}>
          <img
            src={userCur.imageUrl}
            alt={userCur.userName}
            className="w-full h-full object-cover rounded-full border-5 border-black rotate-225"
          />
        </div>
      </div>
    </div>
  );
}

const fetchGames = async (userName: string, gameType: string) => {
  const response = await fetch(`http://localhost:5000/Games/${userName}?gameType=${gameType}`);
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  const data = await response.json();
  return data;
}

export default function History(): JSX.Element {
    const [game, setGame] = useState<GameName>((Cookies.get('SelectedGameHistory') as GameName) || 'pong');
    const [games, setGames] = useState<any[]>([]);
    const { username, setUserName } = useUserName();
    
    function handleChangeGame(newGame: GameName) {
      setGame(newGame);
    }

    useEffect(() => {
        Cookies.set('SelectedGameHistory', game, { expires: 365 });
        if (username) {
          fetchGames(username, game)
            .then((games) => {
              setGames(games)
              // console.log("Games fetched: ", games);
            }
          )
          .catch((err) => console.error("Error: ", err));
        }
    }, [game, username]);

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
            {/* <DisplayData user1={userX} user2={userY} user1Won={false}/> */}
            { games.length > 0 ? (
              games.map((game, index) => (
                <DisplayData game={game} key={game.id}/>
              ))
            ) : (
              <div className="text-center font-bold text-[#FEDF7F]/50">No games found</div>
            )}
          </div>
        </div>
    )
}
