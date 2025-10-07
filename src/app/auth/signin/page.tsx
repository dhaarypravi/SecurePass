'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define the error type
type SignInError = 
  | '2FA_REQUIRED' 
  | 'INVALID_2FA_CODE' 
  | 'Invalid credentials' 
  | 'Something went wrong' 
  | '';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [error, setError] = useState<SignInError>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        twoFactorCode: show2FA ? twoFactorCode : undefined,
        redirect: false,
      });

      if (result?.error === '2FA_REQUIRED') {
        setShow2FA(true);
        setError('');
      } else if (result?.error === 'INVALID_2FA_CODE') {
        setError('INVALID_2FA_CODE');
      } else if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message === '2FA_REQUIRED') {
        setShow2FA(true);
        setError('');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorType: SignInError): string => {
    switch (errorType) {
      case '2FA_REQUIRED':
        return 'Two-factor authentication is required';
      case 'INVALID_2FA_CODE':
        return 'Invalid 2FA code. Please try again.';
      case 'Invalid credentials':
        return 'Invalid email or password';
      case 'Something went wrong':
        return 'Something went wrong. Please try again.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{getErrorMessage(error)}</p>
          </div>
        )}

        {show2FA && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Two-factor authentication is enabled. Please enter your 6-digit code.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!show2FA ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                2FA Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={twoFactorCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Enter the code from your authenticator app
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading 
              ? (show2FA ? 'Verifying...' : 'Signing In...') 
              : (show2FA ? 'Verify & Sign In' : 'Sign In')
            }
          </button>
        </form>

        {show2FA && (
          <button
            onClick={() => {
              setShow2FA(false);
              setTwoFactorCode('');
              setError('');
            }}
            className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to email/password
          </button>
        )}
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}