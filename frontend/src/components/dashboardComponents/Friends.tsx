'use client';
import React, { use } from 'react';
import { JSX } from 'react';
import { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from "react";
import { fetchUser, fetchFriends, fetchUserById } from '@/app/lib/apiDashboard';
import Cookies from 'js-cookie';
import {useLoggedUserName} from '@/context/LoggedUserNameContext';
import { useLoggedUserId } from '@/context/UserIdContext';
import { send } from 'process';
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useRouter } from 'next/navigation';

type FriendsChoice = 'friends' | 'friend request' | 'sent request' | 'blocked';

interface User {
    fullName: string;
    userName: string;
    imageUrl: string;
    rank: number;
    level: number;
    progress: number;
    online: boolean;
  }

function DisplayData({userName} : {userName: string}): JSX.Element {
    const [userCur, setUserCur] = useState<any | null>(null);
  
    useEffect(() => {
      setTimeout(() => {
        const fetchData = async () => {
          const cur = await fetchUser(userName);
          setUserCur(cur);
        };
        fetchData();
      }, 1000);
    }, [userName]);
  
    if (!userCur) {
      return (
        <div className="w-full flex items-center justify-center  h-[70px] md:h=[90px]  xl:h-[100px]
        rounded-full bg-[#612132]/50 text-white border-[1px] border-white/8">
          <div className="flex justify-center items-center h-full">
            <div className="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 border-2 md:border-3 xl:border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )
    }
  
    return (
      <div className="w-full flex items-center justify-between rounded-full bg-[#612132]/55 text-white border-[1px] border-white/8">
        
        <div className='flex'>
            <div className="relative 
            w-[60px] h-[60px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]
            ">
            <div className={`w-full h-full rounded-full border-[7px] xl:border-10
                border-[#FEDF7F]/0
                border-l-transparent border-b-transparent 
                flex items-center justify-center overflow-hidden rotate-225`}>
                <img
                src={userCur.imageUrl}
                alt={userCur.userName}
                className="w-full h-full object-cover rounded-full -rotate-225 
                border-3 xl:border-4 2xl:border-5
                border-black/50"
                />
            </div>
            {/* {
                userCur.online && <div className="absolute 
                bottom-[14px] right-[8px] w-2 h-2 
                xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                bg-[#00FF04] rounded-full border-1 xl:border-2 border-black" />
            }
            {
                !userCur.online && <div className="absolute
                bottom-[14px] right-[8px] w-2 h-2
                xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                bg-[#FF0000] rounded-full border-1  xl:border-2 border-black" />
            } */}
               <div
            className={`
              absolute bottom-[14px] right-[8px]
              xl:bottom-[20px] xl:right-[10px]
              w-2 h-2 xl:w-3 xl:h-3
              rounded-full border-[1px] xl:border-[2px] border-black
              ${userCur.online ? 'bg-[#00FF04]' : 'bg-[#FF0000]'}
            `}
          />
            </div>
    
            {/* Center Score & Date */}
            <div className="flex flex-col justify-center">
            <div className="
            text-[10px] md:text-[12px] l:text-[14px] xl:text-[15px]
            font-bold">
                {userCur.fullName}
            </div>
            <div className="text-[#FEDF7F]/70 
            text-[8px] md:text-[10px] l:text-[12px] xl:text-[13px]">
                {userCur.userName}
            </div>
            </div>
        </div>
  
        {/* Right Profile (Current User) */}
        <div className="relative 
        w-[60px] h-[60px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]  flex justify-center items-center
        text-[15px]  l:text-[20px] xl:text-[35px] text-white/70
        font-bold
        ">
        {userCur.rank === 1 && <img src="/rank1.png" alt='img rank1' className='w-auto h-10 lg:h-13'/>}
        {userCur.rank === 2 && <img src="/rank2.png" alt='img rank1' className='w-auto h-10 lg:h-13'/>}
        {userCur.rank === 3 && <img src="/rank3.png" alt='img rank1' className='w-auto h-10 lg:h-13'/>}
        {userCur.rank > 3 && userCur.rank}
        </div>
      </div>
    );
}

const tabs = [
    { id: 'friends', label: 'friends' },
    { id: 'friend request', label: 'friend request' },
    { id: 'sent request', label: 'sent request' },
    { id: 'blocked', label: 'blocked' }
];

export function SelectedChoiceFriends({ choice, setChoice }: { choice: FriendsChoice; setChoice: Dispatch<SetStateAction<FriendsChoice>> }): JSX.Element {
    return (
        <div className="lg:mt-1 xl:mt-2.5 flex justify-center text-white">
            <div className="flex rounded-[25px] justify-between">
                    {tabs.map((tab) => (
                        <div 
                            key={tab.id}
                            className="flex justify-center
                            text-[8px] w-[75px] mx-0.5 
                            md:text-[12px] md:w-[100px] md:mx-2
                            lg:text-[14px] 2xl:w-[105px]
                            bg-black/30 rounded-full "
                            onClick={() => setChoice(tab.id as FriendsChoice)}
                        >
                            <p className={`py-2 cursor-pointer ${choice === tab.id ? 'text-[#F9545B]' : ''}`}>
                            {tab.label}
                            </p>
                        </div>
                    ))}
                    </div>
            </div>
    );
}

type ProfileInfoProps = {
    fullName: string;
    userName: string;
    bio?: string;
};


type Friends = {
    id: number;
    sender_id: number;
    receiver_id: number;
    status: string;
    blocked_by: number | null;
}


function DisplayFriends({friends} : {friends: Friends}) : JSX.Element {
    const { loggedUserName } = useLoggedUserName();
    const { loggedUserId } = useLoggedUserId();
    const { selectedUserName, setSelectedUserName } = useSelectedUserName();
    const [friend, setFriend] = useState<any | null>(null);
    const [hoveredChat, setHoveredChat] = useState(false);
    const [hoveredGames, setHoveredGames] = useState(false);
    const router = useRouter();
    

    useEffect(() => {
        setFriend(null);
        setTimeout(() => {
            setFriend(null);
            const fetchData = async () => {
            const user1 = await fetchUserById(friends.sender_id);
            const user2 = await fetchUserById(friends.receiver_id);
            if (user1.id === loggedUserId) {
                setFriend(user2);
            } else {
                setFriend(user1);
            }
          };
          fetchData();
        }, 500);
    }, [friends, loggedUserId]);

    if (!friend) {
        return (
            <div className="w-full flex items-center justify-center  h-[60px] md:h=[90px]  xl:h-[100px]
            rounded-full bg-[#612132]/50 text-white border-[1px] border-white/8">
              <div className="flex justify-center items-center h-full">
                <div className="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 border-2 md:border-3 xl:border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
        )
    }

    return (
        <div className="w-full flex items-center justify-between rounded-full bg-[#612132]/55 text-white border-[1px] border-white/8">
            <div className='flex'>
                <div className="relative 
                w-[60px] h-[60px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]
                ">
                <div className={`w-full h-full rounded-full border-[7px] xl:border-10
                    border-[#FEDF7F]/0
                    border-l-transparent border-b-transparent 
                    flex items-center justify-center overflow-hidden rotate-225`}>
                    <img
                    src={friend.imageUrl}
                    alt={friend.userName}
                    className="w-full h-full object-cover rounded-full -rotate-225 
                    border-3 xl:border-4 2xl:border-5
                    border-black/50"
                    />
                </div>
                {/* {
                    friend.online && <div className="absolute 
                    bottom-[14px] right-[8px] w-2 h-2 
                    xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                    bg-[#00FF04] rounded-full border-1 xl:border-2 border-black" />
                }
                {
                    !friend.online && <div className="absolute
                    bottom-[14px] right-[8px] w-2 h-2
                    xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                    bg-[#FF0000] rounded-full border-1  xl:border-2 border-black" />
                } */}
                  <div
                    className={`
                    absolute bottom-[14px] right-[8px]
                    xl:bottom-[20px] xl:right-[10px]
                    w-2 h-2 xl:w-3 xl:h-3
                    rounded-full border-[1px] xl:border-[2px] border-black
                    ${friend.online ? 'bg-[#00FF04]' : 'bg-[#FF0000]'}
                    `}
                />
                </div>
        
                {/* Center Score & Date */}
                <div className="flex flex-col justify-center">
                <div className="
                text-[10px] md:text-[12px] l:text-[14px] xl:text-[15px]
                font-bold">
                    {friend.fullName}
                </div>
                <div className="text-[#FEDF7F]/70 
                text-[8px] md:text-[10px] l:text-[12px] xl:text-[13px]">
                    {friend.userName}
                </div>
                </div>
            </div>
            <div className="flex gap-2  mx-5 lg:mx-7 lg:gap-3">
                <img
                    src={hoveredChat ? '/CHAT2.png' : '/CHAT.png'}
                    alt="chat"
                    className="w-auto h-[10px] md:h-[12px] xl:h-[17px] transition-transform duration-500"
                    onMouseEnter={
                        () => {
                            setHoveredChat(true);
                            console.log('Hovered Chat');
                        }
                    }
                    onMouseLeave={() => setHoveredChat(false)}
                    onClick={() => {
                        console.log('Clicked Chat with ', friend.userName);
                        setSelectedUserName(friend.userName);
                        router.push('/protected/chat');
                    }}
                />
                <img
                    src={hoveredGames ? '/GAMES2.png' : '/GAMES.png'}
                    alt="games"
                    className="w-auto h-[12px] md:h-[14px] xl:h-[19px] transition-transform duration-500"
                    onMouseEnter={() => setHoveredGames(true)}
                    onMouseLeave={() => setHoveredGames(false)}
                />
            </div>
        </div>
    );
}

function DisplayFriendsRequest({friends, changeComponent, setChangeComponent} : {friends: Friends, changeComponent:boolean, setChangeComponent: React.Dispatch<React.SetStateAction<boolean>>}) : JSX.Element {
    const { loggedUserName } = useLoggedUserName();
    const { loggedUserId } = useLoggedUserId();
    const [friend, setFriend] = useState<any | null>(null);


    useEffect(() => {
        setFriend(null);
        setTimeout(() => {
          const fetchData = async () => {
            setFriend(null);
            const user1 = await fetchUserById(friends.sender_id);
            const user2 = await fetchUserById(friends.receiver_id);
            if (user1.id === loggedUserId) {
                setFriend(user2);
            } else {
                setFriend(user1);
            }
          };
          fetchData();
        }, 500);
    }, [friends, loggedUserId]);

    if (!friend) {
        return (
            <div className="w-full flex items-center justify-center  h-[60px] md:h=[90px]  xl:h-[100px]
            rounded-full bg-[#612132]/50 text-white border-[1px] border-white/8">
              <div className="flex justify-center items-center h-full">
                <div className="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 border-2 md:border-3 xl:border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
        )
    }

    return (
        <div className="w-full flex items-center justify-between rounded-full bg-[#612132]/55 text-white border-[1px] border-white/8">
            <div className='flex'>
                <div className="relative 
                w-[60px] h-[60px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]
                ">
                <div className={`w-full h-full rounded-full border-[7px] xl:border-10
                    border-[#FEDF7F]/0
                    border-l-transparent border-b-transparent 
                    flex items-center justify-center overflow-hidden rotate-225`}>
                    <img
                    src={friend.imageUrl}
                    alt={friend.userName}
                    className="w-full h-full object-cover rounded-full -rotate-225 
                    border-3 xl:border-4 2xl:border-5
                    border-black/50"
                    />
                </div>
                {/* {
                    friend.online && <div className="absolute 
                    bottom-[14px] right-[8px] w-2 h-2 
                    xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                    bg-[#00FF04] rounded-full border-1 xl:border-2 border-black" />
                }
                {
                    !friend.online && <div className="absolute
                    bottom-[14px] right-[8px] w-2 h-2
                    xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                    bg-[#FF0000] rounded-full border-1  xl:border-2 border-black" />
                } */}
                  <div
            className={`
              absolute bottom-[14px] right-[8px]
              xl:bottom-[20px] xl:right-[10px]
              w-2 h-2 xl:w-3 xl:h-3
              rounded-full border-[1px] xl:border-[2px] border-black
              ${friend.online ? 'bg-[#00FF04]' : 'bg-[#FF0000]'}
            `}
          />
                </div>
        
                {/* Center Score & Date */}
                <div className="flex flex-col justify-center">
                <div className="
                text-[10px] md:text-[12px] l:text-[14px] xl:text-[15px]
                font-bold">
                    {friend.fullName}
                </div>
                <div className="text-[#FEDF7F]/70 
                text-[8px] md:text-[10px] l:text-[12px] xl:text-[13px]">
                    {friend.userName}
                </div>
                </div>
            </div>
            <div className="flex gap-2  mx-5 lg:mx-7 lg:gap-3">
                <button className="bg-[#F63737] rounded-full hover:border-white/50 hover:border-[1px] transition-all duration-100 ease-in-out cursor-pointer"
                    onClick = {
                    async () => {
                        try {
                            const response = await fetch(`http://localhost:5002/api/dashboard/friends/reject`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    sender_id: friends.sender_id,
                                    receiver_id: friends.receiver_id,
                                }),
                            });
                            const data = await response.json();
                            console.log('Response data:', data);
                            if (!response.ok) {
                                console.error('❌Error refusing friend request:', data);
                                // alert('❌ Error refusing friend request');
                                return;
                            } else {
                                console.log('✅ Friend request refused:', data);
                                // alert('✅ Friend request refused');
                            }
                            setChangeComponent(!changeComponent);

                        } catch (error) {
                            console.error('❌ Network error:', error);
                            // alert('❌ Network error');
                        }

                    }}
                >
                    <p className="font-bold 
                    text-[8px] px-2.5 py-[4px]
                    lg:text-[10px] lg:px-3 lg:py-2
                    xl:text-[12px] xl:px-4 xl:py-2.5
                    ">Refuse</p>
                </button>
                <button className="bg-[#56BA1C] rounded-full hover:border-white/50 hover:border-[1px] transition-all duration-100 ease-in-out cursor-pointer"
                    onClick = {
                    async () => {
                        try {
                            const response = await fetch(`http://localhost:5002/api/dashboard/friends/accept`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    sender_id: friends.sender_id,
                                    receiver_id: friends.receiver_id,
                                }),
                            });
                            const data = await response.json();
                            console.log('Response data:', data);
                            if (!response.ok) {
                                console.error('❌Error accepting friend request:', data);
                                // alert('❌ Error accepting friend request');
                                return;
                            } else {
                                console.log('✅ Friend request accepted:', data);
                                // alert('✅ Friend request accepted');
                            }
                            setChangeComponent(!changeComponent);
                        } catch (error) {
                            console.error('❌ Network error:', error);
                            // alert('❌ Network error');
                        }

                    }}>
                    <p className="font-bold
                    text-[8px] px-2.5 py-[4px]
                    lg:text-[10px] lg:px-3 lg:py-2
                    xl:text-[12px] xl:px-4 xl:py-2.5
                    ">Accept</p>
                </button>
            </div>
        </div>
    );
}

