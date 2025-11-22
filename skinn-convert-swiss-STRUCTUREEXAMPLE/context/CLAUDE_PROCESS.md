# CLAUDE Process – Subagent‑Oriented Lifecycle

This document defines the end‑to‑end lifecycle of the CLAUDE system under the subagent framework for the SKIIN Switzerland marketing website project. It outlines the phases, triggers, steps, outputs, loop conditions and the subagents invoked at each stage. This process emphasises **research-first methodology**, **flexibility**, **context management**, **safety**, and **workflow reuse**. Each phase can loop or be revisited based on new information or requirement changes, and minor updates can be handled through mini‑cycles rather than restarting the entire sequence.

## Core Principle: Research-First Methodology

**NO DELIVERABLES UNTIL RESEARCH IS COMPLETE**

Every significant task must follow this mandatory sequence:
1. **Research & Analysis** - Understand the problem space thoroughly
2. **Design & Planning** - Create detailed specifications based on research
3. **Implementation** - Execute only after research validates approach
4. **Validation** - Verify against researched requirements

This prevents wasted effort, ensures evidence-based decisions, and maintains high quality standards.

## General Process Characteristics

1. **Phase‑Based Structure:** Eight core phases organise the workflow: Context Gathering, Analysis, Research & Synthesis, Brainstorm & Evaluation, Planning, Execution, Review & Reflection and Delivery. Phases can be entered via predefined workflows or dynamic invocation chains. Subphases or mini‑cycles allow localised updates during Execution.

2. **Workflow Gateway:** Before starting or when receiving a new user task, Claude checks WORKFLOWS.md for a matching workflow. If found, the workflow defines the subagent sequence. Otherwise, the invocation-chain-generator proposes a custom chain. All agent selections are logged.

3. **Think–Act–Observe Loop:** Within each phase and task, the orchestrator follows a ReAct‑style loop: think (analyse current state), act (invoke subagent/tool), observe (interpret results) and reflexion (self‑critique or review invocation) before iterating.

4. **Context & Memory Management:** Context follows a structured 4-index system (v2.0) for efficient navigation. Context is loaded via the context-manager at each phase start and summarised/pruned via memory MCP tools after each phase or when exceeding thresholds. The knowledge graph is the canonical data store; views (plan, tasks, docs) are generated from it. **4-Index System**: Load PROJECT_INDEX.json (~160KB) for code structure, VISUAL_ASSETS_INDEX.json (~124KB) for images/videos, context/project-tree.txt (~36KB) for directory navigation, context/project-index.md for high-level overview. Use Serena MCP tools for symbol-level understanding when needed.

5. **Safety & Compliance:** External data processing, code execution or operations with side effects require validation. User confirmation is required for side‑effect actions.

6. **Iteration Caps & Timeouts:** Each phase has default iteration limits (e.g. three research iterations per topic, five brainstorming revisions). The orchestrator monitors loops and defers or summarises tasks when limits are reached. Timeouts prevent indefinite waiting on tool calls.

7. **Documentation Lifecycle:** Documents follow strict guidelines per docs/documentation-guidelines.md. Working documents live in context/, reference docs in docs/. Documents progress through creation → active → archive → deletion phases. The documentation-maintainer enforces standards, manages updates, and archives unused docs after 7 days to archive/YYYY-MM-DD/.

## Phase 1 – Context Gathering (MANDATORY FIRST PHASE)

**Goal:** Capture the user's intent, detect workflows, and gather all relevant information.

**Automatic Triggers:** 
- ⚡ ANY new user message
- ⚡ Session start
- ⚡ Context older than 1 hour
- ⚡ After workflow completion

**Mandatory Actions:**
1. Check WORKFLOWS.md for keyword matches
2. **DETECT PROJECT TYPE** (React Router vs Next.js):
   - Check package.json for framework dependencies
   - Verify routing structure (src/routes/ vs app/ or pages/)
   - Identify build tool (vite.config.js vs next.config.js)
   - Store detected type for consistent implementation patterns
3. Load JSON Memory files in this order:
   - memory/active.json (session state and event logs)
   - memory/patterns.json (code patterns with confidence scores)
   - memory/decisions.json (architecture decisions)
   - memory/knowledge.json (troubleshooting and research)
   - memory/agent-groups.json (agent capabilities)
