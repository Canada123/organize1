import React, { useState } from 'react';
import { MinimalCard, MinimalCardContent } from '@/components/ui/minimal-card';
import { Check, Search, Info, Building2 } from 'lucide-react';

interface InsuranceProvider {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  models: string[];
  popularityRank: number;
}

interface MinimalInsuranceSelectorProps {
  selectedProvider?: string;
  selectedModel?: string;
  onProviderChange: (providerId: string) => void;
  onModelChange: (model: string) => void;
  className?: string;
}

// NOTE: This is a placeholder for future Swiss insurance API integration
// We do NOT have real insurance provider data or API access yet

const MODEL_DESCRIPTIONS: Record<string, string> = {
  'Standard': 'Free choice of doctor, full flexibility',
  'HMO': 'Health Maintenance Organization center',
  'Hausarzt': 'Family doctor as first contact',
  'Telmed': 'Telephone consultation first',
  'FAVORIT': 'SWICA partner network',
  'BeneFit PLUS': 'Helsana network doctors',
  'PREMED': 'Telemedicine consultation',
  'MedCare': 'Sanitas medical centers'
};

export const MinimalInsuranceSelector: React.FC<MinimalInsuranceSelectorProps> = ({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModelInfo, setShowModelInfo] = useState(false);

  const filteredProviders = SWISS_PROVIDERS.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProviderData = SWISS_PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Provider Selection */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#0D0D0D] mb-2">
            Select Your Insurance Provider
          </h3>
          <p className="text-sm text-[#475259]">
            Choose from major Swiss health insurance companies
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#475259]" />
          <input
            type="text"
            placeholder="Search insurance provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#475259]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004C96]/20 focus:border-[#004C96] transition-all duration-200"
          />
        </div>

        {/* Provider Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => {
                onProviderChange(provider.id);
                onModelChange(''); // Reset model when provider changes
              }}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                hover:shadow-md hover:border-[#5298F2]
                ${selectedProvider === provider.id 
                  ? 'border-[#004C96] bg-[#004C96]/5' 
                  : 'border-[#475259]/20 bg-white'}
              `}
            >
              {/* Selected Indicator */}
              {selectedProvider === provider.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-[#004C96] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Provider Icon */}
              <div className="flex justify-center mb-2">
                <Building2 className="w-8 h-8 text-[#004C96]" />
              </div>

              {/* Provider Name */}
              <div className="text-center">
                <p className="font-medium text-[#0D0D0D]">{provider.shortName}</p>
                <p className="text-xs text-[#475259] mt-1">{provider.name}</p>
              </div>

              {/* Popularity Badge */}
              {provider.popularityRank <= 3 && (
                <div className="absolute top-2 left-2">
                  <span className="text-xs bg-[#5549A6]/10 text-[#5549A6] px-2 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-8 text-[#475259]">
            <p>No insurance providers found</p>
          </div>
        )}
      </div>

      {/* Model Selection */}
      {selectedProviderData && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#0D0D0D] mb-2">
                Select Your Insurance Model
              </h3>
              <p className="text-sm text-[#475259]">
                Different models offer various benefits and restrictions
              </p>
            </div>
            <button
              onClick={() => setShowModelInfo(!showModelInfo)}
              className="text-[#004C96] hover:text-[#5298F2] transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Model Info Box */}
          {showModelInfo && (
            <MinimalCard variant="soft" className="mb-4">
              <MinimalCardContent className="p-4">
                <h4 className="font-medium text-[#0D0D0D] mb-3">Insurance Model Guide</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-[#004C96]">Standard:</span>
                    <span className="text-[#475259] ml-2">Free choice of doctors and specialists</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#004C96]">HMO:</span>
                    <span className="text-[#475259] ml-2">Treatment at HMO centers, lower premiums</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#004C96]">Hausarzt:</span>
                    <span className="text-[#475259] ml-2">Family doctor coordinates all care</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#004C96]">Telmed:</span>
                    <span className="text-[#475259] ml-2">Call before visiting, most affordable</span>
                  </div>
                </div>
              </MinimalCardContent>
            </MinimalCard>
          )}

          {/* Model Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedProviderData.models.map((model) => (
              <button
                key={model}
                onClick={() => onModelChange(model)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left
                  hover:shadow-md hover:border-[#5298F2]
                  ${selectedModel === model 
                    ? 'border-[#004C96] bg-[#004C96]/5' 
                    : 'border-[#475259]/20 bg-white'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[#0D0D0D]">{model}</p>
                    {MODEL_DESCRIPTIONS[model] && (
                      <p className="text-xs text-[#475259] mt-1">
                        {MODEL_DESCRIPTIONS[model]}
                      </p>
                    )}
                  </div>
                  {selectedModel === model && (
                    <Check className="w-5 h-5 text-[#004C96] ml-2 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Coverage Notice */}
      {selectedProvider && selectedModel && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">Great Choice!</p>
              <p className="text-sm text-green-700 mt-1">
                SKIIN monitoring is covered by your {selectedProviderData?.name} {selectedModel} plan.
                We'll handle the insurance billing directly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalInsuranceSelector;