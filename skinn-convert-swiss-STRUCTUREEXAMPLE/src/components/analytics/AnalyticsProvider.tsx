
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, storeUtmParams } from '@/lib/analytics';
import AnalyticsScripts from './AnalyticsScripts';
import CookieConsent from './CookieConsent';
import { getConsentPreferences, type ConsentPreferences } from '@/lib/consentManager';

interface AnalyticsContextType {
  trackPageView: (url: string, title: string) => void;
  consentPreferences: ConsentPreferences | null;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackPageView: () => {},
  consentPreferences: null,
});

export const useAnalytics = () => useContext(AnalyticsContext);

/**
 * Provider that injects analytics scripts and exposes tracking utilities.
 * Handles cookie consent, page view tracking and UTM parameter persistence.
 */
export function AnalyticsProvider({
  children,
  googleAnalyticsId,
  googleAdsId,
  hubspotId,
}: { 
  children: React.ReactNode;
  googleAnalyticsId?: string;
  googleAdsId?: string;
  hubspotId?: string;
}) {
  const location = useLocation();
  const [consentPreferences, setConsentPreferences] = useState<ConsentPreferences | null>(null);
  
  // Initialize consent from localStorage on mount
  useEffect(() => {
    const storedPreferences = getConsentPreferences();
    if (storedPreferences) {
      setConsentPreferences(storedPreferences);
    }
  }, []);
  
  // Handle consent changes
  const handleConsentChange = (preferences: ConsentPreferences) => {
    setConsentPreferences(preferences);
    
    // If analytics consent was given, track current page
    if (preferences.analytics) {
      const pageTitle = document.title;
      trackPageView(window.location.href, pageTitle);
    }
  };
  
  // Track page views when route changes
  useEffect(() => {
    // Store UTM parameters on initial load
    storeUtmParams();
    
    // Only track page view if we have analytics consent
    if (consentPreferences?.analytics) {
      const pageTitle = document.title;
      trackPageView(window.location.href, pageTitle);
    }
  }, [location, consentPreferences?.analytics]);
  
  // Expose analytics functions to components
  const value = {
    trackPageView: (url: string, title: string) => {
      // Only track if we have consent
      if (consentPreferences?.analytics) {
        trackPageView(url, title);
      }
    },
    consentPreferences
  };

  return (
    <AnalyticsContext.Provider value={value}>
      <AnalyticsScripts
        googleAnalyticsId={googleAnalyticsId}
        googleAdsId={googleAdsId}
        hubspotId={hubspotId}
        respectConsent={true}
      />
      <CookieConsent onConsentChange={handleConsentChange} />
      {children}
    </AnalyticsContext.Provider>
  );
}