4. Load PROJECT_INDEX.json (~160KB) for code structure
5. Load VISUAL_ASSETS_INDEX.json (~124KB) if UI work involved
6. Use Context7 MCP for library documentation if needed

**Mandatory Steps:** 
1. **Detect workflow triggers** by checking message against WORKFLOWS.md keyword matrix:
   ```javascript
   const triggers = {
     'bug-fix': ['bug', 'error', 'broken', 'fix', 'issue'],
     'database-migration': ['database', 'schema', 'migration', 'table'],
     'feature-implementation': ['implement', 'create', 'feature', 'component'],
     'performance-optimization': ['slow', 'performance', 'optimize'],
     'security-audit': ['security', 'vulnerability', 'audit'],
     'deep-research': ['research', 'investigate', 'explore']
   };
   ```
2. **Self-prime the orchestrator with project type awareness**:
   - Detect project type (React Router vs Next.js)
   - Load PROJECT_INDEX.json (~160KB) for code awareness
   - Load context/project-index.md for overview
   - Check memory/active.json for current session context
   - Apply framework-specific patterns based on detected type
3. **Call context-manager with self_prime: true** to load context files. **4-Index Loading Strategy (v2.0)**: Load the appropriate indexes based on task needs:
   - **PROJECT_INDEX.json** (~160KB): Code structure, functions, dependencies (no images)
   - **VISUAL_ASSETS_INDEX.json** (~124KB): All images, videos, icons with metadata
   - **context/project-tree.txt** (~36KB): Directory tree without images
   - **context/project-index.md**: High-level overview with depth-3 tree
   Extract only relevant sections for the current task (e.g., frontend components need `directories['src/components']`, Supabase work needs `supabase/` structure). Check memory/active.json and memory/knowledge.json for related entities (tasks, phases, files, requirements). 
4. **Update indexing** if any structural changes have occurred since last update. Run `./scripts/generate-indexes.sh` to regenerate all 4 indexes. The script automatically separates visual assets from code structure and creates optimized views for different agent needs.
4. **Summarise the context** into a concise brief tailored to the next subagent. Apply context engineering: select only relevant history, compress long logs and isolate unrelated scratchpads. **Structured Brief Format**: Include relevant PROJECT_INDEX.json sections, current task context, related files/symbols, and dependencies. For parallel execution, create isolated context files in `context/subagent-contexts/` to prevent context pollution. Persist the brief in memory/active.json and log a KnowledgeCapture event. 
5. **Identify missing information** and prepare follow‑up questions or research requests. If user clarification is needed, pause and ask. 
6. **Log events:** record a UserMessage for the new request, a PhaseChange to Context Gathering, and a KnowledgeCapture for the context summary.

**Outputs:** Problem statement; context summary; updated context files; new entities/relations in the knowledge graph.

**Loop condition:** If goals or context remain unclear, repeat Steps 1–4. Otherwise, transition to Analysis.

**Subagents Invoked:** 
- context-manager (self_prime: true) - Uses JSON memory directly
- Context7 MCP for library documentation if needed

**Quality Gate:** 
- ✅ Workflow detection logged
- ✅ Context loaded < 100KB
- ✅ Self-priming completed

## Phase 2 – Analysis

**Goal:** Develop a structured understanding of the problem domain.

**Triggers:** Completion of Context Gathering; need to organise knowledge; new entities discovered during later phases.

**Steps:** 
1. **Start TOT analysis in CLAUDE-temp.md** using the template:
   ```markdown
   ## Tree of Thought Analysis
   - **Goal:** [What we're trying to achieve]
   - **Current State:** [What exists now]
   - **Constraints:** [Requirements and limitations]
   
   ### Branch 1: [Approach]
   - Pros/Cons/Feasibility
   
   ### Branch 2: [Alternative]
   - Pros/Cons/Feasibility
   
   ### Selected Path: [Decision with rationale]
   ```
