import React from 'react';
import { Shield, Award, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  variant?: 'medical' | 'swiss' | 'certification' | 'quality';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const trustVariants = {
  medical: {
    icon: Shield,
    bg: 'bg-gradient-medical',
    border: 'border-medical-teal/30',
    text: 'text-white',
    shadow: 'shadow-medical'
  },
  swiss: {
    icon: Star,
    bg: 'bg-gradient-swiss',
    border: 'border-swiss-red/30',
    text: 'text-swiss-red',
    shadow: 'shadow-swiss'
  },
  certification: {
    icon: Award,
    bg: 'bg-certification-gold/10',
    border: 'border-certification-gold/40',
    text: 'text-certification-gold',
    shadow: 'shadow-precision'
  },
  quality: {
    icon: CheckCircle,
    bg: 'bg-trust-blue/10',
    border: 'border-trust-blue/30',
    text: 'text-trust-blue',
    shadow: 'shadow-trust'
  }
};

const sizeVariants = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  variant = 'quality', 
  size = 'md', 
  className,
  children 
}) => {
  const config = trustVariants[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-full border font-medium transition-all duration-300',
      config.bg,
      config.border,
      config.text,
      config.shadow,
      sizeVariants[size],
      className
    )}>
      <Icon className="w-4 h-4" />
      {children}
    </div>
  );
};

export default TrustBadge;