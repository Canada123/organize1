# Next.js Project Setup System: Current State vs Improved State

**Generated**: 2025-10-30
**Purpose**: Visual comparison of current system architecture with proposed improvements
**Analysis Source**: Tree-of-thought system mapping

---

## Part 1: Current State Architecture (With Issues Mapped)

### System Component Hierarchy (Current)

```
Claude_Code_Intelligence_Toolkit
│
├── Core_Infrastructure
│   │
│   ├── Intelligence_Query_System
│   │   ├── project-intel.mjs (80% token savings ✓)
│   │   ├── MCP_Servers (5 tools: Vercel, Shadcn, Supabase, 21st-dev, Ref) ✓
│   │   └── Global_Skills (3,316 lines: shadcn-ui, nextjs, tailwindcss) ✓
│   │
│   ├── Component_System (Skills-First Hierarchy)
│   │   │
│   │   ├── L1_Skills [AUTO-INVOKED]
│   │   │   └── nextjs-project-setup/
│   │   │       ├── SKILL.md (999 lines) ✓
│   │   │       ├── docs/
│   │   │       │   ├── simple-setup.md ✓
│   │   │       │   └── complex/
│   │   │       │       ├── phase-2-template.md
│   │   │       │       ├── phase-3-spec.md
│   │   │       │       ├── phase-4-design.md
│   │   │       │       ├── phase-5-wireframes.md
│   │   │       │       ├── phase-6-implement.md
│   │   │       │       ├── phase-7-qa.md
│   │   │       │       └── phase-8-docs.md
│   │   │       │       [SMELL: 7 separate files, could be 3-4]
│   │   │       │
│   │   │       └── templates/
│   │   │           ├── design-showcase.md ✓
│   │   │           └── wireframe-template.md ✓
│   │   │           [SMELL: Inconsistent - some templates inline in SKILL.md]
│   │   │
│   │   ├── L2_Commands [USER-INVOKED]
│   │   │   └── /setup-nextjs-project → invokes skill ✓
│   │   │
│   │   └── L3_Agents [DELEGATED, ISOLATED]
│   │       ├── nextjs-design-ideator.md (20KB) ✓
│   │       ├── nextjs-qa-validator.md (17KB) ✓
│   │       └── nextjs-doc-auditor.md (16KB) ✓
│   │       [ISSUE: No clarification request mechanism]
│   │       [ISSUE: No parallel coordination protocol]
│   │
│   └── Output_Templates
│       ├── design-showcase.md ✓
│       ├── wireframe-template.md ✓
│       ├── report-template.md ✓
│       └── verification-report.md ✓
│       [SMELL: No cleanup strategy for timestamp reports]
│
└── Workflow_Patterns
    ├── Simple_Path (15-30 min) ✓
    │   Template → Setup → Components → Design → Docs
    │   [CLARITY: Decision criteria not explicit enough]
    │
    └── Complex_Path (2-4 hours)
        8 Phases with parallel ops in Phase 6-7
        [GAP: Missing /reports/ directory - BLOCKS EXECUTION]
        [GAP: No rollback procedures documented]
        [CLARITY: Optional agent usage unclear]
        [CLARITY: Database setup triggers vague]
```

**Issues Summary**:
- 🔴 **GAP**: Missing /reports/ directory (referenced @SKILL.md:204)
- 🔴 **GAP**: No rollback/error recovery procedures
- 🟡 **SMELL**: 7 phase docs could consolidate to 3-4
- 🟡 **SMELL**: Template storage inconsistent
- 🟡 **SMELL**: No report cleanup strategy
- 🔵 **CLARITY**: Decision criteria not explicit
- 🔵 **CLARITY**: Optional agent logic unclear
- 🟠 **ISSUE**: No agent clarification mechanism
- 🟠 **ISSUE**: No parallel coordination protocol

---

### Current User Flow (Complex Path)

