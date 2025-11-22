import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  Cpu, 
  Wifi, 
  Battery, 
  Layers, 
  Shield, 
  Zap,
  Cloud,
  Lock,
  Activity
} from "lucide-react";

interface TechFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const TechFeature: React.FC<TechFeatureProps> = ({ icon, title, description, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-[#EEE8E1]/50 transition-all duration-300">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-[#004C96] to-[#5298F2] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#004C96] mb-2">{title}</h3>
          <p className="text-[#475259] text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const MinimalTechStack: React.FC = () => {
  const techFeatures = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Smart Textile Sensors",
      description: "Patented conductive yarn technology embedded in comfortable fabric for continuous, medical-grade ECG recording."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-time Signal Processing",
      description: "Advanced DSP algorithms filter noise and artifacts while preserving critical cardiac signals."
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Wireless Data Transmission",
      description: "Bluetooth 5.0 LE ensures reliable, energy-efficient data transfer to your smartphone."
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Analytics Platform",
      description: "Secure Swiss cloud infrastructure processes millions of heartbeats using machine learning."
    },
    {
      icon: <Battery className="w-6 h-6" />,
      title: "10-Day Battery Life",
      description: "Optimized power management enables continuous monitoring without daily charging."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Medical-Grade Security",
      description: "End-to-end encryption and Swiss data protection standards keep your health data private."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multi-Layer Analysis",
      description: "Combines time-domain, frequency-domain, and morphological analysis for comprehensive insights."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Alerts",
      description: "Critical arrhythmias trigger immediate notifications to you and your healthcare provider."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "GDPR Compliant",
      description: "Full compliance with European and Swiss data protection regulations."
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-[#EEE8E1]/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#5549A6]/10 text-[#5549A6] text-sm font-medium rounded-full mb-4">
            Technology Stack
          </div>
          <h2 className="text-4xl font-bold text-[#004C96] mb-4">
            Powered by Innovation
          </h2>
          <p className="text-xl text-[#475259] max-w-3xl mx-auto">
            SKIIN combines breakthrough textile engineering with advanced AI to deliver 
            the most comprehensive cardiac monitoring available at home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
          {techFeatures.slice(0, 6).map((feature, index) => (
            <TechFeature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        {/* Center Column for Remaining Features */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 gap-2">
            {techFeatures.slice(6).map((feature, index) => (
              <TechFeature
                key={index + 6}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index + 6}
              />
            ))}
          </div>
        </div>

        {/* Visual Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 mb-8 h-px bg-gradient-to-r from-transparent via-[#004C96]/20 to-transparent"
        />

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-[#004C96]">99.8%</div>
            <div className="text-sm text-[#475259] mt-1">Signal Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#004C96]">240h</div>
            <div className="text-sm text-[#475259] mt-1">Continuous Recording</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#004C96]">&lt;100ms</div>
            <div className="text-sm text-[#475259] mt-1">Detection Latency</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#004C96]">256-bit</div>
            <div className="text-sm text-[#475259] mt-1">AES Encryption</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MinimalTechStack;