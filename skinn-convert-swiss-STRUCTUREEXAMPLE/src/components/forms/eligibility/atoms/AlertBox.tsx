import * as React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AlertBoxProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  icon?: LucideIcon;
  message: string;
  className?: string;
}

export const AlertBox: React.FC<AlertBoxProps> = ({
  type = 'info',
  icon: Icon,
  message,
  className
}) => {
  const colorClasses = {
    success: 'bg-green-50 border-green-300 [&>svg]:text-green-600',
    warning: 'bg-amber-50 border-amber-300 [&>svg]:text-amber-600',
    error: 'bg-red-50 border-red-300 [&>svg]:text-red-600',
    info: 'bg-blue-50 border-blue-300 [&>svg]:text-blue-600'
  };

  const textColors = {
    success: 'text-green-800',
    warning: 'text-amber-800',
    error: 'text-red-800',
    info: 'text-blue-800'
  };

  return (
    <Alert className={cn(colorClasses[type], className)}>
      {Icon && <Icon className="h-5 w-5" />}
      <AlertDescription className={cn(
        textColors[type],
        'font-ibm-plex-sans'
      )}>
        {message}
      </AlertDescription>
    </Alert>
  );
};