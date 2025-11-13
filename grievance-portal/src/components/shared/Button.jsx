import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-[#2563eb] text-white hover:bg-[#1e4af] focus:ring-[#2563eb] disabled:bg-[#2563eb]/50',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100',
    success: 'bg-[#10b981] text-white hover:bg-green-600 focus:ring-[#10b981] disabled:bg-[#10b981]/50',
    danger: 'bg-[#ef4444] text-white hover:bg-red-600 focus:ring-[#ef4444] disabled:bg-[#ef4444]/50',
    outline: 'border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white focus:ring-[#2563eb]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${
        disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;