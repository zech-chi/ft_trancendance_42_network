'use client'
import { JSX } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import Login from "@/components/Login";
import Link from "next/link";
import Image from "next/image";


export default function LoginPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.png')" }}
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
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:border-white"
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-pink-500" />
              Remember Me
            </label>
            <Link href="/forgot-password" className="hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-gray-200 transition"
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
        <button className="w-full flex items-center justify-center gap-2 border border-gray-600 text-white py-2 rounded-md hover:bg-[#FEDF7F]/50 transition mb-2">
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
