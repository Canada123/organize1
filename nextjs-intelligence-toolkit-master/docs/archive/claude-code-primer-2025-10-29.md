# Claude Code Agentic Features: Complete Research Guide

Claude Code is Anthropic's terminal-native agentic coding tool that transforms software development through composable, autonomous AI capabilities. This research covers its core architecture, features, and best practices for creating effective workflows.

## Core architecture and design philosophy

**Claude Code embodies Unix philosophy principles**: simplicity, composability, and doing one thing well. Built on a ReAct framework (Reasoning and Acting), it operates through an iterative loop where Claude analyzes context, determines actions, executes tools, observes results, and iterates. The tool runs **locally by design** rather than in VMs or containers, using bash commands directly on your filesystem for maximum simplicity.

The architecture features a **permission-based security model** where Claude is read-only by default, requiring explicit approval for any writes. Users control permissions through three modes: Normal (prompt each time), Auto-Accept (automatic approval), and Plan (read-only analysis). This fail-closed approach ensures safety while enabling powerful automation.

**Context is the foundation**. Claude Code deliberately accepts higher latency to deliver comprehensive, accurate results using massive context windows up to 1 million tokens. This eliminates complex RAG systems—full conversation history and project context remain available throughout. Automatic compaction prevents context exhaustion while maintaining continuity.

The tool uses a **hybrid model strategy**: Haiku for quick operations, Sonnet as the daily workhorse, and Opus for complex architectural decisions. This balances speed, cost, and capability based on task requirements.

## CLAUDE.md files: Project memory and persistent context

CLAUDE.md files serve as **Claude's persistent memory**—automatically loaded at session start to provide project-specific context without repetitive explanation. These special Markdown files act as your project's constitution, governing how Claude interacts with your codebase.

**Memory hierarchy matters**. Claude loads memories from four levels: Enterprise policy (organization-wide), User memory (`~/.claude/CLAUDE.md` for personal preferences), Project memory (`.claude/CLAUDE.md` shared with team), and Project local memory. Higher levels take precedence and load first, with nested memories providing additional context for subdirectories.

**The @ symbol serves two critical functions**. Within CLAUDE.md files, use `@path/to/file` to import additional content (up to 5 hops deep). In conversation, use `@filename` to immediately include files without waiting for Claude to read them. This enables efficient context loading: `@src/utils/auth.js` includes full file content, while `@src/components/` shows directory listings.

**Keep CLAUDE.md lean and specific**. These files consume context window space with every interaction. Write concise bullet points, not paragraphs. Be specific with project-unique instructions like "Use 2-space indentation" rather than generic advice like "write clean code." Aim for under 500 lines for optimal performance.

**Essential content for CLAUDE.md**: Common commands (build, test, deploy), code style conventions, testing requirements, architecture decisions, repository etiquette, environment quirks, and integration details. Avoid generic best practices Claude already knows—focus exclusively on what's unique to your project.

**Template structure**:
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

## Slash commands: Composable workflow shortcuts

Slash commands are **reusable prompt shortcuts** stored as Markdown files and invoked with `/command-name` syntax. They represent the primary composable unit in Claude Code, embodying Unix philosophy: do one thing well, compose into complex workflows.

**Commands are user-invoked**, not automatic. You explicitly type `/optimize src/auth.js` to trigger the workflow. This contrasts with Skills (model-invoked) and provides explicit control over execution timing.

**Creating slash commands is straightforward**. Place Markdown files in `.claude/commands/` (project-level, shared with team) or `~/.claude/commands/` (personal, across all projects). The filename becomes the command name:

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

**The SlashCommand tool enables autonomy**. When commands have descriptions, Claude can proactively invoke them based on context. This transforms manual shortcuts into autonomous workflow components. Add keywords like "PROACTIVELY" or "MUST BE USED" to encourage automatic invocation.

**Commands support dynamic content**. Use `$ARGUMENTS` for all arguments, `$1`, `$2` for positional arguments. Execute bash commands with `!git status` syntax. Reference files with `@path/to/file`. Import additional context as needed.

