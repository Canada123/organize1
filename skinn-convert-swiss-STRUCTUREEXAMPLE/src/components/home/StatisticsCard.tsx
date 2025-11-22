import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatisticsCardProps {
  value: string;
  label: string;
  footnote?: string;
  icon?: React.ReactNode;
  className?: string;
  index?: number;
}

export function StatisticsCard({ 
  value, 
  label, 
  footnote, 
  icon,
  className,
  index = 0
}: StatisticsCardProps) {
  return (
    <Card 
      className={cn(
        "border-2 hover:border-medical-teal transition-all duration-300 hover:shadow-lg group",
        "bg-gradient-to-br from-background to-secondary/5",
        className
      )}
      data-testid={`statistic-card-${index + 1}`}
    >
      <CardContent className="p-6 md:p-8 text-center">
        {icon && (
          <div className="mb-4 flex justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            {icon}
          </div>
        )}
        
        <div 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-medical-teal mb-4 leading-none"
          data-testid={`stat-value-${index + 1}`}
        >
          {value}
        </div>
        
        <p className="text-base md:text-lg font-medium text-foreground mb-3 leading-snug">
          {label}
        </p>
        
        {footnote && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground italic flex items-start justify-center gap-1.5">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-medical-teal/70" />
              <span>{footnote}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}