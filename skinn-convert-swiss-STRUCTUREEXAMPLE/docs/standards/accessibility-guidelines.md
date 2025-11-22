# Accessibility Guidelines - SKIIN Switzerland

## Overview
SKIIN Switzerland is committed to providing an accessible healthcare platform for all users, including those with disabilities. This document outlines our accessibility standards and implementation guidelines.

## Compliance Requirements

### WCAG 2.1 Level AA
We maintain **WCAG 2.1 Level AA** compliance as our minimum standard, with Level AAA compliance for critical healthcare features.

### Legal Requirements
- **Swiss Disability Discrimination Act (BehiG)**
- **EU Web Accessibility Directive**
- **Section 508 (US)**
- **EN 301 549 (European Standard)**

## Core Principles (POUR)

### 1. Perceivable
Information and UI components must be presentable in ways users can perceive.

### 2. Operable
UI components and navigation must be operable by all users.

### 3. Understandable
Information and UI operation must be understandable.

### 4. Robust
Content must be robust enough for interpretation by assistive technologies.

## Implementation Guidelines

### Keyboard Navigation

#### Full Keyboard Access
```typescript
// ✅ Good - Keyboard accessible button
<button 
  onClick={handleSubmit}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSubmit();
    }
  }}
  tabIndex={0}
>
  Submit
</button>

// ❌ Bad - Click-only div
<div onClick={handleSubmit}>Submit</div>
```

#### Focus Management
- **Visible focus indicators**: Never remove outline without replacement
- **Focus order**: Logical tab order following visual flow
- **Focus trapping**: Modal dialogs must trap focus
- **Skip links**: Provide skip to main content links

```css
/* Custom focus styles */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Screen Reader Support

#### Semantic HTML
```html
<!-- ✅ Good - Semantic structure -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<!-- ❌ Bad - Non-semantic -->
<div class="navigation">
  <div class="nav-item">Home</div>
</div>
```

#### ARIA Labels and Descriptions
```typescript
// Form field with proper labeling
<div>
  <label htmlFor="email" id="email-label">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    aria-labelledby="email-label"
    aria-describedby="email-error"
    aria-required="true"
    aria-invalid={hasError}
  />
  {hasError && (
    <span id="email-error" role="alert">
      Please enter a valid email address
    </span>
  )}
</div>
```

#### Live Regions
```typescript
// Announce dynamic updates
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  {message && <p>{message}</p>}
</div>

// Critical alerts
<div 
  role="alert" 
  aria-live="assertive"
>
  {error && <p>{error}</p>}
</div>
```

### Color and Contrast

#### Contrast Ratios
- **Normal text**: 4.5:1 minimum
- **Large text** (18pt+): 3:1 minimum
- **UI components**: 3:1 minimum
- **Focus indicators**: 3:1 minimum

#### Color Independence
```typescript
// ✅ Good - Multiple indicators
<div className={cn(
  "status-indicator",
  status === 'error' && "bg-red-500"
)}>
  <Icon name={status === 'error' ? 'alert' : 'check'} />
  <span>{status === 'error' ? 'Error' : 'Success'}</span>
</div>

// ❌ Bad - Color only
<div className={status === 'error' ? 'red' : 'green'} />
```

### Forms and Inputs

#### Label Association
```typescript
// Explicit label association
<label htmlFor="birthdate">
  Date of Birth
  <span aria-label="required">*</span>
</label>
<input 
  id="birthdate" 
  type="date"
  required
  aria-required="true"
/>
```

#### Error Handling
```typescript
// Accessible error messages
const FormField = ({ error, ...props }) => (
  <div>
    <input
      {...props}
      aria-invalid={!!error}
      aria-describedby={error ? `${props.id}-error` : undefined}
    />
    {error && (
      <span 
        id={`${props.id}-error`}
        className="error-message"
        role="alert"
      >
        <Icon name="error" aria-hidden="true" />
        {error}
      </span>
    )}
  </div>
);
```

#### Progress Indicators
```typescript
// Multi-step form progress
<div role="group" aria-label="Form progress">
  <ol aria-label="Progress steps">
    {steps.map((step, index) => (
      <li key={step.id}>
        <button
          aria-current={index === currentStep ? 'step' : undefined}
          aria-label={`Step ${index + 1}: ${step.label}, ${
            index < currentStep ? 'completed' : 
            index === currentStep ? 'current' : 
            'not started'
          }`}
        >
          {step.label}
        </button>
      </li>
    ))}
  </ol>
</div>
```

### Images and Media

#### Alt Text Guidelines
```typescript
// Informative image
<img 
  src="heart-diagram.png" 
  alt="Diagram showing the four chambers of the human heart"
/>

// Decorative image
<img 
  src="decorative-border.png" 
  alt=""
  role="presentation"
/>

