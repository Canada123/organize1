# Complex SaaS Example - Next.js Intelligence Toolkit

**Example Type**: Complex Path Workflow (Phases 1-3)
**Duration**: 45 minutes (Foundation → Template → Specification)
**Complexity**: High (Database, auth, multi-tenant, custom design)

---

## Overview

This example demonstrates **Phases 1-3 of the complex path workflow** for building a SaaS application. This example shows:
- Intelligence-first foundation research (Phase 1)
- Template selection process (Phase 2)
- Comprehensive specification creation (Phase 3)

**What This Example Covers**:
- Foundation research leveraging global skills + MCP tools
- Template selection with database/auth requirements
- Product specification with constitutional framework
- Design system planning

**NOT Covered in This Example** (Phases 4-8):
- Design system implementation
- Wireframing
- Full implementation
- QA validation
- Final documentation

For complete implementation, see the nextjs-project-setup skill documentation.

---

## Project Concept

**SaaS Product**: Task Management Platform (like Trello)

**Requirements**:
- ✅ Database: Supabase (PostgreSQL)
- ✅ Authentication: Email/password + OAuth (Google)
- ✅ Multi-tenant: Workspaces with team members
- ✅ Complex design: Dark mode, custom branding
- ✅ Real-time collaboration
- ✅ File attachments

**Complexity Indicators**: 5/6 (COMPLEX PATH confirmed)

---

## Prerequisites

Before starting, ensure you have:
- ✅ Next.js Intelligence Toolkit installed (run setup.sh)
- ✅ Node.js 18+ installed
- ✅ Claude Code CLI available
- ✅ Supabase account (for database setup)
- ✅ Global skills installed (shadcn-ui, nextjs, tailwindcss)

---

## Step-by-Step Walkthrough

### Step 1: Project Setup

```bash
cd ~/projects
mkdir task-saas
cd task-saas
```

### Step 2: Initialize Claude Code

```bash
claude-code
```

### Step 3: Request Complex SaaS Setup

Paste this prompt into Claude Code:

```
I want to build a complete Next.js SaaS application with the following requirements:

**Project**: Task Management SaaS (similar to Trello)

**Requirements**:
- Database: Supabase (PostgreSQL)
- Authentication: Email/password + OAuth (Google)
- Multi-tenant: Workspaces with team members
- Features:
  - User management
  - Workspace/board creation
  - Task lists and cards
  - Drag-and-drop interface
  - Real-time collaboration
  - File attachments
- Design: Modern, professional (dark mode support)
- Tech Stack: Next.js 14+, TypeScript, Tailwind CSS, Shadcn UI

Please set up the complete project using the nextjs-project-setup skill, following all 8 phases.

For now, let's complete Phases 1-3 (Foundation, Template, Specification) and pause for review.
```

---

## Phase 1: Foundation Research (30 minutes)

### Expected Workflow

