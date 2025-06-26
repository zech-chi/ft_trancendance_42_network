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
    imageUrl    :   "/gon.jpg",
    rank	    :   1337,
    level	    :   9,
    progress    :   0.75,
    online	    :   true
}

function DisplayUserData() : JSX.Element {
  return (
    <div className="w-full h-20 bg-black text-white">
      testing
    </div>
  );
}


export default function Rank(): JSX.Element {
    return (
        <div>
            <SearchForm />
            <div className="flex-1 overflow-y-auto flex flex-col gap-5">
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
    )
}