**Key composability principle**: Slash commands are primitives that combine into complex workflows. A `/feature-development` command might orchestrate multiple subagents, reference Skills, and chain operations together. Start simple, compose complexity.

**Best practices**: Single responsibility per command, clear action-oriented names, explicit tool permissions (never use wildcards like `Bash(*:*)`), and version control in your repository for team sharing. Commands dramatically reduce token consumption—users report 20% reductions by converting repeated prompts to commands.

## Subagents: Specialized assistants with isolated context

Subagents are **pre-configured AI personalities operating in separate context windows**. Each has a custom system prompt, specific tool permissions, and specialized expertise. This architecture enables parallelization while preventing context pollution.

**Context isolation is the killer feature**. When a subagent parses 150,000 tokens of logs, that noise stays in its isolated context. Only the distilled 2,000-token summary returns to your main thread. Without subagents, those 150k tokens of diagnostic output flood your valuable reasoning context, degrading quality. **Bad context is cheap but toxic**—it costs little computationally but destroys Claude's effectiveness.

**Creating subagents**: Use `/agents` for interactive creation or manually create Markdown files in `.claude/agents/` (project-level) or `~/.claude/agents/` (personal):

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

**When to use subagents**: Complex multi-stage tasks requiring specialized expertise, heavy research that would clutter main context (exploring dozens of files), parallel processing of independent tasks, repeated workflows needing consistency, and context preservation when main agent approaches limits.

**Parallel execution**: Up to 10 concurrent subagents can run simultaneously on read operations. This enables powerful patterns like spawning security-scanner, performance-analyzer, and style-checker in parallel for comprehensive code review, then synthesizing results in the main thread.

**Critical trade-offs**: Subagents consume 3-4x more tokens due to parallel context windows and incur higher latency starting from clean slate. Reserve for genuinely complex scenarios where context isolation and specialization justify costs. Simple tasks stay in main thread.

**Tool scoping**: Omitting the tools field grants all tools (including MCP). Specify tools explicitly for security: `Read, Grep, Glob` creates read-only analysts, while `Read, Write, Edit, Bash` enables implementers. Follow least privilege principles.

**Orchestration model**: Main agent coordinates as orchestrator, subagents work as specialized laborers. Main agent decides which subagent to invoke, coordinates between multiple subagents, maintains high-level flow, and synthesizes results. Subagents execute specific tasks, operate independently within expertise, return summarized results only.

## Skills: Auto-invoked contextual capabilities

Skills are **modular capabilities Claude autonomously invokes** when relevant. Unlike slash commands (user-invoked) or subagents (context-isolated workers), Skills provide specialized knowledge that Claude automatically applies based on description matching.

**Progressive disclosure architecture**: Skills load in three levels. Level 1 metadata (name and description, 30-50 tokens) pre-loads at startup for discovery. Level 2 (SKILL.md body) loads when Claude determines relevance. Level 3 (supporting files) loads only when specifically needed. This minimizes token consumption—Skills only burn context when actually used.

**Structure**: A Skills folder contains `SKILL.md` with YAML frontmatter plus optional supporting files—scripts, templates, reference documentation:

```
my-skill/
├── SKILL.md (required)
├── REFERENCE.md (optional)
├── templates/ (optional)
└── scripts/helper.py (optional)
```

**SKILL.md format**:
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

**Description is critical**. Include both WHAT the Skill does AND WHEN to use it. Add trigger terms users would mention: "Analyze Excel spreadsheets, create pivot tables, and generate charts. Use when working with Excel files, spreadsheets, or analyzing tabular data in .xlsx format." Vague descriptions like "Analyze data files" prevent automatic invocation.

**Built-in Skills** (Pro, Max, Team, Enterprise): `xlsx`, `docx`, `pptx`, `pdf` for document creation and analysis. Custom Skills enable domain-specific expertise: brand guidelines, testing frameworks, deployment procedures, data analysis patterns.

