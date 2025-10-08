'use client';

import { useState } from 'react';
// Remove unused session import
// import { useSession } from 'next-auth/react';

interface MasterPasswordSetupProps {
  onSetupComplete: () => void;
}

export default function MasterPasswordSetup({ onSetupComplete }: MasterPasswordSetupProps) {
  // Remove unused session
  // const { data: session } = useSession();
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (masterPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (masterPassword.length < 8) {
      alert('Master password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // For now, we'll just store a flag that master password is set
      localStorage.setItem('hasMasterPassword', 'true');
      onSetupComplete();
    } catch (caughtError) {
      console.error('Master password setup error:', caughtError);
      alert('Failed to setup master password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Setup Master Password</h2>
        <p className="text-gray-600 mb-6">
          Your master password encrypts all your vault data. You&apos;ll need it to access your passwords.
        </p>
        
        {/* Rest of the component remains the same */}
        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Master Password
            </label>
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Master Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Setting Up...' : 'Setup Master Password'}
          </button>
        </form>
      </div>
    </div>
  );
}