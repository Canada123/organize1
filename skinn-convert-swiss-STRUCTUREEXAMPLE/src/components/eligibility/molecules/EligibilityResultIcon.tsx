import React from 'react';
import { CheckCircle, Heart, Phone } from 'lucide-react';

interface EligibilityResultIconProps {
  coverage: 'covered' | 'self-pay' | 'consult-first';
  size?: number;
  className?: string;
}

export const EligibilityResultIcon: React.FC<EligibilityResultIconProps> = ({
  coverage,
  size = 16,
  className = ''
}) => {
  const iconProps = {
    className: `w-${size} h-${size} text-primary ${className}`,
    size
  };

  switch (coverage) {
    case 'covered':
      return <CheckCircle {...iconProps} />;
    case 'consult-first':
      return <Phone {...iconProps} />;
    case 'self-pay':
    default:
      return <Heart {...iconProps} />;
  }
};