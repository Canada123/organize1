# SKIIN Switzerland Design Tokens
## Minimalistic Design System v1.0

### Design Philosophy
- **Minimalism First**: Remove all unnecessary elements
- **Functional Beauty**: Every element serves a purpose  
- **Swiss Precision**: Clean lines, clear hierarchy
- **Medical Professionalism**: Trust through simplicity

---

## 🎨 Color Palette

### Primary Colors
```css
--skiin-navy: #004C96;        /* Deep navy - primary buttons, headers */
--skiin-blue: #5298F2;        /* Light blue - hover states, links */
--skiin-violet: #5549A6;      /* Violet accent - sparingly used */
--skiin-beige: #EEE8E1;       /* Neutral beige - soft backgrounds */
```

### Text Colors
```css
--text-primary: #0D0D0D;      /* Near black - main content */
--text-secondary: #475259;    /* Charcoal - secondary text */
--text-muted: #8B919B;        /* Light gray - subtle elements */
--text-inverse: #FFFFFF;      /* White - on dark backgrounds */
```

### Background Colors
```css
--bg-primary: #FFFFFF;        /* Pure white - main background */
--bg-secondary: #FAFAFA;      /* Off white - sections */
--bg-soft: #EEE8E1;          /* Beige - cards, containers */
--bg-muted: #F5F5F5;         /* Light gray - disabled states */
```

### Semantic Colors
```css
--success: #0F9D58;          /* Green - success states */
--warning: #F4B400;          /* Amber - warnings */
--error: #DB4437;            /* Red - errors */
--info: #4285F4;             /* Blue - information */
```

---

## 📐 Typography Scale

### Font Family
```css
--font-primary: 'IBM Plex Sans', -apple-system, sans-serif;
--font-mono: 'IBM Plex Mono', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

---

## 📏 Spacing System (4px base)

### Core Spacing
```css
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

---

## 🔲 Border System

### Border Radius
```css
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px */
--radius-base: 0.25rem;   /* 4px */
--radius-md: 0.375rem;    /* 6px */
--radius-lg: 0.5rem;      /* 8px */
--radius-xl: 0.75rem;     /* 12px */
--radius-full: 9999px;    /* Pill shape */
```

### Border Width
```css
--border-0: 0;
--border-1: 1px;
--border-2: 2px;
```

---

## 🌑 Shadow System

### Elevation Levels
```css
--shadow-none: none;
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-base: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.10);
--shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.12);
```

---

## ⚡ Transitions

### Duration
```css
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 350ms;
```

### Easing
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 📱 Breakpoints

```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

---

## Component Token Examples

### Button Tokens
```css
/* Primary Button */
--btn-primary-bg: var(--skiin-navy);
--btn-primary-hover: var(--skiin-blue);
--btn-primary-text: var(--text-inverse);
--btn-primary-shadow: var(--shadow-sm);

/* Secondary Button */
--btn-secondary-bg: transparent;
--btn-secondary-border: var(--skiin-navy);
--btn-secondary-hover-bg: var(--skiin-navy);
--btn-secondary-text: var(--skiin-navy);
--btn-secondary-hover-text: var(--text-inverse);
```

### Card Tokens
```css
--card-bg: var(--bg-primary);
--card-border: 1px solid rgba(0, 76, 150, 0.1);
--card-radius: var(--radius-lg);
--card-shadow: var(--shadow-base);
--card-padding: var(--space-6);
```

### Form Tokens
```css
--input-bg: var(--bg-primary);
--input-border: 1px solid rgba(71, 82, 89, 0.2);
--input-focus-border: var(--skiin-navy);
--input-radius: var(--radius-base);
--input-padding: var(--space-3) var(--space-4);
--input-height: 44px;
```