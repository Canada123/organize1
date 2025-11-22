"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const minimalCardVariants = cva(
  "rounded-lg transition-all duration-200 font-ibm-plex-sans",
  {
    variants: {
      variant: {
        default: [
          "bg-white",
          "border border-[#004C96]/10",
          "shadow-sm",
          "hover:shadow-md",
        ],
        soft: [
          "bg-[#EEE8E1]",
          "border border-transparent",
          "shadow-sm",
        ],
        elevated: [
          "bg-white",
          "shadow-lg",
          "hover:shadow-xl",
        ],
        outlined: [
          "bg-transparent",
          "border-2 border-[#004C96]/20",
          "hover:border-[#5298F2]",
          "hover:shadow-sm",
        ],
        clickable: [
          "bg-white",
          "border border-[#004C96]/10",
          "shadow-sm",
          "hover:shadow-lg hover:scale-[1.02]",
          "hover:border-[#5298F2]",
          "cursor-pointer",
          "active:scale-[0.98]",
        ],
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export interface MinimalCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof minimalCardVariants> {}

const MinimalCard = React.forwardRef<HTMLDivElement, MinimalCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(minimalCardVariants({ variant, padding }), className)}
      {...props}
    />
  )
);
MinimalCard.displayName = "MinimalCard";

const MinimalCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-2 pb-4", className)}
    {...props}
  />
));
MinimalCardHeader.displayName = "MinimalCardHeader";

const MinimalCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-ibm-plex-sans font-bold text-[#004C96]",
      className
    )}
    {...props}
  />
));
MinimalCardTitle.displayName = "MinimalCardTitle";

const MinimalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base font-ibm-plex-sans text-[#475259]", className)}
    {...props}
  />
));
MinimalCardDescription.displayName = "MinimalCardDescription";

const MinimalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
MinimalCardContent.displayName = "MinimalCardContent";

const MinimalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-[#004C96]/10", className)}
    {...props}
  />
));
MinimalCardFooter.displayName = "MinimalCardFooter";

export {
  MinimalCard,
  MinimalCardHeader,
  MinimalCardFooter,
  MinimalCardTitle,
  MinimalCardDescription,
  MinimalCardContent,
  minimalCardVariants,
};