2. **Identify key entities** (requirements, tasks, components, subagents, workflows, user roles) and their relationships (depends_on, belongs_to, implements, uses, assigned_to). 
3. **Invoke tree-of-thought-agent** to construct a Tree‑of‑Thought (ToT) diagram linking entities and showing hierarchies, dependencies and flows. Work in context/CLAUDE-temp.md first. 
4. **Update memory/knowledge.json** with new entity and relation nodes. Validate against schema. 
5. **Document significant decisions** in context/CLAUDE-decisions.md if they affect architecture.
6. **Clear CLAUDE-temp.md** after transferring relevant content to permanent files.
7. **Log events:** PhaseChange to Analysis; Action for entity mapping; Observation for ToT creation.

**Outputs:** Comprehensive entity‑relation map (ToT diagram); enriched knowledge graph.

**Loop condition:** If new entities or relations arise later (e.g. during research or planning), revisit Analysis to update the ToT and graph. Otherwise, move to Research & Synthesis.

**Subagents Invoked:** 
- tree-of-thought-agent (uses Calculator MCP for complexity analysis)
- JSON memory operations (no MCP)

## Phase 3 – Research & Synthesis

**Goal:** Gather evidence, examples and best practices from authoritative sources to inform design decisions.

**Triggers:** Open questions or uncertainties identified during Analysis; domain knowledge gaps; new concepts requiring validation.

**Steps:** 
1. **Define research topics** based on entities and gaps (e.g. React patterns, TypeScript best practices, Tailwind utilities). Prioritise by importance and uncertainty. 
2. **Document research in CLAUDE-temp.md** using the research template:
   ```markdown
   ## Research Findings
   ### Source: [Authority/URL]
   - Key insights:
   - Applicable patterns:
   - Implementation considerations:
   
   ### Synthesis
   - Best practices identified:
   - Recommended approach:
   - Risk assessment:
   ```
3. **For each topic, iterate up to three times:** 
   a. **Invoke the researcher** using Brave Search MCP for web research and Context7 MCP for library documentation. 
   b. **Cross‑validate information** from at least two reputable sources. Note discrepancies and decide whether further research is needed. 
   c. **Extract relevant facts, guidelines and examples**; note their provenance and map them to entities in the knowledge graph. 
   d. **Update findings** in context/CLAUDE-temp.md during research (scratch work). 
4. **Transfer validated patterns** to context/CLAUDE-patterns.md if they become established conventions.
5. **Prioritise information** by relevance, authority and impact; mark critical findings for use in planning. 
6. **Log events:** record Action for each research query; Observation for research results; KnowledgeCapture for summaries; PlanUpdate if new requirements or constraints are discovered.

**Outputs:** Updated research report with citations; knowledge graph entries linking facts to entities; list of open questions (if any).

**Loop condition:** Continue researching until all critical topics have been addressed or iteration caps reached. Unresolved questions become tasks for future investigation. Then proceed to Brainstorm & Evaluation.

**Subagents Invoked:** 
- researcher (uses Brave Search MCP, Context7 MCP)
- JSON memory updates to memory/knowledge.json

## Phase 4 – Brainstorm & Evaluation

**Goal:** Generate and evaluate creative solution components or approaches based on research and analysis.

**Triggers:** Completion of Research & Synthesis; requirement changes introducing new design space.

**Steps:** 
1. **Start brainstorming in CLAUDE-temp.md** using the template:
   ```markdown
   ## Brainstorm Session
   ### Ideas Generated
   1. [Solution A] - Score: X/10
   2. [Solution B] - Score: X/10
   
   ### Evaluation Matrix
   - Technical feasibility
   - User impact
   - Maintenance burden
   - Compliance alignment
   
   ### Selected Solution
   [Final decision with justification]
   ```
2. **Invoke the brainstormer** with the ToT diagram and research highlights. Encourage divergent thinking to propose multiple architectures, workflows, agents or features. 
3. **Evaluate each idea** for feasibility, impact, alignment with goals and elegance. Score ideas (e.g. 1–10) and capture pros/cons and prerequisites in CLAUDE-temp.md. 
4. **Transfer selected patterns** to context/CLAUDE-patterns.md if they establish new conventions.
5. **Document architecture decisions** in context/CLAUDE-decisions.md for significant choices.
6. **Select top ideas** to carry forward into planning. Document justification and tag alternatives as optional enhancements. 
7. **Clear CLAUDE-temp.md** after transferring relevant content.
8. **Log events:** Action for brainstorming session; Observation for idea scores; KnowledgeCapture for recorded insights.

