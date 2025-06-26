'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { JSX } from 'react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar(): JSX.Element {
    const [selected, setSelected] = useState<string>(usePathname());

    const handleClick = (link: string): void => {
        setSelected(link);
        console.log(`Selected link: ${link}`);
    }

    return (
        <aside className="fixed left-2 top-1/2 -translate-y-1/2 h-113 w-23 rounded-full bg-black/60 backdrop-blur p-4 z-10">
            <nav className="flex justify-content flex-col space-y-15">
                <Link 
                    href="/"
                    className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex items-center justify-center transition"
                    onClick={() => handleClick('/')}
                >
                    <Image src={selected === '/' ? '/HOME2.png' : '/HOME.png'} alt="Home" width={25} height={25} />
                </Link>
                
                <Link 
                    href="/chat"
                    className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex items-center justify-center transition"
                    onClick={() => handleClick('/chat')}
                >
                    <Image src={selected === '/chat' ? '/CHAT2.png' : '/CHAT.png'} alt="Chat" width={25} height={25} />
                </Link>
                
                <Link
                    href="/games"
                    className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex items-center justify-center transition"
                    onClick={() => handleClick('/games')}    
                >
                    <Image src={selected === '/games' ? '/GAMES2.png' : '/GAMES.png'} alt="Games" width={25} height={25} />
                </Link>
                
                <Link 
                    href="/settings"
                    className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex items-center justify-center transition"
                    onClick={() => handleClick('/settings')}
                >
                    <Image src={selected === '/settings' ? '/SETTINGS2.png' : '/SETTINGS.png'} alt="Settings" width={25} height={25} />
                </Link>
            </nav>
        </aside>
    );
};
