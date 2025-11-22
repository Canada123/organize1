# SKIIN Switzerland Project Overview

## Purpose
SKIIN Switzerland is a comprehensive marketing website for Myant Health's Swiss operations, featuring a multi-language heart health screening service with advanced eligibility questionnaire and Swiss healthcare compliance.

## Key Characteristics
- **Healthcare Focus**: Heart health monitoring and screening service for Swiss market
- **Swiss Compliance**: Integrated with 9 major Swiss insurance providers, VAT calculations (7.7%), canton validation
- **Multi-language**: 4 languages (English, German, French, Italian) with complete routing system
- **Medical Device Marketing**: Regulatory compliance for medical device marketing in Switzerland
- **Current Phase**: Component refactoring completed - from 851-line monolith to atomic components (≤50 lines each)

## Architecture Summary
- **Frontend**: Vite + React 18 + TypeScript 5 + Tailwind CSS + shadcn/ui
- **Routing**: React Router with language prefixes (/en/, /de/, /fr/, /it/)
- **State Management**: Context API + TanStack Query for server state
- **Forms**: Zod + React Hook Form with comprehensive validation
- **Database**: Supabase with Row Level Security (RLS) policies (14-table schema)
- **Testing**: Playwright + Vitest with visual regression testing

## Current Status
- ✅ 95+ React components following atomic design principles
- ✅ Eligibility questionnaire refactored to atomic components
- ✅ S&W Design system with landing page
- 🚨 P0 Security issues: OTP verification, PCI DSS compliance
- 🚧 Repository conformance and security fixes in progress

## Component Architecture (Recent Major Change)
Successfully refactored the 851-line IntegratedEligibilityFlow.tsx monolith into:
- 12 atomic components (all ≤50 lines)
- Centralized state management with React Context
- Swiss compliance features (VAT, canton validation, age restrictions)
- Comprehensive TypeScript interfaces and validation
- Ready for Supabase v2.0 integration