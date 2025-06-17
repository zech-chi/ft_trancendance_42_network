'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-black/20 text-white flex items-center px-4 z-50">
      <form onSubmit={(e) => e.preventDefault()} className="max-w-xl mx-auto">
        <div className='relative w-full'>
          <input
            type='text'
            placeholder='Search ...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-10 py-2 rounded-full text-[#B2B2B2] outline-none"
            style={{
              background: 'linear-gradient(to right, rgba(47,25,37,0.7) 0%, rgba(72,28,43,0.7) 50%, rgba(100,33,52,0.7) 100%)',
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-[#B2B2B2]" />
        </div>
      </form>
    </nav>            
  );
}