**Best practices**: Keep SKILL.md under 500 lines, split large content into separate reference files organized by domain for conditional loading. Use gerund form naming ("Processing PDFs" not "PDF Processing"). Test with all models—Haiku, Sonnet, Opus—to ensure appropriate guidance level. Build evaluations first: identify gaps without the Skill, create test scenarios, write minimal instructions to pass tests.

**Skills vs slash commands**: Skills auto-invoke based on context (Claude decides), support complex multi-file structures, enable progressive disclosure. Slash commands require explicit invocation (user decides), work as single-file shortcuts, provide direct control. Both coexist—Skills for automatic expertise, commands for workflow shortcuts.

## Workflows: Composing features into powerful automations

Workflows in Claude Code are **structured, repeatable processes** for accomplishing development tasks. The system is intentionally low-level and unopinionated, providing close to raw model access without forcing specific patterns. This flexibility enables customization for any team's needs.

**Multi-phase workflow pattern** (Anthropic recommended):

**Phase 1: Research** - Ask Claude to explore relevant files. Explicitly instruct NOT to write code yet. Use subagents for parallel investigation of different areas. Switch to Plan Mode (Shift+Tab twice) for read-only analysis.

**Phase 2: Planning** - Request detailed plan creation. Consider documenting plan in separate file or GitHub issue. Review plan before implementation begins. This prevents premature optimization and reduces rework.

**Phase 3: Implementation** - Ask Claude to implement solution step-by-step. Request explicit verification at each step. Run tests frequently during implementation, not just at end.

**Phase 4: Validation & Commit** - Review all changes thoroughly. Run complete test suite. Create PR with detailed description referencing plan and decisions made.

**Test-driven development excels** in Claude Code. The workflow: Write comprehensive tests first, implement to pass tests, run tests after each change, iterate until all pass. Claude's ability to maintain test intent while fixing implementation makes TDD natural.

**Creating workflow automations**: Convert repetitive workflows to slash commands for efficiency. Commands can orchestrate subagents, invoke Skills, chain operations. Example feature development workflow:

```markdown
# .claude/commands/implement-feature.md
---
description: Implement new feature from specification
---

## Research Phase
- Read feature specification  
- Identify affected files and components
- Research similar implementations in codebase

## Design Phase  
- Create architecture plan
- Identify required tests
- Document API contracts

## Implementation Phase
- Write tests first (TDD)
- Implement feature incrementally  
- Run tests after each change

## Verification Phase
- Run full test suite
- Verify code quality with linters
- Check for security issues
- Update documentation
```

**Hooks enable event-driven automation**. Configure hooks for automatic execution at session start, before/after tool use, pre/post edit. Example: automatically run type checking after file edits. Access via `/hooks` command or edit `.claude/settings.json`.

**Advanced patterns**: Extended thinking for complex decisions (use "think hard" or "ultrathink" prompts), checkpoint-based workflows with `--max-turns` to create review points, headless automation for CI/CD integration using `claude -p` with JSON output, memory bank systems with persistent knowledge files.

## Critical distinctions: When to use each feature

**Skills vs Slash Commands vs Subagents**—understanding the differences is essential for effective Claude Code use:

**Skills (Model-Invoked)**:
- **Trigger**: Automatic based on description matching
- **Context**: Loaded progressively when relevant  
- **Best for**: Domain knowledge, conventions, automatic expertise application
- **Decision**: "I want Claude to remember X automatically"
- **Example**: Brand guidelines that apply whenever creating presentations

**Slash Commands (User-Invoked)**:
- **Trigger**: Manual via `/command-name`
- **Context**: Injected directly into main thread
- **Best for**: Workflow shortcuts, frequent prompts, orchestration
- **Decision**: "I want a shortcut for workflow Y"
- **Example**: `/security-review` to trigger comprehensive security audit

