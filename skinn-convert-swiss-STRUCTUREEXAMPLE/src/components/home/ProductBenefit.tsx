import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductBenefitProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  className?: string;
}

export function ProductBenefit({ 
  icon: Icon, 
  title, 
  description, 
  index = 0,
  className 
}: ProductBenefitProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Create a shortened version of the description
  const createShortDescription = (text: string) => {
    // If text is already short, return as is
    if (text.length <= 60) return text;
    
    // Try to find first sentence
    const firstSentence = text.split('.')[0];
    if (firstSentence && firstSentence.length > 20 && firstSentence.length <= 80) {
      return firstSentence + '.';
    }
    
    // Otherwise, truncate at word boundary around 50 chars
    const truncated = text.substring(0, 50);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  };
  
  const shortDescription = createShortDescription(description);
  const hasMoreContent = description !== shortDescription;
  
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:border-medical-teal",
        "bg-gradient-to-br from-background to-secondary/5",
        "cursor-pointer",
        isExpanded && "ring-2 ring-medical-teal/50",
        className
      )}
      data-testid={`product-benefit-${index + 1}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-6">
        {/* Icon with animated background */}
        <div className="relative mb-4">
          <div className={cn(
            "absolute inset-0 bg-medical-teal/20 rounded-full blur-xl transition-all duration-500",
            isExpanded ? "scale-150 opacity-100" : "scale-100 opacity-50"
          )} />
          <div className={cn(
            "relative w-12 h-12 rounded-full bg-medical-teal/10 flex items-center justify-center transition-all duration-300",
            isExpanded && "bg-medical-teal/20 scale-110"
          )}>
            <Icon className={cn(
              "w-6 h-6 text-medical-teal transition-transform duration-300",
              isExpanded && "scale-110"
            )} />
          </div>
        </div>
        
        {/* Content */}
        <h3 className="font-semibold text-lg mb-2 text-foreground leading-tight">
          {title}
        </h3>
        
        {/* Description with expand/collapse animation */}
        <div className="relative">
          <p className={cn(
            "text-sm text-muted-foreground leading-relaxed transition-all duration-300",
            !isExpanded && "line-clamp-2"
          )}>
            {isExpanded ? description : shortDescription}
          </p>
          
          {/* Expand indicator for mobile */}
          {hasMoreContent && (
            <div className={cn(
              "md:hidden absolute bottom-0 right-0 flex items-center gap-1 text-xs text-medical-teal",
              "transition-opacity duration-300",
              isExpanded ? "opacity-0" : "opacity-100"
            )}>
              <span>More</span>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform duration-300",
                isExpanded && "rotate-180"
              )} />
            </div>
          )}
        </div>
        
        {/* Hover indicator for desktop */}
        <div className={cn(
          "hidden md:block absolute bottom-2 right-2 w-2 h-2 rounded-full bg-medical-teal/30",
          "transition-all duration-300",
          isExpanded ? "scale-0" : "scale-100"
        )} />
      </CardContent>
      
      {/* Animated border effect */}
      <div className={cn(
        "absolute inset-0 border-2 border-medical-teal rounded-lg",
        "transition-all duration-300 pointer-events-none",
        isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )} />
    </Card>
  );
}