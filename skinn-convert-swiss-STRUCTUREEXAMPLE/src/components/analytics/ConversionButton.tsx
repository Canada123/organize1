
import React from 'react';
import { Button, buttonVariants, ButtonProps } from '@/components/ui/button';
import { trackConversion, trackEvent } from '@/lib/analytics';

interface ConversionButtonProps extends ButtonProps {
  conversionId?: string; 
  conversionLabel?: string;
  eventName: string;
  eventValue?: number;
  eventParams?: Record<string, string | number | boolean>;
  href?: string;
  external?: boolean;
}

/**
 * Button component that automatically tracks analytics events and optional
 * Google Ads conversions when clicked. Can render as a link when `href` is
 * provided.
 */
export default function ConversionButton({
  conversionId,
  conversionLabel,
  eventName,
  eventValue,
  eventParams = {},
  href,
  external = false,
  children,
  onClick,
  ...props
}: ConversionButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the event in GA4 and HubSpot
    trackEvent(eventName, {
      value: eventValue,
      ...eventParams
    });
    
    // If Google Ads conversion tracking is provided
    if (conversionId && conversionLabel) {
      trackConversion(conversionId, conversionLabel, eventValue);
    }
    
    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  // If href is provided, render an anchor tag with button styling
  if (href) {
    return (
      <a 
        href={href}
        className={buttonVariants({ variant: props.variant, size: props.size, className: props.className })}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={(e) => {
          // Run tracking logic on anchor click
          trackEvent(eventName, {
            value: eventValue,
            ...eventParams
          });
          
          if (conversionId && conversionLabel) {
            trackConversion(conversionId, conversionLabel, eventValue);
          }
          
          // We don't prevent default as we want the link to work
        }}
      >
        {children}
      </a>
    );
  }
  
  // Otherwise render a regular button
  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
