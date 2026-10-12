// ====================================================================
// KthTry — Multi-Language State & Track Context
// Global persistent active language state across Java, C++, and Python
// ====================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { repository } from './repository';

export type SupportedLanguage = 'Java' | 'C++' | 'Python';

interface LanguageContextType {
  activeLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType>({
  activeLanguage: 'Java',
  setLanguage: async () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLanguage, setActiveLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('kthtry_preferred_language') as SupportedLanguage;
      if (saved === 'Java' || saved === 'C++' || saved === 'Python') {
        return saved;
      }
    } catch {
      // Fallback to default
    }
    return 'Java';
  });

  useEffect(() => {
    repository.getPreferences().then((prefs) => {
      const p = prefs.preferredLanguage;
      if (p === 'Java' || p === 'C++' || p === 'Python') {
        setActiveLanguageState(p as SupportedLanguage);
        localStorage.setItem('kthtry_preferred_language', p);
      }
    });
  }, []);

  const setLanguage = async (newLang: SupportedLanguage) => {
    setActiveLanguageState(newLang);
    localStorage.setItem('kthtry_preferred_language', newLang);
    try {
      const current = await repository.getPreferences();
      await repository.savePreferences({
        ...current,
        preferredLanguage: newLang,
      });
    } catch (err) {
      console.warn('Failed to save preferred language to repository:', err);
    }
  };

  return (
    <LanguageContext.Provider value={{ activeLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
