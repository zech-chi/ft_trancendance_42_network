import { GameStats } from "./Statistics"

export function FriendsStats({ data }: {data: GameStats}) {
    let wins = data.friendsWins;
    let losses = data.friendsLosses;
    let totalGames = data.friendsTotalGames;

    let angleWins;
    let angleLosses;

    if (wins === 0 && losses === 0 && totalGames === 0) {
        angleWins = (1 / 2) * 340;
        angleLosses = (1 / 2) * 340;
    }
    else {
        angleWins = (wins / totalGames) * 340;
        angleLosses = (losses / totalGames) * 340;
    }

    const radius = 90;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="m-1 text-white rounded-2xl w-full p-2 sm:p-3 md:p-4"
        style={{
            background:
              'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), linear-gradient(to left, rgba(42, 21, 34, 1), rgba(96, 31, 48, 1 ) 100%)',
            backgroundBlendMode: 'overlay',
          }}
        >
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 sm:gap-4 md:gap-5">
                {/* Chart Section */}
                <div className="flex flex-col items-center justify-center w-full md:w-auto">
                    <div className="relative flex flex-col items-center justify-center w-48 h-48 xs:w-52 xs:h-52 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                className="stroke-[#56BA1C] stroke-[10] fill-none"
                                strokeLinecap="round"
                                style={{
                                    strokeDasharray: `${90 * (angleWins * Math.PI) / 180} ${2 * Math.PI * 90}`,
                                    strokeDashoffset: 0,
                                }}
                                transform="rotate(-90 100 100)"
                            />

                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                className="stroke-[#F63737] stroke-[10] fill-none"
                                strokeLinecap="round"
                                style={{
                                    strokeDasharray: `${90 * (angleLosses * Math.PI) / 180} ${circumference}`,
                                    strokeDashoffset: `-${90 * ((angleWins + 10) * Math.PI) / 180}`,
                                }}
                                transform="rotate(-90 100 100)"
                            />
                        </svg>
                        <div
                            className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center gap-0.5 sm:gap-1"
                            style={{ transform: "translate(-50%, -50%)" }}
                        >
                            <h1 className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 font-bold text-center px-2">
                                Total games with friends
                            </h1>
                            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white/50 font-bold">
                                {totalGames}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Section */}
                <div className="flex flex-row md:flex-col gap-2 sm:gap-3 w-full md:w-auto justify-center">
                    <div className="flex flex-col items-center justify-center bg-black/30 
                        px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-2
                        rounded-xl sm:rounded-2xl flex-1 md:flex-none">
                        <h3 className="text-[#56BA1C] font-bold text-xs sm:text-sm md:text-base">Win</h3>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/75">
                            {wins}
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/30 
                        px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-2
                        rounded-xl sm:rounded-2xl flex-1 md:flex-none">
                        <h3 className="text-[#F63737] font-bold text-xs sm:text-sm md:text-base">Loss</h3>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/75">
                            {losses}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}