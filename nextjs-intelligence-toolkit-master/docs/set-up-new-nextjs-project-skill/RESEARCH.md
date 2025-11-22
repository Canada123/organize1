# Research Report: Next.js Project Setup Skill

## Executive Summary

This research consolidates best practices for creating a Claude Code skill that automates Next.js project setup. Key findings:

1. **Skills use auto-discovery** via description matching - no manual invocation needed
2. **Sub-agents provide isolated contexts** for parallel execution and token efficiency
3. **Slash commands are composable units** that skills can orchestrate
4. **MCP tools** (Vercel, Shadcn, Supabase) provide external integrations
5. **Progressive disclosure** and **CoD^Σ notation** optimize token usage
6. **TDD for documentation** ensures skill quality through pressure testing

---

## 1. Claude Code Skill Structure

### File Structure Requirements

```
skill-name/
├── SKILL.md           # Required: YAML frontmatter + instructions
├── /docs/             # Optional: reference documentation
│   ├── setup-guide.md
│   ├── design-process.md
│   └── testing-guide.md
├── /templates/        # Optional: reusable templates
│   ├── wireframe-template.md
│   └── spec-template.md
└── /scripts/          # Optional: executable helpers
    └── setup-env.sh
```

### SKILL.md Format

```yaml
---
name: nextjs-project-setup
description: Comprehensive Next.js project setup following best practices. Use when creating new Next.js projects from scratch, including template selection, design system ideation, specifications, wireframes, implementation, and QA.
allowed-tools: Bash, Read, Write, Edit, mcp__vercel__*, mcp__shadcn__*, mcp__supabase__*
---

# Next.js Project Setup

## Overview
[Detailed description of capabilities]

## When to Use
- Creating a new Next.js project from scratch
- Need template selection guidance
- Require design system ideation
- Want structured specification process

## Workflow
[Step-by-step instructions]

## REQUIRED SUB-SKILLS
- Use product-specification-skill for product specs
- Use design-system-skill for design ideation

## References
See @docs/setup-guide.md for detailed setup process
See @docs/design-process.md for design system workflow
```

### Key Principles

1. **Auto-discovery**: Description field determines when skill triggers
2. **Progressive loading**: Metadata → Instructions → Resources (on demand)
3. **Composability**: Reference other skills with "Use skill-name" pattern
4. **Tool restrictions**: Limit allowed-tools for security and focus
5. **No project-specific content**: Skills are reusable, CLAUDE.md is project-specific

---

## 2. Sub-Agent Orchestration

### Sub-Agent Characteristics

| Aspect | Details |
|--------|---------|
| **Context** | Isolated, fresh context window |
| **Purpose** | Task isolation, parallel execution |
| **Configuration** | Markdown file with YAML frontmatter |
| **Discovery** | Description-based automatic delegation |
| **Location** | `.claude/agents/` (project) or `~/.claude/agents/` (user) |

### Sub-Agent File Format

```markdown
---
name: research-vercel-templates
description: Research Vercel templates and provide recommendations. Use proactively when selecting Next.js templates.
tools: Bash, Read, mcp__vercel__*
model: sonnet
---

You are a Next.js template research specialist.

When invoked:
1. Use Vercel MCP to search available templates
2. Analyze template features and use cases
3. Match templates to user requirements
4. Provide ranked recommendations with rationale
5. Output concise report to /reports/template-research.md

Report format:
- Top 3 recommendations
- Feature comparison matrix
- Setup requirements for each
- Recommendation rationale
```

### Parallel Execution Pattern

```
Orchestrator (Main Agent)
  ↓
Dispatch simultaneously:
  ├─→ Research_Agent_1 [Vercel templates] → /reports/vercel.md
  ├─→ Research_Agent_2 [Shadcn patterns] → /reports/shadcn.md
  ├─→ Research_Agent_3 [Supabase setup] → /reports/supabase.md
  └─→ Research_Agent_4 [Design systems] → /reports/design.md
  ↓
All agents complete
  ↓
Orchestrator reads all reports → synthesizes → next phase
```