**Subagents (Context-Isolated)**:
- **Trigger**: Automatic or explicit via mention
- **Context**: Separate isolated context window
- **Best for**: Heavy analysis, context isolation, parallel work, specialized expertise
- **Decision**: "I need to isolate messy operations" or "automate specialized workflow"
- **Example**: Log analysis that generates 150k tokens of output

**The token economics insight**: Slash commands inject prompts into main thread—all outputs flood main context. Subagents spawn separate workers—diagnostic noise stays isolated, only clean summaries return. For token-heavy operations, subagents provide 8x cleaner context by preventing pollution.

**Skills provide knowledge**, slash commands provide shortcuts, subagents provide isolated execution. All three compose into powerful workflows.

## Composing workflows: Integration patterns

**Pattern 1: Slash Command → Subagent → Execution**

User types `/analyze-performance` → Command invokes performance-engineer subagent → Subagent analyzes logs and profiles (180k tokens burned in isolation) → Returns "These 3 functions cause 70% latency" → Main Claude implements optimizations with clean context.

**Pattern 2: Multi-Subagent Parallel Research**

Main Claude recognizes authentication need → Spawns in parallel: research subagent exploring existing patterns (80k tokens), security subagent analyzing requirements (60k tokens) → Main thread receives two clean summaries → Implements solution with full context.

**Pattern 3: Skills + Subagents for Specialized Work**

Claude loads project-specific Skill automatically → Skill contains code review guidelines → Subagent uses Skill context for specialized review → Returns findings following Skill's format → Main thread discusses with user.

**Pattern 4: Hierarchical Agent Workflow**

```
Main Coordinator Agent
├── Product Owner Agent → Clarifies requirements
├── Architect Agent → Designs solution  
├── Engineer Agent → Implements code
└── QA Agent → Tests and validates
```

Each agent specializes, reports results to main coordinator for integration.

**Pattern 5: Hybrid Analysis → Execution**

Subagent uses Read, Grep, Glob, TodoWrite (analysis tools only) → Creates comprehensive plan → Main Claude executes Write, Edit, Bash (modification tools) → Preserves tool access control while enabling automation.

**Practical full-stack workflow**:
1. User: "Build authentication feature"
2. Claude loads architecture Skill (auto), security Skill (auto)
3. User: `/plan` (slash command)
4. Parallel subagents: backend-architect (database), frontend-dev (UI), security-auditor (review)
5. Main Claude integrates results and implements
6. test-runner subagent validates (auto-invoked)
7. Create PR with commit message

**Integration best practices**: Leverage progressive disclosure (keep Skills lean, reference files on-demand), use subagents for read-heavy operations that can parallelize, keep write operations single-threaded to avoid conflicts, chain commands to subagents (commands as entry points, subagents as workers), Skills provide context and conventions that subagents apply during specialized work.

## Context engineering: Managing the finite resource

**Context is a finite public good** shared by conversation history, Skills metadata, CLAUDE.md, files, tool outputs, and your requests. Every token competes. The question for every piece of content: "Does this paragraph justify its token cost?"

**The dual threats**: Context pollution (valuable reasoning flooded with irrelevant logs and diagnostics) and context rot (AI performance degrading as input length increases). Solution: aggressive use of subagents to isolate messy operations, keeping main thread focused.

**CLAUDE.md optimization**: Be concise—bullet points, not paragraphs. Be specific—"Use 2-space indentation" beats "Format properly." Use structure—Markdown headings, logical groupings. Avoid time-sensitive info—document patterns, not current state. Import selectively—only load relevant files with `@` syntax. Keep under 500 lines total.

**Essential content**: Only project-unique instructions. Claude already knows SOLID principles, common frameworks, standard patterns. Include specific commands, project conventions, architecture decisions, repository etiquette, environment quirks. Exclude generic best practices and well-known concepts.

**Progressive disclosure patterns**: Skills load metadata at startup (30-50 tokens), full content on-demand, reference files only when needed. This minimizes baseline token cost. Keep SKILL.md under 500 lines, split larger content into domain-specific reference files loaded conditionally.

