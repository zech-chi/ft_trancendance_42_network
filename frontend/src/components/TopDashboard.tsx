'use client';
import { JSX, useState } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useEffect } from "react";
import { fetchUser } from "@/app/lib/apiDashboard";
import { motion } from 'framer-motion';

const TOTAL_USERS = 133742;

interface User {
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
      <div className="relative rounded-full w-[80px] h-[80px] overflow-hidden m-2">
            <div className="relative 
            w-[80px] h-[80px] md:w=[90px] md:h=[90px]  xl:w-[100px] xl:h-[100px]
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
                xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                bg-[#00FF04] rounded-full border-1 xl:border-2 border-black" />
            }
            {
                !online && <div className="absolute
                bottom-[14px] right-[8px] w-2 h-2
                xl:bottom-[20px] xl:right-[10px]  xl:w-3 xl:h-3
                bg-[#FF0000] rounded-full border-1  xl:border-2 border-black" />
            }
            </div>
      </div>
    );
}

function ProfileInfo({ fullName, userName, bio }: ProfileInfoProps): JSX.Element {
    return (
      <div className="flex flex-col justify-center h-full gap-1 mt-2">
        <h2 className="text-[10px] font-bold text-white">
            {fullName}
        </h2>
        <h3 className="text-white text-[8px]">@{userName}</h3>
        <p className="text-white/75 bg-black/30 text-[5px] p-0.5 rounded-4xl w-max">
            <span className="block sm:hidden">
            {bio.length > 20 ? bio.slice(0, 20) + '...' : bio}
        </span>
        <span className="hidden sm:block">
            {bio}
        </span>
        </p>
      </div>
    );
}

function DisplayRank({ level, progress, rank, totalUsers }: RankInfoProps): JSX.Element {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-1 mt-2 mr-10">
        <h2 className="text-[10px] font-bold text-white">Global Rank</h2>
        <h2
          className="text-[10px] font-bold bg-clip-text text-transparent "
          style={{
            backgroundImage: "linear-gradient(to right, #FE9634 0%, #FC709B 40%, #FC709B 100%)",
          }}
        >
        {rank}
        <span className="text-[10px] text-base text-white/60 ml-1 mr-1">/ {totalUsers}</span>
        </h2>
        <h2 className="text-[8px] font-bold text-[#FEDF7F]">Level {level} - {progress * 100} %</h2>
      </div>
    );
  }

function DisplayLevel({ progress }: LevelInfoProps): JSX.Element {
    return (
      <div className="relative bg-white/10 w-full h-2 mr-10 rounded-4xl border-1  border-[#F9545B]/30">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-4xl bg-[#FEDF7F] border-1  border-white/40" 
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    );
  }

export function TopDashboard(): JSX.Element {
    const {loggedUserName} = useLoggedUserName();
    const [user, setUser] = useState<User | null> (null);

    useEffect(() => {
        if (loggedUserName) {
            setTimeout(() => {
                const fetchData = async () => {
                    const cur = await fetchUser(loggedUserName);
                    setUser(cur);
                };
                fetchData();
            }, 200);
        }
    }
    , [loggedUserName]);

    if (!user) {
        return <div className="text-white">Loading...</div>;
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
                            <ProfileInfo fullName={user.fullName} userName={user.userName} bio={user.bio}/>
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