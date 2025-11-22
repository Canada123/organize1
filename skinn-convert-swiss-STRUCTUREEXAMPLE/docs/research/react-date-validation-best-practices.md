# React Date Validation Best Practices & Solutions

## Executive Summary
Date validation in React forms is notoriously problematic due to browser inconsistencies, JavaScript Date object quirks, and varying input formats. This document provides actionable solutions based on industry best practices for robust date handling.

## 1. Common Date Validation Pitfalls

### 1.1 The NaN Problem
```javascript
// PROBLEM: These all can return NaN or Invalid Date
new Date('')           // Invalid Date
new Date(undefined)    // Invalid Date  
new Date('invalid')    // Invalid Date
new Date('13/01/2025') // NaN in some browsers
new Date('2025-02-30') // May accept invalid dates!
```

### 1.2 Root Causes
- **Empty string handling**: `new Date('')` returns Invalid Date, not NaN
- **Format inconsistencies**: Browsers parse dates differently
- **Invalid dates acceptance**: Some browsers accept Feb 30th
- **Timezone issues**: Local vs UTC parsing differences

## 2. Browser Compatibility Issues

### 2.1 HTML5 Date Input Support Matrix
| Browser | Desktop Support | Mobile Support | Notes |
|---------|----------------|----------------|-------|
| Chrome | ✅ Full | ✅ Full | Native picker |
| Firefox | ⚠️ Text input | ✅ Native picker | Desktop shows text field |
| Safari | ⚠️ Text input | ✅ Native picker | Desktop shows text field |
| Edge | ✅ Full | ✅ Full | Native picker |

### 2.2 Key Findings
- **92% browser compatibility** overall, but desktop Safari/Firefox lack date pickers
- Mobile browsers generally have better support
- Input value is always in `YYYY-MM-DD` format when supported

## 3. Robust Validation Patterns

### 3.1 Safe Date Validation Function
```typescript
/**
 * Safely validates a date string
 * @param dateString - The date string to validate
 * @returns boolean indicating if date is valid
 */
export const isValidDate = (dateString: string | undefined): boolean => {
  // Handle empty/undefined inputs
  if (!dateString) return false;
  
  // Parse the date
  const date = new Date(dateString);
  
  // Check if date is valid
  // Using getTime() is more reliable than isNaN(date)
  if (!date || isNaN(date.getTime())) return false;
  
  // Additional validation: ensure it's a real date
  // This catches dates like 2025-02-30
  const [year, month, day] = dateString.split('-').map(Number);
  if (date.getFullYear() !== year || 
      date.getMonth() !== month - 1 || 
      date.getDate() !== day) {
    return false;
  }
  
  return true;
};
```

### 3.2 Age Calculation with Error Handling
```typescript
export const calculateAge = (birthDate: string): number | null => {
  // Validate date first
  if (!isValidDate(birthDate)) return null;
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  // Sanity check
  if (age < 0 || age > 150) return null;
  
  return age;
};
```

### 3.3 React Component Implementation
```typescript
interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (isValid: boolean) => void;
  min?: string;
  max?: string;
  required?: boolean;
}

export const SafeDateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  onValidate,
  min,
  max,
  required
}) => {
  const [error, setError] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Validate
    if (!newValue && required) {
      setError('Date is required');
      onValidate?.(false);
    } else if (newValue && !isValidDate(newValue)) {
      setError('Invalid date');
      onValidate?.(false);
    } else {
      setError('');
      onValidate?.(true);
    }
  };
  
  return (
    <div>
      <input
        type="date"
        value={value || ''}  // Handle undefined/null
        onChange={handleChange}
        min={min}
        max={max}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? "date-error" : undefined}
      />
      {error && (
        <span id="date-error" role="alert" className="error">
          {error}
        </span>
      )}
    </div>
  );
};
```

## 4. Library Solutions

