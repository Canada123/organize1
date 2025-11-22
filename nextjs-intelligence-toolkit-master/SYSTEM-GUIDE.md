# Next.js Intelligence Toolkit: System Guide

**Version**: 2.0
**Last Updated**: 2025-10-30
**Status**: Production Ready (Phase 4 Complete)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component Types](#component-types)
4. [Core Principles](#core-principles)
5. [Main Product: nextjs-project-setup](#main-product-nextjs-project-setup)
6. [Installation](#installation)
7. [How to Use](#how-to-use)
8. [Key Workflows](#key-workflows)
9. [Quick Reference](#quick-reference)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### What Is This?

The **Next.js Intelligence Toolkit** is a comprehensive meta-system for building intelligence-first AI agent workflows. It provides:

- **Intelligence-First Architecture**: 80%+ token savings by querying indexes before reading files
- **Skills-First Hierarchy**: Auto-invoked workflows that adapt to project needs
- **Specification-Driven Development (SDD)**: 85% automated from spec → plan → tasks → verification
- **Test-Driven Development (TDD)**: Mandatory tests-first approach with no exceptions
- **Progressive Delivery**: Verify each user story independently before proceeding

**Main Product**: The **nextjs-project-setup** skill (999 lines) - comprehensive Next.js project setup from scratch with design system, database, testing, and documentation.

**Supporting Infrastructure**:
- 10 global skills (analyze-code, debug-issues, specify-feature, etc.)
- 14 slash commands (/feature, /plan, /implement, /verify, etc.)
- 4 specialized agents (orchestrator, code-analyzer, planner, executor)
- 24 templates (specs, plans, reports, verification)

### Why Use This?

**Token Efficiency**: 80-95% savings vs naive file reading
- OLD: Read all files → 68,000 tokens
- NEW: Query intelligence → targeted reads → 14,200 tokens

**Quality Assurance**:
- Constitution enforcement (7 immutable articles)
- Mandatory test-driven development
- Acceptance criteria verification per story
- Cross-artifact consistency validation

**Developer Experience**:
- Auto-invoked workflows (no manual orchestration)
- Progressive disclosure (load only what's needed)
- Evidence-based reasoning (all claims have file:line references)
- Comprehensive documentation

---

## Architecture

### Skills-First Component Hierarchy

```
LEVEL 1: SKILLS (Auto-Invoked)
   ↓ can invoke
LEVEL 2: SLASH COMMANDS (User-Invoked)
   ↓ can delegate to
LEVEL 3: SUBAGENTS (Isolated Context)
```

**Key Principle**: Skills auto-trigger based on context, commands are manual shortcuts, agents are specialized workers.

### Visual Architecture

```
┌─────────────────────────────────────────────┐
│           USER REQUEST / CONTEXT             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│  LEVEL 1: SKILLS (Auto-Discovery)                    │
│  - Auto-invoked via description match                │
│  - Progressive disclosure (metadata → content)       │
│  - Can reference other skills                        │
│  - Can invoke slash commands (if enabled)            │
│  - Can spawn subagents (parallel up to 10)           │
│                                                       │
│  Examples: analyze-code, debug-issues,               │
│            specify-feature, implement-and-verify     │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  LEVEL 2: SLASH COMMANDS (User-Invoked)              │
│  - Manual trigger: /command-name [args]              │
│  - Can be called by skills (if SlashCommand enabled) │
│  - Expand to full instructions                       │
│                                                       │
│  Examples: /feature, /plan, /implement, /verify      │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  LEVEL 3: SUBAGENTS (Delegated Workers)              │
│  - Isolated 100k token context                       │
│  - Prevents context pollution                        │
│  - Parallel execution (up to 10 concurrent)          │
│  - Specialized expertise                             │
│                                                       │
│  Examples: orchestrator, code-analyzer,              │
│            planner, executor                         │
└──────────────────────────────────────────────────────┘
```

### Component Decision Matrix

| Use Case | Component Type | Example |
|----------|---------------|---------|
| Auto-apply expertise | **Skill** | analyze-code, debug-issues |
| Manual workflow shortcut | **Command** | /feature, /plan, /implement |
| Heavy analysis (isolated) | **Agent** | code-analyzer, planner |
| Structured output | **Template** | feature-spec.md, plan.md |

---

## Component Types

### 1. Skills (10 Total)

**Auto-invoked workflows** triggered by context matching.

| Skill | Purpose | When Used |
|-------|---------|-----------|
| **analyze-code** | Intelligence-first code analysis | Investigating bugs, architecture, dependencies |
| **clarify-specification** | Resolve spec ambiguities | [NEEDS CLARIFICATION] markers present |
| **create-implementation-plan** | Tech plan from spec | Specification exists, need implementation approach |
| **debug-issues** | Intelligence-first debugging | Bugs, test failures, unexpected behavior |
| **define-product** | Create product.md | Need product definition with user personas |
| **generate-constitution** | Derive technical principles | Need constitutional framework |
| **generate-tasks** | User-story tasks from plan | Plan exists, need task breakdown |
| **implement-and-verify** | TDD implementation + AC verification | Ready to implement with plan + tasks |
| **specify-feature** | Tech-agnostic feature spec | New feature, no spec exists yet |
| **nextjs-project-setup** | **MAIN PRODUCT** - Complete Next.js setup | Creating new Next.js project |

**Progressive Disclosure**:
- **L1**: Metadata (30-50 tokens) - Always loaded at startup
- **L2**: Full content (on-demand) - Loaded when skill triggers
- **L3**: Supporting resources (as needed) - Templates, phase docs, examples

### 2. Slash Commands (14 Total)

**User-triggered workflow shortcuts**.

| Command | Purpose | Example |
|---------|---------|---------|
| **/feature** | Create feature spec | `/feature "user authentication"` |
| **/plan** | Create implementation plan | `/plan spec.md` |
| **/tasks** | Generate task list | `/tasks plan.md` |
| **/audit** | Cross-artifact validation | `/audit` (checks spec → plan → tasks consistency) |
| **/implement** | Execute implementation | `/implement plan.md` |
| **/verify** | Verify acceptance criteria | `/verify --story P1` |
| **/analyze** | Code analysis | `/analyze` (routes to code-analyzer) |
| **/bug** | Debug issue | `/bug "description"` |
| **/index** | Regenerate PROJECT_INDEX.json | `/index` |
| **/bootstrap** | System health check | `/bootstrap` |
| **/define-product** | Create product definition | `/define-product` |
| **/generate-constitution** | Create constitution | `/generate-constitution` |
| **/system-integrity** | Validate toolkit | `/system-integrity [--verbose] [--fix]` |
| **/test-discovery** | Test command discovery | `/test-discovery` |

**Auto-Chain**: Commands can auto-invoke other commands:
- `/feature` → auto invokes `/plan` → auto invokes `generate-tasks` → auto invokes `/audit`
- `/implement` → auto invokes `/verify` per story

### 3. Subagents (4 Global + 3 nextjs-specific)

**Specialized workers with isolated context**.

**Global Agents**:
| Agent | Purpose | Tools |
|-------|---------|-------|
| **orchestrator** | Routes to specialized agents | All tools |
| **code-analyzer** | Debugging + intelligence queries | Read, Grep, Glob, Bash, project-intel.mjs |
| **planner** | Architecture + planning + research | Read, Write, MCP tools |
| **executor** | TDD + AC verification | All tools |

**nextjs-project-setup Agents**:
| Agent | Purpose | Phase |
|-------|---------|-------|
| **nextjs-design-ideator** | Design system ideation | Phase 4 (Design) |
| **nextjs-qa-validator** | QA validation | Phase 7 (QA) |
| **nextjs-doc-auditor** | Documentation audit | Phase 8 (Docs) |

**Token Truncation**: Agents limited to 2,500 tokens per report with continuation mechanism.

### 4. Templates (24 Total)

**Structured output formats** for consistency.

**Categories**:
- **Bootstrap** (4): planning-template, todo-template, event-stream-template, workbook-template
- **SDD Workflow** (5): feature-spec, clarification-checklist, plan, tasks, quality-checklist
- **Execution** (4): verification-report, bug-report, handover, report
- **Research** (2): research-notes, data-model
- **Analysis** (5): analysis-spec, audit, session-state, etc.
- **nextjs-setup** (4): design-showcase, wireframe-template, spec-template, claude-md-template

**Usage**: Templates referenced via `@.claude/templates/[name].md`

---

## Core Principles

### 1. Intelligence-First (Article I)

**Always query intelligence sources BEFORE reading files.**

```bash
# Correct workflow:
project-intel.mjs --overview --json          # Get structure
project-intel.mjs --search "keyword" --json  # Find files
project-intel.mjs --symbols file.ts --json   # Get symbols
Read file.ts:45-52                           # Targeted read

# Token usage: 1,200t (intelligence) + 1,000t (targeted) = 2,200t
# vs 15,000t (read full file) = 85% savings
```

**If PROJECT_INDEX.json missing**: Run `/index` first

### 2. Evidence-Based Reasoning (Article II - CoD^Σ)

**Every claim needs traceable evidence with file:line references.**

**CoD^Σ Operators**:
- `⊕` Parallel composition
- `∘` Sequential pipeline
- `→` Delegation
- `≫` Transformation
- `⇄` Bidirectional iteration
- `∥` Parallel execution

**Example**:
```
❌ BAD: "Component re-renders because of state"
✅ GOOD: "Component re-renders: useEffect([state])@ComponentA.tsx:45 → mutation@ComponentA.tsx:52"
```

### 3. Test-First Imperative (Article III)

**TDD sequence is NON-NEGOTIABLE:**

1. **Write tests** for acceptance criteria FIRST
2. **Run tests** to verify failure (RED)
3. **Implement** minimal code to pass
4. **Run tests** to verify passing (GREEN)
5. **Refactor** while keeping tests green

**Iron Law**: NO code without tests first. NO exceptions.

### 4. Specification-First Development (Article IV)

**Strict separation of WHAT/WHY from HOW:**

1. **Phase 1: Specification** - Problem statement, user stories, requirements (tech-agnostic)
2. **Phase 2: Clarification** - Resolve ambiguities, max 5 questions per iteration
3. **Phase 3: Planning** - Tech stack, architecture, implementation approach
4. **Phase 4: Tasks** - User-story-organized breakdown with ACs
5. **Phase 5: Implementation** - Code with TDD

**Never mix**: Requirements in planning, or tech stack in specifications

### 5. Template-Driven Quality (Article V)

**All outputs use appropriate templates** from `.claude/templates/`:
- Analysis → `report.md`, `bug-report.md`
- Planning → `feature-spec.md`, `plan.md`, `tasks.md`
- Execution → `verification-report.md`, `handover.md`

**Quality gates block** if checklists fail:
- Pre-planning → `quality-checklist.md`
- Pre-implementation → `clarification-checklist.md`
- Pre-completion → `verification-report.md`

### 6. Simplicity and Anti-Abstraction (Article VI)

**Default limits**:
- Max 3 projects in initial implementation
- Max 2 abstraction layers per concept
- Max 1 representation per domain model

**Justification required** for:
- 4th project
- Repository/service patterns
- Multiple parallel abstractions
- Custom frameworks

### 7. User-Story-Centric Organization (Article VII)

**Tasks organized by user story priority**, NOT technical layer:

```
✅ CORRECT:
Phase 1: Setup
Phase 2: Foundational
Phase 3: User Story P1 (independently testable)
Phase 4: User Story P2 (independently testable)
Phase 5: User Story P3 (independently testable)
Final: Polish

❌ WRONG:
Phase 1: All models
Phase 2: All services
Phase 3: All endpoints
Phase 4: All UI
```

**Progressive delivery**: Implement P1 → verify → ship → Implement P2 → verify → ship

---

## Main Product: nextjs-project-setup

### Overview

The **nextjs-project-setup** skill is the primary deliverable of this toolkit. It provides comprehensive Next.js project setup from scratch.

**File**: `.claude/skills/nextjs-project-setup/SKILL.md` (999 lines)

### Two Paths

#### Simple Path (15-30 minutes)
**Use when**: Blogs, marketing sites, portfolios, simple applications

**Process**:
1. Template selection (Vercel MCP)
2. Basic setup (env vars, config)
3. Core components (Shadcn MCP)
4. Basic design system (Tailwind CSS variables)
5. Minimal documentation (README, CLAUDE.md)

**Deliverables**:
- Installed template
- Core components configured
- Basic design system
- Minimal documentation
- Ready for development

#### Complex Path (2-4 hours, 8 phases)
**Use when**: Database required, auth, multi-tenant, e-commerce, complex design

**Process**:
1. **Phase 1**: Foundation Research (1,500t vs 8,000t old = 81% savings)
   - Global skills review (shadcn-ui, nextjs, tailwindcss)
   - MCP queries (Vercel, Shadcn, Supabase, Ref)
   - Synthesis → `/reports/foundation-research.md`

2. **Phase 2**: Template Selection
   - Analyze requirements vs template features
   - Install via `npx create-next-app --example`

3. **Phase 3**: Specification
   - Use `product-skill` → product-spec.md
   - Use `constitution-skill` → constitution.md
   - Document features, architecture

4. **Phase 4**: Design System Ideation
   - Dispatch `nextjs-design-ideator` agent (if complex)
   - Create design showcase
   - User feedback loop (max 3 iterations)
   - Configure Tailwind CSS variables

5. **Phase 5**: Wireframes
   - Image asset management
   - Text-based wireframes (2-3 options per page)
   - User feedback loop (max 3 iterations)
   - Expert evaluation (UX, accessibility, conversion)

6. **Phase 6**: Implementation (TDD mandatory)
   - Tests FIRST for all acceptance criteria
   - Shadcn MCP workflow: Search → View → Example → Install
   - Server actions for database mutations
   - Visual validation (every page reviewed)

7. **Phase 7**: Quality Assurance (Parallel)
   - Dispatch `nextjs-qa-validator` agent
   - Continuous monitoring during implementation
   - Critical checks (tests, links, buttons, responsive, accessibility)

8. **Phase 8**: Documentation & Audit
   - Dispatch `nextjs-doc-auditor` agent
   - Complete CLAUDE.md hierarchy
   - Clean repository
   - Audit report with verification

### Complexity Assessment

**Decision Rule**: IF ≥2 indicators TRUE → Complex Path

**8 Indicators**:
1. Database required
2. Custom authentication
3. Multi-tenant architecture
4. E-commerce features
5. Complex/custom design system
6. Multiple external integrations (≥3 APIs)
7. Advanced routing patterns
8. Real-time features (WebSockets, SSE)

**See**: `docs/decision-trees/complexity-assessment.md` for complete criteria

### Prerequisites

**Global Skills** (user must install separately):
- `~/.claude/skills/shadcn-ui/SKILL.md` (1,053 lines)
- `~/.claude/skills/nextjs/SKILL.md` (1,129 lines)
- `~/.claude/skills/tailwindcss/SKILL.md` (1,134 lines)

**MCP Tools** (required):
- Vercel MCP (template discovery)
- Shadcn MCP (component installation)
- Supabase MCP (database, only if DB required)
- 21st-dev MCP (design inspiration, optional)
- Ref MCP (documentation queries, optional)

### Token Efficiency

```
OLD Approach (4 research agents):
  Phase 1: 8,000 tokens (4 agents × 2,000t each)
  Total: 14,000 tokens

NEW Approach (0 research agents):
  Phase 1: 1,500 tokens (MCP queries + global skill refs)
  Total: 7,500 tokens

Savings: 6,500 tokens (46% reduction)
Agent Reduction: 7 → 3 agents (57% reduction)
```

---

## Installation

### Prerequisites

1. **Node.js 18+** installed
2. **Claude Code** installed and configured
3. **Git** initialized (for project-level installs)

### Quick Install

**Option 1: curl (Recommended)**
```bash
curl -sSL https://raw.githubusercontent.com/yangsi7/nextjs-intelligence-toolkit/main/setup.sh | bash
```

**Option 2: Manual**
```bash
git clone https://github.com/yangsi7/nextjs-intelligence-toolkit.git
cd nextjs-intelligence-toolkit
chmod +x setup.sh
./setup.sh
```

### Installation Options

During setup, you'll be asked:

1. **Installation scope**: Local (./.claude/), User (~/.claude/), or Both
2. **Global skills**: Do you have shadcn-ui, nextjs, tailwindcss installed?
3. **MCP tools**: Are Vercel, Shadcn, Supabase configured?
4. **Examples**: Install example projects? (None/Simple/Complex/Both)
5. **Test project**: Create test project structure? (Yes/No)

### Validation

After installation, run validation:

```bash
./validate-installation.sh
```

**Expected**: 19/20 tests pass (95% pass rate)

**Report**: `INSTALLATION-VALIDATION-REPORT.md`

---

## How to Use

### Getting Started

**Step 1: Verify Installation**
```bash
./validate-installation.sh
```

**Step 2: Explore Examples**
```bash
cd examples/simple-blog/
cat README.md  # Read simple path walkthrough

cd ../complex-saas/
cat README.md  # Read complex path walkthrough
```

**Step 3: Create Your First Project**
```bash
# In Claude Code session:
"Use the nextjs-project-setup skill to create a simple blog"
```

### Specification-Driven Development (SDD) Workflow

**85% Automated** - Only 2 manual user actions:

1. **User: Create Feature Spec**
   ```
   /feature "user authentication with email/password and OAuth"
   ```

   **Auto-chain**:
   - `specify-feature` skill → creates `spec.md`
   - Auto-invokes `/plan` → `create-implementation-plan` skill → creates `plan.md`
   - Auto-invokes `generate-tasks` → creates `tasks.md`
   - Auto-invokes `/audit` → validates consistency
   - **PASS** → Ready for implementation

2. **User: Implement**
   ```
   /implement plan.md
   ```

   **Auto-chain**:
   - `implement-and-verify` skill starts
   - Implement P1 → auto-invokes `/verify --story P1` → PASS
   - Implement P2 → auto-invokes `/verify --story P2` → PASS
   - Implement P3 → auto-invokes `/verify --story P3` → PASS
   - **Complete**

**Quality Gates**:
- `/audit`: Pre-implementation validation (constitution compliance, coverage, ambiguities)
- `/verify`: Per-story verification (tests pass, dependencies met, demo works)

### Test-Driven Development (TDD) Workflow

**Enforced by implement-and-verify skill**:

```
For each user story:
  1. Write tests for all acceptance criteria
  2. Run tests → verify FAIL (RED)
  3. Implement minimal code
  4. Run tests → verify PASS (GREEN)
  5. Refactor if needed
  6. Run /verify --story [id]
  7. If PASS → proceed to next story
  8. If FAIL → fix issues, repeat
```

**No story can be marked complete** without passing all tests and verification.

### Debugging Workflow

```
User: /bug "description of issue"
  ↓
debug-issues skill activates
  ↓
Phase 1: Document symptom
  - Observable behavior
  - Expected vs actual
  - Reproduction steps
  - Error messages
  ↓
Phase 2: Intelligence queries
  - project-intel.mjs --search "error_pattern"
  - project-intel.mjs --dependencies [file]
  - git log for related changes
  ↓
Phase 3: Root cause analysis
  - Symptom → immediate cause → underlying cause → root
  - CoD^Σ trace with file:line evidence
  ↓
Phase 4: Fix implementation
  - Write test reproducing bug
  - Verify test FAILS
  - Implement fix
  - Verify test PASSES
  - Run full test suite
  ↓
Phase 5: Verification
  - Symptom resolved?
  - No regressions?
  - Edge cases handled?
  - Document in commit
```

### Analysis Workflow

```
User: /analyze [optional: target]
  ↓
Routed to code-analyzer agent
  ↓
Intelligence-first approach:
  1. project-intel.mjs --overview
  2. project-intel.mjs --search "target"
  3. project-intel.mjs --symbols [candidate_files]
  4. Targeted reads of specific sections
  5. CoD^Σ reasoning with evidence
  6. Report with recommendations
  ↓
Token savings: 80-95% vs reading all files
```

---

## Key Workflows

### 1. Creating a Simple Next.js Project

**Scenario**: Personal blog with markdown posts

```
User: "Set up a simple Next.js blog"
  ↓
nextjs-project-setup skill triggers
  ↓
Complexity assessment: 0/8 indicators → SIMPLE PATH
  ↓
Simple Path Execution (15-30 min):
  1. Template: Blog Starter Kit (Vercel)
  2. Setup: npm install, env vars
  3. Components: Shadcn core (button, card, separator)
  4. Design: Tailwind CSS variables
  5. Docs: README.md, CLAUDE.md
  ↓
Deliverable: Production-ready blog
```

### 2. Creating a Complex SaaS Project

**Scenario**: Multi-tenant SaaS with Stripe billing

```
User: "Set up Next.js SaaS platform with multi-tenant and Stripe"
  ↓
nextjs-project-setup skill triggers
  ↓
Complexity assessment:
  - Database: ✓ (multi-tenant data)
  - Custom Auth: ✓ (user management)
  - Multi-Tenant: ✓ (explicit)
  - E-commerce: ✓ (Stripe billing)
  - Integrations: ✓ (Stripe + analytics)
  Total: 5/8 → COMPLEX PATH
  ↓
Complex Path Execution (2-4 hours):
  Phase 1: Foundation Research (1,500t)
    - Query global skills (nextjs, shadcn-ui, tailwindcss)
    - Vercel MCP: template search
    - Supabase MCP: multi-tenant schema patterns
    - Ref MCP: "Next.js 15 multi-tenant best practices"
    - Generate: /reports/foundation-research.md

  Phase 2: Template Selection
    - Analyze: SaaS templates with auth
    - Install: Next.js + Supabase template

  Phase 3: Specification
    - product-skill → product-spec.md
    - constitution-skill → constitution.md
    - Document: features.md, architecture.md

  Phase 4: Design System (nextjs-design-ideator agent)
    - Brainstorm: 3-4 design options
    - User feedback: max 3 iterations
    - Finalize: Tailwind config + Shadcn base

  Phase 5: Wireframes
    - Create: 2-3 layout options per page
    - User feedback: max 3 iterations
    - Expert evaluation: UX/accessibility/conversion

  Phase 6: Implementation (TDD)
    - Multi-tenant schema (tenant_id on all tables)
    - RLS policies (helper functions)
    - Stripe integration (checkout flow)
    - Server actions (tenant-scoped)
    - Tests for all acceptance criteria

  Phase 7: QA (nextjs-qa-validator agent, parallel)
    - Tests passing
    - Visual validation
    - Accessibility (WCAG 2.1 AA)
    - Performance optimization

  Phase 8: Documentation (nextjs-doc-auditor agent)
    - CLAUDE.md hierarchy
    - Architecture documentation
    - API documentation
    - Clean repository

  ↓
Deliverable: Production-ready multi-tenant SaaS with Stripe
```

### 3. Feature Development with SDD

**Scenario**: Add user notifications feature

```
User: /feature "user notifications with email and in-app alerts"
  ↓
specify-feature skill activates
  ↓
Create spec.md (tech-agnostic):
  - Problem statement
  - User stories (P1, P2, P3)
  - Functional requirements
  - Success criteria
  ↓
Auto-invoke /plan
  ↓
create-implementation-plan skill activates
  ↓
Create plan.md (with tech):
  - Tech stack decisions (email: SendGrid, in-app: Supabase Realtime)
  - Architecture approach (notification service + UI components)
  - Implementation tasks with ACs
  - Dependencies (Supabase schema, SendGrid setup)
  ↓
Auto-invoke generate-tasks
  ↓
generate-tasks skill activates
  ↓
Create tasks.md (user-story-organized):
  Phase 1: Setup (SendGrid, Supabase)
  Phase 2: Foundational (notification schema, RLS)
  Phase 3: P1 - Email notifications (independently testable)
  Phase 4: P2 - In-app notifications (independently testable)
  Phase 5: P3 - Notification preferences (independently testable)
  ↓
Auto-invoke /audit
  ↓
/audit validates:
  ✓ Spec → Plan consistency (all requirements mapped)
  ✓ Plan → Tasks consistency (all tasks have ACs)
  ✓ Constitution compliance (TDD, user-story-centric)
  ✓ Coverage (≥2 ACs per task)
  → PASS
  ↓
User: /implement plan.md
  ↓
implement-and-verify skill activates
  ↓
Story P1 (Email notifications):
  - Write tests (AC verification)
  - Implement SendGrid integration
  - Implement email templates
  - Auto-invoke /verify --story P1
    → Tests pass
    → Demo works
    → Dependencies met
    → PASS
  ↓
Story P2 (In-app notifications):
  - Write tests
  - Implement Supabase Realtime
  - Implement notification UI
  - Auto-invoke /verify --story P2
    → PASS
  ↓
Story P3 (Preferences):
  - Write tests
  - Implement preferences UI
  - Implement settings persistence
  - Auto-invoke /verify --story P3
    → PASS
  ↓
Complete: All stories verified independently
```

### 4. Debugging a Production Issue

**Scenario**: Users report authentication failing randomly

```
User: /bug "users report random authentication failures, no errors in logs"
  ↓
debug-issues skill activates
  ↓
Phase 1: Document Symptom
  Observable: Users logged out unexpectedly
  Expected: Persistent sessions for 7 days
  Reproduction: Intermittent, no clear pattern
  Errors: None visible to users
  ↓
Phase 2: Intelligence Queries
  $ project-intel.mjs --search "auth session" --json
  Found: lib/supabase/client.ts, middleware.ts

  $ project-intel.mjs --symbols lib/supabase/client.ts --json
  Symbols: createClient, refreshSession, getSession

  $ project-intel.mjs --dependencies middleware.ts --json
  Dependencies: @supabase/ssr, next/server
  ↓
Phase 3: Targeted Reads
  Read lib/supabase/client.ts:15-45 (createClient)
  Read middleware.ts:20-60 (session refresh logic)

  Evidence: middleware.ts:35 - session refresh missing error handling
  ↓
Phase 4: Root Cause Analysis (CoD^Σ)
  Symptom: Random logouts
    ↓
  Immediate Cause: Session refresh failing silently
    → middleware.ts:35: No try-catch on supabase.auth.getSession()
    ↓
  Underlying Cause: Network timeouts not handled
    → When Supabase API slow, getSession throws
    → middleware.ts:35-40: No error handler
    ↓
  Root Cause: Missing error handling pattern
    → Development environment: fast responses, issue hidden
    → Production environment: slow responses, issue exposed
    ↓
  Evidence:
    middleware.ts:35: await supabase.auth.getSession() [no try-catch]
    middleware.ts:40: return response [continues without session]
  ↓
Phase 5: Fix Implementation
  Test (reproducing bug):
    test/middleware.test.ts:
      it('should handle session refresh timeout', async () => {
        mockSupabase.auth.getSession.mockRejectedValue(new Error('Timeout'))
        const response = await middleware(request)
        expect(response.headers.get('x-session-error')).toBe('timeout')
        expect(response.status).toBe(200) // Don't fail request
      })

    Run: ✗ FAIL (expected - no error handling)

  Implementation:
    middleware.ts:35-45:
      try {
        const { data: { session } } = await supabase.auth.getSession()
        // ... handle session
      } catch (error) {
        console.error('Session refresh failed:', error)
        response.headers.set('x-session-error', 'refresh-failed')
        // Continue without blocking request
      }

    Run: ✓ PASS

  Full suite: ✓ PASS (no regressions)
  ↓
Phase 6: Verification
  ✓ Symptom resolved: Error handling prevents silent failures
  ✓ No regressions: All tests pass
  ✓ Edge cases: Timeout, network error, API error all handled
  ✓ Documented: Commit message with root cause analysis
  ↓
Complete: Bug fixed with evidence-based CoD^Σ trace
```

---

## Quick Reference

### Essential Commands

```bash
# Installation & Validation
./setup.sh                           # Install toolkit
./validate-installation.sh           # Validate installation
/bootstrap                           # System health check
/index                               # Regenerate PROJECT_INDEX.json

# Specification-Driven Development
/feature "description"               # Create spec (auto-chains to /plan, tasks, /audit)
/plan spec.md                        # Create implementation plan
/tasks plan.md                       # Generate task breakdown
/audit                               # Cross-artifact validation

# Implementation & Verification
/implement plan.md                   # Execute with TDD (auto /verify per story)
/verify --story P1                   # Verify story acceptance criteria

# Analysis & Debugging
/analyze [target]                    # Code analysis (intelligence-first)
/bug "description"                   # Debug issue (symptom → root cause → fix)

# Product & Constitution
/define-product                      # Create product definition
/generate-constitution               # Create technical principles

# System Management
/system-integrity [--verbose]        # Validate toolkit integrity
```

### Essential Patterns

**Intelligence-First**:
```bash
# Always query BEFORE reading:
project-intel.mjs --overview --json
project-intel.mjs --search "keyword" --json
project-intel.mjs --symbols file.ts --json
Read file.ts:45-52  # Targeted read
```

**CoD^Σ Evidence**:
```
❌ BAD: "Component has performance issue"
✅ GOOD: "Component re-renders: useEffect([deps])@Component.tsx:45 →
         state_mutation@Component.tsx:52 → expensive_calc@Component.tsx:30"
```

**TDD Sequence**:
```
1. Write tests FIRST
2. Run tests → RED (fail)
3. Implement minimal code
4. Run tests → GREEN (pass)
5. Refactor
```

### Decision Trees

**Complexity Assessment** (Simple vs Complex path):
```
Count TRUE indicators:
  1. Database required?
  2. Custom authentication?
  3. Multi-tenant architecture?
  4. E-commerce features?
  5. Complex design system?
  6. Multiple integrations (≥3)?
  7. Advanced routing patterns?
  8. Real-time features?

IF ≥2 TRUE → Complex Path (2-4 hours, 8 phases)
IF <2 TRUE → Simple Path (15-30 min, 5 steps)
```

**See**: `docs/decision-trees/complexity-assessment.md` for complete criteria

### File Organization

```
.claude/
├── agents/                    # Subagent definitions (4 global + 3 nextjs)
├── commands/                  # Slash commands (14 total)
├── skills/                    # Skills (10 total)
│   └── nextjs-project-setup/  # MAIN PRODUCT
│       ├── SKILL.md           # 999 lines
│       ├── docs/              # Phase documentation
│       │   ├── simple-setup.md
│       │   └── complex/       # 4 consolidated phase docs
│       ├── templates/         # Output formats (5 total)
│       └── references/        # Architecture docs
├── templates/                 # Global templates (24 total)
├── shared-imports/            # Core frameworks
│   ├── CoD_Σ.md              # Reasoning notation
│   └── constitution.md        # 7 articles
└── CLAUDE.md                  # Project context

/reports/                      # Generated reports (gitignored)
  └── foundation-research.md   # Phase 1 research output

docs/                          # Documentation
├── claude-code-comprehensive-guide.md  # Complete guide (10k tokens)
├── guides/                    # Specialized guides
├── decision-trees/            # Decision frameworks
└── reference/                 # External docs

planning.md                    # Master plan
todo.md                        # Current tasks
event-stream.md                # Session log
workbook.md                    # Active context
```

---

## Troubleshooting

### Common Issues

**Issue**: Skill not triggering
**Solution**:
1. Check description field in SKILL.md
2. Ask Claude: "What skills do you have?"
3. Verify file location (.claude/skills/)
4. Check permissions

**Issue**: PROJECT_INDEX.json missing
**Solution**: Run `/index` to regenerate

**Issue**: Global skills not found
**Solution**:
1. Install to `~/.claude/skills/`:
   - shadcn-ui/SKILL.md
   - nextjs/SKILL.md
   - tailwindcss/SKILL.md
2. Verify paths with `/bootstrap`

**Issue**: MCP tools not configured
**Solution**:
1. Edit `.mcp.json`
2. Add required servers:
   ```json
   {
     "mcpServers": {
       "vercel": { ... },
       "shadcn": { ... },
       "supabase": { ... }
     }
   }
   ```

**Issue**: Validation fails (tests don't pass)
**Solution**:
1. Check test file location
2. Verify test framework installed
3. Run tests manually: `npm test`
4. Review error messages

**Issue**: Agent reports exceed 2,500 tokens
**Solution**:
1. Check truncation protocol in agent definition
2. Add [TRUNCATED] marker
3. Implement continuation mechanism

**Issue**: Token budget exceeded
**Solution**:
1. Use `/compact` to summarize history
2. Use subagents for heavy operations
3. Trim CLAUDE.md (<500 lines)
4. Reference files instead of loading

### Getting Help

**Documentation**:
- **Complete Guide**: `docs/claude-code-comprehensive-guide.md` (10,000 tokens)
- **Bootstrap Guide**: `.claude/templates/BOOTSTRAP_GUIDE.md`
- **Quickstart**: `QUICKSTART.md` (5-minute tutorial)
- **Architecture**: `ARCHITECTURE.md` (system overview)
- **Troubleshooting**: `TROUBLESHOOTING.md` (10+ issues)

**Examples**:
- **Simple Path**: `examples/simple-blog/README.md`
- **Complex Path**: `examples/complex-saas/README.md`

**Validation**:
```bash
./validate-installation.sh
# Generates: INSTALLATION-VALIDATION-REPORT.md
```

**GitHub Issues**: https://github.com/yangsi7/nextjs-intelligence-toolkit/issues

---

## Appendix: Constitution Summary

### Article I: Intelligence-First Principle
Query intelligence sources (project-intel.mjs, MCP tools) BEFORE reading files.
**Target**: 80%+ token savings vs naive approach.

### Article II: Evidence-Based Reasoning (CoD^Σ)
Every claim must have traceable evidence (file:line references).
**Format**: Use CoD^Σ operators for workflow composition.

### Article III: Test-First Imperative (TDD)
**Sequence**: Write tests → RED → Implement → GREEN → Refactor.
**Iron Law**: NO code without tests first, NO exceptions.

### Article IV: Specification-First Development
**Phases**: Spec (WHAT/WHY) → Clarify → Plan (HOW) → Tasks → Implement.
**Separation**: Never mix requirements with implementation.

### Article V: Template-Driven Quality
Use appropriate templates from `.claude/templates/`.
**Gates**: Pre-planning, pre-implementation, pre-completion checklists.

### Article VI: Simplicity and Anti-Abstraction
**Limits**: Max 3 projects, 2 abstraction layers, 1 representation.
**Justification**: Required for exceeding limits.

### Article VII: User-Story-Centric Organization
Organize by story priority (P1, P2, P3), NOT technical layer.
**Progressive Delivery**: Verify each story independently.

**See**: `.claude/shared-imports/constitution.md` for complete articles

---

**Document Version**: 2.0
**Last Updated**: 2025-10-30
**Status**: Production Ready
**Maintained By**: Claude Code Intelligence Toolkit Team

**Quick Links**:
- **Main Product**: `.claude/skills/nextjs-project-setup/SKILL.md` (999 lines)
- **Complete Guide**: `docs/claude-code-comprehensive-guide.md` (10,000 tokens)
- **Validation**: `./validate-installation.sh`
- **Examples**: `examples/simple-blog/`, `examples/complex-saas/`
- **Repository**: https://github.com/yangsi7/nextjs-intelligence-toolkit