```
[ENTRY] User: "Set up Next.js project"
   ↓
[DECISION] Complexity Assessment
   │ [CLARITY ISSUE: Vague criteria]
   │ Simple indicators: ≤1 true
   │ Complex indicators: ≥2 true
   ↓ (assume COMPLEX)

┌──────────────────────────────────────────────────────────┐
│ PHASE 1: Foundation Research (30 min)                    │
│ Pattern: Intelligence-First ✓                            │
├──────────────────────────────────────────────────────────┤
│ 1. Review global skills (500t)                           │
│ 2. Query MCP tools (300t)                                │
│ 3. Synthesize context (700t)                             │
│ → OUTPUT: /reports/foundation-research.md                │
│    [GAP: /reports/ directory missing - FAILS HERE]       │
│                                                           │
│ Token savings: 6,500t (81% vs old 8,000t) ✓              │
└──────────────────────────────────────────────────────────┘
   ↓ [ERROR PATH: No rollback documented]

┌──────────────────────────────────────────────────────────┐
│ PHASE 2: Template Selection (15 min)                     │
├──────────────────────────────────────────────────────────┤
│ Prerequisites: @reports/foundation-research.md           │
│ 1. Use Vercel MCP to filter                              │
│ 2. Present top 3 options                                 │
│ 3. User selects template                                 │
│ 4. Install & verify                                      │
│ → OUTPUT: /docs/template-selection.md                    │
└──────────────────────────────────────────────────────────┘
   ↓

┌──────────────────────────────────────────────────────────┐
│ PHASE 3: Specification (30 min)                          │
├──────────────────────────────────────────────────────────┤
│ 1. Invoke product-skill → product-spec.md                │
│ 2. Invoke constitution-skill → constitution.md           │
│ 3. Define features → features.md                         │
│ 4. Document architecture → architecture.md               │
└──────────────────────────────────────────────────────────┘
   ↓

┌──────────────────────────────────────────────────────────┐
│ PHASE 4: Design System (1 hour with iterations)          │
├──────────────────────────────────────────────────────────┤
│ 1. Dispatch agent: nextjs-design-ideator                 │
│    [ISSUE: If report insufficient, no clarification]     │
│    → Returns: design-ideator-report-[timestamp].md       │
│                                                           │
│ 2. Create showcase page                                  │
│ 3. User feedback loop                                    │
│    [CLARITY: Max iterations vague - "max 3" once]        │
│ 4. Finalize design system                                │
└──────────────────────────────────────────────────────────┘
   ↓

┌──────────────────────────────────────────────────────────┐
│ PHASE 5: Wireframes (45 min)                             │
├──────────────────────────────────────────────────────────┤
│ 1. [CONDITIONAL] Asset management                        │
│    [CLARITY: Trigger logic unclear]                      │
│ 2. Generate wireframe options (2-3 per page)             │
│ 3. Expert evaluation                                     │
│ 4. User feedback loop                                    │
│    [CLARITY: Max iterations vague]                       │
│ 5. Finalize layouts                                      │
└──────────────────────────────────────────────────────────┘
   ↓

┌──────────────────────────────────────────────────────────┐
│ PHASE 6: Implementation (2-3 hours) ∥ PARALLEL           │
├──────────────────────────────────────────────────────────┤
│ FOR EACH feature (can run in parallel):                  │
│   1. Write tests FIRST (TDD) ✓                           │
│   2. Implement code                                      │
│   3. Install Shadcn components                           │
│   4. Visual validation                                   │
│                                                           │
│ [ISSUE: No parallel coordination protocol]               │
│ [ISSUE: Conflict detection missing]                      │
│                                                           │
│ [CONDITIONAL] Database setup                             │
│    [CLARITY: "if database_required" - logic unclear]     │
│    Use Supabase MCP (not CLI) ✓                          │
└──────────────────────────────────────────────────────────┘
   ∥ (runs in parallel with Phase 6)
   ↓
┌──────────────────────────────────────────────────────────┐
│ PHASE 7: QA (Continuous) ∥ PARALLEL                      │
├──────────────────────────────────────────────────────────┤
│ Agent: nextjs-qa-validator (runs continuously)           │
│   - Validates critical checklist                         │
│   - Reports issues immediately                           │
│   - Blocks completion until all pass                     │
│                                                           │
│ [ISSUE: If agent report unclear, no clarification]       │
│ → OUTPUT: qa-report-[timestamp].md                       │
│    [SMELL: No cleanup strategy - accumulates]            │
└──────────────────────────────────────────────────────────┘
   ↓

┌──────────────────────────────────────────────────────────┐
│ PHASE 8: Documentation (30 min)                          │
├──────────────────────────────────────────────────────────┤
│ Agent: nextjs-doc-auditor                                │
│   - Creates CLAUDE.md + /docs/ hierarchy                 │
│   - Audits completeness, accuracy, consistency           │
│   - Cleans repository                                    │
│                                                           │
│ [ISSUE: If agent report unclear, no clarification]       │
│ → OUTPUT: doc-audit-report-[timestamp].md                │
│    [SMELL: No cleanup strategy - accumulates]            │
└──────────────────────────────────────────────────────────┘
   ↓

[SUCCESS] Production-Ready Next.js Application
   [GAP: No rollback if any phase fails]
```

**Flow Issues**:
- 🔴 Phase 1 fails due to missing /reports/ directory
- 🔴 No error recovery path from any phase
- 🟠 Agent reports can't request clarification
- 🟠 Parallel features have no conflict coordination
- 🟡 Timestamp reports accumulate without cleanup
- 🔵 Conditional logic triggers unclear
- 🔵 Feedback loop iteration limits vague

---

### Current Data Flow (With Token Analysis)

