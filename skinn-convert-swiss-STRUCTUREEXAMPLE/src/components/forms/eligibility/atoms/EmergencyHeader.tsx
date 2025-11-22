import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface EmergencyHeaderProps {
  title: string;
  message: string;
  severity: 'high' | 'medium';
  urgency: string;
}

export const EmergencyHeader: React.FC<EmergencyHeaderProps> = ({
  title,
  message,
  severity,
  urgency
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-full ${
        severity === 'high' ? 'bg-red-600' : 'bg-amber-500'
      } shadow-lg`}>
        <AlertTriangle className="h-7 w-7 text-white animate-pulse" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {title}
          </DialogTitle>
          <div className={`px-2 py-1 rounded text-xs font-bold ${
            severity === 'high'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            {urgency}
          </div>
        </div>
        <DialogDescription className="text-base text-gray-700 leading-relaxed">
          {message}
        </DialogDescription>
      </div>
    </div>
  );
};