import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SafetyNoticeProps {
  symptom: string;
}

export const SafetyNotice: React.FC<SafetyNoticeProps> = ({ symptom }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0 animate-pulse" />
        <div>
          <h4 className="font-bold text-red-900 mb-1">Critical Safety Notice</h4>
          <p className="text-sm text-red-800 leading-relaxed">
            <strong>Do not delay medical care.</strong> If you are currently experiencing {symptom.toLowerCase()},
            this assessment should be postponed until after you receive appropriate medical evaluation
            and treatment. Your safety is our highest priority.
          </p>
        </div>
      </div>
    </div>
  );
};