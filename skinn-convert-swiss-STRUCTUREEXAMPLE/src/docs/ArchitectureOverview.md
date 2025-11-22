# Architecture Overview

This document explains the high level structure of the project, key
conventions and the main libraries used throughout the code base.

## Frameworks and Tooling

- **React** is used to build the user interface.
- **Vite** provides the development server and build tooling.
- **TypeScript** provides static typing for the entire project.
- **Tailwind CSS** with **shadcn/ui** components is used for styling.
- **React Router** handles client-side routing.

All dependencies can be found in `package.json`.

## Directory Structure

```
src/
  components/   Reusable UI components and analytics helpers
  contexts/     React context providers
  docs/         Internal documentation
  hooks/        Custom React hooks
  lib/          Shared utilities (analytics, consent management, etc.)
  pages/        Page level React components used in routing
  routes/       React Router configuration
  translations/ JSON-like TypeScript files with language strings
  utils/        Miscellaneous helper utilities
```

The alias `@` maps to the `src/` folder which simplifies imports.

## Internationalisation

The multilingual system is described in detail in
`src/docs/MultiLanguageSystem.md`. `useTranslation` provides translated
strings based on the current language from `LanguageContext`.

## Analytics and Consent

Analytics scripts are loaded via `AnalyticsProvider` and
`AnalyticsScripts` components. Cookie preferences are handled by the
`CookieConsent` component and stored using utilities in
`lib/consentManager.ts`. Tracking helpers live in `lib/analytics.ts`.

## Toast Notifications

`useToast` and the global `toast` function implement a lightweight toast
queue using Radix UI primitives. Toasts are automatically removed after a
short delay.

## Adding New Features

1. Add any new React components inside `src/components` or
   `src/pages` depending on scope.
2. If you need translations, update the relevant files in
   `src/translations` and use `useTranslation` in your components.
3. For new routes, update `src/routes/index.tsx` and provide translations
   via `useRouteTranslations` if necessary.
4. Keep utility functions inside `src/lib` or `src/utils` to maintain a
   clear separation of concerns.

