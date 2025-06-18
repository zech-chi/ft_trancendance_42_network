import { JSX } from "react";
import Image from "next/image";

const TOTAL_USERS = 1337;

const user = {
  fullName: "Zakaria Ech.chifaouy",
  userName: "zech-chi",
  bio: "One heartbeat matters, the next one!",
  imageUrl: "/gon.jpg",
  level: 9,
  progress: 0.54
}

type ProfileImageProps = {
  imageUrl: string;
};

type ProfileInfoProps = {
  fullName: string;
  userName: string;
  bio?: string;
};

// function ProfileImage({ imageUrl }: ProfileImageProps): JSX.Element {
//   return (
//     <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-[150px] h-[150px] overflow-hidden border-3 border-black">
//       <Image
//         src={imageUrl}
//         alt="Profile"
//         fill
//         style={{ objectFit: 'cover', objectPosition: 'center' }}
//         priority
//       />
//     </div>
//   );
// }

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
    <div className="flex flex-col justify-center h-full  bg-amber-300">
      <h2 className="text-xl font-bold text-white">{fullName}</h2>
      <h3 className="text-gray-300">@{userName}</h3>
      <p className="text-white/50 bg-black/30 p-2 rounded w-max">{bio}</p>
    </div>
  );
}

export default function TopDashboard(): JSX.Element {
  return (
    <div
      className="absolute top-0 left-0 w-full h-[175px] rounded-t-[50px]"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to right, rgba(42, 21, 34, 1), rgba(96, 31, 48, 1 ) 100%)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="bg-red-500 flex flex-row h-full">
      <ProfileImage imageUrl={user.imageUrl} />
      <div className="flex flex-col bg-white h-full gap-4 flex-1">
          <div className="bg-green-200  flex justify-between">
            <ProfileInfo fullName={user.fullName} userName={user.userName} bio={user.bio}/>
              <div className="bg-red-400">test</div>
          </div>

          <div className="bg-blue-500 flex-1 flex items-center justify-center">level here</div>
      </div>

      </div>
    </div>
  );
}