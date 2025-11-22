
import React from 'react';
import { Shield, Check, Lock, Award } from 'lucide-react';

const TrustBadges = () => {
  return (
    <div className="flex flex-wrap gap-4 pt-4">
      <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary mr-3">
          <Award className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-sm font-medium">ISO-13485 Certified</span>
      </div>
      <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary mr-3">
          <Shield className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-sm font-medium">CE Medical Device</span>
      </div>
      <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary mr-3">
          <Check className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-sm font-medium">Clinically Tested</span>
      </div>
      <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary mr-3">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-sm font-medium">Swiss Data Hosting</span>
      </div>
    </div>
  );
};

export default TrustBadges;
