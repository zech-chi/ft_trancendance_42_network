'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { JSX } from 'react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
    { 
        href: '/',
        label: 'Home',
        icon: '/HOME.png',
        activeIcon: '/HOME2.png'
    },
    { 
        href: '/chat',
        label: 'Chat',
        icon: '/CHAT.png',
        activeIcon: '/CHAT2.png'
    },
    { 
        href: '/games',
        label: 'Games',
        icon: '/GAMES.png',
        activeIcon: '/GAMES2.png'
    },
    { 
        href: '/settings',
        label: 'Settings',
        icon: '/SETTINGS.png',
        activeIcon: '/SETTINGS2.png'
    }
];

export default function Sidebar(): JSX.Element {
    const [selected, setSelected] = useState<string>(usePathname());

    const handleClick = (link: string): void => {
        setSelected(link);
    }

    return (
        <aside 
            className={`
                fixed z-10
                bg-black/40 backdrop-blur p-2.5
                rounded-full
                flex
                rotate-90 lg:rotate-0
                md:left-2 md:top-1/2 md:-translate-y-1/2 md:flex-col md:space-y-4
                bottom-2 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto
                space-x-4 md:space-x-0
                w-auto h-auto
                origin-bottom-left lg:origin-center
            `}
        >
            {/* <nav className="flex justify-content flex-col space-y-15">
                <Link 
                    href="/"
                    className="bg-black/50 hover:bg-black/70 rounded-full w-15 h-15 flex items-center justify-center transition"
                    onClick={() => handleClick('/')}
                >
                    <Image src={selected === '/' ? '/HOME2.png' : '/HOME.png'} alt="Home" width={25} height={25} />
                </Link>
                
                <Link 
                    href="/chat"
                    className="bg-black/50 hover:bg-black/70 rounded-full w-15 h-15 flex items-center justify-center transition"
                    onClick={() => handleClick('/chat')}
                >
                    <Image src={selected === '/chat' ? '/CHAT2.png' : '/CHAT.png'} alt="Chat" width={25} height={25} />
                </Link>
                
                <Link
                    href="/games"
                    className="bg-black/50 hover:bg-black/70 rounded-full w-15 h-15 flex items-center justify-center transition"
                    onClick={() => handleClick('/games')}    
                >
                    <Image src={selected === '/games' ? '/GAMES2.png' : '/GAMES.png'} alt="Games" width={25} height={25} />
                </Link>
                
                <Link 
                    href="/settings"
                    className="bg-black/50 hover:bg-black/70 rounded-full w-15 h-15 flex items-center justify-center transition"
                    onClick={() => handleClick('/settings')}
                >
                    <Image src={selected === '/settings' ? '/SETTINGS2.png' : '/SETTINGS.png'} alt="Settings" width={25} height={25} />
                </Link>
            </nav> */}
            <nav
                className="
                    flex items-center justify-around w-full h-full
                    
                    // --- Large screen layout ---
                    lg:flex-col lg:justify-center lg:space-y-8
                "
            >
                {navLinks.map((link) => (
                    <Link 
                        key={link.href}
                        href={link.href}
                        className={`flex items-center justify-center w-15 h-15 rounded-full transition 
                            ${selected === link.href ? 'bg-black/70' : 'bg-black/50 hover:bg-black/70'}`}
                        onClick={() => handleClick(link.href)}
                    >
                        <Image 
                            src={selected === link.href ? link.activeIcon : link.icon} 
                            alt={link.label} 
                            width={25} 
                            height={25} 
                        />
                    </Link>
                ))}
            </nav>
        </aside>
    );
};
