# Eligibility Form Design System
**Version**: 1.0  
**Created**: 2025-08-19  
**Purpose**: Comprehensive UI/UX design specifications for the SKIIN Switzerland multi-step eligibility questionnaire  
**Theme**: S&W Design System Integration  

## 1. Design Philosophy & Principles

### 1.1 Core Design Values
```typescript
interface DesignPrinciples {
  trust: "Medical-grade professionalism with human warmth";
  clarity: "Complex medical data made approachable";
  accessibility: "Beyond WCAG 2.1 AA - cognitive disability support";
  efficiency: "Minimize form abandonment through smart UX";
  culturalSensitivity: "Swiss healthcare context awareness";
}
```

### 1.2 Swiss Healthcare Context
- **Formal Language**: Always use formal addressing (Sie/vous/Lei)
- **Privacy First**: Clear data handling explanations at every step
- **Insurance Complexity**: Multiple models and providers require smart filtering
- **Medical Authority**: Respect for GP referral system
- **Multilingual**: Seamless switching between EN, DE, FR, IT

## 2. Extended Design Tokens

### 2.1 Color System Extension
```css
/* Form-Specific Colors extending S&W Design */
:root {
  /* Primary Actions & Progress */
  --form-primary: #5298F2;           /* S&W Primary Blue - Continue buttons */
  --form-primary-hover: #3D7FD9;     /* Darker blue for hover states */
  --form-primary-disabled: #A9CBEF;   /* Disabled state blue */
  
  /* Validation & Feedback */
  --form-success: #00C853;           /* Swiss green - validation success */
  --form-success-bg: #E8F5E9;        /* Light green background */
  --form-warning: #FFB300;           /* Amber - warnings */
  --form-warning-bg: #FFF3E0;        /* Light amber background */
  --form-error: #D32F2F;             /* Medical red - errors/contraindications */
  --form-error-bg: #FFEBEE;          /* Light red background */
  --form-info: #5549A6;              /* S&W Purple - information */
  --form-info-bg: #F3E5F5;           /* Light purple background */
  
  /* Medical Context */
  --form-emergency: #FF1744;         /* Emergency red - contraindications */
  --form-medical-bg: #E3F2FD;        /* Medical information backgrounds */
  --form-medical-border: #90CAF9;    /* Medical section borders */
  
  /* Trust & Security */
  --form-secure: #004C96;            /* S&W Dark Blue - security badges */
  --form-trust-bg: #F5F5F5;          /* Trust signal backgrounds */
  --form-lock-icon: #757575;         /* Security icon color */
  
  /* Progress Indicators */
  --form-progress-complete: #00C853;  /* Completed steps */
  --form-progress-active: #5298F2;    /* Current step */
  --form-progress-upcoming: #E0E0E0;  /* Future steps */
  --form-progress-branch: #5549A6;    /* Conditional branches */
}
```

### 2.2 Typography Extensions
```css
/* Medical Form Typography */
.form-heading-primary {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1.75rem;  /* 28px */
  font-weight: 600;
  line-height: 1.3;
  color: var(--lp-dark-blue);
}

.form-heading-secondary {
  font-size: 1.25rem;  /* 20px */
  font-weight: 500;
  line-height: 1.4;
  color: var(--lp-charcoal);
}

.form-label {
  font-size: 0.875rem;  /* 14px */
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--lp-charcoal);
}

.form-help-text {
  font-size: 0.875rem;  /* 14px */
  font-weight: 400;
  color: #757575;
  line-height: 1.5;
}

.form-error-text {
  font-size: 0.8125rem;  /* 13px */
  font-weight: 500;
  color: var(--form-error);
}

.medical-term {
  border-bottom: 1px dotted var(--form-info);
  cursor: help;
}
```

### 2.3 Spacing & Layout
```css
/* Form-Specific Spacing */
:root {
  --form-section-gap: 3rem;          /* Between major sections */
  --form-field-gap: 1.5rem;          /* Between form fields */
  --form-label-gap: 0.5rem;          /* Label to input */
  --form-help-gap: 0.375rem;         /* Input to help text */
  --form-container-padding: 2rem;     /* Form container padding */
  --form-mobile-padding: 1rem;        /* Mobile container padding */
  
  /* Responsive Container Widths */
  --form-max-width: 720px;           /* Standard form width */
  --form-narrow-width: 480px;        /* OTP/simple forms */
  --form-wide-width: 960px;          /* Insurance selection */
}
```

