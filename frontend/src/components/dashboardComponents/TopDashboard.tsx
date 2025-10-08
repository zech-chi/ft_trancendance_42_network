'use client';
import { JSX, use, useState } from "react";
import { useEffect } from "react";
import { fetchUser } from "@/app/lib/apiDashboard";
import { motion } from 'framer-motion';
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSelectedUserId } from "@/context/SelectedUserId";
import { useLoggedUserId } from "@/context/UserIdContext";

const TOTAL_USERS = 133742;

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

function ProfileImage({ imageUrl, online }: ProfileImageProps): JSX.Element {
    return (
      <div className="relative rounded-full  overflow-hidden
        m-0.5
      ">
            <div className="relative 
            w-[80px] h-[80px] md:w-[100px] md:h-[100px]  xl:w-[140px] xl:h-[140px]
            ">
            <div className={`w-full h-full rounded-full border-[7px] xl:border-10
                border-[#FEDF7F]/0
                border-l-transparent border-b-transparent 
                flex items-center justify-center overflow-hidden rotate-225`}>
                <img
                src={imageUrl}
                alt="User Profile"
                className="w-full h-full object-cover rounded-full -rotate-225 
                border-3 xl:border-4 2xl:border-5
                border-black/50"
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

function ProfileInfo({ user }: {user : User}): JSX.Element {
  const { loggedUserId } = useLoggedUserId();
  // const { friendshipStatus, setFriendshipStatus } = useState<string>("self");

  // useEffect(() => {
  //   try {
  //     const fetchFriendshipStatus = async () => {
        
  //   }


  const handleSentRequestFriend = () => {
    // fetch user id by user name
    if (!user || !loggedUserId) return;

    const sendFriendRequest = async () => {
        try {
           const response = await fetch(`http://localhost:5002/api/dashboard/friends/requestfriend`, {
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

            {loggedUserId !== user.id && (
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
                {/* <svg className="w-6 h-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" fill="white" />
                  <path d="M14.707 13.293a1 1 0 00-1.414 0L11 15.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" fill="#22c55e" />
                </svg> */}
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
        <h2 className="text-[8px] md:text-[12px] xl:text-[16px] font-bold text-[#FEDF7F]">Level {level} - {progress * 100} %</h2>
      </div>
    );
  }

function DisplayLevel({ progress }: LevelInfoProps): JSX.Element {
    return (
      <div className="relative bg-white/10 w-full h-2 md:h-2.5 xl:h-3 mr-10 rounded-4xl border-1 md:border-1.5 xl:border-2  border-[#F9545B]/30 mt-0 md:mt-0.5 xl:mt-2 mb-2.5">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-4xl bg-[#FEDF7F] border-1 md:border-1.5 xl:border-2  border-white/40" 
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    );
  }

export function TopDashboard(): JSX.Element {
    const { loggedUserId } = useLoggedUserId();
    const { selectedUserName } = useSelectedUserName();
    const [user, setUser] = useState<User | null> (null);

    useEffect(() => {
        if (selectedUserName) {
            setTimeout(() => {
                const fetchData = async () => {
                    const cur = await fetchUser(selectedUserName);
                    setUser(cur);
                };
                fetchData();
            }, 200);
        }
    }
    , [selectedUserName]);

    if (!user) {
        return <div className="text-white">Loading...4</div>;
    }

    return (
        <div className="w-full text-white"
        style={{
            background:
              'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), linear-gradient(to left, rgba(42, 21, 34, 1), rgba(96, 31, 48, 1 ) 100%)',
            backgroundBlendMode: 'overlay',
          }}>
                  <div className="flex flex-row h-full">
                    <ProfileImage imageUrl={user.imageUrl} online={user.online}/>
                    <div className="flex flex-col h-full gap-2 flex-1">
                        <div className="flex justify-between ml-2">
                            <ProfileInfo user = {user}/>
                            <DisplayRank
                            level={user.level}
                            progress={user.progress}
                            rank={user.rank} // Assuming rank 1 for demonstration
                            totalUsers={TOTAL_USERS}
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