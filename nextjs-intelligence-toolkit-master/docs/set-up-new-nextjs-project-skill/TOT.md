# Tree of Thought Analysis: Next.js Project Setup Skill

## Goal Restatement
Create a **repeatable Claude Code skill** for setting up Next.js projects from scratch following best practices, with emphasis on:
- Automated template selection
- Design system ideation
- Documentation structure
- Quality assurance
- Sub-agent orchestration

## Entity Map (CoD^Σ)

```
Core_Goal := NextJS_Setup_Skill

Skill := {
  Template_Selection,
  Product_Spec,
  Design_System,
  Wireframes,
  Implementation,
  QA,
  Documentation
}

Dependencies:
  Template_Selection ⇐ Product_Spec
  Design_System ⇐ {Template_Selection, Product_Spec}
  Wireframes ⇐ {Design_System, Product_Spec, Image_Assets}
  Implementation ⇐ {Wireframes, Design_System, Template_Selection}
  QA ⇒ Implementation
  Documentation ⊃ {Product_Spec, Design_System, Implementation}

Tools_Required := {
  Vercel_MCP,
  Shadcn_MCP,
  Supabase_MCP,
  21st_Dev_MCP,
  Firecrawl,
  Filesystem
}

Execution_Pattern := Sequential ⊕ Parallel
  Sequential := Template → Spec → Design → Wireframes → Implementation
  Parallel := {Research_Agents, QA_Agents, Doc_Agents} ∥
```

## Information Hierarchy

### Level 1: Initialization
- **Entities**: User Requirements, Project Type
- **Tools**: Vercel MCP
- **Output**: Selected template, initial structure
- **Sub-agents**: Research agent for template comparison

### Level 2: Specification
- **Entities**: Product requirements, Constitution, Feature specs
- **Tools**: Skills (product-skill, constitution-skill), Documentation tools
- **Output**: /docs/product-spec.md, /docs/constitution.md
- **Sub-agents**: Spec clarification agent

### Level 3: Design System
- **Entities**: Color palettes, Typography, Component styles, Layouts
- **Tools**: Shadcn MCP, 21st Dev MCP, Tailwind CSS
- **Output**: Design system guide, Tailwind config
- **Sub-agents**: Design ideation agents (parallel)

### Level 4: Wireframes & Assets
- **Entities**: Text wireframes, Image inventory, Layout structures
- **Tools**: Filesystem, Image processing
- **Output**: /docs/wireframes/, /assets/inventory.md
- **Sub-agents**: Asset cataloger, Wireframe designer

### Level 5: Implementation
- **Entities**: Components, Pages, Routes, Database schemas
- **Tools**: Filesystem, Shadcn MCP, Supabase MCP, Testing tools
- **Output**: Complete codebase
- **Sub-agents**: Multiple parallel implementation agents

### Level 6: Quality & Documentation
- **Entities**: Tests, Linting, CI/CD, CLAUDE.md, folder docs
- **Tools**: Testing frameworks, Git workflows
- **Output**: Complete documentation, passing tests
- **Sub-agents**: QA agent, Documentation auditor

## Relationship Graph

```
User_Request
  ↓
Template_Selection ⟨Vercel_MCP⟩
  ↓
Product_Spec ⟨Skills⟩ → Constitution ⟨Skills⟩
  ↓
Design_System_Ideation ⟨Shadcn_MCP, 21st_Dev, Parallel_Agents⟩
  ↓
  ├─→ Color_Palette
  ├─→ Typography
  ├─→ Component_Styles
  └─→ Layouts
  ↓
Wireframe_Generation ⟨Text-based, Iterative⟩
  ↓
Image_Asset_Management ⟨Inventory, Rename, Organize⟩
  ↓
Implementation ⟨Parallel_Agents⟩
  ├─→ Components ⟨Shadcn_MCP⟩
  ├─→ Pages
  ├─→ Routes
  ├─→ Database ⟨Supabase_MCP⟩
  └─→ Auth ⟨Template_Pattern⟩
  ↓
Testing_&_QA ⟨TDD, Visual_Review, Parallel⟩
  ├─→ Unit_Tests
  ├─→ Integration_Tests
  └─→ Visual_Review
  ↓
Documentation ⟨CLAUDE.md, Folder_Docs⟩
  ├─→ Project_Overview
  ├─→ Folder_Structure
  ├─→ Skills_&_Commands
  └─→ MCP_Usage
  ↓
Cleanup_&_Audit ⟨Dedicated_Agent⟩
```

## Key Constraints & Requirements

