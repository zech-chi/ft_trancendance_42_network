// components/ui/Button.tsx
"use client"

import type React from "react"
import { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}


// }

export default function Button({ children, loading, onClick,  ...props }: ButtonProps) {
  return (
    <button {...props} 
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
     onClick={onClick} disabled={props.disabled}>
      {loading ? "Loading..." : children}
    </button>
  );
}

