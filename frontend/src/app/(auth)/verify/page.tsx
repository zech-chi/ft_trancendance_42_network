'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserEmail } from '@/context/UserEmailContext';
import { useLoggedUserName } from '@/context/LoggedUserNameContext';
import { useSelectedUserName } from '@/context/SelectedUserNameContext';
import { useSelectedUserId } from '@/context/SelectedUserId';
import { useLoggedUserId } from '@/context/UserIdContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail } = useUserEmail();
  const { setLoggedUserName } = useLoggedUserName();
  const { setSelectedUserName } = useSelectedUserName();
  const { setSelectedUserId } = useSelectedUserId();
  const { setLoggedUserId } = useLoggedUserId();

  const handleVerify = async () => {
    if (code.trim().length < 6) {
      setError('Please enter the 6–8 digit code.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`http://localhost:5001/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code , email: userEmail }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setMessage('Email verified successfully!');
        setLoggedUserName(data.user.userName);
          setSelectedUserName(data.user.userName);
          setSelectedUserId(data.user.id);
          setLoggedUserId(data.user.id);
          router.push("/protected");

        // setTimeout(() => router.push('/login'), 0);
      } else {
        setError(data.error || data.message || 'Verification failed.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`http://localhost:5001/api/auth/resend-code`, {
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
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px]">
        <h1 className="text-2xl font-bold text-center mb-4">Verify your email</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6–8 digit code we sent to your email.
        </p>

        <input
          type="text"
          maxLength={8}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter verification code"
        />

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-2 text-center">{message}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <button
          onClick={handleResend}
          disabled={resending}
          className="text-blue-500 text-sm mt-4 hover:underline w-full text-center"
        >
          {resending ? 'Sending...' : 'Resend code'}
        </button>
      </div>
    </div>
  );
}
