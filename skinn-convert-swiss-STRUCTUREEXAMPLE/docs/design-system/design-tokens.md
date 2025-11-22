# SKIIN Design Tokens

## Overview
Shared design tokens used across both the marketing website and eligibility questionnaire to ensure visual consistency.

## 🎨 Color Palette

### Swiss Healthcare Colors
```css
:root {
  /* Primary Blue - Swiss medical trust */
  --swiss-blue: #004C96;
  --swiss-blue-light: #0066CC;
  --swiss-blue-dark: #003366;
  
  /* Trust Purple - Myant brand */
  --swiss-trust: #5549A6;
  --swiss-trust-light: #6B5FB7;
  --swiss-trust-dark: #443995;
  
  /* Status Colors */
  --swiss-success: #22C55E;
  --swiss-warning: #F59E0B;
  --swiss-error: #DC2626;
  --swiss-info: #0EA5E9;
  
  /* Neutral Grays */
  --swiss-neutral-50: #F8FAFC;
  --swiss-neutral-100: #F1F5F9;
  --swiss-neutral-200: #E2E8F0;
  --swiss-neutral-300: #CBD5E1;
  --swiss-neutral-400: #94A3B8;
  --swiss-neutral-500: #64748B;
  --swiss-neutral-600: #475569;
  --swiss-neutral-700: #334155;
  --swiss-neutral-800: #1E293B;
  --swiss-neutral-900: #0F172A;
}
```

### Myant Violet (Website)
```css
:root {
  --myant-violet-50: #FAF7FF;
  --myant-violet-100: #F3ECFF;
  --myant-violet-200: #E9DBFF;
  --myant-violet-300: #D8B9FF;
  --myant-violet-400: #BE87FF;
  --myant-violet-500: #A455FF;
  --myant-violet-600: #8C2FF7;
  --myant-violet-700: #7718DB;
  --myant-violet-800: #6418B6;
  --myant-violet-900: #531895;
  --myant-violet-950: #360565;
}
```

## 📝 Typography

### Font Families
```css
:root {
  --font-heading: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
}
```

### Font Sizes
```css
:root {
  /* Type Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

### Font Weights
```css
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Line Heights
```css
:root {
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

## 📐 Spacing

### 8-Point Grid System
```css
:root {
  /* Base unit: 8px */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0.5: 0.125rem;  /* 2px */
  --spacing-1: 0.25rem;     /* 4px */
  --spacing-2: 0.5rem;      /* 8px - Base */
  --spacing-3: 0.75rem;     /* 12px */
  --spacing-4: 1rem;        /* 16px */
  --spacing-5: 1.25rem;     /* 20px */
  --spacing-6: 1.5rem;      /* 24px */
  --spacing-8: 2rem;        /* 32px */
  --spacing-10: 2.5rem;     /* 40px */
  --spacing-12: 3rem;       /* 48px */
  --spacing-16: 4rem;       /* 64px */
  --spacing-20: 5rem;       /* 80px */
  --spacing-24: 6rem;       /* 96px */
}
```

### Named Spacing
```css
:root {
  --spacing-xs: var(--spacing-1);   /* 4px */
  --spacing-sm: var(--spacing-2);   /* 8px */
  --spacing-md: var(--spacing-4);   /* 16px */
  --spacing-lg: var(--spacing-6);   /* 24px */
  --spacing-xl: var(--spacing-8);   /* 32px */
  --spacing-2xl: var(--spacing-12); /* 48px */
}
```

## 🎯 Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-default: 0.25rem; /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;
}
```

## 🌓 Shadows

```css
:root {
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}
```

## ⚡ Animations

### Transitions
```css
:root {
  --transition-none: none;
  --transition-all: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
  
  /* Easing Functions */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Animation Keyframes
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
```

## 📱 Breakpoints

```css
:root {
  --screen-xs: 475px;   /* Mobile S */
  --screen-sm: 640px;   /* Mobile L / Tablet Portrait */
  --screen-md: 768px;   /* Tablet Landscape */
  --screen-lg: 1024px;  /* Desktop */
  --screen-xl: 1280px;  /* Desktop L */
  --screen-2xl: 1536px; /* Desktop XL */
}
```

## 🎨 Z-Index Scale

```css
:root {
  --z-0: 0;
  --z-10: 10;      /* Dropdown */
  --z-20: 20;      /* Sticky */
  --z-30: 30;      /* Fixed */
  --z-40: 40;      /* Modal backdrop */
  --z-50: 50;      /* Modal */
  --z-9999: 9999;  /* Toast/Alert */
}
```

## 🔧 Usage Examples

### In CSS
```css
.card {
  background: var(--swiss-neutral-50);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.button-primary {
  background: var(--swiss-blue);
  color: white;
  font-weight: var(--font-medium);
  transition: var(--transition-normal);
}
```

### In Tailwind Config
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'swiss-blue': '#004C96',
        'swiss-trust': '#5549A6',
      },
      fontFamily: {
        'ibm-plex-sans': ['IBM Plex Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', // 72px
      }
    }
  }
}
```

### In React Components
```tsx
const styles = {
  container: {
    padding: 'var(--spacing-lg)',
    backgroundColor: 'var(--swiss-neutral-50)',
    borderRadius: 'var(--radius-lg)',
  }
};
```

## 📋 Token Categories

| Category | Usage | Example |
|----------|-------|---------|
| **Colors** | UI elements, states | `--swiss-blue` |
| **Typography** | Text styling | `--text-lg`, `--font-medium` |
| **Spacing** | Margins, padding | `--spacing-md` |
| **Borders** | Rounded corners | `--radius-lg` |
| **Shadows** | Depth, elevation | `--shadow-md` |
| **Animations** | Transitions | `--transition-normal` |
| **Breakpoints** | Responsive design | `--screen-lg` |
| **Z-Index** | Layering | `--z-modal` |

## ✅ Best Practices

1. **Always use tokens** instead of hardcoded values
2. **Follow the 8pt grid** for consistent spacing
3. **Use semantic naming** for custom tokens
4. **Document deviations** from the system
5. **Test across themes** (light/dark mode)
6. **Maintain consistency** across platforms