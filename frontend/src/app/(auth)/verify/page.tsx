'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserEmail } from '@/context/UserEmailContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail } = useUserEmail();


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

      if (res.ok) {
        setMessage('Email verified successfully!');
        setTimeout(() => router.push('/protected'),500);
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid code. Try again.');
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
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setMessage('New code sent to your email!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to resend the code.');
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
