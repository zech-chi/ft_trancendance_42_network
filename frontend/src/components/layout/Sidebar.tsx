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
                bg-black/30 backdrop-blur p-2.5 md:p1.5
                w-full md:w-[65px] lg:w-[80px]
                md:rounded-full
                flex flex-col
                md:left-2 md:top-1/2 md:-translate-y-1/2 md:space-y-4
                bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto
                space-x-4 md:space-x-0
                origin-bottom-left lg:origin-center
            `}
        >
            <nav
                className="
                    flex items-center justify-around w-full h-full
                    md:flex-col lg:justify-center md:space-y-8
                "
            >
                {navLinks.map((link) => (
                    <Link 
                        key={link.href}
                        href={link.href}
                        className={`flex items-center justify-center w-10 h-10 md:w-13 md:h-13 lg:w-15 lg:h-15 rounded-full transition 
                            ${selected === link.href ? 'bg-black/50' : 'bg-black/30 hover:bg-black/70'}`}
                        onClick={() => handleClick(link.href)}
                    >
                        <img src={selected === link.href ? link.activeIcon : link.icon} alt={link.label} className='w-[15px] h-[15px] md:w-[20px] md:h-[20px] lg:w-[25px] lg:h-[25px] ' />
                    </Link>
                ))}
            </nav>
        </aside>
    );
};
