"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface MinimalTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  floatingLabel?: boolean;
}

const MinimalTextarea = React.forwardRef<HTMLTextAreaElement, MinimalTextareaProps>(
  ({ className, label, error, floatingLabel = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = props.value && String(props.value).length > 0;
    const isFloating = floatingLabel && (isFocused || hasValue);

    return (
      <div className="relative w-full">
        {!floatingLabel && label && (
          <label className="block text-base font-ibm-plex-sans font-semibold text-[#004C96] mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            className={cn(
              "flex min-h-[120px] w-full rounded-md border bg-white px-4 text-base",
              "font-ibm-plex-sans transition-all duration-200 resize-vertical",
              "placeholder:text-[#475259]/50",
              "focus:outline-none focus:ring-2 focus:ring-[#5298F2]/30 focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              floatingLabel && label ? "pt-7 pb-3" : "py-3",
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
            {...props}
          />
          {floatingLabel && label && (
            <label
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none font-ibm-plex-sans",
                isFloating
                  ? "top-2 text-xs font-medium text-[#475259]"
                  : "top-4 text-base text-[#475259]",
                isFocused && !error && "text-[#004C96]",
                error && "text-red-500"
              )}
            >
              {label}
              {props.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
        </div>
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
MinimalTextarea.displayName = "MinimalTextarea";

export { MinimalTextarea };