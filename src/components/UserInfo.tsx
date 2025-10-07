'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import UserSettings from './UserSettings';

export default function UserInfo() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-24 rounded"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      <UserSettings />
      <span className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
        Welcome, {session.user?.email}
      </span>
      <button 
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-colors duration-200"
      >
        Sign Out
      </button>
    </div>
  );
}