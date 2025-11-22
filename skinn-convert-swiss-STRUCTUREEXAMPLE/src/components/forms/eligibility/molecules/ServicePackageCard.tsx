import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ServicePackageCardProps {
  title: string;
  price: string;
  currency?: string;
  features: string[];
  vatIncluded?: boolean;
  borderColor?: string;
  bgColor?: string;
}

export const ServicePackageCard: React.FC<ServicePackageCardProps> = ({
  title,
  price,
  currency = 'CHF',
  features,
  vatIncluded = true,
  borderColor = 'border-[#8B7355]/20',
  bgColor = 'bg-white/70'
}) => {
  return (
    <div className={`p-4 ${bgColor} rounded-lg border ${borderColor}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-[#8B7355]">{title}</h4>
        <span className="text-2xl font-bold text-[#8B7355]">
          {currency} {price}
        </span>
      </div>
      {vatIncluded && (
        <p className="text-xs text-[#475259] mb-3">
          VAT included (7.7%) • No hidden fees • Payment upon device collection
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-3 text-sm text-[#475259]">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};