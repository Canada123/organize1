import React from 'react';
import { CheckCircle, Info, AlertTriangle, CreditCard, LucideIcon } from 'lucide-react';

interface StatusIconProps {
  status: 'eligible-insured' | 'screening-no-reimbursement' | 'self-pay' | 'contraindicated';
}

const iconMap: Record<string, { icon: LucideIcon; bgColor: string }> = {
  'eligible-insured': { icon: CheckCircle, bgColor: 'bg-green-600' },
  'screening-no-reimbursement': { icon: Info, bgColor: 'bg-amber-600' },
  'self-pay': { icon: CreditCard, bgColor: 'bg-[#8B7355]' },
  'contraindicated': { icon: AlertTriangle, bgColor: 'bg-red-600' }
};

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const config = iconMap[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
  );
};