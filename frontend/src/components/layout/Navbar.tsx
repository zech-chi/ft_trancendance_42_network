'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { JSX } from 'react';
import Image from "next/image";
import { fetchUser } from '@/app/lib/apiDashboard';
import { useLoggedUserName } from '@/context/LoggedUserNameContext';
import { useRef } from "react";

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
              className="rounded-full w-9 h-9 xl:w-12 xl:h-12 2xl:w-15 2xl:h-15
              border-2 border-black/50
              xl:border-3 2xl:border-4
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
          className="w-[75px] h-auto xl:w-[125px] 2xl:w-[150px]"
          priority
      />

    </div>
  );
}

// function SearchForm(): JSX.Element {
//   const [inputValue, setInputValue] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setSearchQuery(inputValue); // set debounced value
//       console.log("Search Query:", inputValue); // now it logs
//     }, 1000);

//     return () => {
//       clearTimeout(handler); // cleanup previous timeout if inputValue changes
//     };
//   }, [inputValue]); // <-- depend on inputValue, NOT searchQuery


//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // ignore Enter key
//     }
//   };

//   return (
//     <form className="max-w-xl mx-auto flex-1">
//       <div className="relative w-full">
//         <input
//           type="text"
//           placeholder="Search ..."
//           onKeyDown={handleKeyDown}
//           className="
//             backdrop-blur w-full
//             px-4 py-1 text-sm       /* small for sm */
//             xl:px-6 xl:py-2 xl:text-base  /* medium for md */
//             2xl:px-8 2xl:py-3 2xl:text-lg     /* large for lg */
//             pl-7
//             xl:pl-10 2xl:pl-12
//             rounded-full
//             text-[#B2B2B2]
//             outline-none
//           "
//           style={{
//             background:
//               'linear-gradient(to right, rgba(47,25,37,0.7) 0%, rgba(72,28,43,0.7) 50%, rgba(100,33,52,0.7) 100%)',
//           }}
//         />
//         <MagnifyingGlassIcon
//           className="
//             absolute left-3 top-1/2
//             transform -translate-y-1/2
//             text-[#d7d7d7]
//             h-3 w-3             /* small for sm */
//             xl:h-4 xl:w-4       /* medium for md */
//             2xl:h-5 2xl:w-5       /* large for lg */
//           "
//         />
//       </div>
//     </form>
//   );
// }



interface UserSearch {
  id: number;
  userName: string;
  imageUrl: string;
}

function SearchForm(): JSX.Element {
  const [inputValue, setInputValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!inputValue) {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const handler = setTimeout(async () => {
      setIsLoading(true);
      setShowDropdown(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/searchUsers?prefix=${encodeURIComponent(
            inputValue
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const result: { users: UserSearch[] } = await res.json();
        setFilteredUsers(result.users);
        if (result.users.length === 0) {
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
        setFilteredUsers([]);
        setShowDropdown(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <form className="max-w-xl mx-auto flex-1 relative" ref={formRef}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search ..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowDropdown(true)}
          className="
            backdrop-blur w-full
            px-4 py-1 text-sm
            xl:px-6 xl:py-2 xl:text-base
            2xl:px-8 2xl:py-3 2xl:text-lg
            pl-7 xl:pl-10 2xl:pl-12
            rounded-full
            text-[#B2B2B2]
            outline-none
          "
          style={{
            background:
              "linear-gradient(to right, rgba(47,25,37,0.7) 0%, rgba(72,28,43,0.7) 50%, rgba(100,33,52,0.7) 100%)",
          }}
        />

        <MagnifyingGlassIcon
          className="
            absolute left-3 top-1/2
            transform -translate-y-1/2
            text-[#d7d7d7]
            h-3 w-3
            xl:h-4 xl:w-4
            2xl:h-5 2xl:w-5
          "
        />

        {showDropdown && (
          <ul className="absolute top-full mt-4 left-0 w-full rounded shadow-lg z-[999] max-h-60 overflow-y-auto"
            style={{
              background: "linear-gradient(to right, rgba(47,25,37,0.9) 0%, rgba(72,28,43,0.9) 50%, rgba(100,33,52,0.9) 100%)",
              borderRadius: "15px",
              padding: "8px 0"
            }}>
            {isLoading ? (
              <li className="px-4 py-2 text-sm" style={{ color: "#D7D7D7" }}>Loading...</li>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                  style={{ color: "#D7D7D7", transition: "background-color 0.2s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(100,33,52,0.7)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <img
                    src={user.imageUrl}
                    alt={user.userName}
                    className="h-8 w-8 rounded-full object-cover"
                    style={{ border: "1px solid #B2B2B2" }}
                  />
                  <span>{user.userName}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm" style={{ color: "#D7D7D7" }}>No users found</li>
            )}
          </ul>
        )}
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
    <nav className="fixed top-0 left-0 w-full h-13 xl:h-15 2xl:h-17 bg-black/20 text-white flex items-center px-4 z-50
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
