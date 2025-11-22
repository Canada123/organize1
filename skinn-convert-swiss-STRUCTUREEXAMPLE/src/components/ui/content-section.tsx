import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';

interface ContentSectionProps {
  badge?: string;
  badgeVariant?: 'default' | 'outline' | 'secondary';
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  description?: string;
  bullets?: string[];
  primaryCta?: {
    text: string;
    href: string;
    variant?: 'default' | 'outline';
  };
  secondaryCta?: {
    text: string;
    href: string;
    variant?: 'default' | 'outline';
  };
  image?: {
    src: string;
    alt: string;
    position?: 'left' | 'right';
  };
  icon?: LucideIcon;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function ContentSection({
  badge,
  badgeVariant = 'outline',
  title,
  titleHighlight,
  subtitle,
  description,
  bullets,
  primaryCta,
  secondaryCta,
  image,
  icon: Icon,
  align = 'left',
  className
}: ContentSectionProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const content = (
    <div className={cn("space-y-6", alignClasses[align])}>
      {badge && (
        <Badge 
          variant={badgeVariant}
          className={cn(
            badgeVariant === 'outline' && "bg-primary/10 text-primary border-primary/20",
            align === 'center' && "mx-auto"
          )}
        >
          {badge}
        </Badge>
      )}
      
      <div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {titleHighlight ? (
            <>
              <span className="text-primary">{titleHighlight}</span>{' '}
              <span className="text-foreground">{title}</span>
            </>
          ) : (
            title
          )}
        </h2>
        {subtitle && (
          <p className="text-xl text-primary font-medium mt-2">{subtitle}</p>
        )}
      </div>

      {description && (
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          {description}
        </p>
      )}

      {bullets && bullets.length > 0 && (
        <ul className={cn(
          "space-y-3",
          align === 'center' && "max-w-2xl mx-auto text-left"
        )}>
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-muted-foreground">{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {(primaryCta || secondaryCta) && (
        <div className={cn(
          "flex gap-4",
          align === 'center' && "justify-center",
          align === 'right' && "justify-end"
        )}>
          {primaryCta && (
            <Button
              size="lg"
              variant={primaryCta.variant}
              className="group"
              asChild
            >
              <Link to={primaryCta.href}>
                {primaryCta.text}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
          {secondaryCta && (
            <Button
              size="lg"
              variant={secondaryCta.variant || 'outline'}
              asChild
            >
              <Link to={secondaryCta.href}>
                {secondaryCta.text}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (image) {
    return (
      <div
        ref={ref}
        className={cn(
          "grid lg:grid-cols-2 gap-12 items-center",
          isVisible ? "opacity-100" : "opacity-0",
          className
        )}
      >
        <div
          className={cn(
            "transition-all duration-1000",
            image.position === 'right' && "lg:order-2",
            isVisible 
              ? "translate-x-0 opacity-100" 
              : image.position === 'right' ? "translate-x-8 opacity-0" : "-translate-x-8 opacity-0"
          )}
        >
          {content}
        </div>
        <div
          className={cn(
            "transition-all duration-1000 delay-300",
            image.position === 'right' && "lg:order-1",
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        align === 'center' && "max-w-4xl mx-auto",
        className
      )}
    >
      {Icon && align === 'center' && (
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Icon className="w-10 h-10 text-primary" />
        </div>
      )}
      {content}
    </div>
  );
}