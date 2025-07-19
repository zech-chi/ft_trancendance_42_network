
export function FriendsStats() {
    const data = {"totalGamesWithAi":974,"gamesWithAiEasy":53,"gamesWithAiMedium":451,"gamesWithAiHard":470,"totalWins":747,"easyWins":50,"mediumWins":408,"hardWins":289,"friendsWins":617,"friendsLosses":235,"friendsTotalGames":852}
    const wins = data.friendsWins;
    const losses = data.friendsLosses;
    const totalGames = data.friendsTotalGames;

    const angleWins = (wins / totalGames) * 340;
    const angleLosses = (losses / totalGames) * 340;

    const radius = 90;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="m-1 text-white rounded-2xl w-[90%] md:w-[40%]"
        style={{
            background:
              'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), linear-gradient(to left, rgba(42, 21, 34, 1), rgba(96, 31, 48, 1 ) 100%)',
            backgroundBlendMode: 'overlay',
          }}
        >
            <div className="flex justify-between items-center my-3 gap-5">
                <div className="flex flex-col items-center justify-center m-3">
                    <div>
                        <div className="relative flex flex-col item-center justify-center">
                            <svg viewBox="0 0 200 200" className="w-[100%] aspect-square">
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
                                className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center gap-1"
                                style={{ transform: "translate(-50%, -50%)" }}
                                >
                                <h1 className="text-[10px] text-white/90 font-bold">
                                    Total games with friends
                                </h1>
                                <h1 className="text-sm text-white/50 font-bold">{totalGames}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#56BA1C] font-bold">Win</h3>
                        <p className="text-xl text-white/75">{wins}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#F63737] font-bold">Loss</h3>
                        <p className="text-xl text-white/75">{losses}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