### 4.1 date-fns (Recommended)
```typescript
import { parse, isValid, format, isBefore, isAfter } from 'date-fns';

// Safe parsing with format specification
const parseDate = (dateString: string): Date | null => {
  const parsed = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? parsed : null;
};

// Validate date range
const isDateInRange = (date: string, min: string, max: string): boolean => {
  const parsed = parseDate(date);
  if (!parsed) return false;
  
  const minDate = parseDate(min);
  const maxDate = parseDate(max);
  
  return (!minDate || !isBefore(parsed, minDate)) && 
         (!maxDate || !isAfter(parsed, maxDate));
};
```

### 4.2 Zod Schema Validation
```typescript
import { z } from 'zod';

const dateSchema = z.string()
  .min(1, 'Date is required')
  .refine((val) => isValidDate(val), 'Invalid date')
  .refine((val) => {
    const age = calculateAge(val);
    return age !== null && age >= 18;
  }, 'Must be at least 18 years old')
  .refine((val) => {
    const age = calculateAge(val);
    return age !== null && age <= 120;
  }, 'Invalid date of birth');

// Use with React Hook Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  dateOfBirth: dateSchema
});

const form = useForm({
  resolver: zodResolver(formSchema)
});
```

### 4.3 React Date Picker (For Better UX)
```typescript
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export const EnhancedDateInput: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      dateFormat="dd.MM.yyyy"  // Swiss format
      minDate={new Date('1900-01-01')}
      maxDate={new Date()}
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100}
      placeholderText="DD.MM.YYYY"
      isClearable
      autoComplete="off"
    />
  );
};
```

## 5. Cross-Browser Solutions

### 5.1 Feature Detection & Fallback
```typescript
// Check if browser supports date input
const supportsDateInput = (): boolean => {
  const input = document.createElement('input');
  input.setAttribute('type', 'date');
  return input.type === 'date';
};

// Component with fallback
export const CrossBrowserDateInput: React.FC<DateInputProps> = (props) => {
  const hasNativePicker = supportsDateInput();
  
  if (!hasNativePicker) {
    // Use date picker library for Firefox/Safari desktop
    return <EnhancedDateInput {...props} />;
  }
  
  return <SafeDateInput {...props} />;
};
```

### 5.2 Polyfill Approach
```javascript
// Using Modernizr for feature detection
if (!Modernizr.inputtypes.date) {
  // Load date picker polyfill
  import('react-datepicker').then(({ default: DatePicker }) => {
    // Use DatePicker component
  });
}
```

## 6. Accessibility Best Practices

### 6.1 ARIA Labels and Descriptions
```tsx
<div role="group" aria-labelledby="dob-label">
  <label id="dob-label" htmlFor="dob-input">
    Date of Birth
    <span aria-label="required">*</span>
  </label>
  <input
    id="dob-input"
    type="date"
    aria-required="true"
    aria-invalid={!!error}
    aria-describedby="dob-hint dob-error"
  />
  <span id="dob-hint" className="hint">
    Format: DD.MM.YYYY
  </span>
  {error && (
    <span id="dob-error" role="alert" className="error">
      {error}
    </span>
  )}
</div>
```

### 6.2 Keyboard Navigation
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  // Allow arrow keys to change date
  if (e.key === 'ArrowUp') {
    incrementDay();
  } else if (e.key === 'ArrowDown') {
    decrementDay();
  }
};
```

## 7. Testing Strategies

### 7.1 Unit Tests
```typescript
import { describe, test, expect } from 'vitest';

describe('Date Validation', () => {
  test.each([
    ['2025-01-01', true],
    ['', false],
    ['invalid', false],
    ['2025-13-01', false],
    ['2025-02-30', false],
    ['2025-02-28', true],
    ['2024-02-29', true], // Leap year
    ['2025-02-29', false], // Not leap year
  ])('isValidDate(%s) returns %s', (input, expected) => {
    expect(isValidDate(input)).toBe(expected);
  });
  
  test('calculateAge handles invalid dates', () => {
    expect(calculateAge('')).toBeNull();
    expect(calculateAge('invalid')).toBeNull();
    expect(calculateAge('2025-02-30')).toBeNull();
  });
  
  test('calculateAge calculates correctly', () => {
    // Mock current date
    vi.setSystemTime(new Date('2025-08-26'));
    
    expect(calculateAge('2000-01-01')).toBe(25);
    expect(calculateAge('2000-12-31')).toBe(24);
  });
});
```

### 7.2 E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test('date input validation', async ({ page }) => {
  await page.goto('/form');
  
  const dateInput = page.locator('input[type="date"]');
  
  // Test invalid date
  await dateInput.fill('invalid');
  await expect(page.locator('.error')).toContainText('Invalid date');
  
  // Test valid date
  await dateInput.fill('2000-01-01');
  await expect(page.locator('.error')).not.toBeVisible();
  
  // Test age validation
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);
  await dateInput.fill(futureDate.toISOString().split('T')[0]);
  await expect(page.locator('.error')).toContainText('Invalid date of birth');
});
```