### 2.4 Animation & Transitions
```css
/* Medical-Grade Smooth Transitions */
:root {
  --form-transition-fast: 150ms ease-out;
  --form-transition-normal: 250ms ease-in-out;
  --form-transition-slow: 400ms ease-in-out;
  --form-transition-progress: 600ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Micro-interaction Timings */
  --form-hover-delay: 50ms;
  --form-tooltip-delay: 300ms;
  --form-error-shake: 500ms;
  --form-success-pulse: 1000ms;
}

@keyframes form-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

@keyframes form-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

@keyframes form-slide-in {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
```

## 3. Component Specifications

### 3.1 FormStepper Component
```typescript
interface FormStepperProps {
  stages: FormStage[];
  currentStage: number;
  currentStep: number;
  completedStages: number[];
  conditionalBranches: BranchIndicator[];
  variant: 'horizontal' | 'vertical' | 'circular';
  showLabels: boolean;
  animated: boolean;
}

interface FormStage {
  id: string;
  label: string;
  steps: FormStep[];
  icon: LucideIcon;
  status: 'complete' | 'active' | 'upcoming' | 'conditional';
  estimatedTime?: string;
}

interface BranchIndicator {
  fromStage: number;
  toStage: number;
  condition: string;
  probability: 'high' | 'medium' | 'low';
}
```

**Visual Design**:
- Desktop: Horizontal stepper with connecting lines and branch indicators
- Tablet: Compact horizontal with abbreviated labels
- Mobile: Vertical accordion-style with current stage expanded
- Animations: Smooth progress bar fill, checkmark animations on completion
- Branch visualization: Dotted lines for conditional paths with tooltip explanations

### 3.2 OTPInput Component
```typescript
interface OTPInputProps {
  length: 6;
  type: 'numeric' | 'alphanumeric';
  autoFocus: boolean;
  onComplete: (code: string) => void;
  onResend: () => void;
  resendDelay: number; // seconds
  errorMessage?: string;
  successMessage?: string;
  channel: 'email' | 'phone';
  maskedContact?: string; // e.g., "****@example.com"
}
```

**UX Features**:
- Auto-advance on digit entry
- Paste support for code from SMS/email
- Visual feedback for each digit (border color change)
- Countdown timer for resend with progress arc
- Clear error states with shake animation
- Success state with checkmark animation
- Accessibility: ARIA live regions for screen readers

### 3.3 InsuranceSelector Component
```typescript
interface InsuranceSelectorProps {
  providers: SwissInsuranceProvider[];
  selectedProvider?: string;
  selectedModel?: string;
  onSelect: (provider: string, model: string) => void;
  showPopularBadge: boolean;
  groupByRegion: boolean;
  enableSearch: boolean;
}

interface SwissInsuranceProvider {
  id: string;
  name: string;
  logo: string;
  models: InsuranceModel[];
  regions: string[];
  popularityRank?: number;
  color: string; // Brand color
}

interface InsuranceModel {
  id: string;
  name: string;
  coverage: 'basic' | 'semi-private' | 'private';
  skiiinCovered: boolean;
  franchiseOptions: number[];
  description: string;
}
```

**Visual Layout**:
- Grid of insurance cards with logos
- Two-step selection: Provider → Model
- Popular providers highlighted with badge
- Search/filter by region or name
- Model details in expandable cards
- Visual indicators for SKIIN coverage

### 3.4 MedicalQuestionnaire Component
```typescript
interface MedicalQuestionnaireProps {
  questions: MedicalQuestion[];
  onAnswer: (questionId: string, answer: any) => void;
  showProgressBar: boolean;
  enableSkip: boolean;
  emergencyCallback: (contraindication: string) => void;
}

interface MedicalQuestion {
  id: string;
  category: 'symptoms' | 'history' | 'medications' | 'lifestyle';
  question: string;
  helpText?: string;
  inputType: 'boolean' | 'select' | 'multiselect' | 'scale' | 'date';
  options?: QuestionOption[];
  conditional?: ConditionalLogic;
  contraindication?: boolean;
  required: boolean;
}

interface ConditionalLogic {
  showIf: {
    questionId: string;
    value: any;
  }[];
  hideIf?: {
    questionId: string;
    value: any;
  }[];
}
```

