# Coding Standards - SKIIN Switzerland

## Overview
This document defines the coding standards and best practices for the SKIIN Switzerland project. All code contributions must adhere to these standards to maintain consistency, quality, and maintainability.

## Technology Stack Standards

### TypeScript 5 - Strict Mode
- **Required**: Strict mode enabled in tsconfig.json
- **No `any` types**: Every variable, parameter, and return value must be explicitly typed
- **Explicit return types**: All functions must declare return types
- **Interface over type**: Prefer interfaces for object shapes
- **Enum usage**: Use const enums for performance

### React 18 Standards
- **Functional Components Only**: No class components
- **Hooks**: Use built-in hooks and custom hooks for state and effects
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Error Boundaries**: Implement error boundaries for robust error handling
- **Suspense**: Use Suspense for code splitting and lazy loading

## Component Architecture

### Atomic Design Pattern
All components follow the Atomic Design methodology:

#### Atoms (≤50 lines)
- Single-purpose UI elements
- No business logic
- Pure presentation components
- Examples: Button, Input, Label

#### Molecules (≤50 lines)
- Combinations of atoms
- Minimal logic
- Reusable across features
- Examples: FormField, SearchBox

#### Organisms (≤150 lines)
- Complex UI sections
- Can contain business logic
- Feature-specific
- Examples: Header, ProductCard

#### Templates & Pages
- Route components
- Layout definitions
- Data fetching
- State management

### Component Rules
```typescript
// ✅ Good - Atom component
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  onClick,
  disabled = false
}) => {
  return (
    <button 
      className={cn(buttonVariants({ variant }))}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}; // ≤50 lines

// ❌ Bad - Component too large
export const ComplexComponent = () => {
  // 200+ lines of code
  // Multiple responsibilities
  // Mixed concerns
};
```

## File Organization

### Directory Structure
```
src/
├── components/          # Reusable components
│   ├── ui/             # Base components (atoms/molecules)
│   ├── forms/          # Form-specific components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── pages/              # Route components
├── services/           # API and business logic
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── translations/       # i18n files
```

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Interfaces**: Prefix with 'I' or suffix with 'Props'/'State'
- **Types**: PascalCase
- **Files**: Match component name

## State Management

### Context API Pattern
```typescript
// Context definition
interface AppContextType {
  user: User | null;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

// Provider implementation
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook for consuming context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

## Form Handling

### React Hook Form + Zod
```typescript
// Schema definition
const formSchema = z.object({
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
  consent: z.boolean().refine(val => val === true, 'Consent required')
});

// Form implementation
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: '',
    age: 0,
    consent: false
  }
});
```

## Styling Standards

### Tailwind CSS
- **Utility-first**: Use Tailwind utilities before custom CSS
- **Component variants**: Use class-variance-authority (CVA)
- **Responsive**: Mobile-first approach
- **Dark mode**: Support both light and dark themes

```typescript
// Using CVA for variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground"
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
```

## Testing Standards

### Unit Testing (Vitest)
- **Coverage**: Minimum 80% for services, 70% for utilities
- **Test structure**: Arrange-Act-Assert pattern
- **Mocking**: Use vi.mock for external dependencies
- **Test files**: Co-located with components (`Component.test.tsx`)

### E2E Testing (Playwright)
- **Critical paths**: Test main user journeys
- **Page objects**: Use page object pattern
- **Assertions**: Explicit waits and assertions
- **Screenshots**: Capture on failure

## Performance Standards

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **TTI**: < 3.8s (Time to Interactive)

### Optimization Techniques
- Code splitting with dynamic imports
- Image optimization (WebP, lazy loading)
- Bundle size monitoring
- Memoization for expensive operations
- Virtual scrolling for long lists

## Security Standards

### Data Protection
- **No secrets in code**: Use environment variables
- **Input validation**: Always validate user input
- **XSS prevention**: Sanitize rendered content
- **HTTPS only**: Enforce secure connections
- **Authentication**: Use secure session management

### Swiss Compliance
- **GDPR compliance**: Data protection and privacy
- **Swiss DPA**: Swiss Data Protection Act compliance
- **PCI DSS**: Payment card security standards
- **Healthcare data**: HIPAA-compliant practices

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Keyboard navigation**: All interactive elements keyboard accessible
- **Screen readers**: Proper ARIA labels and roles
- **Color contrast**: Minimum 4.5:1 for normal text
- **Focus indicators**: Visible focus states
- **Alt text**: Descriptive alt text for images

## Documentation Standards

### Code Comments
```typescript
/**
 * Calculates the eligibility score based on user responses
 * @param responses - User questionnaire responses
 * @param weights - Scoring weights for each question
 * @returns Eligibility score between 0-100
 */
export function calculateEligibilityScore(
  responses: QuestionnaireResponses,
  weights: ScoringWeights
): number {
  // Implementation
}
```

### README Files
Each major module should have a README with:
- Purpose and overview
- Installation/setup
- Usage examples
- API documentation
- Testing instructions

## Git Workflow

### Commit Messages
Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

### Branch Naming
- Feature: `feature/description`
- Bugfix: `fix/description`
- Hotfix: `hotfix/description`
- Release: `release/version`

## Code Review Checklist

Before submitting PR:
- [ ] Passes all tests
- [ ] Meets coverage requirements
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Follows atomic design (≤50 lines for atoms/molecules)
- [ ] Includes necessary documentation
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Swiss compliance checked

## Enforcement

These standards are enforced through:
- **ESLint**: Automated linting
- **TypeScript**: Type checking
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **CI/CD**: Automated testing
- **Code reviews**: Manual verification