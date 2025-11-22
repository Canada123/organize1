import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SimpleInsuranceInputProps {
  insuranceProvider?: string;
  onProviderChange: (provider: string) => void;
  className?: string;
}

export const SimpleInsuranceInput: React.FC<SimpleInsuranceInputProps> = ({
  insuranceProvider = '',
  onProviderChange,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label htmlFor="insurance-provider" className="block text-sm font-medium text-[#0D0D0D] mb-2">
          Insurance Provider
        </label>
        <input
          id="insurance-provider"
          type="text"
          placeholder="Enter your Swiss health insurance provider"
          value={insuranceProvider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="w-full px-4 py-2 border border-[#475259]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004C96]/20 focus:border-[#004C96] transition-all duration-200"
        />
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-900">Coverage Verification Pending</p>
          <p className="text-xs text-yellow-700 mt-1">
            We will verify coverage with your insurance provider after form submission. 
            Insurance integration is not yet automated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleInsuranceInput;