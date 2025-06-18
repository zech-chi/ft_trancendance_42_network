import { JSX } from "react";
import Image from "next/image";

const TOTAL_USERS = 1337;

const user = {
  fullName: "Zakaria Ech.chifaouy",
  userName: "zech-chi",
  bio: "One heartbeat matters, the next one!",
  imageUrl: "/gon.jpg",
  level: 9,
  progress: 0.75, // 75% progress
}

type ProfileImageProps = {
  imageUrl: string;
};

type ProfileInfoProps = {
  fullName: string;
  userName: string;
  bio?: string;
};

type LevelInfoProps = {
  level: number;
  progress: number;
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
      <p className="text-white/50 bg-black/30 text-sm p-2 rounded-4xl w-max">{bio}</p>
    </div>
  );
}

function DisplayLevel({ level, progress }: LevelInfoProps): JSX.Element {
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

export default function TopDashboard(): JSX.Element {
  return (
    <div
      className="absolute top-0 left-0 w-full h-[175px] rounded-t-[50px]"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to left, rgba(42, 21, 34, 1), rgba(96, 31, 48, 1 ) 100%)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="flex flex-row h-full">
        <ProfileImage imageUrl={user.imageUrl} />
        <div className="flex flex-col h-full gap-4 flex-1">
          <div className="flex justify-between">
            <ProfileInfo fullName={user.fullName} userName={user.userName} bio={user.bio}/>
            <div className="bg-red-300">test</div>
        </div>

        <div className="flex-1 flex mt-1">
          <DisplayLevel level={user.level} progress={user.progress} />
        </div>
      </div>

      </div>
    </div>
  );
}