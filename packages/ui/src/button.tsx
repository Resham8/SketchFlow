"use client"
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  type?:"submit" | "reset" | "button";
  isLoading?: boolean;
  showArrow?: boolean;
  children: React.ReactNode;
  onClick?:()=> void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  showArrow = false,
  children,
  className = '',
  disabled,
  type,
  onClick
}) => {
  const baseClasses = "group font-medium border-2 border-gray-900 transition-all duration-200 transform hover:translate-x-1 hover:translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gray-900 text-white hover:bg-white hover:text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    secondary: "bg-white text-gray-900 hover:bg-gray-900 hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    outline: "bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
    type={type}     
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {children}
          {showArrow && (
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          )}
        </>
      )}
    </button>
  );
};