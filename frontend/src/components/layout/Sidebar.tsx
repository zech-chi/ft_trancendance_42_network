'use client';

import Link from 'next/link';
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
        href: '/protected/chat',
        label: 'Chat',
        icon: '/CHAT.png',
        activeIcon: '/CHAT2.png'
    },
    { 
        href: '/protected/games',
        label: 'Games',
        icon: '/GAMES.png',
        activeIcon: '/GAMES2.png'
    },
    { 
        href: '/protected/settings',
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
                bg-black/40 backdrop-blur p-2.5 xl:p1.5
                w-full xl:w-[65px] 2xl:w-[80px]
                xl:rounded-full
                flex flex-col
                xl:left-2 xl:top-1/2 xl:-translate-y-1/2 xl:space-y-4
                bottom-0 left-1/2 -translate-x-1/2 xl:translate-x-0 xl:bottom-auto
                space-x-4 xl:space-x-0
                origin-bottom-left 2xl:origin-center
            `}
        >
            <nav
                className="
                    flex items-center justify-around w-full h-full
                    xl:flex-col 2xl:justify-center xl:space-y-8
                "
            >
                {navLinks.map((link) => (
                    <Link 
                        key={link.href}
                        href={link.href}
                        className={`flex items-center justify-center w-10 h-10 xl:w-13 xl:h-13 2xl:w-15 2xl:h-15 rounded-full transition 
                            ${selected === link.href  ? 'bg-black/50' : 'bg-black/30 hover:bg-black/70'}`}
                        onClick={() => handleClick(link.href)}
                    >
                        <img src={selected === link.href ? link.activeIcon : link.icon} alt={link.label} className='w-[15px] h-[15px] xl:w-[20px] xl:h-[20px] 2xl:w-[25px] 2xl:h-[25px] ' />
                    </Link>
                ))}
            </nav>
        </aside>
    );
};