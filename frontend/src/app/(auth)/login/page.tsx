'use client'
// import { JSX } from "react";
import React from "react";
import { useEffect, useState } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import Image from "next/image";
import { useSelectedUserId } from "@/context/SelectedUserId";
import { useUserEmail } from "@/context/UserEmailContext";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export async function fetchUser() {
  
	try {
		let response = await fetchWithAuth('/api/auth/session', {
		});
		if (response.ok) {
			const data = await response.json();
			return data;
		}
     else {
			console.log('Failed to fetch user:', response.statusText);
			return null;
		}
    
	} catch (error) {
		console.log('Error fetching user:', error);
		return null;
	}
}


export default function LoginPage() {
  const router = useRouter();
  const { setLoggedUserName } = useLoggedUserName();
  const { setSelectedUserName } = useSelectedUserName();
  const { setSelectedUserId } = useSelectedUserId();
  const { setLoggedUserId } = useLoggedUserId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { setUserEmail } = useUserEmail();
  const [errorMsg, setErrorMsg] = useState("");

  // check if already logged in
  useEffect(() => {
    async function checkAuth() {
      const user = await fetchUser();
      if (user && user.twoFARequired) {
        router.push("/twofa-verify");
        return;
      }
      if (user && user.userName) {
        setLoggedUserName(user.userName);
        setSelectedUserName(user.userName);
        setSelectedUserId(user.id);
        setLoggedUserId(user.id);
        router.push("/gzone");
        return; 
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const handleGoogle = () => {
      window.location.href = "/api/auth/login/google";


  };
  
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      console.log("response:", res.status, data);

      setUserEmail(email); 
    

      if (res.ok) {
        if (data.twoFARequired) {
          router.push("/twofa-verify");
        }
        else
        {
          setLoggedUserName(data.user.userName);
          setSelectedUserName(data.user.userName);
          setSelectedUserId(data.user.id);
          setLoggedUserId(data.user.id);
          router.push("/gzone");
        }
      }else {
        if (data && data.verifyEmail === true) {
              router.push(`/verify`);
              return;
          }
              setError(data.message || "Login failed");
              const cleanMessage =
                data.message?.replace(/^body\//, "") ||
                "Login failed";
            
              setErrorMsg(cleanMessage);
          }
      } catch (err) {
            console.error("fetch error:", err);
            setError("Something went wrong");
          }
      };
  
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin();
      };
        

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br  from-black via-gray-900 to-black flex items-center justify-center"
    >
      {/* Card */}
      <div className="bg-gray-800/40 backdrop-blur-md p-6 shadow-xl border border-white/20  rounded-2xl w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-40 h-auto" />
          <h1 className="text-white text-2xl font-bold mt-4">Sign in</h1>
          {errorMsg && (
              <p className="text-[#FFB700] bg-[#1CBABA]/30 text-sm text-center mt-5 p-2 rounded-2xl">{errorMsg}</p>
          )}
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="mail@abc.com"
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:border-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:border-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-gray-200 transition"
            type="submit"
          >
            Log in
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Social Logins */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-600 text-white py-2 rounded-md hover:bg-[#1CBABA]/50 transition mb-2"
            onClick={handleGoogle}
        >
          Continue with Google
        </button>


        {/* Sign up link */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Not Registered Yet?{" "}
          <Link href="/register" className="text-[#1CBABA] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}