```
[INPUT] User Requirements
   ↓ (parsed)

┌─────────────────────────────────────────────────────────┐
│ INTELLIGENCE GATHERING (Intelligence-First ✓)          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Global Skills (300-500 tokens)                         │
│   ├── shadcn-ui (1,053 lines)                          │
│   ├── nextjs (1,129 lines)                             │
│   └── tailwindcss (1,134 lines)                        │
│                                                         │
│ MCP Queries (200-400 tokens)                           │
│   ├── Vercel_MCP → templates                           │
│   ├── Shadcn_MCP → components                          │
│   ├── Supabase_MCP → DB patterns (conditional)         │
│   │    [CLARITY: When to invoke unclear]               │
│   └── 21st_Dev_MCP → design (optional)                 │
│        [CLARITY: When to skip unclear]                 │
│                                                         │
│ Synthesis (500-1000 tokens)                            │
│   └── OUTPUT: foundation-research.md                   │
│       Location: /reports/ [GAP: MISSING DIRECTORY]     │
│                                                         │
│ Total: 1,500 tokens (vs 8,000 old) = 6,500 saved ✓    │
└─────────────────────────────────────────────────────────┘
   ↓

┌─────────────────────────────────────────────────────────┐
│ TEMPLATE & SPECIFICATION                               │
├─────────────────────────────────────────────────────────┤
│ template-selection.md ← Vercel MCP                     │
│ product-spec.md ← product-skill                        │
│ constitution.md ← constitution-skill                   │
│ features.md ← feature definition                       │
│ architecture.md ← system design                        │
└─────────────────────────────────────────────────────────┘
   ↓

┌─────────────────────────────────────────────────────────┐
│ AGENT HANDOFF: Design System                           │
├─────────────────────────────────────────────────────────┤
│ Main → design-ideator agent (isolated context)         │
│   Input: specs + global skills + MCP access            │
│   Processing: 3-4 design options                       │
│   Output: design-ideator-report-[timestamp].md         │
│           (≤2500 tokens target)                        │
│                                                         │
│ [ISSUE: No truncation if exceeds 2500t]                │
│ [ISSUE: If report unclear, no clarification request]   │
│                                                         │
│ Main reads report (NOT full execution) ✓               │
└─────────────────────────────────────────────────────────┘
   ↓

┌─────────────────────────────────────────────────────────┐
│ WIREFRAMES & IMPLEMENTATION                            │
├─────────────────────────────────────────────────────────┤
│ wireframes/*.md ← wireframe generation                 │
│ assets/inventory.md ← asset management (conditional)   │
│ Complete codebase ← TDD implementation ✓               │
│ Test suite ← parallel validation ✓                     │
└─────────────────────────────────────────────────────────┘
   ∥ (parallel)
   ↓

┌─────────────────────────────────────────────────────────┐
│ AGENT HANDOFF: QA (Continuous Parallel)                │
├─────────────────────────────────────────────────────────┤
│ Main ∥ qa-validator agent (isolated context)           │
│   Loop: validate → report → fix → re-validate          │
│   Output: qa-report-[timestamp].md (per cycle)         │
│                                                         │
│ [SMELL: Multiple timestamp reports accumulate]         │
│ [ISSUE: No cleanup strategy]                           │
└─────────────────────────────────────────────────────────┘
   ↓

┌─────────────────────────────────────────────────────────┐
│ AGENT HANDOFF: Documentation                           │
├─────────────────────────────────────────────────────────┤
│ Main → doc-auditor agent (isolated context)            │
│   Creates: CLAUDE.md + /docs/ hierarchy                │
│   Audits: completeness, accuracy, consistency          │
│   Output: doc-audit-report-[timestamp].md              │
│                                                         │
│ [ISSUE: If report unclear, no clarification request]   │
└─────────────────────────────────────────────────────────┘
   ↓

[OUTPUT] Production-Ready Application + Documentation
```

**Data Flow Issues**:
- 🔴 Missing /reports/ directory breaks Phase 1 output
- 🟠 Agent reports have no request-clarification path
- 🟡 Timestamp reports accumulate (no cleanup)
- 🟠 No truncation strategy for oversized agent reports
- 🔵 Conditional MCP invocation logic unclear

---

### Current Progressive Disclosure (With Issues)

```
Level 1: Metadata (30-50 tokens)
   └── YAML frontmatter @ startup ✓

Level 2: Core Instructions (2000-2500 tokens)
   └── SKILL.md body @ relevance trigger ✓

Level 3: Phase Docs (500-1000 tokens each)
   └── @docs/complex/phase-*.md @ phase start
       [SMELL: 7 separate files, could be 3-4]
       [GAP: No depth limit - could cascade infinitely]

Level 4: Templates (200-500 tokens each)
   └── @templates/*.md @ usage
       [SMELL: Some inline, some in files - inconsistent]

Level 5: Agents (isolated context, 100k each)
   └── Reports back: ≤2500 tokens (target)
       [ISSUE: No truncation if exceeded]
       [ISSUE: No clarification mechanism]

[GAP: No maximum depth enforcement]
[RISK: Import chains could cascade infinitely]
```

**Progressive Disclosure Issues**:
- 🔴 No depth limit enforcement (could cascade infinitely)
- 🟡 7 phase docs create unnecessary loading overhead
- 🟡 Template storage inconsistent
- 🟠 No truncation for oversized agent reports
- 🟠 No clarification request mechanism

---

## Part 2: Improved State Architecture (Proposed)

### Enhanced System Component Hierarchy

```
Claude_Code_Intelligence_Toolkit
│
├── Core_Infrastructure
│   │
│   ├── Intelligence_Query_System ✓ (no changes needed)
│   │   ├── project-intel.mjs
│   │   ├── MCP_Servers (5 tools)
│   │   └── Global_Skills (3,316 lines)
│   │
│   ├── Component_System (Skills-First Hierarchy)
│   │   │
│   │   ├── L1_Skills [AUTO-INVOKED]
│   │   │   └── nextjs-project-setup/
│   │   │       ├── SKILL.md ✓
│   │   │       ├── docs/
│   │   │       │   ├── simple-setup.md ✓
│   │   │       │   └── complex/
│   │   │       │       ├── foundation-and-template.md [MERGED: phase-2+3]
│   │   │       │       ├── design-and-wireframes.md [MERGED: phase-4+5]
│   │   │       │       ├── implementation-and-qa.md [MERGED: phase-6+7]
│   │   │       │       └── documentation.md [phase-8]
│   │   │       │       [IMPROVED: 7 → 4 files, 43% reduction]
│   │   │       │
│   │   │       └── templates/ [STANDARDIZED: all templates here]
│   │   │           ├── design-showcase.md ✓
│   │   │           ├── wireframe-template.md ✓
│   │   │           └── claude-md-template.md [NEW: extracted from SKILL.md]
│   │   │
│   │   ├── L2_Commands [USER-INVOKED] ✓
│   │   │   └── /setup-nextjs-project
│   │   │
│   │   └── L3_Agents [DELEGATED, ISOLATED]
│   │       ├── nextjs-design-ideator.md [ENHANCED: with clarification]
│   │       ├── nextjs-qa-validator.md [ENHANCED: with clarification]
│   │       └── nextjs-doc-auditor.md [ENHANCED: with clarification]
│   │       [NEW: Agent Clarification Protocol]
│   │       [NEW: Parallel Coordination Protocol]
│   │
│   ├── Output_Templates ✓
│   │   └── [NEW: Cleanup Strategy - keep last 5 per type]
│   │
│   └── [NEW] Reports Directory
│       └── /reports/ [CREATED]
│           ├── README.md [documents structure]
│           ├── foundation-research.md (generated)
│           └── .gitignore (ignore timestamp reports)
│
└── Workflow_Patterns
    ├── Simple_Path ✓
    │   [ENHANCED: Explicit decision criteria with examples]
    │
    └── Complex_Path
        [IMPROVED: 8 phases with clear triggers]
        [NEW: Rollback procedures for each phase]
        [NEW: Error recovery guidance]
        [NEW: Visual progress indicators]
```

