'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { JSX } from 'react';
import Image from "next/image";
import { fetchUser } from '@/app/lib/apiDashboard';
import { useLoggedUserName } from '@/context/LoggedUserNameContext';

function ProfileImg({loggedUserName} : {loggedUserName : string}): JSX.Element {
	const [ userProfile, setUserProfile ] = useState<string | null>(null);
	const [ err, setErr ] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const user = await fetchUser(loggedUserName);
				setUserProfile(user.imageUrl);
			} catch (error) {
				setErr("Failed to fetch profile image.");
        console.log(error);
			}
		};

		fetchProfile();
	} , [loggedUserName]);
	if (err) {
		return <div className="text-red-500">{err}</div>;
	}
	if (!userProfile) {
		return <div className="text-gray-500">Loading profile image...</div>;
	}
	return <img src={userProfile}
              alt="User Profile"
              className="rounded-full w-9 h-9 md:w-12 md:h-12 lg:w-15 lg:h-15
              border-2 border-black/50
              md:border-3 lg:border-4
              object-cover ml-5"
          />;
}

function Logo(): JSX.Element {
  return (
    <div className="mr-5">
      {/* <Image
        src="/PONG.png"
        alt="Logo"
        width={150}
        height={150}
        className="rounded-full"
        priority
      /> */}
      <Image
          src="/PONG.png"
          alt="Logo"
          width={150}
          height={150}
          className="w-[75px] h-auto md:w-[125px] lg:w-[150px]"
          priority
      />

    </div>
  );
}

function SearchForm(): JSX.Element {
  return (
    <form className="max-w-xl mx-auto flex-1">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search ..."
          className="
            backdrop-blur w-full
            px-4 py-1 text-sm       /* small for sm */
            md:px-6 md:py-2 md:text-base  /* medium for md */
            lg:px-8 lg:py-3 lg:text-lg     /* large for lg */
            pl-7
            md:pl-10 lg:pl-12
            rounded-full
            text-[#B2B2B2]
            outline-none
          "
          style={{
            background:
              'linear-gradient(to right, rgba(47,25,37,0.7) 0%, rgba(72,28,43,0.7) 50%, rgba(100,33,52,0.7) 100%)',
          }}
        />
        <MagnifyingGlassIcon
          className="
            absolute left-3 top-1/2
            transform -translate-y-1/2
            text-[#d7d7d7]
            h-3 w-3             /* small for sm */
            md:h-4 md:w-4       /* medium for md */
            lg:h-5 lg:w-5       /* large for lg */
          "
        />
      </div>
    </form>
  );
}




export default function Navbar() {
  const { loggedUserName } = useLoggedUserName();
  const [mounted, setMounted] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full h-13 md:h-15 lg:h-17 bg-black/20 text-white flex items-center px-4 z-50
      backdrop-blur
      ">
      {/* Logo */}
      <Logo />
  
      {/* Search Form */}
      <SearchForm />

      {/* Profile Image */}
      {loggedUserName && <ProfileImg loggedUserName={loggedUserName}/>}
    </nav>
  );
  
}
