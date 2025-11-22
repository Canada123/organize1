# Claude Code: Complete Developer Guide

*A comprehensive guide to building skills, agents, and commands in Claude Code*

Version: 1.0
Last Updated: 2025-10-30

---

## Table of Contents

1. [Fundamentals](#fundamentals)
2. [Skills-First Component Hierarchy](#skills-first-component-hierarchy)
3. [Creating Components](#creating-components)
4. [Composition Patterns](#composition-patterns)
5. [Best Practices](#best-practices)
6. [Complete Workflow Examples](#complete-workflow-examples)
7. [Troubleshooting & FAQ](#troubleshooting--faq)
8. [Appendices](#appendices)

---

## Part 1: Fundamentals

### 1.1 What is Claude Code?

Claude Code is Anthropic's terminal-native agentic coding tool that transforms software development through composable, autonomous AI capabilities. Unlike simple chat interfaces, Claude Code:

- Reads your project code and understands architecture
- Edits files directly in your codebase
- Runs shell commands and executes tests
- Creates commits and manages version control
- Accesses external data via Model Context Protocol (MCP) connectors

**Core Philosophy**: Claude Code embodies Unix philosophy principles - simplicity, composability, and doing one thing well. Built on a ReAct framework (Reasoning and Acting), it operates through an iterative loop where Claude analyzes context, determines actions, executes tools, observes results, and iterates.

### 1.2 Architecture Overview

Claude Code operates **locally by design** rather than in VMs or containers, using bash commands directly on your filesystem for maximum simplicity. The architecture features:

**Permission-Based Security Model**
- Read-only by default, requiring explicit approval for writes
- Three modes: Normal (prompt each time), Auto-Accept (automatic approval), Plan (read-only analysis)
- Fail-closed approach ensures safety while enabling automation

**Context is the Foundation**
- Massive context windows up to 1 million tokens
- Full conversation history and project context remain available throughout
- Automatic compaction prevents context exhaustion while maintaining continuity
- No complex RAG systems needed

**Hybrid Model Strategy**
- Haiku for quick operations
- Sonnet as the daily workhorse
- Opus for complex architectural decisions
- Balances speed, cost, and capability based on task requirements

### 1.3 CLAUDE.md: Persistent Memory System

CLAUDE.md files serve as Claude's persistent memory - automatically loaded at session start to provide project-specific context without repetitive explanation.

**Memory Hierarchy** (highest to lowest priority):
1. **Enterprise-level** (organization-wide standards)
2. **Project-level** (`.claude/CLAUDE.md` - shared with team via git)
3. **User-level** (`~/.claude/CLAUDE.md` - personal preferences)
4. **Nested/Local** (subdirectory-specific context)

Higher levels take precedence and load first, with nested memories providing additional context for subdirectories.

**The @ Import Syntax**

Within CLAUDE.md files, use `@path/to/file` to import additional content:

```markdown
# Project Memory

See @README for project overview and @package.json for available npm commands.
Architecture decisions documented in @docs/architecture.md.
```

Import features:
- Up to 5 hops deep in import chains
- Both relative and absolute paths supported
- Modularizes large documentation
- Enables personal extensions without committing to git

**In-Conversation File References**

During conversation, use `@filename` to immediately include files without waiting for Claude to read them:
- `@src/utils/auth.js` includes full file content
- `@src/components/` shows directory listings
- Efficient context loading on demand

**Memory Best Practices**

**Keep it lean and specific** (under 500 lines):
- Use bullet points, not paragraphs
- Be specific: "Use 2-space indentation" not "format properly"
- Focus on project-unique instructions, not generic advice
- Use structured headings for organization
- Avoid time-sensitive information
- Periodically review and update

**Essential content for CLAUDE.md**:
- Common commands (build, test, deploy)
- Code style conventions
- Testing requirements
- Architecture decisions
- Repository etiquette
- Environment quirks
- Integration details

**Quick Memory Management**:
- Start message with `#` to append note to CLAUDE.md
- `/memory` command opens editor for loaded memory files
- `/init` generates initial CLAUDE.md from codebase analysis

**Template Structure**:
```markdown
# Project Name

## Tech Stack
- Languages: [specific versions]
- Frameworks: [specific versions]
- Tools: [specific tools]

## Commands
- Dev: `npm start`
- Test: `npm test`
- Build: `npm run build`

## Code Conventions
- Specific formatting rules
- Naming patterns
- Import organization

## Architecture Notes
- Key design decisions
- State management approach
- API patterns
```

### 1.4 MCP Tools Integration

Claude Code integrates with external services through the Model Context Protocol (MCP), enabling access to:
- Google Drive, Figma, Slack
- Documentation repositories
- Database systems
- Custom integrations

MCP connectors provide authoritative external information without context pollution, as data is fetched on-demand rather than pre-loaded.

### 1.5 Token Efficiency Principles

**Context is a Finite Public Good**

Every token competes for space:
- Conversation history
- Skills metadata
- CLAUDE.md content
- Files
- Tool outputs
- User requests

**The Dual Threats**:
1. **Context Pollution** - Valuable reasoning flooded with irrelevant logs and diagnostics
2. **Context Rot** - AI performance degrading as input length increases

**Solution**: Aggressive use of subagents to isolate messy operations, keeping main thread focused.

**Progressive Disclosure Architecture**

Load content in stages to minimize token consumption:
- Level 1: Metadata (30-50 tokens) for discovery
- Level 2: Full content when relevant
- Level 3: Supporting files only when specifically needed

**Just-in-Time Loading**:
- Store lightweight identifiers (file paths, queries, URLs)
- Use Read tool dynamically when needed
- Avoid pre-loading massive datasets

**Context Management Tools**:
- `/compact` - Summarize and compress when approaching limits
- `/rewind` - Remove conversation turns
- Automatic context awareness and compaction in Claude 4.5

---

## Part 2: Skills-First Component Hierarchy

**Understanding the hierarchy is critical for effective Claude Code use.**

### 2.1 The Three-Level Hierarchy

```
Level 1: Skills (Auto-Invoked)
    ↓ can reference
Level 2: Slash Commands (User-Invoked)
    ↓ can call via SlashCommand tool
Level 3: Subagents (Isolated Execution)
    ↓ can use Skills and Commands
```

### 2.2 Level 1: Skills (Auto-Invoked)

**What are Skills?**

Skills are modular capabilities that Claude autonomously invokes when relevant. They package domain-specific expertise or workflows into units that Claude can use without explicit prompting.

**Key Characteristics**:
- **Trigger**: Automatic based on description matching
- **Context**: Loaded progressively when relevant
- **Structure**: Directory with SKILL.md + optional supporting files
- **Best for**: Domain knowledge, conventions, automatic expertise application

**Progressive Disclosure**:
- **Level 1 Metadata**: Name and description (30-50 tokens) - pre-loaded at startup
- **Level 2 Content**: SKILL.md body loads when Claude determines relevance
- **Level 3 Resources**: Supporting files load only when specifically needed

**Folder Structure**:
```
my-skill/
├── SKILL.md (required)
├── REFERENCE.md (optional)
├── templates/ (optional)
└── scripts/helper.py (optional)
```

**SKILL.md Format**:
```markdown
---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.
---

# Generating Commit Messages

## Instructions
1. Run `git diff --staged` to see changes
2. Suggest commit message with:
   - Summary under 50 characters
   - Detailed description explaining what and why
   - List affected components

## Best Practices
- Use present tense
- Explain what and why, not how
- Reference issue numbers when applicable
```

**Real Example - PDF Skill**:

Built-in skills (Pro, Max, Team, Enterprise) include:
- `xlsx` - Excel spreadsheet creation and analysis
- `docx` - Word document manipulation
- `pptx` - PowerPoint presentation creation
- `pdf` - PDF form filling and processing

Custom skills enable domain-specific expertise:
- Brand guidelines
- Testing frameworks
- Deployment procedures
- Data analysis patterns

**When to Use Skills**:
- "I want Claude to remember X automatically"
- Comprehensive, multi-step domain-specific assistance
- Knowledge that should be proactively applied
- Complex workflows spanning multiple files

### 2.3 Level 2: Slash Commands (User-Invoked)

**What are Slash Commands?**

Slash commands are reusable prompt shortcuts stored as Markdown files and invoked with `/command-name` syntax. They represent the primary composable unit in Claude Code.

**Key Characteristics**:
- **Trigger**: Manual via `/command-name` or autonomous via SlashCommand tool
- **Context**: Injected directly into main thread
- **Structure**: Single Markdown file
- **Best for**: Workflow shortcuts, frequent prompts, orchestration

**Creating Slash Commands**:

Place Markdown files in:
- `.claude/commands/` (project-level, shared with team)
- `~/.claude/commands/` (personal, across all projects)

**Basic Example**:
```markdown
---
description: Comprehensive code review
argument-hint: [file-or-directory]
allowed-tools: Read, Grep, Glob
model: sonnet
---

Perform comprehensive code review of $ARGUMENTS focusing on:
- Security vulnerabilities
- Performance issues
- Best practices adherence
- Test coverage

Provide specific, actionable feedback with file locations.
```

**YAML Frontmatter Fields**:
- `description` - Explains purpose (enables SlashCommand tool invocation)
- `argument-hint` - Shows expected arguments in help
- `allowed-tools` - Restricts which tools Claude can use
- `model` - Specifies model to use (haiku/sonnet/opus)
- `disable-model-invocation: true` - Prevents autonomous use

**Dynamic Content**:
- `$ARGUMENTS` - All arguments as single string
- `$1`, `$2`, etc. - Positional arguments
- `!git status` - Execute bash commands
- `@path/to/file` - Reference files

**Namespacing**:
- `.claude/commands/frontend/component.md` → `/project:component`
- Shows as "(project:frontend)" in help menu
- Project commands tagged "(project)", personal tagged "(user)"

**Real Example - Fix GitHub Issue**:
```markdown
---
description: Analyze and fix GitHub issues end-to-end
argument-hint: <issue-number>
allowed-tools: Read, Grep, Glob, Bash(gh:*), Edit, Write
---

Please analyze and fix GitHub issue: $ARGUMENTS.

Follow these steps:
1. Use `gh issue view $1` to get issue details
2. Understand the problem described
3. Search codebase for relevant files
4. Implement necessary changes
5. Run tests to verify fix
6. Ensure code passes linting and type checking
7. Commit with descriptive message and open PR
```

**The SlashCommand Tool**

When enabled, Claude can see custom command metadata and autonomously invoke them when appropriate. Commands become part of Claude's "toolbox."

**Exposure Rules**:
- Only user-defined commands with `description` field are exposed
- Built-in commands like `/logout` or `/init` are NOT model-invokable
- Character budget (default 15k) limits total descriptions
- Use `disable-model-invocation: true` to hide specific commands

**When to Use Slash Commands**:
- "I want a shortcut for workflow Y"
- Quick, frequently repeated prompts
- One-step actions requiring manual trigger
- Orchestration of subagents and skills
- Workflow entry points

### 2.4 Level 3: Subagents (Isolated Execution)

**What are Subagents?**

Subagents are pre-configured AI personalities operating in separate context windows. Each has custom system prompt, specific tool permissions, and specialized expertise.

**Key Characteristics**:
- **Trigger**: Automatic delegation or explicit mention
- **Context**: Separate isolated context window (100k tokens each)
- **Structure**: Markdown file with YAML frontmatter + system prompt
- **Best for**: Heavy analysis, context isolation, parallel work, specialized expertise

**The Killer Feature: Context Isolation**

When a subagent parses 150,000 tokens of logs, that noise stays in its isolated context. Only the distilled 2,000-token summary returns to main thread.

**Without subagents**: 150k tokens of diagnostic output flood valuable reasoning context, degrading quality.

**Bad context is cheap but toxic** - it costs little computationally but destroys Claude's effectiveness.

**Creating Subagents**:

Place Markdown files in:
- `.claude/agents/` (project-level)
- `~/.claude/agents/` (personal)

**Basic Structure**:
```markdown
---
name: security-auditor
description: Use for security reviews and vulnerability assessments
tools: Read, Grep, Glob
model: sonnet
---

You are a security specialist. Review code for:
- Authentication/authorization issues
- SQL injection vulnerabilities
- XSS vulnerabilities
- Sensitive data exposure

Provide specific findings with severity levels and remediation steps.
```

**YAML Frontmatter Fields**:
- `name` - Subagent identifier
- `description` - Purpose and when to use (critical for auto-delegation)
- `tools` - Allowed tools (omitting grants ALL tools)
- `model` - Specific model or `inherit` from main session

**Tool Scoping Security**:
- Omitting `tools` field grants all tools (including MCP)
- Specify explicitly for security: `Read, Grep, Glob` (read-only)
- `Read, Write, Edit, Bash` enables implementers
- Follow least privilege principles

**When to Use Subagents**:
- Complex multi-stage tasks requiring specialized expertise
- Heavy research that would clutter main context (exploring dozens of files)
- Parallel processing of independent tasks
- Repeated workflows needing consistency
- Context preservation when main agent approaches limits
- "I need to isolate messy operations" or "automate specialized workflow"

**Real Example - Test Runner**:
```markdown
---
name: test-runner
description: Run test suite, diagnose failures, and fix them while preserving original test intent. Use PROACTIVELY after code changes.
tools: Read, Edit, Write, Grep, Glob, Bash
model: inherit
---

Run npm test. If any tests fail:
1. Identify failure's cause
2. Minimally patch code to fix it
3. Preserve unrelated behavior
4. Re-run tests to verify

Report all test results and changes made.
```

**Automatic Delegation**:

Phrase descriptions to encourage autonomous use:
- "Use PROACTIVELY after code changes..."
- "MUST be used when..."
- "Always invoke for security reviews..."

**Parallel Execution**:
- Up to 10 concurrent subagents on read operations
- Queue handles 100+ tasks via batching
- Ideal for parallel research, analysis, or review tasks

**Trade-offs**:
- Consume 3-4x more tokens (parallel contexts)
- Higher latency (starting from clean slate)
- Reserve for genuinely complex scenarios
- Simple tasks stay in main thread

**Orchestration Model**:

**Main Agent** (orchestrator):
- Decides which subagent to invoke
- Coordinates between multiple subagents
- Maintains high-level flow
- Synthesizes results

**Subagents** (specialized laborers):
- Execute specific tasks
- Operate independently within expertise
- Return summarized results only

### 2.5 Component Decision Matrix

| Aspect | Skills | Slash Commands | Subagents |
|--------|--------|----------------|-----------|
| **Invocation** | Auto (model decides) | Manual or auto via SlashCommand tool | Auto or explicit |
| **Structure** | Directory with SKILL.md + files | Single Markdown file | Single Markdown file |
| **Context** | Progressive disclosure | Main thread | Isolated window |
| **Complexity** | Complex capabilities | Simple to moderate | Complex workflows |
| **Best For** | Domain knowledge | Workflow shortcuts | Heavy operations |
| **Sharing** | Via git | Via git | Via git |
| **Token Cost** | Minimal until invoked | Injected into main | Separate budget |
| **Use When** | "Remember X automatically" | "Shortcut for Y" | "Isolate Z" |

---

## Part 3: Creating Components

### 3.1 Creating Skills

**Step 1: Start with Test Cases**

1. Identify gaps by running tasks WITHOUT the Skill
2. Create 3 test scenarios representing real usage
3. Write minimal instructions to pass tests
4. Iterate based on actual results

**Step 2: Structure for Discovery**

**Naming**: Use gerund form
- Good: "Processing PDFs", "Generating Reports"
- Bad: "PDF Processing", "Report Generation"

**Description**: Include WHAT and WHEN
```markdown
---
name: analyzing-excel-spreadsheets
description: Analyze Excel spreadsheets, create pivot tables, and generate charts. Use when working with Excel files, spreadsheets, or analyzing tabular data in .xlsx format.
---
```

**Trigger Terms**: Add words users would mention
- "Excel files"
- "spreadsheets"
- ".xlsx format"
- "pivot tables"
- "charts"

**Step 3: Keep it Lean**

- Under 500 lines in SKILL.md
- Split large content into reference files
- Organize by domain for conditional loading
- Avoid time-sensitive information
- Focus on what Claude doesn't already know

**Step 4: Test Across Models**

- **Haiku**: Does it provide enough guidance?
- **Sonnet**: Is it clear and efficient?
- **Opus**: Does it avoid over-explaining?

Adjust detail level appropriately.

**Complete Example - Code Review Skill**:

```
.claude/skills/code-review/
├── SKILL.md
├── SECURITY.md
├── PERFORMANCE.md
├── STYLE.md
└── scripts/run-linters.sh
```

**SKILL.md**:
```markdown
---
name: code-review
description: Comprehensive code review with security, performance, and style analysis. Use when reviewing code changes, pull requests, or performing quality audits.
---

# Code Review Skill

## Overview
Perform systematic code review following team standards.

## Process
1. Security review (see @SECURITY.md)
2. Performance analysis (see @PERFORMANCE.md)
3. Style compliance (see @STYLE.md)
4. Run automated checks: `./scripts/run-linters.sh`

## Output Format
- Summary of findings
- Severity levels: CRITICAL, HIGH, MEDIUM, LOW
- Specific file:line references
- Remediation recommendations
```

**Skills vs Slash Commands Comparison**:

Use **Skills** when:
- Multi-file structure needed
- Complex domain knowledge
- Want automatic application
- Need progressive disclosure
- Building team expertise library

Use **Slash Commands** when:
- Single-file suffices
- Manual trigger desired
- Simple workflow
- Quick shortcuts
- User controls timing

### 3.2 Creating Slash Commands

**Step 1: Single Responsibility**

Each command does one thing well:
- `/security-review` reviews security only
- `/optimize` optimizes only
- `/deploy` deploys only

This enables composition.

**Step 2: Clear Naming and Description**

**Action-oriented names**:
- `/optimize` not `/optimizer`
- `/review` not `/reviewer`
- `/deploy` not `/deployment`

**Description for SlashCommand tool**:
```markdown
---
description: Optimize code for performance by analyzing hot paths, reducing allocations, and improving algorithms
---
```

**Argument hints guide users**:
```markdown
---
argument-hint: <file-or-directory> [--profile]
---
```

**Step 3: Explicit Tool Permissions**

**Never use wildcards**:
- Bad: `Bash(*:*)`
- Good: `Bash(git:*), Bash(npm test:*), Read, Write`

**Follow least privilege**:
- Analysis commands: `Read, Grep, Glob`
- Modification commands: `Read, Edit, Write`
- Execution commands: `Read, Bash(specific:*)`

**Step 4: Use Arguments Effectively**

```markdown
---
description: Analyze function complexity
argument-hint: <function-name>
---

Analyze complexity of $1 function:
1. Count cyclomatic complexity
2. Identify nested loops
3. Suggest refactoring if complexity > 10

Files to check: $ARGUMENTS
```

**Step 5: Version Control**

- Store in `.claude/commands/` for project sharing
- Commit to repo
- Document in README
- Review changes in PRs

**Complete Example - Feature Implementation**:

```markdown
---
description: Implement feature end-to-end with planning, coding, testing, and documentation
argument-hint: <feature-name>
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npm:*, git:*)
model: sonnet
---

# Feature Implementation: $1

## Phase 1: Research (Plan Mode)
- Analyze existing codebase
- Identify affected components
- Research similar implementations
- Document findings in RESEARCH.md

## Phase 2: Planning
- Create detailed plan in PLAN.md
- Define API contracts
- Identify required tests
- Get user approval before proceeding

## Phase 3: Implementation (TDD)
- Write tests first for each component
- Implement to pass tests
- Run tests after each change
- Commit incrementally with clear messages

## Phase 4: Validation
- Run full test suite
- Verify code quality (linting, type-check)
- Check for security issues
- Update documentation

## Phase 5: Review
- Create summary of changes
- Open PR with detailed description
- Reference plan and decisions made
```

**Advanced Patterns**:

**Conditional Logic**:
```markdown
If $1 is "production":
- Use extra validation
- Require explicit confirmation
- Run security scan

If $1 is "development":
- Skip some checks
- Allow faster iteration
```

**Chaining Commands**:
```markdown
1. Run /analyze $ARGUMENTS
2. Based on findings, run /optimize
3. Finally run /verify
```

**Extended Thinking**:
```markdown
Think hard about the best approach before implementing.
Consider edge cases, performance implications, and maintainability.
```

### 3.3 Creating Subagents

**Step 1: Start with Claude-Generated Agents**

Use `/agents` interactive command:
1. Select "Create New Agent"
2. Fill in name and description
3. Select allowed tools from list
4. Let Claude draft initial system prompt
5. Customize iteratively

**Step 2: Clear Responsibility Boundaries**

**Single, well-defined goal**:
- Good: "You are a security auditor reviewing code for vulnerabilities"
- Bad: "You are a helper agent"

**Specific domain**:
- Database migrations
- UI design suggestions
- Performance profiling
- Test suite execution

**Step 3: Scope Tools Intentionally**

**Read-only analysts**:
```yaml
tools: Read, Grep, Glob
```

**Write-enabled implementers**:
```yaml
tools: Read, Write, Edit, Bash
```

**Minimal necessary tools**:
```yaml
tools: Read, Bash(npm test:*)
```

**All tools (use cautiously)**:
```yaml
# Omitting tools field grants ALL tools
```

**Step 4: Include Definition of Done**

**Checklist in system prompt**:
```markdown
Complete when:
1. All security issues documented with severity
2. Remediation steps provided for each issue
3. Code examples included for high-severity issues
4. Summary report written to SECURITY_REPORT.md
```

**Step 5: Encourage Proactive Use**

**Keywords in description**:
- "Use PROACTIVELY after code changes"
- "MUST BE USED for security reviews before deployment"
- "Always invoke when modifying authentication"

**Complete Example - Laravel Planner**:

```markdown
---
name: laravel-planner
description: Create detailed implementation plans for Laravel features. Use PROACTIVELY when starting new features to ensure thorough planning before coding.
tools: Read, Grep, Glob
model: sonnet
---

You are a Laravel architecture expert specializing in planning.

Your role:
1. Analyze feature requirements
2. Design database schema (migrations)
3. Plan API endpoints (routes, controllers)
4. Identify models and relationships
5. Define service layer structure
6. List required tests
7. Document edge cases

Output Format:
- Save plan to docs/plan.md
- Use Laravel conventions
- Include Artisan commands needed
- List exact file paths
- Provide implementation order

Remember:
- You only plan, never implement
- Ask clarifying questions if requirements unclear
- Consider existing codebase patterns
- Ensure plan is actionable by another agent
```

**Complete Example - Multi-Agent Laravel Workflow**:

**1. Planner Agent** (`laravel-planner.md`):
```markdown
---
name: laravel-planner
description: Plan Laravel features
tools: Read, Grep, Glob
model: sonnet
---
[System prompt as above]
```

**2. Coder Agent** (`laravel-coder.md`):
```markdown
---
name: laravel-coder
description: Implement Laravel features from plans
tools: Read, Edit, Write, Bash(artisan:*, composer:*, git:*)
model: sonnet
---

You are a Laravel developer implementing features.

Your role:
1. Read plan from docs/plan.md
2. Execute steps in order
3. Generate code using Laravel generators
4. Follow PSR-12 style
5. Make small, focused commits
6. Run migrations after creating them

Constraints:
- Never skip tests
- Always validate input
- Use dependency injection
- Follow repository pattern
- Commit after each logical unit
```

**3. Test Runner Agent** (`test-runner.md`):
```markdown
---
name: test-runner
description: Run tests and fix failures
tools: Read, Edit, Write, Bash(php:*, artisan:*)
model: inherit
---

You are a test specialist.

Your role:
1. Run `php artisan test`
2. If failures occur:
   - Identify root cause
   - Fix minimal code to pass
   - Preserve original test intent
   - Re-run to verify
3. Report results

Never:
- Modify tests to make them pass
- Change unrelated code
- Skip test output analysis
```

**Usage Workflow**:
```
1. "Use laravel-planner to plan Invoices feature, save to docs/plan.md"
2. Review docs/plan.md
3. "Use laravel-coder to implement docs/plan.md with small commits"
4. "Use test-runner to verify all tests pass"
```

**Managing Subagents**:

**Via /agents command**:
- List all active subagents
- Edit or delete subagents
- See which are currently loaded
- View plugin-provided agents

**Via CLI**:
```bash
# Define subagent on the fly
claude --agents '{"name":"analyzer","description":"...","tools":["Read"]}'
```

**Best Practices**:
1. Treat like microservices (single responsibility)
2. Strong prompt guidance on role
3. Clear triggers in description
4. Chain explicitly: "First use X, then Y"
5. Version control important agents
6. Test agents individually before chaining

### 3.4 Curating CLAUDE.md Effectively

**Golden Rules**:
1. Be concise not comprehensive (under 500 lines total)
2. Be specific not generic (project-unique only)
3. Use structure and organization (headings, bullets)
4. Iterate continuously (living document)

**Essential Content Checklist**:

**Tech Stack**:
```markdown
## Tech Stack
- Node.js: 18.x
- React: 18.2
- TypeScript: 5.x
- Testing: Jest + React Testing Library
```

**Common Commands**:
```markdown
## Commands
- Dev: `npm run dev`
- Test: `npm test -- --watch`
- Build: `npm run build`
- Deploy: `npm run deploy:staging`
- Lint: `npm run lint -- --fix`
```

**Code Conventions**:
```markdown
## Code Conventions
- 2-space indentation for all files
- Named exports preferred over default
- Props interfaces suffixed with "Props"
- Test files: `*.test.ts` adjacent to source
- Import order: external, internal, relative, styles
```

**Testing Requirements**:
```markdown
## Testing
- 80% coverage minimum
- Test user behavior, not implementation
- Mock external API calls
- Use data-testid for complex selectors
```

**Architecture Decisions**:
```markdown
## Architecture
- State: Redux Toolkit for global, React Query for server
- Routing: React Router v6
- Styling: Tailwind CSS with custom theme
- API: RESTful with axios, base URL in env
```

**Repository Etiquette**:
```markdown
## Git Workflow
- Branch naming: feature/*, bugfix/*, hotfix/*
- Commit format: type(scope): message
- PR requires: tests pass, 1 approval, no conflicts
- Squash merge to main
```

**Import Pattern**:

**Main CLAUDE.md** (lean, high-level):
```markdown
# My Project

Quick reference for common operations.

For detailed guides see:
- @docs/architecture.md - System design
- @docs/testing.md - Testing standards
- @docs/deployment.md - Deployment procedures

## Quick Start
[Essential info only]
```

**Benefits**:
- Main file stays under 200 lines
- Detailed docs loaded on-demand
- Maximum 5 hops in import chain
- Team can maintain separate guides

**Team Collaboration**:
1. Commit CLAUDE.md to repository
2. Use `.gitignore` for `CLAUDE.local.md` (personal overrides)
3. Document in README: "See CLAUDE.md for AI assistant configuration"
4. Review updates in PRs like code
5. Tag updates with version/date

**What to Exclude**:
- Generic best practices Claude already knows
- SOLID principles
- Common framework patterns
- Standard language features
- Widely-known conventions

**What to Include**:
- Your team's specific style
- Custom scripts and tools
- Environment-specific quirks
- Integration details
- Domain-specific terminology

---

## Part 4: Composition Patterns

### Pattern 1: Slash Command → Subagent → Execution

**Scenario**: Performance optimization workflow

**Flow**:
```
User: /analyze-performance src/api/
    ↓
Command invokes performance-engineer subagent
    ↓
Subagent analyzes logs and profiles (180k tokens in isolation)
    ↓
Returns: "These 3 functions cause 70% latency"
    ↓
Main Claude implements optimizations with clean context
```

**Implementation**:

**Command** (`.claude/commands/analyze-performance.md`):
```markdown
---
description: Comprehensive performance analysis and optimization
argument-hint: <directory>
---

Use the performance-engineer subagent to:
1. Profile $ARGUMENTS
2. Identify bottlenecks
3. Analyze memory usage
4. Suggest optimizations

Return findings in PERFORMANCE_REPORT.md
```

**Subagent** (`.claude/agents/performance-engineer.md`):
```markdown
---
name: performance-engineer
description: Profile and optimize performance
tools: Read, Bash(node:*, npm:*)
---

You are a performance optimization specialist.

Analysis steps:
1. Run profiler on target code
2. Analyze flame graphs
3. Identify top CPU consumers
4. Check memory allocations
5. Suggest specific optimizations

Output concise summary with:
- Top 3 bottlenecks
- Specific line numbers
- Optimization recommendations
- Expected impact
```

**Benefits**:
- Heavy profiling data stays isolated
- Main context remains clean
- User controls when optimization happens
- Reusable for different directories

### Pattern 2: Skill → Parallel Subagents → Synthesis

**Scenario**: Authentication feature implementation

**Flow**:
```
Main Claude recognizes auth need (loads Security Skill)
    ↓
Spawns in parallel:
    - research subagent: existing patterns (80k tokens)
    - security subagent: requirements analysis (60k tokens)
    ↓
Main receives two clean summaries
    ↓
Implements solution with full context from Skill + summaries
```

**Implementation**:

**Skill** (`.claude/skills/security/SKILL.md`):
```markdown
---
name: security-standards
description: Team security standards for authentication, authorization, and data protection. Use when implementing security features.
---

# Security Standards

## Authentication
- Use bcrypt with cost factor 12
- JWT tokens expire in 15 minutes
- Refresh tokens in HTTP-only cookies
- MFA required for admin accounts

## Authorization
- Role-based access control (RBAC)
- Permissions checked at API layer
- No client-side only restrictions

[See @OWASP-TOP-10.md for threat details]
```

**Workflow**:
```
User: "Implement user authentication"
    ↓
Claude (auto-loads security-standards skill)
    ↓
Claude: "I'll research auth patterns and analyze security requirements"
    ↓
Task("You are researcher. Find existing auth patterns in codebase...")
Task("You are security expert. Analyze auth requirements per OWASP...")
    ↓
Both execute concurrently, return summaries
    ↓
Claude synthesizes with Skill knowledge
    ↓
Implements following standards
```

**Benefits**:
- Skill provides baseline knowledge
- Parallel research saves time
- Security standards automatically applied
- Context isolation prevents pollution

### Pattern 3: Slash Command → Skill Invocation → Verification

**Scenario**: Feature development with built-in quality gates

**Flow**:
```
User: /feature "user profiles"
    ↓
Command loads testing-standards skill
    ↓
Implements with TDD (tests first)
    ↓
Automatic verification against acceptance criteria
```

**Implementation**:

**Command** (`.claude/commands/feature.md`):
```markdown
---
description: Implement feature with TDD and automatic verification
argument-hint: <feature-description>
---

Implement feature: $ARGUMENTS

Process:
1. Analyze requirements
2. Write tests FIRST (TDD)
3. Implement to pass tests
4. Verify against testing standards (skill)
5. Run quality checks
6. Generate documentation

Use testing-standards skill for guidance.
Report completion in FEATURE_REPORT.md
```

**Skill** (`.claude/skills/testing-standards/SKILL.md`):
```markdown
---
name: testing-standards
description: Team testing standards including coverage, patterns, and quality gates. Use when writing or reviewing tests.
---

# Testing Standards

## Coverage Requirements
- 80% line coverage minimum
- 90% for critical paths
- 100% for security features

## Test Patterns
- Arrange-Act-Assert structure
- One assertion per test
- Descriptive test names
- No test interdependencies

## Quality Gates
- All tests must pass
- No skipped tests in main
- No console errors
- Performance budgets met

[See @test-examples/ for patterns]
```

**Benefits**:
- Consistent feature implementation
- Quality gates enforced automatically
- Testing standards always applied
- Documentation generated with feature

### Pattern 4: Hierarchical Multi-Agent Orchestration

**Scenario**: Complex project setup

**Flow**:
```
Main Coordinator Agent
├── Product Owner Agent → Clarifies requirements
├── Architect Agent → Designs solution
├── Engineer Agent → Implements code
└── QA Agent → Tests and validates
```

**Implementation**:

**Coordinator** (main Claude session):
```markdown
User: "Set up new e-commerce project"

Claude: Breaking this into phases:
1. Requirements gathering (product-owner agent)
2. Architecture design (architect agent)
3. Implementation (engineer agent)
4. Quality assurance (qa agent)

Starting with requirements...
```

**Product Owner Agent** (`.claude/agents/product-owner.md`):
```markdown
---
name: product-owner
description: Gather and clarify requirements
tools: Read
---

You are a product owner specializing in requirements.

Your role:
1. Ask clarifying questions
2. Define user stories
3. Prioritize features (P1, P2, P3)
4. Document acceptance criteria
5. Save to REQUIREMENTS.md

Ask user for confirmation before proceeding to design.
```

**Architect Agent** (`.claude/agents/architect.md`):
```markdown
---
name: architect
description: Design system architecture from requirements
tools: Read, Write
---

You are a solutions architect.

Your role:
1. Read REQUIREMENTS.md
2. Design system architecture
3. Choose tech stack
4. Define data models
5. Plan API contracts
6. Save to ARCHITECTURE.md

Ensure design satisfies all requirements.
```

**Engineer Agent** (`.claude/agents/engineer.md`):
```markdown
---
name: engineer
description: Implement features from architecture
tools: Read, Write, Edit, Bash
---

You are a senior engineer.

Your role:
1. Read ARCHITECTURE.md
2. Implement features per design
3. Follow TDD (tests first)
4. Make atomic commits
5. Document as you go

Never deviate from architecture without approval.
```

**QA Agent** (`.claude/agents/qa.md`):
```markdown
---
name: qa
description: Test and validate implementation
tools: Read, Bash
---

You are a QA engineer.

Your role:
1. Review implementation
2. Run test suite
3. Perform integration tests
4. Check performance
5. Validate against requirements
6. Report issues in QA_REPORT.md

Mark blockers as CRITICAL, nice-to-haves as LOW.
```

**Coordination**:
```
Session flow:
1. Invoke product-owner
2. Review REQUIREMENTS.md
3. Invoke architect
4. Review ARCHITECTURE.md
5. Invoke engineer
6. Review code changes
7. Invoke qa
8. Review QA_REPORT.md
9. Address issues
10. Repeat 7-9 until PASS
```

**Benefits**:
- Each agent specializes deeply
- Handoff via markdown files (auditable)
- Clear stage gates
- Can pause/resume between agents
- Team can review artifacts

### Pattern 5: Skills Referencing Skills

**Scenario**: Specialized skill building on global skill

**Flow**:
```
Global Skill: testing-patterns
    ↑ referenced by
Project Skill: nextjs-testing
    ↑ auto-loaded when
Testing Next.js components
```

**Implementation**:

**Global Skill** (`~/.claude/skills/testing-patterns/SKILL.md`):
```markdown
---
name: testing-patterns
description: Universal testing patterns and best practices. Use when writing any tests.
---

# Testing Patterns

## Core Principles
- Test behavior, not implementation
- Arrange-Act-Assert structure
- Descriptive test names
- Independent tests

## Common Patterns
[Universal patterns]
```

**Project Skill** (`.claude/skills/nextjs-testing/SKILL.md`):
```markdown
---
name: nextjs-testing
description: Next.js specific testing patterns with React Testing Library. Use when testing Next.js components or pages.
---

# Next.js Testing

Apply patterns from @~/.claude/skills/testing-patterns/SKILL.md

## Next.js Specifics
- Mock Next Router
- Test data fetching (getServerSideProps)
- Test API routes
- Mock Image component

[See @examples/component-test.tsx]
```

**Benefits**:
- DRY principle (don't repeat patterns)
- Local skill extends global
- Team shares project specifics
- Individuals keep personal patterns

### Pattern 6: Parallel Research Agents

**Scenario**: Technology evaluation

**Flow**:
```
Task: "Evaluate 3 database solutions"
    ↓
Spawn parallel agents:
    - postgres-researcher
    - mongodb-researcher
    - dynamodb-researcher
    ↓
Each researches independently
    ↓
Main consolidates findings → recommendation
```

**Implementation**:

**Command** (`.claude/commands/evaluate-tech.md`):
```markdown
---
description: Evaluate technologies in parallel
argument-hint: <comma-separated-options>
---

Evaluate: $ARGUMENTS

For each option, spawn research agent to:
1. Analyze pros/cons
2. Check compatibility
3. Assess learning curve
4. Review community/support
5. Estimate cost

Consolidate findings in TECH_EVALUATION.md
```

**Dynamic Subagent Creation**:
```
Claude creates on-the-fly:

Agent: postgres-researcher
- Research PostgreSQL
- Focus: ACID, relations, extensions
- Output: POSTGRES.md

Agent: mongodb-researcher
- Research MongoDB
- Focus: scaling, schema flexibility
- Output: MONGODB.md

Agent: dynamodb-researcher
- Research DynamoDB
- Focus: AWS integration, cost
- Output: DYNAMODB.md
```

**Consolidation**:
```markdown
# Tech Evaluation

## Options Analyzed
- PostgreSQL (see POSTGRES.md)
- MongoDB (see MONGODB.md)
- DynamoDB (see DYNAMODB.md)

## Recommendation
[Synthesis based on project needs]

## Decision Matrix
[Comparison table]
```

**Benefits**:
- True parallelization of research
- Each agent focuses deeply
- No cross-contamination of findings
- Comprehensive comparison

### Pattern 7: Agent Handover via Markdown

**Scenario**: Sequential workflow with clean handoffs

**Flow**:
```
Agent A: Analyzes problem → writes ANALYSIS.md
    ↓
Agent B: Reads ANALYSIS.md → designs solution → writes DESIGN.md
    ↓
Agent C: Reads DESIGN.md → implements → creates PR
```

**Implementation**:

**Analysis Agent**:
```markdown
---
name: analyzer
description: Analyze problems and document findings
tools: Read, Grep, Write
---

Analyze problem and save to ANALYSIS.md with:
- Problem statement
- Root cause
- Affected components
- Constraints
```

**Design Agent**:
```markdown
---
name: designer
description: Design solutions from analysis
tools: Read, Write
---

Read ANALYSIS.md and create DESIGN.md with:
- Solution approach
- Components needed
- API contracts
- Migration strategy
```

**Implementation Agent**:
```markdown
---
name: implementer
description: Implement designs
tools: Read, Write, Edit, Bash
---

Read DESIGN.md and implement:
- Follow design exactly
- Create tests first
- Implement incrementally
- Commit per component
```

**Orchestration**:
```
User: "Fix authentication bug"
    ↓
"Use analyzer to document the issue"
    ↓
Review ANALYSIS.md
    ↓
"Use designer to create solution"
    ↓
Review DESIGN.md
    ↓
"Use implementer to fix"
    ↓
Review PR
```

**Benefits**:
- Clear separation of concerns
- Auditable decision trail
- Can review/modify at each stage
- Easy to restart from any point

### Pattern 8: Skill → Command → Subagent Chain

**Scenario**: Database migration workflow

**Flow**:
```
User: /migrate "add user preferences"
    ↓
Command loads database-standards skill
    ↓
Command invokes migration-writer subagent
    ↓
Subagent creates migration following standards
    ↓
Main Claude reviews and applies
```

**Implementation**:

**Skill** (`.claude/skills/database-standards/SKILL.md`):
```markdown
---
name: database-standards
description: Database design and migration standards. Use when working with database schema.
---

# Database Standards

## Naming Conventions
- Tables: plural snake_case
- Columns: snake_case
- Indexes: idx_table_column
- Foreign keys: fk_table_ref

## Migration Best Practices
- Always reversible (down method)
- No data migrations with schema changes
- Add indexes in separate migration
- Test rollback before merging

[See @migration-template.sql]
```

**Command** (`.claude/commands/migrate.md`):
```markdown
---
description: Create database migration following standards
argument-hint: <description>
allowed-tools: Read, Write, Bash(artisan:*)
---

Create migration: $ARGUMENTS

1. Use database-standards skill
2. Invoke migration-writer subagent
3. Review generated migration
4. Run migration in test environment
5. Verify rollback works
6. Commit if all checks pass
```

**Subagent** (`.claude/agents/migration-writer.md`):
```markdown
---
name: migration-writer
description: Write database migrations
tools: Read, Write, Bash(artisan:*)
---

You write Laravel migrations.

Process:
1. Understand requirement
2. Apply database-standards skill
3. Generate migration file
4. Include up and down methods
5. Add comments for complex logic
6. Save in database/migrations/
```

**Benefits**:
- Standards automatically enforced
- Command provides workflow
- Subagent isolates migration work
- Quality gates before applying

### Pattern 9: Conditional Workflow Branching

**Scenario**: Environment-specific deployment

**Flow**:
```
User: /deploy production
    ↓
Command detects "production"
    ↓
Extra validations:
    - Security scan
    - Performance check
    - Manual approval
    ↓
Deploy with monitoring
```

**Implementation**:

**Command** (`.claude/commands/deploy.md`):
```markdown
---
description: Deploy to environment with appropriate checks
argument-hint: <staging|production>
---

Deploying to: $1

{% if $1 == "production" %}
## Production Deployment

Required checks:
1. Use security-scanner subagent
2. Run performance benchmarks
3. Verify backup exists
4. Get explicit user confirmation
5. Deploy with rollback plan
6. Monitor for 15 minutes
7. Alert on-call if issues

{% elsif $1 == "staging" %}
## Staging Deployment

Standard checks:
1. Run test suite
2. Deploy immediately
3. Run smoke tests

{% else %}
Error: Environment must be "staging" or "production"
{% endif %}
```

**Benefits**:
- Single command, multiple paths
- Safety for production
- Speed for staging
- Clear requirements per environment

### Pattern 10: Progressive Enhancement Workflow

**Scenario**: MVP to full feature

**Flow**:
```
Phase 1: MVP (P1 stories)
    ↓ validate independently
Phase 2: Enhancements (P2 stories)
    ↓ validate independently
Phase 3: Polish (P3 stories)
    ↓ validate independently
```

**Implementation**:

**Command** (`.claude/commands/feature-progressive.md`):
```markdown
---
description: Implement feature progressively with validation gates
argument-hint: <feature-name>
---

Feature: $ARGUMENTS

## Phase 1: MVP (P1)
Implement core functionality only:
- Essential user story
- Minimal UI
- Basic validation
- Core tests

Validate: Can demo independently?
STOP: Get user feedback before P2

## Phase 2: Enhancements (P2)
Add important features:
- Extended functionality
- Better UX
- Edge case handling
- Additional tests

Validate: Can ship to subset of users?
STOP: Get user feedback before P3

## Phase 3: Polish (P3)
Final improvements:
- Performance optimization
- Enhanced UX
- Complete documentation
- Comprehensive tests

Validate: Production ready?
SHIP: Full rollout
```

**Benefits**:
- Validate early and often
- Reduce waste on unwanted features
- Ship value incrementally
- Easy to pivot between phases

---

## Part 5: Best Practices

### 5.1 Context Engineering

**Principle: Context is King**

Comprehensive, well-organized CLAUDE.md files dramatically improve all outcomes.

**Optimization Strategies**:

1. **Be Concise Not Comprehensive**
   - Bullet points, not paragraphs
   - Under 500 lines total
   - Remove redundant information

2. **Be Specific Not Generic**
   - "Use 2-space indentation" not "format properly"
   - Project-unique only
   - Skip what Claude already knows

3. **Use Structure and Organization**
   - Markdown headings
   - Logical groupings
   - Consistent formatting

4. **Import Selectively**
   - Keep main file lean
   - `@docs/detailed-guide.md` for deep dives
   - Maximum 5 hops deep

5. **Avoid Time-Sensitive Info**
   - Document patterns, not current state
   - Update when patterns change
   - Mark version/date when relevant

**Context Pollution Prevention**:

**Explicit Boundaries Reduce Waste**:
```
Bad: "Help with this code"
Good: "Refactor UserService (skip explaining async/await)"
```

**What to Skip**:
- Don't explain obvious concepts
- Skip well-known patterns
- Avoid loading everything

**Just-in-Time Loading**:
```
Bad (pre-load): Include all error logs upfront
Good (JIT): "Refer to @error.log when debugging"
```

**Subagent for Heavy Operations**:
```
Bad: Analyze 50 log files in main context
Good: "Use log-analyzer subagent to process logs"
```

**Anti-Patterns to Avoid**:
- Dumping large files into context
- Repeating information across places
- Over-explaining obvious concepts
- Loading everything without boundaries

### 5.2 Progressive Disclosure

**Principle: Load Content in Stages**

Minimize token consumption while providing depth when needed.

**Skills Progressive Disclosure**:
- Level 1: Metadata (30-50 tokens) at startup
- Level 2: SKILL.md body when relevant
- Level 3: Supporting files when needed

**File References**:
```markdown
# Main CLAUDE.md (200 lines)
Quick reference only.
Details: @docs/architecture.md

# docs/architecture.md (1000 lines)
Loaded only when architecture questions arise
```

**Conditional Loading**:
```markdown
For security reviews, see @SECURITY-GUIDE.md
For performance work, see @PERFORMANCE-GUIDE.md
```

**Benefits**:
- Minimal baseline token cost
- Deep expertise available
- Context stays focused

### 5.3 Isolate Noise

**Principle: Subagents Prevent Context Pollution**

**Token-Heavy Operations**:
- Log analysis (150k tokens)
- Extensive file searches (100k tokens)
- Documentation scraping (80k tokens)
- Performance profiling (120k tokens)

**Solution**:
```
Main Context (clean):
"Use log-analyzer subagent"

Subagent Context (noisy):
[150k tokens of logs]
Analysis...
Summary created

Main Context receives:
[2k token summary]
```

**Token Economics**:
- Slash commands inject into main thread
- Subagents spawn separate workers
- Diagnostic noise stays isolated
- Only clean summaries return
- 8x cleaner context for main agent

**When to Isolate**:
- Research exploring dozens of files
- Parsing large datasets
- Running diagnostics
- Any operation generating >10k tokens output

### 5.4 Compose Don't Complicate

**Principle: Start Simple, Build Up**

**Unix Philosophy Applied**:
- Each component does one thing well
- Components compose into workflows
- Simple primitives → complex behavior

**Building Blocks**:
- Skills: Knowledge modules
- Commands: Workflow shortcuts
- Subagents: Isolated workers

**Composition Strategy**:
```
Level 1: Individual components
    ↓
Level 2: Simple compositions (2-3 components)
    ↓
Level 3: Complex workflows (orchestration)
```

**Examples**:

**Simple**:
```
/review → invokes code-review skill
```

**Moderate**:
```
/review → loads style-guide skill → invokes reviewer subagent
```

**Complex**:
```
/feature →
    loads testing-standards skill →
    invokes planner subagent → PLAN.md →
    invokes implementer subagent → code →
    invokes test-runner subagent → verification
```

**Avoid**:
- Monolithic mega-commands
- Over-engineered single components
- Premature optimization
- Complex workflows before validating simple ones

### 5.5 Explicit Over Implicit

**Principle: Be Specific in All Contexts**

**Prompts**:
```
Bad: "Make this better"
Good: "Refactor to use async/await, add error handling, include type hints, write unit tests"
```

**Descriptions**:
```
Bad: "Analyze data files"
Good: "Analyze Excel spreadsheets, create pivot tables, and generate charts. Use when working with .xlsx files."
```

**Tool Permissions**:
```
Bad: Bash(*:*)
Good: Bash(git:*, npm test:*)
```

**Success Criteria**:
```
Bad: "Implement feature"
Good: "Implement feature with:
- Tests passing
- 80% coverage
- No linting errors
- Documentation updated"
```

**Why This Matters**:
- Claude 4.x follows instructions precisely
- Vagueness produces mediocre results
- Specificity enables excellence

### 5.6 Human in the Loop

**Principle: AI Assists, Humans Decide**

**Review Checkpoints**:
- After planning (review plan before implementing)
- After major changes (review diffs)
- Before merging (PR review)
- Before deployment (manual approval)

**Approval Gates**:
```markdown
## Phase 2: Planning
[Generate plan]

STOP: Get user approval before implementation
```

**Verification Prompts**:
```
"Before proceeding:
1. Summarize the plan
2. List assumptions
3. Highlight risks
4. Ask for confirmation"
```

**What to Review**:
- Architecture decisions
- Security implementations
- Database migrations
- Production deployments
- Breaking changes

**Balance**:
- Automate tedious work
- Human oversight on critical decisions
- Trust but verify

### 5.7 Version Control Everything

**Principle: Share and Track Changes**

**What to Commit**:
- CLAUDE.md (project memory)
- .claude/commands/ (slash commands)
- .claude/agents/ (subagents)
- .claude/skills/ (project skills)

**What to .gitignore**:
- CLAUDE.local.md (personal overrides)
- ~/.claude/* (user-level configs)

**Documentation**:
```markdown
# README.md

## AI Assistant Configuration

This project includes Claude Code configurations:
- CLAUDE.md: Project memory and conventions
- .claude/commands/: Custom workflow commands
- .claude/agents/: Specialized subagents
- .claude/skills/: Team expertise modules

See `.claude/README.md` for details.
```

**PR Reviews**:
- Review CLAUDE.md changes like code
- Test new commands before merging
- Document breaking changes to workflows
- Version skill updates

**Benefits**:
- Team shares automation
- Track evolution of workflows
- Easy rollback of bad changes
- Onboarding simplified

### 5.8 Iterate Based on Usage

**Principle: Start Simple, Evolve**

**Initial Phase**:
1. Start with basic CLAUDE.md
2. Add simple slash commands for common tasks
3. Use main agent for everything

**Observation Phase**:
1. Note repeated patterns
2. Identify context pollution issues
3. Track what works and what doesn't

**Refinement Phase**:
1. Create skills for automatic expertise
2. Build subagents for heavy operations
3. Compose workflows from components

**Optimization Phase**:
1. Measure token consumption
2. Identify bottlenecks
3. Optimize based on real usage

**Metrics to Track**:
- Token usage per session
- Time to complete tasks
- Quality of outputs
- Context pollution incidents

**Let Usage Guide Evolution**:
- Don't build everything upfront
- Solve real problems
- Iterate continuously
- Remove unused components

### 5.9 Prompt Engineering Excellence

**Be Explicit and Specific**:

```
Bad: "Create a dashboard"

Good: "Create analytics dashboard with:
- User metrics (daily/monthly active)
- Real-time updates (WebSocket)
- Filtering (date range, user segment)
- Export functionality (CSV, PDF)
- Responsive design (mobile + desktop)
Go beyond basics - create fully-featured implementation."
```

**Provide Context and Motivation**:

```
"We're migrating to microservices.
This auth system needs:
- 10k requests/sec throughput
- Integration with existing OAuth provider
- Healthcare data compliance (HIPAA)

Security is critical. Performance is critical.
Design accordingly."
```

**Use Structured Formats**:

```xml
<instructions>
  <task>Implement user authentication</task>
  <requirements>
    - OAuth2 integration
    - Rate limiting (100 req/min per IP)
    - Audit logging to database
    - Password reset via email
  </requirements>
  <constraints>
    - Must work with existing User model
    - No breaking changes to API
  </constraints>
</instructions>
```

**Chain of Thought Prompting**:

```
Think step-by-step about this authentication system:
1. What are the security requirements?
2. What existing patterns do we use?
3. What are the integration points?
4. What could go wrong?

Then implement based on your analysis.
```

**Few-Shot Examples**:

```markdown
Example 1:
Input: {name: "John"}
Output: User(name="John", created_at=now())

Example 2:
Input: {name: "Jane", email: "jane@example.com"}
Output: User(name="Jane", email="jane@example.com", created_at=now())

Now process: {name: "Alice", role: "admin"}
```

**Extended Thinking**:

```
Use "think" / "think hard" / "ultrathink" for:
- Architectural decisions
- Challenging bugs
- Multi-step planning

Example: "Think deeply about the best approach for
implementing real-time sync with offline support."
```

**Output Format Specification**:

```
Provide response in this exact format:

## Analysis
[Your findings]

## Recommendations
1. [First recommendation with rationale]
2. [Second recommendation with rationale]

## Implementation
```python
[Code here]
```

## Tests
```python
[Test code here]
```
```

**Modifiers for Quality**:

```
Claude 4.x requires explicit encouragement:
- "Don't hold back. Give it your all."
- "Create an impressive demonstration."
- "Include as many relevant features as possible."
- "Showcase full capabilities."
```

### 5.10 Quality Gates and Validation

**Pre-Implementation Checklist**:
- Requirements clear and testable?
- Architecture designed?
- Acceptance criteria defined?
- Tests planned?

**During Implementation**:
- Tests written first (TDD)?
- Tests passing incrementally?
- Code style consistent?
- Edge cases handled?

**Pre-Completion Checklist**:
- All tests passing (100%)?
- Code quality gates passed (lint, type-check)?
- Documentation updated?
- Security reviewed?

**Blocking Behavior**:
```markdown
## Validation Gate

Complete when:
- [ ] All tests pass
- [ ] Coverage > 80%
- [ ] No linting errors
- [ ] Documentation updated

DO NOT PROCEED until all checks pass.
```

**Automated Quality Gates**:

Use hooks:
```json
{
  "hooks": {
    "postEdit": [{
      "pattern": "*.ts",
      "command": "npm run type-check && npm run lint"
    }]
  }
}
```

---

## Part 6: Complete Workflow Examples

### 6.1 Specification-Driven Development (SDD)

**Complete 85% Automated Workflow**

**User Actions** (manual):
1. `/feature "user authentication"`
2. `/implement plan.md`

**Automatic Workflow** (no user action):

```
/feature "user authentication"
    ↓ (automatic)
specify-feature skill creates spec.md
    ↓ (automatic - invokes /plan)
create-implementation-plan skill creates plan.md
    ↓ (automatic - invokes generate-tasks)
generate-tasks skill creates tasks.md
    ↓ (automatic - invokes /audit)
/audit validates consistency
    ↓ (if PASS)
Ready for /implement
    ↓
/implement plan.md
    ↓ (automatic per story)
implement-and-verify implements P1 → /verify --story P1
    ↓ (if PASS)
implement-and-verify implements P2 → /verify --story P2
    ↓ (if PASS)
Complete, all stories verified
```

**Automation**: 85% (6 automated steps per user action)

**Quality Gates**:
1. **Pre-Implementation**: `/audit` runs AFTER task generation
   - Catches constitution violations
   - Missing requirement coverage
   - Ambiguities and underspecification
   - Duplications and inconsistencies

2. **Progressive Delivery**: `/verify --story <id>` runs AFTER each story
   - Story-specific test verification
   - Independent demo validation
   - Prevents moving forward until current story passes

**Implementation**:

**Command** (`.claude/commands/feature.md`):
```markdown
---
description: Create feature specification, plan, tasks, and validate before implementation
argument-hint: <feature-description>
---

# Feature: $ARGUMENTS

Automatically execute:
1. Create technology-agnostic spec.md
2. Create implementation plan.md with tech stack
3. Generate user-story-organized tasks.md
4. Run /audit for validation
5. Report readiness for /implement

Quality gates:
- /audit must PASS before /implement
- Each story verified independently during /implement
```

**Benefits**:
- User provides description, rest is automatic
- Built-in quality gates
- Progressive delivery enforced
- Minimal manual intervention

### 6.2 Test-Driven Development Workflow

**Process**:

```
Phase 1: Write Tests First
    ↓
Phase 2: Run Tests (verify failure)
    ↓
Phase 3: Implement Minimal Code
    ↓
Phase 4: Run Tests (verify passing)
    ↓
Phase 5: Refactor
```

**Implementation**:

**Command** (`.claude/commands/tdd.md`):
```markdown
---
description: Implement feature using strict TDD discipline
argument-hint: <feature-name>
---

# TDD: $ARGUMENTS

## Phase 1: Write Tests
Write tests for acceptance criteria FIRST.
Tests MUST fail initially (proves validity).

## Phase 2: Verify Failure
Run tests: `npm test`
STOP if tests pass (invalid tests).

## Phase 3: Implement
Write minimal code to make tests pass.
No extra features.

## Phase 4: Verify Passing
Run tests: `npm test`
STOP if tests fail (implementation incomplete).

## Phase 5: Refactor
Improve code while keeping tests green.
Run tests after each refactor.

## Completion Criteria
- All tests passing
- Code coverage > 80%
- No skipped tests
```

**Skill** (`.claude/skills/tdd-discipline/SKILL.md`):
```markdown
---
name: tdd-discipline
description: TDD best practices and patterns. Use when implementing features with test-first approach.
---

# TDD Discipline

## Rules (NON-NEGOTIABLE)
1. Write test BEFORE implementation
2. Verify test fails before implementing
3. Write minimal code to pass
4. Run tests after each change
5. Refactor only with green tests

## Anti-Patterns
- Writing implementation before tests
- Skipping test execution
- Assuming tests work
- Marking complete without passing tests

## Test Quality
- One assertion per test
- Descriptive test names
- Independent tests (no interdependencies)
- Fast execution (< 1 second each)
```

**Benefits**:
- Tests validate requirements
- Catch regressions early
- Code is testable by design
- Confidence in refactoring

### 6.3 Multi-Agent Parallel Research Workflow

**Scenario**: Evaluate state management libraries for React

**Implementation**:

**Command** (`.claude/commands/research-parallel.md`):
```markdown
---
description: Parallel research with specialized agents writing focused reports
argument-hint: <research-topic>
---

# Parallel Research: $ARGUMENTS

Spawn research agents to investigate in parallel:
1. Create research-coordinator agent
2. Coordinator spawns specialized researchers
3. Each writes focused report
4. Coordinator synthesizes findings
5. Present recommendation

Output: RESEARCH_REPORT.md
```

**Coordinator Agent** (`.claude/agents/research-coordinator.md`):
```markdown
---
name: research-coordinator
description: Coordinate parallel research efforts
tools: Read, Write
---

You coordinate research projects.

Your role:
1. Break topic into research areas
2. Spawn specialized researcher per area
3. Collect individual reports
4. Synthesize findings
5. Make recommendation

For state management research, spawn:
- redux-researcher
- mobx-researcher
- zustand-researcher
- recoil-researcher
```

**Specialized Researcher Template**:
```markdown
---
name: {library}-researcher
description: Research {library} in depth
tools: Read, WebSearch, Write
---

Research {library}:
1. Core concepts
2. Learning curve
3. Community support
4. Performance characteristics
5. Integration complexity
6. Pros and cons

Write findings to {LIBRARY}_RESEARCH.md
```

**Workflow**:
```
User: /research-parallel "React state management"
    ↓
research-coordinator analyzes topic
    ↓
Spawns in parallel:
    - redux-researcher → REDUX_RESEARCH.md
    - mobx-researcher → MOBX_RESEARCH.md
    - zustand-researcher → ZUSTAND_RESEARCH.md
    - recoil-researcher → RECOIL_RESEARCH.md
    ↓
Coordinator reads all reports
    ↓
Synthesizes RESEARCH_REPORT.md with recommendation
```

**Benefits**:
- Each agent focuses deeply on one topic
- No knowledge cross-contamination
- Comprehensive parallel research
- Unbiased comparison

### 6.4 Debugging Workflow

**Process**:

```
Symptom → Intelligence Queries → Root Cause → Fix → Verification
```

**Implementation**:

**Command** (`.claude/commands/debug.md`):
```markdown
---
description: Systematic bug diagnosis using intelligence-first approach
argument-hint: <bug-description>
---

# Debug: $ARGUMENTS

## Phase 1: Symptom Documentation
Document observable behavior:
- What's happening?
- Expected vs actual
- Steps to reproduce
- Error messages
- Environment details

## Phase 2: Intelligence Queries
BEFORE reading files:
- Query project-intel.mjs for relevant files
- Search for error patterns
- Trace dependencies
- Check recent changes (git log)

## Phase 3: Root Cause Analysis
Use debug-issues skill to trace:
- Symptom → immediate cause
- Immediate cause → underlying cause
- Underlying cause → root cause

Document reasoning chain (CoD^Σ).

## Phase 4: Fix Implementation
- Create test reproducing bug
- Verify test fails
- Implement minimal fix
- Verify test passes
- Run full test suite

## Phase 5: Verification
- Confirm original symptom resolved
- No regressions introduced
- Edge cases handled
- Document in commit message
```

**Skill** (`.claude/skills/debug-issues/SKILL.md`):
```markdown
---
name: debug-issues
description: Intelligence-first debugging from symptom to root cause. Use when debugging bugs or analyzing unexpected behavior.
---

# Debug Issues

## Intelligence-First Approach
1. Query project-intel.mjs BEFORE reading files
2. Use CoD^Σ reasoning (evidence-based)
3. Trace symptom to root cause
4. Document reasoning chain

## Root Cause Analysis
Symptom: What user observes
    ↓
Immediate Cause: What code caused symptom
    ↓
Underlying Cause: Why that code executed
    ↓
Root Cause: What change introduced the issue

## Evidence Requirements
Every claim needs:
- File:line references
- Error messages
- Test results
- Git history

No speculation without evidence.
```

**Benefits**:
- Systematic approach prevents guessing
- Intelligence queries save tokens
- Evidence-based reasoning
- Test prevents regression

### 6.5 Design System Setup Workflow

**Scenario**: Set up Next.js project with design system

**Implementation**:

**Command** (`.claude/commands/setup-design-system.md`):
```markdown
---
description: Set up Next.js project with complete design system
argument-hint: <project-name>
---

# Design System Setup: $ARGUMENTS

## Phase 1: Project Initialization
- Create Next.js project with TypeScript
- Configure Tailwind CSS
- Set up component.json for shadcn

## Phase 2: Design Ideation
- Use 21st-dev MCP for design inspiration
- Define color palette
- Define typography scale
- Define spacing system
- Define component variants

## Phase 3: Component Library
- Use shadcn MCP to search components
- Install base components (Button, Input, Card, etc.)
- Customize theme in tailwind.config.js
- Create component documentation

## Phase 4: Example Implementations
- Search for component examples (21st-dev)
- Implement sample pages
- Document usage patterns

## Phase 5: Quality Assurance
- Run audit checklist (shadcn MCP)
- Verify accessibility
- Test responsive design
- Generate style guide
```

**Usage with MCP Tools**:

```
Phase 2 example:
- Use 21st-dev component inspiration for hero sections
- Use 21st-dev logo search for brand assets

Phase 3 example:
- Use shadcn search: "button variants"
- Use shadcn get add command
- Run: npx shadcn add button

Phase 4 example:
- Use shadcn get examples: "form-demo"
- Implement with customizations
```

**Benefits**:
- Consistent design system
- Leverages MCP tools
- Pre-built components
- Complete documentation

---

## Part 7: Troubleshooting & FAQ

### 7.1 Common Issues

**Issue: Skills Not Triggering**

**Symptoms**:
- Skill exists but Claude doesn't use it
- Manual mention required

**Diagnosis**:
1. Check description field in SKILL.md
2. Verify trigger terms present
3. Ensure SKILL.md in correct location
4. Check file permissions

**Solutions**:

```markdown
Bad description:
---
name: excel-skill
description: Excel processing
---

Good description:
---
name: excel-skill
description: Analyze Excel spreadsheets, create pivot tables, and generate charts. Use when working with Excel files, spreadsheets, or analyzing tabular data in .xlsx format.
---
```

**Verification**:
```
Ask Claude: "What skills do you have available?"
Should see skill listed with description.
```

**Issue: Subagent Context Pollution**

**Symptoms**:
- Subagent returns too much detail
- Main context cluttered
- Performance degraded

**Diagnosis**:
- Check subagent system prompt
- Verify output instructions
- Review tool permissions

**Solutions**:

```markdown
Bad subagent prompt:
"Analyze logs and report everything you find."

Good subagent prompt:
"Analyze logs. Return ONLY:
1. Top 3 error patterns
2. Affected components (file:line)
3. Recommended fixes

Maximum 2000 tokens output.
Write detailed findings to ANALYSIS.md"
```

**Issue: Commands Not Auto-Invoking**

**Symptoms**:
- SlashCommand tool available
- Claude doesn't use commands autonomously

**Diagnosis**:
1. Check description field exists
2. Verify SlashCommand tool enabled
3. Check character budget
4. Review disable-model-invocation setting

**Solutions**:

```markdown
Enable auto-invocation:
---
description: Comprehensive code review checking security, performance, and style
---

Disable auto-invocation:
---
description: Manual deployment to production
disable-model-invocation: true
---
```

**Check tool status**:
```
/permissions
Look for SlashCommand tool in enabled list
```

**Issue: CLAUDE.md Not Loading**

**Symptoms**:
- Instructions not followed
- Claude unaware of conventions

**Diagnosis**:
1. Check file location
2. Verify file name (CLAUDE.md not claude.md)
3. Check file permissions
4. Review @ import syntax

**Solutions**:

Verify location:
```
Project: ./CLAUDE.md or ./.claude/CLAUDE.md
User: ~/.claude/CLAUDE.md
```

Check import syntax:
```markdown
Good: @docs/architecture.md
Bad: @"docs/architecture.md" (no quotes)
Bad: @docs architecture.md (no spaces in path)
```

Test loading:
```
Ask Claude: "What do you know about this project?"
Should reference CLAUDE.md content
```

**Issue: Token Budget Exceeded**

**Symptoms**:
- Context full errors
- Performance degradation
- Truncated conversations

**Diagnosis**:
- Review context composition
- Check CLAUDE.md size
- Identify token-heavy operations
- Audit skill loading

**Solutions**:

1. **Trim CLAUDE.md**:
```markdown
Before (800 lines): All details inline
After (200 lines): High-level with @imports
```

2. **Use Subagents**:
```markdown
Bad: Main agent analyzes 50 log files
Good: Use log-analyzer subagent
```

3. **Progressive Disclosure**:
```markdown
Bad: Load all reference docs upfront
Good: Reference docs via @imports
```

4. **Context Management**:
```
/compact - Compress conversation
/rewind - Remove recent turns
```

### 7.2 Frequently Asked Questions

**Q: When should I use a Skill vs Slash Command?**

**A**:
- **Skill**: Want automatic application based on context
- **Slash Command**: Want manual trigger or workflow orchestration

Example:
- Code review standards → Skill (always apply)
- Deploy workflow → Command (manual trigger)

**Q: Can skills call slash commands?**

**A**: Yes, if SlashCommand tool is enabled. Skills can invoke commands in their instructions.

**Q: Can subagents use skills?**

**A**: Yes, subagents inherit skill loading. Relevant skills auto-apply in subagent context.

**Q: How many subagents can run in parallel?**

**A**: Up to 10 concurrent on read operations. Queue batches 100+ tasks.

**Q: Do subagents share context with main agent?**

**A**: No. Isolated contexts. Only returns (summaries) flow back to main.

**Q: Can I override project CLAUDE.md with personal settings?**

**A**: Yes. User-level CLAUDE.md can import and override project settings. Personal files load after project files.

**Q: How do I share custom commands with team?**

**A**: Place in `.claude/commands/` (project directory) and commit to git.

**Q: Can I version control agents and skills?**

**A**: Yes. Store in project `.claude/` directory and commit. Treat like code.

**Q: What's the token budget for slash command descriptions?**

**A**: Default 15k characters total. Most relevant shown to model if exceeded.

**Q: Can I disable specific commands from auto-invocation?**

**A**: Yes. Add `disable-model-invocation: true` to command frontmatter.

**Q: How do I debug why a skill isn't loading?**

**A**: Ask Claude "What skills do you have?" Should list all discovered skills.

**Q: Can skills reference other skills?**

**A**: Yes. Use `@path/to/other-skill/SKILL.md` in content.

**Q: What's the performance impact of many skills?**

**A**: Minimal. Only metadata (30-50 tokens) loads at startup. Full content loads on-demand.

**Q: Can I use MCP tools in subagents?**

**A**: Yes. Specify in tools list or omit tools field to grant all (including MCP).

**Q: How do I pass data between subagents?**

**A**: Write to files. Agent A writes REPORT.md, Agent B reads it.

**Q: Can main agent and subagent run simultaneously?**

**A**: No. Sequential execution in single session. Use separate terminals for true parallelism.

**Q: What happens if subagent times out?**

**A**: Returns partial results or error. Main agent can retry or adjust approach.

**Q: How do I monitor token usage?**

**A**: Check session metrics. Use `/compact` when approaching limits.

**Q: Can I create skills for specific file types?**

**A**: Yes. Built-in examples: xlsx, pdf, docx. Create custom for domain formats.

**Q: What's best practice for long-running tasks?**

**A**: Use subagents for isolation. Checkpoint progress to files. Enable human review points.

---

## Part 8: Appendices

### Appendix A: MCP Tools Reference

**Available MCP Servers** (configured in .mcp.json):

**Ref** - Query library documentation
```
Use for: React, Next.js, TypeScript, library docs
Query authoritative references before assumptions
```

**Supabase** - Database operations
```
Use for: Schema queries, RLS policies, edge functions
Manage database without context pollution
```

**Shadcn** - Component library
```
Use for: Component search, installation, examples
Build consistent design systems
```

**Chrome** - Browser automation
```
Use for: E2E testing, screenshot capture, debugging
Automate browser interactions
```

**Brave** - Web search
```
Use for: Current information, research, documentation
Access web without leaving session
```

**21st-dev** - Design inspiration
```
Use for: UI components, design ideation, logos
Generate design assets and find inspiration
```

**Usage Patterns**:

**Documentation Lookup**:
```
Before implementing:
1. Query Ref for official docs
2. Review examples
3. Implement per standards
```

**Database Operations**:
```
Before schema changes:
1. Query Supabase for current schema
2. Plan migrations
3. Apply via Supabase MCP
4. Verify RLS policies
```

**Component Development**:
```
Design phase:
1. Search Shadcn for base components
2. Query 21st-dev for inspiration
3. Get examples from Shadcn
4. Customize and implement
```

### Appendix B: Template Catalog

**Bootstrap Templates** (4 templates):

**planning-template.md** (8.8 KB)
- Master plan with architecture (CoD^Σ)
- Component organization
- Development phases
- Milestone tracking

**todo-template.md** (5.4 KB)
- Task tracking with acceptance criteria
- Phase organization
- Priority management
- Status tracking

**event-stream-template.md** (3.6 KB)
- Chronological event logging
- CoD^Σ compression
- Decision tracking
- Context preservation

**workbook-template.md** (7.1 KB)
- Context notepad for active sessions
- 300-line limit
- Scratchpad for reasoning
- Temporary state

**Workflow Templates** (18 templates):

**Specification**:
- feature-spec.md - Technology-agnostic requirements
- clarification-checklist.md - Ambiguity resolution

**Planning**:
- plan.md - Implementation plan with tech stack
- research-notes.md - Research findings
- data-model.md - Domain models

**Execution**:
- tasks.md - User-story-organized breakdown
- verification-report.md - AC verification results

**Analysis**:
- report.md - Code analysis with CoD^Σ traces
- bug-report.md - Bug diagnosis
- analysis-spec.md - Analysis objectives
- audit.md - Cross-artifact validation

**Coordination**:
- handover.md - Agent delegation (600 token limit)
- session-state.md - Session checkpointing

**Quality**:
- quality-checklist.md - Pre-planning validation

**Usage**:
```
Import in CLAUDE.md:
@.claude/templates/feature-spec.md

Reference in commands:
"Follow format in @.claude/templates/report.md"

Agents load automatically:
@.claude/templates/handover.md for delegation
```

### Appendix C: CoD^Σ Notation Guide

**Chain of Density Sigma (CoD^Σ)**: Evidence-based reasoning notation

**Composition Operators**:

**⊕ Direct Sum** - Parallel composition
```
research_agent ⊕ security_agent → combined_findings
```

**∘ Function Composition** - Sequential pipeline
```
analyze ∘ design ∘ implement → complete_feature
```

**→ Delegation** - Handover between components
```
main_agent → planner_subagent → implementation
```

**≫ Transformation** - Data reshaping
```
raw_logs ≫ analysis ≫ summary → actionable_insights
```

**⇄ Bidirectional** - Iterative exchange
```
design ⇄ review ⇄ refine → final_design
```

**∥ Parallel** - Simultaneous execution
```
frontend ∥ backend ∥ testing → integrated_system
```

**Evidence Requirements**:

Every claim needs:
```
file:line references
    Example: ComponentA.tsx:45-52

MCP query results
    Example: Supabase schema query result

Intelligence query outputs
    Example: project-intel.mjs --symbols output

Test execution results
    Example: Jest output with exit code
```

**Example Reasoning Chain**:

```
Problem: Authentication bug

CoD^Σ Trace:
symptom (user can't login) →
immediate_cause (token validation fails at auth.ts:156) →
underlying_cause (JWT secret mismatch at config.ts:23) →
root_cause (environment variable not loaded)

Evidence:
- auth.ts:156: jwt.verify throws "invalid signature"
- config.ts:23: process.env.JWT_SECRET is undefined
- .env file exists but not loaded (missing dotenv import)
- git log shows config.ts modified in commit abc123

Fix:
config.ts:1: import 'dotenv/config'

Verification:
- Test passes: auth.test.ts:45
- Manual test: login succeeds
- No regressions: full test suite passes
```

**Prohibited**:
- "Probably", "should be", "likely" without evidence
- File references without line numbers
- Claims without sources
- Speculation marked as fact

### Appendix D: Quick Reference Cards

**Component Selection**:

```
Need automatic application? → Skill
Need manual trigger? → Slash Command
Need context isolation? → Subagent
```

**Context Management**:

```
Context pollution? → Use subagent
Token budget low? → /compact or @imports
Repeated info? → Move to CLAUDE.md
Heavy operation? → Isolate in subagent
```

**Quality Gates**:

```
Before planning? → Review requirements
Before implementing? → Run /audit
After each story? → Run /verify --story
Before merging? → Human review
Before deploying? → Security scan
```

**Prompt Patterns**:

```
Research: "Think step-by-step, plan before coding"
Implementation: "Follow TDD: tests first, then code"
Review: "Check security, performance, style"
Debugging: "Trace symptom to root cause with evidence"
```

**File Organization**:

```
.claude/
├── CLAUDE.md (project memory)
├── commands/ (slash commands)
├── agents/ (subagents)
├── skills/ (team expertise)
└── templates/ (output formats)

~/.claude/
├── CLAUDE.md (user memory)
├── commands/ (personal commands)
├── agents/ (personal agents)
└── skills/ (personal skills)
```

**Workflow Formulas**:

```
SDD: /feature → /plan → /tasks → /audit → /implement

TDD: write_tests → fail → implement → pass → refactor

Debug: symptom → intel_query → root_cause → fix → verify

Research: parallel_agents → individual_reports → synthesis
```

**Token Efficiency**:

```
Skills: 30-50 tokens (metadata) until invoked
Commands: Injected into main (use for shortcuts)
Subagents: Separate budget (use for heavy ops)
CLAUDE.md: Persistent cost (keep lean)
@imports: Loaded on-demand (use liberally)
```

**Best Practices Checklist**:

```
□ CLAUDE.md under 500 lines
□ Skills have clear descriptions with triggers
□ Commands have explicit tool permissions
□ Subagents have single responsibility
□ All components version controlled
□ Quality gates defined
□ Human review checkpoints
□ Token usage monitored
□ Evidence-based reasoning (CoD^Σ)
□ Progressive disclosure architecture
```

---

## Conclusion

Claude Code represents a fundamental shift in software development - from AI as chat interface to AI as programmable automation layer. This guide has covered:

**Fundamentals**: CLAUDE.md memory, MCP integration, token efficiency
**Component Hierarchy**: Skills (auto), Commands (manual), Subagents (isolated)
**Creation Patterns**: How to build each component type
**Composition**: 10+ patterns for combining components
**Best Practices**: Context engineering, progressive disclosure, quality gates
**Workflows**: Complete examples from SDD to debugging
**Troubleshooting**: Common issues and solutions

**Key Takeaways**:

1. **Skills-first hierarchy** - Understand when to use each component
2. **Context is king** - Optimize CLAUDE.md, use progressive disclosure
3. **Compose don't complicate** - Start simple, build up
4. **Isolate noise** - Use subagents for heavy operations
5. **Evidence-based** - All reasoning must cite sources (CoD^Σ)
6. **Human in loop** - AI assists, humans decide
7. **Iterate continuously** - Let usage guide evolution

Master these patterns to build production-grade AI-assisted workflows that amplify your capabilities while maintaining control and quality.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-30
**Maintained By**: Claude Code Intelligence Toolkit Team

For updates and contributions, see: `.claude/templates/BOOTSTRAP_GUIDE.md`
