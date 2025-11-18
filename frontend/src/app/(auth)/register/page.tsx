'use client'
import { JSX } from "react";
// import Navbar from "@/components/layout/Navbar";
// import Sidebar from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
// import Login from "@/components/Login";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlowGraphConsoleLogBlock } from "@babylonjs/core";

export default function SignupPage() {

    // use router 
    const router = useRouter();
    
    const [userName, setUserName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // const handleGoogle = async () => {
    //   try {
    //       console.log("log with google");
    //       const res = await fetch("http://localhost:5001/api/auth/login/google")

    //        if (!res.ok) {
    //             throw new Error("Failed to register");
    //         }
    //         // const data = await res.json();
    //   }catch(error) {
    //     console.log("something went wrong");
    //   }
    // }

    const handleGoogle = () => {
      window.location.href = "/api/auth/login/google";
    };


    const handleSubmit = async () => {
        try {
            console.log("Attempting registration with", { userName, fullName, email, password });
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName, fullName, email, password
                })
            });

            if (!res.ok) {
                throw new Error("Failed to register");
            }
            const data = await res.json();
            router.push("/login");
            
        } catch (error) {
            console.error("Error during signup:", error);
        }
    }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
    >
      {/* Card */}
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-40 h-auto" />
          <h1 className="text-white text-2xl font-bold mt-4">Sign up</h1>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-1/2 px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:border-white"
            />
            <input
              type="text"
              placeholder="User name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-1/2 px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:border-white"
            />
          </div>
          <input
            type="email"
            placeholder="mail@abc.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:border-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:border-white"
          />

          <button
            type="submit"
            onClick={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-gray-200 transition"
          >
            Sign up
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
          {/* <Image src="/google-icon.png" alt="Google" width={20} height={20} /> */}
          Continue with Google
        </button>


        {/* Sign in link */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// if (!data.user.isVerified) {
//   router.push('/verify');
// } else {
//   router.push('/protected/dashboard');
// }