**Just-in-time loading**: Store lightweight identifiers (file paths, queries, URLs), use Read tool dynamically when needed, avoid pre-loading massive datasets. Example: maintain list of log files, read specific logs only when diagnosing issues.

**Context compaction**: Claude 4.5 features automatic context awareness and compaction. Use `/compact` to summarize and compress when approaching limits. Preserves architectural decisions, unresolved bugs, implementation details. Discards redundant tool outputs and unnecessary messages. Trust Claude to manage this intelligently.

**State management strategies**: Use git log to track what's done—git provides restorable checkpoints. Maintain file-based coordination: `TODO.md` for pending tasks, `NOTES.md` for session memory, `PLAN.md` for implementation strategy. Use structured JSON for status tracking, unstructured text for progress notes.

**Explicit boundaries reduce waste**: Tell Claude what to skip ("Don't explain async/await"), set clear scope ("Only security review, ignore performance"), define what NOT to load. Each boundary saves tokens for valuable content.

**Anti-patterns to avoid**: Dumping large files into context (reference sections instead), repeating information across multiple places (reference once), over-explaining obvious concepts (assume expertise), loading everything without clear boundaries (focus scope). These patterns waste context on low-value content.

## Prompt engineering: Getting the best results

**Claude 4.x capabilities**: More precise instruction following, close attention to details and examples, requires explicit requests for "above and beyond" behavior, context-aware of remaining token budget. This means prompts must be more explicit than with previous versions.

**Core principle: Be explicit and specific**. Instead of "Make this better," use "Refactor this function to use async/await pattern, add comprehensive error handling, include type hints, and write unit tests." Instead of "Create a dashboard," use "Create an analytics dashboard with user metrics, real-time updates, filtering, export functionality, and responsive design. Go beyond basics to create a fully-featured implementation."

**Provide context and motivation**. Explain why: "We're migrating to microservices. This auth system needs 10k requests/sec and integrates with existing OAuth provider. Security is critical because we handle healthcare data." Context shapes Claude's decisions and trade-offs.

**Use structured formats for complex instructions**:

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

**Pattern: Investigate Before Answering**. Critical for codebase questions:

```xml
<investigate_before_answering>
Never speculate about code you haven't opened. If the user 
references a specific file, you MUST read the file before 
answering. Make sure to investigate and read relevant files 
BEFORE answering questions about the codebase.
</investigate_before_answering>
```

**Chain of thought prompting**:
```
Think step-by-step about this authentication system:
1. What are the security requirements?
2. What existing patterns do we use?  
3. What are the integration points?
4. What could go wrong?

Then implement based on your analysis.
```

**Few-shot examples** when patterns matter:
```markdown
Example 1:
Input: user_data = {"name": "John"}
Output: User(name="John", created_at=datetime.now())

Example 2:  
Input: user_data = {"name": "Jane", "email": "jane@example.com"}
Output: User(name="Jane", email="jane@example.com", created_at=datetime.now())

Now process: user_data = {"name": "Alice", "role": "admin"}
```

**Extended thinking** for complex problems. Use "think" / "think hard" / "ultrathink" for progressively more reasoning budget. Best for architectural decisions, challenging bugs, multi-step planning. Example: "Think deeply about the best approach for implementing real-time sync with offline support."

**Output format specification ensures consistency**:
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

**Modifiers for quality and effort**. Claude 4.x requires more explicit encouragement for comprehensive work: "Don't hold back. Give it your all. Create an impressive demonstration showcasing full capabilities. Include as many relevant features as possible."

**CLAUDE.md prompt patterns**: Document investigation requirements, anti-patterns to avoid, preferred patterns, testing standards, workflow procedures. These become persistent prompting context applied automatically every session.

## Parallel workflows and agent handover

**Parallel execution enables dramatic speedups** for independent tasks. Multiple approaches available depending on needs and constraints.

**Method 1: Git Worktrees (Most Reliable)**

True parallel execution with isolated file states:
```bash
git worktree add ../project-feature-a -b feature-a
git worktree add ../project-feature-b -b feature-b

cd ../project-feature-a && claude "Implement feature A"
cd ../project-feature-b && claude "Implement feature B"
```

