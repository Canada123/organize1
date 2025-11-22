// Main Component
export { default as EligibilityChecker } from './EligibilityChecker';

// Context
export { EligibilityProvider, useEligibility } from './context/EligibilityContext';

// Organisms
export { EligibilityFormContainer } from './organisms/EligibilityFormContainer';
export { EligibilityFormStep } from './organisms/EligibilityFormStep';
export { EligibilityResultCard } from './organisms/EligibilityResultCard';

// Molecules
export { EligibilitySymptomSelector } from './molecules/EligibilitySymptomSelector';
export { EligibilityRiskFactorSelector } from './molecules/EligibilityRiskFactorSelector';
export { EligibilityInsurerSelector } from './molecules/EligibilityInsurerSelector';
export { EligibilityResultIcon } from './molecules/EligibilityResultIcon';
export { EligibilityNextStepsList } from './molecules/EligibilityNextStepsList';
export { EligibilityInsuranceInfo } from './molecules/EligibilityInsuranceInfo';

// Atoms
export { EligibilityProgressBar } from './atoms/EligibilityProgressBar';
export { EligibilityResultBadge } from './atoms/EligibilityResultBadge';
export { EligibilityNextStepItem } from './atoms/EligibilityNextStepItem';

// Utils & Data
export { calculateEligibility } from './utils/eligibilityCalculator';
export { 
  SWISS_INSURERS, 
  getSymptomOptions, 
  getRiskFactorOptions, 
  getInsuranceModelOptions 
} from './data/swissHealthcareData';
export type { 
  EligibilityResult, 
  EligibilityFormData, 
  SelectOption, 
  EligibilityStep 
} from './data/types';