# Eligibility Workflow Atomic Components Specification
VERSION: 1.0
CREATED: 2025-08-22
PURPOSE: Technical specification for 6-stage eligibility workflow atomic components
STATUS: ACTIVE

## Overview

This document provides comprehensive technical specifications for the five new atomic components implemented for the 6-stage eligibility workflow enhancement. All components follow atomic design principles and maintain the ≤50 line code limit.

## Component Architecture

### Design Principles
- **Atomic Design**: Each component serves a single, well-defined purpose
- **Code Limit**: All components maintain ≤50 lines of code
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **S&W Design**: Consistent with S&W Design system theming

### Component Location
All components are located in: `src/components/forms/eligibility/components/`

## Component Specifications

### 1. OTPVerification.tsx

#### Purpose
Handles secure OTP (One-Time Password) verification for both email and SMS authentication with comprehensive security measures.

#### Features
- **6-digit OTP generation**: Cryptographically secure random codes
- **Multi-channel support**: Email and SMS delivery options
- **Rate limiting**: Maximum 5 attempts per 10-minute window
- **bcrypt hashing**: Secure OTP storage and validation
- **Expiration handling**: 5-minute OTP validity period
- **Resend functionality**: User-friendly resend option with cooldown

#### Props Interface
```typescript
interface OTPVerificationProps {
  email?: string;
  phone?: string;
  onVerificationComplete: (verified: boolean) => void;
  onResendOTP: () => void;
  maxAttempts?: number;
  expirationMinutes?: number;
}
```

#### Security Features
- bcrypt hash comparison for OTP validation
- Rate limiting with exponential backoff
- Secure random number generation
- Input sanitization and validation
- CSRF protection patterns

#### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management for optimal UX
- Error message announcements

---

### 2. ContraindicationScreening.tsx

#### Purpose
Performs critical medical safety screening to identify contraindications for Holter monitoring and ensure patient safety.

#### Features
- **Pregnancy screening**: Identifies potential pregnancy concerns
- **Pacemaker/ICD detection**: Screens for implanted cardiac devices
- **Recent hospitalization**: Assesses recent cardiac-related hospitalizations
- **Safety alerts**: Immediate feedback with appropriate medical guidance
- **Risk categorization**: Automatic risk level assessment
- **Emergency guidance**: Clear instructions for high-risk conditions

#### Props Interface
```typescript
interface ContraindicationScreeningProps {
  onScreeningComplete: (results: ContraindicationResults) => void;
  onEmergencyAlert: (alertType: EmergencyAlertType) => void;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other';
}
```

#### Medical Screening Logic
- **Pregnancy**: Age and gender-based screening logic
- **Cardiac devices**: Comprehensive device type identification
- **Hospitalization**: 30-day lookback period assessment
- **Risk scoring**: Automated risk calculation algorithm

#### Safety Features
- Immediate alert system for high-risk conditions
- Clear emergency contact guidance
- Medical disclaimer and safety notices
- Professional consultation recommendations

---

### 3. InsuranceModelSelector.tsx

#### Purpose
Enables users to select their Swiss insurance model from the comprehensive range of available options with detailed explanations.

#### Features
- **Standard/Flex model**: Traditional Swiss insurance with GP choice
- **HMO/Hausarzt model**: Health Maintenance Organization structure
- **Telmed model**: Telephone-based medical consultation
- **Self-pay option**: Direct payment for uninsured patients
- **Model descriptions**: Clear explanations of each insurance type
- **GP requirement mapping**: Automatic GP requirement determination

#### Props Interface
```typescript
interface InsuranceModelSelectorProps {
  onModelSelected: (model: SwissInsuranceModel) => void;
  preselectedModel?: SwissInsuranceModel;
  showSelfPay?: boolean;
  detailedDescriptions?: boolean;
}
```

#### Swiss Insurance Models
```typescript
type SwissInsuranceModel = 
  | 'standard-flex'
  | 'hmo-hausarzt'
  | 'telmed'
  | 'self-pay';
```

#### Model Features
- **Standard/Flex**: GP choice flexibility, partner GP options
- **HMO**: Assigned GP requirement, no partner GP allowed
- **Telmed**: Mandatory triage call before specialist care
- **Self-pay**: Direct payment processing, phone verification required

#### Integration Points
- Swiss healthcare database schema alignment
- Insurance provider API compatibility
- GP network integration preparation
- Payment processing system connection

---

### 4. ContactAccountStage.tsx

#### Purpose
Implements Step 0 of the eligibility workflow, handling initial contact information collection and account creation foundation.

#### Features
- **Email collection**: Valid email address with format validation
- **OTP integration**: Seamless integration with OTPVerification component
- **Age verification**: Date of birth collection with ≥18 validation
- **Account initialization**: Foundation for user account creation
- **Data persistence**: Secure storage of verified contact information
- **Progress tracking**: Workflow state management integration

#### Props Interface
```typescript
interface ContactAccountStageProps {
  onStageComplete: (contactData: ContactAccountData) => void;
  onEmailVerified: (email: string, verified: boolean) => void;
  initialData?: Partial<ContactAccountData>;
  requireOTPVerification?: boolean;
}
```

