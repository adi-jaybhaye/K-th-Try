import React from 'react';

export type PriorityLevel = 'CORE' | 'HIGH VALUE' | 'STRETCH';
export type ProblemStatus = 'GREEN' | 'YELLOW' | 'RED' | 'GREY';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'priority' | 'status' | 'difficulty' | 'tag' | 'neutral' | 'sunset' | 'berry';
  priority?: PriorityLevel;
  status?: ProblemStatus;
  difficulty?: DifficultyLevel;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  priority,
  status,
  difficulty,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded-md font-medium',
    sm: 'text-xs px-2.5 py-0.5 rounded-lg font-medium',
    md: 'text-sm px-3 py-1 rounded-lg font-medium',
  };

  // Status mapping
  if (status || variant === 'status') {
    const s = status || 'GREY';
    const statusMap = {
      GREEN: {
        label: 'Independent',
        styles: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        dot: 'bg-emerald-500',
      },
      YELLOW: {
        label: 'Assisted',
        styles: 'bg-amber-50 text-amber-800 border border-amber-200',
        dot: 'bg-amber-500',
      },
      RED: {
        label: 'Needs work',
        styles: 'bg-rose-50 text-rose-800 border border-rose-200',
        dot: 'bg-rose-500',
      },
      GREY: {
        label: 'Untested',
        styles: 'bg-gray-50 text-gray-700 border border-gray-200',
        dot: 'bg-gray-400',
      },
    };
    const config = statusMap[s];
    return (
      <span className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} ${config.styles} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span>{children || config.label}</span>
      </span>
    );
  }

  // Priority mapping
  if (priority || variant === 'priority') {
    const p = priority || 'CORE';
    const priorityMap = {
      CORE: 'bg-[#451952]/10 text-[#451952] border border-[#451952]/20 font-semibold',
      'HIGH VALUE': 'bg-[#AE445A]/10 text-[#AE445A] border border-[#AE445A]/25 font-semibold',
      STRETCH: 'bg-[#F39F5A]/15 text-[#974C0C] border border-[#F39F5A]/35 font-semibold',
    };
    return (
      <span className={`inline-flex items-center tracking-wide uppercase ${sizeClasses[size]} ${priorityMap[p]} ${className}`}>
        {children || p}
      </span>
    );
  }

  // Difficulty mapping
  if (difficulty || variant === 'difficulty') {
    const d = difficulty || 'Medium';
    const diffMap = {
      Easy: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      Medium: 'bg-amber-50 text-amber-800 border border-amber-200',
      Hard: 'bg-rose-50 text-rose-800 border border-rose-200',
    };
    return (
      <span className={`inline-flex items-center ${sizeClasses[size]} ${diffMap[d]} ${className}`}>
        {children || d}
      </span>
    );
  }

  const customVariants = {
    tag: 'bg-[#FAF7F6] text-[#574459] border border-[#E2D6D4]',
    neutral: 'bg-gray-100 text-gray-800 border border-gray-200',
    sunset: 'bg-[#F39F5A]/15 text-[#8F470D] border border-[#F39F5A]/30',
    berry: 'bg-[#AE445A]/10 text-[#AE445A] border border-[#AE445A]/25',
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} ${customVariants[variant as keyof typeof customVariants] || customVariants.neutral} ${className}`}>
      {children}
    </span>
  );
};
