'use client'

import React, {useState} from 'react';
import { fetchUsers } from '@/app/lib/apiDashboard';

interface LoginProps {
    onLogin: (username: string) => void;
}

export default function Login({ onLogin } : LoginProps) {
    const [username, setUsername] = useState('');
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

    const handleSumbit = async (event : React.FormEvent) => {
        // stops form from reloading the page
        event.preventDefault();
        try {
            if (username.trim() !== '') {
                console.log("here");
                if (username.trim()) {
                    const users = await fetchUsers();
                    const userExist = users.some((user: { userName: string; }) => user.userName === username.trim())
                    if (userExist) {
                        setLoggedInUser(username.trim());
                        onLogin(username.trim());
                        alert(`Welcome, ${username.trim()}`);
                    }
                    else {
                        alert(`Invalid username : ${username}`);
                    }
                }
            }
        } catch (error) {
            console.log(`Error fetching users: `, {error});
            alert(`An error occurred whilce checking usename! ${error}`);
        }
    };

    if (loggedInUser) {
        return (<h1 className='text-3xl text-yellow-400'>Welcome, {loggedInUser}</h1>);
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
          <form onSubmit={handleSumbit} className="flex flex-col gap-4 w-64 bg-black/50 p-6 rounded-lg shadow-lg">
            <label htmlFor="username" className="text-white font-bold">
              Enter your username:
            </label>
      
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="px-3 py-2 rounded border text-white font-bold border-gray-600"
              autoFocus
            />
      
            <button
              type="submit"
              className="bg-yellow-400  font-bold py-2 rounded hover:bg-yellow-600"
            >
              Login
            </button>
          </form>
        </div>
      );
}