```
Phase 1: Foundation Research
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [█░░░░░░░] 12.5% (1/8 phases)

Intelligence-First Pattern:
Query global skills + MCP tools BEFORE reading files

Step 1: Reviewing Global Skills (300-500 tokens)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Querying nextjs global skill...
✓ App Router patterns identified
✓ Server vs Client Component guidance
✓ Data fetching patterns cataloged
✓ Routing conventions documented

Querying shadcn-ui global skill...
✓ Component categories mapped
✓ Dark mode implementation patterns
✓ Form component workflows
✓ Theming customization strategies

Querying tailwindcss global skill...
✓ Design token systems
✓ Responsive patterns
✓ Dark mode setup
✓ Component styling examples

Token Usage: 450 tokens (vs 2,000 tokens per research agent)

Step 2: Querying MCP Tools (200-400 tokens)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vercel MCP - Template Discovery:
Searching templates with filters:
  - Database: Required
  - Auth: Required
  - Multi-tenant: Preferred

Found 3 relevant templates:
1. Next.js Subscription Starter
   - Supabase integration ✓
   - Stripe for subscriptions ✓
   - User authentication ✓
   - Row Level Security (RLS) ✓

2. SaaS Starter Kit
   - Multi-tenant architecture ✓
   - Team management ✓
   - Supabase backend ✓
   - Role-based access ✓

3. Next.js Enterprise Boilerplate
   - Full auth flow ✓
   - Database schema templates ✓
   - Admin dashboard ✓
   - API routes structured ✓

Token Usage: 320 tokens

Shadcn MCP - Component Registry Overview:
Querying @ui registry...
Core components available:
  - Forms: 12 components
  - Layout: 8 components
  - Overlays: 6 components
  - Data display: 10 components

Querying @magicui registry...
Enhanced components available:
  - Animations: Smooth drag-and-drop
  - Micro-interactions: Card animations
  - Loading states: Skeleton loaders

Token Usage: 180 tokens

Supabase MCP - Database Patterns (conditional: database_required = true):
Querying Supabase schema patterns...

Multi-tenant patterns discovered:
1. Workspace-based isolation
   - workspace_id in all tables
   - RLS policies per workspace
   - User-workspace junction table

2. Row Level Security templates
   - User access control
   - Team member permissions
   - Workspace ownership

3. Real-time subscriptions
   - Workspace channels
   - Task update broadcasts
   - Presence tracking

Token Usage: 290 tokens

Step 3: Synthesis (500-1000 tokens)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Creating /reports/foundation-research.md...

Synthesis complete!

Token Usage Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Global Skills: 450 tokens
MCP Queries: 790 tokens
Synthesis: 720 tokens
TOTAL: 1,960 tokens

OLD Approach (4 research agents): 8,000 tokens
NEW Approach (Intel-first): 1,960 tokens
SAVINGS: 6,040 tokens (75.5% reduction)

✓ Phase 1 complete
✓ Foundation research saved to /reports/foundation-research.md
```

### Generated File: foundation-research.md

```markdown
# Foundation Research Report

**Project**: Task Management SaaS
**Date**: 2025-10-31
**Token Budget**: 1,960 tokens (75.5% savings vs 8,000 baseline)

---

## Template Options (Top 3)

### 1. Next.js Subscription Starter ⭐ RECOMMENDED
**Source**: Vercel Examples
**Rationale**: Best fit for SaaS with built-in subscription logic

**Key Features**:
- Supabase integration (database + auth)
- Stripe integration (subscriptions + billing)
- Row Level Security (RLS) templates
- User authentication (email + OAuth)
- Dashboard UI with Shadcn components

**Pros**:
- Production-ready subscription flow
- Well-documented RLS patterns
- Active maintenance
- TypeScript throughout

**Cons**:
- Requires Stripe setup
- Less multi-tenant focus (can be added)

**Fit Score**: 9/10

### 2. SaaS Starter Kit
**Source**: Community template
**Rationale**: Strong multi-tenant architecture

**Key Features**:
- Multi-tenant by design
- Team management built-in
- Role-based access control (RBAC)
- Supabase backend

**Pros**:
- Multi-tenant architecture included
- Team invite/management flows
- Workspace isolation patterns

**Cons**:
- No subscription logic (must add)
- Less polished UI

**Fit Score**: 8/10

### 3. Next.js Enterprise Boilerplate
**Source**: Enterprise templates
**Rationale**: Comprehensive starting point

**Key Features**:
- Full auth flow (email, OAuth, 2FA)
- Database schema templates
- Admin dashboard
- Structured API routes

**Pros**:
- Enterprise patterns
- Security-first approach
- Comprehensive documentation

**Cons**:
- Over-engineered for MVP
- Steep learning curve

**Fit Score**: 7/10

---

## Component Strategy (Reference Global Skills)

**From shadcn-ui global skill**:

**Form Components** (critical for SaaS):
- form, input, label, textarea
- select, checkbox, radio-group
- date-picker, combobox

**Layout Components**:
- card, separator, tabs
- sheet (for sidebars), dialog (for modals)
- popover, dropdown-menu

**Data Display**:
- table, badge, avatar
- tooltip, alert, toast

**Workflow**: Search → View → Example → Install (NEVER skip Example)
**Registry Priority**: @ui first, @magicui for animations

**Token Efficiency**: Reference global skill instead of duplicating patterns

---

## Database Setup Approach (Supabase)

**Pattern**: Multi-tenant with workspace isolation

**Core Schema** (based on Supabase MCP patterns):

```sql
-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id)
);

-- Workspace members (junction table)
CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('owner', 'admin', 'member')),
  PRIMARY KEY (workspace_id, user_id)
);

