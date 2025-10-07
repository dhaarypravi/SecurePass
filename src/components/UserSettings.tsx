'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import TwoFactorSetup from './TwoFactorSetup';

export default function UserSettings() {
  const { data: session } = useSession();
  const [showSettings, setShowSettings] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const check2FAStatus = async () => {
    try {
      const response = await fetch('/api/auth/2fa/status');
      if (response.ok) {
        const data = await response.json();
        setIs2FAEnabled(data.enabled);
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const handle2FAComplete = () => {
    setIs2FAEnabled(true);
    setShow2FASetup(false);
    alert('Two-Factor Authentication has been enabled successfully!');
  };

  return (
    <>
      {/* Settings Button - Add to your UserInfo component */}
      <button
        onClick={() => {
          setShowSettings(true);
          check2FAStatus();
        }}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        title="Settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-bold text-gray-800 mb-4">User Settings</h3>
            
            <div className="space-y-4">
              {/* 2FA Section */}
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    is2FAEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  Add an extra layer of security to your account.
                </p>
                
                {!is2FAEnabled ? (
                  <button
                    onClick={() => setShow2FASetup(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Enable 2FA
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Implement disable 2FA functionality
                      alert('2FA disable functionality would go here');
                    }}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 text-sm"
                  >
                    Disable 2FA
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <TwoFactorSetup
          onComplete={handle2FAComplete}
          onCancel={() => setShow2FASetup(false)}
        />
      )}
    </>
  );
}