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


function SearchForm(): JSX.Element {
  const [inputValue, setInputValue] = useState(""); // updated immediately
  const [searchQueryOld, setSearchQueryOld] = useState(""); // to track changes
  const [searchQuery, setSearchQuery] = useState(""); // debounced value

  // debounce effect: store inputValue into searchQuery after 100ms
  useEffect(() => {
    if (inputValue.length === 0) {
      setSearchQuery(""); // optional: reset search when input cleared
      setSearchQueryOld(""); // reset old value
      return;
    }

    const handler = setTimeout(() => {
      setSearchQueryOld(searchQuery); // store old value
      setSearchQuery(inputValue);
      console.log("Debounced Query:", inputValue);
      // here you can trigger your API call or filter function
    }, 100); // 100ms delay

    return () => {
      clearTimeout(handler); // clear timeout if input changes within 100ms
    };
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.preventDefault(); // ignore Enter
  };

  return (
    <form className="max-w-xl mx-auto flex-1">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search ..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
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
      </div>

      {/* display all users that match searchQuery */}
      <p className="absolute top-15 left-1/2 transform -translate-x-1/2 z-[9999] text-sm text-gray-400 bg-black bg-opacity-50 px-3 py-1 rounded">
        Searching for: <strong>{searchQuery}</strong>
        old value: <strong>{searchQueryOld}</strong>
      </p>

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
