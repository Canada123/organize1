# Eligibility Questionnaire

## Overview
6-stage progressive form collecting user information to determine eligibility for SKIIN heart health screening services in Switzerland.

## Form Stages

### Stage 1: Personal Information
- First name, last name
- Date of birth (18+ validation)
- Gender selection

### Stage 2: Contact & Account
- Email address
- Phone number
- OTP verification
- Password creation

### Stage 3: Address Information
- Street address
- Postal code
- City
- Canton selection

### Stage 4: Insurance Details
- Provider selection (9 Swiss providers)
- Policy number
- Coverage type

### Stage 5: Health Conditions
- Medical history checkboxes
- Risk factor assessment
- Family history

### Stage 6: Review & Submit
- Summary of all information
- Consent checkboxes
- Final submission

## Technical Implementation

### State Management
```typescript
interface EligibilityState {
  currentStage: number;
  formData: FormData;
  errors: ValidationErrors;
  score: number;
  isSubmitting: boolean;
}
```

### Validation Rules
- Required field validation
- Format validation (email, phone)
- Business rules (age ≥18)
- Swiss-specific (valid canton, insurance)

### Data Flow
1. User input → Local state
2. Stage completion → Validation
3. All stages complete → API submission
4. Server validation → Score calculation
5. Result → User feedback

## Scoring Algorithm

### Risk Factors (Points)
- Age 40-50: +10
- Age 50-60: +20
- Age 60+: +30
- Family history: +15
- Smoking: +20
- Diabetes: +25
- High blood pressure: +20

### Eligibility Thresholds
- 0-30: Low risk (not eligible)
- 31-60: Medium risk (eligible)
- 61+: High risk (priority eligible)

## OTP Verification

### Flow
1. User enters phone/email
2. System sends 6-digit code
3. User enters code
4. System validates (5 attempts max)
5. Success → Continue to next stage

### Security
- Rate limiting: 5 attempts/10 minutes
- Code expiry: 10 minutes
- Bcrypt hashing
- Session tokens

## Error Handling

### Validation Errors
- Inline field errors
- Stage-level validation
- Submission errors

### Recovery
- Auto-save progress
- Session restoration
- Error retry logic

## Accessibility

### WCAG 2.1 AA Features
- Keyboard navigation
- Screen reader support
- Error announcements
- Focus management
- High contrast support

## Testing

### Unit Tests
- Field validation
- State transitions
- Score calculation

### E2E Tests
- Complete flow
- Error scenarios
- OTP verification
- Multi-language

## Analytics

### Tracked Events
- Stage completion
- Drop-off points
- Error frequency
- Time per stage
- Submission success

### Key Metrics
- Completion rate: 62%
- Average time: 8 minutes
- Error rate: 1.8%
- OTP success: 94%