function DisplaySentFriendsRequest({friends, changeComponent, setChangeComponent} : {friends: Friends, changeComponent:boolean, setChangeComponent: React.Dispatch<React.SetStateAction<boolean>>}) : JSX.Element {
    const { loggedUserName } = useLoggedUserName();
    const { loggedUserId } = useLoggedUserId();
    const [friend, setFriend] = useState<any | null>(null);


    useEffect(() => {
        setFriend(null);
        setTimeout(() => {
          const fetchData = async () => {
            setFriend(null);
            const user1 = await fetchUserById(friends.sender_id);
            const user2 = await fetchUserById(friends.receiver_id);
            if (user1.id === loggedUserId) {
                setFriend(user2);
            } else {
                setFriend(user1);
            }
          };
          fetchData();
        }, 400);
    }, [friends, loggedUserId]);

    if (!friend) {
        return (
            <div className="w-full flex items-center justify-center  h-[60px] md:h=[90px]  xl:h-[100px]
            rounded-full bg-[#612132]/50 text-white border-[1px] border-white/8">
              <div className="flex justify-center items-center h-full">
                <div className="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 border-2 md:border-3 xl:border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
        )
    }

    return (
        <div className="w-full flex items-center justify-between rounded-full bg-[#612132]/55 text-white border-[1px] border-white/8">
            <div className='flex'>
                <div className="relative 
                w-[60px] h-[60px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]
                ">
                <div className={`w-full h-full rounded-full border-[7px] xl:border-10
                    border-[#FEDF7F]/0
                    border-l-transparent border-b-transparent 
                    flex items-center justify-center overflow-hidden rotate-225`}>
                    <img
                    src={friend.imageUrl}
                    alt={friend.userName}
                    className="w-full h-full object-cover rounded-full -rotate-225 
                    border-3 xl:border-4 2xl:border-5
                    border-black/50"
                    />
                </div>
                {/* {
                    friend.online && <div className="absolute 
                    bottom-[14px] right-[8px] w-2 h-2 
                    xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                    bg-[#00FF04] rounded-full border-1 xl:border-2 border-black" />
                }
                {
                    !friend.online && <div className="absolute
                    bottom-[14px] right-[8px] w-2 h-2
                    xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                    bg-[#FF0000] rounded-full border-1  xl:border-2 border-black" />
                } */}
                  <div
            className={`
              absolute bottom-[14px] right-[8px]
              xl:bottom-[20px] xl:right-[10px]
              w-2 h-2 xl:w-3 xl:h-3
              rounded-full border-[1px] xl:border-[2px] border-black
              ${friend.online ? 'bg-[#00FF04]' : 'bg-[#FF0000]'}
            `}
          />
                </div>
        
                {/* Center Score & Date */}
                <div className="flex flex-col justify-center">
                <div className="
                text-[10px] md:text-[12px] l:text-[14px] xl:text-[15px]
                font-bold">
                    {friend.fullName}
                </div>
                <div className="text-[#FEDF7F]/70 
                text-[8px] md:text-[10px] l:text-[12px] xl:text-[13px]">
                    {friend.userName}
                </div>
                </div>
            </div>
            <div className="flex gap-2  mx-5 lg:mx-7 lg:gap-3">
                <button className="bg-[#F63737] rounded-full hover:border-white/50 hover:border-[1px] transition-all duration-100 ease-in-out cursor-pointer"
                    onClick = {
                        async () => {
                            try {
                                const response = await fetch(`http://localhost:5002/api/dashboard/friends/reject`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        sender_id: friends.sender_id,
                                        receiver_id: friends.receiver_id,
                                    }),
                                });
                                const data = await response.json();
                                console.log('Response data:', data);
                                if (!response.ok) {
                                    console.error('❌Error accepting friend request:', data);
                                    // alert('❌ Error accepting friend request');
                                    return;
                                } else {
                                    console.log('✅ Friend request accepted:', data);
                                    // alert('✅ Friend request accepted');
                                }
                                setChangeComponent(!changeComponent);
                            } catch (error) {
                                console.error('❌ Network error:', error);
                                // alert('❌ Network error');
                            }
    
                        }}
                    >
                    <p className="font-bold 
                    text-[8px] px-2.5 py-[4px]
                    lg:text-[10px] lg:px-5 lg:py-2
                    xl:text-[12px] xl:px-4 xl:py-2.5
                    ">Cancel</p>
                </button>
            </div>
        </div>
    );
}


