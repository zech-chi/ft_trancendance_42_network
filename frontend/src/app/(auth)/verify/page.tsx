// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useUserEmail } from '@/context/UserEmailContext';
// import { useLoggedUserName } from '@/context/LoggedUserNameContext';
// import { useSelectedUserName } from '@/context/SelectedUserNameContext';
// import { useSelectedUserId } from '@/context/SelectedUserId';
// import { useLoggedUserId } from '@/context/UserIdContext';

// export default function VerifyEmailPage() {
//   const router = useRouter();
//   const [code, setCode] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);
//   const [message, setMessage] = useState('');
//   const { userEmail } = useUserEmail();
//   const { setLoggedUserName } = useLoggedUserName();
//   const { setSelectedUserName } = useSelectedUserName();
//   const { setSelectedUserId } = useSelectedUserId();
//   const { setLoggedUserId } = useLoggedUserId();

//   const handleVerify = async () => {
//     if (code.trim().length < 6) {
//       setError('Please enter the 6–8 digit code.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       const res = await fetchWithAuth(`http://localhost:5001/api/auth/verify-email`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         
//         body: JSON.stringify({ code , email: userEmail }),
//       });

//       const data = await res.json();
//       if (res.ok && data.user) {
//         setMessage('Email verified successfully!');
//         setLoggedUserName(data.user.userName);
//           setSelectedUserName(data.user.userName);
//           setSelectedUserId(data.user.id);
//           setLoggedUserId(data.user.id);
//           router.push("/protected");

//         // setTimeout(() => router.push('/login'), 0);
//       } else {
//         setError(data.error || data.message || 'Verification failed.');
//       }
//     } catch (err) {
//       setError('Server connection error.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setResending(true);
//     setError('');
//     setMessage('');

//     try {
//       const res = await fetchWithAuth(`http://localhost:5001/api/auth/resend-code`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: userEmail }),
//       });

//       if (res.ok) {
//         setMessage('New code sent to your email!');
//       } else {
//         const data = await res.json();
//         setError(data.error || data.message || 'Resend failed.');
//       }
//     } catch (err) {
//       setError('Server connection error.');
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px]">
//         <h1 className="text-2xl font-bold text-center mb-4">Verify your email</h1>
//         <p className="text-sm text-gray-500 text-center mb-6">
//           Enter the 6–8 digit code we sent to your email.
//         </p>

//         <input
//           type="text"
//           maxLength={8}
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           placeholder="Enter verification code"
//         />

//         {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
//         {message && <p className="text-green-500 text-sm mb-2 text-center">{message}</p>}

//         <button
//           onClick={handleVerify}
//           disabled={loading}
//           className={`w-full py-3 rounded-lg text-white font-medium ${
//             loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? 'Verifying...' : 'Verify Email'}
//         </button>

//         <button
//           onClick={handleResend}
//           disabled={resending}
//           className="text-blue-500 text-sm mt-4 hover:underline w-full text-center"
//         >
//           {resending ? 'Sending...' : 'Resend code'}
//         </button>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserEmail } from '@/context/UserEmailContext';
import { useLoggedUserName } from '@/context/LoggedUserNameContext';
import { useSelectedUserName } from '@/context/SelectedUserNameContext';
import { useSelectedUserId } from '@/context/SelectedUserId';
import { useLoggedUserId } from '@/context/UserIdContext';
import Image from 'next/image';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail } = useUserEmail();
  const { setLoggedUserName } = useLoggedUserName();
  const { setSelectedUserName } = useSelectedUserName();
  const { setSelectedUserId } = useSelectedUserId();
  const { setLoggedUserId } = useLoggedUserId();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newCode[idx] = char;
    });
    setCode(newCode);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const codeString = code.join("");

    if (codeString.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetchWithAuth(`/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({ code: codeString, email: userEmail }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setMessage('Email verified successfully!');
        setLoggedUserName(data.user.userName);
        setSelectedUserName(data.user.userName);
        setSelectedUserId(data.user.id);
        setLoggedUserId(data.user.id);
        setTimeout(() => router.push("/gzone"), 500);
      } else {
        setError(data.error || data.message || 'Verification failed.');
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Server connection error.');
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');

    try {
      const res = await fetchWithAuth(`/api/auth/resend-code`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
        
      });

      if (res.ok) {
        setMessage('New code sent to your email!');
      } else {
        const data = await res.json();
        setError(data.error || data.message || 'Resend failed.');
      }
    } catch {
      setError('Server connection error.');
    } finally {
      setResending(false);
    }
  };

  const isComplete = code.every(digit => digit !== "");

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm bg-brown-900/95 backdrop-blur-sm rounded-2xl p-10 shadow-2xl" style={{backgroundColor: 'rgba(0, 0, 0, 0.70)'}}>

        <div className="text-center mb-8">
          {/* Logo like the one in the login page */}  
          <div className="flex flex-col items-center mb-6">
          {/* <img src="/logo.png" alt="Logo" className="w-40 h-auto" /> */}
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-white text-2xl font-bold mt-4">Verify your email</h1>
        </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-300 text-sm">
            Enter the 6-digit code we sent to your email
          </p>
          {userEmail && (
            <p className="text-gray-400 text-xs mt-2">
              {userEmail}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-1.5 mb-6" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => { if (el) inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
                          className="w-11 h-14 text-center text-2xl font-bold bg-brown-800/70 border border-white/5  rounded-lg text-white placeholder-gray-500 focus:border-[#1CBABA]  focus:outline-none transition-all shadow-[0_0_40px_rgba(28,186,186,0.45)]"

              disabled={loading || resending}
            />
          ))}
        </div>

        {error && (
          <div className="text-center text-sm mb-6 text-red-400">
            {error}
          </div>
        )}
        {message && (
          <div className="text-center text-sm mb-6 text-green-400">
            {message}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!isComplete || loading}
          className={`w-full py-3 rounded-lg font-semibold transition-all mb-4 ${
            isComplete && !loading
              ? "bg-white text-gray-900 hover:bg-gray-100"
              : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          onClick={handleResend}
          disabled={resending || loading}
          className={`w-full py-2.5 rounded-lg font-medium transition-all text-sm ${
            resending || loading
              ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
              : "bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 border border-gray-700/50"
          }`}
        >
          {resending ? "Sending..." : "Resend Code"}
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-brown-700/50"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-brown-700/50"></div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-pink-400 text-sm hover:underline"
          >
            Back to Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