**Outputs:** Ranked solution ideas with evaluations; updated brainstorm document; new concept entities and relations.

**Loop condition:** If the brainstorming session surfaces new questions or if none of the ideas meet constraints, revisit Research or Analysis. Otherwise, move to Planning.

**Subagents Invoked:** 
- brainstormer (uses Brave Search MCP for inspiration)
- JSON memory updates to memory/patterns.json

## Phase 5 – Planning

**Goal:** Formulate an actionable project plan with tasks, timeline and responsibilities.

**Triggers:** Selection of one or more approaches in Brainstorm & Evaluation; requirement changes requiring re‑planning.

**Steps:** 
1. **Synthesize inputs** from context, research, brainstorm results and user goals into a coherent execution plan. 
2. **Invoke planning-task-agent** to break the project into phases and tasks, grouped by lifecycle stage (foundation, backend, frontend, testing, documentation, deployment). Define acceptance criteria, dependencies and responsible subagents for each task. 
3. **Write the plan** to context/CLAUDE-planning.md with numbered steps and narrative rationale. Generate context/CLAUDE-todo.md as a hierarchical checklist of tasks synchronized with TodoWrite tool with statuses ([ ] pending, [~] in progress, [x] complete). Link tasks to entities in memory/active.json and memory/patterns.json. 
4. **Design invocation chains:** For complex features or multi‑agent flows, invoke the invocation-chain-generator to produce an ordered list of subagent calls with parallelism and conditions. Document chains in docs/invocation-chains/<chain-name>.md or within CLAUDE-planning.md. 
5. **Simulate expert panel review:** Internally (or via the reflection-agent), evaluate the plan from the perspectives of requirements, architecture, performance, tooling, design/UX, product vision and domain constraints. Adjust tasks based on feedback and document the rationale in CLAUDE-planning.md. 
6. **Persist the plan and tasks** in the knowledge graph; snapshot the event stream or graph state for traceability. 
7. **Log events:** PlanUpdate for each significant change; KnowledgeCapture for expert feedback notes.

**Outputs:** Finalised plan and task list; invocation chain designs; updated knowledge graph with task entities and relations.

**Loop condition:** Revisit Planning when requirements change, major design flaws are found in Review, or new tasks emerge during execution. Mini‑planning cycles can adjust the plan locally without restarting earlier phases.

**Subagents Invoked:** 
- planning-task-agent (uses Package Version MCP for dependency-aware planning)
- invocation-chain-generator (documents MCP chaining patterns)
- reflection-agent (uses Calculator MCP for metrics)
- JSON memory operations (no MCP)

## Phase 6 – Execution

**Goal:** Implement tasks with mandatory quality gates and automatic documentation.

**Automatic Triggers:** 
- ⚡ Approved plan exists with pending tasks
- ⚡ Workflow execution phase reached
- ⚡ User explicitly requests implementation

**Mandatory Steps:** 
1. **For EVERY task in CLAUDE-todo.md:**
   a. **MUST check workflow:** Match task against WORKFLOWS.md triggers
   b. **MUST self-prime agents:** Include `self_prime: true` in ALL invocations
   c. **MUST track progress:** Update CLAUDE-todo.md status immediately (via TodoWrite) 
   d. **Invoke agents with mandatory self-priming:**
      ```yaml
      # Note: Frontend and backend work is handled by the main agent
      # Use specialized agents for specific domains:
      - supabase-architect: # For design
          self_prime: true
          context: PROJECT_INDEX.json#database
      - supabase-implementation-engineer: # For implementation
          self_prime: true
          implements: supabase-architect output
      - testing-qa-agent:
          self_prime: true
          validate: implementation
      ```
   c. **Follow cross‑cutting best practices** within each subagent invocation: 
      - Enforce the S&W Design system and conventions
      - Adhere to coding standards (TypeScript strict, atomic components)
      - Validate inputs and outputs for security
      - Write unit tests first (TDD) for backend logic
      - Use Playwright MCP tools for frontend testing
      - Use Serena MCP tools for precise code manipulation
   d. **If failures occur** (e.g. tests fail, accessibility issues), log an Error event, attempt a fix and re‑run tests. Only proceed when the task's acceptance criteria are satisfied. 
   e. **MANDATORY post-implementation:**
      - ⚡ Invoke documentation-maintainer (self_prime: true)
      - ⚡ Update CLAUDE-todo.md (mark complete via TodoWrite)
      - ⚡ Update CLAUDE-planning.md (reflect changes)
      - ⚡ Update event-stream.md (log all actions)
      - ⚡ Update memory/active.json with new components
      - ⚡ Archive obsolete docs to archive/ 