### Token Efficiency Benefits
- Sub-agents don't contaminate main context
- Each agent writes concise report (target: 1500-2500 tokens)
- Main agent reads only final reports, not full research process
- No duplicate information gathering

---

## 3. Slash Commands as Composable Units

### Command Structure

```markdown
---
argument-hint: [phase-name] [additional-context]
description: Execute a specific phase of the Next.js setup workflow
allowed-tools: Bash, Read, Write, mcp__*__*
---

Execute phase: $1
Additional context: $2

@docs/$1-phase.md

Follow the phase-specific instructions above.
```

### Usage in Skills

Skills can orchestrate commands:

```markdown
## Phase 2: Design System Ideation

Use /design-ideation to:
1. Brainstorm color palettes
2. Generate component showcases
3. Iterate with user feedback

The command will load @docs/design-ideation.md automatically.
```

### Composability Pattern

```
Skill (SKILL.md)
  ├─→ References: @docs/phase1.md
  ├─→ Dispatches: /setup-phase1
  │     └─→ Loads: @docs/phase1.md
  │     └─→ Uses: Sub-agent (template-researcher)
  └─→ Continues to next phase
```

---

## 4. MCP Tool Integration

### Vercel MCP

**Purpose**: Template discovery and deployment

**Key Tools**:
- `mcp__vercel__list_templates` - List available templates
- `mcp__vercel__get_template_info` - Get template details
- `mcp__vercel__deploy` - Deploy to Vercel

**Usage Pattern**:
```
1. Search templates by category/feature
2. Filter by: database, auth, multi-tenant, e-commerce
3. Compare template features
4. Select best match
5. Install template: npx create-next-app --example <template>
```

### Shadcn MCP

**Purpose**: Component discovery and installation

**Key Tools** (CoD^Σ):
```
Tools := {
  search: mcp__shadcn__search_items_in_registries(R[], query),
  view: mcp__shadcn__view_items_in_registries(items[]),
  example: mcp__shadcn__get_item_examples_from_registries(R[], pattern),
  install: mcp__shadcn__get_add_command_for_items(items[])
}

Registries := {
  @ui: {url: ui.shadcn.com, type: Core},
  @magicui: {url: magicui.design/r, type: Animated},
  @elevenlabs: {url: ui.elevenlabs.io/r, type: Audio}
}

Workflow := Search → View → Example → Install
```

**Critical Rules**:
1. ALWAYS follow Search → View → Example → Install sequence
2. NEVER skip Example step
3. Prioritize @ui for core components
4. Use @magicui sparingly for animations (≤300ms, prefers-reduced-motion)
5. Use global Tailwind CSS variables (never hardcoded colors)

### Supabase MCP

**Purpose**: Database and auth setup

**Key Tools**:
- `mcp__supabase__create_table`
- `mcp__supabase__add_rls_policy`
- `mcp__supabase__setup_auth`

**Critical Rules**:
1. **NEVER use Supabase CLI** - always use MCP tools
2. Start with staging environment
3. Define strict schema requirements first
4. Implement RLS (Row Level Security) policies
5. Follow template auth patterns for multi-tenant
6. Use server actions and edge functions (not client-side queries)

---

## 5. Token Optimization Strategies

### Progressive Disclosure Architecture

```
Level 1: Metadata (always loaded)
  - Skill names & descriptions (~100 tokens each)
  - Command names & descriptions
  - Available MCP tools

Level 2: Instructions (loaded on demand)
  - Full SKILL.md when skill triggers
  - Full command content when invoked
  - Sub-agent instructions when dispatched

Level 3: Resources (loaded on reference)
  - @docs/*.md when referenced
  - scripts/ when executed (only output loaded)
  - templates/ when needed
```

### CoD^Σ for Compression

Use mathematical notation for specifications:

```
NextJS_Setup := {
  Template ∈ Vercel_Templates,
  Design ⊂ {Colors, Typography, Components},
  Spec ⇒ {Product, Constitution, Features},
  QA ⇐ Implementation ∧ Tests
}

Workflow:
  Template → Spec → Design → Wireframes → Implementation → QA
  
Parallel:
  Research := {Vercel, Shadcn, Supabase, Design} ∥
  Implementation := {Components, Pages, Routes, DB} ∥
  
Token_Target:
  ∀report: tokens ≤ 2500
  ∀doc: focus ⊂ single_domain
  main_context ⊥ sub_agent_contexts
```

