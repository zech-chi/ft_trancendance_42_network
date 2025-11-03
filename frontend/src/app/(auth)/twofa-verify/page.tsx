'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useSelectedUserId } from "@/context/SelectedUserId";

export default function TwoFAVerifyPage() {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { setLoggedUserName } = useLoggedUserName();
  const { setSelectedUserName } = useSelectedUserName();
  const { setSelectedUserId } = useSelectedUserId();
  const { setLoggedUserId } = useLoggedUserId();
    

  const handleVerify = async () => {
    setStatus("Verifying code...");
    try {
      const res = await fetch("http://localhost:5001/api/auth/2fa-verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
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
      setStatus(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 ">
      <h2 className="text-xl font-bold mb-4">Verify your 2FA Code</h2>

      <input
        type="text"
        placeholder="Enter your 6-digit code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded-md text-center"
      />

      <button
        onClick={handleVerify}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Verify
      </button>

      <p className="text-sm text-gray-600 mt-2">{status}</p>
    </div>
  );
}
