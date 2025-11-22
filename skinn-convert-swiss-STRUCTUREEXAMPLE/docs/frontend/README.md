# Frontend Architecture

## Overview
React 18 application with TypeScript 5, Tailwind CSS, and S&W Design System implementing a multi-language Swiss healthcare eligibility platform.

## Component Structure

### Atomic Design Hierarchy
```
src/components/
├── ui/           # Base shadcn/ui components (50+ components)
├── atoms/        # Basic building blocks (≤50 lines)
├── molecules/    # Composed atoms (≤50 lines)
├── organisms/    # Complex components
├── templates/    # Page templates
└── pages/        # Route components
```

### Key Principles
- **Size Limits**: Atoms/molecules must be ≤50 lines
- **Pure Functions**: No class components
- **TypeScript**: Strict mode, no `any` types
- **Composition**: Prefer composition over inheritance

## State Management

### Context + Reducer Pattern
Used for complex forms like eligibility questionnaire:
```typescript
const [state, dispatch] = useReducer(eligibilityReducer, initialState);
```

### Local State
Simple UI state managed with `useState`

### Server State
Supabase real-time subscriptions for live data

## Routing

### Structure
```
/[language]/[page]
├── /en/home
├── /de/home
├── /fr/home
└── /it/home
```

### Language Detection
1. URL parameter (highest priority)
2. Browser preference
3. Default to German (CH default)

## Performance

### Optimization Techniques
- Code splitting with React.lazy()
- Image optimization with WebP/AVIF
- Bundle size monitoring
- Tree shaking unused code

### Metrics
- Bundle size: <200KB gzipped
- First paint: <1s
- Interactive: <2.5s

## Development Guidelines

### Component Creation
1. Check existing components first
2. Follow atomic design principles
3. Write unit tests alongside
4. Document with JSDoc comments

### Code Style
- ESLint configuration enforced
- Prettier for formatting
- Husky pre-commit hooks

## Testing
- Unit tests with Vitest
- Component tests with Testing Library
- E2E tests with Playwright

## Related Documentation
- [Design System](./design-system.md) - Tokens and component library
- [Components](./components.md) - Component inventory