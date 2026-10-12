import React from 'react';

interface BrandLogoProps {
  variant?: 'icon' | 'wordmark' | 'full' | 'lockup';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDark?: boolean;
  className?: string;
}

export const BrandIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="KthTry Icon"
  >
    {/* Base container */}
    <rect width="64" height="64" rx="14" fill="#1D1A39" />
    
    {/* Subtle warm glow behind target node */}
    <circle cx="43" cy="19" r="12" fill="#F39F5A" opacity="0.25" />
    
    {/* Stem of 'k' */}
    <line x1="20" y1="14" x2="20" y2="50" stroke="#FFFDFC" strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="20" cy="14" r="3" fill="#E8BCB9" />
    <circle cx="20" cy="50" r="3" fill="#E8BCB9" />

    {/* Central attempt vertex (origin of attempts) */}
    <circle cx="20" cy="33" r="3" fill="#FFFDFC" />

    {/* Ascending branch to k-th attempt (target solution) */}
    <line x1="20" y1="33" x2="42" y2="18" stroke="#F39F5A" strokeWidth="4" strokeLinecap="round" />

    {/* Downward branch (previous attempt / baseline) */}
    <line x1="20" y1="33" x2="40" y2="48" stroke="#AE445A" strokeWidth="4" strokeLinecap="round" />

    {/* Attempt node (Berry) */}
    <circle cx="40" cy="48" r="4.5" fill="#AE445A" stroke="#1D1A39" strokeWidth="1.5" />

    {/* Victorious k-th node (Sunset orange) */}
    <circle cx="42" cy="18" r="6" fill="#F39F5A" stroke="#FFFDFC" strokeWidth="2" />
    <circle cx="42" cy="18" r="2.5" fill="#1D1A39" />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  isDark = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 52,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  const currentIconSize = iconSizes[size];
  const primaryTextColor = isDark ? 'text-[#F7F5F9]' : 'text-[#1D1A39]';
  const taglineColor = isDark ? 'text-[#ADA0B5]' : 'text-[#7E6C7C]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {(variant === 'icon' || variant === 'full' || variant === 'lockup') && (
        <BrandIcon size={currentIconSize} />
      )}

      {(variant === 'wordmark' || variant === 'full' || variant === 'lockup') && (
        <div className="flex flex-col">
          <div className="flex items-baseline tracking-tight">
            <span className={`font-display font-bold ${textSizes[size]} ${primaryTextColor}`}>
              kth
            </span>
            <span className={`font-mono font-medium mx-0.5 text-[#F39F5A] ${textSizes[size]}`}>
              /
            </span>
            <span className={`font-display font-semibold ${textSizes[size]} ${isDark ? 'text-[#E8BCB9]' : 'text-[#451952]'}`}>
              try
            </span>
          </div>

          {variant === 'lockup' && (
            <span className={`font-display font-medium ${taglineSizes[size]} ${taglineColor} -mt-0.5 tracking-wide`}>
              Just one more problem.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
