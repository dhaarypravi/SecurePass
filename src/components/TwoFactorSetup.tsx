'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 'setup') {
      generate2FASecret();
    }
  }, [step]);

  const generate2FASecret = async () => {
    try {
      const response = await fetch('/api/auth/2fa/generate');
      const data = await response.json();
      
      if (response.ok) {
        setSecret(data.secret);
        setQrCode(data.qrCode);
      } else {
        setError('Failed to generate 2FA secret');
      }
    } catch (error) {
      setError('Failed to generate 2FA secret');
    }
  };

  const verify2FACode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        // Enable 2FA for the user
        await fetch('/api/auth/2fa/enable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ secret }),
        });

        onComplete();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {step === 'setup' ? 'Setup Two-Factor Authentication' : 'Verify 2FA Code'}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {step === 'setup' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            
            {qrCode && (
              <div className="flex justify-center">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-1">Manual entry secret:</p>
              <code className="text-sm bg-white p-2 rounded border block overflow-x-auto">
                {secret}
              </code>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Continue to Verification
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Enter the 6-digit code from your authenticator app to verify setup.
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />

            <div className="flex space-x-2">
              <button
                onClick={() => setStep('setup')}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={verify2FACode}
                disabled={verificationCode.length !== 6 || loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onCancel}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm"
        >
          Cancel Setup
        </button>
      </div>
    </div>
  );
}