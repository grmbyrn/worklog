"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-800 text-white py-4 px-12 flex justify-between items-center">
        {session ? (
            <div className="flex gap-6">
                <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
                <Link href="/clients" className="hover:text-slate-300">Clients</Link>
                <Link href="/timer" className="hover:text-slate-300">Timer</Link>
                <Link href="/invoices" className="hover:text-slate-300">Invoices</Link>
            </div>
        ) : (
            <div className="flex gap-6">
                <Link href="/" className="hover:text-slate-300">Home</Link>
            </div>
        )}

      <div className="flex items-center gap-4">
        {session?.user?.email && (
          <span className="text-slate-300">{session.user.email}</span>
        )}
        {session ? (
          <button
            onClick={() => signOut({callbackUrl: '/'})}
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
    </nav>
  );
}