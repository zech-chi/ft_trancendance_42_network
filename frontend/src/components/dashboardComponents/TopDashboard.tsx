'use client';
import { JSX, use, useState } from "react";
import { useEffect } from "react";
import { fetchFriendshipStatus, fetchUser, fetchNumberOfPlayers } from "@/app/lib/apiDashboard";
import { motion } from 'framer-motion';
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSelectedUserId } from "@/context/SelectedUserId";
import { useLoggedUserId } from "@/context/UserIdContext";
import React from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface User {
  id: number;
  fullName: string;
  userName: string;
  bio: string;
  imageUrl: string;
  rank: number;
  level: number;
  progress: number;
  online: boolean;
}

type TopDashboardProps = {
  user: User;
  totalUsers: number;
};

type ProfileImageProps = {
  imageUrl: string;
  online: boolean;
};

type ProfileInfoProps = {
  fullName: string;
  userName: string;
  bio: string;
};

type LevelInfoProps = {
  progress: number;
};

type RankInfoProps = {
  level: number;
  progress: number;
  rank: number;
  totalUsers: number;
};

type friendshipStatusType = {
  status: 'self' | 'no_relationship' | 'accepted' | 'pending' | 'blocked';
  blocked_by: boolean | null;
}


function ProfileImage({ imageUrl, online }: ProfileImageProps): JSX.Element {
    return (
      <div className="relative rounded-full  overflow-hidden
        m-0.5
      ">
            <div className="relative 
            w-[80px] h-[80px] md:w-[100px] md:h-[100px]  xl:w-[140px] xl:h-[140px]
            ">
            <div className={`w-full h-full rounded-full border-[7px] xl:border-10
                border-[#1CBABA]/0
                border-l-transparent border-b-transparent 
                flex items-center justify-center overflow-hidden rotate-225`}>
                {/* <img
                src={imageUrl}
                alt="User Profile"
                className="w-full h-full object-cover rounded-full -rotate-225 
                border-3 xl:border-4 2xl:border-5
                border-black/50"
                /> */}
                <Image
                  src={imageUrl}
                  alt="User Profile"
                  width={500}             // placeholder (overridden by w-full / h-full)
                  height={500}
                  className="w-full h-full object-cover rounded-full -rotate-225 
                            border-2
                            border-white/50"
                />
            </div>
            {
                online && <div className="absolute 
                bottom-[14px] right-[8px] w-2 h-2
                md:bottom-[16px] md:right-[12px]  md:w-2.5 md:h-2.5  
                xl:bottom-[24px] xl:right-[18px]  xl:w-3 xl:h-3
                bg-[#00FF04] rounded-full border-1 md:border-1.5 xl:border-2 border-black" />
            }
            {
                !online && <div className="absolute
                bottom-[14px] right-[8px] w-2 h-2
                md:bottom-[16px] md:right-[12px]  md:w-2.5 md:h-2.5 
                xl:bottom-[24px] xl:right-[18px]  xl:w-3 xl:h-3
                bg-[#FF0000] rounded-full border-1  md:border-1.5 xl:border-2 border-black" />
            }
            </div>
      </div>
    );
}

function ProfileInfo({ user, friendshipStatus, setFriendshipStatus }: {user : User, friendshipStatus: friendshipStatusType, setFriendshipStatus: React.Dispatch<React.SetStateAction<friendshipStatusType>>}): JSX.Element {
  const { loggedUserId } = useLoggedUserId();
  // const { friendshipStatus, setFriendshipStatus } = useState<string>("self");

  // useEffect(() => {
  //   try {
  //     const fetchFriendshipStatus = async () => {
        
  //   }

//   useEffect(() => {
//     console.log("Friendship status updated:", friendshipStatus);
//  }, [friendshipStatus]);


  const handleSentRequestFriend = () => {
    // fetch user id by user name
    if (!user || !loggedUserId) return;

    const sendFriendRequest = async () => {
        try {
           const response = await fetchWithAuth(`/api/dashboard/friends/requestfriend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: loggedUserId,
                    receiver_id: user.id,
                }),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setFriendshipStatus({status: "pending", blocked_by: null});
            console.log(data);
        } catch (error) {
            console.error("Error sending friend request:", error);
            // should use  state do display the error for the loged user
        }
    };

    sendFriendRequest();
};

    return (
      <div className="flex flex-col justify-center h-full gap-1 mt-2">
        <div className="flex gap-5">
            <h2 className="text-[10px] md:text-[14px] xl:text-[18px] font-bold text-white/90">
                {user.fullName}
            </h2>

            {friendshipStatus.status === "no_relationship" && (
              <button
                className="
                  text-white max-h-[40px] min-w-[40px] rounded-full 
                  shadow-lg bg-black/30 hover:scale-105 hover:shadow-xl 
                  transform transition-all duration-200 ease-in-out 
                  flex items-center gap-1 justify-center
                "
                onClick={handleSentRequestFriend}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </button>
            )}
            {friendshipStatus.status === "accepted" && (
              <button
                className="
                  text-white max-h-[40px] min-w-[40px] rounded-full 
                  shadow-lg bg-black/30 hover:scale-105 hover:shadow-xl 
                  transform transition-all duration-200 ease-in-out 
                  flex items-center gap-1 justify-center
                "
                // onClick={handleSentRequestFriend}
              >
              <svg className="w-6 h-6" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Person */}
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" fill="white" />
                {/* Green checkmark circle background */}
                <circle cx="14" cy="14" r="3.5" fill="#22c55e" />
                {/* Checkmark */}
                <path 
                  d="M12.5 14l1 1 2-2" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              </button>
            )}
            {friendshipStatus.status === "pending" && (
              <button
                className="
                  text-white max-h-[40px] min-w-[40px] rounded-full 
                  shadow-lg bg-black/30 hover:scale-105 hover:shadow-xl 
                  transform transition-all duration-200 ease-in-out 
                  flex items-center gap-1 justify-center
                "
                // onClick={handleSentRequestFriend}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6"
                >
                  {/* Person body */}
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h13"
                    fill="white"
                  />
                  {/* Clock circle */}
                  <circle cx="17.5" cy="17.5" r="4.5" fill="white" />
                  {/* Clock face */}
                  <circle cx="17.5" cy="17.5" r="4" fill="black" stroke="white" strokeWidth="0.5" />
                  {/* Clock hands */}
                  <path
                    d="M17.5 14.5v3h2.5"
                    stroke="white"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            
        </div>
        <h3 className="text-white/70 text-[8px] md:text-[12px] xl:text-[16px]">@{user.userName}</h3>
        <p className="text-white/60 bg-black/30 text-[6px] md:text-[10px] xl:text-[14px] p-1 md:px-1.5 xl:px-2 rounded-4xl w-auto max-w-[150px] md:max-w-[700px]">
          {user.bio}
        </p>
      </div>
    );
}

function DisplayRank({ level, progress, rank, totalUsers }: RankInfoProps): JSX.Element {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-1 mt-2
       mr-10
      ">
        <h2 className="text-[10px] md:text-[14px] xl:text-[18px] font-bold text-white/90">Global Rank</h2>
        <h2
          className="text-[10px] md:text-[14px] xl:text-[18px] font-bold bg-clip-text text-transparent "
          style={{
            backgroundImage: "linear-gradient(to right, #FE9634 0%, #FC709B 40%, #FC709B 100%)",
          }}
        >
        {rank}
        <span className="text-[8px] md:text-[10px] xl:text-[12px] text-base text-white/60 ml-1 mr-1">/ {totalUsers}</span>
        </h2>
        <h2 className="text-[8px] md:text-[12px] xl:text-[16px] font-bold text-[#1CBABA]">Level {level} - {progress * 100} %</h2>
      </div>
    );
  }

function DisplayLevel({ progress }: LevelInfoProps): JSX.Element {
    return (
      <div className="relative bg-white/10 w-full h-2 md:h-2.5 xl:h-3 mr-10 rounded-4xl border-1 md:border-1.5 xl:border-2  border-[#1CBABA]/30 mt-0 md:mt-0.5 xl:mt-2 mb-2.5">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-4xl bg-[#1CBABA] border-1 md:border-1.5 xl:border-2  border-white/40" 
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    );
  }



export function TopDashboard(): JSX.Element {
    const { loggedUserId } = useLoggedUserId();
    const { selectedUserName } = useSelectedUserName();
    const { selectedUserId } = useSelectedUserId();
    const [user, setUser] = useState<User | null> (null);
    const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
    const [ friendshipStatus, setFriendshipStatus ] = useState<friendshipStatusType>({status: "self", blocked_by: null});

    useEffect(() => {
        if (selectedUserName) {
            setTimeout(() => {
                const fetchData = async () => {
                    const cur = await fetchUser(selectedUserName);
                    setUser(cur);
                };
                fetchData();
            }, 100);

            // Determine friendship status
            setTimeout(() => {
                const fetchData = async () => {
                    if (!loggedUserId || !selectedUserId) return;
                    const cur = await fetchFriendshipStatus(loggedUserId, selectedUserId);
                    setFriendshipStatus(cur);
                };
                fetchData();
            }, 100);

            // fetch number of players
            setTimeout(() => {
              const fetchData = async () => {
                  const response = await fetchNumberOfPlayers();
                  setNumberOfPlayers(response.numPlayers);
              };
              fetchData();
          }, 100);

        }
    }
    , [selectedUserName]);

    if (!user) {
        return <div className="text-white">Loading...4</div>;
    }

    return (
        <div className=" text-white m-2.5 rounded-2xl
        bg-gray-800/40 backdrop-blur-md p-6 shadow-xl border border-white/20
        ">
                  <div className="flex flex-row h-full">
                    <ProfileImage imageUrl={user.imageUrl} online={user.online}/>
                    <div className="flex flex-col h-full gap-2 flex-1">
                        <div className="flex justify-between ml-2">
                            <ProfileInfo user = {user} friendshipStatus= {friendshipStatus} setFriendshipStatus={setFriendshipStatus}/>
                            <DisplayRank
                            level={user.level}
                            progress={user.progress}
                            rank={user.rank} // Assuming rank 1 for demonstration
                            totalUsers={numberOfPlayers}
                            />
                        </div>
                        <div className="flex-1 flex ml-2">
                            <DisplayLevel progress={user.progress} />
                        </div>
                    </div>
                </div>
        </div>
    );
}