**UX Patterns**:
- Progressive disclosure: Show questions based on previous answers
- Medical term tooltips with plain language explanations
- Visual severity indicators (green/yellow/red)
- Emergency alert modal for contraindications
- Save progress with encrypted local storage
- Branch to emergency instructions if needed

### 3.5 PaymentForm Component
```typescript
interface PaymentFormProps {
  amount: number;
  currency: 'CHF';
  paymentMethods: PaymentMethod[];
  selectedMethod?: string;
  billingAddress: Address;
  onPayment: (token: string) => void;
  showSecurity: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'twint' | 'postfinance' | 'invoice';
  label: string;
  icon: string;
  popular: boolean;
}
```

**Swiss Payment Integration**:
- TWINT integration for Swiss mobile payments
- PostFinance card support
- Invoice option for certain insurance models
- Security badges (SSL, PCI compliance)
- Price breakdown with VAT
- Animated payment processing indicator

### 3.6 DocumentUpload Component
```typescript
interface DocumentUploadProps {
  acceptedFormats: string[];
  maxSize: number; // MB
  maxFiles: number;
  uploadType: 'ecg' | 'prescription' | 'insurance' | 'id';
  onUpload: (files: UploadedFile[]) => void;
  enableCamera: boolean;
  enableScanner: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress?: number;
}
```

**Features**:
- Drag & drop with visual feedback
- Mobile camera capture for documents
- PDF preview capability
- Upload progress with cancel option
- File validation with clear error messages
- Automatic image optimization
- HIPAA-compliant secure upload

### 3.7 ConsentManager Component
```typescript
interface ConsentManagerProps {
  consents: ConsentItem[];
  onUpdate: (consentId: string, granted: boolean) => void;
  showDetails: boolean;
  groupByCategory: boolean;
  gdprCompliant: boolean;
}

interface ConsentItem {
  id: string;
  category: 'essential' | 'medical' | 'marketing' | 'research';
  title: string;
  description: string;
  required: boolean;
  defaultChecked: boolean;
  detailsUrl?: string;
  legalBasis: 'consent' | 'contract' | 'legitimate_interest';
}
```

**GDPR Compliance**:
- Clear categorization of consent types
- Granular control over data usage
- Easy-to-understand language
- Links to detailed privacy policies
- Consent withdrawal mechanism
- Audit trail for consent changes

### 3.8 ProgressSaver Component
```typescript
interface ProgressSaverProps {
  formData: any;
  currentStage: number;
  currentStep: number;
  saveInterval: number; // seconds
  onSave: (data: SavedProgress) => void;
  onRestore: (data: SavedProgress) => void;
  enableCloud: boolean;
  enableLocal: boolean;
}

interface SavedProgress {
  id: string;
  timestamp: Date;
  expiresAt: Date;
  data: any;
  stage: number;
  step: number;
  completionPercentage: number;
}
```

**Session Management**:
- Auto-save every 30 seconds
- Visual save indicator
- Resume from email link
- Session expiry warnings
- Offline capability detection
- Conflict resolution for multiple sessions

## 4. Responsive Design Patterns

### 4.1 Breakpoint Strategy
```scss
// Form-specific breakpoints
$form-breakpoints: (
  'mobile': 375px,   // Minimum supported
  'phablet': 480px,  // Larger phones
  'tablet': 768px,   // Tablets
  'desktop': 1024px, // Desktop
  'wide': 1440px     // Wide screens
);

// Container widths per breakpoint
.form-container {
  width: 100%;
  max-width: var(--form-max-width);
  margin: 0 auto;
  padding: var(--form-mobile-padding);
  
  @media (min-width: 768px) {
    padding: var(--form-container-padding);
  }
  
  @media (min-width: 1024px) {
    padding: var(--form-container-padding) 3rem;
  }
}
```

### 4.2 Mobile-First Patterns
```typescript
// Mobile optimizations
const mobilePatterns = {
  // Touch targets minimum 44x44px
  touchTarget: {
    minHeight: '44px',
    minWidth: '44px',
    padding: '12px',
  },
  
  // Stacked layout for mobile
  layout: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--form-field-gap)',
  },
  
  // Full-width inputs on mobile
  input: {
    width: '100%',
    fontSize: '16px', // Prevents zoom on iOS
  },
  
  // Bottom-sheet pattern for modals
  modal: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: '16px 16px 0 0',
  },
};
```

