'use client'

import { JSX } from "react";
import { useState } from "react";
import Image from "next/image";

function FriendsStats(): JSX.Element {
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
                            <div className="w-70 h-70  rounded-full flex flex-col items-center border-25 border-[#FEDF7F]/60 justify-center gap-1">
                                <h1 className="text-l text-white/90 font-bold">Total games with friends </h1>
                                <h1 className="text-5xl text-white/50 font-bold">545</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#56BA1C] font-bold">Win</h3>
                        <p className="text-xl text-white/75">532</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#F63737] font-bold">Loss</h3>
                        <p className="text-xl text-white/75">13</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AIStats(): JSX.Element {
    const radius = 80;

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
                                {/* <div className="w-70 h-70  rounded-full flex flex-col items-center border-25 border-[#FEDF7F]/60 justify-center gap-1">
                                    <h1 className="text-l text-white/90 font-bold">Total games with AI</h1>
                                    <h1 className="text-5xl text-white/50 font-bold">15</h1>
                                </div> */}
                            <svg viewBox="0 0 200 200" className="w-70 h-70">
                            {/* Background circle */}
                            <circle cx="100" cy="100" r="90" className="stroke-white/10 stroke-[15] fill-none"/>
                            {/* Easy difficulty */}
                            <circle
    cx="100"
    cy="100"
    r="90"
    className="stroke-yellow-400 stroke-[15] fill-none stroke-linecap-round"
    style={{
      strokeDasharray: `${(8 / 13) * (2 * Math.PI * 60)} ${2 * Math.PI * 20}`,
      strokeDashoffset: 0,
    }}
  />

                            </svg>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#1CBABA] font-bold">Easy</h3>
                        <p className="text-xl text-white/75 tracking-wider">4/5</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#FFB700] font-bold">Medium</h3>
                        <p className="text-xl text-white/75">4/5</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/30 px-8 py-2 rounded-2xl m-3">
                        <h3 className="text-[#F63737] font-bold">Hard</h3>
                        <p className="text-xl text-white/75">4/5</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpiderChart() : JSX.Element {
    return (
        <div className="w-160 h-160 bg-[#FEDF7F]/60 rounded-full flex items-center justify-center m-38 my-5">
            <h1 className="text-5xl text-black font-bold">Spider Chart here</h1>
        </div>
    );
}

export default function Statistics() : JSX.Element {
    const [game, setGame] = useState<string>('pong');

    return (
        <div>
            <div className="m-1 flex justify-center">
                <div className="inline-flex bg-black/30 gap-3 rounded-4xl">
                    <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => setGame('pong')}>
                        <Image src={game === 'pong' ? '/pong_pink.png' : '/pong_white.png'} alt="pong" width={40} height={40} 
                            className="p-2 cursor-pointer object-contain"
                        />
                    </div>
                    <div className="bg-black/50 rounded-full mx-2 my-1.5 hover:bg-black/70" onClick={() => setGame('parchesi')}>
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
                    <AIStats />
                    <FriendsStats />
                </div>
            </div>
        </div>
    );
}