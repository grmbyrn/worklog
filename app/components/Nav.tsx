'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Nav() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-800 text-white py-4 px-6 flex justify-between items-center relative">
      {/* Logo/Brand */}
      <div className="text-lg font-bold">Worklog</div>

      {/* Hamburger Button (Mobile) */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden flex flex-col gap-1.5">
        <span className="w-6 h-0.5 bg-white"></span>
        <span className="w-6 h-0.5 bg-white"></span>
        <span className="w-6 h-0.5 bg-white"></span>
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center flex-1 ml-12">
        {session ? (
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">
              Dashboard
            </Link>
            <Link href="/clients" className="hover:text-slate-300">
              Clients
            </Link>
            <Link href="/timer" className="hover:text-slate-300">
              Timer
            </Link>
            <Link href="/invoices" className="hover:text-slate-300">
              Invoices
            </Link>
          </div>
        ) : (
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-300">
              Home
            </Link>
          </div>
        )}
      </div>

      {/* Desktop User Menu */}
      <div className="hidden md:flex items-center gap-4 ml-auto">
        {session?.user?.email && <span className="text-slate-300">{session.user.email}</span>}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-700 p-6 flex flex-col gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-slate-300"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/clients"
                className="hover:text-slate-300"
                onClick={() => setIsOpen(false)}
              >
                Clients
              </Link>
              <Link href="/timer" className="hover:text-slate-300" onClick={() => setIsOpen(false)}>
                Timer
              </Link>
              <Link
                href="/invoices"
                className="hover:text-slate-300"
                onClick={() => setIsOpen(false)}
              >
                Invoices
              </Link>
              <hr className="border-slate-600" />
              {session?.user?.email && (
                <span className="text-slate-300 text-sm">{session.user.email}</span>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors w-full"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-slate-300" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