### 4.3 Tablet Adaptations
```typescript
const tabletPatterns = {
  // Two-column layout for related fields
  gridLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--form-field-gap)',
  },
  
  // Side-by-side labels
  inlineLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  // Floating action bar
  actionBar: {
    position: 'sticky',
    bottom: '1rem',
    backgroundColor: 'white',
    padding: '1rem',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
  },
};
```

### 4.4 Desktop Enhancements
```typescript
const desktopPatterns = {
  // Split-screen layout
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '3rem',
  },
  
  // Sidebar progress indicator
  sidebar: {
    position: 'sticky',
    top: '2rem',
    maxHeight: 'calc(100vh - 4rem)',
  },
  
  // Inline validation
  inlineValidation: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  
  // Keyboard shortcuts
  shortcuts: {
    'Enter': 'Next field',
    'Shift+Enter': 'Previous field',
    'Cmd+S': 'Save progress',
    'Esc': 'Close modal',
  },
};
```

## 5. Accessibility Enhancements

### 5.1 WCAG 2.1 AA+ Compliance
```typescript
interface AccessibilityFeatures {
  // Visual
  colorContrast: {
    normal: '4.5:1',
    large: '3:1',
    enhanced: '7:1', // AAA level
  };
  
  // Keyboard Navigation
  keyboard: {
    tabIndex: 'logical-order',
    skipLinks: true,
    focusVisible: 'always',
    trapFocus: 'modals-only',
  };
  
  // Screen Readers
  aria: {
    liveRegions: ['errors', 'success', 'progress'],
    landmarks: true,
    labels: 'descriptive',
    descriptions: 'contextual',
  };
  
  // Cognitive Support
  cognitive: {
    clearLanguage: true,
    consistentNavigation: true,
    errorRecovery: true,
    timeoutWarnings: true,
    progressIndicators: true,
  };
}
```

### 5.2 Cognitive Disability Support
```typescript
const cognitiveSupport = {
  // Simplified language mode
  simplifiedMode: {
    enabled: true,
    medicalTerms: 'plain-language',
    instructions: 'step-by-step',
    sentences: 'short-and-clear',
  },
  
  // Visual aids
  visualAids: {
    icons: 'alongside-text',
    colors: 'meaningful-not-sole-indicator',
    progress: 'visual-and-textual',
    diagrams: 'optional-supplements',
  },
  
  // Error prevention
  errorPrevention: {
    confirmDestructive: true,
    autoSaveProgress: true,
    undoActions: true,
    clearWarnings: true,
  },
  
  // Time management
  timeManagement: {
    noTimeouts: 'critical-actions',
    extendableTimers: true,
    pauseCapability: true,
    saveAndResume: true,
  },
};
```

### 5.3 Multi-Modal Feedback
```typescript
const feedbackModes = {
  visual: {
    colors: ['success-green', 'error-red', 'warning-amber'],
    icons: ['checkmark', 'exclamation', 'info'],
    animations: ['pulse', 'shake', 'slide'],
    borders: ['thick', 'dashed', 'animated'],
  },
  
  auditory: {
    sounds: ['success-chime', 'error-buzz', 'notification'],
    screenReader: ['aria-live', 'aria-atomic'],
    voiceGuidance: 'optional',
  },
  
  haptic: {
    mobile: ['success-tap', 'error-vibrate'],
    intensity: 'user-adjustable',
  },
  
  textual: {
    messages: 'clear-and-actionable',
    helpText: 'contextual',
    tooltips: 'on-demand',
    summaries: 'comprehensive',
  },
};
```

## 6. Error Handling & Validation

### 6.1 Validation Strategy
```typescript
interface ValidationStrategy {
  timing: 'on-blur' | 'on-submit' | 'real-time';
  level: 'field' | 'section' | 'form';
  
  rules: {
    required: ValidationRule;
    format: ValidationRule;
    range: ValidationRule;
    custom: ValidationRule;
  };
  
  feedback: {
    inline: boolean;
    summary: boolean;
    progressive: boolean;
  };
}

interface ValidationRule {
  validate: (value: any) => boolean;
  message: (value: any) => string;
  severity: 'error' | 'warning' | 'info';
}
```

