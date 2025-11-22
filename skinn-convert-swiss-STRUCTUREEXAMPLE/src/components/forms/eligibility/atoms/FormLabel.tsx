import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormLabelProps {
  htmlFor: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  required = false,
  error = false,
  children,
  className
}) => {
  return (
    <Label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none text-foreground",
        error && "text-destructive",
        className
      )}
      style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  );
};