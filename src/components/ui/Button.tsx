import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'aubergine' | 'berry' | 'sunset' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 h-7',
    sm: 'text-xs px-3 py-1.5 gap-2 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-2.5 gap-2.5 h-12',
  };

  const variantClasses = {
    primary:
      'bg-[#1D1A39] text-white hover:bg-[#2F2959] focus:ring-[#1D1A39] shadow-xs hover:shadow',
    secondary:
      'bg-[#FAF7F6] text-[#1D1A39] border border-[#E2D6D4] hover:bg-[#F3ECE9] focus:ring-[#451952]',
    aubergine:
      'bg-[#451952] text-white hover:bg-[#5C236D] focus:ring-[#451952] shadow-xs',
    berry:
      'bg-[#AE445A] text-white hover:bg-[#C2516A] focus:ring-[#AE445A] shadow-xs',
    sunset:
      'bg-[#F39F5A] text-[#1D1A39] font-semibold hover:bg-[#F5AB6F] focus:ring-[#F39F5A] shadow-xs',
    outline:
      'bg-transparent border border-[#E2D6D4] text-[#1D1A39] hover:bg-[#FAF7F6] hover:border-[#C8B6B4] focus:ring-[#1D1A39]',
    ghost:
      'bg-transparent text-[#574459] hover:bg-[#FAF7F6] hover:text-[#1D1A39] focus:ring-[#451952]',
    danger:
      'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#DC2626] shadow-xs',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};