Each instance has independent file state, won't interfere, shares Git history. Perfect for parallel feature development or exploration.

**Method 2: Task Tool (Built-in Parallelization)**

Claude Code's Task tool enables parallel subagent execution:
```
Main Agent: Analyzes authentication requirements

Spawns parallel:
Task("You are researcher. Analyze existing auth patterns...")
Task("You are security expert. Review security requirements...")  
Task("You are architect. Design database schema...")

All execute concurrently → Results return to main thread
```

Up to 10 subagents run concurrently on read operations. Queue handles 100+ tasks via batching. Ideal for parallel research, analysis, or review tasks.

**Method 3: Multiple Terminal Windows**

Simple but effective for smaller teams:
```bash
# Terminal 1: Backend work
cd ~/project && claude

# Terminal 2: Frontend work  
cd ~/project && claude

# Terminal 3: Testing work
cd ~/project && claude
```

Caution: May cause conflicts if writing same files. Best for naturally separated concerns.

**Coordination mechanisms** prevent chaos in parallel workflows:

**1. Shared Context Files**

```markdown
# PROGRESS.md - All agents read/write
## Completed
- Authentication backend [Agent A]
- User database schema [Agent A]

## In Progress  
- Frontend login component [Agent B]

## Blocked
- Email verification [Agent C - needs SMTP credentials]
```

**2. API Contracts as Coordination**

```markdown
# API.md - Single source of truth
POST /api/auth/login
  Input: {email: string, password: string}
  Output: {token: string, user: User}
  
Implement: Backend (Agent A), Frontend (Agent B), Tests (Agent C)
```

**3. Hook-Based Coordination**

```json
{
  "hooks": {
    "postEdit": [{
      "pattern": "*",
      "command": "echo \"$(date): $FILE updated by $USER\" >> .claude/activity.log"
    }]
  }
}
```

Provides audit trail of all changes across parallel sessions.

**4. Todo-Based Status Tracking**

```
TodoWrite({
  todos: [
    {id: "1", content: "Backend API", status: "completed", assignee: "Agent A"},
    {id: "2", content: "Frontend UI", status: "in-progress", assignee: "Agent B"},
    {id: "3", content: "Integration tests", status: "pending", assignee: "Agent C"}
  ]
})
```

Structured status visible to all agents.

**Coordination best practices**: Clear task boundaries (Backend: `src/api/*`, Frontend: `src/components/*`, Tests: `tests/*`), communication protocol documented in COORDINATION.md, merge strategy defined upfront, human review checkpoints between phases. Each agent updates shared status after completing tasks, documents API contracts, reports blockers explicitly.

**Handover protocols**: Main agent analyzes requirements → Research subagent explores solutions (burns 100k tokens in isolation) → Returns "Found 3 viable approaches" → Architect subagent designs chosen approach → Returns detailed design → Implementation subagent builds → test-runner validates. Clean handoffs with clear deliverables between stages.

**Parallel workflow patterns**:

**Pattern 1: Research Agents** - Task: "Evaluate 3 database solutions" → Parallel agents research PostgreSQL, MongoDB, DynamoDB → Consolidate findings → Make recommendation

**Pattern 2: Component Development** - Task: "Build user dashboard" → Parallel agents: profile component, settings component, analytics component, navigation → Main agent assembles → Resolve dependencies → Ensure consistency

**Pattern 3: Multi-Platform** - Parallel: iOS implementation, Android implementation, Web implementation, shared API client → Coordinate via shared API specification and common data models

**Anti-patterns**: Over-parallelization of sequential dependencies, no coordination mechanism, unclear task boundaries, parallel writes to same files without conflict resolution, no human review checkpoints. These lead to conflicts, duplicated work, and integration failures.

## Conceptual understanding of composable units

**Slash commands are the foundational composable unit** in Claude Code, embodying Unix philosophy: do one thing well, provide text-based interface, enable composition into complex workflows, maintain simple discoverable format.

