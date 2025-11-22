import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Package, Heart, FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface JourneyTimelineProps {
  className?: string;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ className }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  
  const milestones = [
    {
      icon: CheckCircle2,
      title: 'Eligibility Check',
      time: '5 minutes',
      description: 'Quick online assessment to confirm coverage',
      status: 'completed' as const,
      details: [
        'Answer simple health questions',
        'Verify insurance coverage',
        'Get instant approval'
      ]
    },
    {
      icon: Package,
      title: 'Device Delivery',
      time: '48 hours',
      description: 'SKIIN kit arrives at your home',
      status: 'active' as const,
      details: [
        'Free express shipping',
        'Everything you need included',
        'Easy setup instructions'
      ]
    },
    {
      icon: Heart,
      title: 'Heart Monitoring',
      time: '10 days',
      description: 'Continuous 24/7 monitoring while you live normally',
      status: 'upcoming' as const,
      details: [
        'Wear comfortably day & night',
        'Shower-friendly (remove briefly)',
        'AI-powered analysis'
      ]
    },
    {
      icon: FileText,
      title: 'Results Review',
      time: '2 days',
      description: 'Comprehensive report from certified cardiologists',
      status: 'upcoming' as const,
      details: [
        'Professional interpretation',
        'Clear recommendations',
        'Follow-up support'
      ]
    }
  ];

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  // Calculate progress percentage
  const progressPercentage = ((activeStep + 1) / milestones.length) * 100;

  return (
    <section className={cn("py-20 bg-muted/30", className)}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            YOUR JOURNEY
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            From Check to Care in 2 Weeks
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A simple, insurance-covered path to comprehensive heart health insights
          </p>
        </div>

        {/* Timeline with Progress Bar */}
        <div className="relative max-w-5xl mx-auto">
          {/* Progress bar background */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-muted-foreground/20 rounded-full" />
          
          {/* Animated progress bar */}
          <motion.div 
            className="hidden lg:block absolute top-12 left-0 h-1 bg-gradient-to-r from-secondary via-secondary-foreground to-secondary-foreground rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              const isHovered = index === hoveredStep;
              
              return (
                <motion.div 
                  key={milestone.title} 
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  {/* Timeline dot */}
                  <motion.div 
                    className={cn(
                      "hidden lg:flex absolute -top-[3px] left-1/2 -translate-x-1/2 w-6 h-6 rounded-full items-center justify-center cursor-pointer",
                      isCompleted && "bg-secondary",
                      isActive && "bg-secondary-foreground",
                      !isCompleted && !isActive && "bg-muted-foreground/30"
                    )}
                    whileHover={{ scale: 1.3 }}
                    onClick={() => handleStepClick(index)}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                    {isActive && (
                      <motion.div
                        className="w-3 h-3 bg-white rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  
                  <motion.div 
                    className={cn(
                      "relative p-6 rounded-xl cursor-pointer transition-all duration-300",
                      isActive && "bg-secondary-foreground/10 border-2 border-secondary-foreground shadow-lg",
                      isCompleted && "bg-secondary/10 border-2 border-secondary",
                      !isActive && !isCompleted && "bg-background border-2 border-muted hover:border-muted-foreground/50"
                    )}
                    onClick={() => handleStepClick(index)}
                    onMouseEnter={() => setHoveredStep(index)}
                    onMouseLeave={() => setHoveredStep(null)}
                    whileHover={{ 
                      y: -8,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                    }}
                  >
                    {/* Icon */}
                    <motion.div 
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                        isCompleted && "bg-secondary text-white",
                        isActive && "bg-secondary-foreground text-white",
                        !isCompleted && !isActive && "bg-muted text-muted-foreground"
                      )}
                      animate={{
                        rotate: isHovered ? 360 : 0,
                        scale: isActive ? [1, 1.1, 1] : 1
                      }}
                      transition={{ 
                        rotate: { duration: 0.5 },
                        scale: { duration: 2, repeat: isActive ? Infinity : 0 }
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="font-semibold text-foreground mb-2">
                      {milestone.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-secondary-foreground">
                        {milestone.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {milestone.description}
                    </p>

                    {/* Details on hover/active */}
                    <AnimatePresence>
                      {(isActive || isHovered) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          {milestone.details.map((detail, i) => (
                            <motion.div
                              key={i}
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <ArrowRight className="w-3 h-3 text-secondary-foreground mt-0.5" />
                              <span className="text-xs text-muted-foreground">{detail}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>


                    {/* Status indicator */}
                    {isActive && (
                      <motion.div 
                        className="absolute -top-3 -right-3 bg-secondary-foreground text-white text-xs px-3 py-1 rounded-full font-medium"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        Current Step
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>


          {/* Total timeline summary */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-secondary/10 px-6 py-3 rounded-full cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Clock className="w-5 h-5 text-secondary-foreground" />
              <span className="text-foreground font-medium">
                Total journey: <motion.span 
                  className="text-secondary-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >14 days</motion.span> from start to results
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};