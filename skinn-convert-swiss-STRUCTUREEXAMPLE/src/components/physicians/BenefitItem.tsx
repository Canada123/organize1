
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ title, description, icon: Icon, className }) => {
  return (
    <div className={`flex p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow ${className || ''}`}>
      <div className="mr-4 pt-1">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default BenefitItem;