2. **Synchronise context**: after each task, update planning and knowledge graph. Add any new tasks discovered during execution to CLAUDE-todo.md (via TodoWrite) and plan mini‑cycles if needed. **CRITICAL**: Run @memory-bank-synchronizer after code changes. 
3. **Log events** continuously: Action (tool usage), Observation (outcomes), PlanUpdate (status changes), KnowledgeCapture (new insights).

**Outputs:** Implemented code or configuration; passing tests; updated docs and design artefacts; completed tasks; knowledge graph reflecting new entities and relations.

**Loop condition:** Continue until all tasks in context/CLAUDE-todo.md for the current project or milestone are completed. If a contradiction or missing piece of information blocks execution, pause and return to Research or Planning as needed.

**Subagents Invoked (ALL with self_prime: true):** 
- supabase-architect (uses Supabase MCP for database design)
- supabase-implementation-engineer (uses Supabase MCP for implementation)
- testing-qa-agent (uses Playwright MCP for E2E tests)
- design-system-architect (uses Playwright MCP for visual validation)
- documentation-maintainer (uses Package Version MCP)
- Main agent uses Serena MCP for code manipulation

**Quality Gates:**
- ✅ All agents self-primed
- ✅ Documentation updated
- ✅ Tests passing
- ✅ Context files current

## Phase 7 – Review & Reflection

**Goal:** Assess and refine the solution using expert feedback and self‑critique.

**Triggers:** Completion of all tasks; interim reviews during execution; after major milestones.

**Steps:** 
1. **Gather a review panel** via the reflection-agent. Define the scope (e.g. feature implementation, overall project) and retrieve deliverables (code, tests, docs, plans). 
2. **Simulate expert perspectives** (requirements, architecture, performance, design/UX, tooling, product vision, domain): 
   - Evaluate whether deliverables meet acceptance criteria
   - Adhere to S&W Design system and coding standards
   - Scale and perform well (LCP < 2.5s, CLS < 0.1)
   - Respect accessibility guidelines (WCAG 2.1 AA)
   - Align with product goals and medical compliance
3. **Aggregate feedback**: identify critical issues (must be fixed) and minor suggestions (defer or archive). Create new tasks in CLAUDE-todo.md (via TodoWrite) and update the plan accordingly. Log a PlanUpdate event. 
4. **Implement fixes**: for critical issues, return to Execution to address them. After fixes, re‑run tests and audits via testing-qa-agent and design-system-architect. 
5. **Reflect on the process**: capture lessons learned and patterns observed as KnowledgeCapture events. Update conventions.md if new standards emerge. 
6. **Update documents**: ensure CLAUDE-planning.md and CLAUDE-todo.md reflect changes; add notes to docs/reviews/ or a reflections section in CLAUDE-planning.md.

**Outputs:** Review report; prioritised issues and improvement tasks; updated plan and todo list; reflection notes captured in the knowledge graph.

**Loop condition:** Repeat review cycles until all critical issues are addressed and deliverables meet quality thresholds. Then proceed to Delivery.

**Subagents Invoked:** reflection-agent, testing-qa-agent, design-system-architect, documentation-maintainer.

## Phase 8 – Delivery

**Goal:** Present final outputs to the user and ensure closure of the project.

**Triggers:** All phases complete; user asks for results; all tasks and critical issues resolved.

**Steps:** 
1. **Verify task completion**: ensure that every item in CLAUDE-todo.md is marked complete and all acceptance criteria are met. Confirm that CLAUDE-planning.md is up to date. 
2. **Gather deliverables**: updated CLAUDE.md, CLAUDE_PROCESS.md, context files, any code or configuration files required by the user. Include test results or performance metrics if relevant. 
3. **Compose final summary**: explain what was accomplished, highlight key decisions and trade‑offs, and confirm that all objectives were met. Do not expose internal chain‑of‑thought or sensitive information. 
4. **Log a Delivery event** in the event stream with a timestamp and summary of delivered items. 
5. **Transition to standby**: await new user instructions. Do not perform further actions until a new user message arrives.

