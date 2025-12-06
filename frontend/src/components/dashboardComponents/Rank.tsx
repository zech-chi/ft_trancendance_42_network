'use client';
import React, { use } from 'react';
import { JSX } from 'react';
import { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from "react";
import { fetchUser, fetchRankData } from '@/app/lib/apiDashboard';
import Cookies from 'js-cookie';
import {useLoggedUserName} from '@/context/LoggedUserNameContext';
import Image from "next/image";

interface User {
    id: number;
    fullName: string;
    userName: string;
    imageUrl: string;
    rank: number;
    level: number;
    progress: number;
    online: boolean;
  }

function DisplayData({user, rank} : {user: User, rank: number}): JSX.Element {
    if (!user) {
      return (
        <div className="w-full flex items-center justify-center  h-[70px] md:h=[90px]  xl:h-[100px]
        rounded-full bg-gray-800/100 backdrop-blur-md text-white border-[1px] border-white/8">
          <div className="flex justify-center items-center h-full">
            <div className="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 border-2 md:border-3 xl:border-4 border-[#1CBABA] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )
    }
  
    return (
      <div className="w-full flex items-center justify-between rounded-full
      bg-gray-800/100 backdrop-blur-md
       text-white border-[1px] border-white/8">
        
        <div className='flex'>
            <div className="relative 
            w-[60px] h-[60px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]
            ">
            <div className={`w-full h-full rounded-full border-[7px] xl:border-10
                border-[#1CBABA]/0
                border-l-transparent border-b-transparent 
                flex items-center justify-center overflow-hidden rotate-225`}>
                <Image
                  src={user.imageUrl}
                  alt={user.userName}
                  width={500}    // placeholder (overridden by w-full / h-full)
                  height={500}
                  className="w-full h-full object-cover rounded-full -rotate-225 
                            border-3 xl:border-4 2xl:border-5
                            border-black"
                />
            </div>
            {
                user.online && <div className="absolute 
                bottom-[14px] right-[8px] w-2 h-2 
                xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                bg-[#00FF04] rounded-full border-1 xl:border-2 border-black" />
            }
            {
                !user.online && <div className="absolute
                bottom-[14px] right-[8px] w-2 h-2
                xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                bg-[#FF0000] rounded-full border-1  xl:border-2 border-black" />
            }
            </div>
    
            {/* Center Score & Date */}
            <div className="flex flex-col justify-center">
            <div className="
            text-[10px] md:text-[12px] l:text-[14px] xl:text-[15px]
            font-bold">
                {user.fullName}
            </div>
            <div className="text-[#1CBABA]/70 
            text-[8px] md:text-[10px] l:text-[12px] xl:text-[13px]">
                {user.userName}
            </div>
            </div>
        </div>
  
        {/* Right Profile (Current User) */}
        <div className="relative 
        w-[60px] h-[60px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]  flex justify-center items-center
        text-[15px]  l:text-[20px] xl:text-[35px] text-white/70
        font-bold
        ">
        {rank === 1 && <img src="/rank1.png" alt='img rank1' className='w-auto h-10 lg:h-13'/>}
        {rank === 2 && <img src="/rank2.png" alt='img rank1' className='w-auto h-10 lg:h-13'/>}
        {rank === 3 && <img src="/rank3.png" alt='img rank1' className='w-auto h-10 lg:h-13'/>}
        {rank > 3 && rank}
        </div>
      </div>
    );
}



export function Rank(): JSX.Element {
    const [users, setUsers] = useState<any>([]);
    useEffect(() => {
      if (users.length === 0) {
        setTimeout(() => {
          fetchRankData()
            .then((data) => {
              setUsers(data);
              //console.log(users);
            })
            .catch((err) => //console.log('Error: ', err));
        }, 0);
      }
    });


    return (
      <div className="m-3 px-4 py-2 space-y-2 custom-scrollbar">
        {users.length > 0 ? (
          users.map((user: User, index: number) => (
            <DisplayData key={user.id} user={user} rank={index + 1} />
          ))
        ) : (
          <div className="text-center font-bold text-[#1CBABA]/50">
            No Users found
          </div>
        )}
      </div>

    );
}