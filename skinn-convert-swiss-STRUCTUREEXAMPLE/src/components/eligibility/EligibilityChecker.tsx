import React from 'react';
import { EligibilityProvider, useEligibility } from './context/EligibilityContext';
import { EligibilityFormContainer } from './organisms/EligibilityFormContainer';
import { EligibilityResultCard } from './organisms/EligibilityResultCard';
import { useTranslation } from '@/hooks/useTranslation';

const EligibilityCheckerContent: React.FC = () => {
  const { state, dispatch } = useEligibility();
  const t = useTranslation('eligibility');

  const handleRestart = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  if (state.result) {
    return (
      <div className="bg-muted/20 py-16">
        <div className="container-custom">
          <EligibilityResultCard
            result={state.result}
            onRestart={handleRestart}
            translations={t}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 py-16">
      <div className="container-custom">
        <EligibilityFormContainer />
      </div>
    </div>
  );
};

const EligibilityChecker: React.FC = () => {
  return (
    <EligibilityProvider>
      <EligibilityCheckerContent />
    </EligibilityProvider>
  );
};

export default EligibilityChecker;