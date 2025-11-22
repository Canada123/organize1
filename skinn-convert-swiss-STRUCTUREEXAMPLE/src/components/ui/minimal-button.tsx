"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const minimalButtonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "font-ibm-plex-sans font-medium transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[#004C96]/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
    "rounded-md",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[#004C96] text-white font-semibold",
          "hover:bg-[#5298F2] hover:shadow-md",
          "active:scale-[0.98]",
        ],
        secondary: [
          "border-2 border-[#004C96] bg-transparent text-[#004C96] font-semibold",
          "hover:bg-[#004C96] hover:text-white",
          "active:scale-[0.98]",
        ],
        accent: [
          "bg-[#5549A6] text-white font-semibold",
          "hover:bg-[#5549A6]/90 hover:shadow-md",
          "active:scale-[0.98]",
        ],
        ghost: [
          "bg-transparent text-[#004C96] font-medium",
          "hover:bg-[#EEE8E1]",
          "active:scale-[0.98]",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface MinimalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof minimalButtonVariants> {
  loading?: boolean;
}

const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(minimalButtonVariants({ variant, size }), className)}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

MinimalButton.displayName = "MinimalButton";

export { MinimalButton, minimalButtonVariants };