function DisplayBlocked({friends, changeComponent, setChangeComponent} : {friends: Friends, changeComponent:boolean, setChangeComponent: React.Dispatch<React.SetStateAction<boolean>>}) : JSX.Element {
    const { loggedUserName } = useLoggedUserName();
    const { loggedUserId } = useLoggedUserId();
    const [friend, setFriend] = useState<any | null>(null);


    useEffect(() => {
        setFriend(null);
        setTimeout(() => {
          const fetchData = async () => {
            setFriend(null);
            const user1 = await fetchUserById(friends.sender_id);
            const user2 = await fetchUserById(friends.receiver_id);
            if (user1.id === loggedUserId) {
                setFriend(user2);
            } else {
                setFriend(user1);
            }
          };
          fetchData();
        }, 100);
    }, [friends, loggedUserId]);

    if (!friend) {
        return (
            <div className="w-full flex items-center justify-center  h-[60px] md:h=[90px]  xl:h-[100px]
            rounded-full bg-[#612132]/50 text-white border-[1px] border-white/8">
              <div className="flex justify-center items-center h-full">
                <div className="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 border-2 md:border-3 xl:border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
        )
    }

    return (
        <div className="w-full flex items-center justify-between rounded-full bg-[#612132]/55 text-white border-[1px] border-white/8">
            <div className='flex'>
                <div className="relative 
                w-[60px] h-[60px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]
                ">
                <div className={`w-full h-full rounded-full border-[7px] xl:border-10
                    border-[#FEDF7F]/0
                    border-l-transparent border-b-transparent 
                    flex items-center justify-center overflow-hidden rotate-225`}>
                    <img
                    src={friend.imageUrl}
                    alt={friend.userName}
                    className="w-full h-full object-cover rounded-full -rotate-225 
                    border-3 xl:border-4 2xl:border-5
                    border-black/50"
                    />
                </div>
                {/* {
                    friend.online && <div className="absolute 
                    bottom-[14px] right-[8px] w-2 h-2 
                    xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                    bg-[#00FF04] rounded-full border-1 xl:border-2 border-black" />
                }
                {
                    !friend.online && <div className="absolute
                    bottom-[14px] right-[8px] w-2 h-2
                    xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                    bg-[#FF0000] rounded-full border-1  xl:border-2 border-black" />
                } */}
                  <div
            className={`
              absolute bottom-[14px] right-[8px]
              xl:bottom-[20px] xl:right-[10px]
              w-2 h-2 xl:w-3 xl:h-3
              rounded-full border-[1px] xl:border-[2px] border-black
              ${friend.online ? 'bg-[#00FF04]' : 'bg-[#FF0000]'}
            `}
          />
                </div>
        
                {/* Center Score & Date */}
                <div className="flex flex-col justify-center">
                <div className="
                text-[10px] md:text-[12px] l:text-[14px] xl:text-[15px]
                font-bold">
                    {friend.fullName}
                </div>
                <div className="text-[#FEDF7F]/70 
                text-[8px] md:text-[10px] l:text-[12px] xl:text-[13px]">
                    {friend.userName}
                </div>
                </div>
            </div>
            <div className="flex gap-2  mx-5 lg:mx-7 lg:gap-3">
                <button className="bg-[#56BA1C] rounded-full hover:border-white/50 hover:border-[1px] transition-all duration-100 ease-in-out cursor-pointer"
                    onClick = {
                        async () => {
                            try {
                                const response = await fetch(`http://localhost:5002/api/dashboard/friends/unblock`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        sender_id: loggedUserId,
                                        receiver_id: friends.sender_id === loggedUserId ? friends.receiver_id : friends.sender_id,
                                    }),
                                });
                                const data = await response.json();
                                console.log('Response data:', data);
                                if (!response.ok) {
                                    console.error('❌Error accepting friend request:', data);
                                    // alert('❌ Error accepting friend request');
                                    return;
                                } else {
                                    console.log('✅ Friend request accepted:', data);
                                    // alert('✅ Friend request accepted');
                                }
                                setChangeComponent(!changeComponent);
                            } catch (error) {
                                console.error('❌ Network error:', error);
                                // alert('❌ Network error');
                            }
    
                        }}>
                    <p className="font-bold
                    text-[8px] px-2.5 py-[4px]
                    lg:text-[10px] lg:px-3 lg:py-2
                    xl:text-[12px] xl:px-4 xl:py-2.5
                    ">Unblock</p>
                </button>
            </div>
        </div>
    );
}

