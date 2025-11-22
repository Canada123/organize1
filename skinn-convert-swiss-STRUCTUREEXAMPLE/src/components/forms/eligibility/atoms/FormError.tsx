import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
  showIcon?: boolean;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  message,
  showIcon = true,
  className
}) => {
  if (!message) return null;

  return (
    <div 
      className={cn(
        "flex items-center gap-2 mt-2",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {showIcon && (
        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
      )}
      <p className="text-sm font-medium text-destructive">
        {message}
      </p>
    </div>
  );
};