This follows Unix pipeline thinking: just as `cat file.txt | grep "error" | sort | uniq -c` builds complex behavior from simple primitives, Claude Code workflows compose slash commands, Skills, and subagents into sophisticated automations.

**Why slash commands are composable**:

**Single responsibility**: Each command has focused, single purpose. `/security-audit` only audits security, doesn't also format code. This enables predictable composition.

**Text-based interface**: Commands operate on text (code, config, docs). LLMs are native text processors. Natural alignment between command output and LLM input enables seamless chaining.

**Simple format**: Commands are Markdown files—human-readable, editable, no complex DSL. `/help` provides discovery. No programming required. Barrier to creation is minimal.

**Emergent capabilities**: Simple commands combine to solve complex problems. `/analyze-codebase` → `/refactor` → `/generate-tests` → `/commit`. New workflows emerge from composition. No need to anticipate every use case.

**Meta-programming**: Claude can create and modify slash commands. User: "Create command that checks Python PEP 8" → Claude creates `/pep8-check.md` → Tests it → Documents it. User: "Now create auto-fix version" → Claude creates `/pep8-fix` that composes with `/pep8-check`.

**Subagents enable parallelization and noise offloading**. The conceptual model: subagents create "specialized development team" where each member has their own workspace (context window), specific expertise (system prompt), limited permissions (tool access), clear responsibilities (description).

**Context separation prevents quality degradation**. Product manager uses full 200k context for user needs. Software engineer gets fresh 200k for implementation. Security analyst gets clean 200k for review. Each maintains quality without interference. Without separation, all share single polluted context.

**The microservices analogy**: Subagents mirror microservices architecture—specialized components handling distinct responsibilities without interference, communicating through well-defined interfaces. Main agent orchestrates like API gateway, subagents provide specialized services.

**Skills provide automatic expertise**. The conceptual model: Skills are "knowledge modules" Claude automatically loads when relevant. Think of them as expert consultants on call—present when needed, invisible when not, consuming minimal resources until invoked.

**Progressive disclosure optimizes token usage**: Metadata (30-50 tokens) loaded at startup enables discovery. Full content loads on-demand when Claude determines relevance. Supporting files load only when specifically needed. This keeps baseline cost minimal while providing deep expertise when required.

**All three elements compose**: Skills provide knowledge and conventions. Slash commands provide workflow shortcuts and orchestration. Subagents provide isolated execution and parallelization. Together they create powerful, efficient, maintainable automation.

## Practical guidance for generation

**Creating effective Skills**:

1. **Start with test cases**: Identify gaps by running tasks WITHOUT the Skill. Create 3 test scenarios representing real usage. Write minimal instructions to pass tests. Iterate based on actual results.

2. **Structure for discovery**: Name using gerund form ("Processing PDFs"), description with both WHAT and WHEN ("Extract text from PDFs and analyze structure. Use when working with PDF files or needing document analysis."), specific trigger terms users would mention.

3. **Keep it lean**: Under 500 lines in SKILL.md, split large content into reference files, avoid time-sensitive information, focus on what Claude doesn't already know.

4. **Test across models**: Haiku (does it provide enough guidance?), Sonnet (is it clear and efficient?), Opus (does it avoid over-explaining?). Adjust detail level appropriately.

**Creating effective slash commands**:

1. **Single responsibility**: Each command does one thing well. `/security-review` reviews security, doesn't also refactor or test. This enables composition.

2. **Clear naming and description**: Action-oriented names (`/optimize`, `/review`, `/deploy`), description field enables SlashCommand tool invocation, argument hints guide users.

3. **Explicit tool permissions**: Never use `Bash(*:*)`. Be specific: `Bash(git:*), Bash(npm test:*), Read, Write`. Follow least privilege principle.

4. **Use arguments effectively**: `$ARGUMENTS` for all args, `$1`, `$2` for positional, `!git status` for bash execution, `@file-path` for file references.

