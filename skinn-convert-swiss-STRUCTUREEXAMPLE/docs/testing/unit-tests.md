# Unit Testing with Vitest

## Configuration

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/'],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    }
  }
});
```

## Test Patterns

### Component Testing
```typescript
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Service Testing
```typescript
describe('AuthService', () => {
  it('validates OTP correctly', async () => {
    const result = await authService.validateOTP('123456');
    expect(result.success).toBe(true);
  });

  it('handles rate limiting', async () => {
    for (let i = 0; i < 6; i++) {
      await authService.validateOTP('wrong');
    }
    await expect(authService.validateOTP('123456'))
      .rejects.toThrow('Rate limited');
  });
});
```

### Hook Testing
```typescript
describe('useTranslation', () => {
  it('returns correct translation', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('common.submit')).toBe('Submit');
  });
});
```

## Mocking

### API Mocking
```typescript
vi.mock('@/services/api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test' })
}));
```

### Supabase Mocking
```typescript
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn()
    }
  }))
}));
```

## Best Practices

### Test Structure
- **Arrange**: Set up test data
- **Act**: Execute the function
- **Assert**: Verify the result

### Naming Conventions
- Describe what is being tested
- Use "should" or active voice
- Be specific about expectations

### Test Isolation
- Each test should be independent
- Clean up after tests
- Don't rely on test order

## Coverage Reports

### Generating Reports
```bash
npm run test:coverage
```

### Reading Reports
- HTML report: `coverage/index.html`
- Terminal output shows summary
- CI fails if thresholds not met

## Common Utilities

### Test Helpers
```typescript
// tests/helpers.ts
export const createMockUser = (overrides = {}) => ({
  id: '123',
  email: 'test@example.com',
  ...overrides
});

export const waitForAsync = () => 
  new Promise(resolve => setTimeout(resolve, 0));
```

### Custom Matchers
```typescript
expect.extend({
  toBeValidEmail(received) {
    const pass = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(received);
    return { pass, message: () => `Expected ${received} to be valid email` };
  }
});
```