-- Boards (workspace-scoped)
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks (board-scoped)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'done')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies** (from Supabase MCP templates):
- Users can only see workspaces they're members of
- Workspace members can CRUD boards within their workspace
- Task operations restricted to workspace members

**Real-time**: Supabase subscriptions on tasks table (workspace-filtered)

**Token Efficiency**: Reference Supabase MCP patterns, don't reinvent

---

## Design System Starting Point

**From tailwindcss global skill**:

**Color System** (dark mode ready):
- Primary: Brand color (customizable)
- Secondary: Muted accent
- Background: Light/dark variants
- Foreground: Text colors
- Destructive: Error states

**Typography** (Tailwind scales):
- Font: Inter or Geist Sans
- Scale: text-xs to text-6xl
- Line heights: leading-tight to leading-loose

**Spacing** (Tailwind defaults):
- 4px base unit
- Responsive scale (sm:, md:, lg:, xl:, 2xl:)

**Components** (Shadcn customization):
- CSS variables for theme switching
- Dark mode via next-themes
- Component variants via cva

**Token Efficiency**: Reference global skills for patterns

---

## Key Decisions

**Template Choice**: Next.js Subscription Starter
**Rationale**: Best balance of features vs complexity, production-ready patterns

**Database**: Supabase with multi-tenant RLS
**Rationale**: Built-in auth, real-time, RLS for workspace isolation

**Auth Flow**: Email + Google OAuth
**Rationale**: Standard SaaS pattern, Supabase supports both

**Component Library**: Shadcn UI (@ui registry)
**Rationale**: Full control, dark mode ready, accessible

**Styling**: Tailwind CSS with CSS variables
**Rationale**: Design system flexibility, theme switching

---

## Next Steps

**Phase 2**: Install Next.js Subscription Starter template
**Phase 3**: Create comprehensive specification (product-spec.md + constitution.md)
**Phase 4**: Design system ideation with @magicui inspiration
**Phase 5**: Wireframe key pages (dashboard, board view, task modal)
**Phase 6**: Implementation with TDD
**Phase 7**: QA validation
**Phase 8**: Documentation

---

## Token Efficiency Achievement

**Baseline** (old approach with 4 research agents):
- nextjs-research-vercel: 2,000 tokens
- nextjs-research-shadcn: 2,000 tokens
- nextjs-research-supabase: 2,000 tokens
- nextjs-research-design: 2,000 tokens
- **Total**: 8,000 tokens

**Intelligence-First** (new approach):
- Review global skills: 450 tokens
- Query MCP tools: 790 tokens
- Synthesize context: 720 tokens
- **Total**: 1,960 tokens

**Savings**: 6,040 tokens (75.5% reduction)

**Key Principle**: Reference, don't duplicate. Global skills contain the knowledge.
```

---

## Phase 2: Template Selection (15 minutes)

### Expected Workflow

```
Phase 2: Template Selection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [██░░░░░░] 25.0% (2/8 phases)

Prerequisites: @reports/foundation-research.md ✓

Step 1: Analyze Requirements Against Templates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading foundation research...
Top 3 templates identified:
1. Next.js Subscription Starter (9/10 fit)
2. SaaS Starter Kit (8/10 fit)
3. Next.js Enterprise Boilerplate (7/10 fit)

Analyzing requirements:
✓ Database: Required → All 3 support Supabase
✓ Auth: Required → All 3 have auth flows
✓ Multi-tenant: Required → Template 2 best, Template 1 can add
✓ Subscriptions: Desired → Template 1 has Stripe built-in
✓ Production-ready: Required → Template 1 most polished

Decision: Next.js Subscription Starter (Template 1)

Step 2: Present to User
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recommendation: Next.js Subscription Starter

**Why This Template**:
- Production-ready subscription flow (Stripe integrated)
- Supabase backend with RLS patterns
- Shadcn UI components pre-installed
- TypeScript throughout
- Active maintenance and documentation

**What You'll Get**:
- Authentication (email + OAuth)
- Database schema (users, subscriptions)
- Payment processing (Stripe)
- Dashboard UI (Shadcn components)
- RLS policies (security)

**What We'll Add**:
- Multi-tenant workspace architecture
- Team management
- Board and task models
- Real-time collaboration
- File attachment handling