**Outputs:** Final deliverables sent to user; closing report/summary; system enters idle state.

**Subagents Invoked:** documentation-maintainer, memory MCP tools.

## Mandatory Continuous Enforcement

**THESE MUST OCCUR AUTOMATICALLY:**

* **Safety & Compliance:** Sanitise all external inputs, verify information, secure secrets and enforce user confirmation for side‑effect operations.

* **Logging:** Claude appends structured events to event-stream.md after every user input, agent selection, tool call, observation, plan update, knowledge capture, error and delivery. Logging is centralised and always uses the standard event schema. Agent outputs are organized in context/agent-outputs/{request_id}/{agent-name}/ with linked metadata.

* **Memory & Knowledge Graph Management:** Memory MCP tools persist new entities/relations and ensure schema compliance. Summarisation and archival occur when context or memory thresholds are exceeded.

* **Memory Bank System Protocol:**
  - **Load Order**: Always read memory bank files in sequence:
    1. CLAUDE-activeContext.md (session state)
    2. CLAUDE-patterns.md (code patterns)
    3. CLAUDE-decisions.md (architecture)
    4. CLAUDE-troubleshooting.md (issues)
    5. CLAUDE-config-variables.md (config)
  - **Update Frequency**: After every significant task completion
  - **CLAUDE-temp.md Usage**: Use for TOT, research, brainstorm scratch work only
  - **Clear Policy**: Clear CLAUDE-temp.md after transferring relevant content
  - **Persistence**: Never delete core memory bank files (CLAUDE-*.md)

* **Automatic Documentation Protocol:** 
  - Trigger: AFTER EVERY code change, bug fix, or feature
  - Action: Invoke documentation-maintainer with self_prime: true
  - Verify: Check doc-ref.md updated, obsolete docs archived
  - Frequency: 100% of implementations

* **Workflow Detection Protocol:**
  - Trigger: EVERY user message
  - Action: Check against WORKFLOWS.md triggers
  - Log: Record detection result in event-stream.md
  - Fallback: Use Agent Selection Matrix if no match
  - **Critical Agents:**
    - @memory-bank-synchronizer: MUST run after code changes
    - @code-searcher: MUST run before code modifications

* **Self-Priming Protocol:**
  - Trigger: EVERY agent invocation
  - Action: Include self_prime: true parameter
  - Verify: Agent runs /prime and loads context
  - Track: Log violations as errors

* **Project Index Maintenance (v2.0):** All 4 indexes are AUTO-GENERATED. Run `./scripts/generate-indexes.sh` after structural changes. NEVER edit indexes manually. The script generates:
  - `PROJECT_INDEX.json` (~160KB): Code structure, functions, dependencies (no images)
  - `VISUAL_ASSETS_INDEX.json` (~124KB): All images, videos, icons with metadata  
  - `context/project-tree.txt` (~36KB): Directory tree without images
  - `context/project-index.md`: High-level overview with depth-3 tree

* **File Organization Enforcement:** Zero tolerance for misplaced files:
  - **Prevention**: Pre-commit hook blocks commits with violations
  - **Detection**: Run `./scripts/file-organization-scanner.sh` periodically
  - **Correction**: Use `./scripts/auto-file-mover.sh` to fix violations
  - **Root Limit**: Maximum 35 files in root (config only)
  - **Violations**: Log as errors in event-stream.md

* **Context Management Protocol (v2.0):**
  - **4-Index System**: Load appropriate indexes based on task type
  - **Code Work**: Use PROJECT_INDEX.json (~160KB) for structure
  - **UI Work**: Add VISUAL_ASSETS_INDEX.json (~124KB) for images
  - **Navigation**: Use context/project-tree.txt (~36KB) for directories
  - **Overview**: Use context/project-index.md for high-level view
  - **Isolate**: Use context/subagent-contexts/ for parallel tasks
  - **Clean**: Delete isolated contexts after completion
  - **Archive**: Move obsolete context to archive/ after 7 days

