'use client'
import { JSX } from "react";
import { useEffect, useState } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import Image from "next/image";
import { useSelectedUserId } from "@/context/SelectedUserId";

export async function fetchUser() {
	try {
		const response = await fetch('http://localhost:5001/api/auth/session', {
			credentials: 'include', // include cookies in the request
		});
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
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
  const [loading, setLoading] = useState(true); // new state

  // check if already logged in
  useEffect(() => {
    async function checkAuth() {
      const user = await fetchUser();
      if (user && user.userName) {
        // alert("Already logged in, redirecting to home page.");
        setLoggedUserName(user.userName);
        setSelectedUserName(user.userName);
        setSelectedUserId(user.id);
        setLoggedUserId(user.id);
        router.push("/protected");
        return; 
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const handleGoogle = () => {
      window.location.href = "http://localhost:5001/api/auth/login/google";
  };
  
  const handleLogin = async () => {
    try {
      // console.log("Attempting login with", { email, password });
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      console.log("response:", res.status, data);

      if (res.ok) {
        setLoggedUserName(data.userName);
        setSelectedUserName(data.userName);
        setSelectedUserId(data.id);
        setLoggedUserId(data.id);
        router.push("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("fetch error:", err);
      setError("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading... 1
      </div>
    );
  }
  // console.log("Rendering LoginPage with", { email, password, error });

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      // style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* Card */}
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/PONG.png" alt="Logo" className="w-40 h-auto" />
          <h1 className="text-white text-2xl font-bold mt-4">Sign in</h1>
        </div>

        {/* Form */}
        <form className="space-y-4">
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
            type="button"
            onClick={handleLogin}
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
        <button className="w-full flex items-center justify-center gap-2 border border-gray-600 text-white py-2 rounded-md hover:bg-[#FEDF7F]/50 transition mb-2"
            onClick={handleGoogle}
        >
          {/* <Image src="/google-icon.png" alt="Google" width={20} height={20} /> */}
          Continue with Google
        </button>

        <button className="w-full flex items-center justify-center gap-2 border border-gray-600 text-white py-2 rounded-md hover:bg-[#FEDF7F]/50 transition">
          {/* <Image src="/google-icon.png" alt="42" width={20} height={20} /> */}
          Continue with 42 Intra
        </button>

        {/* Sign up link */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Not Registered Yet?{" "}
          <Link href="/register" className="text-pink-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}