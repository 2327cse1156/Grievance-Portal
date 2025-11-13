import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-[#ef4444]">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-[#ef4444] focus:ring-[#ef4444]' : 'border-gray-300'}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
};

export default Input;