**Improvements Applied**:
- ✅ Created /reports/ directory with documentation
- ✅ Consolidated 7 phase docs → 4 (43% reduction)
- ✅ Standardized all templates to templates/
- ✅ Added agent clarification protocol
- ✅ Added parallel coordination protocol
- ✅ Implemented report cleanup strategy
- ✅ Added rollback procedures

---

### Improved User Flow (Complex Path)

```
[ENTRY] User: "Set up Next.js project"
   ↓
[DECISION] Complexity Assessment [IMPROVED: Explicit criteria]
   │
   │ Decision Tree (Mermaid diagram available):
   │ ┌─────────────────────────────────────────┐
   │ │ Count TRUE indicators:                  │
   │ │ □ Database required                     │
   │ │ □ Custom authentication                 │
   │ │ □ Multi-tenant architecture             │
   │ │ □ E-commerce features                   │
   │ │ □ Complex design system                 │
   │ │ □ Multiple integrations                 │
   │ │                                         │
   │ │ IF count ≤ 1 → SIMPLE PATH              │
   │ │ IF count ≥ 2 → COMPLEX PATH             │
   │ │                                         │
   │ │ [ALWAYS] Ask user to confirm            │
   │ └─────────────────────────────────────────┘
   │
   ↓ (assume COMPLEX confirmed)

┌──────────────────────────────────────────────────────────┐
│ PHASE 1: Foundation Research (30 min)                    │
│ Pattern: Intelligence-First ✓                            │
│ [NEW] Rollback: Delete /reports/foundation-research.md   │
├──────────────────────────────────────────────────────────┤
│ 1. Review global skills (500t)                           │
│ 2. Query MCP tools (300t)                                │
│    [IMPROVED] Conditional logic:                         │
│    - Supabase MCP: IF database_required = true           │
│    - 21st-dev MCP: IF design_complexity = "complex"      │
│ 3. Synthesize context (700t)                             │
│ → OUTPUT: /reports/foundation-research.md                │
│    [FIXED: /reports/ directory now exists]               │
│                                                           │
│ Token savings: 6,500t (81%) ✓                            │
│ [NEW] Progress: [████░░░░] 12.5% (1/8 phases)            │
└──────────────────────────────────────────────────────────┘
   ↓ [NEW: Error recovery documented]
   ↓ IF error → rollback → log issue → user decision

┌──────────────────────────────────────────────────────────┐
│ PHASES 2-3: Foundation & Specification (45 min)          │
│ [IMPROVED: Merged from phase-2 + phase-3]                │
│ [NEW] Rollback: Delete generated docs, keep research     │
├──────────────────────────────────────────────────────────┤
│ PHASE 2: Template Selection (15 min)                     │
│   Load: @docs/complex/foundation-and-template.md         │
│   1. Use Vercel MCP to filter                            │
│   2. Present top 3 with rationale                        │
│   3. User selects                                        │
│   4. Install & verify                                    │
│   → OUTPUT: /docs/template-selection.md                  │
│                                                           │
│ PHASE 3: Specification (30 min)                          │
│   1. Invoke product-skill → product-spec.md              │
│   2. Invoke constitution-skill → constitution.md         │
│   3. Define features → features.md                       │
│   4. Document architecture → architecture.md             │
│                                                           │
│ [NEW] Progress: [████████░] 37.5% (3/8 phases)           │
└──────────────────────────────────────────────────────────┘
   ↓

┌──────────────────────────────────────────────────────────┐
│ PHASES 4-5: Design & Wireframes (1 hour 45 min)          │
│ [IMPROVED: Merged from phase-4 + phase-5]                │
│ [NEW] Rollback: Delete design docs, keep specs           │
├──────────────────────────────────────────────────────────┤
│ PHASE 4: Design System (1 hour)                          │
│   Load: @docs/complex/design-and-wireframes.md           │
│   1. Dispatch agent: nextjs-design-ideator               │
│      [NEW] Agent Enhanced with:                          │
│      - Clarification request mechanism                   │
│      - Token truncation at 2500t with continuation       │
│      → Returns: design-ideator-report-[timestamp].md     │
│      [NEW] IF report unclear:                            │
│         Main agent requests clarification                │
│         Agent provides focused details                   │
│                                                           │
│   2. Create showcase page                                │
│   3. User feedback loop [IMPROVED: max 3 iterations]     │
│   4. Finalize design system                              │
│                                                           │
│ PHASE 5: Wireframes (45 min)                             │
│   1. [IMPROVED] Asset management triggers:               │
│      IF user_provides_images = true → inventory          │
│   2. Generate wireframe options (2-3 per page)           │
│   3. Expert evaluation                                   │
│   4. User feedback loop [IMPROVED: max 3 iterations]     │
│   5. Finalize layouts                                    │
│                                                           │
│ [NEW] Progress: [████████████░] 62.5% (5/8 phases)       │
└──────────────────────────────────────────────────────────┘
   ↓

┌──────────────────────────────────────────────────────────┐
│ PHASES 6-7: Implementation & QA (2-3 hours) ∥ PARALLEL   │
│ [IMPROVED: Merged coordination]                          │
│ [NEW] Rollback: git reset --hard (before impl start)     │
├──────────────────────────────────────────────────────────┤
│ Load: @docs/complex/implementation-and-qa.md             │
│                                                           │
│ PHASE 6: Implementation (2-3 hours)                      │
│   FOR EACH feature:                                      │
│     1. Write tests FIRST (TDD) ✓                         │
│     2. Implement code                                    │
│     3. Install Shadcn components                         │
│     4. Visual validation                                 │
│                                                           │
│   [NEW] Parallel Coordination Protocol:                 │
│   - Feature dependency graph analyzed                    │
│   - Independent features run in parallel                 │
│   - Dependent features wait for prerequisites            │
│   - Conflict detection: file-level locking               │
│   - Coordination: shared state in /tmp/parallel-state    │
│                                                           │
│   [IMPROVED] Database setup triggers:                    │
│   IF database_required = true:                           │
│     - Use Supabase MCP (not CLI) ✓                       │
│     - Schema → RLS → Edge Functions                      │
│                                                           │
│ PHASE 7: QA (Continuous Parallel)                        │
│   Agent: nextjs-qa-validator                             │
│     [NEW] Enhanced with clarification protocol           │
│     - Validates critical checklist                       │
│     - Reports issues with recovery guidance              │
│     - [NEW] Requests clarification if needed             │
│     - Blocks completion until all pass                   │
│     → OUTPUT: qa-report-[timestamp].md                   │
│       [NEW] Cleanup: Keep last 5, delete older           │
│                                                           │
│ [NEW] Progress: [██████████████████] 87.5% (7/8 phases)  │
└──────────────────────────────────────────────────────────┘
   ↓

┌──────────────────────────────────────────────────────────┐
│ PHASE 8: Documentation (30 min)                          │
│ [NEW] Rollback: Restore previous CLAUDE.md backup        │
├──────────────────────────────────────────────────────────┤
│ Load: @docs/complex/documentation.md                     │
│                                                           │
│ Agent: nextjs-doc-auditor                                │
│   [NEW] Enhanced with clarification protocol             │
│   - Creates CLAUDE.md (use @templates/claude-md-template)│
│   - Creates /docs/ hierarchy                             │
│   - Audits completeness, accuracy, consistency           │
│   - [NEW] Requests clarification if needed               │
│   - Cleans repository                                    │
│   → OUTPUT: doc-audit-report-[timestamp].md              │
│     [NEW] Cleanup: Keep last 5, delete older             │
│                                                           │
│ [NEW] Progress: [████████████████████] 100% COMPLETE     │
└──────────────────────────────────────────────────────────┘
   ↓

[SUCCESS] Production-Ready Next.js Application
   [NEW] All phases have documented rollback procedures
   [NEW] All error paths documented with recovery guidance
```

