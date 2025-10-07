'use client';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateStrength = (pwd: string) => {
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    
    return Math.min(score, 5); // Max score of 5
  };

  const strength = calculateStrength(password);
  
  const getStrengthLabel = () => {
    if (password.length === 0) return 'Enter password';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (password.length === 0) return 'bg-gray-200';
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getWidth = () => {
    if (password.length === 0) return '0%';
    return `${(strength / 5) * 100}%`;
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">Password strength:</span>
        <span className={`font-medium ${
          password.length === 0 ? 'text-gray-500' :
          strength <= 2 ? 'text-red-600' :
          strength <= 3 ? 'text-yellow-600' :
          strength <= 4 ? 'text-blue-600' : 'text-green-600'
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: getWidth() }}
        ></div>
      </div>
      
      {/* Strength tips */}
      {password.length > 0 && strength < 5 && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Tips for stronger password:</p>
          <ul className="list-disc list-inside ml-2">
            {password.length < 8 && <li>At least 8 characters</li>}
            {!/[a-z]/.test(password) && <li>Include lowercase letters</li>}
            {!/[A-Z]/.test(password) && <li>Include uppercase letters</li>}
            {!/[0-9]/.test(password) && <li>Include numbers</li>}
            {!/[^a-zA-Z0-9]/.test(password) && <li>Include symbols</li>}
          </ul>
        </div>
      )}
    </div>
  );
}