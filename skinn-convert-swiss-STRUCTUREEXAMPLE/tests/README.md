# Test Suite - SKIIN Switzerland

## 🎯 Testing Philosophy

We follow an **Agent-First Testing** approach:
- Tests are triggered by agents using MCP tools, not scripts
- Focus on business logic, not UI details
- Test results are ephemeral - never committed
- TypeScript provides type safety, not tests

## 📁 Structure

```
tests/
├── unit/           # Business logic and utility tests (Vitest)
│   ├── services/   # API endpoints, business logic
│   ├── utils/      # Utility functions
│   ├── hooks/      # Custom React hooks
│   └── components/ # Critical component logic
├── integration/    # Critical user flow tests (MCP Puppeteer)
│   ├── forms/      # Form submission flows
│   ├── auth/       # Authentication flows
│   └── flows/      # End-to-end user journeys
└── config/         # Test configuration
    └── setup.ts    # Test environment setup
```

## 🚀 Running Tests

### Unit Tests (Keep these)
```bash
npm run test:unit        # Run unit tests once
npm run test:unit:watch  # Watch mode for TDD
npm run test:coverage    # Coverage for backend code
```

### Integration Tests (Use MCP Tools)
Integration tests should be run via the `testing-qa-agent` using MCP Puppeteer tools, not scripts:

```typescript
// Example: Testing via MCP tools
await mcp__puppeteer__puppeteer_navigate({ url: 'http://localhost:8080' });
await mcp__puppeteer__puppeteer_screenshot({ name: 'test-result' });
```

## ✅ What to Test

### Always Test (Backend/Business Logic)
- ✅ API endpoints
- ✅ Database operations
- ✅ Authentication logic
- ✅ Payment processing
- ✅ Form validation
- ✅ Security functions (rate limiting, hashing)
- ✅ Data transformations

### Sometimes Test (Frontend/Critical Flows)
- ✅ Eligibility questionnaire flow
- ✅ Payment submission
- ✅ Authentication flow
- ✅ Error handling
- ❓ Complex form logic
- ❓ Critical user interactions

### Never Test
- ❌ Static content components
- ❌ Theme variations
- ❌ Generated shadcn/ui components
- ❌ Translation files
- ❌ Type definitions
- ❌ Simple display logic

## 📝 Writing Tests

### Unit Test Example
```typescript
// tests/unit/services/otp.test.ts
import { describe, it, expect } from 'vitest';
import { verifyOTP } from '@/services/otp';

describe('OTP Service', () => {
  it('implements rate limiting after 5 attempts', async () => {
    // Test implementation
  });
});
```

### Integration Test (via Agent)
```typescript
// Agent uses MCP tools directly
await mcp__puppeteer__puppeteer_navigate({ 
  url: 'http://localhost:8080/eligibility' 
});
// Test user journey...
```

## 🚫 Important Notes

1. **No Test Scripts**: We don't maintain test scripts. Use MCP tools.
2. **No Snapshots**: Visual regression tests are too brittle.
3. **No 100% Coverage**: Focus on critical paths, not metrics.
4. **Test Results**: Never commit test results. They go to `/archive/tests/`.

## 🎭 Testing by Agent Role

### Frontend-Developer
- Check if component needs tests (critical flows only)
- Use TypeScript for type safety
- Let testing-qa-agent validate via MCP tools

### Backend-Developer
- Write tests FIRST (TDD)
- 100% coverage for API endpoints
- Test all security measures

### Testing-QA Agent
- Use MCP Puppeteer tools
- Focus on user journeys
- Report actionable feedback

## 🗑️ Archived Test Files

All old test scripts have been archived to `/archive/2025-11-20/test-cleanup/`:
- Old `.cjs` test scripts
- Test results and reports
- Visual regression tests
- Accessibility audit scripts

These are kept for reference but should not be used. Use MCP tools instead.

## 📊 Coverage Goals

We only enforce coverage for critical business logic:

| Directory | Target Coverage |
|-----------|----------------|
| `src/services/**` | 80% |
| `src/utils/**` | 70% |
| `src/components/ui/**` | 0% (shadcn) |
| `src/translations/**` | 0% (static) |

## 🔧 Configuration

- **Test Runner**: Vitest for unit tests
- **Environment**: jsdom for React components
- **Coverage**: Reports to `/archive/tests/coverage/` (git-ignored)
- **Integration**: MCP Puppeteer tools (no Playwright)

## Remember

> "The goal is to ship quality software, not to have perfect test coverage."

Test what matters, trust TypeScript for the rest, and use agent intelligence for validation.