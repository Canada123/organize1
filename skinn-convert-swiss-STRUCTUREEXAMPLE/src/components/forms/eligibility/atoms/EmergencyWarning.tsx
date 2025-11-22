import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyWarningProps {
  title?: string;
  message?: string;
  className?: string;
}

export const EmergencyWarning: React.FC<EmergencyWarningProps> = ({ 
  title = "Emergency symptoms detected",
  message = "These symptoms may require immediate medical attention",
  className 
}) => {
  return (
    <div className={cn(
      "bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3",
      className
    )}>
      <Activity className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold text-red-900">{title}</p>
        <p className="text-sm text-red-800">{message}</p>
      </div>
    </div>
  );
};