'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeTest() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`p-4 rounded-lg ${
        theme === 'dark' 
          ? 'bg-gray-800 text-white border border-gray-600' 
          : 'bg-white text-black border border-gray-300'
      }`}>
        <p>Current theme: <strong>{theme}</strong></p>
        <button 
          onClick={toggleTheme}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme
        </button>
        <p className="text-sm mt-2">
          HTML class: <code>{typeof document !== 'undefined' ? document.documentElement.className : 'loading...'}</code>
        </p>
      </div>
    </div>
  );
}