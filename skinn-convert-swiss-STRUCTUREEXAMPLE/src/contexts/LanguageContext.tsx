
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define supported languages
type LanguageType = 'en' | 'de' | 'fr' | 'it';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

/**
 * Context for managing the current language throughout the application
 * Provides the current language and a function to change it
 */
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

/**
 * Provider component for language management
 * - Initializes language based on browser preferences or stored preference
 * - Stores language choice in localStorage
 * - Makes language state available to all child components
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('en');

  useEffect(() => {
    // Get language from localStorage, default to English
    const savedLanguage = localStorage.getItem('myant-language');
    if (savedLanguage && ['en', 'de', 'fr', 'it'].includes(savedLanguage)) {
      setLanguage(savedLanguage as LanguageType);
    }
    // Always default to English unless explicitly saved
  }, []);

  /**
   * Updates the current language and stores it in localStorage
   * @param lang - The language code to set ('en', 'de', or 'fr')
   */
  const handleSetLanguage = (lang: LanguageType) => {
    setLanguage(lang);
    localStorage.setItem('myant-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access the current language and language setter function
 * @returns The language context with current language and setter function
 */
export const useLanguage = () => useContext(LanguageContext);
