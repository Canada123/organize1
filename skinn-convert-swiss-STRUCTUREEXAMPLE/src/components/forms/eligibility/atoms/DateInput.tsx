import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  max?: string;
  min?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  id,
  value,
  onChange,
  max,
  min,
  disabled = false,
  className,
  placeholder = 'Select date'
}) => {
  return (
    <div className="relative">
      <input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        max={max}
        min={min}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 pr-12",
          "border border-gray-300 rounded-lg",
          "bg-white text-[#475259]",
          "font-ibm-plex-sans text-base",
          "focus:outline-none focus:ring-2 focus:ring-[#004C96] focus:border-transparent",
          "disabled:bg-gray-50 disabled:text-gray-500",
          "transition-all duration-200",
          className
        )}
      />
      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#475259] pointer-events-none" />
    </div>
  );
};