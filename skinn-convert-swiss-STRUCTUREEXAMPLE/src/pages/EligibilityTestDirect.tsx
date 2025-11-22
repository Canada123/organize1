import React, { useState } from 'react';
import { EligibilityGateStage } from '@/components/forms/eligibility/stages/EligibilityGateStageRefactored';

const EligibilityTestDirect = () => {
  const [data, setData] = useState({});
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Testing Refactored EligibilityGateStage
        </h1>
        <EligibilityGateStage
          data={data}
          onUpdate={setData}
          onNext={() => console.log('Next clicked', data)}
          onBack={() => console.log('Back clicked')}
        />
      </div>
    </div>
  );
};

export default EligibilityTestDirect;