**Flow Improvements**:
- ✅ Explicit complexity decision criteria with visual tree
- ✅ All conditional logic documented with triggers
- ✅ Rollback procedures for every phase
- ✅ Error recovery paths documented
- ✅ Visual progress indicators (████░)
- ✅ Agent clarification protocol integrated
- ✅ Parallel coordination protocol defined
- ✅ Feedback loop max iterations explicit (max 3)
- ✅ Report cleanup strategy (keep last 5)

---

### Improved Progressive Disclosure (With Guards)

```
Level 1: Metadata (30-50 tokens)
   └── YAML frontmatter @ startup ✓

Level 2: Core Instructions (2000-2500 tokens)
   └── SKILL.md body @ relevance trigger ✓

Level 3: Phase Docs (500-1000 tokens each)
   └── @docs/complex/*.md @ phase start
       [IMPROVED: 7 → 4 files, 43% reduction]
       ├── foundation-and-template.md (phases 2-3 merged)
       ├── design-and-wireframes.md (phases 4-5 merged)
       ├── implementation-and-qa.md (phases 6-7 merged)
       └── documentation.md (phase 8)

Level 4: Templates (200-500 tokens each)
   └── @templates/*.md @ usage
       [IMPROVED: All standardized to templates/ directory]
       ├── design-showcase.md
       ├── wireframe-template.md
       └── claude-md-template.md [NEW: extracted]

Level 5: Agents (isolated context, 100k each)
   └── Reports back: ≤2500 tokens (enforced)
       [NEW] Truncation with continuation mechanism:
       - IF report > 2500t → truncate + add "[TRUNCATED]"
       - Main agent can request "[CONTINUE]" for more
       [NEW] Clarification protocol:
       - Main agent: "[CLARIFY: specific question]"
       - Agent: focused response (≤1000t)

[NEW] Maximum Depth Enforcement: 5 levels
   - @ import chains tracked
   - Level 6+ attempts blocked with error message
   - Prevents infinite cascading

[NEW] Progressive Loading Budget Documented:
   - Level 1: 30-50t (always)
   - Level 2: 2000-2500t (on trigger)
   - Level 3: 500-1000t per doc (4 max = 4000t)
   - Level 4: 200-500t per template (5 max = 2500t)
   - Level 5: 2500t per agent report (3 agents = 7500t)
   - Total Budget: ~16,500t (vs potential infinite)
```

