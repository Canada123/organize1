# React Hooks Refactoring Plan
[Request ID: hooks-refactor-2025-08-26-001]

## Executive Summary
Comprehensive analysis of existing React hooks in the project with specific refactoring tasks aligned with React best practices.

## Current Hooks Analysis

### 1. use-mobile.tsx
**Current Issues:**
- Uses deprecated `removeEventListener` instead of cleanup in modern API
- Initial state is `undefined` causing potential hydration mismatches
- No SSR safety checks

**Best Practice Violations:**
- Rule: Hooks should handle SSR gracefully
- Rule: Avoid hydration mismatches with consistent initial state

### 2. use-toast.ts  
**Current Issues:**
- Side effects in reducer (violates Redux principles)
- Global mutable state outside React
- Memory leak potential with timeouts not being cleared properly
- Overly complex with 213 lines (violates atomic design)

**Best Practice Violations:**
- Rule: Reducers must be pure functions
- Rule: Avoid global mutable state
- Rule: Keep hooks focused and under 50 lines

### 3. useIntersectionObserver.ts
**Current Issues:**
- Dependency array includes state that changes frequently
- No null checks for browser API availability
- Potential memory leak if component unmounts during observation

**Best Practice Violations:**
- Rule: Minimize dependency array changes
- Rule: Always check for browser API availability

### 4. useScrollAnimation.ts
**Current Issues:**
- Duplicates functionality of useIntersectionObserver
- Uses `disconnect()` instead of `unobserve()`
- No performance optimization for multiple elements

**Best Practice Violations:**
- Rule: DRY - Don't repeat yourself
- Rule: Use correct cleanup methods

### 5. useThemeContent.ts
**Current Issues:**
- Not actually a hook (no React primitives used)
- Should be a utility function or selector
- Inefficient switch statement called on every render

**Best Practice Violations:**
- Rule: Only prefix with "use" if it uses React hooks
- Rule: Memoize expensive computations

### 6. useTranslation.ts
**Current Issues:**
- 180 lines violates atomic design (≤50 lines)
- Multiple responsibilities (loading + selection)
- Heavy import burden at top of file
- Type safety issues with `any` return type

**Best Practice Violations:**
- Rule: Single Responsibility Principle
- Rule: Avoid `any` types in TypeScript
- Rule: Lazy load heavy imports

## React Hooks Best Practices Research Findings

### Core Principles
1. **Composition over Configuration**: Smaller, composable hooks
2. **Pure Functions**: No side effects in synchronous code
3. **Proper Dependencies**: Accurate dependency arrays
4. **SSR Safety**: Handle server-side rendering gracefully
5. **Type Safety**: Full TypeScript support without `any`
6. **Performance**: Memoization and optimization
7. **Testing**: Easily testable in isolation
8. **Documentation**: Clear JSDoc comments

### Modern Patterns
1. **Custom Hook Composition**: Build complex hooks from simple ones
2. **Ref Callbacks**: Use callback refs for dynamic elements
3. **Event Delegation**: Optimize event handling for lists
4. **Lazy Initialization**: Defer expensive computations
5. **Cleanup Functions**: Always return cleanup functions

## Refactoring Task Plan

### Priority 1: Critical Issues (Immediate)

#### Task 1.1: Fix use-toast.ts Side Effects
```typescript
// BEFORE: Side effects in reducer
case "DISMISS_TOAST": {
  if (toastId) {
    addToRemoveQueue(toastId); // SIDE EFFECT!
  }
}

// AFTER: Pure reducer with effect handler
// Split into multiple atomic hooks:
// - useToastState.ts (≤50 lines) - Pure state management
// - useToastQueue.ts (≤50 lines) - Queue management
// - useToastTimer.ts (≤50 lines) - Timer effects
// - useToast.ts (≤50 lines) - Composition hook
```

**Deliverables:**
- [ ] Create useToastState.ts with pure reducer
- [ ] Create useToastQueue.ts for queue management
- [ ] Create useToastTimer.ts for timeout handling
- [ ] Create composed useToast.ts hook
- [ ] Add comprehensive tests

#### Task 1.2: Fix use-mobile.tsx SSR Issues
```typescript
// AFTER: SSR-safe implementation
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' 
      ? window.innerWidth < MOBILE_BREAKPOINT 
      : false
  );
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    // Modern API with fallback
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return isMobile;
}
```