* **Workflow Maintenance:** Workflows and invocation chains are updated or added when new patterns emerge. The workflow gateway uses these to streamline common tasks.

## Context Navigation Quick Reference (v2.0)

For efficient context management across the large codebase (2000+ files), use the 4-index system:

### Index Files (v2.0)

| Index File | Size | Purpose | Contents |
|------------|------|---------|----------|
| PROJECT_INDEX.json | ~160KB | Code structure analysis | Functions, classes, dependencies (no images) |
| VISUAL_ASSETS_INDEX.json | ~124KB | Visual asset inventory | All images, videos, icons with metadata |
| context/project-tree.txt | ~36KB | Directory navigation | Tree view without images |
| context/project-index.md | ~10KB | High-level overview | Depth-3 tree with statistics |

### Initial Setup (All Agents)
1. **Generate indexes if missing**: Run `./scripts/generate-indexes.sh`
2. **Load appropriate indexes based on task**:
   - Code work: Load PROJECT_INDEX.json
   - UI work: Load PROJECT_INDEX.json + VISUAL_ASSETS_INDEX.json
   - Navigation: Use context/project-tree.txt
   - Overview: Read context/project-index.md
3. **Extract relevant sections**: Use domain-specific patterns below

### Domain-Specific Context Patterns
- **Main agent (frontend)**: Focus on `directories['src/components']`, `files[filename].functions` for component APIs, `dependency_graph` for imports
- **Main agent (backend)**: Focus on API routes structure, service method signatures, service layer dependencies  
- **supabase-architect**: Extract `supabase/` directory, migration files, schema definitions
- **testing-qa-agent**: Use `files` section for test patterns, `dependency_graph` for coverage areas
- **documentation-maintainer**: Focus on `documentation_map`, `directory_purposes`, all `.md` files

### Context Budget Management (v2.0)

#### 4-Index System Benefits
- **Separation of Concerns**: Code separate from visual assets
- **Optimized Size**: 73% reduction in PROJECT_INDEX.json (was 617KB, now 160KB)
- **Selective Loading**: Load only needed indexes
- **Clean Navigation**: Tree views exclude image clutter

#### Loading Strategy
- **Base Load**: PROJECT_INDEX.json (~160KB) for code awareness
- **UI Tasks**: Add VISUAL_ASSETS_INDEX.json (~124KB)
- **Navigation**: Use lightweight project-tree.txt (~36KB)
- **Overview**: Quick project-index.md (~10KB)

### Index Generation (v2.0)

**Manual Regeneration**: Run `./scripts/generate-indexes.sh` to update all 4 indexes:
- Separates visual assets from code
- Generates tree views without images
- Creates high-level overview with depth-3 limit
- Maintains consistency across all indexes

### Best Practices (v2.0)
- **Use 4-index system**: Load only indexes relevant to task
- **Symbol-first navigation**: Use Serena MCP tools for precise code location
- **Cache context briefs**: Store in memory MCP for reuse
- **Isolated contexts**: Create temporary context files for parallel execution
- **Update triggers**: Run `./scripts/generate-indexes.sh` after structural changes

## Project-Specific Workflows

### Frontend Feature Workflow
1. planning-task-agent → design-system-architect → main agent (frontend) → testing-qa-agent → documentation-maintainer

### Backend API Workflow
1. planning-task-agent → main agent (backend) → supabase-architect → supabase-implementation-engineer → testing-qa-agent → documentation-maintainer

### Full Stack Feature Workflow
1. planning-task-agent → requirements-spec-agent → supabase-architect → main agent (backend) → main agent (frontend) → testing-qa-agent → documentation-maintainer

### Bug Fix Workflow
1. context-manager → tree-of-thought-agent → main agent → testing-qa-agent → git-agent → documentation-maintainer

### Design System Update Workflow
1. design-system-architect → main agent (for all affected components) → testing-qa-agent → documentation-maintainer

By following this process, the CLAUDE system leverages specialised subagents to deliver high‑quality outcomes while maintaining flexibility, safety, documentation integrity and adherence to the S&W Design system standards. The orchestrator coordinates subagents through transparent workflows, manages context and memory effectively, and adapts to changing requirements without sacrificing structure or traceability.