"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface MinimalInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  floatingLabel?: boolean;
}

const MinimalInput = React.forwardRef<HTMLInputElement, MinimalInputProps>(
  ({ className, type, label, error, floatingLabel = true, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = props.value && String(props.value).length > 0;
    const isFloating = floatingLabel && (isFocused || hasValue);
    
    // Hide placeholder when floating label is in rest position to prevent text overlap
    const actualPlaceholder = floatingLabel && label && !isFloating ? "" : placeholder;

    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-md border bg-white px-4 text-base",
              "font-ibm-plex-sans transition-all duration-200",
              "placeholder:text-[#475259]/50",
              "focus:outline-none focus:ring-2 focus:ring-[#5298F2]/30 focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              floatingLabel && label ? "pt-6 pb-2" : "py-3",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : "border-[#475259]/20 focus:border-[#004C96] hover:border-[#5298F2]",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            placeholder={actualPlaceholder}
            {...props}
          />
          {floatingLabel && label && (
            <label
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none font-ibm-plex-sans",
                isFloating
                  ? "top-2 text-xs font-medium text-[#475259]"
                  : "top-1/2 -translate-y-1/2 text-base text-[#475259]",
                isFocused && !error && "text-[#004C96]",
                error && "text-red-500"
              )}
            >
              {label}
              {props.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
        </div>
        {!floatingLabel && label && (
          <label className="block text-base font-ibm-plex-sans font-semibold text-[#004C96] mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        {error && (
          <div id={`${props.id}-error`} className="flex items-center gap-1.5 mt-2 text-sm text-red-500" role="alert">
            <AlertCircle className="h-4 w-4" />
            <span className="font-ibm-plex-sans">{error}</span>
          </div>
        )}
      </div>
    );
  }
);
MinimalInput.displayName = "MinimalInput";

export { MinimalInput };