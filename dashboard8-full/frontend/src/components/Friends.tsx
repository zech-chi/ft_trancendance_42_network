'use client'

import next from "next";
import { JSX, use } from "react";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from "next/image";
import { useUserName } from "@/context/UserNameContext";
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

const fetchFriends = async (userName: string, choice: string) => {
    let status: string;
    if (choice === 'friends') {
        status = 'accepted';
    } else if (choice === 'friend request') {
        status = 'pending';
    }
    const response = await fetch(`http://localhost:5000/Friends/${userName}?status=${status}`);
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }
    const data = await response.json();
    return data;
}

type Friends = {
    sender_userName: string;
    receiver_userName: string;
    status: string;
}

const fetchUser = async (userName: string) => {
    const response = await fetch(`http://localhost:5000/users/${userName}`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

type ProfileInfoProps = {
    fullName: string;
    userName: string;
    bio?: string;
  };

function ProfileInfo({ fullName, userName }: ProfileInfoProps): JSX.Element {
    const { setUserName } = useUserName();
    const handleClick = () => {
      setUserName(userName);
      console.log("User set to: ", userName);
    }
  
    return (
      <div className="flex flex-col justify-center h-full gap-1.5 mb-1">
        <h2 className="text-s font-bold text-white">{fullName}</h2>
        <h3 className="text-s text-white cursor-pointer hover:underline hover:text-[#FEDF7F]/50 transition-all duration-300 ease-in-out"
            onClick={handleClick}
        >@{userName}</h3>
      </div>
    );
  }

function DisplayFriendsRequest({friends, changeComponent, setChangeComponent} : {friends: Friends, changeComponent:boolean, setChangeComponent: React.Dispatch<React.SetStateAction<boolean>>}) : JSX.Element {
    const [friend, setFriend] = useState<any | null>(null);
    const { username } = useUserName();
    

    useEffect(() => {
        setFriend(null);
        setTimeout(() => {
          const fetchData = async () => {
            setFriend(null);
            const user1 = await fetchUser(friends.sender_userName);
            const user2 = await fetchUser(friends.receiver_userName);
            if (user1.userName === username) {
                setFriend(user2);
            } else {
                setFriend(user1);
            }
          };
          fetchData();
        }, 100);
    }, [friends, username]);

    if (!friend) {
        return (
          <div className="w-full flex items-center justify-center h-25 rounded-full bg-[#612132]/30 text-white border-[1px] border-white/8">
            <div className="flex justify-center items-center h-full">
              <div className="w-5 h-5 border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )
    }

    return (
        <div className="w-full flex items-center h-25 justify-between rounded-full bg-[#612132]/30 text-white border-[1px] border-white/8">
            <div className="flex items-center">
                <div className="relative px-2.5">
                    <img
                        src={friend.imageUrl}
                        alt={friend.userName}
                        className="w-20 h-20 object-cover rounded-full border-5 border-black"
                    />
                    { friend.online ? (
                        <div className="absolute bottom-[10px] right-[14px] w-3 h-3 bg-[#56BA1C] rounded-full border-2 border-black" />
                    ) : (
                        <div className="absolute bottom-[10px] right-[14px] w-3 h-3 bg-[#F63737] rounded-full border-2 border-black" />
                    )}
                </div>
                <ProfileInfo fullName={friend.fullName} userName={friend.userName}/>

            </div>
            <div className="flex gap-3 mx-6">
                <button className="bg-[#F63737] rounded-full hover:border-white/80 hover:border-2 transition-all duration-100 ease-in-out cursor-pointer"
                    onClick = {
                    async () => {
                        try {
                            const response = await fetch(`http://localhost:5000/Friends/Reject/`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    user1: friends.sender_userName,
                                    user2: friends.receiver_userName,
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
                    <p className="px-5 py-2 font-bold">Refuse</p>
                </button>
                <button className="bg-[#56BA1C] rounded-full hover:border-white/80 hover:border-2 transition-all duration-100 ease-in-out cursor-pointer"
                    onClick = {
                    async () => {
                        try {
                            const response = await fetch(`http://localhost:5000/Friends/Accept/`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    user1: friends.sender_userName,
                                    user2: friends.receiver_userName,
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
                    <p className="px-5 py-2 font-bold">Accept</p>
                </button>
            </div>
        </div>
    );
}


function DisplayFriends({friends} : {friends: Friends}) : JSX.Element {
    const [friend, setFriend] = useState<any | null>(null);
    const { username } = useUserName();
    const [hoveredChat, setHoveredChat] = useState(false);
    const [hoveredGames, setHoveredGames] = useState(false);
    

    useEffect(() => {
        setFriend(null);
        setTimeout(() => {
            setFriend(null);
            const fetchData = async () => {
            const user1 = await fetchUser(friends.sender_userName);
            const user2 = await fetchUser(friends.receiver_userName);
            if (user1.userName === username) {
                setFriend(user2);
            } else {
                setFriend(user1);
            }
          };
          fetchData();
        }, 100);
    }, [friends, username]);

    if (!friend) {
        return (
          <div className="w-full flex items-center justify-center h-25 rounded-full bg-[#612132]/30 text-white border-[1px] border-white/8">
            <div className="flex justify-center items-center h-full">
              <div className="w-5 h-5 border-4 border-[#FEDF7F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )
    }

    return (
        <div className="w-full flex items-center h-25 justify-between rounded-full bg-[#612132]/30 text-white border-[1px] border-white/8">
            <div className="flex items-center">
                <div className="relative px-2.5">
                    <img
                        src={friend.imageUrl}
                        alt={friend.userName}
                        className="w-20 h-20 object-cover rounded-full border-5 border-black"
                    />
                    { friend.online ? (
                        <div className="absolute bottom-[10px] right-[14px] w-3 h-3 bg-[#56BA1C] rounded-full border-2 border-black" />
                    ) : (
                        <div className="absolute bottom-[10px] right-[14px] w-3 h-3 bg-[#F63737] rounded-full border-2 border-black" />
                    )}
                </div>
                <ProfileInfo fullName={friend.fullName} userName={friend.userName}/>

            </div>
            <div className="flex gap-5 mx-10">
                <img
                    src={hoveredChat ? '/CHAT2.png' : '/CHAT.png'}
                    alt="chat"
                    className="w-5 h-5 transition-transform duration-500"
                    onMouseEnter={() => setHoveredChat(true)}
                    onMouseLeave={() => setHoveredChat(false)}
                />
                <img
                    src={hoveredGames ? '/GAMES2.png' : '/GAMES.png'}
                    alt="games"
                    className="w-6 h-6 transition-transform duration-500"
                    onMouseEnter={() => setHoveredGames(true)}
                    onMouseLeave={() => setHoveredGames(false)}
                />
            </div>
        </div>
    );
}

export default function Frineds(): JSX.Element {
    const [choice, setChoice] = useState<FriendsChoice>((Cookies.get('SelectedChoiceFriends') as FriendsChoice) || 'pong');
    const { username } = useUserName();
    const [friends, setFriends] = useState<any[]>([]);
    const [changeComponent, setChangeComponent] = useState(false);

    function handleChangeChoice(newChoice: FriendsChoice) {
        setChoice(newChoice);
    }
  
    useEffect(() => {
        setFriends([]);
        Cookies.set('SelectedChoiceFriends', choice, { expires: 365 });
        if (username) {
            fetchFriends(username, choice)
                .then((data) => {
                    setFriends(data);
                    console.log("Friends data: ", data);
                }
            )
            .catch((err) => console.error("Error: ", err));

        }
    }, [choice, username, changeComponent]);

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
                                <div className="bg-black/50 rounded-full mx-2 my-1.5" onClick={() => handleChangeChoice('friends')}>
                                    <p className="py-2 px-10 cursor-pointer text-[#F9545B]">friends</p>
                                </div>
                            ) : (
                                <div className="bg-black/50 rounded-full mx-2 my-1.5" onClick={() => handleChangeChoice('friends')}>
                                    <p className="py-2 px-10 cursor-pointer">friends</p>
                                </div>
                            )
                        }

                        {
                            (choice === 'friend request') ? (
                                <div className="bg-black/50 rounded-full mx-2 my-1.5" onClick={() => handleChangeChoice('friend request')}>
                                    <p className="py-2 px-4 cursor-pointer text-[#F9545B]">friend request</p>
                                </div>
                            ) : (
                                <div className="bg-black/50 rounded-full mx-2 my-1.5" onClick={() => handleChangeChoice('friend request')}>
                                    <p className="py-2 px-4 cursor-pointer">friend request</p>
                                </div>
                            )
                        }
                    </div>
            </div>

            {/* display data */}
            <div className="m-3 flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-2 custom-scrollbar">
                {friends.length > 0 ? (
                    friends.map((friend, index) =>
                    choice === 'friend request' ? (
                        <DisplayFriendsRequest friends={friend} changeComponent={changeComponent} setChangeComponent={setChangeComponent}  key={index} />
                    ) : (
                        <DisplayFriends friends={friend} key={index} />
                    )
                    )
                ) : (
                    <div className="text-center font-bold text-[#FEDF7F]/50">No {choice} found</div>
                )}
            </div>


        </div>
    )
}
