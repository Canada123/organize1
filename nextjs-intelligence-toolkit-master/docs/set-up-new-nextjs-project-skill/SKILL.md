---
name: nextjs-project-setup
description: Comprehensive Next.js project setup from scratch following industry best practices. Use when creating new Next.js projects, requiring template selection, design system ideation, specifications, wireframes, implementation with TDD, QA validation, and complete documentation. Handles both simple quick-start and complex multi-phase projects with sub-agent orchestration.
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, mcp__vercel__*, mcp__shadcn__*, mcp__supabase__*, mcp__21st_dev__*, mcp__firecrawl__*
---

# Next.js Project Setup Skill

## Overview

This skill orchestrates complete Next.js project setup from scratch, adapting to project complexity. It handles template selection, specifications, design systems, wireframes, implementation, testing, and documentation following Claude Code best practices with optimal token efficiency through progressive disclosure and sub-agent orchestration.

**Outcomes**:
- Production-ready Next.js project
- Complete design system
- Comprehensive documentation
- Passing tests with TDD approach
- Clean, audited repository

---

## Decision Framework

<complexity_assessment>

**Simple Project Indicators** (choose simple path if ≤1 is true):
- Standard website/blog
- No database required
- No custom authentication
- Single tenant
- Simple design requirements

**Complex Project Indicators** (choose complex path if ≥2 are true):
- Database required (Supabase)
- Custom authentication patterns
- Multi-tenant architecture
- E-commerce features
- Complex/custom design system
- Multiple integrations

**User Override**: Always ask user to confirm complexity assessment.

</complexity_assessment>

---

## Simple Path Workflow

<simple_setup>

**Use when**: Quick setup, standard requirements, minimal customization
**Duration**: 15-30 minutes
**Load**: @docs/simple-setup.md

### Quick Steps (CoD^Σ)

```
Template ← Vercel_MCP(search + select)
  ↓
Setup ← {env_vars, config, structure}
  ↓
Components ← Shadcn_MCP(core_components)
  ↓
Design ← {tailwind_config, basic_theme}
  ↓
Docs ← {README, CLAUDE.md}
```

### Execution

1. **Assess & Confirm**
   - Confirm simple path appropriate
   - Gather basic requirements

2. **Load Instructions**
   - Follow @docs/simple-setup.md completely
   - Document provides step-by-step guidance

3. **Deliverables**
   - Installed template
   - Core components configured
   - Basic design system
   - Minimal documentation
   - Ready for development

</simple_setup>

---

## Complex Path Orchestration

<complex_setup>

**Use when**: Database, auth, complex design, multi-tenant, or multiple complex features
**Duration**: 2-4 hours (with user feedback iterations)
**Pattern**: Research ∥ → Template → Spec → Design → Wireframes → Implement ∥ → QA ∥ → Docs

### Phase 1: Parallel Research

```
<research_phase parallel="true">
  
**Purpose**: Gather foundational knowledge without bloating main context

**Sub-agents** (dispatch all simultaneously):
- @agents/research-vercel.md → /reports/vercel-templates.md
- @agents/research-shadcn.md → /reports/shadcn-best-practices.md
- @agents/research-supabase.md → /reports/supabase-patterns.md
- @agents/research-design.md → /reports/design-systems.md

**Wait for**: All agents complete
**Main agent**: Read reports (concise summaries, ~2000 tokens each)
**Token efficiency**: Sub-agents write reports, main agent never sees full research process

</research_phase>
```

### Phase 2: Template Selection

```
<template_selection>

**Prerequisites**: @reports/vercel-templates.md
**Load**: @docs/complex/phase-2-template.md

**Workflow**:
1. Analyze user requirements against template features
2. Use Vercel MCP to filter templates
3. Present top 3 options with rationale
4. User selects template
5. Install: `npx create-next-app --example <template>`
6. Verify installation and structure

**Outputs**:
- Installed template
- /docs/template-selection.md (rationale, features, setup notes)

</template_selection>
```

