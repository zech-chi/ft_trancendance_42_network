'use client'

import next from "next";
import { JSX } from "react";
import { useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

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

const userX = {
    fullName    :   "Gon Freecss",
    userName    :   "hunterGon",
    imageUrl    :   "/kilwa.png",
    rank	    :   1337,
    level	    :   9,
    progress    :   0.75,
    online	    :   true
}

function ProfileImage({ imageUrl }: { imageUrl: string }): JSX.Element {
  return (
    <div className="relative rounded-full w-[100px] h-[100px] overflow-hidden border-3 border-black m-3">
      <Image
        src={imageUrl}
        alt="Profile"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority
      />
    </div>
  );
}

function DisplayUserData() : JSX.Element {
  return (
    <div className="w-full flex flex-row items-center h-30 bg-black/50 text-white rounded-full">
       <ProfileImage imageUrl={userX.imageUrl} />
    </div>
  );
}

export default function Rank(): JSX.Element {
  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0">
        <SearchForm />
      </div>

      <div className="m-3 flex-1 overflow-y-auto px-4 py-2 space-y-4" >
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
        <DisplayUserData />
      </div>
    </div>
  );
}

