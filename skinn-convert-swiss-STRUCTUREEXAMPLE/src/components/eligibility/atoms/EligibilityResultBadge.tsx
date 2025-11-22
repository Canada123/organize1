import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EligibilityResultBadgeProps {
  coverage: 'covered' | 'self-pay' | 'consult-first';
  text: string;
  className?: string;
}

export const EligibilityResultBadge: React.FC<EligibilityResultBadgeProps> = ({
  coverage,
  text,
  className = ''
}) => {
  const variant = coverage === 'covered' ? 'default' : 'secondary';
  
  return (
    <Badge 
      variant={variant} 
      className={`text-base px-4 py-2 ${className}`}
    >
      {text}
    </Badge>
  );
};