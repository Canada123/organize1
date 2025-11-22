import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  message?: string;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  message = "Swiss Healthcare Compliant • Medical Grade Assessment",
  className 
}) => {
  return (
    <div className={cn(
      "flex items-center gap-4 p-3 bg-blue-50 rounded-lg",
      className
    )}>
      <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
      <span className="text-sm text-blue-900">{message}</span>
    </div>
  );
};