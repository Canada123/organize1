import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface FormFieldProps {
  label: string;
  id: string;
  type?: "text" | "email" | "password" | "date";
  required?: boolean;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  max?: string;
  min?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    id, 
    type = "text", 
    required = false, 
    error, 
    placeholder, 
    value, 
    onChange, 
    className,
    max,
    min,
    ...props 
  }, ref) => {
    return (
      <div className={cn("space-y-2", className)} style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
        <Label 
          htmlFor={id} 
          className={cn(
            "text-sm font-medium leading-none text-foreground",
            error && "text-destructive"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            max={max}
            min={min}
            className={cn(
              "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              type === "date" && "pr-10",
              error && "border-destructive focus-visible:ring-destructive"
            )}
            {...props}
          />
          {type === "date" && (
            <Calendar 
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          )}
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive mt-2">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";