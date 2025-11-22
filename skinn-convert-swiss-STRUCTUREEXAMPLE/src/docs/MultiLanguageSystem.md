
# Multi-Language System Documentation

This document outlines the multilingual implementation in the application.

## Overview

The application supports English (en), German (de), and French (fr) languages. The language system is designed to be consistent across all components and pages.

## Key Components

1. **LanguageContext**
   - Located in `src/contexts/LanguageContext.tsx`
   - Provides the current language state and a setter function
   - Automatically detects browser language on initial load
   - Stores language preference in localStorage

2. **Translation Hooks**
   - Located in `src/hooks/useTranslation.ts`
   - Supports two usage patterns:
     - Direct content: `useTranslation(enContent, deContent, frContent)`
     - Section-based: `useTranslation('home')` or `useTranslation('physicians')`

3. **Translation Files**
   - Organized by section in `src/translations/{section}/{language}.ts`
   - Follow consistent structure across languages
   - Example sections: `home`, `physicians`

4. **Route Translations**
   - Located in `src/utils/routeTranslations.ts`
   - Centralizes route path translations
   - Accessed via `useRouteTranslations` hook

## Adding New Content

When adding new content that requires translation:

1. Add the content in all supported language files
2. Use the appropriate translation hook in your component
3. Reference the translations directly in your JSX

Example:
```tsx
const translations = useTranslation('section');

return (
  <h1>{translations.heading}</h1>
);
```

## URL Structure

- English routes: `/path`
- German routes: `/de/path`
- French routes: `/fr/path`

The `routes/index.tsx` file handles the routing logic, including language detection from the URL.

## Best Practices

1. Always use translation hooks for text content
2. Keep translation keys consistent across language files
3. Update all language files when adding new content
4. Use the `useRouteTranslations` hook for generating links
5. Test all languages when making changes
6. Avoid hardcoding text strings in components

## Common Issues

- Missing translations may cause errors - ensure all keys exist in all language files
- Route mismatches may cause navigation issues - use the route translation utility
- Browser language detection requires appropriate fallbacks

For any questions or issues with the language system, please consult the documentation or contact the development team.