### 6.2 Error Recovery
```typescript
const errorRecovery = {
  // Smart error messages
  messages: {
    specific: 'Email must include @ symbol',
    actionable: 'Please enter a valid email address',
    helpful: 'Example: name@example.com',
  },
  
  // Auto-correction suggestions
  suggestions: {
    typos: 'Did you mean gmail.com?',
    format: 'Phone number should be 10 digits',
    range: 'Please enter a year between 1900 and 2024',
  },
  
  // Recovery actions
  actions: {
    retry: 'Try again with corrected information',
    skip: 'Skip this field for now',
    help: 'Get help with this field',
    alternative: 'Use alternative input method',
  },
};
```

### 6.3 Medical Safety Validation
```typescript
interface MedicalSafetyValidation {
  contraindications: {
    immediate: string[]; // Stop immediately
    warning: string[];   // Show warning but allow continuation
    referral: string[];  // Suggest GP consultation
  };
  
  emergencyProtocol: {
    trigger: (response: any) => boolean;
    action: 'show-emergency-modal' | 'redirect-emergency' | 'call-support';
    message: string;
    contactInfo: EmergencyContact;
  };
  
  dataIntegrity: {
    crossValidation: boolean;  // Validate related fields together
    rangeChecks: boolean;      // Ensure medical values are realistic
    consistencyChecks: boolean; // Check for conflicting responses
  };
}
```

## 7. Animation & Micro-interactions

### 7.1 Form Transitions
```scss
// Smooth section transitions
.form-section-enter {
  animation: form-slide-in var(--form-transition-slow) ease-out;
  animation-fill-mode: both;
}

.form-section-exit {
  animation: form-slide-out var(--form-transition-slow) ease-in;
  animation-fill-mode: both;
}

// Progress bar animation
.progress-bar-fill {
  transition: width var(--form-transition-progress);
  will-change: width;
}

// Success state animation
.field-success {
  animation: form-pulse var(--form-success-pulse) ease-in-out;
}

// Error shake
.field-error {
  animation: form-shake var(--form-error-shake) ease-in-out;
}
```

### 7.2 Interactive Feedback
```typescript
const microInteractions = {
  // Input focus
  inputFocus: {
    borderColor: 'var(--form-primary)',
    boxShadow: '0 0 0 3px rgba(82, 152, 242, 0.1)',
    labelTransform: 'translateY(-1.5rem) scale(0.85)',
  },
  
  // Button interactions
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  
  buttonActive: {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  // Checkbox/Radio animations
  checkboxCheck: {
    animation: 'check-mark 300ms ease-out',
    strokeDasharray: '24',
    strokeDashoffset: '0',
  },
  
  // Tooltip appearance
  tooltipShow: {
    animation: 'fade-in 200ms ease-out',
    transformOrigin: 'center bottom',
  },
};
```

### 7.3 Loading States
```typescript
const loadingStates = {
  // Skeleton screens
  skeleton: {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
  
  // Progress indicators
  circular: {
    strokeDasharray: '89, 200',
    strokeDashoffset: '-35',
    animation: 'circular-rotate 1.4s linear infinite',
  },
  
  // Step transitions
  stepLoading: {
    opacity: 0.6,
    pointerEvents: 'none',
    filter: 'blur(1px)',
  },
  
  // Smart loading messages
  messages: [
    'Verifying your information...',
    'Checking insurance coverage...',
    'Preparing your personalized form...',
    'Almost there...',
  ],
};
```

## 8. Cultural Adaptations

### 8.1 Swiss Healthcare Context
```typescript
interface SwissHealthcareAdaptations {
  // Language formality
  addressing: {
    de: 'Sie', // Formal German
    fr: 'vous', // Formal French
    it: 'Lei', // Formal Italian
    en: 'you', // Neutral English
  };
  
  // Insurance system
  insurance: {
    mandatory: 'LAMal/KVG',
    supplementary: 'VVG',
    franchise: [300, 500, 1000, 1500, 2000, 2500],
    models: ['Standard', 'HMO', 'Telmed', 'Family Doctor'],
  };
  
  // Medical references
  medical: {
    gpSystem: 'Hausarzt-Modell',
    referralRequired: boolean;
    emergencyNumber: '144',
    medicalHotline: '0800 33 66 55',
  };
  
  // Privacy expectations
  privacy: {
    dataLocation: 'Switzerland only',
    encryption: 'Swiss standards',
    consent: 'Explicit required',
    retention: 'Minimal period',
  };
}
```

