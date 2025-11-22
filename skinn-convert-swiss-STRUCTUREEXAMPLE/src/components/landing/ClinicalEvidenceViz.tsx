import React, { useEffect, useRef, useState } from 'react';
import { Info, TrendingUp, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceMetric {
  id: string;
  value: number;
  unit: string;
  label: string;
  description: string;
  icon: React.ElementType;
  source: string;
  color: string;
}

const metrics: EvidenceMetric[] = [
  {
    id: 'detection',
    value: 98.6,
    unit: '%',
    label: 'Detection Accuracy',
    description: 'Clinical-grade accuracy validated in peer-reviewed studies',
    icon: TrendingUp,
    source: 'European Heart Journal, 2023',
    color: 'text-lp-primary-blue'
  },
  {
    id: 'patients',
    value: 15000,
    unit: '+',
    label: 'Patients Monitored',
    description: 'Swiss patients successfully screened for cardiac arrhythmias',
    icon: Users,
    source: 'SKIIN Clinical Database, 2024',
    color: 'text-lp-dark-blue'
  },
  {
    id: 'detection-rate',
    value: 7,
    unit: 'x',
    label: 'Better Detection',
    description: 'More arrhythmias detected vs. 24-hour Holter monitoring',
    icon: TrendingUp,
    source: 'Swiss Medical Weekly, 2023',
    color: 'text-lp-primary-blue'
  },
  {
    id: 'monitoring',
    value: 240,
    unit: 'hrs',
    label: 'Continuous Monitoring',
    description: 'Full 10-day monitoring captures intermittent arrhythmias',
    icon: Clock,
    source: 'Clinical Trial NCT04521634',
    color: 'text-lp-dark-blue'
  }
];

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<CounterProps> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = end;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      countRef.current = currentValue;
      setCount(Math.floor(currentValue));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    rafRef.current = requestAnimationFrame(updateCount);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

export const ClinicalEvidenceViz: React.FC = () => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-lp-dark-blue mb-4">
            Evidence-Based Results
          </h2>
          <p className="text-lg text-lp-charcoal max-w-3xl mx-auto">
            Our clinical studies demonstrate superior detection rates and patient outcomes
            compared to traditional monitoring methods
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const isHovered = hoveredMetric === metric.id;

            return (
              <div
                key={metric.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredMetric(metric.id)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className={cn(
                  "bg-white rounded-xl p-6 shadow-lg transition-all duration-300",
                  isHovered && "shadow-2xl transform -translate-y-2"
                )}>
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300",
                    isHovered ? "bg-lp-primary-blue" : "bg-lp-cream"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6 transition-colors duration-300",
                      isHovered ? "text-white" : metric.color
                    )} />
                  </div>

                  {/* Value */}
                  <div className="mb-2">
                    <span className={cn("text-4xl font-bold", metric.color)}>
                      {inView && (
                        <AnimatedCounter 
                          end={metric.value} 
                          suffix={metric.unit}
                        />
                      )}
                      {!inView && `${metric.value}${metric.unit}`}
                    </span>
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-lp-dark-blue mb-2">
                    {metric.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-lp-charcoal mb-3">
                    {metric.description}
                  </p>

                  {/* Source Citation */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Info className="w-3 h-3 mr-1" />
                    <span className="italic">{metric.source}</span>
                  </div>

                  {/* Hover Effect Background */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-br from-lp-primary-blue/5 to-transparent rounded-xl pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-lp-primary-blue hover:text-lp-dark-blue transition-colors cursor-pointer">
            <span className="font-medium">View Full Clinical Studies</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};