### Report-Based Workflow

**Problem**: Multiple agents researching same information

**Solution**:
1. Dispatch research agents in parallel
2. Each writes concise report to /reports/
3. Main agent reads reports only (not full research)
4. Specialized agents read relevant reports
5. No duplicate research

**Report Template**:
```markdown
# [Topic] Research Report

## Summary (1-2 sentences)
[Key finding or recommendation]

## Key Findings (3-5 bullet points)
- Finding 1
- Finding 2
- Finding 3

## Recommendations
[Specific, actionable recommendations]

## Additional Context (if needed)
[Details that support findings]

## References
- [Source 1]
- [Source 2]
```

---

## 6. TDD for Documentation (Skills)

### Core Principle

> "If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing."

### Process: RED-GREEN-REFACTOR

**RED Phase**: Baseline testing
1. Create pressure scenarios
2. Run WITHOUT skill
3. Document exact rationalizations (verbatim)
4. Identify violation patterns

**GREEN Phase**: Minimal skill
1. Write minimal skill addressing violations
2. Add explicit counters to rationalizations
3. Re-test with skill
4. Verify agents now comply

**REFACTOR Phase**: Close loopholes
1. Find new rationalizations
2. Add to rationalization table
3. Build red flags list
4. Iterate until bulletproof

### Pressure Testing Techniques

**Discipline Skills**: Combine pressures:
- Time: "it's urgent, just do it quickly"
- Sunk cost: "I already wrote the code without tests"
- Authority: "I'm the expert, trust me"
- Exhaustion: "just this once, we'll add tests later"

**Example Rationalization Table**:

| Excuse | Reality | Counter |
|--------|---------|---------|
| "It's obvious" | Obvious code breaks | Test takes 30 sec |
| "Too simple" | Simple code has bugs | Simpler = easier to test |
| "I'll test later" | Later never comes | TDD is faster overall |
| "Just this once" | Once becomes always | No exceptions allowed |

---

## 7. Documentation Structure

### Project Documentation Hierarchy

```
project-root/
├── CLAUDE.md                 # Main project context (always loaded)
│   ├── Overview
│   ├── Tree structure
│   ├── @docs/skills-usage.md
│   ├── @docs/mcp-tools.md
│   └── @docs/anti-patterns.md
├── /docs/
│   ├── architecture.md       # System architecture
│   ├── design-system.md      # Design tokens, patterns
│   ├── database-schema.md    # DB structure, RLS
│   ├── skills-usage.md       # Which skills when
│   ├── mcp-tools.md          # MCP tool usage
│   └── anti-patterns.md      # What to avoid
├── /components/
│   └── CLAUDE.md             # Component conventions
├── /app/
│   └── CLAUDE.md             # Route conventions
└── /lib/
    └── CLAUDE.md             # Utility conventions
```

### CLAUDE.md Best Practices

```markdown
# Project: [Name]

## Overview
[2-3 sentence description]

## Project Structure
@[tree structure output]

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + Shadcn UI
- Supabase (DB + Auth)
- [Other key tech]

## Development Workflow

### Skills to Use
- `nextjs-project-setup` - Initial setup
- `design-system` - Design tokens
- `test-driven-development` - TDD workflow

### Slash Commands
- `/setup-phase [phase-name]` - Execute setup phase
- `/review-design` - Review design system
- `/audit-docs` - Check documentation

### MCP Tools
- Vercel: Template selection, deployment
- Shadcn: Component management (@ui, @magicui)
- Supabase: DB operations, auth setup

## Conventions
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA)
- Server actions for data mutations
- Edge functions for API routes
- Global Tailwind CSS (no inline custom)

## Anti-Patterns
- ❌ Using Supabase CLI instead of MCP
- ❌ Skipping Shadcn Example step
- ❌ Hardcoding colors instead of CSS variables
- ❌ Client-side Supabase queries
- ❌ Writing code before tests

## References
- Design system: @docs/design-system.md
- Database schema: @docs/database-schema.md
- Architecture: @docs/architecture.md
```