### Phase 3: Specification

```
<specification_phase>

**Prerequisites**: Template installed
**Load**: @docs/complex/phase-3-spec.md

**Workflow** (CoD^Σ):
```
Product_Spec := use(product-skill) → /docs/product-spec.md
Constitution := use(constitution-skill) → /docs/constitution.md
Features := {
  âˆ€feature ∈ requirements:
    feature → {description, acceptance_criteria, dependencies}
}
Audit := review ∧ clarify → user_feedback
```

**Required Skills**:
- REQUIRED SUB-SKILL: product-skill
- REQUIRED SUB-SKILL: constitution-skill

**Outputs**:
- /docs/product-spec.md
- /docs/constitution.md  
- /docs/features.md
- /docs/architecture.md

</specification_phase>
```

### Phase 4: Design System Ideation

```
<design_system_phase>

**Prerequisites**: Specifications, @reports/shadcn-best-practices.md, @reports/design-systems.md
**Load**: @docs/complex/phase-4-design.md

**Tools**: Shadcn MCP, 21st Dev MCP
**Pattern**: Brainstorm → Showcase → Iterate → Finalize

**Workflow**:
1. **Brainstorm** (dispatch @agents/design-ideator.md):
   - Color palettes (3-4 options)
   - Typography systems (2-3 options)
   - Component styles (2-3 directions)
   - Layout patterns

2. **Showcase**:
   - Create design-showcase page
   - Display all variations visually
   - Use @templates/design-showcase.md

3. **User Feedback Loop**:
   - Present showcase
   - Gather feedback
   - Iterate until approved

4. **Finalize**:
   - Document chosen system in /docs/design-system.md
   - Configure Tailwind (CSS variables only)
   - Set up Shadcn component structure
   - Import base components via Shadcn MCP

**Critical Rules**:
- Use global Tailwind CSS variables ONLY
- No inline custom styles
- Follow Shadcn workflow: Search → View → Example → Install
- Prioritize @ui registry for core components
- Use @magicui sparingly (subtle animations ≤300ms)

**Outputs**:
- /docs/design-system.md
- tailwind.config.ts with CSS variables
- components.json configured
- Base components installed

</design_system_phase>
```

### Phase 5: Wireframes & Asset Management

```
<wireframes_phase>

**Prerequisites**: Design system, specifications
**Load**: @docs/complex/phase-5-wireframes.md

**Pattern**: Assets → Wireframes → Iterate

**5.1 Image Asset Management**:
```
IF user_provides_images THEN:
  1. Inventory ← list(all_images)
  2. ∀image:
     - Describe(image)
     - Rename(descriptive_name)
     - Categorize(purpose)
  3. Document → /assets/inventory.md
  4. Reference in wireframes
ELSE:
  Note missing assets in wireframes
```

**5.2 Wireframe Generation**:
1. **Brainstorm Options**:
   - Create 2-3 layout variations per major page
   - Use text-based wireframes (detailed)
   - Reference design system components
   - Include image placeholders with @asset references

2. **Template**: Use @templates/wireframe-template.md

3. **User Feedback Loop**:
   - Present wireframe options
   - Discuss pros/cons of each approach
   - Iterate based on UX/conversion/accessibility feedback
   - Continue until approved

4. **Expert Evaluation** (for each option):
   - UX best practices
   - Conversion optimization
   - Accessibility (WCAG 2.1 AA)
   - Mobile-first approach
   - SEO considerations

**Outputs**:
- /docs/wireframes/*.md (one file per page/section)
- /assets/inventory.md (if images provided)
- Finalized layouts approved by user

</wireframes_phase>
```

### Phase 6: Implementation