#### Validation Rules
- **Email**: RFC 5322 compliant email validation
- **Age**: Minimum 18 years old requirement
- **OTP**: Integration with OTPVerification security measures
- **Data format**: Consistent with backend schema requirements

#### Data Schema
```typescript
interface ContactAccountData {
  email: string;
  dateOfBirth: Date;
  age: number;
  emailVerified: boolean;
  otpVerificationStatus: 'pending' | 'verified' | 'failed';
}
```

---

### 5. EligibilityGateStage.tsx

#### Purpose
Implements Step 1 of the eligibility workflow with comprehensive eligibility assessment logic and decision-making algorithms.

#### Features
- **Insurance status assessment**: Swiss healthcare coverage evaluation
- **Symptom presence evaluation**: Comprehensive symptom checklist
- **Family history collection**: Relevant family medical history
- **Eligibility decision logic**: Automated eligibility determination
- **Contraindication integration**: Integration with ContraindicationScreening
- **Insurance model routing**: Dynamic workflow routing based on insurance

#### Props Interface
```typescript
interface EligibilityGateStageProps {
  onEligibilityDetermined: (eligibility: EligibilityDecision) => void;
  onInsuranceModelSelected: (model: SwissInsuranceModel) => void;
  contactData: ContactAccountData;
  contraindications?: ContraindicationResults;
}
```

#### Eligibility Logic
- **Insurance + Symptoms**: Automatic eligibility for reimbursement
- **Insurance - Symptoms**: Self-pay option with informed consent
- **No Insurance**: Direct self-pay pathway
- **Contraindications**: Immediate medical consultation requirement

#### Decision Algorithm
```typescript
interface EligibilityDecision {
  eligible: boolean;
  eligibilityType: 'insured' | 'self-pay' | 'contraindicated';
  nextStage: 'detailed-assessment' | 'payment' | 'medical-consultation';
  insuranceModel?: SwissInsuranceModel;
  riskLevel: 'low' | 'medium' | 'high';
}
```

## Integration Architecture

### State Management
All components integrate seamlessly with the enhanced EligibilityContext:

```typescript
interface EligibilityContextState {
  currentStage: 0 | 1 | 2 | 3 | 4 | 5;
  contactAccount: ContactAccountData;
  contraindications: ContraindicationResults;
  insuranceModel: SwissInsuranceModel;
  eligibilityDecision: EligibilityDecision;
  otpVerification: OTPVerificationState;
}
```

### Component Communication
- **Props-based communication**: Clean, predictable data flow
- **Context integration**: Shared state management via EligibilityContext
- **Event emission**: Callback-based component interaction
- **Type safety**: Full TypeScript coverage for all interactions

### Error Handling
- **Graceful degradation**: Component-level error boundaries
- **User feedback**: Clear error messages with recovery guidance
- **Logging**: Comprehensive error tracking for debugging
- **Fallback states**: Backup UI for error conditions

## Testing Strategy

### Unit Testing
- **Component isolation**: Individual component testing with Jest
- **Props validation**: TypeScript prop interface testing
- **State management**: Context integration testing
- **Accessibility**: WCAG compliance validation

### Integration Testing
- **Workflow progression**: End-to-end stage progression testing
- **Data persistence**: State management integration verification
- **API integration**: Backend service integration testing
- **Cross-browser**: Compatibility testing across major browsers

### Performance Testing
- **Rendering optimization**: Component render time measurement
- **Memory usage**: Component memory footprint assessment
- **Bundle size**: Individual component size impact analysis
- **Loading performance**: Component initialization timing

## Security Considerations

### Data Protection
- **Input validation**: Comprehensive sanitization of all user inputs
- **XSS prevention**: Protection against cross-site scripting attacks
- **CSRF protection**: Cross-site request forgery safeguards
- **Data encryption**: Sensitive data encryption in transit and storage

### Swiss Healthcare Compliance
- **GDPR compliance**: Full data protection regulation adherence
- **Medical data security**: Healthcare-specific security measures
- **Audit logging**: Comprehensive activity tracking
- **Data retention**: Compliant data lifecycle management

## Deployment and Maintenance

### Deployment Checklist
- [ ] Component integration testing complete
- [ ] Security audit passed
- [ ] Accessibility validation confirmed
- [ ] Performance benchmarks met
- [ ] Documentation comprehensive
- [ ] Type safety verified

### Maintenance Guidelines
- **Code updates**: Maintain ≤50 line limit for atomic components
- **Security patches**: Regular security update integration
- **Performance monitoring**: Continuous performance assessment
- **User feedback**: Ongoing UX improvement integration

## Related Documentation

- `docs/implementation/2025-08-22-6-stage-eligibility-workflow-implementation.md` - Implementation overview
- `docs/database-requirements-and-specs/updated_questionnaire_spec.md` - Requirements specification
- `docs/design-system/PROTECTED_COMPONENTS_SPEC_v1.md` - Design system guidelines
- `context/conventions.md` - Coding standards and conventions

---
LAST-UPDATED: 2025-08-22
AUTHOR: Documentation Maintenance System
REVIEW-DATE: 2025-08-29