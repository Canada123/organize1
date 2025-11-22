import React from 'react';
import { MinimalButton } from '@/components/ui/minimal-button';
import { ArrowRight, Phone, CreditCard } from 'lucide-react';
import { StatusIcon } from '../atoms/StatusIcon';
import { NextStepsGrid, defaultEligibleSteps } from '../molecules/NextStepsGrid';
import { ServicePackageCard } from '../molecules/ServicePackageCard';
import { CostEstimateCard } from '../atoms/CostEstimateCard';

interface EligibilityStatusAlertProps {
  status: 'eligible-insured' | 'screening-no-reimbursement' | 'self-pay' | 'contraindicated' | '';
  onProceedSelfPay?: () => void;
  onExit?: () => void;
}

const statusConfig = {
  'eligible-insured': {
    containerClass: 'from-green-50 to-green-100/50 border-green-200',
    titleClass: 'text-green-900',
    textClass: 'text-green-800'
  },
  'screening-no-reimbursement': {
    containerClass: 'from-amber-50 to-amber-100/50 border-amber-200',
    titleClass: 'text-amber-900',
    textClass: 'text-amber-800'
  },
  'self-pay': {
    containerClass: 'from-[#EEE8E1] to-[#8B7355]/10 border-[#8B7355]/30',
    titleClass: 'text-[#8B7355]',
    textClass: 'text-[#475259]'
  },
  'contraindicated': {
    containerClass: 'from-red-50 to-red-100/50 border-red-200',
    titleClass: 'text-red-900',
    textClass: 'text-red-800'
  }
};

const serviceFeatures = [
  '14-day monitoring device',
  'Expert medical analysis',
  'Comprehensive report',
  'Secure online delivery'
];

const selfPayFeatures = [
  '14-day professional Holter monitoring',
  'Expert cardiac rhythm analysis',
  'Comprehensive medical report',
  'Secure online results portal'
];

export const EligibilityStatusAlertRefactored: React.FC<EligibilityStatusAlertProps> = ({
  status,
  onProceedSelfPay,
  onExit,
}) => {
  if (!status) return null;

  const config = statusConfig[status];

  return (
    <div className={`bg-gradient-to-br ${config.containerClass} border-2 rounded-xl p-6`}>
      <div className="flex items-start gap-4">
        <StatusIcon status={status} />
        
        <div className="flex-1">
          {/* Eligible Insured Status */}
          {status === 'eligible-insured' && (
            <>
              <h3 className={`text-xl font-ibm-plex-sans font-bold ${config.titleClass} mb-2`}>
                Excellent! You're Eligible for Reimbursement
              </h3>
              <p className={`${config.textClass} font-ibm-plex-sans mb-4`}>
                Based on your insurance coverage and reported symptoms, your Holter monitoring 
                will likely be reimbursed by your Swiss health insurance.
              </p>
              <NextStepsGrid steps={defaultEligibleSteps} />
              <CostEstimateCard
                label="Estimated out-of-pocket cost:"
                amount="10-50"
                note="Deductible and co-payment may apply depending on your specific plan"
              />
            </>
          )}

          {/* Screening No Reimbursement Status */}
          {status === 'screening-no-reimbursement' && (
            <>
              <h3 className={`text-xl font-ibm-plex-sans font-bold ${config.titleClass} mb-2`}>
                Preventive Screening Assessment
              </h3>
              <p className={`${config.textClass} font-ibm-plex-sans mb-4`}>
                Since you don't have specific cardiac symptoms, this would be considered 
                preventive screening, which is typically not covered by Swiss insurance.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/70 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">Self-Pay Option Available</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-amber-900">Full service price:</span>
                    <span className="text-xl font-bold text-amber-900">CHF 390</span>
                  </div>
                  <ul className="text-sm text-amber-800 space-y-1 mb-4">
                    {selfPayFeatures.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <MinimalButton 
                    className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
                    onClick={onProceedSelfPay}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Continue with Self-Pay
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </MinimalButton>
                  <MinimalButton 
                    variant="outline" 
                    className="border-amber-600 text-amber-800 hover:bg-amber-50 flex-1"
                    onClick={onExit}
                  >
                    Exit Assessment
                  </MinimalButton>
                </div>
              </div>
            </>
          )}

          {/* Self Pay Status */}
          {status === 'self-pay' && (
            <>
              <h3 className={`text-xl font-ibm-plex-sans font-bold ${config.titleClass} mb-2`}>
                Self-Pay Holter Monitoring
              </h3>
              <p className={`${config.textClass} font-ibm-plex-sans mb-4`}>
                You'll receive the same high-quality cardiac monitoring service with 
                professional analysis and comprehensive reporting.
              </p>
              <ServicePackageCard
                title="Complete Service Package"
                price="390"
                features={serviceFeatures}
              />
            </>
          )}

          {/* Contraindicated Status */}
          {status === 'contraindicated' && (
            <>
              <h3 className={`text-xl font-ibm-plex-sans font-bold ${config.titleClass} mb-2`}>
                Medical Review Required
              </h3>
              <p className={`${config.textClass} font-ibm-plex-sans mb-4`}>
                Based on your responses, we recommend consulting with a healthcare 
                provider before proceeding with Holter monitoring.
              </p>
              
              <div className="space-y-3">
                <div className="p-4 bg-red-100/70 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Immediate Medical Assistance
                  </h4>
                  <div className="text-sm text-red-800 space-y-1">
                    <p><strong>Medical Emergency:</strong> 144</p>
                    <p><strong>European Emergency:</strong> 112</p>
                    <p><strong>GP Consultation:</strong> Contact your family doctor</p>
                  </div>
                </div>
                
                <p className="text-sm text-red-700">
                  <strong>Important:</strong> This assessment does not replace professional 
                  medical advice. Please consult your healthcare provider for proper evaluation.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};