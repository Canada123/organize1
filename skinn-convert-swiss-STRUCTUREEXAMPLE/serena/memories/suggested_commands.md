# Essential Commands for SKIIN Switzerland Development

## Development Commands

### Start Development
```bash
npm run dev              # Start development server (port 8080/8081)
npm run build           # Build for production
npm run preview         # Preview production build
```

### Code Quality and Testing
```bash
npm run lint            # ESLint with auto-fix
npm run typecheck       # TypeScript type checking
npm run test            # Run unit tests (Vitest)
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage report
npm run test:e2e        # Run end-to-end tests (Playwright)
npm run test:e2e:ui     # Run E2E tests with UI
npm run test:a11y       # Run accessibility tests
```

### Quality Gates
```bash
npm run check           # Run lint + typecheck + test coverage
npm run check:all       # Run all checks + E2E tests
```

### Specialized Tools
```bash
npm run guard           # TDD Guard for test-driven development
npm run test:lighthouse # Lighthouse CI performance testing
```

## Git Workflow
```bash
git status              # Check current status
git add .               # Stage all changes
git commit -m "message" # Commit with message
git push origin main    # Push to main branch
```

## System Commands (Darwin/macOS)
```bash
ls -la                  # List files with details
find . -name "*.tsx"    # Find TypeScript React files
grep -r "pattern" src/  # Search for patterns in source
cd src/components       # Navigate to components
pwd                     # Show current directory
```

## Project-Specific Commands

### Component Development
```bash
# Navigate to component areas
cd src/components/ui           # Base UI components
cd src/components/forms        # Form components
cd src/components/eligibility  # New atomic components

# Check component line counts
wc -l src/components/ui/*.tsx  # Count lines in UI components
```

### Development Workflow
```bash
# Typical development cycle
npm run dev                    # Start development
# ... make changes ...
npm run check                  # Verify quality
npm run test:e2e              # Test critical flows
git add . && git commit       # Commit changes
```

## Important Locations
- **Source Code**: `src/`
- **Components**: `src/components/`
- **Context Files**: `context/`
- **Documentation**: `docs/`
- **Tests**: `tests/`
- **Database**: `supabase/`