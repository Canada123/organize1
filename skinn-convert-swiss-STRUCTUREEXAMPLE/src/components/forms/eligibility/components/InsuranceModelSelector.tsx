import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Shield, CheckCircle2, Building2 } from 'lucide-react';

interface InsuranceModelSelectorProps {
  hasInsurance: boolean;
  onInsuranceChange: (hasInsurance: boolean) => void;
  model: string;
  onModelChange: (model: string) => void;
}

const SWISS_INSURANCE_PROVIDERS = [
  { name: 'CSS', logo: '🏥', color: 'bg-red-50 border-red-200 text-red-800' },
  { name: 'Helsana', logo: '🏥', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { name: 'Swica', logo: '🏥', color: 'bg-green-50 border-green-200 text-green-800' },
  { name: 'Sanitas', logo: '🏥', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { name: 'Other Provider', logo: '🏥', color: 'bg-gray-50 border-gray-200 text-gray-800' }
];

export const InsuranceModelSelector: React.FC<InsuranceModelSelectorProps> = ({
  hasInsurance,
  onInsuranceChange,
  model,
  onModelChange,
}) => {
  const [selectedProvider, setSelectedProvider] = React.useState('');

  return (
    <div className="space-y-6">
      {/* Swiss Insurance Trust Banner */}
      <div className="bg-[#004C96]/5 border border-[#004C96]/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-[#004C96]" />
          <div>
            <h4 className="font-semibold text-[#004C96] text-sm">Swiss Healthcare Compliance</h4>
            <p className="text-xs text-[#475259] mt-1">
              VAT included (7.7%) • All Swiss insurance providers accepted • Secure processing
            </p>
          </div>
        </div>
      </div>

      {/* Insurance Status */}
      <div className="space-y-4">
        <Label className="text-lg font-ibm-plex-sans font-semibold text-[#004C96] block">
          Swiss Health Insurance Status
        </Label>
        <p className="text-sm text-[#475259] mb-4">
          Swiss residents are required to have basic health insurance. This affects reimbursement eligibility.
        </p>
        
        <RadioGroup 
          value={hasInsurance ? 'yes' : 'no'} 
          onValueChange={(v) => onInsuranceChange(v === 'yes')}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
            hasInsurance ? 'border-[#004C96] bg-[#004C96]/5' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="yes" id="ins-yes" className="border-[#004C96] data-[state=checked]:bg-[#004C96]" />
              <div className="flex-1">
                <Label htmlFor="ins-yes" className="text-base font-medium cursor-pointer flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Yes, I have Swiss insurance
                </Label>
                <p className="text-sm text-[#475259] mt-1">
                  May be eligible for reimbursement depending on symptoms
                </p>
              </div>
            </div>
          </div>

          <div className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
            !hasInsurance ? 'border-[#8B7355] bg-[#8B7355]/5' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="no" id="ins-no" className="border-[#8B7355] data-[state=checked]:bg-[#8B7355]" />
              <div className="flex-1">
                <Label htmlFor="ins-no" className="text-base font-medium cursor-pointer flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#8B7355]" />
                  No insurance / Self-pay
                </Label>
                <p className="text-sm text-[#475259] mt-1">
                  Private payment option available
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Insurance Model Selection */}
      {hasInsurance && (
        <div className="space-y-4 animate-in slide-in-from-top duration-300">
          <Label htmlFor="model" className="text-base font-semibold text-[#004C96]">
            Select your insurance model
          </Label>
          <p className="text-sm text-[#475259] -mt-2">
            Your insurance model affects the reimbursement process and may require GP referral.
          </p>
          
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger id="model" className="h-auto p-4">
              <SelectValue placeholder="Choose your insurance model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard" className="h-auto p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#004C96]/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#004C96]" />
                  </div>
                  <div>
                    <div className="font-medium text-base">Standard/Flex Model</div>
                    <div className="text-sm text-[#475259] mt-1">
                      Free choice of doctor • Direct specialist access • Higher premiums
                    </div>
                  </div>
                </div>
              </SelectItem>
              
              <SelectItem value="hmo" className="h-auto p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-base">HMO/Family Doctor Model</div>
                    <div className="text-sm text-[#475259] mt-1">
                      Assigned family doctor • GP referral required • Lower premiums
                    </div>
                  </div>
                </div>
              </SelectItem>
              
              <SelectItem value="telmed" className="h-auto p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-base">Telemedicine Model</div>
                    <div className="text-sm text-[#475259] mt-1">
                      Call hotline first • Remote consultation required • Reduced premiums
                    </div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Swiss Insurance Provider Selection */}
          {model && (
            <div className="space-y-3 animate-in slide-in-from-top duration-300">
              <Label className="text-base font-semibold text-[#004C96]">
                Your Insurance Provider (Optional)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SWISS_INSURANCE_PROVIDERS.map((provider) => (
                  <div
                    key={provider.name}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                      selectedProvider === provider.name 
                        ? `${provider.color} border-current` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProvider(provider.name === selectedProvider ? '' : provider.name)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{provider.logo}</span>
                      <span className="font-medium text-sm">{provider.name}</span>
                      {selectedProvider === provider.name && (
                        <CheckCircle2 className="h-4 w-4 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Self-Pay Information */}
      {!hasInsurance && (
        <div className="bg-[#8B7355]/5 border border-[#8B7355]/20 p-4 rounded-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-[#8B7355] mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-[#8B7355] mb-1">Self-Pay Option</h4>
              <p className="text-sm text-[#475259] mb-3">
                You will proceed with private payment. The service includes:
              </p>
              <ul className="text-sm text-[#475259] space-y-1">
                <li>• 14-day Holter monitoring device</li>
                <li>• Professional medical analysis</li>
                <li>• Comprehensive heart rhythm report</li>
                <li>• Secure online results delivery</li>
                <li>• VAT included (7.7%)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};