### 8.2 Regional Variations
```typescript
const regionalVariations = {
  'de-CH': {
    dateFormat: 'DD.MM.YYYY',
    numberFormat: "1'234.56",
    currency: 'CHF',
    phoneFormat: '+41 XX XXX XX XX',
  },
  
  'fr-CH': {
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1 234,56',
    currency: 'CHF',
    phoneFormat: '+41 XX XXX XX XX',
  },
  
  'it-CH': {
    dateFormat: 'DD.MM.YYYY',
    numberFormat: "1'234.56",
    currency: 'CHF',
    phoneFormat: '+41 XX XXX XX XX',
  },
};
```

### 8.3 Trust Signals
```typescript
const trustSignals = {
  // Swiss quality badges
  badges: [
    'Swissmedic Approved',
    'Swiss Made Software',
    'Data Protection CH',
    'ISO 13485 Medical Device',
  ],
  
  // Security indicators
  security: {
    icon: 'swiss-lock',
    text: 'Your data stays in Switzerland',
    encryption: 'Bank-level encryption',
    compliance: 'GDPR & Swiss DPA compliant',
  },
  
  // Medical credibility
  medical: {
    doctors: 'Swiss medical team',
    review: 'Cardiologist reviewed',
    certification: 'MDR Class IIa',
    studies: 'Swiss clinical studies',
  },
  
  // Customer support
  support: {
    languages: ['DE', 'FR', 'IT', 'EN'],
    availability: 'Mon-Fri 8:00-18:00 CET',
    channels: ['Phone', 'Email', 'Chat'],
    responseTime: '< 2 hours',
  },
};
```

## 9. Performance Optimization

### 9.1 Form Performance Metrics
```typescript
interface FormPerformanceTargets {
  // Loading metrics
  initialLoad: '< 2s';
  stepTransition: '< 300ms';
  validationFeedback: '< 100ms';
  saveProgress: '< 500ms';
  
  // Interaction metrics
  inputLatency: '< 50ms';
  scrollPerformance: '60 fps';
  animationFPS: '60 fps';
  
  // Bundle sizes
  jsBundle: '< 150KB gzipped';
  cssBundle: '< 30KB gzipped';
  totalAssets: '< 500KB';
}
```

### 9.2 Optimization Strategies
```typescript
const optimizations = {
  // Code splitting
  codeSplitting: {
    routes: 'lazy-load-per-stage',
    components: 'dynamic-imports',
    validations: 'load-on-demand',
  },
  
  // Asset optimization
  assets: {
    images: 'WebP with fallback',
    icons: 'SVG sprites',
    fonts: 'subset and preload',
  },
  
  // State management
  state: {
    debounce: 'input-validation',
    throttle: 'scroll-events',
    memoize: 'expensive-calculations',
  },
  
  // Caching
  caching: {
    formData: 'localStorage',
    assets: 'service-worker',
    api: 'response-caching',
  },
};
```

## 10. Implementation Guidelines

### 10.1 Component Structure
```typescript
// Base form component structure
export const FormComponent: FC<FormComponentProps> = ({
  children,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { trackEvent } = useAnalytics();
  
  return (
    <div 
      className={cn(
        'form-component',
        'sw-design', // Always use S&W Design
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

### 10.2 Styling Approach
```scss
// Component styling with S&W Design
.form-component {
  // Use CSS variables for theming
  background: var(--lp-white);
  color: var(--lp-charcoal);
  
  // Mobile-first responsive
  padding: var(--form-mobile-padding);
  
  @media (min-width: 768px) {
    padding: var(--form-container-padding);
  }
  
  // Accessibility always
  &:focus-visible {
    outline: 2px solid var(--form-primary);
    outline-offset: 2px;
  }
  
  // Smooth transitions
  transition: all var(--form-transition-normal);
}
```

### 10.3 Testing Requirements
```typescript
const testingRequirements = {
  unit: {
    coverage: '> 90%',
    validation: 'all-rules',
    accessibility: 'jest-axe',
  },
  
  integration: {
    userFlows: 'all-paths',
    errorScenarios: 'comprehensive',
    edgeCases: 'documented',
  },
  
  e2e: {
    browsers: ['Chrome', 'Safari', 'Firefox'],
    devices: ['iPhone', 'Android', 'iPad'],
    languages: ['EN', 'DE', 'FR', 'IT'],
  },
  
  performance: {
    lighthouse: '> 95',
    bundleSize: 'tracked',
    runtimePerf: 'monitored',
  },
};
```

## 11. Medical Emergency Handling

### 11.1 Contraindication Detection
```typescript
interface ContraindicationSystem {
  // Immediate stop conditions
  criticalConditions: [
    'Pregnancy',
    'Pacemaker/ICD',
    'Acute chest pain',
    'Recent heart attack',
    'Severe arrhythmia',
  ];
  