```
<implementation_phase parallel="true">

**Prerequisites**: Wireframes, design system, template
**Load**: @docs/complex/phase-6-implement.md

**Pattern**: TDD + Parallel + Visual Validation

**Core Principles**:
1. **TDD Mandatory**: Tests before implementation, no exceptions
2. **Visual Validation**: Every page reviewed before marking complete
3. **Interaction Testing**: All links, buttons, animations validated
4. **Parallel Execution**: Independent features via sub-agents

**Workflow** (CoD^Σ):
```
∀feature ∈ features:
  Tests ← define(acceptance_criteria) FIRST
  Implementation ← code(feature) | tests_pass
  Components ← Shadcn_MCP(Search → View → Example → Install)
  Visual_Review ← validate(render ∧ interactions ∧ responsiveness)
  âœ" ⇔ (tests_pass ∧ visual_validated ∧ interactions_work)

Parallel := {
  features[independent] ∥ via sub-agents,
  qa_agent ∥ validation
}

Database (if applicable):
  Supabase_MCP ONLY (never CLI)
  Schema → RLS → Edge_Functions
  Server_Actions for mutations
```

**Component Management**:
- Use Shadcn MCP for all components
- Prefer Magic UI registry for enhanced components
- Follow: Search → View → Example → Install (never skip Example)
- Global Tailwind CSS variables (no hardcoded colors)

**Database Setup** (if applicable):
- Use Supabase MCP tools ONLY
- Start with staging environment
- Define schema requirements strictly
- Implement RLS policies
- Follow template auth patterns
- Multi-tenant: additional patterns per template

**Testing Setup**:
- Linting configuration
- GitHub workflows / CI/CD
- Test framework setup
- Visual regression testing

**Outputs**:
- Complete codebase
- Passing test suite
- Visually validated pages
- Database schema (if applicable)
- CI/CD configured

</implementation_phase>
```

### Phase 7: Quality Assurance (Parallel)

```
<qa_phase parallel="true">

**Prerequisites**: Implementation in progress
**Load**: @docs/complex/phase-7-qa.md
**Agent**: @agents/qa-validator.md (runs continuously)

**Validation Checklist**:

**Critical (Must Fix)**:
- [ ] All tests passing
- [ ] Visual validation complete
- [ ] All links functional
- [ ] All buttons working
- [ ] All forms submitting
- [ ] All animations smooth (≤300ms)
- [ ] Mobile responsive
- [ ] Accessibility compliant (WCAG 2.1 AA)

**Important (Should Fix)**:
- [ ] Performance optimized
- [ ] SEO meta tags
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states

**Process**:
1. QA agent validates continuously
2. Reports issues immediately
3. Implementation agents fix
4. Re-validate
5. No task marked complete until QA ✓

**Outputs**:
- QA report
- Issue tracking
- Resolution verification

</qa_phase>
```

### Phase 8: Documentation & Audit

```
<documentation_phase>

**Prerequisites**: Implementation complete, QA passing
**Load**: @docs/complex/phase-8-docs.md
**Agent**: @agents/doc-auditor.md

**Documentation Structure**:
```
project-root/
├── CLAUDE.md                    # Main context (comprehensive)
│   ├── Overview (2-3 sentences)
│   ├── Tree structure
│   ├── Tech stack
│   ├── Development workflow
│   ├── Skills/commands to use
│   ├── MCP tool usage
│   ├── Conventions
│   └── Anti-patterns
├── /docs/
│   ├── architecture.md          # System architecture
│   ├── design-system.md         # Design tokens
│   ├── database-schema.md       # DB structure
│   ├── product-spec.md          # Product requirements
│   ├── constitution.md          # Project principles
│   └── features.md              # Feature specifications
├── /components/CLAUDE.md        # Component conventions
├── /app/CLAUDE.md               # Routing conventions
└── /lib/CLAUDE.md               # Utility conventions
```

**CLAUDE.md Template** (CoD^Σ where appropriate):
```markdown
# Project: [Name]

## Overview
[2-3 sentence description]

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + Shadcn UI (@ui, @magicui)
- [Database: Supabase | None]
- [Other key tech]

