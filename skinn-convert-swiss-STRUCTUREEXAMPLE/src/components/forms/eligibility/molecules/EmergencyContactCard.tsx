import React from 'react';
import { Phone } from 'lucide-react';

interface EmergencyContactCardProps {
  severity: 'high' | 'medium';
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  severity
}) => {
  const bgColor = severity === 'high' ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300';
  
  return (
    <div className={`border-2 rounded-xl p-5 ${bgColor}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Phone className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-red-900 text-lg mb-2">Swiss Emergency Services</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white/70 rounded-lg p-3 border border-red-200">
              <div>
                <p className="font-semibold text-red-900">Medical Emergency</p>
                <p className="text-sm text-red-700">24/7 Emergency Response</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-900">144</p>
                <p className="text-xs text-red-700">Free from any phone</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white/70 rounded-lg p-3 border border-red-200">
              <div>
                <p className="font-semibold text-red-900">European Emergency</p>
                <p className="text-sm text-red-700">Alternative emergency line</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-900">112</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};