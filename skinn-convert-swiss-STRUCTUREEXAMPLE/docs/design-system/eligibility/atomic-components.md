# Eligibility Form Atomic Components

## Overview
This document catalogs all atomic components created for the Swiss healthcare eligibility questionnaire following the ≤50 lines rule.

## 🧩 Component Architecture

### Atomic Design Hierarchy
```
Atoms (≤50 lines)
  ↓
Molecules (≤50 lines) 
  ↓
Organisms (≤50 lines orchestrators)
  ↓
Stages (Complete workflow steps)
```

## ⚛️ Atoms (Base Components)

### FormField
**Location**: `src/components/forms/eligibility/atoms/FormField.tsx`  
**Lines**: 49  
**Purpose**: Unified form field with label, input, and error handling  
**Technology**: shadcn/ui Label + Input components

```tsx
interface FormFieldProps {
  label: string;
  id: string;
  type?: "text" | "email" | "password" | "date";
  required?: boolean;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### FormLabel
**Location**: `src/components/forms/eligibility/atoms/FormLabel.tsx`  
**Lines**: 32  
**Purpose**: Consistent label styling with required indicators

### FormError  
**Location**: `src/components/forms/eligibility/atoms/FormError.tsx`  
**Lines**: 35  
**Purpose**: Error message display with AlertCircle icon

### AlertBox
**Location**: `src/components/forms/eligibility/atoms/AlertBox.tsx`  
**Lines**: 48  
**Purpose**: Colored alert messages (success/warning/error/info)

### DateInput
**Location**: `src/components/forms/eligibility/atoms/DateInput.tsx`  
**Lines**: 47  
**Purpose**: Date input with integrated Calendar icon

### SwissInsuranceSelector
**Location**: `src/components/forms/eligibility/atoms/SwissInsuranceSelector.tsx`  
**Lines**: 50  
**Purpose**: Compact insurance model selector with RadioGroup  
**Models**: Standard, HMO, Family Doctor, Telmed

### CompactSymptomSelector  
**Location**: `src/components/forms/eligibility/atoms/CompactSymptomSelector.tsx`  
**Lines**: 49  
**Purpose**: Grid-based symptom checkboxes with emergency warnings

## 🔗 Molecules (Composite Components)

### EmailSection
**Location**: `src/components/forms/eligibility/molecules/EmailSection.tsx`  
**Lines**: 24  
**Composition**: FormField atom  
**Purpose**: Email input section wrapper

### DateOfBirthSection
**Location**: `src/components/forms/eligibility/molecules/DateOfBirthSection.tsx`  
**Lines**: 31  
**Composition**: FormField atom  
**Purpose**: Date of birth with age validation (≥18 years)

### EmailVerificationSection
**Location**: `src/components/forms/eligibility/molecules/EmailVerificationSection.tsx`  
**Lines**: 37  
**Composition**: OTPVerification + AlertBox  
**Purpose**: OTP verification flow wrapper

### InsuranceSection
**Location**: `src/components/forms/eligibility/molecules/InsuranceSection.tsx`  
**Lines**: 27  
**Composition**: SwissInsuranceSelector atom  
**Purpose**: Insurance information gathering section

### SymptomSection
**Location**: `src/components/forms/eligibility/molecules/SymptomSection.tsx`  
**Lines**: 36  
**Composition**: CompactSymptomSelector atom  
**Purpose**: Symptom selection with emergency warnings

### ContraindicationSection
**Location**: `src/components/forms/eligibility/molecules/ContraindicationSection.tsx`  
**Lines**: 25  
**Composition**: ContraindicationScreening component  
**Purpose**: Medical history screening wrapper

## 📊 Refactoring Progress

### Completed ✅
| Stage | Before | After | Components |
|-------|--------|-------|------------|
| ContactAccountStage | 165 lines | 4×50 lines | EmailSection, DateOfBirthSection, EmailVerificationSection, StageFooter |

### Pending ⏳
| Stage | Current | Target | Priority |
|-------|---------|--------|----------|
| EligibilityGateStage | 301 lines | 6×50 | High |
| SelfPayStage | 244 lines | 5×50 | Medium |
| DetailedInfoStage | 164 lines | 4×50 | Medium |
| InsuredReviewStage | 180 lines | 4×50 | Low |

## 🎨 Design Patterns

### Swiss Healthcare Colors
```css
--swiss-blue: #004C96;    /* Primary actions */
--swiss-trust: #5549A6;   /* Trust indicators */
--swiss-success: #22C55E; /* Success states */
--swiss-warning: #F59E0B; /* Warnings */
--swiss-error: #DC2626;   /* Errors/Emergency */
```

### Typography
- Font: IBM Plex Sans
- Sizes: text-sm (14px), text-base (16px), text-lg (18px)
- Weights: 400 (normal), 500 (medium), 600 (semibold)

### Spacing (8pt Grid)
- xs: 4px
- sm: 8px  
- md: 16px
- lg: 24px
- xl: 32px

## 🔧 Technologies Used

### UI Library
- **shadcn/ui**: RadioGroup, Checkbox, Label, Input, Alert
- **Lucide Icons**: Calendar, CheckCircle, AlertTriangle, Shield, Users, Phone

### Form Management
- React Hook Form (for larger forms)
- Controlled components (for atomic components)
- Zod validation schemas

### Component Generation
- **21st.dev MCP tools**: Used for generating initial component structures
- Customized for Swiss healthcare context

## 📝 Usage Examples

### Using FormField Atom
```tsx
<FormField
  id="email"
  label="Email Address"
  type="email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="your.email@example.com"
  error={emailError}
/>
```

### Composing with Molecules
```tsx
<EmailSection
  email={email}
  onChange={setEmail}
/>

<EmailVerificationSection
  email={email}
  emailVerified={emailVerified}
  onVerified={handleEmailVerified}
  onSendOTP={handleSendOTP}
  onVerifyOTP={handleVerifyOTP}
/>
```

## ✅ Quality Standards

### Component Requirements
- ✅ Maximum 50 lines per component
- ✅ Single responsibility principle
- ✅ TypeScript strict mode (no `any`)
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Mobile-first responsive design
- ✅ Swiss compliance (VAT, cantons, insurance)

### Testing Coverage
- Unit tests for logic components
- Visual regression tests with Puppeteer
- Accessibility audits with axe-core
- Cross-browser testing

## 🚀 Next Steps

1. Complete EligibilityGateStage refactoring (6 components)
2. Refactor SelfPayStage payment form (5 components)
3. Create shared form validation utilities
4. Document component composition patterns
5. Add Storybook for component showcase