## Development Workflow

### Skills
- `nextjs-project-setup` - Project setup
- `design-system` - Design management
- `test-driven-development` - TDD workflow

### MCP Tools
- Vercel: Deployment
- Shadcn: Components (Search→View→Example→Install)
- Supabase: DB/Auth (MCP only)

### Conventions
- Mobile-first responsive
- WCAG 2.1 AA accessibility
- Server actions for mutations
- Global Tailwind CSS (CSS variables only)
- TDD approach

### Anti-Patterns
❌ Supabase CLI (use MCP)
❌ Skip Shadcn Example step
❌ Hardcoded colors
❌ Code before tests

## References
@docs/architecture.md | @docs/design-system.md
```

**Audit Process**:
1. Doc auditor agent reviews all documentation
2. Checks completeness, accuracy, consistency
3. Verifies file structure compliance
4. Identifies missing docs
5. Cleans up messy files
6. Validates all references work
7. Ensures CoD^Σ used appropriately

**Outputs**:
- Complete documentation hierarchy
- Clean, organized repository
- Audit report
- All references functional

</documentation_phase>
```

</complex_setup>

---

## MCP Tool Usage Guidelines

<mcp_tools>

### Vercel MCP

**Purpose**: Template discovery, deployment

**Workflow**:
```
Search(category, features) → Filter → Compare → Select → Install
```

**Commands**:
- List templates: Filter by DB, auth, use case
- Get info: Detailed template features
- Install: `npx create-next-app --example <template>`

### Shadcn MCP

**Purpose**: Component discovery and installation

**Critical Workflow** (NEVER skip steps):
```
Search → View → Example → Install
```

**Registries**:
- `@ui`: Core components (check first always)
- `@magicui`: Animated components (use sparingly, ≤300ms)
- `@elevenlabs`: Audio/voice components (if applicable)

**Rules**:
1. ALWAYS follow Search → View → Example → Install
2. NEVER skip Example step
3. Prioritize @ui for foundation
4. Use @magicui animations sparingly
5. Install one component at a time
6. Verify integration after each install

**Example**:
```bash
# Search
mcp__shadcn__search_items_in_registries([@ui, @magicui], "button")

# View details
mcp__shadcn__view_items_in_registries(["@ui/button"])

# Get example
mcp__shadcn__get_item_examples_from_registries([@ui], "button-demo")

# Install
mcp__shadcn__get_add_command_for_items(["@ui/button"])
# Execute: npx shadcn@latest add button
```

### Supabase MCP

**Purpose**: Database and auth setup

**Critical Rule**: NEVER use Supabase CLI, ALWAYS use MCP tools

**Workflow**:
```
Schema_Design → Create_Tables → RLS_Policies → Auth_Setup → Edge_Functions
```

**Best Practices**:
- Start with staging environment
- Define schema requirements strictly before creating
- Implement RLS policies immediately
- Use server actions for mutations
- Edge functions for API routes
- Follow template auth patterns
- Multi-tenant: additional RLS patterns

### 21st Dev MCP

**Purpose**: Component inspiration and discovery

**Usage**:
- Search for UI inspiration
- Find pre-built components
- Copy-paste-adapt workflow
- Not for installation (manual integration)

</mcp_tools>

---

## Quality Standards & Requirements

<quality_standards>

### Token Efficiency
- Simple path: ≤2000 tokens total
- Complex orchestrator: ≤2500 tokens main context
- Sub-agent reports: ≤2500 tokens each
- Micro-docs: 500-1000 tokens each
- Use CoD^Σ notation where appropriate

### TDD Approach
- **Iron Law**: No code without tests first
- **Process**: RED (test fails) → GREEN (minimal code) → REFACTOR (improve)
- **No Exceptions**: "Just this once" is never acceptable
- **Validation**: All tests must pass before marking complete

