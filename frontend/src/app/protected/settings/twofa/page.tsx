'use client';
import { useLoggedUserId } from "@/context/UserIdContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TwoFASetupPage() {
  const [qr, setQr] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [isSetupStarted, setIsSetupStarted] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();


  const { loggedUserId } = useLoggedUserId();
  const userId = loggedUserId;

  // Step 1: Setup 2FA → get QR code
  const handleSetup2FA = async () => {
    setStatus("Generating QR code...");
    try {
      const res = await fetch("http://localhost:5001/api/auth/2fa-setup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to setup 2FA");

      setQr(data.qr);
      setIsSetupStarted(true);
      setStatus("Scan the QR code with Google Authenticator");
    } catch (err: any) {
      setStatus(err.message);
    }
  };

  // Step 2: Enable 2FA → send OTP
  const handleEnable2FA = async () => {
    setStatus("Verifying OTP...");
    try {
      const res = await fetch("http://localhost:5001/api/auth/2fa-enable", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to enable 2FA");

      setStatus("✅ 2FA enabled successfully!");
      router.push("/protected");
    } catch (err: any) {
      setStatus(err.message);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value)) {
      setStatus("Only digits are allowed!");
      return;
    }

    // Garder seulement les chiffres, maximum 6
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    setStatus("");

    // Désactiver après 6 chiffres
    if (digits.length === 6) {
      setStatus("6-digit code entered.");
    }
  };

  const resetInput = () => {
    setOtp("");
    setDisabled(false);
    setStatus("");
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center">
    <div className="p-6 flex flex-col items-center gap-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold">Two-Factor Authentication Setup</h2>

      {!isSetupStarted ? (
        <button
          onClick={handleSetup2FA}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Enable 2FA
        </button>
      ) : (
        <>
          {qr && (
            <img
              src={qr}
              alt="QR Code"
              className="border p-2 rounded-md shadow-md"
            />
          )}

          <input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={handleChange}
            disabled={disabled}
            className={`border p-2 rounded-md text-center text-lg tracking-widest w-40 transition-colors ${
              disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"
            }`}
            maxLength={6}
          />
          <button
            onClick={handleEnable2FA}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Verify & Enable
          </button>
        </>
      )}

      <p className="text-sm text-gray-600 mt-2">{status}</p>
    </div>
  </div>
  );
}

// 'use client';
// import { useLoggedUserId } from "@/context/UserIdContext";
// import { useRouter } from "next/navigation";
// import { useState, ChangeEvent } from "react";
// import { X } from "lucide-react";

// interface TwoFAPopupProps {
//   onClose: () => void;
// }

// export default function TwoFAPopup({ onClose }: TwoFAPopupProps) {
//   const [qr, setQr] = useState<string | null>(null);
//   const [otp, setOtp] = useState("");
//   const [status, setStatus] = useState("");
//   const [isSetupStarted, setIsSetupStarted] = useState(false);
//   const [disabled, setDisabled] = useState(false);
//   const router = useRouter();

//   const { loggedUserId } = useLoggedUserId();
//   const userId = loggedUserId;

//   const handleSetup2FA = async () => {
//     setStatus("Generating QR code...");
//     try {
//       const res = await fetch("http://localhost:5001/api/auth/2fa-setup", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to setup 2FA");

//       setQr(data.qr);
//       setIsSetupStarted(true);
//       setStatus("Scan the QR code with your authenticator app");
//     } catch (err: any) {
//       setStatus(err.message);
//     }
//   };

//   const handleEnable2FA = async () => {
//     setStatus("Verifying OTP...");
//     try {
//       const res = await fetch("http://localhost:5001/api/auth/2fa-enable", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, otp }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to enable 2FA");

//       setStatus("✅ 2FA enabled successfully!");
//       onClose(); // Close popup after success
//     } catch (err: any) {
//       setStatus(err.message);
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;

//     if (/[^0-9]/.test(value)) {
//       setStatus("Only digits allowed!");
//       return;
//     }

//     const digits = value.replace(/\D/g, "").slice(0, 6);
//     setOtp(digits);
//     setStatus("");

//     if (digits.length === 6) setStatus("6-digit code entered.");
//   };

//   const resetInput = () => {
//     setOtp("");
//     setDisabled(false);
//     setStatus("");
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/70 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Popup Card */}
//       <div className="relative p-6 flex flex-col items-center gap-4 bg-[rgba(0,0,0,0.7)] border border-yellow-500/30 rounded-2xl shadow-2xl w-[350px] md:w-[400px] text-white">
//         {/* Close Button */}
//         <button
//           className="absolute top-3 right-3 text-white/70 hover:text-white"
//           onClick={onClose}
//         >
//           <X size={20} />
//         </button>

//         <h2 className="text-xl font-bold mb-2">Two-Factor Authentication</h2>

//         {!isSetupStarted ? (
//           <button
//             onClick={handleSetup2FA}
//             className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors w-full"
//           >
//             Enable 2FA
//           </button>
//         ) : (
//           <>
//             {qr && (
//               <img
//                 src={qr}
//                 alt="QR Code"
//                 className="border border-yellow-500 p-2 rounded-lg shadow-md mb-4"
//               />
//             )}
//             <input
//               type="text"
//               placeholder="123456"
//               value={otp}
//               onChange={handleChange}
//               disabled={disabled}
//               className="w-full p-3 rounded-lg text-center text-yellow-200 bg-black/50 border border-yellow-500/50 placeholder-yellow-100 font-semibold"
//               maxLength={6}
//             />
//             <button
//               onClick={handleEnable2FA}
//               className="mt-2 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors w-full"
//             >
//               Verify & Enable
//             </button>
//           </>
//         )}

//         {status && (
//           <p className="text-sm text-yellow-200 mt-2 text-center">{status}</p>
//         )}
//       </div>
//     </div>
//   );
// }
