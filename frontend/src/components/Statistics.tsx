'use client'
import { use, useEffect, useState } from 'react';
import { RadarChart } from './RadarChart';
import { FriendsStats } from './FriendsStats';
import { AIStats } from './AIStats';
import { useSelectedUserId } from '@/context/SelectedUserId';
type GameName = 'pong' | 'parcheesi';

type ChooseGameProps = {
    game: GameName;
    setGame: (game: GameName) => void;
};

export interface GameStats {
  totalGamesWithAi: number;
  gamesWithAiEasy: number;
  gamesWithAiMedium: number;
  gamesWithAiHard: number;
  totalWins: number;
  easyWins: number;
  mediumWins: number;
  hardWins: number;
  friendsWins: number;
  friendsLosses: number;
  friendsTotalGames: number;
}


function ChooseGame({game, setGame}: ChooseGameProps) {
    return (
        <div className="m-1.5 flex justify-center">
        <div className="inline-flex bg-black/30 gap-1 rounded-4xl">
            <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => setGame('pong')}>
                <img
                src={game === 'pong' ? '/pong_pink.png' : '/pong_white.png'}
                alt="pong"
                className="w-[25px] h-[25px] p-2
                md:w-[30px] md:h-[30px] md:p-2
                xl:w-[35px] xl:h-[35px] xl:p-2
                2xl:w-[40px] 2xl:h-[40px] 2xl:p-2
                cursor-pointer object-contain"
                />

            </div>
                <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => setGame('parcheesi')}>
                <img
                src={game === 'parcheesi' ? '/parcheesi_pink.png' : '/parcheesi_white.png'}
                alt="parcheesi"
                className="w-[25px] h-[25px] p-2
                md:w-[30px] md:h-[30px] md:p-2
                xl:w-[35px] xl:h-[35px] xl:p-2
                2xl:w-[40px] 2xl:h-[40px] 2xl:p-2
                 cursor-pointer"
                />

                </div>
            </div>
        </div>
    );
}

export default function Statistics() {

    const { selectedUserId } = useSelectedUserId();
    const [game, setGame] = useState<GameName>('pong');
    const [data, setData] = useState<GameStats | null>();


    // fetch chart data from backend
    useEffect(() => {
        async function fetchData() {
            try {
                if (!selectedUserId) return;
                const response = await fetch(`http://localhost:5002/api/dashboard/chartsdata/${selectedUserId}?game=${game}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setData(result.stats); // assuming the response has a 'stats' field
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [game, selectedUserId]); // refetch data when game changes

    if (!data) {
        return <div>Loading...3</div>;
    }

    return (
    <div className="flex flex-col items-center justify-center h-full">
      <ChooseGame game={game} setGame={setGame}/>
      <div className="flex w-full">
        <RadarChart/>
        <div className='flex flex-col'>
            <FriendsStats data={data}/>
            <AIStats data={data}/>
        </div>
      </div>
    </div>
  );
}