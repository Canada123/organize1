import React, { useState } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductBenefitAccordionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  index?: number;
}

/**
 * Mobile-optimized accordion version of ProductBenefit
 * Used for touch devices where hover isn't available
 */
export function ProductBenefitAccordion({ 
  icon: Icon, 
  title, 
  description, 
  isOpen,
  onToggle,
  index = 0
}: ProductBenefitAccordionProps) {
  return (
    <div 
      className={cn(
        "border rounded-lg transition-all duration-300",
        "bg-gradient-to-br from-background to-secondary/5",
        isOpen ? "border-medical-teal shadow-lg" : "border-border"
      )}
      data-testid={`product-benefit-accordion-${index + 1}`}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-4 text-left hover:bg-secondary/5 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`benefit-content-${index}`}
      >
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 rounded-full bg-medical-teal/10 flex items-center justify-center flex-shrink-0 transition-all duration-300",
          isOpen && "bg-medical-teal/20 scale-110"
        )}>
          <Icon className={cn(
            "w-5 h-5 text-medical-teal transition-transform duration-300",
            isOpen && "scale-110"
          )} />
        </div>
        
        {/* Title and chevron */}
        <div className="flex-1">
          <h3 className="font-semibold text-base leading-tight pr-2">
            {title}
          </h3>
        </div>
        
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
          isOpen && "rotate-180 text-medical-teal"
        )} />
      </button>
      
      {/* Expandable content */}
      <div 
        id={`benefit-content-${index}`}
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-40" : "max-h-0"
        )}
      >
        <p className="px-4 pb-4 pl-16 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}