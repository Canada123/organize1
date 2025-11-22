import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';

interface ProgressiveCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
  imageAlt?: string;
  delay?: number;
  href?: string;
  learnMoreText?: string;
  className?: string;
  iconClassName?: string;
  contentClassName?: string;
}

export function ProgressiveCard({
  title,
  description,
  icon: Icon,
  image,
  imageAlt,
  delay = 0,
  href,
  learnMoreText = "Learn more",
  className,
  iconClassName,
  contentClassName
}: ProgressiveCardProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const cardContent = (
    <>
      {image && (
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg -m-6 mb-6">
          <img 
            src={image} 
            alt={imageAlt || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <CardContent className={cn("p-6", contentClassName)}>
        {Icon && !image && (
          <div className={cn(
            "w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4",
            iconClassName
          )}>
            <Icon className="w-8 h-8 text-primary" />
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        {href && (
          <div className="mt-4 text-primary font-medium flex items-center group-hover:gap-2 transition-all">
            {learnMoreText}
            <span className="ml-1 group-hover:ml-0 transition-all">→</span>
          </div>
        )}
      </CardContent>
    </>
  );

  const cardClasses = cn(
    "group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
    className
  );

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className="transition-all duration-1000"
    >
      {href ? (
        <Link to={href} className="block">
          <Card className={cardClasses}>
            {cardContent}
          </Card>
        </Link>
      ) : (
        <Card className={cardClasses}>
          {cardContent}
        </Card>
      )}
    </div>
  );
}