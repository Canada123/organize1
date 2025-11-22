import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface MedicalCardProps {
  variant?: 'default' | 'trust' | 'swiss' | 'certification';
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
}

const cardVariants = {
  default: 'shadow-medical border-medical-teal/20 bg-gradient-subtle',
  trust: 'shadow-trust border-trust-blue/20 bg-trust-blue/5',
  swiss: 'shadow-swiss border-swiss-red/20 bg-gradient-swiss',
  certification: 'shadow-precision border-certification-gold/30 bg-certification-gold/5'
};

export const MedicalCard: React.FC<MedicalCardProps> = ({ 
  variant = 'default', 
  className,
  children,
  title,
  description
}) => {
  return (
    <Card className={cn(
      'transition-all duration-300 hover:scale-[1.02] border-2',
      cardVariants[variant],
      className
    )}>
      {title && (
        <CardHeader className="pb-3">
          {title && (
            <CardTitle className="text-primary-navy font-semibold">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-primary-charcoal/70">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={title ? "pt-0" : "p-6"}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MedicalCard;