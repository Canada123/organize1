
import React, { useEffect } from 'react';
import { hasConsent } from '@/lib/consentManager';

interface AnalyticsScriptsProps {
  googleAnalyticsId?: string;
  googleAdsId?: string;
  hubspotId?: string;
  respectConsent?: boolean;
}

/**
 * Loads third-party analytics scripts (GTM, GA4, HubSpot) based on the user's
 * consent settings. Should be rendered once at the root of the application.
 */
export default function AnalyticsScripts({
  googleAnalyticsId = "G-XXXXXXXXXX", // Replace with actual GA4 measurement ID
  googleAdsId = "AW-XXXXXXXXXX", // Replace with actual Google Ads ID
  hubspotId = "XXXXXXXX", // Replace with actual HubSpot tracking code
  respectConsent = true // Set to false to bypass consent (e.g., for necessary scripts only)
}: AnalyticsScriptsProps) {

  useEffect(() => {
    // If we don't need to respect consent or if analytics consent is given, load Google analytics
    const loadGoogleAnalytics = !respectConsent || hasConsent('analytics');
    // If we don't need to respect consent or if marketing consent is given, load marketing scripts
    const loadMarketing = !respectConsent || hasConsent('marketing');

    // Google Tag Manager
    if (loadAnalytics()) {
      const injectGTMScript = () => {
        if (document.getElementById("gtm-script")) return;
        
        const script = document.createElement('script');
        script.id = "gtm-script";
        script.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXX'); // Replace with actual GTM ID
        `;
        document.head.appendChild(script);
      };
      injectGTMScript();
    }

    // Google Analytics 4 (only when analytics consent given)
    if (loadAnalytics()) {
      const injectGA4Script = () => {
        if (document.getElementById("ga4-script")) return;
        
        const script = document.createElement('script');
        script.id = "ga4-script";
        script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
        script.async = true;
        document.head.appendChild(script);
        
        const configScript = document.createElement('script');
        configScript.id = "ga4-config";
        configScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsId}', {
            page_path: window.location.pathname,
            cookie_flags: 'SameSite=None; Secure'
          });
          ${loadMarketing ? `gtag('config', '${googleAdsId}');` : ''}
        `;
        document.head.appendChild(configScript);
      };
      injectGA4Script();
    }

    // HubSpot Tracking (only when marketing consent given)
    if (loadMarketing) {
      const injectHubspotScript = () => {
        if (document.getElementById("hubspot-script")) return;
        
        const script = document.createElement('script');
        script.id = "hubspot-script";
        script.innerHTML = `
          (function(d,s,i,r) {
            if (d.getElementById(i)){return;}
            var n=d.createElement(s),e=d.getElementsByTagName(s)[0];
            n.id=i;n.src='//js.hs-scripts.com/${hubspotId}.js';
            e.parentNode.insertBefore(n,e);
          })(document,"script","hs-script");
        `;
        document.head.appendChild(script);
      };
      injectHubspotScript();
    }

    // HubSpot Forms (always load for forms to work, but tracking will respect consent)
    const injectHubspotFormsScript = () => {
      if (document.getElementById("hubspot-forms")) return;
      
      const script = document.createElement('script');
      script.id = "hubspot-forms";
      script.src = "//js.hsforms.net/forms/embed/v2.js";
      script.async = true;
      document.head.appendChild(script);
    };
    injectHubspotFormsScript();

    // Helper function to determine if analytics scripts should be loaded
    function loadAnalytics() {
      return !respectConsent || hasConsent('analytics');
    }

    // Clean up function
    return () => {
      // We don't remove scripts on cleanup as they should persist,
      // and removing them could cause issues with tracking continuity
    };
  }, [googleAnalyticsId, googleAdsId, hubspotId, respectConsent]);

  return (
    <>
      {/* Google Tag Manager noscript (for when JavaScript is disabled) */}
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" 
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
