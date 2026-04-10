'use client';

import { signIn } from 'next-auth/react';
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Worklog</h1>
        <p className="text-center text-slate-600 mb-8">Track your billable hours</p>
        <div className='flex gap-4'>
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <FaGithub />
            Sign up with GitHub
          </button>
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <FaGoogle />
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}
