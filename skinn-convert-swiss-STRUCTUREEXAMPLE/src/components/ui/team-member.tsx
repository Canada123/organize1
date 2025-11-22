import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { LinkedinIcon } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface TeamMemberProps {
  name: string;
  title: string;
  description: string;
  image: string;
  linkedIn?: string;
  delay?: number;
  variant?: 'card' | 'inline' | 'compact';
  className?: string;
}

export function TeamMember({
  name,
  title,
  description,
  image,
  linkedIn,
  delay = 0,
  variant = 'card',
  className
}: TeamMemberProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  if (variant === 'inline') {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col md:flex-row gap-6 transition-all duration-1000",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
          className
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-1">{name}</h3>
          <p className="text-primary font-medium mb-3">{title}</p>
          <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
          {linkedIn && (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <LinkedinIcon className="w-5 h-5 mr-2" />
              Connect on LinkedIn
            </a>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        ref={ref}
        className={cn(
          "text-center transition-all duration-1000",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          className
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <img
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-3 shadow-md"
        />
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-muted-foreground">{title}</p>
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
        "overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2",
        className
      )}>
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-primary font-medium mb-3">{title}</p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {description}
          </p>
          {linkedIn && (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm"
            >
              <LinkedinIcon className="w-4 h-4 mr-1" />
              LinkedIn
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}