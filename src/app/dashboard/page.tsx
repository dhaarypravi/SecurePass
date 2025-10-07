'use client';

import { useState } from 'react';
import PasswordGenerator from '@/components/PasswordGenerator';
import Vault from '@/components/VaultList';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'generator' | 'vault'>('generator');

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('generator')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'generator'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Password Generator
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vault'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Vault
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'generator' && <PasswordGenerator />}
      {activeTab === 'vault' && <Vault />}
    </div>
  );
}