// components/ui/Button.tsx
"use client"

import type React from "react"
import { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}


export default function Button({ children, loading, onClick,  ...props }: ButtonProps) {
  return (
    <button {...props} 
    className="w-full sm:w-auto mt-4 sm:mt-0 py-2 sm:py-4 px-4 rounded-xl font-semibold
            bg-[#1CBABA]/70 hover:bg-[#1CBABA]/100 text-white transition cursor-pointer
            disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:hover:bg-gray-600/50
            flex items-center justify-center gap-2"
     onClick={onClick} disabled={props.disabled}>
      {loading ? "Loading..." : children}
    </button>
  );
}