// Complex image
<figure>
  <img 
    src="eligibility-flowchart.png" 
    alt="Eligibility determination flowchart"
    aria-describedby="flowchart-description"
  />
  <figcaption id="flowchart-description">
    Detailed flowchart showing the eligibility determination process...
  </figcaption>
</figure>
```

#### Video Accessibility
```typescript
<video controls>
  <source src="procedure-guide.mp4" type="video/mp4" />
  <track 
    kind="captions" 
    src="captions-en.vtt" 
    srclang="en" 
    label="English"
    default
  />
  <track 
    kind="captions" 
    src="captions-de.vtt" 
    srclang="de" 
    label="Deutsch"
  />
  <track 
    kind="descriptions" 
    src="descriptions-en.vtt" 
    srclang="en" 
    label="English descriptions"
  />
</video>
```

### Navigation and Routing

#### Breadcrumbs
```typescript
<nav aria-label="Breadcrumb">
  <ol className="breadcrumb">
    <li><a href="/">Home</a></li>
    <li><a href="/eligibility">Eligibility</a></li>
    <li aria-current="page">Personal Information</li>
  </ol>
</nav>
```

#### Route Announcements
```typescript
// Announce route changes
useEffect(() => {
  const announcement = `Navigated to ${pageTitle}`;
  announceToScreenReader(announcement);
}, [location.pathname]);
```

### Tables and Data

#### Accessible Tables
```typescript
<table>
  <caption>Insurance Provider Comparison</caption>
  <thead>
    <tr>
      <th scope="col">Provider</th>
      <th scope="col">Monthly Cost (CHF)</th>
      <th scope="col">Coverage</th>
      <th scope="col">Deductible</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Swica</th>
      <td>350</td>
      <td>Standard</td>
      <td>300</td>
    </tr>
  </tbody>
</table>
```

### Modals and Overlays

#### Focus Management
```typescript
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      const previousFocus = document.activeElement;
      
      // Focus modal on open
      modalRef.current?.focus();
      
      // Restore focus on close
      return () => {
        previousFocus?.focus();
      };
    }
  }, [isOpen]);
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <button 
        onClick={onClose}
        aria-label="Close dialog"
      >
        ×
      </button>
      {children}
    </div>
  );
};
```

### Language Support

#### Language Declaration
```html
<html lang="de-CH">
  <!-- Swiss German content -->
</html>
```

#### Language Switching
```typescript
<nav aria-label="Language selection">
  <ul>
    <li>
      <button 
        aria-current={lang === 'en' ? 'true' : undefined}
        onClick={() => setLanguage('en')}
        lang="en"
      >
        English
      </button>
    </li>
    <li>
      <button 
        aria-current={lang === 'de' ? 'true' : undefined}
        onClick={() => setLanguage('de')}
        lang="de"
      >
        Deutsch
      </button>
    </li>
  </ul>
</nav>
```

## Testing Procedures

### Manual Testing
1. **Keyboard-only navigation**: Complete all tasks without mouse
2. **Screen reader testing**: NVDA (Windows), JAWS, VoiceOver (Mac/iOS)
3. **Zoom testing**: 200% zoom without horizontal scrolling
4. **Color contrast**: Use tools like WebAIM contrast checker
5. **Focus visible**: Check all interactive elements

### Automated Testing
```javascript
// Vitest accessibility tests
import { axe } from 'vitest-axe';

test('should not have accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Tools
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web Accessibility Evaluation Tool
- **Lighthouse**: Chrome DevTools accessibility audit
- **Pa11y**: Command-line accessibility testing
- **Screen readers**: NVDA, JAWS, VoiceOver, TalkBack

## Common Issues and Solutions

### Issue: Missing form labels
**Solution**: Always associate labels with form controls
```typescript
<label htmlFor="input-id">Label</label>
<input id="input-id" />
```

### Issue: Low contrast text
**Solution**: Check contrast ratios and adjust colors
```css
/* Ensure 4.5:1 contrast ratio */
.text-primary {
  color: #1a1a1a; /* on white background */
}
```

### Issue: Keyboard trap
**Solution**: Ensure users can escape all components
```typescript
onKeyDown={(e) => {
  if (e.key === 'Escape') {
    onClose();
  }
}}
```

### Issue: Missing page structure
**Solution**: Use semantic HTML and landmarks
```html
<header>...</header>
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

## Resources

### Guidelines and Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Swiss Accessibility Guidelines](https://www.access-for-all.ch/)

### Learning Resources
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Testing Resources
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Compliance Checklist

Before deployment, ensure:
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] Color contrast meets standards
- [ ] Forms properly labeled
- [ ] Errors clearly announced
- [ ] Images have appropriate alt text
- [ ] Videos have captions/transcripts
- [ ] Page has proper structure
- [ ] ARIA used correctly
- [ ] Language properly declared
- [ ] Automated tests passing