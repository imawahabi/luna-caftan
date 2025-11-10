'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isRTL: boolean;
  isChangingLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const stored = localStorage.getItem('language');
    const savedLang = stored === 'ar' || stored === 'en' ? stored : 'en';

    if (savedLang !== language) {
      setLanguage(savedLang);
    }

    i18n.changeLanguage(savedLang);
    localStorage.setItem('language', savedLang);
  }, [i18n, language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = async () => {
    if (isChangingLanguage) return; // Prevent multiple clicks during transition
    
    setIsChangingLanguage(true);
    
    // Start fade out
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    document.body.style.opacity = '0';
    
    // Wait for fade out to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Change language
    const newLang: Language = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    
    // Wait a bit for language to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Fade back in
    document.body.style.opacity = '1';
    
    // Wait for fade in to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsChangingLanguage(false);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        isRTL: language === 'ar',
        isChangingLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
