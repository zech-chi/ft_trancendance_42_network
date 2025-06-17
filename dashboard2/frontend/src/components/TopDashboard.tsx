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

function ProfileImage({ imageUrl }: ProfileImageProps): JSX.Element {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-[200px] h-[200px] overflow-hidden border-3 border-black">
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

export default function TopDashboard(): JSX.Element {
  return (
    <div
      className="absolute top-0 left-0 w-full h-[230px] rounded-t-[50px]"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to right, rgba(42, 21, 34, 1), rgba(96, 31, 48, 1 ) 100%)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <ProfileImage imageUrl={user.imageUrl} />
    </div>
  );
}