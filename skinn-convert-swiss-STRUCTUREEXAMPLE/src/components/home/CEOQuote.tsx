import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CEOQuoteProps {
  quote?: string;
  name?: string;
  title?: string;
  image?: string;
  className?: string;
}

export function CEOQuote({ 
  quote = "At SKIIN, we believe that heart health monitoring should be as natural as wearing your favorite shirt. Our mission is to make clinical-grade cardiac care accessible to everyone, right from the comfort of their home.",
  name = "Tony Chahine",
  title = "CEO & Founder, SKIIN",
  image = "/assets/images/team/ceo-placeholder.jpg",
  className
}: CEOQuoteProps) {
  return (
    <div className={cn("py-12", className)}>
      <Card className="border-2 border-medical-teal/20 bg-gradient-to-br from-medical-teal/5 to-background max-w-4xl mx-auto">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Quote Icon and Text */}
            <div className="flex-1">
              <Quote className="w-12 h-12 text-medical-teal/30 mb-4" />
              <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed mb-6">
                "{quote}"
              </blockquote>
              <div>
                <p className="font-semibold text-lg">{name}</p>
                <p className="text-muted-foreground">{title}</p>
              </div>
            </div>
            
            {/* CEO Image (Optional) */}
            {image && (
              <div className="hidden md:block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}