'use client'
import { motion } from 'framer-motion';
import { GameStats } from './Statistics';

export function AIStats({ data }: {data: GameStats}) {
    // const data = {"totalGamesWithAi":974,"gamesWithAiEasy":53,"gamesWithAiMedium":451,"gamesWithAiHard":470,"totalWins":747,"easyWins":50,"mediumWins":408,"hardWins":289,"friendsWins":617,"friendsLosses":235,"friendsTotalGames":852}
    const totalGamesWithAi = data.totalGamesWithAi;
    const gamesWithAiEasy = data.gamesWithAiEasy;
    const gamesWithAiMedium = data.gamesWithAiMedium;
    const gamesWithAiHard = data.gamesWithAiHard;
    const totalWins = data.totalWins;
    const easyWins = data.easyWins;
    const mediumWins = data.mediumWins;
    const hardWins = data.hardWins;


    const radius = 90;
    const circumFerence = 2 * Math.PI * radius;
    const baseAngel = 90; // 90 degrees for each section
    const baseLength = (baseAngel / 360) * circumFerence;

    // const easyAngle = (easyWins / gamesWithAiEasy) * baseLength;
    // const mediumAngle = (mediumWins / gamesWithAiMedium) * baseLength;
    // const hardAngle = (hardWins / gamesWithAiHard) * baseLength;
    const easyAngle = gamesWithAiEasy === 0 ? 0 : (easyWins / gamesWithAiEasy) * baseLength;
    const mediumAngle = gamesWithAiMedium === 0 ? 0 : (mediumWins / gamesWithAiMedium) * baseLength;
    const hardAngle = gamesWithAiHard === 0 ? 0 : (hardWins / gamesWithAiHard) * baseLength;

    return (
        <div className="m-1 text-white rounded-2xl"
            style={{
                background:
                'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), linear-gradient(to left, rgba(42, 21, 34, 1), rgba(96, 31, 48, 1 ) 100%)',
                backgroundBlendMode: 'overlay',
            }}
        >
            <div className="flex justify-between items-center my-2 gap-5">
                <div className="flex flex-col items-center justify-center m-3">
                    <div>
                        <div>
                            <div className="flex flex-col item-center justify-center">
                                <div className="absolute w-70 h-70  rounded-full flex flex-col items-center border-25 border-transparent justify-center gap-1">
                                    <h1 className="text-l text-white/90 font-bold">Total games with AI</h1>
                                    <h1 className="text-5xl text-white/50 font-bold">{totalGamesWithAi}</h1>
                                    <h1 className="absolute pt-61 text-2xl text-white/60 font-bold">{totalWins} / {totalGamesWithAi}</h1>
                                </div>
                                <svg viewBox="0 0 200 200" className="w-70 h-70">
                                    {/* Background circle */}
                                    <circle cx="100" cy="100" r="90" className="stroke-white/0 stroke-[10] fill-none"/>
                                    {/* hard */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        className="stroke-[#512B2B] stroke-[10] fill-none"
                                        strokeLinecap="round"
                                        style={{
                                            strokeDasharray: `${baseLength} ${circumFerence}`,
                                            strokeDashoffset: 0,
                                        }}
                                        transform="rotate(-35 100 100)"
                                    />
                                    {/* hard wins */}

                                    <motion.circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        className="stroke-[#F63737] stroke-[10] fill-none"
                                        animate={{ strokeDasharray: `${hardAngle} ${circumFerence}` }}
                                        initial={{ strokeDasharray: `0 ${circumFerence}` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        strokeDashoffset={0}
                                        strokeLinecap="round"
                                        transform="rotate(-35 100 100)"
                                    />

                                    
                                    {/* medium */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        className="stroke-[#534520] stroke-[10] fill-none"
                                        style={{
                                            strokeDasharray: `${baseLength} ${circumFerence}`,
                                            strokeDashoffset: 0,
                                        }}
                                        strokeLinecap="round"
                                        transform="rotate(-135 100 100)"
                                    />

                                    {/* medium wins */}
                                    <motion.circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        className="stroke-[#FFB700] stroke-[10] fill-none"
                                        animate={{ strokeDasharray: `${mediumAngle} ${circumFerence}` }}
                                        initial={{ strokeDasharray: `0 ${circumFerence}` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        strokeDashoffset={0}
                                        transform="rotate(-135 100 100)"
                                    />

                                    {/* easy */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        className="stroke-[#264545] stroke-[10] fill-none"
                                        style={{
                                            strokeDasharray: `${baseLength} ${circumFerence}`,
                                            strokeDashoffset: 0,
                                        }}
                                        strokeLinecap="round"
                                        transform="rotate(-235 100 100)"
                                    />

                                    {/* easy wins */}

                                    <motion.circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        className="stroke-[#1CBABA] stroke-[10] fill-none"
                                        animate={{ strokeDasharray: `${easyAngle} ${circumFerence}` }}
                                        initial={{ strokeDasharray: `0 ${circumFerence}` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        strokeDashoffset={0}
                                        transform="rotate(-235 100 100)"
                                    />

                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#1CBABA] font-bold">Easy</h3>
                        <p className="text-xl text-white/75 tracking-wider">{easyWins} / {gamesWithAiEasy}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#FFB700] font-bold">Medium</h3>
                        <p className="text-xl text-white/75">{mediumWins} / {gamesWithAiMedium}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#F63737] font-bold">Hard</h3>
                        <p className="text-xl text-white/75">{hardWins} / {gamesWithAiHard}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}