"use client";

import * as React from "react";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface MinimalSelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const MinimalSelect = React.forwardRef<HTMLDivElement, MinimalSelectProps>(
  (
    {
      label,
      value,
      onChange,
      options,
      error,
      placeholder = "Select an option",
      disabled = false,
      required = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const selectRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((option) => option.value === value);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setIsFocused(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setIsFocused(false);
    };

    return (
      <div className="w-full" ref={ref}>
        {label && (
          <label className="block text-base font-ibm-plex-sans font-semibold text-[#004C96] mb-2">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative" ref={selectRef}>
          <button
            type="button"
            className={cn(
              "flex h-12 w-full items-center justify-between rounded-md border bg-white px-4 py-3 text-base",
              "font-ibm-plex-sans transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-[#5298F2]/30 focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : "border-[#475259]/20 focus:border-[#004C96] hover:border-[#5298F2]",
              (isFocused || isOpen) && !error && "border-[#004C96]",
              className
            )}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                setIsFocused(true);
              }
            }}
            disabled={disabled}
          >
            <span className={cn(
              "text-left font-ibm-plex-sans",
              selectedOption ? "text-[#0D0D0D]" : "text-[#475259]/60"
            )}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-[#475259] transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-md border border-[#004C96]/20 bg-white shadow-lg">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-base",
                    "font-ibm-plex-sans transition-colors duration-150",
                    "hover:bg-[#5298F2]/10",
                    option.value === value && "bg-[#EEE8E1]"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="text-[#0D0D0D]">{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4 text-[#004C96]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-red-500" role="alert">
            <AlertCircle className="h-4 w-4" />
            <span className="font-ibm-plex-sans">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

MinimalSelect.displayName = "MinimalSelect";

export { MinimalSelect };