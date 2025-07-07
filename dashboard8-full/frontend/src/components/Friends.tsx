'use client'

import next from "next";
import { JSX } from "react";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from "next/image";
import Cookies from "js-cookie";

export function SearchForm(): JSX.Element {
    return (
      <form className="max-w-xl mx-auto flex-1 mt-7">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full px-10 py-2 rounded-full text-[#B2B2B2] outline-none"
            style={{
              background:
                'linear-gradient(to right, rgba(47,25,37,0.7) 0%, rgba(72,28,43,0.7) 50%, rgba(100,33,52,0.7) 100%)',
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-[#B2B2B2]" />
        </div>
      </form>
    );
}

type FriendsChoice = 'friends' | 'friend request';

export default function Frineds(): JSX.Element {
    const [choice, setChoice] = useState<FriendsChoice>((Cookies.get('SelectedChoiceFriends') as FriendsChoice) || 'pong');

    function handleChangeChoice(newChoice: FriendsChoice) {
        setChoice(newChoice);
    }
  
    useEffect(() => {
        Cookies.set('SelectedChoiceFriends', choice, { expires: 365 });
    }, [choice]);

    return (
        <div className="h-full flex flex-col">
            {/* search */}
            <div className="shrink-0">
                <SearchForm />
            </div>


            {/* select choice from friends or friend request */}
            <div className="mt-5 flex justify-center">
                    <div className="inline-flex bg-white/5 gap-3 rounded-4xl">
                        {
                            (choice === 'friends') ? (
                                <div className="bg-[#612132]/80 rounded-full mx-2 my-1.5" onClick={() => handleChangeChoice('friends')}>
                                    <p className="py-2 px-10 cursor-pointer">friends</p>
                                </div>
                            ) : (
                                <div className="bg-black/50 rounded-full mx-2 my-1.5" onClick={() => handleChangeChoice('friends')}>
                                    <p className="py-2 px-10 cursor-pointer">friends</p>
                                </div>
                            )
                        }

                        {
                            (choice === 'friend request') ? (
                                <div className="bg-[#612132]/80 rounded-full mx-2 my-1.5" onClick={() => handleChangeChoice('friend request')}>
                                    <p className="py-2 px-4 cursor-pointer">friend request</p>
                                </div>
                            ) : (
                                <div className="bg-black/50 rounded-full mx-2 my-1.5" onClick={() => handleChangeChoice('friend request')}>
                                    <p className="py-2 px-4 cursor-pointer">friend request</p>
                                </div>
                            )
                        }
                    </div>
            </div>

        </div>
    )
}
