'use client'

import { JSX } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import Cookies from "js-cookie";
import {useRef} from "react";

export type ChartDataTypes = {
    // for games with AI
  
    totalGamesWithAi: number;
    gamesWithAiEasy: number;
    gamesWithAiMedium: number;
    gamesWithAiHard: number;
    totalWins: number;
    easyWins: number;
    mediumWins: number;
    hardWins: number;
  
    // for games with friends
    friendsWins: number;
    friendsLosses: number;
    friendsTotalGames: number;
}

type GameName = 'pong' | 'parchesi';

type ChartsData = {
    [game: string]: ChartDataTypes
}
type StatsProps = {
    data: ChartDataTypes;
};
  

type StatisticsProps = {
    chartsData: { [game: string]: ChartDataTypes };
};


function FriendsStats({ data }: StatsProps): JSX.Element{
    const wins = data.friendsWins;
    const losses = data.friendsLosses;
    const totalGames = data.friendsTotalGames;

    const angleWins = (wins / totalGames) * 340;
    const angleLosses = (losses / totalGames) * 340;

    const radius = 90;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="m-1 text-white rounded-2xl"
            style={{
                background:
                'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to bottom, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                backgroundBlendMode: 'overlay',
            }}
        >
            <div className="flex justify-between items-center justify-center mx-20 my-3 gap-5">
                <div className="flex flex-col items-center justify-center m-3">
                    <div>
                        <div className="flex flex-col item-center justify-center">
                            <svg viewBox="0 0 200 200" className="w-70 h-70">
                                {/* Background circle */}
                                {/* <circle cx="100" cy="100" r="90" className="stroke-white/10 stroke-[10] fill-none"/> */}
                                {/* win */}
                                {/* <motion.circle
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    className="stroke-[#56BA1C] stroke-[10] fill-none"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: `0 ${circumference}` }}
                                    animate={{ strokeDasharray: `${(radius * (angleWins * Math.PI)) / 180} ${circumference}` }}
                                    transition={{ duration: 0.8, ease: "easeIn" }}
                                    strokeDashoffset={0}
                                    transform="rotate(-90 100 100)"
                                /> */}
                                {/* loss */}

                                {/* <motion.circle
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    className="stroke-[#F63737] stroke-[10] fill-none"
                                    strokeLinecap="round"
                                    initial={{
                                        strokeDasharray: `0 ${circumference}`,
                                        strokeDashoffset: `0`,
                                    }}
                                    animate={{
                                        strokeDasharray: `${(radius * (angleLosses * Math.PI)) / 180} ${circumference}`,
                                        strokeDashoffset: `-${(radius * ((angleWins + 10) * Math.PI)) / 180}`,
                                    }}
                                    transition={{ duration: 0.8, ease: 'easeIn' }}
                                    transform="rotate(-90 100 100)"
                                /> */}


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
                            <div className="absolute w-70 h-70  rounded-full flex flex-col items-center border-25 border-transparent justify-center gap-1">
                                <h1 className="text-l text-white/90 font-bold">Total games with friends </h1>
                                <h1 className="text-5xl text-white/50 font-bold">{totalGames}</h1>
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

function AIStats({ data }: StatsProps): JSX.Element{
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

    const easyAngle = (easyWins / gamesWithAiEasy) * baseLength;
    const mediumAngle = (mediumWins / gamesWithAiMedium) * baseLength;
    const hardAngle = (hardWins / gamesWithAiHard) * baseLength;

    return (
        <div className="m-1 text-white rounded-2xl"
            style={{
                background:
                'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to top, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                backgroundBlendMode: 'overlay',
            }}
        >
            <div className="flex justify-between items-center justify-center mx-20 my-2 gap-5">
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


const points1 = [
    { x: 0, y: -90 },
    { x: 57.9, y: -68.9 },
    { x: 88.6, y: -15.6 },
    { x: 77.9, y: 45.0 },
    { x: 30.8, y: 84.6 },
    { x: -30.8, y: 84.6 },
    { x: -77.9, y: 45.0 },
    { x: -88.6, y: -15.6 },
    { x: -57.9, y: -68.9 },
];

const scaleFactor : number = 0.8;

const points2 = points1.map((
    {x, y}) => ({
        x: x * scaleFactor,
        y: y * scaleFactor,
    }
));

const points3 = points1.map((
    {x, y}) => ({
        x: x * (2 * scaleFactor - 1),
        y: y * (2 * scaleFactor - 1),
    }
));

const points4 = points1.map((
    {x, y}) => ({
        x: x * (3 * scaleFactor - 2),
        y: y * (3 * scaleFactor - 2),
    }
));


const points5 = points1.map((
    {x, y}) => ({
        x: x * (4 * scaleFactor - 3),
        y: y * (4 * scaleFactor - 3),
    }
));


const pointsData =  [
    17.2,
    3,
    17,
    3.5,
    9.1,
    1,
    3,
    7.3,
    13
]

const skills = [
    "Quick Reflexes",
    "Strategic Thinking",
    "Precision Shots",
    "Pattern Recognition",
    "Anticipating Moves",
    "Board Control",
    "Adaptive Playstyle",
    "Risk Management",
    "Mind Games",
];

function isPointBetweenLines(x1: number, y1: number, a1: number, a2: number): boolean {
    const yLine1 = a1 * x1;
    const yLine2 = a2 * x1;
  
    return y1 >= Math.min(yLine1, yLine2) && y1 <= Math.max(yLine1, yLine2);
}

function isPointBetweenAngles(x1: number, y1: number, sep1: { x: number, y: number }, sep2: { x: number, y: number }): boolean {
    const pointAngle = Math.atan2(y1, x1);
    const angle1 = Math.atan2(sep1.y, sep1.x);
    const angle2 = Math.atan2(sep2.y, sep2.x);

    const twoPi = Math.PI * 2;

    const normalize = (angle: number) => (angle + twoPi) % twoPi;

    const a = normalize(pointAngle);
    const start = normalize(angle1);
    const end = normalize(angle2);

    if (start < end) return a >= start && a <= end;
    return a >= start || a <= end;
}


function SpiderChart() : JSX.Element {
    const [hoveredIndex, setHoveredIndex] = useState<number>(Number(Cookies.get('hoveredIndex') || 0));
    const getScaleFactor = (x: number) => 0.2 + (x / 20) * 0.8;

    useEffect(() => {
        Cookies.set('hoveredIndex', hoveredIndex.toString(), { expires: 365 });
    }, [hoveredIndex]);

    const scaledPoints = pointsData.map((value, index) => {
        const scale = getScaleFactor(value);
        return {
            x: points1[index].x * scale,
            y: points1[index].y * scale,
        }
    });

    const sperators: { x: number; y: number }[] = [];

    for (let i = 1; i < 9; i++) {
        sperators.push(
            {
                x: (points1[i].x + points1[i - 1].x) / 2,
                y: (points1[i].y + points1[i - 1].y) / 2
            }
        )
    }

    sperators.push(
        {
            x: (points1[0].x + points1[8].x) / 2,
            y: (points1[0].y + points1[8].y) / 2
        }
    )


    
    const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    console.log(sperators);

    const setActivatedCircleIndex = (() => {
        if (coords.x === 0 && coords.y === 0)
            return ;

        if (isPointBetweenLines(coords.x, coords.y, (sperators[0].y / sperators[0].x), (sperators[1].y / sperators[1].x))
            && (coords.x > 0)
        )
            setHoveredIndex(1);
        if (isPointBetweenLines(coords.x, coords.y, (sperators[1].y / sperators[1].x), (sperators[2].y / sperators[2].x))
            && (coords.x > 0)
        )
            setHoveredIndex(2);
        if (isPointBetweenLines(coords.x, coords.y, (sperators[2].y / sperators[2].x), (sperators[3].y / sperators[3].x))
            && (coords.x > 0)
        )
            setHoveredIndex(3);
        if (isPointBetweenLines(coords.x, coords.y, (sperators[3].y / sperators[3].x), (sperators[4].y / sperators[4].x))
            && (coords.y > 0)
        )
            setHoveredIndex(4);
        if (isPointBetweenAngles(coords.x, coords.y, sperators[4], sperators[5])
            && (coords.y > 0)
        )
            setHoveredIndex(5);
        if (isPointBetweenLines(coords.x, coords.y, (sperators[5].y / sperators[5].x), (sperators[6].y / sperators[6].x))
            && (coords.y > 0)
        )
            setHoveredIndex(6);
        if (isPointBetweenLines(coords.x, coords.y, (sperators[6].y / sperators[6].x), (sperators[7].y / sperators[7].x))
            && (coords.x < 0)
        )
            setHoveredIndex(7);
        if (isPointBetweenLines(coords.x, coords.y, (sperators[7].y / sperators[7].x), (sperators[8].y / sperators[8].x))
            && (coords.x < 0)
        )
            setHoveredIndex(8);
        if (isPointBetweenAngles(coords.x, coords.y, sperators[8], sperators[0])
            && (coords.y < 0)
        )
            setHoveredIndex(0);
        

    })

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width) * 200 - 100;
        const py = ((event.clientY - rect.top) / rect.height) * 200 - 100;

        setCoords(
            {
                x: Number(px),
                y: Number(py)
            }
        )

        setActivatedCircleIndex();
    }

    const resetCoords = (() => {
        setCoords(
            {
                x: Number(0),
                y: Number(0)
            }
        )
    });
    
    return (
        <div className="w-160 h-160 rounded-full flex flex-col items-center justify-center m-38 my-5">
            <svg ref={svgRef} className="w-130 h-130" viewBox="-100 -100 200 200" onMouseMove={handleMouseMove} onMouseLeave={resetCoords}>
                {
                    sperators.map((point, index) => (
                        <line
                        key={index}
                        x1={0}
                        y1={0}
                        x2={point.x}
                        y2={point.y}
                        className="stroke-2 stroke-white/10"
                        />
                    ))
                }
                <polygon
                    points={points1.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/20 stroke-white/15 stroke-2"
                />
                <polygon
                    points={points2.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/30 stroke-white/15 stroke-2"
                />
                <polygon
                    points={points3.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/40 stroke-white/15 stroke-2"
                />
                <polygon
                    points={points4.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/50 stroke-white/15 stroke-2"
                />
                <polygon
                    points={points5.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/60 stroke-white/15 stroke-2"
                />
                <circle cx="0" cy="0" r="7.5" className="fill-black" />

                {/* define gradient color */}
                <defs>
                    <linearGradient id="myGradient">
                    <stop offset="0%" stopColor="#FE9734" stopOpacity="0.7"/>
                    <stop offset="50%" stopColor="#ED66B7" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#5360CB" stopOpacity="0.7"/>
                    </linearGradient>
                </defs>

                <polygon
                    points={scaledPoints.map(p => `${p.x},${p.y}`).join(' ')}
                    className="stroke-[#531E2E]/75 stroke-2"
                    fill="url(#myGradient)"
                />

                {
                    scaledPoints.map((point, index) => (
                        <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={hoveredIndex === index ? 3.3 : 2.3}
                            className={hoveredIndex === index ? "fill-[#632133]" : "fill-[#632133]"}
                            onMouseEnter={() => setHoveredIndex(index)}
                        />
                    ))
                }
                

                <circle cx={coords.x} cy={coords.y} r="2"
                    className={(coords.x === 0 && coords.y === 0) ? "fill-transparent" : "fill-[#632133]"}
                />
            </svg>
            <h1 className="text-4xl text-[#FEDF7F] font-bold">{skills[hoveredIndex]}</h1>
            <h1 className="text-2xl text-[#FEDF7F]/80 font-bold">{pointsData[hoveredIndex]} / 20</h1>
        </div>
    );
}

export default function Statistics({ chartsData }: StatisticsProps): JSX.Element {
    const [game, setGame] = useState<GameName>((Cookies.get('SelectedGame') as GameName) || 'pong');
    const [data, setData] = useState<ChartDataTypes>(chartsData[game]);

    function handleChangeGame(newGame: GameName) {
        setGame(newGame);
        setData(chartsData[newGame]);
    }

    useEffect(() => {
        Cookies.set('SelectedGame', game, { expires: 365 });
    }, [game]);

    return (
        <div>
            <div className="m-1 flex justify-center">
                <div className="inline-flex bg-black/30 gap-3 rounded-4xl">
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

            <div className="flex items-center justify-center gap-5">
                <div className="bg-white/50 m-1 text-white rounded-2xl"
                    style={{
                        background:
                        'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to left, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                        backgroundBlendMode: 'overlay',
                    }}
                >
                    <SpiderChart />
                </div>

                <div className="flex flex-col gap-5">
                    <AIStats data={data} />
                    <FriendsStats data={data} />
                </div>
            </div>
        </div>
    );
}