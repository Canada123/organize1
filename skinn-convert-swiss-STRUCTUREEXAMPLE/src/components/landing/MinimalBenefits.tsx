import * as React from "react";
import { MinimalCard, MinimalCardContent } from "@/components/ui/minimal-card";
import { motion } from "framer-motion";
import { Shield, Activity, Users, Heart, Brain, Clock, FileCheck, Smartphone, Home } from "lucide-react";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <MinimalCard className="h-full bg-[#EEE8E1]/30 border-[#004C96]/10 hover:border-[#004C96]/30 transition-all duration-300 hover:shadow-xl">
        <MinimalCardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#004C96] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#5298F2] transition-all duration-300">
              {icon}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-[#004C96]">{title}</h3>
            <p className="text-[#475259] leading-relaxed">{description}</p>
          </div>
        </MinimalCardContent>
      </MinimalCard>
    </motion.div>
  );
};

export const MinimalBenefits: React.FC = () => {
  const primaryBenefits = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Swiss Medical Compliance",
      description: "Fully compliant with Swiss healthcare regulations and Swissmedic certified for medical-grade monitoring."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Continuous ECG Monitoring",
      description: "10-day uninterrupted heart rhythm monitoring with AI-powered analysis detecting silent arrhythmias."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Cardiologist Review",
      description: "Every recording reviewed by Swiss-certified cardiologists with detailed reports within 48 hours."
    }
  ];

  const additionalBenefits = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Early Detection",
      description: "Identify heart issues before symptoms appear, preventing serious cardiac events."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze millions of heartbeats to find irregularities humans might miss."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "No Wait Times",
      description: "Start monitoring immediately without hospital queues or appointment delays."
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Insurance Covered",
      description: "Fully covered by all major Swiss insurance providers with direct billing."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Digital Results",
      description: "Access your results anytime through our secure digital platform."
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Home Comfort",
      description: "Complete the entire screening from the comfort of your home."
    }
  ];

  const [showAdditional, setShowAdditional] = React.useState(false);

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl font-bold text-[#004C96]">
            Advanced Cardiac Monitoring
          </h2>
          <p className="text-xl text-[#475259] max-w-2xl mx-auto">
            Discover how SKIIN transforms heart health monitoring with 
            cutting-edge technology and Swiss medical excellence.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {primaryBenefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Additional Benefits Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className="text-[#004C96] hover:text-[#5298F2] font-medium transition-colors duration-200"
          >
            {showAdditional ? 'Show Less' : 'Explore More Benefits →'}
          </button>
        </motion.div>

        {showAdditional && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {additionalBenefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                delay={index * 0.05}
              />
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center space-y-4">
            <p className="text-[#475259]">Ready to take control of your heart health?</p>
            <button className="px-8 py-3 bg-[#004C96] hover:bg-[#5298F2] text-white font-medium rounded-lg transition-colors duration-200">
              Check Your Eligibility
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MinimalBenefits;