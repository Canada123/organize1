# Multi-language Implementation

## Overview
Complete internationalization (i18n) support for 4 Swiss official languages: German, French, Italian, and English.

## Language Configuration

### Supported Languages
```typescript
const LANGUAGES = {
  de: { name: 'Deutsch', flag: '🇨🇭' },
  fr: { name: 'Français', flag: '🇫🇷' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  en: { name: 'English', flag: '🇬🇧' }
};
```

### Default Language
- Switzerland default: German (de)
- Fallback: English (en)

## Routing Strategy

### URL Structure
```
/{language}/{page}
/de/home     → German homepage
/fr/home     → French homepage
/it/home     → Italian homepage
/en/home     → English homepage
```

### Route Generation
Total routes: 98 (4 languages × 24+ pages)

## Translation Management

### File Structure
```
src/translations/
├── de.ts    # German translations
├── fr.ts    # French translations
├── it.ts    # Italian translations
└── en.ts    # English translations
```

### Translation Object Structure
```typescript
interface Translations {
  common: {
    buttons: { ... }
    labels: { ... }
    messages: { ... }
  }
  pages: {
    home: { ... }
    eligibility: { ... }
    contact: { ... }
  }
  errors: { ... }
}
```

## Implementation

### Context Provider
```typescript
const LanguageContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}>();
```

### Translation Hook
```typescript
function useTranslation() {
  const { language, t } = useContext(LanguageContext);
  return { language, t };
}
```

### Usage Example
```tsx
function Component() {
  const { t } = useTranslation();
  return <h1>{t('pages.home.title')}</h1>;
}
```

## Language Detection

### Priority Order
1. URL parameter (highest)
2. localStorage preference
3. Browser language
4. Default (German)

### Detection Logic
```typescript
function detectLanguage(): string {
  // 1. Check URL
  const urlLang = getLanguageFromURL();
  if (urlLang) return urlLang;
  
  // 2. Check localStorage
  const savedLang = localStorage.getItem('language');
  if (savedLang) return savedLang;
  
  // 3. Check browser
  const browserLang = navigator.language.slice(0, 2);
  if (LANGUAGES[browserLang]) return browserLang;
  
  // 4. Default
  return 'de';
}
```

## Content Management

### Static Content
- UI labels and messages
- Error messages
- Form field labels
- Button text

### Dynamic Content
- Database content with language field
- API responses with language parameter
- User-generated content tags

## SEO Optimization

### Meta Tags
```html
<html lang="de">
<meta property="og:locale" content="de_CH">
<link rel="alternate" hreflang="fr" href="/fr/page">
<link rel="alternate" hreflang="it" href="/it/page">
<link rel="alternate" hreflang="en" href="/en/page">
```

### Sitemap
Separate sitemap for each language:
- /sitemap-de.xml
- /sitemap-fr.xml
- /sitemap-it.xml
- /sitemap-en.xml

## Testing

### Translation Coverage
- Missing key detection
- Fallback testing
- Character encoding
- Text overflow handling

### E2E Tests
```typescript
test('language switching', async () => {
  await page.goto('/de/home');
  await page.click('[data-testid="language-selector"]');
  await page.click('[data-testid="lang-fr"]');
  expect(page.url()).toContain('/fr/home');
});
```

## Performance

### Optimizations
- Lazy load translations
- Cache selected language
- Minimize translation bundle size
- Use translation keys efficiently

### Bundle Sizes
- de.ts: ~45KB
- fr.ts: ~48KB
- it.ts: ~44KB
- en.ts: ~42KB

## Best Practices

### Do's
- Use descriptive translation keys
- Keep translations consistent
- Test with actual translators
- Handle pluralization properly

### Don'ts
- Don't hardcode text in components
- Don't mix languages in one page
- Don't forget RTL support (future)
- Don't ignore cultural differences