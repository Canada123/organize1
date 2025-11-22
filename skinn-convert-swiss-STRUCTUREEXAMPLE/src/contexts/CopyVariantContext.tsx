import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CopyVariant } from '@/components/ui/copy-variant-selector';

interface CopyVariantContextType {
  currentVariant: CopyVariant;
  setVariant: (variant: CopyVariant) => void;
}

const CopyVariantContext = createContext<CopyVariantContextType | undefined>(undefined);

export const CopyVariantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentVariant, setCurrentVariant] = useState<CopyVariant>('benefit-led');

  useEffect(() => {
    const savedVariant = localStorage.getItem('copy-variant') as CopyVariant;
    if (savedVariant && ['benefit-led', 'clinical', 'urgency'].includes(savedVariant)) {
      setCurrentVariant(savedVariant);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('copy-variant', currentVariant);
  }, [currentVariant]);

  const setVariant = (variant: CopyVariant) => {
    setCurrentVariant(variant);
  };

  return (
    <CopyVariantContext.Provider value={{
      currentVariant,
      setVariant
    }}>
      {children}
    </CopyVariantContext.Provider>
  );
};

export const useCopyVariant = () => {
  const context = useContext(CopyVariantContext);
  if (context === undefined) {
    throw new Error('useCopyVariant must be used within a CopyVariantProvider');
  }
  return context;
};