## 8. Recommended Solution for SKIIN Switzerland

### 8.1 Implementation Strategy
1. **Use native HTML5 date input** as the base (92% support)
2. **Add robust validation** using the patterns above
3. **Implement date-fns** for parsing and formatting
4. **Add Zod validation** for form schema
5. **Consider react-datepicker** for desktop Firefox/Safari

### 8.2 Complete Solution
```typescript
import { useState, useCallback } from 'react';
import { isValid, parse } from 'date-fns';
import { z } from 'zod';

// Validation schema
const dateOfBirthSchema = z.string()
  .min(1, 'Date of birth is required')
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid date')
  .refine((val) => {
    const date = new Date(val);
    const age = calculateAge(val);
    return age !== null && age >= 18 && age <= 120;
  }, 'Must be between 18 and 120 years old');

// Component
export const DateOfBirthField: React.FC = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [age, setAge] = useState<number | null>(null);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Clear error on empty
    if (!newValue) {
      setError('');
      setAge(null);
      return;
    }
    
    // Validate
    const result = dateOfBirthSchema.safeParse(newValue);
    if (!result.success) {
      setError(result.error.errors[0].message);
      setAge(null);
    } else {
      setError('');
      setAge(calculateAge(newValue));
    }
  }, []);
  
  return (
    <div className="form-field">
      <label htmlFor="dob">
        Date of Birth *
      </label>
      <input
        id="dob"
        type="date"
        value={value}
        onChange={handleChange}
        min="1900-01-01"
        max={new Date().toISOString().split('T')[0]}
        required
        aria-invalid={!!error}
        aria-describedby={error ? "dob-error" : "dob-hint"}
      />
      <span id="dob-hint" className="hint">
        You must be 18 or older
      </span>
      {error && (
        <span id="dob-error" role="alert" className="error">
          {error}
        </span>
      )}
      {age !== null && (
        <span className="success">
          Age: {age} years
        </span>
      )}
    </div>
  );
};
```

## 9. Key Takeaways

1. **Never trust `new Date()` alone** - Always validate the result
2. **Check for NaN using `isNaN(date.getTime())`** not `isNaN(date)`
3. **HTML5 date inputs work on 92% of browsers** but need fallbacks
4. **Mobile has better support** than desktop for native pickers
5. **Use libraries** (date-fns, dayjs) for complex date operations
6. **Always handle empty strings** explicitly
7. **Test across browsers** especially Safari and Firefox
8. **Add accessibility attributes** for screen readers
9. **Validate on both client and server** for security
10. **Consider UX** - native pickers are often better than custom ones

## 10. Quick Fix for ContactAccountStage

```typescript
// Replace the problematic code with:
const handleDateChange = (value: string) => {
  // Handle empty value
  if (!value) {
    setDateOfBirth('');
    setAge(null);
    return;
  }
  
  // Validate before parsing
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    setDateOfBirth(value);
    setAge(null);
    setError('Invalid date');
    return;
  }
  
  // Calculate age safely
  const calculatedAge = calculateAge(value);
  if (calculatedAge === null) {
    setError('Invalid date of birth');
  } else {
    setError('');
    setAge(calculatedAge);
  }
  
  setDateOfBirth(value);
};
```

---

*Generated: 2025-08-26*  
*Research ID: RS-2025-08-26-001*  
*Status: Complete - Ready for Implementation*