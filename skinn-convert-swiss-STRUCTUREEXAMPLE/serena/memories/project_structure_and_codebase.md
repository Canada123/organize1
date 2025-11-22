# Project Structure and Codebase Organization

## Repository Structure Overview

```
skinn-convert-swiss-pages/
├── src/                      # Source code (358+ files)
│   ├── components/          # React components (105+ components)
│   │   ├── ui/             # Base shadcn/ui components (50+)
│   │   ├── forms/          # Form components including new atomic structure
│   │   │   └── eligibility/ # Refactored eligibility system (12 atomic components)
│   │   ├── home/           # Homepage components
│   │   ├── landing/        # Landing page components  
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   └── protected/      # Protected/regulated components
│   ├── pages/              # Route components by feature
│   ├── hooks/              # Custom React hooks
│   ├── translations/       # i18n files (4 languages)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── context/                 # Working context files (7 files)
├── docs/                   # Reference documentation (160+ directories)
├── public/assets/          # Static assets (images, icons, videos)
├── supabase/               # Database schema and migrations
├── tests/                  # Test files and configuration
└── [config files]         # Build and tool configuration (≤15 files)
```

## Component Architecture (Recent Major Refactoring)

### Atomic Component Structure
The project recently completed a major architectural improvement, refactoring the 851-line IntegratedEligibilityFlow.tsx monolith into atomic components:

```
src/components/forms/eligibility/
├── context/                     # Centralized state management
│   ├── types.ts                # Comprehensive TypeScript interfaces
│   ├── formReducer.ts          # Immutable state management
│   └── FormContext.tsx         # React Context provider
├── components/                  # Shared components
│   ├── StepProgressIndicator.tsx
│   └── StepNavigation.tsx
├── steps/                      # Individual form steps (all ≤50 lines)
│   ├── ContactStep.tsx
│   ├── EligibilityGateStep.tsx
│   ├── DetailedInfoStep.tsx
│   ├── InsuredReviewStep.tsx
│   ├── SelfPayReviewStep.tsx
│   └── CompletionStep.tsx
├── utils/                      # Business logic utilities
│   ├── branchingLogic.ts      # Eligibility scoring
│   └── validationRules.ts     # Form validation
└── EligibilityFormV2.tsx       # Main orchestrator component
```

## Key Architectural Patterns

### Multi-language System
- **4 Languages**: English, German, French, Italian
- **Route Structure**: /[language]/[page] (e.g., /de/home, /fr/about)
- **Translation Files**: Organized by feature in src/translations/
- **98+ Routes**: Complete routing across all languages

### State Management
- **Client State**: React Context API for UI state
- **Server State**: TanStack Query for API calls and caching
- **Form State**: React Hook Form with Zod validation
- **Theme State**: next-themes for dark/light mode

### Design System Integration
- **S&W Design System**: Custom design tokens and components
- **Base Components**: shadcn/ui as foundation
- **Protected Components**: Special components with usage restrictions
- **Atomic Design**: Maximum 50 lines per component rule

## File Organization Rules
- **Strict Location Enforcement**: Every file type has designated location
- **Root Directory**: Maximum 15 configuration files only
- **No Duplicates**: Single source of truth for all content
- **Archive System**: Unused docs moved to archive/YYYY-MM-DD/
- **Context Separation**: Working files in context/, reference docs in docs/