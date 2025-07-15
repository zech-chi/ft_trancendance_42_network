'use client';
import React from 'react';
import { JSX } from 'react';
import { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from "react";
import { fetchGames, fetchUser } from '@/app/lib/apiDashboard';
import Cookies from 'js-cookie';
import {useLoggedUserName} from '@/context/LoggedUserNameContext';

type GameName = 'pong' | 'parchesi';
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
  
interface HistoryProps {
    game: GameName;
    setGame: Dispatch<SetStateAction<GameName>>;
}

export function SelectGame({ game, setGame }: HistoryProps): JSX.Element {
    useEffect(() => {
        Cookies.set('SelectedGameHistory', game, { expires: 365 });
    }, [game]);

    return (
        <>
            <div className="mt-2.5 flex justify-center">
                <div className="inline-flex bg-white/5 gap-3 rounded-4xl">
                    <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => setGame('pong')}>
                        <img src={game === 'pong' ? '/pong_pink.png' : '/pong_white.png'} alt="pong"
                            className="p-2 cursor-pointer
                                w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11
                            "
                        />
                    </div>
                    <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => setGame('parchesi')}>
                        <img src={game === 'parchesi' ? '/parchesi_pink.png' : '/parchesi_white.png'} alt="parchesi" width={40} height={40}
                            className="p-2 cursor-pointer
                                w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11
                            "
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

function DisplayData({ game }: { game: Game }): JSX.Element {
    const [userCur, setUserCur] = useState<any | null>(null);
    const [userOther, setUserOther] = useState<any | null>(null);
    const { loggedUserName } = useLoggedUserName();
  
    const isCurrentUserUser1 = loggedUserName === game.user1;
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
      }, 1000);
    }, [game, loggedUserName]);
  
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
        <div className="relative 
        w-[80px] h-[80px] md:w-[90px] md:h-[90px] lg:w-[100px] lg:h-[100px]
        ">
          <div className={`w-full h-full rounded-full border-[15px] 
            ${opponentWon ? 'border-[#56BA1C]' : 'border-[#F63737]'} 
            border-l-transparent border-b-transparent 
            border-t-${opponentWon ? '[#56BA1C]' : '[#F63737]'} 
            border-r-${opponentWon ? '[#56BA1C]' : '[#F63737]'} 
            flex items-center justify-center overflow-hidden rotate-225`}>
            <img
              src={userOther.imageUrl}
              alt={userOther.userName}
              className="w-full h-full object-cover rounded-full -rotate-225 
              border-3 md:border-4 lg:border-5
            border-black"
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
          <div className="
          text-l md:text-xl lg:text-2xl  
          font-bold">
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
          <div className="text-[#FEDF7F]/70 
          text-sm mt-2">
            {game.date_played.slice(0, 16)}
          </div>
        </div>
  
        {/* Right Profile (Current User) */}
        <div className="relative 
        w-[80px] h-[80px] md:w-[90px] md:h-[90px] lg:w-[100px] lg:h-[100px]
        ">
          <div className={`w-full h-full rounded-full border-[15px] 
            ${currentUserWon ? 'border-[#56BA1C]' : 'border-[#F63737]'} 
            border-r-transparent border-b-transparent 
            border-t-${currentUserWon ? '[#56BA1C]' : '[#F63737]'} 
            border-l-${currentUserWon ? '[#56BA1C]' : '[#F63737]'} 
            flex items-center justify-center overflow-hidden -rotate-225`}>
            <img
              src={userCur.imageUrl}
              alt={userCur.userName}
              className="w-full h-full object-cover rounded-full
              border-3 md:border-4 lg:border-5
              border-black rotate-225"
            />
          </div>
        </div>
      </div>
    );
  }

export function History({ game, setGame }: HistoryProps): JSX.Element {
    const [games, setGames] = useState<any[]>([]);
	const { loggedUserName } = useLoggedUserName();
    

    useEffect(() => {
        Cookies.set('SelectedGameHistory', game, { expires: 365 });
        if (loggedUserName) {
            fetchGames(loggedUserName, game)
            .then((games) => {
              setGames(games)
              console.log("Games fetched: ", games);
                }
            )
            .catch((err) => console.error("Error: ", err));
        }
    
    }, [game]);

    return (
        <div>
            {/* History content */}
            <div className="m-3 flex-1 px-4 py-2 space-y-2 custom-scrollbar
            ">
            { games.length > 0 ? (
              games.map((game, index) => (
                <DisplayData game={game} key={game.id}/>
              ))
            ) : (
              <div className="text-center font-bold text-[#FEDF7F]/50">No games found</div>
            )}
            {/* Add your friends list content here */}
            </div>
        </div>
    );
}