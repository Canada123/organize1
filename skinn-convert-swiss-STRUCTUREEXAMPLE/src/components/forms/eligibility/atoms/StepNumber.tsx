import React from 'react';
import { cn } from '@/lib/utils';

interface StepNumberProps {
  number: number;
  className?: string;
}

export const StepNumber: React.FC<StepNumberProps> = ({ 
  number,
  className 
}) => {
  return (
    <div className={cn(
      "w-8 h-8 rounded-full bg-[#004C96] text-white flex items-center justify-center text-sm font-semibold",
      className
    )}>
      {number}
    </div>
  );
};