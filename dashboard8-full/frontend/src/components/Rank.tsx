'use client'

import next from "next";
import { JSX } from "react";
import {useEffect, useState} from 'react';
import Image from "next/image";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

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

type ProfileInfoProps = {
  fullName: string;
  userName: string;
  bio?: string;
};

type RankInfoProps = {
  level: number;
  progress: number;
  rank: number;
};

interface User {
  fullName: string;
  userName: string;
  imageUrl: string;
  rank: number;
  level: number;
  progress: number;
  online: boolean;
}


function ProfileImage({ imageUrl }: { imageUrl: string }): JSX.Element {
  return (
    <div className="relative rounded-full w-[100px] h-[100px] overflow-hidden border-2 border-[#FEDF7F] m-3">
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

function ProfileInfo({ fullName, userName }: ProfileInfoProps): JSX.Element {
  return (
    <div className="flex flex-col justify-center h-full gap-2 mt-4">
      <h2 className="text-l font-bold text-white">{fullName}</h2>
      <h3 className="text-s text-white">@{userName}</h3>
    </div>
  );
}

function DisplayRank({ level, progress, rank}: RankInfoProps): JSX.Element {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-2 mt-2 mr-10">
      <h2
        className="text-xl font-bold bg-clip-text text-transparent "
        style={{
          backgroundImage: "linear-gradient(to right, #FE9634 0%, #FC709B 40%, #FC709B 100%)",
        }}
      >
      {rank}
      </h2>
      <h2 className="text-l font-bold text-[#FEDF7F]">Level {level} - {progress * 100} %</h2>
    </div>
  );
}

type LevelInfoProps = {
  progress: number;
};

function DisplayLevel({ progress }: LevelInfoProps): JSX.Element {
  return (
    <div className="relative bg-white/10 w-full h-4 mr-10 rounded-4xl border-2  border-[#F9545B]/30">
      <motion.div
        className="absolute top-0 left-0 h-full rounded-4xl bg-[#FEDF7F] border-1  border-white/40" 
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function DisplayUserData({ user }: { user: User }): JSX.Element {
  return (
    <div
      className={`w-full flex flex-row items-center h-30 border-[1px] border-white/30 text-white rounded-full ${
        user.rank === 1
          ? 'bg-[#FFD700]/30' // Gold
          : user.rank === 2
          ? 'bg-[#C0C0C0]/30' // Silver
          : user.rank === 3
          ? 'bg-[#CD7F32]/30' // Bronze
          : 'bg-white/5'
      }`}
    >
    {/* <div className="w-full flex flex-row items-center h-30 bg-black/20 border-[1px] border-white/30 text-white rounded-full"> */}
       <ProfileImage imageUrl={user.imageUrl} />
       <div className="flex flex-col h-full gap-4 flex-1">
        <div className="flex justify-between ml-2">
          <ProfileInfo fullName={user.fullName} userName={user.userName}/>
          <DisplayRank
              level={user.level}
              progress={user.progress}
              rank={user.rank}
            />
        </div>
        <div className="flex-1 flex ml-2">
            <DisplayLevel progress={user.progress} />
        </div>
       </div>
    </div>
  );
}


const fetchRankData = async () => {
  const response = await fetch(`http://localhost:5000/rank/`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}


export default function Rank(): JSX.Element {
  const [users, setUsers] = useState<any | null>(null);
  useEffect(() => {
    if (users === null) {
      setTimeout(() => {
        fetchRankData()
          .then((data) => {
            setUsers(data);
            console.log(users);
          })
          .catch((err) => console.log('Error: ', err));
      }, 800);
    }
  }, [users]);

  return (
    <div className="h-full flex flex-col">
      {users ? (
        <>
          <div className="shrink-0">
            <SearchForm />
          </div>

          <div className="m-3 flex-1 overflow-y-auto px-4 py-2 space-y-2" >
            {
              users.map((user: User) => (
                <DisplayUserData user={user} />
              ))
            }
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <div className="w-10 h-10 border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
}

