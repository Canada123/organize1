import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemePalette = 'sw-design' | 'original' | 'professional-teal' | 'swiss-innovation' | 'soft-blue-teal' | 'myant-violet';

interface ThemeContextType {
  currentTheme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
  themes: {
    [key in ThemePalette]: {
      name: string;
      description: string;
      personality: string;
    };
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeDefinitions = {
  'sw-design': {
    name: 'S&W Design',
    description: 'Modern benefit-led design with streamlined colors',
    personality: 'Clear, focused, action-oriented with zero friction'
  },
  'original': {
    name: 'Original',
    description: 'Clinical credibility and trust',
    personality: 'Professional, trustworthy, medical-grade precision'
  },
  'professional-teal': {
    name: 'Professional Teal',
    description: 'Modern healthcare innovation',
    personality: 'Innovative, balanced, approachable healthcare'
  },
  'swiss-innovation': {
    name: 'Swiss Innovation',
    description: 'Precision and heritage quality',
    personality: 'Premium, precise, traditional Swiss excellence'
  },
  'soft-blue-teal': {
    name: 'Soft Blue-Teal',
    description: 'Gentle wellness approach',
    personality: 'Calm, approachable, wellness-focused care'
  },
  'myant-violet': {
    name: 'Myant Violet',
    description: 'Bold innovation with violet accents',
    personality: 'Cutting-edge, sophisticated, luxurious technology'
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemePalette>('sw-design');

  useEffect(() => {
    const savedTheme = localStorage.getItem('myant-theme') as ThemePalette;
    if (savedTheme && themeDefinitions[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('myant-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemePalette) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      themes: themeDefinitions
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};