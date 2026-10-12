// ====================================================================
// KthTry — Language Switcher Component
// Polished interactive language selector for Java, C++, and Python
// ====================================================================

import React from 'react';
import { useLanguage, SupportedLanguage } from '../../services/LanguageContext';
import { Code2 } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'pills' | 'cards';
  className?: string;
}

const LANGUAGES: { id: SupportedLanguage; label: string; badge: string; description: string }[] = [
  { id: 'Java', label: 'Java', badge: 'JDK 21', description: 'Collections Framework, OOP, High-Yield Placements' },
  { id: 'C++', label: 'C++', badge: 'C++20 STL', description: 'Standard Template Library, Pointers, Speed & CP' },
  { id: 'Python', label: 'Python', badge: 'Python 3.12', description: 'Built-in Collections, heapq, bisect, Clean SDE Syntax' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'compact', className = '' }) => {
  const { activeLanguage, setLanguage } = useLanguage();

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
        {LANGUAGES.map((lang) => {
          const isSelected = activeLanguage === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => setLanguage(lang.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#451952] bg-[#FAF7F6] ring-2 ring-[#451952]/20 shadow-xs'
                  : 'border-[#E2D6D4] bg-[#FFFDFC] hover:border-[#C8B6B4] hover:bg-[#FAF7F6]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-base text-[#1D1A39]">{lang.label}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#E2D6D4] text-[#AE445A]">
                  {lang.badge}
                </span>
              </div>
              <p className="text-xs text-[#7E6C7C] mt-2 leading-relaxed">{lang.description}</p>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact Pill Switcher (Default for Topbar and Navigation)
  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-[#FAF7F6] border border-[#E2D6D4] rounded-xl text-xs font-semibold select-none ${className}`}
      role="group"
      aria-label="Select Programming Language Track"
    >
      <div className="flex items-center gap-1 px-1.5 text-[#AE445A] hidden sm:flex">
        <Code2 className="w-3.5 h-3.5" />
      </div>
      {LANGUAGES.map((lang) => {
        const isSelected = activeLanguage === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => setLanguage(lang.id)}
            className={`px-2.5 py-1 rounded-lg transition-all text-xs font-bold ${
              isSelected
                ? 'bg-[#1D1A39] text-[#FFFDFC] shadow-xs'
                : 'text-[#574459] hover:text-[#1D1A39] hover:bg-[#F3ECE9]'
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};
