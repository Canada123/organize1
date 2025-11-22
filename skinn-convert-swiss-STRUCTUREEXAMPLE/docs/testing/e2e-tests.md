# E2E Testing with Playwright

## Configuration

### playwright.config.ts
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
```

## Test Scenarios

### Critical User Paths
1. Homepage → Eligibility → Results
2. Registration → OTP → Dashboard
3. Language switch → Form completion
4. Error recovery flows

### Eligibility Flow Test
```typescript
test('complete eligibility questionnaire', async ({ page }) => {
  // Navigate to eligibility
  await page.goto('/en/eligibility');
  
  // Stage 1: Personal Info
  await page.fill('[name="firstName"]', 'John');
  await page.fill('[name="lastName"]', 'Doe');
  await page.fill('[name="dateOfBirth"]', '1980-01-01');
  await page.click('[data-testid="next-button"]');
  
  // Stage 2: Contact
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="phone"]', '+41791234567');
  await page.click('[data-testid="send-otp"]');
  
  // Enter OTP
  await page.fill('[name="otp"]', '123456');
  await page.click('[data-testid="verify-otp"]');
  
  // Continue through stages...
  
  // Verify submission
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### Multi-language Test
```typescript
test('language switching preserves form data', async ({ page }) => {
  await page.goto('/de/eligibility');
  
  // Fill form in German
  await page.fill('[name="firstName"]', 'Hans');
  
  // Switch to French
  await page.click('[data-testid="language-selector"]');
  await page.click('[data-testid="lang-fr"]');
  
  // Verify data persists
  await expect(page.locator('[name="firstName"]')).toHaveValue('Hans');
  await expect(page.url()).toContain('/fr/eligibility');
});
```

## Page Objects

### Base Page Object
```typescript
export class BasePage {
  constructor(public page: Page) {}
  
  async navigate(path: string) {
    await this.page.goto(path);
  }
  
  async clickButton(text: string) {
    await this.page.click(`button:has-text("${text}")`);
  }
}
```

### Eligibility Page Object
```typescript
export class EligibilityPage extends BasePage {
  async fillPersonalInfo(data: PersonalInfo) {
    await this.page.fill('[name="firstName"]', data.firstName);
    await this.page.fill('[name="lastName"]', data.lastName);
    // ...
  }
  
  async nextStage() {
    await this.clickButton('Next');
  }
  
  async submitForm() {
    await this.clickButton('Submit');
  }
}
```

## Test Data

### Fixtures
```typescript
export const testUsers = {
  eligible: {
    firstName: 'John',
    lastName: 'Doe',
    age: 45,
    canton: 'Zurich'
  },
  ineligible: {
    firstName: 'Jane',
    lastName: 'Smith',
    age: 17,
    canton: 'Geneva'
  }
};
```

## Visual Testing

### Screenshot Comparison
```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/en/home');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## Performance Testing

### Metrics Collection
```typescript
test('performance metrics', async ({ page }) => {
  await page.goto('/en/home');
  
  const metrics = await page.evaluate(() => ({
    lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
    fid: performance.getEntriesByType('first-input')[0]?.processingStart,
    cls: performance.getEntriesByType('layout-shift').reduce((sum, entry) => sum + entry.value, 0)
  }));
  
  expect(metrics.lcp).toBeLessThan(2500);
  expect(metrics.cls).toBeLessThan(0.1);
});
```

## Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

### UI Mode
```bash
npx playwright test --ui
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run E2E tests
  run: |
    npm run build
    npm run preview &
    npx playwright test
```

## Best Practices

### Test Reliability
- Use data-testid attributes
- Wait for elements explicitly
- Handle async operations
- Clean up test data

### Test Speed
- Parallelize tests
- Use API for setup
- Minimize waits
- Reuse authentication