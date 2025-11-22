# Design Token Usage Guide
VERSION: 1.0
CREATED: 2025-07-30
PURPOSE: Document the new design tokens and their proper usage

## Overview

This guide documents the design tokens added to the SKIIN design system for consistent animation, opacity, and z-index management across all components.

## Animation Tokens

### Transition Durations

```css
--transition-fast: 150ms;   /* Quick interactions like hover states */
--transition-base: 300ms;   /* Standard transitions */
--transition-slow: 500ms;   /* Deliberate animations */
```

#### Usage Classes
- `.transition-fast` - Apply 150ms duration
- `.transition-base` - Apply 300ms duration  
- `.transition-slow` - Apply 500ms duration

#### Examples
```jsx
// Button hover state
<button className="transition-colors transition-fast hover:bg-primary">

// Card expansion
<div className="transition-all transition-base hover:scale-105">

// Image zoom effect
<img className="transition-transform transition-slow hover:scale-110">
```

### Easing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* Default, balanced */
--ease-out: cubic-bezier(0, 0, 0.2, 1);       /* Exit animations */
--ease-in: cubic-bezier(0.4, 0, 1, 1);        /* Entry animations */
```

#### Usage Classes
- `.ease-in-out-custom` - Smooth in and out
- `.ease-out-custom` - Quick start, slow end
- `.ease-in-custom` - Slow start, quick end

## Opacity Scale

### Token Values

```css
--opacity-0: 0;      /* Fully transparent */
--opacity-5: 0.05;   /* Barely visible */
--opacity-10: 0.1;   /* Very light */
--opacity-50: 0.5;   /* Half opacity */
--opacity-90: 0.9;   /* Nearly opaque */
--opacity-100: 1;    /* Fully opaque */
```

#### Usage Classes
- `.opacity-0` through `.opacity-100`

#### Best Practices
- Use `opacity-5` or `opacity-10` for subtle overlays
- Use `opacity-50` for disabled states
- Use `opacity-90` for hover states on solid elements

## Z-Index System

### Token Scale

```css
--z-below: -1;      /* Behind content */
--z-base: 0;        /* Default stacking */
--z-dropdown: 100;  /* Dropdowns, mobile menus */
--z-sticky: 200;    /* Sticky headers, navigation */
--z-modal: 300;     /* Modal dialogs */
--z-popover: 400;   /* Popovers, tooltips backgrounds */
--z-tooltip: 500;   /* Tooltip content */
```

#### Usage Classes
- `.z-below` - Elements behind main content
- `.z-base` - Normal stacking context
- `.z-dropdown` - Dropdown menus, mobile navigation
- `.z-sticky` - Fixed headers, sticky elements
- `.z-modal` - Modal overlays and dialogs
- `.z-popover` - Popover containers, cookie consent
- `.z-tooltip` - Tooltip content (highest priority)

#### Examples
```jsx
// Fixed navigation bar
<nav className="fixed top-0 z-sticky">

// Modal overlay
<div className="fixed inset-0 z-modal">

// Dropdown menu
<div className="absolute z-dropdown">

// Tooltip
<div className="absolute z-tooltip">
```

## Migration Guide

### From Hardcoded Values

```jsx
// Before
<div className="transition-all duration-300">
<div className="z-50">

// After  
<div className="transition-all transition-base">
<div className="z-sticky">
```

### Components Updated

1. **Button** - Swiss variant uses `transition-base`
2. **StatisticsCard** - Card hover uses `transition-base`
3. **ProductBenefit** - Card hover uses `transition-base`, glow effect uses `transition-slow`
4. **ProcessFlow** - Step animations use `transition-slow`, image hover uses `transition-slow`
5. **Navbar** - Main nav uses `z-sticky`, mobile menu uses `z-dropdown`
6. **CookieConsent** - Uses `z-popover` for proper stacking
7. **HomePageTabs** - Uses `z-dropdown` for tab navigation

## Testing Checklist

- [ ] Verify all animations feel natural at their designated speeds
- [ ] Check z-index stacking order with all UI elements visible
- [ ] Test opacity values across all themes
- [ ] Ensure no hardcoded values remain in updated components
- [ ] Validate performance with Chrome DevTools

## Future Considerations

1. Consider adding `--transition-instant: 75ms` for immediate feedback
2. Add more granular opacity values if needed (15, 25, 75, 85)
3. Document composite animations that combine multiple tokens
4. Create Storybook examples showing all token variations