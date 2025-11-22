import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Package,
  Smartphone,
  Activity,
  FileCheck,
  HeartHandshake
} from 'lucide-react';

interface HowSKIINWorksProps {
  className?: string;
}

const steps = [
  {
    icon: Package,
    title: "Receive Your Kit",
    description: "Medical-grade monitoring device delivered to your door"
  },
  {
    icon: Smartphone,
    title: "Easy Setup",
    description: "Connect to the app in minutes with guided instructions"
  },
  {
    icon: Activity,
    title: "Live Your Life",
    description: "Wear comfortably for 10 days while going about your routine"
  },
  {
    icon: FileCheck,
    title: "Expert Analysis",
    description: "Cardiologists review your data with AI assistance"
  },
  {
    icon: HeartHandshake,
    title: "Get Your Report",
    description: "Receive comprehensive results within 48 hours"
  }
];

export const HowSKIINWorks: React.FC<HowSKIINWorksProps> = ({ className }) => {
  return (
    <section className={cn("py-20 bg-background", className)}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How SKIIN Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From your doorstep to peace of mind in 5 simple steps
          </p>
        </div>

        {/* Desktop: Card Grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <div className="w-6 h-0.5 bg-border"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: Vertical Cards */}
        <div className="md:hidden space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};