# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

---

## Project Overview

**Claude Code Intelligence Toolkit** - A meta-system for building intelligence-first AI agent workflows using skills, agents, slash commands, and SOPs.

**Core Innovation**: Intelligence-first architecture achieving 80%+ token savings by querying lightweight indexes (project-intel.mjs, MCP tools) before reading files.

---

## Intelligence-First Workflow

**Critical Pattern**: Query intelligence sources BEFORE reading files:

```bash
# 1. Get project overview (first step in new sessions)
project-intel.mjs --overview --json

# 2. Search for relevant files
project-intel.mjs --search "keyword" --type tsx --json

# 3. Get symbols from candidates
project-intel.mjs --symbols path/to/file.tsx --json

# 4. Trace dependencies if needed
project-intel.mjs --dependencies path/to/file.tsx --json

# 5. NOW read specific file sections
Read path/to/file.tsx
```

**Why**: 1-2% token usage vs reading full files → 80%+ savings

---

## Architecture

### Component Hierarchy

1. **Skills** (.claude/skills/) - Auto-invoked workflows: analyze-code, debug-issues, create-plan, implement-and-verify
2. **Agents** (.claude/agents/) - Specialized subagents: orchestrator, code-analyzer, planner, executor
3. **Slash Commands** (.claude/commands/) - User-triggered workflows: /analyze, /bug, /feature, /plan, /implement, /verify, /audit
4. **Templates** (.claude/templates/) - Structured output formats (22 templates, CoD^Σ traces)
5. **Shared Imports** (.claude/shared-imports/) - Core frameworks: CoD_Σ.md, project-intel-mjs-guide.md

**Detailed Architecture**: See docs/architecture/system-overview.md for dependency graphs, process flows, and token efficiency details.

---

## Component Decision Guide

- **Skill** - Complex workflow, auto-invoke based on context
- **Agent** - Isolated context for heavy analysis/specialized tasks
- **Command** - User-triggered shortcut for common workflows
- **Template** - Structured output format for consistency

---

## Development Workflows

### Creating Components

**Skills**: YAML frontmatter + progressive disclosure (metadata → instructions → resources)
**Agents**: YAML frontmatter + persona + @ imports for templates/skills
**Commands**: YAML frontmatter + description (SlashCommand tool) + allowed-tools + prompt expansion

**Guide**: See docs/guides/developing-agent-skills.md

### Bootstrapping Projects

```bash
cp .claude/templates/planning-template.md planning.md
cp .claude/templates/todo-template.md todo.md
cp .claude/templates/event-stream-template.md event-stream.md
cp .claude/templates/workbook-template.md workbook.md
```

**Reference**: See .claude/templates/BOOTSTRAP_GUIDE.md

---

## Chain of Density Σ (CoD^Σ)

All reasoning MUST include CoD^Σ traces with evidence.

### Operators
- `⊕` parallel | `∘` sequential | `→` delegation | `≫` transformation | `⇄` bidirectional | `∥` concurrent

### Evidence Requirements
Every claim needs: file:line references, MCP query results, project-intel.mjs output, or test logs.

**Bad**: "Component re-renders because of state"
**Good**: "Component re-renders: useEffect([state])@ComponentA.tsx:45 → mutation@ComponentA.tsx:52"

---

## File Organization

```
.claude/
├── agents/           # Subagent definitions
├── commands/         # Slash command definitions
├── skills/           # Auto-invoked workflows
├── templates/        # Structured outputs
└── shared-imports/   # Core frameworks
```

**Generated Files**: `YYYYMMDD-HHMM-{type}-{id}.md` (report, plan, verification, handover, bug, feature-spec)

---

## MCP Tools

**Available**: Ref (docs), Supabase (DB), Shadcn (components), Chrome (E2E), Brave (search), 21st-dev (design)

**Usage**: Query MCP tools for authoritative external information before assumptions.

---

## Documentation Structure

**Core**:
- `planning.md` - Previous refactoring (COMPLETE)
- `todo.md` - Current improvement tasks (IN PROGRESS)
- `event-stream.md` - Session log
- `docs/claude-code-comprehensive-guide.md` - Complete guide (1,450 lines)

**Specialized**:
- `docs/guides/developing-agent-skills.md` - Skill creation
- `docs/guides/skills-guide/` - Multi-part development guide
- `docs/reference/claude-code-docs/` - Claude Code features

**Note**: SYSTEM-IMPROVEMENT-PLAN.md and TESTING-PROTOCOL.md are reference docs - load only when explicitly needed.

---

## Specification-Driven Development (SDD)

**User Actions** (2 manual steps):
1. `/feature "description"` - Create spec
2. `/implement plan.md` - Execute implementation

**Automatic Chain**:
```
/feature → spec.md → /plan (auto) → plan.md → generate-tasks (auto) → tasks.md → /audit (auto) → PASS → ready
/implement → P1 + /verify (auto) → PASS → P2 + /verify (auto) → PASS → complete
```

**Quality Gates**:
- `/audit` - Pre-implementation validation (constitution, coverage, ambiguities)
- `/verify --story <id>` - Per-story verification (tests, dependencies, demos)

---

## Best Practices

1. **Intel First** - project-intel.mjs queries before file reads
2. **Use Skills** - Let skills handle workflows, don't reinvent
3. **CoD^Σ Traces** - All claims need file:line evidence
4. **Templates** - Use @ syntax for consistency
5. **Progressive Disclosure** - Load details on-demand

---

## Troubleshooting

**Agent reads full files**: Verify skill invocation (analyze-code/debug-issues enforce intel-first)
**No evidence**: Check CoD^Σ trace, ensure skills used
**High token usage**: Use skills with intel queries first
**Skills not triggering**: Check SKILL.md description/YAML
**Templates not used**: Verify @ syntax in agents/commands
