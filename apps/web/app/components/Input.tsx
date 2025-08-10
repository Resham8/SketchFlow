import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2 font-inter">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          className={`w-full px-4 py-3 ${showPasswordToggle || icon ? 'pr-12' : ''} border-2 border-gray-900 focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors transform hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {icon && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 font-light">{error}</p>
      )}
    </div>
  );
};