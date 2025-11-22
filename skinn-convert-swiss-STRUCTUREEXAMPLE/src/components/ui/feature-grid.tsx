import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ProgressiveCard } from './progressive-card';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface Feature {
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
  href?: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: 'cards' | 'minimal' | 'centered';
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
}

export function FeatureGrid({
  features,
  columns = 3,
  variant = 'cards',
  className,
  itemClassName,
  staggerDelay = 150
}: FeatureGridProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const gridColumns = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  if (variant === 'cards') {
    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-8",
          gridColumns[columns],
          className
        )}
      >
        {features.map((feature, index) => (
          <ProgressiveCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            image={feature.image}
            href={feature.href}
            delay={index * staggerDelay}
            className={itemClassName}
          />
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-8",
          gridColumns[columns],
          className
        )}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              itemClassName
            )}
            style={{ transitionDelay: `${index * staggerDelay}ms` }}
          >
            {feature.icon && (
              <feature.icon className="w-12 h-12 text-primary mb-4" />
            )}
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    );
  }

  // Centered variant
  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 gap-12",
        gridColumns[columns],
        className
      )}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className={cn(
            "text-center transition-all duration-700",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
            itemClassName
          )}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {feature.icon && (
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <feature.icon className="w-10 h-10 text-primary" />
            </div>
          )}
          <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}