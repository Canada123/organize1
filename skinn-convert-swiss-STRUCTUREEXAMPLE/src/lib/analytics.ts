/**
 * Analytics utilities for tracking page views, events and conversions
 */

import { hasConsent } from './consentManager';

type EventParams = Record<string, string | number | boolean>;

/**
 * Track a page view in GA4 and HubSpot
 * @param url The URL of the page being viewed
 * @param title The title of the page
 * @param params Additional parameters to track with the page view
 */
export function trackPageView(
  url: string,
  title: string, 
  params?: EventParams
) {
  // Google Analytics 4 page view tracking
  if (hasConsent('analytics')) {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: title,
          page_location: url,
          ...params
        });
  // Console statement removed by ESLint fix
      }
    } catch (error) {
      console.error('[Analytics] Error tracking page view:', error);
    }
  }

  // HubSpot page view tracking happens automatically via their script if loaded
}

/**
 * Track a custom event in GA4 and HubSpot
 * @param eventName Name of the event
 * @param params Additional parameters to track with the event
 */
export function trackEvent(eventName: string, params?: EventParams) {
  // Google Analytics 4 event tracking
  if (hasConsent('analytics')) {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
  // Console statement removed by ESLint fix
      }
    } catch (error) {
      console.error(`[Analytics] Error tracking event ${eventName}:`, error);
    }
  }

  // HubSpot event tracking
  if (hasConsent('marketing')) {
    try {
      if (typeof window !== 'undefined' && window._hsq) {
        window._hsq.push(['trackEvent', { 
          id: eventName,
          value: params 
        }]);
      }
    } catch (error) {
      console.error(`[Analytics] Error tracking HubSpot event ${eventName}:`, error);
    }
  }
}

/**
 * Track a conversion event for Google Ads
 * @param conversionId The Google Ads conversion ID
 * @param conversionLabel The Google Ads conversion label
 * @param value Optional conversion value
 */
export function trackConversion(
  conversionId: string,
  conversionLabel: string,
  value?: number
) {
  // Only track conversions if we have marketing consent
  if (hasConsent('marketing')) {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: `${conversionId}/${conversionLabel}`,
          value: value,
          currency: 'CHF',
        });
  // Console statement removed by ESLint fix
      }
    } catch (error) {
      console.error('[Analytics] Error tracking conversion:', error);
    }
  }
}

/**
 * Get UTM parameters from URL
 * @returns Object containing UTM parameters
 */
export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    const value = params.get(param);
    if (value) utmParams[param] = value;
  });
  
  return utmParams;
}

/**
 * Store UTM parameters in localStorage for later use
 */
export function storeUtmParams() {
  if (typeof window === 'undefined') return;
  
  const utmParams = getUtmParams();
  if (Object.keys(utmParams).length > 0) {
    localStorage.setItem('skiin_utm_params', JSON.stringify(utmParams));
  // Console statement removed by ESLint fix
  }
}

/**
 * Get stored UTM parameters from localStorage
 */
export function getStoredUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('skiin_utm_params');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('[Analytics] Error retrieving UTM params:', error);
    return {};
  }
}

/**
 * Identify user in HubSpot
 * @param email User's email address
 * @param properties Additional user properties
 */
export function identifyUserInHubSpot(
  email: string, 
  properties: Record<string, unknown> = {}
) {
  // Only identify if we have marketing consent
  if (hasConsent('marketing')) {
    try {
      if (typeof window !== 'undefined' && window._hsq) {
        window._hsq.push(['identify', {
          email: email,
          ...properties
        }]);
  // Console statement removed by ESLint fix
      }
    } catch (error) {
      console.error('[Analytics] Error identifying user in HubSpot:', error);
    }
  }
}
