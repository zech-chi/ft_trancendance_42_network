'use client'
import { motion } from 'framer-motion';

interface GameStats {
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

export function AIStats({ data }: {data: GameStats}) {
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
    const baseAngel = 90;
    const baseLength = (baseAngel / 360) * circumFerence;

    const easyAngle = gamesWithAiEasy === 0 ? 0 : (easyWins / gamesWithAiEasy) * baseLength;
    const mediumAngle = gamesWithAiMedium === 0 ? 0 : (mediumWins / gamesWithAiMedium) * baseLength;
    const hardAngle = gamesWithAiHard === 0 ? 0 : (hardWins / gamesWithAiHard) * baseLength;

    return (
        <div className="m-1 text-white w-full p-2 sm:p-3 md:p-4 h-[50%] lg:h-[100%] flex justify-center items-center
        bg-gradient-to-br from-black/20 to-black/10  backdrop-blur-sm hover:from-black/50 hover:to-black/30 rounded-2xl transition-all duration-300 hover:scale-103 border border-white/7
        "
        >
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 sm:gap-4 md:gap-5 p-5">
                {/* Chart Section */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute flex flex-col items-center justify-center gap-0.5 sm:gap-1">
                            <h1 className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 font-bold text-center px-2">
                                Total games with AI
                            </h1>
                            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-white/50 font-bold">
                                {totalGamesWithAi}
                            </h1>
                            <h1 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-bold mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16">
                                {totalWins} / {totalGamesWithAi}
                            </h1>
                        </div>
                        <svg 
                            viewBox="0 0 200 200" 
                            className="w-full h-auto"
                        >
                            {/* Background circle */}
                            <circle cx="100" cy="100" r="90" className="stroke-white/0 stroke-[10] fill-none"/>
                            
                            {/* hard background */}
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

                            {/* medium background */}
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

                            {/* easy background */}
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

                {/* Stats Cards Section */}
                <div className="flex flex-row md:flex-col gap-2 sm:gap-3 w-full md:w-auto justify-center">
                    <div className="flex flex-col items-center justify-center bg-white/10 
                        px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-2
                        rounded-xl sm:rounded-2xl flex-1 md:flex-none">
                        <h3 className="text-[#1CBABA] font-bold text-xs sm:text-sm md:text-base">Easy</h3>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/75 tracking-wider">
                            {easyWins} / {gamesWithAiEasy}
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white/10 
                        px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-2
                        rounded-xl sm:rounded-2xl flex-1 md:flex-none">
                        <h3 className="text-[#FFB700] font-bold text-xs sm:text-sm md:text-base">Medium</h3>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/75">
                            {mediumWins} / {gamesWithAiMedium}
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white/10 
                        px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-2
                        rounded-xl sm:rounded-2xl flex-1 md:flex-none">
                        <h3 className="text-[#F63737] font-bold text-xs sm:text-sm md:text-base">Hard</h3>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/75">
                            {hardWins} / {gamesWithAiHard}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
