import { JSX } from "react";
import Image from "next/image";

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
};

type ProfileInfoProps = {
  fullName: string;
  userName: string;
  bio?: string;
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

function ProfileImage({ imageUrl }: ProfileImageProps): JSX.Element {
  return (
    <div className="relative rounded-full w-[150px] h-[150px] overflow-hidden border-3 border-black m-3">
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

function ProfileInfo({ fullName, userName, bio }: ProfileInfoProps): JSX.Element {
  return (
    <div className="flex flex-col justify-center h-full gap-2 mt-4">
      <h2 className="text-xl font-bold text-white">{fullName}</h2>
      <h3 className="text-white">@{userName}</h3>
      <p className="text-white/75 bg-black/30 text-sm p-2 rounded-4xl w-max">{bio}</p>
    </div>
  );
}

function DisplayRank({ level, progress, rank, totalUsers }: RankInfoProps): JSX.Element {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-2 mt-4 mr-10">
      <h2 className="text-xl font-bold text-white">Global Rank</h2>
      <h2
        className="text-4xl font-bold bg-clip-text text-transparent "
        style={{
          backgroundImage: "linear-gradient(to right, #FE9634 0%, #FC709B 40%, #FC709B 100%)",
        }}
      >
      {rank}
      <span className="text-xl text-base text-white/60 ml-1 mr-1">/ {totalUsers}</span>
      </h2>
      <h2 className="text-xl font-bold text-[#FEDF7F]">Level {level} - {progress * 100} %</h2>
    </div>
  );
}

function DisplayLevel({ progress }: LevelInfoProps): JSX.Element {
  return (
    <div className="relative bg-black w-full h-4 mr-10 rounded-4xl border-2  border-white/40">
      <div
        className="absolute top-0 left-0 h-full rounded-4xl bg-[#FEDF7F] border-1  border-white/40" 
        style={{ width: `${progress * 100}%` }}
      >  
      </div>
    </div>
  );
}

export default function TopDashboard({ user, totalUsers }: TopDashboardProps): JSX.Element {
  return (
    <div
      className="absolute top-0 left-0 w-full h-[175px] rounded-t-[50px]"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), linear-gradient(to left, rgba(42, 21, 34, 1), rgba(96, 31, 48, 1 ) 100%)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="flex flex-row h-full">
        <ProfileImage imageUrl={user.imageUrl} />
        <div className="flex flex-col h-full gap-4 flex-1">
          <div className="flex justify-between ml-2">
            <ProfileInfo fullName={user.fullName} userName={user.userName} bio={user.bio}/>
            <div
              className={`absolute top-33 left-33 w-4 h-4 rounded-full border-2 border-black ${
                user.online ? 'bg-[#00FF04]' : 'bg-[#F63737]'
              }`}
            ></div>
            <DisplayRank
              level={user.level}
              progress={user.progress}
              rank={user.rank} // Assuming rank 1 for demonstration
              totalUsers={totalUsers}
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