---

## 8. Best Practices Summary

### Skill Creation
✅ Use descriptive, trigger-focused descriptions
✅ Follow TDD for docs (RED-GREEN-REFACTOR)
✅ Keep skills reusable (no project-specific content)
✅ Use progressive disclosure (@references)
✅ Limit allowed-tools appropriately
✅ Include REQUIRED SUB-SKILL references
✅ Provide clear examples in docs/

### Sub-Agent Usage
✅ Dispatch for isolated tasks
✅ Use for parallel execution
✅ Keep contexts independent
✅ Write concise reports (≤2500 tokens)
✅ Clear handover protocols
✅ Specific, action-oriented descriptions

### MCP Tool Integration
✅ Follow tool-specific workflows (e.g., Shadcn: Search → View → Example → Install)
✅ Use MCP tools over CLI commands
✅ Respect tool constraints (e.g., Shadcn registries)
✅ Integrate into skill workflows
✅ Document MCP usage patterns

### Token Efficiency
✅ Use CoD^Σ notation for compression
✅ Progressive disclosure architecture
✅ Report-based sub-agent workflow
✅ Avoid duplicate research
✅ Target: reports ≤2500 tokens, docs ≤3000 tokens
✅ @reference pattern instead of force-loading

### Quality Assurance
✅ TDD approach (tests before implementation)
✅ Visual validation of all pages
✅ Verify interactions, animations, links
✅ Use sub-agents for parallel QA
✅ Regular documentation audits
✅ Clean repository maintenance

---

## 9. Implementation Strategy

### Phase-Based Approach

**Phase 1: Research (Parallel Sub-Agents)**
- Vercel templates
- Shadcn best practices
- Supabase patterns
- Design systems
- Next.js conventions

**Phase 2: Skill Structure**
- Create SKILL.md with proper frontmatter
- Define /docs/ structure
- Create /templates/
- Define /scripts/ if needed

**Phase 3: Slash Commands**
- Create composable commands for each phase
- Define argument patterns
- Link to phase docs

**Phase 4: Sub-Agent Definitions**
- Research agents
- Design agents
- Implementation agents
- QA agents
- Documentation agents

**Phase 5: Documentation**
- Phase-specific docs
- Reference materials
- Examples and templates
- Anti-patterns guide

**Phase 6: Testing**
- RED: Run without skill
- GREEN: Add minimal skill
- REFACTOR: Close loopholes
- Pressure test with time, authority, exhaustion

---

## 10. Key Insights

1. **Skills auto-trigger** - No need to explicitly invoke, description determines activation
2. **Sub-agents save tokens** - Isolated contexts prevent bloat, parallel execution increases speed
3. **Slash commands are units** - Skills orchestrate commands, commands load specific docs
4. **MCP tools have workflows** - Follow tool-specific patterns (e.g., Shadcn Search→View→Example→Install)
5. **Progressive disclosure saves tokens** - Load only what's needed when needed
6. **CoD^Σ compresses notation** - Use mathematical symbols for dense, efficient specifications
7. **TDD for docs works** - Pressure test skills like code, close rationalization loopholes
8. **Reports enable parallelization** - Sub-agents write reports, main agent synthesizes without duplicate research
9. **CLAUDE.md is always loaded** - Use for project-specific context, keep skills reusable
10. **Visual review is critical** - Every page must be validated before marking complete

---

## References

- Claude Code Skills Documentation: /mnt/project/claude-code_skills.md
- Orchestration System: /mnt/project/01-orchestration-system.md
- Skills Overview: /mnt/project/02-skills-overview.md
- Sub-Agents Guide: /mnt/project/claude-code_subagents.md
- Shadcn MCP Protocol: /mnt/project/shadcn-mcp-usage-protocol.md
- CoD Sigma: /mnt/project/CoD_Σ.md
- Prompt Engineering: /mnt/project/prompt-engineering-complete-guide.md
