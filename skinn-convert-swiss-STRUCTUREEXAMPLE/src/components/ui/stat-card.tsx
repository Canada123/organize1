import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface StatCardProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'large' | 'compact';
  delay?: number;
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  value,
  label,
  description,
  icon: Icon,
  variant = 'default',
  delay = 0,
  className,
  valueClassName
}: StatCardProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  if (variant === 'large') {
    return (
      <div
        ref={ref}
        className={cn(
          "text-center transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          className
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className={cn(
          "text-6xl md:text-7xl lg:text-8xl font-bold text-primary mb-4",
          valueClassName
        )}>
          {value}
        </div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">
          {label}
        </h3>
        {description && (
          <p className="text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-4 transition-all duration-700",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
          className
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {Icon && (
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
        <div>
          <div className={cn("text-2xl font-bold text-primary", valueClassName)}>
            {value}
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className={cn(
        "hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className
      )}>
        <CardContent className="p-6 text-center">
          {Icon && (
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          )}
          <div className={cn(
            "text-4xl md:text-5xl font-bold text-primary mb-2",
            valueClassName
          )}>
            {value}
          </div>
          <h3 className="text-lg font-semibold mb-1">{label}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}