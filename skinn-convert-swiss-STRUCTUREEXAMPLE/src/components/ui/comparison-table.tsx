import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ComparisonItem {
  feature: string;
  competitors: string | boolean;
  skiin: string | boolean;
}

interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  items: ComparisonItem[];
  competitorLabel?: string;
  skiinLabel?: string;
  className?: string;
}

export function ComparisonTable({
  title,
  subtitle,
  items,
  competitorLabel = "Traditional Methods",
  skiinLabel = "SKIIN",
  className
}: ComparisonTableProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true
  });

  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-6 h-6 text-primary mx-auto" />
      ) : (
        <X className="w-6 h-6 text-muted-foreground mx-auto" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="bg-background-secondary rounded-2xl p-8 md:p-12 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold">Features</th>
                <th className="text-center py-4 px-4 font-semibold text-muted-foreground">
                  {competitorLabel}
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary">
                  {skiinLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-b border-border/50 transition-all duration-300",
                    "hover:bg-background/50"
                  )}
                  style={{
                    transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
                  }}
                >
                  <td className="py-4 px-4 font-medium">{item.feature}</td>
                  <td className="py-4 px-4 text-center">
                    {renderCell(item.competitors)}
                  </td>
                  <td className="py-4 px-4 text-center bg-primary/5">
                    {renderCell(item.skiin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}