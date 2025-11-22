import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Award, CheckCircle, Star, Crown } from 'lucide-react';

interface SwissQualityProps {
  type?: 'precision' | 'quality' | 'certification' | 'excellence' | 'trust';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const qualityConfig = {
  precision: {
    icon: Crown,
    label: 'Myant Technology',
    color: 'text-swiss-red',
    bg: 'bg-swiss-red/10'
  },
  quality: {
    icon: Star,
    label: 'Myant Technology',
    color: 'text-swiss-red',
    bg: 'bg-swiss-red/10'
  },
  certification: {
    icon: Award,
    label: 'CE Certified',
    color: 'text-certification-gold',
    bg: 'bg-certification-gold/10'
  },
  excellence: {
    icon: Shield,
    label: 'Medical Excellence',
    color: 'text-medical-grade',
    bg: 'bg-medical-grade/10'
  },
  trust: {
    icon: CheckCircle,
    label: 'Trusted by MDs',
    color: 'text-trust-blue',
    bg: 'bg-trust-blue/10'
  }
};

const sizeConfig = {
  sm: { icon: 'w-4 h-4', text: 'text-xs', padding: 'px-2 py-1' },
  md: { icon: 'w-5 h-5', text: 'text-sm', padding: 'px-3 py-2' },
  lg: { icon: 'w-6 h-6', text: 'text-base', padding: 'px-4 py-3' }
};

export const SwissQuality: React.FC<SwissQualityProps> = ({ 
  type = 'quality', 
  size = 'md', 
  showLabel = true,
  className 
}) => {
  const config = qualityConfig[type];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-full border border-swiss-silver/30 font-medium transition-all duration-300 hover:scale-105',
      config.bg,
      config.color,
      sizes.padding,
      sizes.text,
      'shadow-swiss',
      className
    )}>
      <Icon className={sizes.icon} />
      {showLabel && <span className="font-semibold">{config.label}</span>}
    </div>
  );
};

export default SwissQuality;