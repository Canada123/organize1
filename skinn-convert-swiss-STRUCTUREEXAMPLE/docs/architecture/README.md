# Architecture Documentation

## Overview
SKIIN Switzerland is a production-ready multi-language marketing website built with React, TypeScript, and Supabase. This document provides the high-level system architecture.

## System Components

### Frontend
- **Framework**: React 18 with TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS with S&W Design System tokens
- **Routing**: React Router with language prefixes (/[language]/[page])
- **State Management**: Context + Reducer pattern for complex forms
- **Build Tool**: Vite for fast development and optimized production builds

### Backend  
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with OTP verification
- **API**: Edge Functions for serverless operations
- **Security**: Row-Level Security (RLS) policies on all tables

### Infrastructure
- **Hosting**: Static site deployment
- **CDN**: Asset optimization and caching
- **Monitoring**: Performance metrics (Core Web Vitals)

## Key Architectural Decisions

### Component Architecture
- Atomic Design pattern with strict size limits (≤50 lines for atoms/molecules)
- Pure functional components (no class components)
- TypeScript strict mode with explicit typing

### Multi-language Support
- 4 languages: English, German, French, Italian
- Route-based language switching
- Centralized translation management

### Security
- OTP verification with bcrypt hashing
- Rate limiting (5 attempts/10 minutes)
- PCI DSS compliance for payment forms
- Secure session management with httpOnly cookies

## Performance Targets
- **LCP**: <2.5s
- **CLS**: <0.1
- **FID**: <100ms
- **Load Time**: Target 47ms (achieved)

## Compliance
- **WCAG 2.1 AA**: Full accessibility compliance
- **Swiss Healthcare**: Canton validation, insurance provider integration
- **Data Protection**: GDPR-compliant data handling

## Related Documentation
- [Database Schema](./database.md) - Detailed database structure and migrations
- [API Documentation](./api.md) - Edge functions and API endpoints
- [Frontend Architecture](../frontend/README.md) - Component structure and patterns