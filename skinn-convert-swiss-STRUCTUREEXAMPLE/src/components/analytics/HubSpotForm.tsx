
import React, { useEffect, useRef } from 'react';
import { getStoredUtmParams } from '@/lib/analytics';
import { hasConsent } from '@/lib/consentManager';

interface HubSpotFormProps {
  formId: string;
  portalId: string;
  className?: string;
  onFormSubmit?: (data: any) => void;
  region?: string;
}

export default function HubSpotForm({
  formId,
  portalId,
  className = '',
  onFormSubmit,
  region = 'eu1'
}: HubSpotFormProps) {
  const formContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Function to check if HubSpot script is ready
    const checkHubspotReady = () => {
      if (window.hbspt) {
        createForm();
      } else {
        // If not ready, check again in 500ms
        setTimeout(checkHubspotReady, 500);
      }
    };
    
    const createForm = () => {
      const utmParams = getStoredUtmParams();
      
      if (formContainerRef.current) {
        // Get HubSpot user token cookie if available
        const getHubSpotUtk = () => {
          const cookies = document.cookie.split(';');
          let hubspotUtk = '';
          
          cookies.forEach(cookie => {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie.startsWith('hubspotutk=')) {
              hubspotUtk = trimmedCookie.substring('hubspotutk='.length);
            }
          });
          
          return hubspotUtk;
        };
        
        const formOptions: any = {
          region,
          portalId,
          formId,
          target: `#${formContainerRef.current.id}`,
          formInstanceId: `form-${formId}`,
          inlineMessage: true,
          onFormSubmit: (data: any) => {
            if (onFormSubmit) onFormSubmit(data);
          },
          onFormReady: (form: any) => {
            // Add UTM parameters as hidden fields
            Object.entries(utmParams).forEach(([key, value]) => {
              const hiddenField = document.createElement('input');
              hiddenField.type = 'hidden';
              hiddenField.name = key;
              hiddenField.value = value as string;
              form.appendChild(hiddenField);
            });
          }
        };
        
        // Only add tracking fields if we have marketing consent
        if (hasConsent('marketing')) {
          const hubspotUtk = getHubSpotUtk();
          if (hubspotUtk) {
            formOptions.hutk = hubspotUtk; // Add the HubSpot user token for tracking
          }
        }
        
        window.hbspt.forms.create(formOptions);
      }
    };
    
    // Start checking for HubSpot script
    checkHubspotReady();
    
    return () => {
      // Clean up the form when component unmounts
      if (formContainerRef.current) {
        formContainerRef.current.innerHTML = '';
      }
    };
  }, [formId, portalId, onFormSubmit, region]);

  const uniqueId = `hubspot-form-${formId}`;
  
  return (
    <div id={uniqueId} ref={formContainerRef} className={className}>
      <div className="text-center p-4">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="h-5 w-5 bg-primary/20 rounded-full"></div>
          <div className="h-5 w-5 bg-primary/30 rounded-full"></div>
          <div className="h-5 w-5 bg-primary/40 rounded-full"></div>
        </div>
        <p className="text-muted-foreground mt-2">Loading form...</p>
      </div>
    </div>
  );
}
