# S&W Design System

## Design Tokens

### Colors
```css
--primary: #7B3FF2 (Myant Violet)
--secondary: #2D3748
--success: #48BB78
--warning: #ED8936
--error: #F56565
--background: #FFFFFF
--surface: #F7FAFC
```

### Typography
```css
--font-family: 'Inter', system-ui, sans-serif
--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
--font-size-2xl: 1.5rem
```

### Spacing
```css
--space-1: 0.25rem
--space-2: 0.5rem
--space-3: 0.75rem
--space-4: 1rem
--space-6: 1.5rem
--space-8: 2rem
--space-12: 3rem
```

### Breakpoints
```css
--screen-sm: 640px
--screen-md: 768px
--screen-lg: 1024px
--screen-xl: 1280px
```

## Tailwind Configuration

### Custom Classes
```javascript
{
  theme: {
    extend: {
      colors: {
        'myant-violet': '#7B3FF2',
        'swiss-red': '#FF0000'
      }
    }
  }
}
```

## Component Library

### Base Components (shadcn/ui)
- Button (variants: primary, secondary, outline, ghost)
- Input (with validation states)
- Select (with search)
- Card (with elevation levels)
- Dialog/Modal
- Toast notifications
- Progress indicators

### Custom Components
- EligibilityProgressBar
- SwissCantonSelector
- InsuranceProviderCard
- LanguageToggle
- MinimalInput (branded input)

## Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratios ≥4.5:1
- Focus indicators on all interactive elements
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader optimized

### Testing
- axe-core automated testing
- Manual keyboard navigation tests
- Screen reader compatibility tests

## Icons

### System Icons
Using Lucide React for consistent iconography:
- Navigation: Menu, Close, ChevronDown
- Actions: Plus, Edit, Trash, Save
- Status: CheckCircle, AlertCircle, Info

### Custom Icons
- Swiss flag icon
- Heart health indicators
- Insurance logos

## Animation

### Transitions
```css
--transition-fast: 150ms ease-in-out
--transition-base: 250ms ease-in-out
--transition-slow: 350ms ease-in-out
```

### Motion Principles
- Subtle animations only
- Respect prefers-reduced-motion
- Performance over aesthetics

## Usage Guidelines

### Do's
- Use design tokens consistently
- Follow accessibility guidelines
- Test on multiple devices
- Maintain visual hierarchy

### Don'ts
- Don't override design tokens inline
- Don't create custom colors without approval
- Don't use animations excessively
- Don't ignore accessibility warnings