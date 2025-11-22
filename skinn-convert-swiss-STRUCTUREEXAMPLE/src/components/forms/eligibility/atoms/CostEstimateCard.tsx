import React from 'react';

interface CostEstimateCardProps {
  label: string;
  amount: string;
  currency?: string;
  note?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

export const CostEstimateCard: React.FC<CostEstimateCardProps> = ({
  label,
  amount,
  currency = 'CHF',
  note,
  bgColor = 'bg-white/70',
  borderColor = 'border-green-200',
  textColor = 'text-green-900'
}) => {
  return (
    <div className={`mt-4 p-3 ${bgColor} rounded-lg border ${borderColor}`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
        <span className={`text-lg font-bold ${textColor}`}>
          {currency} {amount}
        </span>
      </div>
      {note && (
        <p className={`text-xs ${textColor.replace('900', '700')} mt-1`}>
          {note}
        </p>
      )}
    </div>
  );
};