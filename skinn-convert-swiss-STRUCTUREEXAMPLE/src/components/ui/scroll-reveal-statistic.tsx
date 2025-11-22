import React from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ScrollRevealStatisticProps {
  value: string;
  label: string;
  description?: string;
  className?: string;
  delay?: number;
}

export function ScrollRevealStatistic({
  value,
  label,
  description,
  className,
  delay = 0
}: ScrollRevealStatisticProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <div
      ref={ref}
      className={cn(
        "text-center transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-primary mb-4">
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