import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#1D1A39] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-[#7E6C7C] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#FFFDFC] text-[#1D1A39] border rounded-xl px-3.5 py-2 text-sm transition-colors
              placeholder:text-[#A89CA8]
              focus:outline-none focus:ring-2 focus:ring-[#451952] focus:border-transparent
              disabled:bg-[#FAF7F6] disabled:text-[#7E6C7C] disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-400 focus:ring-red-400' : 'border-[#E2D6D4] hover:border-[#C8B6B4]'}
              ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-[#7E6C7C]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#7E6C7C] mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-[#1D1A39] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full bg-[#FFFDFC] text-[#1D1A39] border rounded-xl px-3.5 py-2.5 text-sm transition-colors
            placeholder:text-[#A89CA8]
            focus:outline-none focus:ring-2 focus:ring-[#451952] focus:border-transparent
            disabled:bg-[#FAF7F6] disabled:text-[#7E6C7C]
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-[#E2D6D4] hover:border-[#C8B6B4]'}
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#7E6C7C] mt-1">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#1D1A39] mb-1.5">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full bg-[#FFFDFC] text-[#1D1A39] border rounded-xl px-3.5 py-2 text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#451952] focus:border-transparent
            ${error ? 'border-red-400' : 'border-[#E2D6D4] hover:border-[#C8B6B4]'}
            ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#7E6C7C] mt-1">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
