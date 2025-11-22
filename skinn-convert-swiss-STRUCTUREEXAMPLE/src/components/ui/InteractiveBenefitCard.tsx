import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InteractiveBenefitCardProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

export const InteractiveBenefitCard: React.FC<InteractiveBenefitCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        y: -5
      }}
      className={cn(
        "text-center p-6 rounded-xl bg-secondary transition-all duration-300 cursor-pointer",
        className
      )}
    >
      <motion.div 
        className="w-16 h-16 mx-auto mb-4 bg-secondary-foreground rounded-full flex items-center justify-center relative overflow-hidden"
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-primary opacity-0"
          whileHover={{ opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />
        <span className="text-2xl font-bold text-white z-10">
          {icon}
        </span>
      </motion.div>
      <motion.h3 
        className="font-semibold text-foreground mb-2"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};