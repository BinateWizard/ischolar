"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-2xl">iS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-tight">iScholar</span>
              <span className="text-xs text-gray-500">Scholarship Portal</span>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="/apply" className="text-gray-600 hover:text-blue-600 transition-colors">Apply</a>
            <a href="/status" className="text-gray-600 hover:text-blue-600 transition-colors">Status</a>
            {session && (
              <a href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</a>
            )}
            <a href="/faqs" className="text-gray-600 hover:text-blue-600 transition-colors">FAQs</a>
            
            {status !== 'loading' && (
              <>
                {session ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden lg:inline">Sign Out</span>
                  </button>
                ) : (
                  <>
                    <a href="/signup" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Sign Up
                    </a>
                    <a href="/signin" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Sign In
                    </a>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