export function Friends({ choice }: { choice: FriendsChoice }): JSX.Element {
    const { loggedUserName } = useLoggedUserName();
    const { loggedUserId } = useLoggedUserId();
    const [friends, setFriends] = useState<any[]>([]);
    const [changeComponent, setChangeComponent] = useState(false);

    useEffect(() => {
        setFriends([]);
        Cookies.set('SelectedChoiceFriends', choice, { expires: 365 });
        if (loggedUserName) {
            fetchFriends(loggedUserId, choice)
                .then((data) => {
                    setFriends(data.friends);
                    console.log("Friends data: ", data);
                }
            )
            .catch((err) => console.error("Error: ", err));

        }
    }, [choice, loggedUserName, changeComponent]);


    return (
          <div className="m-3 px-4 py-2 space-y-2 custom-scrollbar
          ">
                {friends && friends.length > 0 ? (
                    friends.map((friend, index) =>
                    choice === 'friend request' ? (
                        <DisplayFriendsRequest friends={friend} changeComponent={changeComponent} setChangeComponent={setChangeComponent}  key={index} />
                    ) : choice === 'friends' ? (
                        <DisplayFriends friends={friend} key={index} />
                    ) : choice === 'blocked' ? (
                        <DisplayBlocked friends={friend} changeComponent={changeComponent} setChangeComponent={setChangeComponent} key={index} />
                    ) : (
                        <DisplaySentFriendsRequest friends={friend} changeComponent={changeComponent} setChangeComponent={setChangeComponent} key={index} />
                    )
                    )
                ) : (
                    <div className="text-center font-bold text-[#FEDF7F]/50">No {choice} found</div>
                )}
          </div>
    );
}

{/* <div className="m-3 px-4 py-2 space-y-2 custom-scrollbar
">
  { users.length > 0 ? (
    users.map((user: User) => (
      <DisplayData userName={user.userName} />
    ))
  ) : (
    <div className="text-center font-bold text-[#FEDF7F]/50">No Users found</div>
  )}
</div> */}