**Progressive Disclosure Improvements**:
- ✅ Maximum depth limit enforced (5 levels)
- ✅ Phase docs consolidated (7 → 4, 43% reduction)
- ✅ Template storage standardized (all in templates/)
- ✅ Agent report truncation with continuation
- ✅ Clarification protocol for agents
- ✅ Progressive loading budget documented (~16,500t max)

---

## Part 3: Issues → Improvements Mapping

### Critical Gaps (🔴) → Solutions

| Gap | Impact | Solution | Status |
|-----|--------|----------|--------|
| Missing /reports/ directory | BLOCKS Phase 1 execution | Create /reports/ with README.md | ✅ Phase A |
| No rollback procedures | Data loss on failure | Add rollback for all 8 phases | ✅ Phase A |
| No import depth limit | Infinite token cascade risk | Enforce max 5-level depth | ✅ Phase E |

---

### Major Issues (🟠) → Solutions

| Issue | Impact | Solution | Status |
|-------|--------|----------|--------|
| No agent clarification | Insufficient reports block progress | Add clarification protocol | ✅ Phase C |
| No parallel coordination | Feature conflicts, data corruption | Add coordination protocol | ✅ Phase C |
| No agent token truncation | Agent reports can bloat context | Truncate at 2500t + continuation | ✅ Phase E |

---

### Code Smells (🟡) → Solutions

| Smell | Impact | Solution | Status |
|-------|--------|----------|--------|
| 7 phase docs | Unnecessary loading overhead | Consolidate to 4 major phases | ✅ Phase D |
| Inconsistent template storage | Confusion, hard to maintain | Standardize all to templates/ | ✅ Phase D |
| No report cleanup | Accumulation, repo bloat | Keep last 5 per type, delete old | ✅ Phase E |

---

### Clarity Issues (🔵) → Solutions

| Issue | Impact | Solution | Status |
|-------|--------|----------|--------|
| Vague decision criteria | Wrong path chosen | Add explicit decision tree (Mermaid) | ✅ Phase B |
| Optional agent logic unclear | Unnecessary tool invocations | Document "when to use/skip" logic | ✅ Phase B |
| Database triggers vague | Confusion about setup | Document explicit triggers | ✅ Phase B |
| Feedback iteration limits | Infinite loops possible | Set explicit max 3 iterations | ✅ Phase E |
| Anti-pattern rationale missing | Don't understand "why" | Add rationale for each anti-pattern | ✅ Phase D |

---

## Part 4: Implementation Plan

### Iteration 1: Focused Refactor (3 Days)

#### Phase A: Critical Infrastructure (Day 1 AM - 2 hours)

**Deliverables**:
1. Create `/reports/` directory structure:
   ```
   /reports/
   ├── README.md (documents purpose, structure, cleanup)
   └── .gitignore (ignore foundation-research.md)
   ```

2. Add rollback procedures to SKILL.md for all 8 phases:
   - Phase 1: Delete /reports/foundation-research.md
   - Phase 2-3: Delete generated docs, keep research
   - Phase 4-5: Delete design docs, keep specs
   - Phase 6-7: git reset --hard (checkpoint before impl)
   - Phase 8: Restore CLAUDE.md backup

3. Implement import depth guards (pseudo-code in SKILL.md):
   ```
   Progressive_Disclosure := {
     max_depth: 5,
     track_chain: [file1 → file2 → ... → fileN],
     enforce: IF depth > 5 THEN error("Max depth exceeded")
   }
   ```

4. Document agent clarification mechanism (protocol spec):
   ```
   Clarification_Protocol := {
     request: "[CLARIFY: specific question]",
     response: "focused answer (≤1000t)",
     continuation: "[CONTINUE]" for truncated reports
   }
   ```

**Tests**:
- [ ] /reports/ directory exists with README.md
- [ ] Simple path completes without missing directory error
- [ ] Phase 1 creates /reports/foundation-research.md successfully
- [ ] Rollback procedures documented for all 8 phases

---

#### Phase B: Flow Clarity (Day 1 PM - 3 hours)

**Deliverables**:
1. Create decision tree diagram (Mermaid + ASCII):
   - File: docs/decision-trees/complexity-assessment.md
   - Visual Mermaid diagram (for humans)
   - ASCII diagram (for AI parsing)
   - Explicit criteria with examples

2. Add "when to use" logic for optional components:
   - Supabase MCP: `IF database_required = true`
   - 21st-dev MCP: `IF design_complexity = "complex"`
   - Asset management: `IF user_provides_images = true`

3. Document database setup decision criteria:
   ```
   Database_Setup_Triggers := {
     required: database_required = true (from complexity assessment),
     patterns: {
       single_tenant: basic RLS,
       multi_tenant: tenant_id in all tables + advanced RLS,
       e_commerce: inventory + orders + payments tables
     }
   }
   ```

4. Add visual progress indicators to SKILL.md:
   ```
   [████░░░░] 12.5% (1/8 phases)
   [████████░] 37.5% (3/8 phases)
   ... etc for all 8 phases
   ```

**Tests**:
- [ ] AI agent correctly identifies simple vs complex based on criteria
- [ ] Decision tree renders correctly (Mermaid)
- [ ] Optional component logic is unambiguous
- [ ] Progress indicators display correctly

---

#### Phase C: Agent Coordination (Day 2 AM - 4 hours)