### Visual Validation
- **Required**: Every page/component must be visually reviewed
- **Check**: Render, layout, responsiveness, interactions
- **Test**: Links, buttons, forms, animations, loading states
- **Criteria**: Mobile-first, accessible, performant

### Documentation
- **Comprehensive**: CLAUDE.md + folder docs + /docs/*
- **Current**: Updated continuously throughout project
- **Structured**: Domain-separated, focused docs
- **Referenced**: Use @references for cross-linking
- **Compressed**: Use CoD^Σ where beneficial

### Clean Repository
- **Organized**: Clear folder structure
- **Documented**: Every folder has purpose
- **Audited**: Regular cleanup and review
- **Tracked**: State documented and current

### Accessibility
- **Standard**: WCAG 2.1 AA minimum
- **Testing**: Use accessibility tools
- **Keyboard**: Full keyboard navigation
- **Screen readers**: Proper ARIA labels
- **Contrast**: Sufficient color contrast

</quality_standards>

---

## Anti-Patterns (Do NOT Do)

<anti_patterns>

### MCP Tools
❌ Using Supabase CLI instead of MCP
❌ Skipping Shadcn Example step
❌ Not following Search→View→Example→Install workflow
❌ Installing multiple Shadcn components without testing each

### Code Quality
❌ Writing code before writing tests
❌ Skipping visual validation
❌ Marking tasks complete without verification
❌ Using inline custom Tailwind styles
❌ Hardcoding colors instead of CSS variables

### Documentation
❌ Missing CLAUDE.md files
❌ Outdated documentation
❌ Putting reusable patterns in CLAUDE.md (use skills)
❌ Force-loading with @path (use skill name references)

### Project Structure
❌ Monolithic, unorganized code
❌ No clear folder conventions
❌ Missing folder-level documentation
❌ Bloated, messy repository

### Workflow
❌ Sequential execution when parallel is possible
❌ Duplicate research across agents
❌ Bloating main context with research details
❌ Not using sub-agents for isolated tasks

</anti_patterns>

---

## Sub-Agent Coordination

<sub_agent_orchestration>

### When to Use Sub-Agents

**Use for**:
- Parallel research (multiple topics simultaneously)
- Isolated task execution (fresh context)
- Independent feature implementation
- QA validation (continuous monitoring)
- Documentation audit (independent review)

**Don't use for**:
- Simple linear tasks
- Tasks requiring main conversation context
- Quick one-off operations

### Handover Protocol

**Pattern**:
```
Main Agent:
  1. Define task clearly
  2. Specify output format and location
  3. List required tools
  4. Set token budget
  5. Dispatch sub-agent
  
Sub-Agent:
  1. Execute task in isolated context
  2. Write concise report
  3. Save to specified location
  4. Signal completion
  
Main Agent:
  1. Read report (not full process)
  2. Continue workflow
```

### Report Template

All sub-agents use this structure:

```markdown
# [Task Name] Report

## Summary (1-2 sentences)
[Key finding or recommendation]

## Key Findings
- Finding 1
- Finding 2
- Finding 3

## Recommendations
[Specific, actionable recommendations]

## Details
[Supporting information, kept concise]

## References
[Sources, if applicable]
```

**Target**: 1500-2500 tokens per report

</sub_agent_orchestration>

---

## Progressive Disclosure Pattern

<progressive_disclosure>

**Principle**: Load only what's needed, when needed

**Levels**:
1. **Metadata** (always loaded): Skill name/description, available commands
2. **Core Instructions** (loaded on trigger): This SKILL.md file
3. **Phase Docs** (loaded on reference): @docs/complex/phase-*.md
4. **Templates** (loaded as needed): @templates/*.md
5. **Sub-agents** (dispatched when needed): @agents/*.md

**Usage**:
```
# ✓ Correct - reference by name
Use @docs/complex/phase-4-design.md for design system workflow

# ✗ Wrong - don't force-load full paths
Read @~/.claude/skills/nextjs-project-setup/docs/complex/phase-4-design.md
```

**Benefits**:
- Minimal token usage
- Focused context
- Faster processing
- Better maintainability

</progressive_disclosure>

---

## Testing & Validation

<testing_methodology>

### Skill Testing (TDD for Docs)

**Process**:
1. **RED**: Run scenarios without skill, document failures
2. **GREEN**: Add minimal skill, verify agents comply
3. **REFACTOR**: Close loopholes, add to anti-patterns

**Pressure Test Scenarios**:
- Time pressure: "It's urgent, skip tests"
- Authority: "I'm the expert, trust me"
- Sunk cost: "Already wrote the code"
- Exhaustion: "Just this once"

**Validation**:
- Agents follow instructions without deviation
- No rationalization loopholes
- Anti-patterns are avoided
- Quality standards maintained

### Implementation Testing

**Unit Tests**:
- Test each function/component
- Mock external dependencies
- Fast execution (<1s per test)
- High coverage (>80%)

**Integration Tests**:
- Test component interactions
- Test API routes
- Test database operations
- Test auth flows

**E2E Tests**:
- Test critical user flows
- Test across browsers
- Test mobile responsiveness
- Test accessibility

**Visual Validation**:
- Manual review of each page
- Test interactions (click, hover, scroll)
- Verify animations
- Check loading/error states

</testing_methodology>

---

## Troubleshooting

<troubleshooting>

### Common Issues

**Issue**: Template installation fails
**Solution**: Check npm version, network, permissions. Try different template.

**Issue**: Shadcn component conflicts
**Solution**: Review components.json, check for duplicate names, reinstall one at a time.

**Issue**: Supabase connection fails
**Solution**: Verify env variables, check MCP tool configuration, confirm project ID.

**Issue**: Sub-agent not responding
**Solution**: Check agent definition, verify tools allowed, dispatch explicitly.

**Issue**: Tests failing
**Solution**: Review test requirements, check implementation, verify mocks.

**Issue**: Visual validation issues
**Solution**: Check responsive design, verify Tailwind CSS, inspect browser console.

**Issue**: Documentation out of sync
**Solution**: Run audit agent, update docs systematically, verify references.

</troubleshooting>

---

## Success Criteria

<success_criteria>

### Functional
âœ… Project initializes and runs locally
âœ… All features implemented per specifications
âœ… Design system fully integrated
âœ… Database/auth working (if applicable)
âœ… All pages render correctly
âœ… All interactions functional

### Technical
âœ… All tests passing (unit, integration, E2E)
âœ… Visual validation complete
âœ… Accessibility compliant (WCAG 2.1 AA)
âœ… Performance optimized
âœ… Mobile responsive
âœ… CI/CD configured

### Documentation
âœ… Comprehensive CLAUDE.md
âœ… Complete /docs/ structure
âœ… Folder-level documentation
âœ… All references functional
âœ… Architecture documented
âœ… Design system documented

### Quality
âœ… Clean, organized repository
âœ… No anti-patterns present
âœ… Following all conventions
âœ… Audit completed successfully
âœ… Token efficiency maintained
âœ… Ready for production deployment

</success_criteria>

---

## References

<references>

### Skills
- Product Specification Skill (for specs)
- Constitution Skill (for project principles)
- Design System Skill (for design management)
- Test-Driven Development Skill (for TDD workflow)

### Documentation
- @docs/simple-setup.md - Simple path instructions
- @docs/complex/phase-*.md - Complex path phases
- @templates/*.md - Reusable templates
- @agents/*.md - Sub-agent definitions

### External Resources
- Next.js Documentation
- Tailwind CSS Documentation
- Shadcn UI Documentation
- Supabase Documentation
- Vercel Documentation

</references>

---

**Remember**: This skill adapts to your project's complexity. Simple projects get a streamlined path, complex projects get full orchestration. Always prioritize quality, testing, and documentation throughout.