### Skill Composition (CoD^Σ)
```
Skill_Structure := {
  SKILL.md,
  /docs/*.md,
  /templates/*.md,
  /scripts/*.sh
}

Slash_Commands := Composable_Units
  ∀command: command ⊂ Skill
  command ↦ [specific_phase]

Sub_Agents := {
  Research,
  Design,
  Implementation,
  QA,
  Documentation,
  Audit
}

∀agent ∈ Sub_Agents:
  agent.context ⊥ main_context
  agent.reports → /reports/agent_name.md
  
Token_Efficiency:
  Progressive_Disclosure ∧ @references ∧ CoD_Σ
  ¬(duplicate_research ∨ bloated_context)
```

### Critical Requirements
1. **Progressive Disclosure**: Load docs only when needed via @references
2. **Token Efficiency**: Use CoD^Σ, avoid context bloat
3. **Parallelization**: Independent tasks via sub-agents
4. **Documentation First**: Every phase generates docs before implementation
5. **Visual Review**: Every page must be visually validated before completion
6. **TDD Approach**: Tests before implementation
7. **Supabase Priority**: Use Supabase MCP tools (not CLI)
8. **Shadcn Priority**: Use Shadcn MCP for component management
9. **Clean Repository**: Regular audits, well-organized docs
10. **Design Templates**: Reusable design system patterns

## Token Optimization Strategy

### Problem: Repeated Context Loading
- Multiple agents researching same info = token waste

### Solution: Report-Based Workflow
```
Main_Agent (Orchestrator)
  ↓
  ├─→ Research_Agent_1 → /reports/vercel-templates.md
  ├─→ Research_Agent_2 → /reports/shadcn-best-practices.md
  ├─→ Research_Agent_3 → /reports/supabase-patterns.md
  └─→ Research_Agent_4 → /reports/design-systems.md
  ↓
Main_Agent reads reports → creates skill
  ↓
Specialized_Agents read relevant reports → execute tasks
```

### Context Management
- Main orchestrator: Clean context, reads reports only
- Research agents: Write concise summaries (max 2000 tokens each)
- Implementation agents: Read only relevant reports
- QA agents: Independent validation context

## User's Stated Workflow

### Phase 1: Infrastructure Setup
1. Run claude-code install command (provided separately)
2. Use Vercel MCP to find matching template
3. Install template

### Phase 2: Specification
1. Define product specifications (use product skill)
2. Generate constitution (use constitution skill)
3. Generate general website specifications
4. Audit and clarify
5. Design system ideation

### Phase 3: Design & Wireframes
1. Brainstorm design options (colors, components, layouts)
2. Generate showcase pages for design variations
3. Iterate with user feedback
4. Finalize design system
5. Generate text-based wireframes
6. Brainstorm multiple wireframe options
7. Iterate until approved

### Phase 4: Asset Management
1. Inventory all image assets
2. Describe each asset
3. Rename descriptively
4. Reference in wireframes
5. Note missing assets

### Phase 5: Implementation
1. Follow TDD approach
2. Use Shadcn MCP for components (prefer Magic UI)
3. Use global Tailwind CSS (avoid inline custom)
4. Use Supabase MCP (never CLI)
5. Follow template patterns for auth (multi-tenant if applicable)
6. Parallel implementation via sub-agents
7. Visual review of each page before completion

### Phase 6: Testing & QA
1. Set up linting, GitHub workflows
2. TDD: tests first, then implementation
3. Visual validation of all pages
4. Check links, buttons, interactions, animations
5. Sub-agent can handle QA in parallel

### Phase 7: Documentation
1. Create comprehensive CLAUDE.md (how-to, processes, skills, commands, MCPs, anti-patterns)
2. Create folder-level CLAUDE.md files
3. Define documentation lifecycle
4. Domain-specific doc separation for skills/agents
5. Overview doc with tree structure and @references
6. Use CoD^Σ for compression

### Phase 8: Audit & Cleanup
1. Dedicated agent reviews state
2. Check documentation compliance
3. Clean up messy files
4. Verify checklist completion
5. Maintain clean repository

## Gaps in Original Prompt

1. **No clear skill structure defined** - needs SKILL.md format with YAML frontmatter
2. **Vague on slash command composition** - needs specific command definitions
3. **Sub-agent coordination unclear** - needs explicit handover protocols
4. **Report format unspecified** - needs structured reporting templates
5. **Skill activation trigger missing** - needs description for auto-discovery
6. **No reference to skill best practices** - should follow TDD for docs approach
7. **Token budget not considered** - needs explicit optimization
8. **No failure/error handling** - needs fallback strategies
9. **Unclear on when to use parallel vs sequential** - needs decision framework
10. **No skill testing methodology** - should include validation approach
