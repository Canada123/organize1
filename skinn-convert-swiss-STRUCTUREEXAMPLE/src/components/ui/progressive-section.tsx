import React from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ProgressiveSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide' | 'scale';
  delay?: number;
  dark?: boolean;
}

export function ProgressiveSection({
  children,
  className,
  animation = 'fade',
  delay = 0,
  dark = false
}: ProgressiveSectionProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const animationClasses = {
    fade: isVisible 
      ? "opacity-100" 
      : "opacity-0",
    slide: isVisible 
      ? "opacity-100 translate-y-0" 
      : "opacity-0 translate-y-12",
    scale: isVisible 
      ? "opacity-100 scale-100" 
      : "opacity-0 scale-95"
  };

  return (
    <section
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out",
        animationClasses[animation],
        dark ? "bg-slate-900 text-white" : "bg-background",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}