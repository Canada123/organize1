
// Global type definitions for analytics scripts

interface Window {
  // Google Analytics / Tag Manager
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  
  // HubSpot
  _hsq?: unknown[];
  hbspt?: {
    forms: {
      create: (options: any) => void;
    };
  };
}
