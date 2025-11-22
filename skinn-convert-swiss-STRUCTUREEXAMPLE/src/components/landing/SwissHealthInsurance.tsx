import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SwissHealthInsuranceProps {
  className?: string;
}

export const SwissHealthInsurance: React.FC<SwissHealthInsuranceProps> = ({ className }) => {
  const features = [
    '100% coverage through basic insurance',
    'No out-of-pocket costs for qualifying users',
    'Direct billing support',
    'Reimbursement assistance available'
  ];

  return (
    <section className={cn("py-20 bg-white", className)}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Covered by Swiss Health<br />
              Insurance
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-lg">
              Skiin is reimbursed under basic Swiss insurance when medically prescribed with no extra cost for eligible patients.
            </p>
          </div>

          {/* Right Side - Image with integrated Feature Card */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden">
              <img
                src="/assets/images/health-insurance-senior.png"
                alt="Senior enjoying life with Swiss health insurance coverage"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
                decoding="async"
              />
              
              {/* Feature Card Inside Image */}
              <motion.div 
                className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 bg-white/95 backdrop-blur rounded-2xl p-6 lg:p-8 max-w-sm shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="font-semibold text-foreground text-lg mb-4">What's included:</h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-lp-primary-blue flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Insurance Logos */}
        <div className="mt-16 py-8">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Trusted by major Swiss insurers</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
            {[
              { name: 'SWICA', color: '#E30613' },
              { name: 'CSS', color: '#0066CC' },
              { name: 'Helsana', color: '#009FE3' },
              { name: 'Concordia', color: '#005BAA' },
              { name: 'Sanitas', color: '#E4003A' },
              { name: 'Groupe Mutuel', color: '#EE7D00' },
              { name: 'Sympany', color: '#00A19A' },
              { name: 'Visana', color: '#0080C9' },
              { name: 'Avenir', color: '#1B365D' }
            ].map((insurer, index) => (
              <motion.div
                key={insurer.name}
                className="relative flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2
                }}
              >
                <span className="text-foreground font-medium text-base">
                  {insurer.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};