**Deliverables:**
- [ ] Add SSR safety checks
- [ ] Fix initial state for hydration
- [ ] Update to modern event listener API
- [ ] Add unit tests with SSR scenarios

### Priority 2: Performance Optimizations

#### Task 2.1: Consolidate Intersection Observers
```typescript
// NEW: useInView.ts - Unified intersection observer hook
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverOptions
): [RefCallback<T>, boolean, Entry?] {
  // Consolidated logic from both hooks
  // Reuse single observer for multiple elements
  // Proper cleanup and memoization
}
```

**Deliverables:**
- [ ] Create unified useInView.ts hook
- [ ] Deprecate useScrollAnimation.ts
- [ ] Update useIntersectionObserver.ts
- [ ] Migrate all usages to new hook
- [ ] Performance benchmarks

#### Task 2.2: Optimize useTranslation.ts
```typescript
// Split into atomic hooks:
// - useLanguageSelector.ts (≤50 lines)
// - useTranslationLoader.ts (≤50 lines)  
// - useTranslationCache.ts (≤50 lines)
// - useTranslation.ts (≤50 lines) - Composed
```

**Deliverables:**
- [ ] Create useLanguageSelector.ts
- [ ] Create useTranslationLoader.ts with lazy loading
- [ ] Create useTranslationCache.ts with memoization
- [ ] Refactor main hook to compose these
- [ ] Add proper TypeScript generics

### Priority 3: Code Quality Improvements

#### Task 3.1: Convert useThemeContent to Utility
```typescript
// NEW: src/utils/themeContent.ts
export const getThemeContent = memoize((theme: ThemeType) => {
  // Content selection logic
});

// If hook needed:
export const useThemeContent = () => {
  const { currentTheme } = useTheme();
  return useMemo(() => getThemeContent(currentTheme), [currentTheme]);
};
```

**Deliverables:**
- [ ] Create themeContent.ts utility
- [ ] Add memoization
- [ ] Update imports throughout codebase
- [ ] Add tests

#### Task 3.2: Add Comprehensive Testing
**Deliverables:**
- [ ] Create test suite for each hook
- [ ] Add SSR testing scenarios
- [ ] Add performance benchmarks
- [ ] Add integration tests
- [ ] Achieve 90% coverage

### Priority 4: Documentation & Standards

#### Task 4.1: Create Hooks Style Guide
**Deliverables:**
- [ ] Document naming conventions
- [ ] Create hook templates
- [ ] Add JSDoc standards
- [ ] Create review checklist

#### Task 4.2: Add Hook Development Tools
**Deliverables:**
- [ ] Set up React DevTools profiling
- [ ] Add custom ESLint rules
- [ ] Create hook generator script
- [ ] Add performance monitoring

## Implementation Timeline

### Week 1: Critical Fixes
- Days 1-2: Fix use-toast.ts side effects
- Days 3-4: Fix use-mobile.tsx SSR issues  
- Day 5: Testing and validation

### Week 2: Performance
- Days 1-2: Consolidate intersection observers
- Days 3-4: Optimize useTranslation
- Day 5: Performance benchmarking

### Week 3: Quality & Documentation
- Days 1-2: Convert non-hooks to utilities
- Days 3-4: Add comprehensive testing
- Day 5: Documentation and style guide

## Success Metrics

1. **Code Quality**
   - All hooks ≤50 lines (atomic design)
   - Zero `any` types
   - 90% test coverage

2. **Performance**
   - Reduced re-renders by 40%
   - Improved LCP by 200ms
   - Reduced bundle size by 15KB

3. **Maintainability**
   - All hooks documented with JSDoc
   - Consistent naming patterns
   - Clear separation of concerns

## Risk Mitigation

1. **Breaking Changes**
   - Create compatibility layer during migration
   - Deprecate old hooks gradually
   - Provide migration guide

2. **Performance Regression**
   - Benchmark before and after
   - Use React Profiler
   - A/B test critical paths

3. **Team Adoption**
   - Provide training materials
   - Code reviews for new hooks
   - Automated linting rules

## Next Steps

1. Review and approve this plan
2. Create feature branch `feature/hooks-refactor`
3. Begin with Priority 1 tasks
4. Set up monitoring and metrics
5. Schedule team knowledge sharing session

---
*Generated by Planning & Task Specification Agent*
*Request ID: hooks-refactor-2025-08-26-001*