// 'use client';
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useLoggedUserId } from "@/context/UserIdContext";
// import { useLoggedUserName } from "@/context/LoggedUserNameContext";
// import { useSelectedUserName } from "@/context/SelectedUserNameContext";
// import { useSelectedUserId } from "@/context/SelectedUserId";

// export default function TwoFAVerifyPage() {
//   const [otp, setOtp] = useState("");
//   const [status, setStatus] = useState("");
//   const router = useRouter();
//   const { setLoggedUserName } = useLoggedUserName();
//   const { setSelectedUserName } = useSelectedUserName();
//   const { setSelectedUserId } = useSelectedUserId();
//   const { setLoggedUserId } = useLoggedUserId();
    

//   const handleVerify = async () => {
//     setStatus("Verifying code...");
//     try {
//       const res = await fetch("http://localhost:5001/api/auth/2fa-verify", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ otp }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Invalid OTP");

//       setStatus("✅ Verified!");
//       setLoggedUserName(data.user.userName);
//       setSelectedUserName(data.user.userName);
//       setSelectedUserId(data.user.id);
//       setLoggedUserId(data.user.id);
//       setTimeout(() => router.push("/protected"), 300);
//     } catch (err: any) {
//       setStatus(err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-6 ">
//       <h2 className="text-xl font-bold mb-4">Verify your 2FA Code</h2>

//       <input
//         type="text"
//         placeholder="Enter your 6-digit code"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         className="border p-2 rounded-md text-center"
//       />

//       <button
//         onClick={handleVerify}
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
//       >
//         Verify
//       </button>

//       <p className="text-sm text-gray-600 mt-2">{status}</p>
//     </div>
//   );
// }


'use client';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useSelectedUserId } from "@/context/SelectedUserId";
import Image from 'next/image';

export default function TwoFAVerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const { setLoggedUserName } = useLoggedUserName();
  const { setSelectedUserName } = useSelectedUserName();
  const { setSelectedUserId } = useSelectedUserId();
  const { setLoggedUserId } = useLoggedUserId();
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setStatus("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    setStatus("Verifying code...");
    
    try {
      const res = await fetch("http://localhost:5001/api/auth/2fa-verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpString }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      setStatus("✅ Verified!");
      setLoggedUserName(data.user.userName);
      setSelectedUserName(data.user.userName);
      setSelectedUserId(data.user.id);
      setLoggedUserId(data.user.id);
      setTimeout(() => router.push("/protected"), 300);
    } catch (err: any) {
      setStatus("❌ " + err.message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const isComplete = otp.every(digit => digit !== "");

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm bg-brown-900/95 backdrop-blur-sm rounded-2xl p-10 shadow-2xl" style={{backgroundColor: 'rgba(00,00,00, 0.70)'}}>
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-white text-2xl font-bold mt-4">Verify your 2FA</h1>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8">
          <p className="text-gray-300 text-sm">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {/* OTP Input boxes */}
        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="w-11 h-14 text-center text-2xl font-bold bg-brown-800/70 border border-brown-700/50 rounded-lg text-white placeholder-gray-500 focus:border-pink-500/50 focus:outline-none transition-all"
              style={{backgroundColor: 'rgba(0, 0, 5, 0.5)', borderColor: 'rgba(0, 0, 0, 0.9)'}}
              disabled={isVerifying}
            />
          ))}
        </div>

        {/* Status message */}
        {status && (
          <div className={`text-center text-sm mb-6 ${
            status.includes("✅") ? "text-green-400" : 
            status.includes("❌") ? "text-red-400" : 
            "text-gray-400"
          }`}>
            {status}
          </div>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={!isComplete || isVerifying}
          className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
            isComplete && !isVerifying
              ? "bg-white text-gray-900 hover:bg-gray-100"
              : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

      </div>
    </div>
  );
}