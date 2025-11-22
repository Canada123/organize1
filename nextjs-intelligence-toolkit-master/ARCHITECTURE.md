# Next.js Intelligence Toolkit - System Architecture

**Version**: 1.0
**Last Updated**: 2025-10-30
**Notation**: CoD^Σ (Chain of Density Sigma)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Component Architecture](#component-architecture)
3. [Installation Flow](#installation-flow)
4. [Validation Architecture](#validation-architecture)
5. [Token Budget Breakdown](#token-budget-breakdown)
6. [Workflow Paths](#workflow-paths)
7. [Dependency Graph](#dependency-graph)
8. [Extension Points](#extension-points)

---

## System Overview

### Core Product

**Main Product**: `nextjs-project-setup` skill (999 lines)

**Supporting Infrastructure**:
- `setup.sh` - One-command installation script
- `validate-installation.sh` - Health check system (8 tests)
- Examples - Walkthroughs (simple-blog, complex-saas)
- Documentation - Onboarding guides

### Architecture Model (CoD^Σ)

```
GitHub_Repository :=
  Setup_System (setup.sh v2.0)
    ⊕ Validation_System (validate-installation.sh)
    ⊕ Example_Projects (simple-blog + complex-saas)
    ⊕ Documentation_Suite (README + QUICKSTART + ARCHITECTURE + TROUBLESHOOTING)
    → nextjs-project-setup_skill (THE MAIN PRODUCT)

Installation_Flow :=
  Prerequisites_Check (Node 18+, Claude Code, Git)
    → Interactive_Questions (5 questions: scope, skills, MCP, examples, test)
    → File_Pipeline (6 stages: skill, templates, agents, frameworks, infra, examples)
    → Validation_Tests (8 tests with pass/warn/fail)
    → Documentation_Generation (onboarding guides)
    → Summary_Display (status + next steps)

Value_Proposition :=
  Intelligence_First_Architecture
    ∘ Progressive_Disclosure (L1→L5: 50t → 16,500t max)
    ∘ Token_Efficiency (81% savings: 8,000t → 1,500t)
    → Production_Ready_Next.js (15-30 min simple | 2-4 hours complex)
```

### Key Innovation: Intelligence-First Research

**OLD Approach** (4 Research Agents):
```
4 agents × 2,000 tokens each = 8,000 tokens
```

**NEW Approach** (Intelligence-First):
```
Global_Skills_Review (500t)
  ⊕ MCP_Queries (300t)
  ⊕ Synthesis (700t)
  → foundation-research.md (1,500t total)

Savings: 6,500 tokens (81% reduction)
```

**Pattern**:
```
Intel → [Query] ⇒ Read

Analysis := intelligence_query ∘ targeted_read ∘ CoD^Σ_reasoning → evidence_based_output
```

---

## Component Architecture

### 1. Setup System (setup.sh v2.0)

**Purpose**: One-command installation from GitHub

**Workflow** (CoD^Σ):
```
setup.sh :=
  Validate_Prerequisites
    → Interactive_Configuration (5 questions)
    → Download_Pipeline (6 stages)
    → Verification
    → Success_Message

6_Stages := {
  Stage_1: Skill_Installation (nextjs-project-setup/ → .claude/skills/)
  Stage_2: Template_Installation (templates/ → .claude/skills/nextjs-project-setup/templates/)
  Stage_3: Agent_Installation (agents/ → .claude/agents/)
  Stage_4: Framework_Installation (shared-imports/ → .claude/shared-imports/)
  Stage_5: Infrastructure_Setup (reports/, CLAUDE.md)
  Stage_6: Example_Installation (examples/ → examples/)
}

Download_Method := curl(primary) | wget(fallback)
Target_Location := project(./.claude/) | user(~/.claude/) | both
```

**Features**:
- Prerequisite validation (Node.js 18+, Claude Code, Git)
- Interactive configuration (5 questions)
- 6-stage file installation with progress indicators
- Error handling with actionable messages
- CLAUDE.md generation from template

**Dependencies**:
- External: GitHub raw files, curl/wget
- Internal: None (standalone script)

---

### 2. Validation System (validate-installation.sh)

**Purpose**: Health check for installation completeness

**Workflow** (CoD^Σ):
```
Validation := {
  8_Tests: {
    T1: skill_discovery (YAML frontmatter validation),
    T2: progressive_disclosure (docs + templates structure),
    T3: dependencies_agents (3 required, 0 old research agents),
    T4: agents_clarification (protocol present),
    T5: MCP_tools (.mcp.json scanning),
    T6: global_skills (~/.claude/skills/),
    T7: simple_workflow (simple-setup.md validation),
    T8: phase1_installation (reports/, CLAUDE.md, frameworks)
  }
  → INSTALLATION-VALIDATION-REPORT.md
}

Pass_Rate := (passed / total) × 100%
Status := PASS(≥80%) | WARN(60-79%) | FAIL(<60%)
```

**8 Test Categories**:

| Test | Purpose | Pass Criteria |
|------|---------|---------------|
| T1: Skill Discovery | YAML frontmatter valid | name, description, allowed-tools present |
| T2: Progressive Disclosure | Docs structure | simple-setup.md + 4 complex phase docs + 4 templates |
| T3: Dependencies - Agents | Agent count | 3 agents only (design-ideator, qa-validator, doc-auditor) |
| T4: Clarification Protocol | Agent enhancement | All 3 agents have clarification protocol |
| T5: MCP Tools | External integrations | .mcp.json with Vercel, Shadcn (min 2/5 configured) |
| T6: Global Skills | External knowledge | shadcn-ui, nextjs, tailwindcss in ~/.claude/skills/ |
| T7: Simple Workflow | Simple path | simple-setup.md has 5 required sections |
| T8: Phase 1 Installation | Complex path | reports/ exists, CLAUDE.md generated, frameworks present |

**Current Pass Rate**: 95% (19/20 passed, 1 warning)

**Dependencies**:
- External: None (pure bash script)
- Internal: Validates files from setup.sh installation

---

### 3. Main Product: nextjs-project-setup Skill

**Purpose**: Production-ready Next.js project setup (THE MAIN PRODUCT)

**Architecture** (CoD^Σ):
```
nextjs-project-setup :=
  Complexity_Assessment (simple ≤1 | complex ≥2 indicators)
    → [simple_path | complex_path]

Simple_Path (15-30 min) := {
  Phase_1: Template_Selection (Vercel_MCP)
  Phase_2: Setup_Configuration (env, config, structure)
  Phase_3: Core_Components (Shadcn_MCP: button, card, separator)
  Phase_4: Basic_Design (Tailwind CSS variables)
  Phase_5: Documentation (README, CLAUDE.md)
}

Complex_Path (2-4 hours) := {
  Phase_1: Foundation_Research (Intelligence-First: 1,500t vs 8,000t)
  Phase_2: Template_Selection (Vercel_MCP analysis)
  Phase_3: Specification (product-skill ⊕ constitution-skill)
  Phase_4: Design_System (design-ideator agent ∥ global skills)
  Phase_5: Wireframes (asset management + layout options)
  Phase_6: Implementation (TDD ∥ parallel features)
  Phase_7: QA (qa-validator agent ∥ continuous validation)
  Phase_8: Documentation (doc-auditor agent + comprehensive docs)
}

Progressive_Disclosure := {
  L1: Metadata (30-50t @ startup)
  L2: SKILL.md (2,000-2,500t @ trigger)
  L3: Phase_Docs (500-1,000t each @ phase start)
  L4: Templates (200-500t each @ usage)
  L5: Agents (2,500t summaries @ dispatch)
}
```

**Global Skills Integration** (3,316 lines):
- shadcn-ui (1,053 lines) - Component library, dark mode, theming
- nextjs (1,129 lines) - App Router, routing, data fetching
- tailwindcss (1,134 lines) - Design tokens, responsive design

**MCP Tools Used**:
- Vercel MCP - Template discovery and deployment
- Shadcn MCP - Component installation (Search → View → Example → Install)
- Supabase MCP - Database and auth setup (if database_required)
- 21st Dev MCP - Design inspiration (if design_complexity="complex")
- Ref MCP - Documentation queries

**Agents** (3 specialized):
1. `nextjs-design-ideator.md` (20KB) - Design system ideation
2. `nextjs-qa-validator.md` (17KB) - Continuous QA validation
3. `nextjs-doc-auditor.md` (16KB) - Documentation audit

**Dependencies**:
- External: Global skills (user-level), MCP servers, Node.js 18+
- Internal: Templates (4), Phase docs (4), Shared frameworks (2)

---

### 4. Example Projects

**Purpose**: Demonstrate skill workflows with complete walkthroughs

**Architecture**:
```
Examples := {
  simple-blog: {
    workflow: Template → Setup → Components → Design → Docs,
    duration: 15-30_minutes,
    complexity: LOW (1/5 indicators),
    output: README.md (540 lines with terminal output examples)
  },

  complex-saas: {
    workflow: Phase_1_Research → Phase_2_Template → Phase_3_Spec,
    duration: Phase_1 (30 min),
    complexity: HIGH (5/5 indicators),
    output: README.md (demonstrating intelligence-first approach)
  }
}

Documentation_Structure := {
  Overview,
  Prerequisites,
  Step-by-Step_Walkthrough (with expected terminal output),
  Generated_Files_Structure,
  Testing_Instructions,
  Next_Steps,
  Troubleshooting,
  Success_Criteria
}
```

**Dependencies**:
- External: nextjs-project-setup skill (must be installed)
- Internal: Example README documentation only (no code)

---

### 5. Documentation Suite

**Purpose**: Enable 5-minute onboarding to production deployment

**Architecture**:
```
Documentation := {
  README.md: {
    purpose: Repository_overview,
    content: Quick_start ⊕ Features ⊕ Prerequisites ⊕ Installation ⊕ Examples,
    audience: GitHub_users (discovery)
  },

  QUICKSTART.md: {
    purpose: 5-minute_onboarding,
    content: 4_steps (Verify → Explore → Learn → Next),
    audience: New_users (first-time setup)
  },

  ARCHITECTURE.md: {
    purpose: System_understanding,
    content: CoD^Σ_diagrams ⊕ Dependencies ⊕ Token_budgets ⊕ Workflows,
    audience: Developers ⊕ AI_agents (deep understanding)
  },

  TROUBLESHOOTING.md: {
    purpose: Self-service_problem_resolution,
    content: 10+_issues ⊕ Solutions ⊕ Prevention,
    audience: Users (debugging)
  }
}
```

**Dependencies**:
- External: None (static documentation)
- Internal: Cross-references to examples, validation, setup

---

## Installation Flow

### Complete Installation Workflow (CoD^Σ)

```
User_Executes_curl :=
  curl -fsSL https://raw.githubusercontent.com/yangsi7/nextjs-intelligence-toolkit/master/setup.sh | bash

Setup_Flow :=
  [STAGE 0] Prerequisite_Validation
    ├→ Check: node --version ≥ 18
    ├→ Check: claude --version (Claude Code installed)
    ├→ Check: git --version (Git available)
    └→ [FAIL → Error with installation instructions | PASS → Continue]

  [STAGE 1] Interactive_Configuration
    ├→ Q1: Installation scope? (project | user | both)
    ├→ Q2: Install global skills? (yes | no)
    ├→ Q3: Configure MCP tools? (yes | no)
    ├→ Q4: Include examples? (yes | no)
    └→ Q5: Run validation after? (yes | no)

  [STAGE 2] Skill_Installation
    ├→ Download: .claude/skills/nextjs-project-setup/SKILL.md (999 lines)
    ├→ Download: docs/simple-setup.md
    ├→ Download: docs/complex/*.md (4 files)
    ├→ Download: references/*.md
    └→ Verify: YAML frontmatter valid

  [STAGE 3] Template_Installation
    ├→ Download: templates/design-showcase.md
    ├→ Download: templates/wireframe-template.md
    ├→ Download: templates/report-template.md
    └→ Download: templates/spec-template.md

  [STAGE 4] Agent_Installation
    ├→ Download: .claude/agents/nextjs-design-ideator.md (20KB)
    ├→ Download: .claude/agents/nextjs-qa-validator.md (17KB)
    ├→ Download: .claude/agents/nextjs-doc-auditor.md (16KB)
    └→ Verify: 3 agents only (no old research agents)

  [STAGE 5] Framework_Installation
    ├→ Download: .claude/shared-imports/CoD_Σ.md
    ├→ Download: .claude/shared-imports/constitution.md
    └→ Verify: Framework files exist

  [STAGE 6] Infrastructure_Setup
    ├→ Create: reports/ directory
    ├→ Create: reports/README.md
    ├→ Create: reports/.gitignore
    ├→ Generate: CLAUDE.md (from template)
    └→ Verify: Directory structure correct

  [STAGE 7] Example_Installation (if user selected)
    ├→ Download: examples/simple-blog/README.md (540 lines)
    ├→ Download: examples/complex-saas/README.md
    └→ Verify: Examples complete

  [STAGE 8] Validation (if user selected)
    ├→ Execute: ./validate-installation.sh
    ├→ Generate: INSTALLATION-VALIDATION-REPORT.md
    └→ Display: Pass rate and status

  [STAGE 9] Success_Message
    ├→ Display: Installation summary
    ├→ Display: Next steps (read QUICKSTART.md)
    └→ Display: Quick reference commands

Duration: 3-5 minutes (depending on network speed)
```

### Installation Modes

| Mode | Location | Use Case | Files Installed |
|------|----------|----------|-----------------|
| **Project** | `./.claude/` | Project-specific | Skill, agents, templates, frameworks, examples |
| **User** | `~/.claude/` | All projects | Skill, agents, templates, frameworks (no examples) |
| **Both** | Both locations | Hybrid setup | Skill (user) + examples (project) |

---

## Validation Architecture

### 8-Test Validation Flow (CoD^Σ)

```
Validation_Flow :=
  Initialize_Counters (passed=0, failed=0, warnings=0)
    → Execute_8_Tests
    → Generate_Report
    → Display_Summary

Test_Execution := {
  ∀test ∈ [T1, T2, T3, T4, T5, T6, T7, T8]:
    Run_Assertions
      → [PASS → passed++ | WARN → warnings++ | FAIL → failed++]
      → Log_Result
}

Report_Generation :=
  Calculate_Pass_Rate := (passed / total_assertions) × 100%
    → Determine_Status := {
        PASS: pass_rate ≥ 80% ∧ failed = 0,
        WARN: pass_rate ≥ 60% ∧ failed = 0,
        FAIL: pass_rate < 60% ∨ failed > 0
      }
    → Write_Markdown_Report (INSTALLATION-VALIDATION-REPORT.md)
    → Display_Summary (color-coded)
```

### Test Details

**Test 1: Skill Discovery** (3 assertions)
```
Assert_1: .claude/skills/nextjs-project-setup/SKILL.md exists
Assert_2: YAML frontmatter contains 'name' field
Assert_3: YAML frontmatter contains 'description' field (enables auto-invocation)
```

**Test 2: Progressive Disclosure** (3 assertions)
```
Assert_1: docs/simple-setup.md exists (L3)
Assert_2: docs/complex/*.md exists (4 files, L3)
Assert_3: templates/*.md exists (4 files, L4)
```

**Test 3: Dependencies - Agents** (2 assertions)
```
Assert_1: Exactly 3 agents present (design-ideator, qa-validator, doc-auditor)
Assert_2: No old research agents (nextjs-research-*.md should not exist)
```

**Test 4: Clarification Protocol** (1 assertion)
```
Assert_1: All 3 agents have clarification protocol sections
```

**Test 5: MCP Tools Detection** (2 assertions)
```
Assert_1: .mcp.json exists (local OR ~/.claude/.mcp.json)
Assert_2: At least 2/5 MCP servers configured (Vercel, Shadcn minimum)
```

**Test 6: Global Skills Detection** (3 assertions)
```
Assert_1: shadcn-ui skill exists (~/.claude/skills/shadcn-ui/SKILL.md)
Assert_2: nextjs skill exists (~/.claude/skills/nextjs/SKILL.md)
Assert_3: tailwindcss skill exists (~/.claude/skills/tailwindcss/SKILL.md)
```

**Test 7: Simple Workflow Test** (2 assertions)
```
Assert_1: simple-setup.md has all 5 required sections
Assert_2: simple-setup.md is substantial (>500 lines)
```

**Test 8: Phase 1 Installation Test** (4 assertions)
```
Assert_1: reports/ directory exists
Assert_2: reports/README.md exists
Assert_3: CLAUDE.md generated (references nextjs-project-setup skill)
Assert_4: Shared frameworks exist (CoD_Σ.md, constitution.md)
```

**Total Assertions**: 20

**Current Results**: 19 passed ✅, 1 warning ⚠️ (initial-prompt.md not generated - optional)

---

## Token Budget Breakdown

### Progressive Disclosure Levels

```
Token_Budget := {
  Level_1_Metadata: 30-50 tokens (YAML frontmatter, always loaded),
  Level_2_Core: 2,000-2,500 tokens (SKILL.md on trigger),
  Level_3_Phases: 500-1,000 tokens × 4 files = 2,000-4,000 tokens (on-demand),
  Level_4_Templates: 200-500 tokens × 4 files = 800-2,000 tokens (on-demand),
  Level_5_Agents: 2,500 tokens × 3 agents = 7,500 tokens (summaries only)
}

Total_Maximum := 30 + 2,500 + 4,000 + 2,000 + 7,500 = 16,030 tokens

Safety_Margin := 3,500 tokens (for user context and conversation)

Realistic_Budget := 12,000-14,000 tokens (typical complex path usage)
```

### Token Efficiency Scenarios

**Minimal Path** (Simple setup):
```
L1 (50t) + L2 (2,500t) + L3_simple (2,500t) = 5,050 tokens
Savings: 75% vs naive approach
```

**Typical Path** (Complex, 2 phases + 1 agent):
```
L1 (50t) + L2 (2,500t) + L3 (2,000t) + L5 (2,500t) = 7,050 tokens
Savings: 65% vs naive approach
```

**Maximum Path** (All 8 phases + 3 agents):
```
L1 (50t) + L2 (2,500t) + L3 (4,000t) + L4 (2,000t) + L5 (7,500t) = 16,050 tokens
Savings: 45% vs naive approach (still significant)
```

### Phase 1 Token Optimization

**OLD Approach** (4 Research Agents):
```
nextjs-research-vercel.md:    ~2,000 tokens
nextjs-research-shadcn.md:    ~2,000 tokens
nextjs-research-supabase.md:  ~2,000 tokens
nextjs-research-design.md:    ~2,000 tokens
────────────────────────────────────────────
Total:                         8,000 tokens
```

**NEW Approach** (Intelligence-First):
```
Review global skills:           300-500 tokens
  - shadcn-ui (1,053 lines)
  - nextjs (1,129 lines)
  - tailwindcss (1,134 lines)

Query MCP tools:                200-400 tokens
  - Vercel MCP (templates)
  - Shadcn MCP (components)
  - Supabase MCP (DB patterns)
  - 21st Dev MCP (design)

Synthesize context:             500-1,000 tokens
  - foundation-research.md output

────────────────────────────────────────────
Total:                         1,500 tokens

Savings: 6,500 tokens (81.25% reduction)
```

### Agent Token Truncation Protocol

**Hard Limit**: 2,500 tokens per agent report (enforced)

**Truncation Behavior**:
```
IF report > 2,500 tokens:
  Truncate at 2,500t
    + Add marker: "[TRUNCATED - Request [CONTINUE] for more]"
    + List available sections for continuation

Main agent can request:
  [CONTINUE: section-name] → Agent responds with ≤1,500t focused continuation
```

**Token Budget by Agent Report**:
- Executive summary: 100-150t
- Key findings: 300-400t (5 bullets × 60-80t each)
- Recommendations: 200-300t
- Details: 1,500-1,700t (truncated if needed)
- References: 200-300t

---

## Workflow Paths

### Simple Path (15-30 minutes)

```
Simple_Workflow :=
  User: "Set up simple Next.js blog"
    → Complexity_Assessment (≤1 complex indicators)
    → User_Confirms: Simple path
    → Load: @docs/simple-setup.md

  5_Phases := {
    [1] Template_Selection (3 min)
      Vercel_MCP.search(filter: blog)
        → Present top 3 options
        → User selects
        → Install: npx create-next-app --example blog-starter

    [2] Setup_Configuration (5 min)
      Create .env.local
        → Configure package.json
        → Validate tsconfig.json
        → Verify structure

    [3] Core_Components (7 min)
      Shadcn_MCP.init(style: New York, variables: yes)
        → Shadcn_MCP.add(button, card, separator)
        → Verify: components/ui/ populated
        → Test: /test-components page

    [4] Basic_Design (5 min)
      Configure tailwind.config.ts (CSS variables)
        → Define globals.css (design tokens)
        → Enable dark mode (next-themes)
        → Verify: theme switching works

    [5] Documentation (5 min)
      Generate README.md
        → Generate CLAUDE.md (conventions + anti-patterns)
        → Document structure
        → Next steps guidance
  }

  Output: Production-ready blog template
  Duration: 15-30 minutes
  Token Usage: ~5,000 tokens
```

### Complex Path (2-4 hours)

```
Complex_Workflow :=
  User: "Set up Next.js SaaS with database, auth, multi-tenant"
    → Complexity_Assessment (≥2 complex indicators)
    → User_Confirms: Complex path
    → Load: @docs/complex/phase-*.md (progressive)

  8_Phases := {
    [1] Foundation_Research (30 min) [INTELLIGENCE-FIRST]
      Progress: [█░░░░░░░] 12.5% (1/8)

      Review_Global_Skills (500t)
        → Query_MCP_Tools (300t)
        → Synthesize (700t)
        → Output: /reports/foundation-research.md (1,500t total)

      Token savings: 6,500t vs old 4-agent approach

    [2] Template_Selection (15 min)
      Progress: [██░░░░░░] 25.0% (2/8)

      Load: @docs/complex/phase-2-template.md
      Analyze requirements → Filter templates → Present top 3 → User selects → Install → Verify

    [3] Specification (30 min)
      Progress: [███░░░░░] 37.5% (3/8)

      Load: @docs/complex/phase-3-spec.md
      product-skill → constitution-skill → Features definition → Architecture docs

    [4] Design_System (60 min, max 3 feedback iterations)
      Progress: [████░░░░] 50.0% (4/8)

      Load: @docs/complex/phase-4-design.md
      Dispatch: nextjs-design-ideator agent
        → Leverages global skills (shadcn-ui, tailwindcss)
        → Creates design options
        → Showcase → User feedback (max 3 iterations)
        → Finalize design system

    [5] Wireframes (45 min, max 3 feedback iterations)
      Progress: [█████░░░] 62.5% (5/8)

      Load: @docs/complex/phase-5-wireframes.md
      Asset management (if images provided)
        → Generate wireframe options (2-3 per page)
        → Expert evaluation → User feedback (max 3 iterations)
        → Finalize layouts

    [6] Implementation (2-3 hours, parallel + TDD)
      Progress: [██████░░] 75.0% (6/8)

      Load: @docs/complex/phase-6-implement.md
      ∀ feature:
        Tests FIRST (TDD)
          → Implement code
          → Shadcn components (Search → View → Example → Install)
          → Visual validation

      Parallel coordination for independent features
      Database setup (Supabase MCP only, never CLI)

    [7] QA_Validation (continuous parallel with Phase 6)
      Progress: [███████░] 87.5% (7/8)

      Load: @docs/complex/phase-7-qa.md
      Dispatch: nextjs-qa-validator agent (continuous)
        → Critical checklist validation
        → Report issues immediately
        → Block completion until all pass

    [8] Documentation (30 min)
      Progress: [████████] 100% (8/8)

      Load: @docs/complex/phase-8-docs.md
      Dispatch: nextjs-doc-auditor agent
        → Create CLAUDE.md (comprehensive)
        → Create /docs/ hierarchy
        → Audit completeness, accuracy, consistency
        → Clean repository
  }

  Output: Production-ready SaaS application
  Duration: 2-4 hours
  Token Usage: ~12,000-14,000 tokens (with progressive disclosure)
```

### Complexity Assessment Decision Tree

```
Assessment_Flow :=
  Count_Complex_Indicators{
    database_required,
    custom_authentication,
    multi_tenant_architecture,
    e_commerce_features,
    complex_design_system,
    multiple_integrations
  }

  IF count ≤ 1:
    → Simple_Path (15-30 min)
  ELSE IF count ≥ 2:
    → Complex_Path (2-4 hours)

  → Ask_User_Confirm (always, prevent assumptions)
```

**Indicators**:
- ✓ Database required → Complex
- ✓ Custom authentication → Complex
- ✓ Multi-tenant architecture → Complex
- ✓ E-commerce features → Complex
- ✓ Complex design system → Complex
- ✓ Multiple integrations → Complex

**Simple Project Examples**:
- Personal blog (0-1 indicators)
- Portfolio website (0-1 indicators)
- Marketing site (0-1 indicators)
- Documentation site (0-1 indicators)

**Complex Project Examples**:
- SaaS application (3-5 indicators)
- E-commerce platform (3-4 indicators)
- Multi-tenant CRM (4-5 indicators)
- Real-time collaboration tool (4-6 indicators)

---

## Dependency Graph

### External Dependencies

```
External_Dependencies := {
  Required: {
    Node.js: "≥18.0.0" (runtime environment),
    Claude_Code: "latest" (AI coding assistant),
    Git: "any" (version control),
    GitHub: "network access" (for curl installation)
  },

  MCP_Servers: {
    Vercel: @vercel/mcp (template discovery + deployment),
    Shadcn: @shadcn/mcp (component library),
    Supabase: @supabase/mcp (database + auth, if database_required),
    21st_Dev: @21st-dev/mcp (design inspiration, if design_complexity="complex"),
    Ref: @ref/mcp (documentation queries)
  },

  Global_Skills (user must install): {
    shadcn-ui: ~/.claude/skills/shadcn-ui/SKILL.md (1,053 lines),
    nextjs: ~/.claude/skills/nextjs/SKILL.md (1,129 lines),
    tailwindcss: ~/.claude/skills/tailwindcss/SKILL.md (1,134 lines)
  }
}
```

### Internal Component Dependencies

```
Component_Dependencies :=
  setup.sh (standalone, no internal dependencies)
    ↓ creates
  .claude/skills/nextjs-project-setup/
    ├─ depends_on: Global skills (external)
    ├─ depends_on: MCP servers (external)
    ├─ contains: SKILL.md (999 lines)
    ├─ contains: docs/ (4 phase docs + simple-setup.md)
    ├─ contains: templates/ (4 templates)
    └─ contains: references/ (architecture docs)

  .claude/agents/
    ├─ nextjs-design-ideator.md
    │   └─ references: Global skills (shadcn-ui, tailwindcss)
    ├─ nextjs-qa-validator.md
    │   └─ references: Validation checklist templates
    └─ nextjs-doc-auditor.md
        └─ references: CLAUDE.md template

  .claude/shared-imports/
    ├─ CoD_Σ.md (reasoning framework)
    └─ constitution.md (development principles)

  reports/ (created by setup.sh)
    └─ README.md (documents purpose)

  examples/
    ├─ simple-blog/README.md (references simple-setup.md workflow)
    └─ complex-saas/README.md (references complex phases 1-3)

  validate-installation.sh (standalone, validates setup.sh output)
    ↓ generates
  INSTALLATION-VALIDATION-REPORT.md
```

### Dependency Flow Diagram (CoD^Σ)

```
[GitHub Repository]
    ↓ curl
[setup.sh] (standalone)
    ↓ downloads
[nextjs-project-setup skill]
    ↓ references
[Global Skills] (shadcn-ui, nextjs, tailwindcss)
    ↓ queries
[MCP Servers] (Vercel, Shadcn, Supabase, 21st-dev, Ref)
    ↓ coordinates
[3 Agents] (design-ideator, qa-validator, doc-auditor)
    ↓ produces
[Production-Ready Next.js Project]

Validation_Path:
[validate-installation.sh] (standalone)
    ↓ checks
[Installation Completeness] (8 tests)
    ↓ generates
[INSTALLATION-VALIDATION-REPORT.md]

Documentation_Path:
[README.md] (discovery)
    ↓ guides to
[QUICKSTART.md] (5-minute onboarding)
    ↓ references
[ARCHITECTURE.md] (system understanding)
    ∧ [TROUBLESHOOTING.md] (problem resolution)
```

---

## Extension Points

### 1. Adding Custom Skills

**Purpose**: Extend nextjs-project-setup with team-specific workflows

**Pattern**:
```
Custom_Skill_Location := .claude/skills/custom-skill-name/

Structure := {
  SKILL.md: {
    frontmatter: {name, description, allowed-tools},
    content: workflow_instructions
  },
  docs/: additional_documentation,
  templates/: custom_templates,
  scripts/: helper_scripts
}

Integration := {
  Reference_from_nextjs-project-setup: @.claude/skills/custom-skill-name/SKILL.md,
  Inherit_global_skills: same global skills available,
  Use_same_MCP_tools: same MCP servers accessible
}
```

**Example**:
```yaml
---
name: company-specific-setup
description: Add company-specific Next.js setup (internal auth, monitoring, deployment). Use when setting up Next.js for [Company] projects.
allowed-tools: Bash, Read, Write, Edit, mcp__vercel__*, mcp__custom_internal_mcp__*
---

# Company-Specific Next.js Setup

## Additional Phases

### Phase 9: Internal Monitoring Setup
[company-specific instructions]

### Phase 10: Custom Deployment Pipeline
[company-specific instructions]
```

**Usage**:
```
nextjs-project-setup skill (Phases 1-8)
  → company-specific-setup skill (Phases 9-10)
  → Complete company-ready project
```

---

### 2. Adding Custom Agents

**Purpose**: Add specialized analysis or implementation agents

**Pattern**:
```
Custom_Agent_Location := .claude/agents/custom-agent-name.md

Structure := {
  frontmatter: {name, description, tools, model},
  system_prompt: agent_instructions,
  references: @skills | @templates | @imports
}

Integration := {
  Dispatch_from_phase: Main → custom-agent (isolated context),
  Handover_via_markdown: Agent writes → CUSTOM-REPORT.md → Main reads,
  Token_limit: ≤2,500t per report (enforced)
}
```

**Example**:
```yaml
---
name: security-auditor
description: Audit Next.js application for security vulnerabilities, OWASP compliance, and best practices. Use when security review needed.
tools: [Read, Grep, Glob, Bash]
model: sonnet
---

# Security Auditor Agent

You are a security specialist for Next.js applications.

## Responsibilities
- Scan codebase for security vulnerabilities
- Check OWASP Top 10 compliance
- Verify authentication/authorization patterns
- Review environment variable handling
- Check dependency vulnerabilities

## Output
Create SECURITY-AUDIT-REPORT.md with:
- Executive summary (200t)
- Critical findings (500t)
- Recommendations (800t)
- Detailed analysis (1000t, max)

Total: ≤2,500 tokens
```

**Usage**:
```
Phase 6: Implementation complete
  → Dispatch: security-auditor agent
  → Receives: SECURITY-AUDIT-REPORT.md
  → Main: Reviews and addresses findings
```

---

### 3. Customizing Templates

**Purpose**: Create company-specific output formats

**Pattern**:
```
Custom_Template_Location := .claude/skills/nextjs-project-setup/templates/custom-template.md

Integration := {
  Reference_in_phase: @templates/custom-template.md,
  Use_in_agent: Agents load template for output formatting,
  Inherit_structure: Follow existing template patterns
}
```

**Example** (Company CLAUDE.md Template):
```markdown
# [Project Name]

## Overview
[2-3 sentence description]

## Company-Specific Information
**Internal Ticket**: [JIRA-XXX]
**Team**: [Team Name]
**Stakeholders**: [List]

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + Shadcn UI (@ui)
- [Company Internal Auth System]
- [Company Monitoring Stack]

## Development

### Commands
- `npm run dev` - Start development server
- `npm run test` - Run tests
- `npm run company:deploy` - Deploy to company infrastructure

### Company Conventions
- Follow [Company Style Guide]
- Use [Company Component Library]
- Integrate [Company Monitoring]
- Deploy via [Company CI/CD]

[Rest of standard CLAUDE.md content]
```

**Usage**:
```
Phase 8: Documentation
  → Use: @templates/company-claude-template.md
  → Generate: CLAUDE.md with company-specific sections
```

---

### 4. Adding Team-Specific Workflows

**Purpose**: Create reusable team workflows via slash commands

**Pattern**:
```
Custom_Command_Location := .claude/commands/team-workflow.md

Structure := {
  frontmatter: {description, argument-hint, allowed-tools, model},
  prompt_expansion: Multi-step workflow instructions
}

Integration := {
  User_invokes: /team-workflow [args],
  Loads: nextjs-project-setup skill (if needed),
  Executes: Custom workflow steps,
  References: Team-specific templates/skills/agents
}
```

**Example**:
```yaml
---
description: Set up Next.js project following [Company] standards with internal integrations
argument-hint: [project-type] [team-name]
allowed-tools: [Bash, Read, Write, Edit, SlashCommand, Task, mcp__vercel__*, mcp__company_internal__*]
model: sonnet
---

# Company Next.js Setup Command

## Workflow

1. **Use nextjs-project-setup skill** for base setup
   - Choose complexity based on project type
   - Follow standard phases 1-8

2. **Add company-specific integrations**
   - Install @company/auth-sdk
   - Configure company monitoring
   - Set up company CI/CD
   - Add company design tokens

3. **Create company-specific documentation**
   - Use @templates/company-claude-template.md
   - Add team runbook
   - Document internal dependencies

4. **Validate company compliance**
   - Run company security checks
   - Verify company coding standards
   - Check internal dependency versions

## Output
Production-ready Next.js project with company standards
```

**Usage**:
```bash
claude-code

User: /company-nextjs-setup saas platform-team
  → Executes: Base setup + company integrations + compliance checks
  → Output: Company-ready Next.js project
```

---

### 5. Integrating Additional MCP Servers

**Purpose**: Add new external tools/services

**Pattern**:
```
MCP_Configuration := .mcp.json | ~/.claude/.mcp.json

Add_Server := {
  "mcpServers": {
    "existing": {...},
    "new-service": {
      "command": "npx",
      "args": ["-y", "@company/new-service-mcp"]
    }
  }
}

Update_Skill := {
  allowed-tools: Add "mcp__new-service__*" to SKILL.md frontmatter,
  workflow: Integrate new-service queries into phases
}
```

**Example** (Adding Company CMS MCP):
```json
{
  "mcpServers": {
    "vercel": {...},
    "shadcn": {...},
    "company-cms": {
      "command": "npx",
      "args": ["-y", "@company/cms-mcp"]
    }
  }
}
```

**Skill Update**:
```yaml
---
name: nextjs-project-setup
description: [existing description]
allowed-tools: [..., mcp__company-cms__*]
---

# Phase 1: Foundation Research

**NEW**: Query company CMS MCP for content structure patterns
  → Company_CMS_MCP.get_content_types()
  → Company_CMS_MCP.get_recommended_schema(project_type)
  → Integrate into foundation-research.md

[Rest of existing workflow]
```

---

### 6. Creating Project-Specific Variations

**Purpose**: Customize nextjs-project-setup for specific project types

**Pattern**:
```
Variation_Skill := .claude/skills/nextjs-[type]-setup/

Approach := {
  Option_1: Fork nextjs-project-setup → customize phases,
  Option_2: Wrapper skill → delegates to nextjs-project-setup + adds extras,
  Option_3: Template override → custom templates for specific type
}
```

**Example** (Next.js E-commerce Setup):
```yaml
---
name: nextjs-ecommerce-setup
description: Next.js e-commerce project setup with Shopify/Stripe integration. Use when creating e-commerce sites.
allowed-tools: [Bash, Read, Write, Edit, mcp__vercel__*, mcp__shadcn__*, mcp__shopify__*, mcp__stripe__*]
---

# Next.js E-commerce Setup Skill

## Workflow

### Phase 1-3: Foundation (delegates to nextjs-project-setup)
Use nextjs-project-setup skill for:
- Foundation research
- Template selection (filter: e-commerce)
- Specification

### Phase 4: E-commerce Design System
Custom design phase:
- Product page layouts
- Cart/checkout flows
- Payment UI components
- Order confirmation designs

### Phase 5: Shopify/Stripe Integration
- Shopify storefront API setup
- Stripe payment integration
- Webhook configuration
- Inventory sync

### Phase 6-8: Implementation, QA, Docs (delegates to nextjs-project-setup)
Use nextjs-project-setup skill for:
- TDD implementation
- QA validation
- Documentation

## Output
Production-ready Next.js e-commerce site
```

**Usage**:
```
User: "Set up Next.js e-commerce store with Shopify"
  → nextjs-ecommerce-setup skill auto-triggers
  → Delegates base setup to nextjs-project-setup
  → Adds e-commerce-specific phases
  → Output: E-commerce-ready Next.js project
```

---

## Summary

### Core Architecture Principles

1. **Main Product Focus**: nextjs-project-setup skill (999 lines) is THE MAIN PRODUCT
2. **Supporting Infrastructure**: setup.sh, validation, examples, docs enable skill usage
3. **Intelligence-First**: Query before read (81% token savings)
4. **Progressive Disclosure**: 5 levels (50t → 16,500t max)
5. **Two-Path Workflow**: Simple (15-30 min) vs Complex (2-4 hours)
6. **Quality Gates**: 8-test validation (95% pass rate)
7. **Extensibility**: Skills, agents, templates, commands, MCP servers

### Key Metrics

| Metric | Value | Impact |
|--------|-------|--------|
| **Token Savings** | 81% (Phase 1) | 8,000t → 1,500t |
| **Validation Pass Rate** | 95% | 19/20 assertions |
| **Agent Reduction** | 57% | 7 → 3 agents |
| **Global Skills** | 3,316 lines | External knowledge base |
| **MCP Integrations** | 5 servers | External tool access |
| **Simple Path Duration** | 15-30 min | Fast project setup |
| **Complex Path Duration** | 2-4 hours | Full production setup |
| **Progressive Levels** | 5 levels | Token optimization |

### Extension Summary

| Extension Point | Purpose | Example |
|-----------------|---------|---------|
| **Custom Skills** | Team workflows | company-specific-setup |
| **Custom Agents** | Specialized analysis | security-auditor |
| **Custom Templates** | Output formats | company-claude-template |
| **Team Commands** | Workflow shortcuts | /company-nextjs-setup |
| **MCP Servers** | External tools | company-cms-mcp |
| **Project Variations** | Type-specific | nextjs-ecommerce-setup |

---

**Document Version**: 1.0
**Last Updated**: 2025-10-30
**Notation**: CoD^Σ (Chain of Density Sigma)
**Next Review**: After Phase 5 completion

**References**:
- QUICKSTART.md - 5-minute onboarding
- TROUBLESHOOTING.md - Problem resolution
- README.md - Repository overview
- planning.md - Project plan
- todo.md - Task tracking
