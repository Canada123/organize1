# Component Inventory

## Atomic Components (≤50 lines)

### Atoms
- `Button` - Primary action button
- `MinimalInput` - Branded text input
- `Label` - Form label with required indicator
- `Icon` - SVG icon wrapper
- `Badge` - Status/count indicator
- `Spinner` - Loading indicator

### Molecules  
- `FormField` - Label + Input + Error
- `Card` - Container with shadow
- `Alert` - Message with icon
- `Toggle` - Switch control
- `RadioGroup` - Radio options
- `Checkbox` - Single checkbox

## Organism Components

### Forms
- `EligibilityChecker` - Main questionnaire controller
- `ContactAccountStage` - User registration step
- `OTPVerification` - Phone/email verification
- `PersonalInfoStage` - Demographics collection
- `HealthConditionsStage` - Medical history
- `ReviewSubmitStage` - Final review

### Layout
- `Navbar` - Site navigation
- `Footer` - Site footer
- `Sidebar` - Mobile menu
- `PageLayout` - Standard page wrapper

### Features
- `LanguageSelector` - 4-language switcher
- `InsuranceProviderList` - Provider cards
- `CantonSelector` - Swiss canton dropdown
- `ProgressIndicator` - Multi-step progress

## Page Components

### Landing Pages
- `LandingPageV2025` - Main homepage
- `EligibilityTest` - Questionnaire page
- `ContactPage` - Contact form
- `AboutPage` - Company info

### User Pages
- `Dashboard` - User overview
- `ProfilePage` - User settings
- `ResultsPage` - Eligibility results

## Component Patterns

### Props Conventions
```typescript
interface ComponentProps {
  className?: string;      // Optional styling
  children?: ReactNode;    // Child elements
  onClick?: () => void;    // Event handlers
  disabled?: boolean;      // State flags
  variant?: 'primary';     // Style variants
}
```

### Composition Pattern
```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Render Props
```tsx
<DataProvider
  render={(data) => <Component data={data} />}
/>
```

## Import Structure
```typescript
// Base UI
import { Button } from '@/components/ui/button';

// Features
import { EligibilityChecker } from '@/components/forms/eligibility';

// Layout
import { Navbar } from '@/components/layout/Navbar';
```

## Testing Requirements

### Unit Tests
- Props validation
- Event handler calls
- Conditional rendering
- Accessibility attributes

### Integration Tests
- Form submission flow
- Navigation behavior
- Data fetching
- Error handling

## Performance Guidelines

### Code Splitting
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Memoization
```typescript
const MemoizedComponent = memo(Component);
const cachedValue = useMemo(() => compute(data), [data]);
```

### Optimization Checklist
- [ ] Remove unnecessary re-renders
- [ ] Lazy load heavy components
- [ ] Optimize images (WebP/AVIF)
- [ ] Minimize bundle size
- [ ] Use production builds