**Deliverables**:
1. Design agent clarification protocol (add to agents/*.md):
   ```markdown
   ## Clarification Protocol

   **When Main Agent Needs More Info**:
   Request: "[CLARIFY: specific question]"
   Response: Focused answer (≤1000 tokens)

   **When Report Truncated**:
   Request: "[CONTINUE]"
   Response: Next segment (≤1000 tokens)

   **Format**:
   - One question at a time
   - Specific, not open-ended
   - Agent responds within 1 turn
   ```

2. Document parallel execution coordination:
   ```markdown
   ## Parallel Coordination Protocol

   **Feature Dependency Analysis**:
   - Parse features.md for dependencies
   - Build dependency graph
   - Identify independent clusters

   **Execution Strategy**:
   - Independent features → parallel
   - Dependent features → sequential (wait for prerequisites)

   **Conflict Detection**:
   - File-level locking: /tmp/parallel-state/locks/[file]
   - Before editing file X: check lock, acquire if free
   - After editing: release lock

   **State Coordination**:
   - Shared state: /tmp/parallel-state/status.json
   - Format: {"feature_id": "status", ...}
   - Statuses: "pending" | "in_progress" | "complete" | "failed"
   ```

3. Implement handoff validation:
   - Main agent validates agent output format
   - Checks: report ≤ 2500t, required sections present
   - IF validation fails → request clarification

4. Update all 3 agent files with protocols:
   - nextjs-design-ideator.md
   - nextjs-qa-validator.md
   - nextjs-doc-auditor.md

**Tests**:
- [ ] Agent clarification request/response works
- [ ] Parallel features coordinate without file conflicts
- [ ] Dependent features wait for prerequisites
- [ ] Handoff validation catches malformed reports

---

#### Phase D: Documentation Consolidation (Day 2 PM - 3 hours)

**Deliverables**:
1. Merge phase docs:
   - **foundation-and-template.md** ← phase-2-template.md + phase-3-spec.md
   - **design-and-wireframes.md** ← phase-4-design.md + phase-5-wireframes.md
   - **implementation-and-qa.md** ← phase-6-implement.md + phase-7-qa.md
   - **documentation.md** ← phase-8-docs.md (rename)
   - Delete old files: phase-2 through phase-8 (7 files)

2. Standardize template locations:
   - Move CLAUDE.md template from SKILL.md:503-544 to templates/claude-md-template.md
   - Verify all templates in templates/ directory
   - Update @ references in SKILL.md

3. Add anti-pattern rationale:
   ```markdown
   ## Anti-Patterns (With Rationale)

   ❌ Using Supabase CLI instead of MCP
   **Why**: MCP provides better error handling, type safety, and integration with Claude Code workflows

   ❌ Skipping Shadcn Example step
   **Why**: Examples show real-world usage patterns and catch integration issues early

   [... etc for all anti-patterns]
   ```

4. Implement report cleanup strategy:
   - Add to SKILL.md or agents/:
   ```markdown
   ## Report Cleanup Strategy

   **Keep**: Last 5 reports per type
   **Delete**: Older reports automatically

   **Implementation**:
   ```bash
   # In agent completion, run cleanup
   cleanup_reports() {
     cd reports/
     ls -t [type]-*.md | tail -n +6 | xargs rm -f
   }
   ```
   ```

**Tests**:
- [ ] Phase docs consolidated (4 files instead of 7)
- [ ] No broken @ references after consolidation
- [ ] All templates in templates/ directory
- [ ] Anti-patterns have clear rationale
- [ ] Report cleanup strategy documented

---

#### Phase E: Progressive Disclosure Guards (Day 3 AM - 2 hours)

**Deliverables**:
1. Implement 5-level depth limit:
   - Add to SKILL.md progressive disclosure section:
   ```markdown
   ## Import Depth Enforcement

   **Maximum Depth**: 5 levels

   **Tracking**:
   - Import chain: [SKILL.md → phase-doc → template → ...]
   - Count depth on each @ reference

   **Enforcement**:
   ```
   IF depth > 5:
     ERROR: "Maximum import depth (5) exceeded. Import chain: [chain]"
     BLOCK: Do not load Level 6+
   ```
   ```

2. Add agent token truncation:
   - Update agent templates:
   ```markdown
   ## Token Budget Enforcement

   **Target**: ≤2500 tokens

   **Truncation**:
   - IF report > 2500t:
     - Truncate at 2500t
     - Add marker: "[TRUNCATED - Request [CONTINUE] for more]"

   **Continuation**:
   - Main agent: "[CONTINUE]"
   - Agent: Next 1000t segment
   ```

3. Set feedback loop max iterations:
   - Update SKILL.md Phase 4 & 5:
   ```markdown
   **User Feedback Loop**:
   - Present options to user
   - Gather feedback
   - Iterate (max 3 iterations)
   - IF iteration_count = 3 AND not approved:
       - Document concerns
       - Proceed with best available option
       - Note in report for future improvement
   ```

4. Document progressive loading budget:
   - Add to SKILL.md:
   ```markdown
   ## Progressive Loading Budget

   Total Maximum: ~16,500 tokens

   Breakdown:
   - Level 1 (Metadata): 30-50t
   - Level 2 (SKILL.md): 2000-2500t
   - Level 3 (Phase docs): 4 × 1000t = 4000t
   - Level 4 (Templates): 5 × 500t = 2500t
   - Level 5 (Agent reports): 3 × 2500t = 7500t

   Safety margin: ~3500t for user context
   ```

**Tests**:
- [ ] Import chains blocked at depth 6+
- [ ] Agent reports truncate at 2500t with continuation marker
- [ ] Feedback loops terminate after 3 iterations
- [ ] Progressive loading budget documented

---

#### Phase F: End-to-End Validation (Day 3 PM - 3 hours)

**Deliverables**:
1. Test complete simple path:
   - Run nextjs-project-setup skill with simple indicators
   - Verify: Template → Setup → Components → Design → Docs
   - Document: Any errors, token usage, time taken

2. Test complete complex path:
   - Run nextjs-project-setup skill with complex indicators
   - Verify: All 8 phases execute successfully
   - Test: Rollback from Phase 4 (design system)
   - Document: Errors, token usage, time, rollback success

3. Verify all 16 success metrics:
   - UX Metrics (4): Check all ✓
   - DX Metrics (4): Check all ✓
   - AI Agent Metrics (4): Check all ✓
   - Token Efficiency Metrics (4): Check all ✓

4. Measure token usage:
   - Baseline (current): Estimate from prior runs
   - After improvements: Measure actual
   - Calculate: Savings percentage
   - Compare: Against 6,500t Phase 1 savings

5. Document findings:
   - File: ITERATION-1-VALIDATION-REPORT.md
   - Sections:
     - What worked well
     - What didn't work
     - Unexpected issues
     - Token usage analysis
     - Recommendations for Iteration 2

6. Reassess and reprioritize:
   - Review remaining issues
   - Identify new issues discovered during testing
   - Rank by ROI (impact / effort)
   - Create Iteration 2 plan

**Tests**:
- [ ] Simple path: 100% success rate
- [ ] Complex path: 100% success rate
- [ ] Rollback: Works from any phase
- [ ] All 16 metrics: PASS
- [ ] Token usage: Measured and documented
- [ ] Iteration 2 plan: Created

---

## Part 5: Success Metrics (16 Criteria)

### UX Metrics (4)

| Metric | Current | Target | Test |
|--------|---------|--------|------|
| Simple path completes | ❌ Missing /reports/ | ✅ No errors | Run simple path test |
| Complex decision clear | 🟡 Vague criteria | ✅ Explicit tree | AI agent chooses correctly |
| No missing files | ❌ /reports/ missing | ✅ All exist | Check all referenced paths |
| Progress indicators | ❌ None | ✅ Visual bars | Display [████░] at each phase |

---

### DX Metrics (4)

| Metric | Current | Target | Test |
|--------|---------|--------|------|
| Documentation rationale | 🟡 Some missing | ✅ All anti-patterns explained | Review anti-patterns section |
| Template consistency | 🟡 Mixed locations | ✅ All in templates/ | Check all @ references |
| Phase docs consolidated | 🟡 7 separate files | ✅ 4 merged files | Count files in docs/complex/ |
| No broken references | ✅ Currently OK | ✅ Still OK | Validate all @ imports |

---

### AI Agent Metrics (4)

| Metric | Current | Target | Test |
|--------|---------|--------|------|
| Follows flows | 🟡 Some confusion | ✅ No confusion | AI agent test runs |
| Requests clarification | ❌ No mechanism | ✅ Protocol works | Agent-to-agent test |
| Coordinates parallel | 🟡 No protocol | ✅ No conflicts | Parallel feature test |
| Respects token limits | 🟡 No enforcement | ✅ Enforced ≤2500t | Agent report validation |

---

### Token Efficiency Metrics (4)

| Metric | Current | Target | Test |
|--------|---------|--------|------|
| Import depth limited | ❌ No limit | ✅ Max 5 levels | Test Level 6 attempt |
| Agent reports sized | 🟡 Target 2500t | ✅ Enforced 2500t | Measure all agent reports |
| Loading budget documented | ❌ Not documented | ✅ ~16,500t documented | Review documentation |
| Cleanup strategy | ❌ No cleanup | ✅ Keep last 5 | Check report accumulation |

---

## Part 6: Iteration 2 Preview (Provisional)

**Based on Iteration 1 findings, likely priorities**:

1. **Further Token Optimization**
   - Analyze actual token usage from validation
   - Identify new optimization opportunities
   - Implement compression where beneficial

2. **Visual Diagrams for Remaining Phases**
   - Create Mermaid diagrams for Phases 3-8
   - Add ASCII alternatives for AI parsing
   - Document diagram conventions

3. **Automated Testing**
   - Create test suite for workflow validation
   - Add regression tests for each phase
   - Implement continuous testing

4. **Example Projects**
   - Create before/after example projects
   - Document common patterns
   - Provide reference implementations

5. **Enhanced Error Messages**
   - Add recovery guidance to all errors
   - Create error catalog with solutions
   - Implement helpful suggestions

**Reassessment Trigger**: Complete Phase F validation of Iteration 1

---

## Summary: Current → Improved Comparison

| Aspect | Current State | Improved State | Improvement |
|--------|---------------|----------------|-------------|
| **Infrastructure** | Missing /reports/, no rollback | /reports/ exists, rollback for all phases | 🔴→✅ |
| **User Flows** | Vague decision criteria | Explicit decision tree + visual progress | 🔵→✅ |
| **Agent Coordination** | No clarification, no parallel protocol | Both protocols implemented | 🟠→✅ |
| **Documentation** | 7 phase docs, inconsistent templates | 4 merged docs, standardized templates | 🟡→✅ |
| **Token Efficiency** | No depth limit, no truncation | 5-level max, 2500t enforcement | 🔴→✅ |
| **Progressive Disclosure** | Potential infinite cascade | Controlled budget ~16,500t max | 🔴→✅ |
| **Error Handling** | Happy path only | Rollback + recovery for all phases | 🔴→✅ |
| **Clarity** | Multiple vague conditionals | All triggers documented explicitly | 🔵→✅ |

**Overall**: 9 major issues resolved, 3-day focused refactor, iterative improvement built-in

---

**END OF SYSTEM IMPROVEMENT PLAN**