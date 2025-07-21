'use client'
import { useState } from 'react';
import { RadarChart } from './RadarChart';
import { FriendsStats } from './FriendsStats';
import { AIStats } from './AIStats';
type GameName = 'pong' | 'parchesi';

type ChooseGameProps = {
    game: GameName;
    setGame: (game: GameName) => void;
};

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
                <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => setGame('parchesi')}>
                <img
                src={game === 'parchesi' ? '/parchesi_pink.png' : '/parchesi_white.png'}
                alt="parchesi"
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
    const [game, setGame] = useState<GameName>('pong');

    return (
    <div className="flex flex-col items-center justify-center h-full">
      <ChooseGame game={game} setGame={setGame}/>
      <div className="flex w-full">
        <RadarChart/>
        <div className='flex flex-col'>
            <FriendsStats/>
            <AIStats />
        </div>
      </div>
    </div>
  );
}