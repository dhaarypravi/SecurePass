import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Secure Vault
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your privacy-first password manager
        </p>
        <div className="space-x-4">
          <Link 
            href="/auth/signup" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link 
            href="/auth/signin" 
            className="text-black border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}