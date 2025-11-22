# SKIIN Design System Documentation

## Overview
This design system is organized into three distinct areas to maintain clear separation of concerns and improve maintainability.

## 📁 Structure

### `/website/` - Marketing & Landing Pages
Components and patterns for the main SKIIN website including:
- Hero sections
- Product showcases  
- Pricing components
- Navigation elements
- Footer layouts
- Myant Violet color palette

### `/eligibility/` - Healthcare Questionnaire
Specialized components for the Swiss healthcare eligibility form:
- Atomic components (≤50 lines each)
- 6-stage workflow components
- Swiss healthcare UI patterns
- Form validation patterns
- OTP verification flows

### `/shared/` - Common Components
Reusable components used across both systems:
- shadcn/ui primitives
- Design tokens
- Typography standards
- Accessibility guidelines
- Grid systems

## 🎨 Design Tokens

Core design tokens are defined in `design-tokens.md` and include:

```css
/* Swiss Healthcare Palette */
--swiss-blue: #004C96;
--swiss-trust: #5549A6;
--swiss-success: #22C55E;
--swiss-warning: #F59E0B;
--swiss-error: #DC2626;

/* Typography */
--font-heading: 'IBM Plex Sans', sans-serif;
--font-body: 'IBM Plex Sans', sans-serif;

/* Spacing (8pt grid) */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

## 🔄 Recent Updates (2025-08-26)

### Atomic Component Refactoring
- Created 15+ new atomic components (all ≤50 lines)
- Refactored ContactAccountStage (165 → 4 modular components)
- Integrated shadcn/ui components (RadioGroup, Checkbox, Label, Input)
- Fixed text overlap issues in forms
- Implemented Swiss healthcare design patterns

### New Components Added
**Atoms:**
- FormField, FormLabel, FormError, AlertBox
- DateInput, SwissInsuranceSelector, CompactSymptomSelector

**Molecules:**  
- EmailSection, DateOfBirthSection, EmailVerificationSection
- InsuranceSection, SymptomSection, ContraindicationSection

## 📋 Component Status

| Component | Lines | Target | Status |
|-----------|-------|--------|--------|
| ContactAccountStage | 165 | 4×50 | ✅ Refactored |
| EligibilityGateStage | 301 | 6×50 | ⏳ Pending |
| SelfPayStage | 244 | 5×50 | ⏳ Pending |
| DetailedInfoStage | 164 | 4×50 | ⏳ Pending |
| InsuredReviewStage | 180 | 4×50 | ⏳ Pending |

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript
- **Component Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Component Generation**: 21st.dev MCP tools

## 📚 Quick Links

- [Website Components](./website/components.md)
- [Eligibility Atomic Components](./eligibility/atomic-components.md)
- [Swiss Healthcare UI Patterns](./eligibility/swiss-healthcare-ui.md)
- [Design Tokens](./design-tokens.md)
- [Implementation Review](./implementation-review.md)

## 🗂️ Archives

Outdated specifications and superseded documentation can be found in `/archive/` organized by date.