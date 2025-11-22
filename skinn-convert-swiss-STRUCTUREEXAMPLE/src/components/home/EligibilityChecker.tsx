import React from 'react';
import { EligibilityChecker } from '@/components/eligibility';

// Legacy wrapper - maintains backward compatibility
// Now uses the new atomic component architecture
const EligibilityCheckerWrapper: React.FC = () => {
  return <EligibilityChecker />;
};

export default EligibilityCheckerWrapper;