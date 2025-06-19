'use client'

import { JSX } from "react";
import { useState } from "react";
import Image from "next/image";

function FriendsStats(): JSX.Element {
    return (
        <div className="m-1 text-white rounded-2xl"
            style={{
                background:
                'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to right, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                backgroundBlendMode: 'overlay',
            }}
        >
            <div className="flex justify-between mx-2 my-1 gap-5">
                <div className="flex flex-col items-center justify-center m-3">
                    <div>
                        
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
    return (
        <div className="m-1 text-white rounded-2xl"
            style={{
                background:
                'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to right, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                backgroundBlendMode: 'overlay',
            }}
        >
            <div className="flex justify-between mx-2 my-1 gap-5">
                <div className="flex flex-col items-center justify-center m-3">
                    <div>
                        chart AI
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

            <div className="flex items-center justify-center">
                <div className="bg-white/50 m-1 text-white"
                    style={{
                        background:
                        'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to left, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                        backgroundBlendMode: 'overlay',
                    }}
                >spiderChart spiderChart spiderChart spiderChart spiderChart spiderChart spiderChart spiderChart</div>

                <div className="flex flex-col">
                    <AIStats />
                    <FriendsStats />
                </div>
            </div>
        </div>
    );
}