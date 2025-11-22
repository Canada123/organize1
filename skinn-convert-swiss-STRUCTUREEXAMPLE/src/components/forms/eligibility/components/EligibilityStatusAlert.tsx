import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { MinimalButton } from '@/components/ui/minimal-button';
import { CheckCircle, Info, AlertTriangle, ArrowRight, Phone, Calendar, CreditCard } from 'lucide-react';

interface EligibilityStatusAlertProps {
  status: 'eligible-insured' | 'screening-no-reimbursement' | 'self-pay' | 'contraindicated' | '';
  onProceedSelfPay?: () => void;
  onExit?: () => void;
}

export const EligibilityStatusAlert: React.FC<EligibilityStatusAlertProps> = ({
  status,
  onProceedSelfPay,
  onExit,
}) => {
  if (!status) return null;

  if (status === 'eligible-insured') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-ibm-plex-sans font-bold text-green-900 mb-2">
              Excellent! You're Eligible for Reimbursement
            </h3>
            <p className="text-green-800 font-ibm-plex-sans mb-4">
              Based on your insurance coverage and reported symptoms, your Holter monitoring 
              will likely be reimbursed by your Swiss health insurance.
            </p>
            
            {/* Next Steps */}
            <div className="space-y-3">
              <h4 className="font-semibold text-green-900">Next Steps:</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-green-800">
                  <Calendar className="h-4 w-4" />
                  Complete remaining assessment questions
                </div>
                <div className="flex items-center gap-2 text-sm text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  Insurance pre-authorization (handled for you)
                </div>
              </div>
            </div>

            {/* Estimated Cost */}
            <div className="mt-4 p-3 bg-white/70 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Estimated out-of-pocket cost:</span>
                <span className="text-lg font-bold text-green-900">CHF 10-50</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Deductible and co-payment may apply depending on your specific plan
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'screening-no-reimbursement') {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-2 border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-ibm-plex-sans font-bold text-amber-900 mb-2">
              Preventive Screening Assessment
            </h3>
            <p className="text-amber-800 font-ibm-plex-sans mb-4">
              Since you don't have specific cardiac symptoms, this would be considered 
              preventive screening, which is typically not covered by Swiss insurance.
            </p>
            
            {/* Options */}
            <div className="space-y-4">
              <div className="p-4 bg-white/70 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-900 mb-2">Self-Pay Option Available</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-amber-900">Full service price:</span>
                  <span className="text-xl font-bold text-amber-900">CHF 390</span>
                </div>
                <ul className="text-sm text-amber-800 space-y-1 mb-4">
                  <li>• 14-day professional Holter monitoring</li>
                  <li>• Expert cardiac rhythm analysis</li>
                  <li>• Comprehensive medical report</li>
                  <li>• Secure online results portal</li>
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
          </div>
        </div>
      </div>
    );
  }

  if (status === 'self-pay') {
    return (
      <div className="bg-gradient-to-br from-[#EEE8E1] to-[#8B7355]/10 border-2 border-[#8B7355]/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#8B7355] rounded-full flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-ibm-plex-sans font-bold text-[#8B7355] mb-2">
              Self-Pay Holter Monitoring
            </h3>
            <p className="text-[#475259] font-ibm-plex-sans mb-4">
              You'll receive the same high-quality cardiac monitoring service with 
              professional analysis and comprehensive reporting.
            </p>
            
            {/* Service Details */}
            <div className="p-4 bg-white/70 rounded-lg border border-[#8B7355]/20 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#8B7355]">Complete Service Package</h4>
                <span className="text-2xl font-bold text-[#8B7355]">CHF 390</span>
              </div>
              <p className="text-xs text-[#475259] mb-3">
                VAT included (7.7%) • No hidden fees • Payment upon device collection
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-[#475259]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  14-day monitoring device
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Expert medical analysis
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Comprehensive report
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Secure online delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'contraindicated') {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-ibm-plex-sans font-bold text-red-900 mb-2">
              Medical Review Required
            </h3>
            <p className="text-red-800 font-ibm-plex-sans mb-4">
              Based on your responses, we recommend consulting with a healthcare 
              provider before proceeding with Holter monitoring.
            </p>
            
            {/* Emergency Contact Info */}
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
          </div>
        </div>
      </div>
    );
  }

  return null;
};