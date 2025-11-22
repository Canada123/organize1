
/**
 * Cookie consent management utilities
 */

export type ConsentPreferences = {
  necessary: boolean;  // Always true, needed for functionality
  analytics: boolean;  // Google Analytics, etc.
  marketing: boolean;  // Google Ads, HubSpot tracking
};

const CONSENT_STORAGE_KEY = 'skiin_cookie_consent';

/**
 * Save user consent preferences to localStorage
 */
export function saveConsentPreferences(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
  // Console statement removed by ESLint fix
  } catch (error) {
    console.error('[Consent] Error saving preferences:', error);
  }
}

/**
 * Get user consent preferences from localStorage
 * Returns null if no preferences have been saved
 */
export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!storedConsent) return null;
    
    return JSON.parse(storedConsent) as ConsentPreferences;
  } catch (error) {
    console.error('[Consent] Error retrieving preferences:', error);
    return null;
  }
}

/**
 * Check if user has given consent for a specific category
 */
export function hasConsent(category: keyof ConsentPreferences): boolean {
  const preferences = getConsentPreferences();
  if (!preferences) return false;
  return preferences[category] === true;
}

/**
 * Check if user has made any consent choice
 */
export function hasConsentChoice(): boolean {
  return getConsentPreferences() !== null;
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  saveConsentPreferences({
    necessary: true,
    analytics: true,
    marketing: true
  });
}

/**
 * Accept only necessary cookies
 */
export function acceptNecessaryCookies(): void {
  saveConsentPreferences({
    necessary: true,
    analytics: false,
    marketing: false
  });
}

/**
 * Update specific consent categories
 */
export function updateConsentPreferences(preferences: Partial<ConsentPreferences>): void {
  const currentPreferences = getConsentPreferences() || { 
    necessary: true, 
    analytics: false, 
    marketing: false 
  };
  
  saveConsentPreferences({
    ...currentPreferences,
    ...preferences,
    necessary: true // Always keep necessary cookies
  });
}
