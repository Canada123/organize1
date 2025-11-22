import * as React from "react";
import { motion } from "framer-motion";
import { Check, Info, Star, TrendingUp } from "lucide-react";
import { MinimalCard, MinimalCardContent, MinimalCardHeader } from "@/components/ui/minimal-card";

interface PricingTierProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  delay?: number;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  badge,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <MinimalCard 
        className={`h-full relative ${
          highlighted 
            ? 'border-2 border-[#004C96] shadow-xl bg-gradient-to-b from-white to-[#EEE8E1]/20' 
            : 'border border-[#475259]/20 hover:border-[#004C96]/50'
        } transition-all duration-300`}
      >
        {badge && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="px-4 py-1 bg-[#5549A6] text-white text-xs font-medium rounded-full">
              {badge}
            </span>
          </div>
        )}
        
        <MinimalCardHeader className="text-center pb-6 pt-8">
          <h3 className="text-2xl font-bold text-[#004C96] mb-2">{name}</h3>
          <p className="text-[#475259] text-sm mb-4">{description}</p>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-[#004C96]">{price}</span>
            <span className="text-[#475259] ml-2">CHF</span>
            {period && <span className="text-[#475259] ml-1">/ {period}</span>}
          </div>
        </MinimalCardHeader>

        <MinimalCardContent className="pt-0">
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-[#475259] text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <button 
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              highlighted
                ? 'bg-[#004C96] hover:bg-[#5298F2] text-white'
                : 'bg-white border border-[#004C96] text-[#004C96] hover:bg-[#004C96] hover:text-white'
            }`}
          >
            Get Started
          </button>
        </MinimalCardContent>
      </MinimalCard>
    </motion.div>
  );
};

export const MinimalPricing: React.FC = () => {
  const pricingTiers = [
    {
      name: "3-Day Screening",
      price: "149",
      period: "",
      description: "Quick cardiac assessment",
      features: [
        "72 hours continuous monitoring",
        "AI-powered analysis",
        "Basic arrhythmia detection",
        "Digital report within 72 hours",
        "Email support"
      ]
    },
    {
      name: "10-Day Screening",
      price: "299",
      period: "",
      description: "Comprehensive heart monitoring",
      features: [
        "240 hours continuous monitoring",
        "Advanced AI analysis",
        "Silent AF & arrhythmia detection",
        "Cardiologist review included",
        "Detailed report within 48 hours",
        "Phone & email support",
        "Insurance reimbursement support"
      ],
      highlighted: true,
      badge: "Most Popular"
    },
    {
      name: "30-Day Screening",
      price: "599",
      period: "",
      description: "Extended cardiac surveillance",
      features: [
        "720 hours continuous monitoring",
        "Comprehensive pattern analysis",
        "All arrhythmia types detection",
        "2x Cardiologist consultations",
        "Weekly progress reports",
        "Priority support",
        "Full insurance documentation"
      ]
    }
  ];

  const insurancePlans = [
    { name: "Standard Model", coverage: "100% covered after deductible" },
    { name: "HMO/Hausarzt", coverage: "Requires GP referral" },
    { name: "Telmed", coverage: "Call hotline first for approval" }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-4">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Insurance Covered for Most Swiss Residents
            </span>
          </div>
          <h2 className="text-4xl font-bold text-[#004C96] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-[#475259] max-w-2xl mx-auto">
            Choose the monitoring duration that fits your needs. 
            Most Swiss insurance plans cover the full cost.
          </p>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              {...tier}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Insurance Coverage Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-[#EEE8E1]/50 to-[#EEE8E1]/30 rounded-2xl p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <Info className="w-6 h-6 text-[#004C96] mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-[#004C96] mb-2">
                Insurance Coverage Information
              </h3>
              <p className="text-[#475259]">
                SKIIN monitoring is classified as a medical diagnostic procedure and is covered by Swiss basic health insurance 
                when medically indicated. Coverage depends on your insurance model:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insurancePlans.map((plan, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-[#004C96] mb-1">{plan.name}</h4>
                <p className="text-sm text-[#475259]">{plan.coverage}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button className="text-[#004C96] hover:text-[#5298F2] font-medium transition-colors">
              Check Insurance Eligibility →
            </button>
            <span className="text-[#475259]">or</span>
            <button className="text-[#004C96] hover:text-[#5298F2] font-medium transition-colors">
              Contact Support
            </button>
          </div>
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <TrendingUp className="w-10 h-10 text-[#004C96] mx-auto mb-3" />
            <h4 className="font-semibold text-[#004C96] mb-2">70% More Effective</h4>
            <p className="text-sm text-[#475259]">Than traditional 24-hour Holter monitoring</p>
          </div>
          <div>
            <Check className="w-10 h-10 text-[#004C96] mx-auto mb-3" />
            <h4 className="font-semibold text-[#004C96] mb-2">No Hidden Costs</h4>
            <p className="text-sm text-[#475259]">All-inclusive pricing with no surprises</p>
          </div>
          <div>
            <Star className="w-10 h-10 text-[#004C96] mx-auto mb-3" />
            <h4 className="font-semibold text-[#004C96] mb-2">Money-Back Guarantee</h4>
            <p className="text-sm text-[#475259]">Full refund if device issues occur</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MinimalPricing;