5. **Version control**: Store in `.claude/commands/` (project) or `~/.claude/commands/` (personal). Commit project commands to repo for team sharing.

**Creating effective subagents**:

1. **Start with Claude-generated agents**: Use `/agents` to create initial agent, let Claude write system prompt, customize iteratively based on usage.

2. **Clear responsibility boundaries**: Single, well-defined goal. "You are security auditor reviewing code for vulnerabilities" not "You are helper agent."

3. **Scope tools intentionally**: Read-only for analysts (Read, Grep, Glob), write access for implementers (Read, Write, Edit, Bash), minimal necessary tools only. Omitting tools grants ALL tools—be explicit.

4. **Include definition of done**: Checklist in system prompt: "Complete when: 1) All security issues documented with severity, 2) Remediation steps provided, 3) Code examples included for high-severity issues."

5. **Encourage proactive use**: Add keywords to description: "Use PROACTIVELY after code changes" or "MUST BE USED for security reviews before deployment."

**Curating CLAUDE.md effectively**:

1. **Golden rules**: Be concise not comprehensive (under 500 lines total), be specific not generic (project-unique only), use structure and organization (headings, bullets), iterate continuously (living document).

2. **Essential content checklist**: Tech stack with versions, common commands (dev, build, test, deploy), code conventions (formatting, naming, imports), testing requirements, architecture decisions, repository etiquette, environment quirks, integration details.

3. **Import pattern**: Keep main CLAUDE.md lean with high-level context, use `@docs/detailed-guide.md` for deep dives, reference rather than inline large content, maximum 5 hops deep in import chain.

4. **Team collaboration**: Commit CLAUDE.md to repository, use `.gitignore` for CLAUDE.local.md (personal overrides), document in README: "See CLAUDE.md for AI assistant configuration", review updates in PRs like code.

**Composing complete workflows**:

1. **Start with phases**: Research (Plan Mode exploration), Planning (detailed design), Implementation (step-by-step with tests), Validation (review and verification). Document phase transitions clearly.

2. **Identify parallelizable work**: Read-heavy research can parallelize, analysis and review can parallelize, write operations should stay sequential. Use subagents for parallel, main agent for sequential.

3. **Define coordination mechanism**: Shared status files (PROGRESS.md), API contracts (API.md), hooks for audit trail, clear task boundaries in documentation.

4. **Create entry point command**: Slash command that orchestrates the workflow, invokes appropriate subagents, maintains clear state transitions, provides human review checkpoints.

5. **Test end-to-end**: Run complete workflow on real tasks, measure token consumption and time, identify bottlenecks and optimize, iterate based on actual usage patterns.

## Key principles for success

**Context is king**: Comprehensive, well-organized CLAUDE.md files dramatically improve all outcomes. Invest time in creating excellent project context.

**Progressive disclosure**: Don't load everything upfront. Use Skills for on-demand knowledge, `@` references for just-in-time file loading, subagents for isolated heavy operations.

**Isolate noise**: Subagents prevent context pollution. Token-heavy operations (log analysis, extensive searches) burn resources in isolation, return only clean summaries.

**Compose don't complicate**: Start with simple components. Compose into complex workflows. Avoid creating monolithic mega-commands or mega-agents.

**Explicit over implicit**: Be specific in prompts, descriptions, tool permissions, success criteria. Claude 4.x follows instructions precisely—vagueness produces mediocre results.

**Human in the loop**: AI code requires human review. Use checkpoints between phases. Review before merging. AI assists, humans decide.

**Version control everything**: CLAUDE.md, slash commands, subagents, Skills—all in git. Share with team. Track changes. Enable collaboration.

**Iterate based on usage**: Start simple, add complexity as needed. Monitor what works, refine what doesn't. Let real usage patterns guide evolution.

Claude Code represents a fundamental shift in software development—from AI as chat interface to AI as programmable automation layer. Master these composable units and best practices to build production-grade AI-assisted workflows that amplify your capabilities while maintaining control and quality.