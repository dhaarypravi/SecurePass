'use client';

import { useState, useCallback } from 'react';
import PasswordStrengthMeter from './PasswordStrengthMeter';


export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);

  const generatePassword = useCallback(() => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'il1Lo0O';

    let charset = letters;
    
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    setPassword(newPassword);
  }, [length, includeNumbers, includeSymbols, excludeSimilar]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      alert('Password copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
   <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 transition-colors duration-200">
    Password Generator
  </h2>
      {/* Generated Password Display */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your generated password will appear here"
          />
          
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy
          </button>
          <div>
              <PasswordStrengthMeter password={password} />
          </div>
          <button
            onClick={generatePassword}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Length: {length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include Numbers</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include Symbols</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={(e) => setExcludeSimilar(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Exclude Similar Characters (i, l, 1, L, o, 0, O)</span>
          </label>
        </div>
      </div>
    </div>
  );
}