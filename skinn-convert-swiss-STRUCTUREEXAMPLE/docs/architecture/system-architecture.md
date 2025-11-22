# System Architecture - SKIIN Switzerland Marketing Site

Generated: 2025-01-15

## Overview

The SKIIN Switzerland marketing site is a modern, multilingual medical marketing platform built with React, TypeScript, and Vite. It follows a component-driven architecture with strong emphasis on type safety, internationalization, and medical compliance.

## Technology Stack

### Core Framework
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM 6** - Client-side routing

### UI & Styling
- **Tailwind CSS 3** - Utility-first CSS
- **shadcn/ui** - Component library (Radix UI based)
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants

### State & Data Management
- **TanStack Query 5** - Server state management
- **React Context API** - Global state (language, theme, analytics)
- **React Hook Form 7** - Form state management
- **Zod 3** - Schema validation

### Analytics & Tracking
- **Google Analytics 4** - User analytics
- **Google Ads** - Conversion tracking
- **HubSpot** - CRM integration
- **Custom Analytics Context** - Consent management

### Development Tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Lovable Tagger** - Component development tags

## Architecture Patterns

### 1. Component Architecture

```
src/
├── components/          # Reusable components
│   ├── ui/             # Design system primitives
│   ├── layout/         # Page structure components
│   ├── home/           # Homepage-specific components
│   ├── analytics/      # Analytics integrations
│   └── physicians/     # Professional audience components
├── pages/              # Route-based page components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
├── translations/       # i18n translation files
└── types/              # TypeScript type definitions
```

### 2. Routing Architecture

The application uses a multilingual routing system:

```
/                       # English homepage
/de/                    # German homepage
/fr/                    # French homepage

/solutions/14-day-holter
/de/loesungen/14-tage-holter
/fr/solutions/holter-14-jours

/partners/gp
/de/partner/hausarzt
/fr/partenaires/medecin-generaliste
```

Routes are automatically generated based on language context and translation mappings.

### 3. State Management

#### Global State (Context API)
- **LanguageContext** - Current language, switcher
- **ThemeContext** - Light/dark theme
- **AnalyticsContext** - Tracking consent and events

#### Server State (TanStack Query)
- API data fetching
- Cache management
- Optimistic updates
- Background refetching

#### Form State (React Hook Form)
- Form validation with Zod
- Field-level error handling
- Submission management

### 4. Translation System

```typescript
// Translation file structure
src/translations/
├── home/
│   ├── en.ts
│   ├── de.ts
│   └── fr.ts
├── navigation/
│   ├── en.ts
│   ├── de.ts
│   └── fr.ts
└── [feature]/
    └── [language].ts
```

Components access translations via custom hooks:
```typescript
const { t } = useTranslation('home');
const title = t('hero.title');
```

### 5. Design System Architecture

#### Design Tokens
- Colors defined as CSS variables
- Spacing based on 4px grid
- Typography scale with fluid sizing

#### Component Variants
Using class-variance-authority for consistent variants:
```typescript
const buttonVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        medical: "medical-styles",
        swiss: "swiss-styles",
        trust: "trust-styles"
      }
    }
  }
);
```

### 6. Analytics Architecture

```
AnalyticsProvider
├── CookieConsent (GDPR compliance)
├── AnalyticsScripts (conditional loading)
├── Event Tracking
│   ├── Page views
│   ├── Conversions
│   └── Custom events
└── Integration Points
    ├── Google Analytics
    ├── Google Ads
    └── HubSpot
```

## Data Flow

### 1. Page Load Flow
1. Router matches URL to language and page
2. Page component loads with language context
3. Components fetch translations
4. Analytics consent checked
5. Content rendered

### 2. Form Submission Flow
1. User fills form (React Hook Form)
2. Validation via Zod schema
3. Submission to API (TanStack Query)
4. Analytics event tracked
5. Success/error feedback via toast

### 3. Language Switch Flow
1. User selects language
2. LanguageContext updates
3. Router navigates to translated route
4. Components re-render with new translations
5. Analytics event tracked

## Security Considerations

### 1. Content Security
- No inline scripts (CSP compatible)
- Sanitized user inputs
- Validated form submissions

### 2. Privacy Compliance
- GDPR-compliant consent management
- Analytics only after consent
- Secure cookie handling

### 3. Medical Compliance
- Protected components for regulated content
- Version control for medical claims
- Audit trail via git history

## Performance Architecture

### 1. Build Optimization
- Vite for fast HMR and builds
- Tree shaking for smaller bundles
- Code splitting by route

### 2. Runtime Performance
- React.lazy for route splitting
- Suspense boundaries
- Image lazy loading
- Component memoization

### 3. Caching Strategy
- TanStack Query cache
- Browser cache headers
- CDN for static assets

## Deployment Architecture

### Development
- Local: Vite dev server (port 8080)
- Branch previews: Vercel

### Production
- Hosting: Netlify
- CDN: Netlify Edge
- Domain: TBD (DNS configuration pending)

## Monitoring & Observability

### 1. Analytics
- User behavior (GA4)
- Conversion tracking (Google Ads)
- Lead tracking (HubSpot)

### 2. Error Tracking
- Console error boundaries
- Form submission errors
- API error handling

### 3. Performance
- Core Web Vitals
- Custom performance marks
- Analytics timing events

## Future Architecture Considerations

### 1. Scalability
- Component library packaging
- Micro-frontend potential
- API gateway integration

### 2. Features
- CMS integration
- Real-time features
- Progressive Web App

### 3. Infrastructure
- Multi-region deployment
- A/B testing infrastructure
- Advanced caching strategies