  // Warning conditions
  warningConditions: [
    'Diabetes',
    'Hypertension',
    'Previous cardiac events',
    'Family history',
  ];
  
  // Response protocol
  protocol: {
    critical: {
      action: 'block-progression',
      message: 'medical-consultation-required',
      showEmergencyContact: true,
      logEvent: true,
    },
    warning: {
      action: 'show-disclaimer',
      allowContinue: true,
      requireConfirmation: true,
      additionalQuestions: true,
    },
  };
}
```

### 11.2 Emergency UI Components
```typescript
const emergencyComponents = {
  // Emergency modal
  EmergencyModal: {
    variant: 'critical',
    icon: 'alert-triangle',
    title: 'Medical Consultation Required',
    message: 'Based on your responses, we recommend...',
    actions: ['Contact GP', 'Emergency Services', 'Close'],
  },
  
  // Warning banner
  WarningBanner: {
    variant: 'warning',
    icon: 'info-circle',
    dismissible: false,
    persistent: true,
    message: 'Important medical information',
  },
  
  // Emergency contacts
  EmergencyContacts: {
    gp: 'Contact your GP',
    emergency: '144 (Swiss Emergency)',
    skiin: 'SKIIN Medical Team',
    pharmacy: 'Local pharmacy',
  },
};
```

## 12. Metrics & Analytics

### 12.1 Form Analytics
```typescript
interface FormAnalytics {
  // Completion metrics
  completion: {
    rate: number;
    averageTime: number;
    dropoffPoints: StageMetrics[];
    successRate: number;
  };
  
  // User behavior
  behavior: {
    fieldInteractions: FieldMetrics[];
    navigationPatterns: string[];
    errorFrequency: ErrorMetrics[];
    helpUsage: HelpMetrics[];
  };
  
  // Performance metrics
  performance: {
    loadTimes: number[];
    interactionLatency: number[];
    saveFrequency: number;
    sessionDuration: number;
  };
  
  // Conversion tracking
  conversion: {
    insuranceToSelfPay: number;
    selfPayCompletion: number;
    gpReferralRequests: number;
    abandonmentReasons: string[];
  };
}
```

### 12.2 A/B Testing Framework
```typescript
const abTestingVariants = {
  // Progress indicator variants
  progressIndicator: ['stepper', 'progress-bar', 'circular'],
  
  // Question ordering
  questionOrder: ['medical-first', 'insurance-first', 'mixed'],
  
  // CTA text
  ctaText: ['Continue', 'Next Step', 'Save & Continue'],
  
  // Validation timing
  validationTiming: ['on-blur', 'on-submit', 'real-time'],
  
  // Help presentation
  helpPresentation: ['inline', 'tooltip', 'modal', 'sidebar'],
};
```

## Summary

This comprehensive design system for the SKIIN Switzerland eligibility questionnaire provides:

1. **Trust & Professionalism**: Medical-grade UI with Swiss healthcare context
2. **Accessibility Excellence**: Beyond WCAG 2.1 AA with cognitive support
3. **Cultural Sensitivity**: Swiss-specific adaptations and formal language
4. **Smart UX**: Conditional logic, progress saving, and intelligent validation
5. **Performance**: Optimized for mobile with fast interactions
6. **Safety**: Medical contraindication handling and emergency protocols
7. **Conversion Focus**: Reduced abandonment through thoughtful UX

The system integrates seamlessly with the existing S&W Design theme while extending it for complex medical form requirements. All components are built on shadcn/ui foundations with Swiss healthcare-specific enhancements.

Key implementation priorities:
1. Start with FormStepper and OTPInput components
2. Implement medical questionnaire with conditional logic
3. Add Swiss insurance selector with model filtering
4. Integrate payment and document upload
5. Ensure accessibility and emergency handling throughout
6. Test extensively with Swiss users across all languages

This design system ensures a trustworthy, efficient, and delightful experience for Swiss users while maintaining the highest standards of medical data security and compliance.