User confirms: Proceed with Next.js Subscription Starter

Step 3: Install Template
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Installing template...
$ npx create-next-app@latest task-saas --example https://github.com/vercel/examples/tree/main/solutions/subscription-starter

✓ Template downloaded
✓ Dependencies installed (npm install)
✓ Git repository initialized

Verifying installation...
✓ package.json present
✓ next.config.js configured
✓ Supabase client initialized
✓ Stripe SDK present
✓ Shadcn components installed

Step 4: Document Selection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Creating /docs/template-selection.md...

✓ Rationale documented
✓ Template features listed
✓ Setup notes added
✓ Customization plan outlined

✓ Phase 2 complete
```

### Generated File: template-selection.md

```markdown
# Template Selection Document

**Project**: Task Management SaaS
**Template Chosen**: Next.js Subscription Starter
**Date**: 2025-10-31

---

## Selection Rationale

**Fit Score**: 9/10

**Why This Template**:
1. **Production-Ready**: Used by real SaaS businesses
2. **Supabase Integration**: Database + auth pre-configured
3. **Subscription Logic**: Stripe integration saves weeks of development
4. **Security**: Row Level Security (RLS) patterns included
5. **UI Components**: Shadcn UI pre-installed and themed
6. **TypeScript**: Full type safety throughout

---

## Template Features

### Authentication
- Email/password authentication
- OAuth providers (Google, GitHub)
- Session management (Supabase Auth)
- Protected routes and middleware

### Database (Supabase)
- PostgreSQL database
- Migrations system
- RLS policies for user data
- Real-time subscriptions support

### Subscriptions (Stripe)
- Pricing tiers
- Checkout flow
- Customer portal
- Webhook handling
- Usage-based billing support

### UI Components (Shadcn)
Pre-installed components:
- button, card, input, label
- form, select, checkbox
- dialog, sheet, popover
- table, badge, avatar
- toast, alert

### Developer Experience
- TypeScript configuration
- ESLint + Prettier
- Tailwind CSS setup
- Dark mode support (next-themes)
- Environment variable templates

---

## Installation Summary

```bash
$ npx create-next-app@latest task-saas --example subscription-starter

✓ Downloaded template
✓ Installed dependencies (231 packages)
✓ Initialized Git repository
✓ Created .env.local template
```

**Project Structure**:
```
task-saas/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── account/
│   │   └── pricing/
│   └── api/
│       ├── auth/
│       └── stripe/
├── components/
│   ├── ui/          # Shadcn components
│   └── auth/        # Auth-specific components
├── lib/
│   ├── supabase/    # Supabase client
│   └── stripe/      # Stripe client
├── supabase/
│   └── migrations/  # Database migrations
└── .env.local.example
```

---

## Customization Plan

### What We'll Keep
✓ Authentication flow (email + OAuth)
✓ Stripe integration (subscriptions)
✓ Supabase client setup
✓ Shadcn UI components
✓ Dark mode support
✓ TypeScript configuration

### What We'll Add
➕ Multi-tenant workspace model
➕ Team management (invites, roles)
➕ Board and task entities
➕ Drag-and-drop interface
➕ Real-time collaboration
➕ File attachment system

### What We'll Modify
✏️ Database schema (add workspaces, boards, tasks)
✏️ RLS policies (multi-tenant isolation)
✏️ Subscription plans (team-based pricing)
✏️ Dashboard UI (task management focus)
✏️ Navigation (workspace switcher)

---

## Setup Notes

### Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Initial Setup Steps

1. **Create Supabase Project**:
   - Visit: https://supabase.com/dashboard
   - Create new project
   - Copy connection strings to .env.local

2. **Create Stripe Account**:
   - Visit: https://stripe.com
   - Enable test mode
   - Copy API keys to .env.local
   - Set up webhook endpoint

3. **Run Database Migrations**:
   ```bash
   npx supabase db push
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Test Auth Flow**:
   - Visit: http://localhost:3000/signup
   - Create test account
   - Verify email confirmation

---

## Next Phase

**Phase 3**: Create comprehensive specification
- Product specification (product-spec.md)
- Constitutional framework (constitution.md)
- Feature breakdown (features.md)
- Architecture documentation (architecture.md)
