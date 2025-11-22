# Testing Documentation

## Overview
Comprehensive testing strategy using Vitest for unit tests, Testing Library for component tests, and Playwright for E2E tests.

## Test Coverage Requirements
- **Services**: 80% minimum
- **Utilities**: 70% minimum  
- **Components**: 60% minimum
- **Overall**: 70% target

## Testing Stack
- **Unit Testing**: Vitest
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright
- **Accessibility**: axe-core
- **Performance**: Lighthouse CI

## Test Organization
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
├── fixtures/      # Test data
└── mocks/         # Mock services

src/
└── components/
    └── Component.test.tsx  # Co-located tests
```

## Running Tests

### Commands
```bash
npm run test              # Run unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
npm run test:e2e         # E2E tests
npm run test:a11y        # Accessibility tests
```

### CI/CD Pipeline
1. Pre-commit: Linting
2. PR: Unit + Integration tests
3. Merge: Full test suite
4. Deploy: Smoke tests

## Test Categories

### Unit Tests
- Pure functions
- Utilities
- Services
- Reducers
- Hooks

### Integration Tests
- API calls
- Database operations
- Authentication flows
- Form submissions

### E2E Tests
- Critical user paths
- Multi-step forms
- Payment flows
- Language switching

## Quality Gates
- All tests must pass
- Coverage thresholds met
- No accessibility violations
- Performance budgets maintained

## GP Referral System Testing

### Comprehensive Test Suite
The GP Referral Code System has a complete testing specification covering all aspects of the implementation:

#### Test Documentation
- **[Test Specifications](./gp-referral-system-test-specifications.json)** - 85 detailed test cases across all categories
- **[Test Plan](./gp-referral-test-plan.md)** - Comprehensive 3-week testing strategy  
- **[Quality Metrics](./quality-metrics-specification.json)** - Performance budgets and acceptance criteria
- **[Bug Report Template](./bug-report-template.md)** - Standardized bug reporting format

#### Test Categories Covered
1. **Backend Testing (40 test cases)**
   - Database schema and function testing
   - Supabase Edge Function testing  
   - API route integration testing
   - Service layer business logic testing

2. **Frontend Testing (25 test cases)**
   - React component rendering tests
   - Form validation testing
   - User interaction testing
   - Accessibility compliance testing

3. **Integration Testing (10 test cases)**
   - End-to-end API workflows
   - Email notification integration
   - File storage integration
   - Database transaction testing

4. **E2E Testing (10 test cases)**
   - Complete user journey testing
   - Cross-browser compatibility
   - Mobile responsiveness
   - Multi-language support testing

#### Key Test Features
- **85 Test Cases**: Covering all critical paths and edge cases
- **6 Test Categories**: Unit, Integration, E2E, Performance, Security, Accessibility
- **Quality Gates**: 80% coverage, WCAG 2.1 AA compliance, Swiss healthcare compliance
- **Automation**: 90%+ test automation coverage
- **Performance**: Code generation <2s, file upload <5s
- **Security**: Penetration testing, vulnerability scanning

#### Test Execution Strategy
- **Phase 1 (Week 1)**: Unit testing - 85% coverage target
- **Phase 2 (Week 1-2)**: Integration testing - API and database validation  
- **Phase 3 (Week 2)**: E2E testing - Complete user workflows
- **Phase 4 (Week 3)**: Performance & security testing - Load testing and vulnerability assessment

#### Swiss Compliance Testing
- **FADP Compliance**: Patient data protection verification
- **Medical Data Retention**: 7-year retention policy testing
- **HIN Integration**: HIN email validation and doctor authentication
- **Audit Logging**: Complete audit trail verification

### Test Data Management
- **Fixtures**: `/tests/fixtures/referral-system/`
- **Mock Services**: Email, file upload, QR generation
- **Test Databases**: Local SQLite, Docker PostgreSQL, Staging Supabase
- **Privacy**: All test data anonymized, GDPR compliant

## Related Documentation
- [Unit Tests](./unit-tests.md) - Vitest configuration and patterns
- [E2E Tests](./e2e-tests.md) - Playwright setup and scenarios
- [GP Referral Test Plan](./gp-referral-test-plan.md) - Comprehensive testing strategy
- [GP Referral Test Specifications](./gp-referral-system-test-specifications.json) - Detailed test cases