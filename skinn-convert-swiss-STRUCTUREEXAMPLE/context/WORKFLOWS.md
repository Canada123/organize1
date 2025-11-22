# WORKFLOWS.md - Standard Orchestration Patterns
VERSION: 1.0
CREATED: 2025-11-21
PURPOSE: Predefined workflows for common development scenarios with parallel execution patterns

## Core Principles

1. **Main Agent Implements**: ALL code changes are executed by the main agent
2. **Subagents Inform**: Most subagents ONLY gather information, analyze, and report
   - EXCEPTION: supabase-implementation-engineer can implement database changes
3. **Parallel by Default**: Independent tasks run concurrently
4. **Context Maintenance**: Every workflow includes documentation and context updates
5. **Checkpoint Recovery**: Complex workflows save state at phase boundaries
6. **Mandatory Self-Priming**: ALL agents MUST run `/prime` before starting work
7. **Automatic Documentation**: documentation-maintainer invoked after EVERY implementation

## Agent Selection Matrix with Explicit Triggers (v2.0)

| Task Type | Trigger Keywords | Primary Agents | Support Agents | Parallel? | Output Type | Index Focus |
| **Research new technology** | "research", "explore", "investigate", "best practices" | researcher | tree-of-thought, brainstormer | ✅ Yes | Research brief | PROJECT_INDEX + docs |
| **Create UI component** | "component", "UI", "frontend", "design", "interface" | design-system-architect, requirements-spec-agent | context-manager | ✅ Yes | Design spec + requirements | PROJECT_INDEX + VISUAL_ASSETS |
| **Fix bug** | "bug", "error", "broken", "fix", "issue", "not working" | tree-of-thought-agent | researcher, testing-qa-agent | ⚠️ Partial | Root cause analysis + fix spec | PROJECT_INDEX + tree |
| **Update documentation** | "document", "readme", "guide", "explain" | documentation-maintainer | context-manager | ❌ No | Documentation updates | All 4 indexes |
| **Database design** | "database", "schema", "table", "migration" | supabase-architect | requirements-spec-agent | ❌ No | Schema + migration spec | PROJECT_INDEX |
| **Database implementation** | "implement database", "apply migration", "create tables" | supabase-implementation-engineer | supabase-architect | ❌ No | Implemented database changes | PROJECT_INDEX |
| **Performance optimization** | "performance", "slow", "optimize", "speed" | testing-qa-agent | researcher, reflection-agent | ✅ Yes | Performance report + optimizations | PROJECT_INDEX |
| **Security audit** | "security", "vulnerability", "audit", "compliance" | testing-qa-agent | researcher, requirements-spec-agent | ✅ Yes | Security report + fixes | PROJECT_INDEX |
| **Code refactoring** | "refactor", "cleanup", "reorganize", "improve code" | repository-conformance-agent | design-system-architect | ⚠️ Partial | Refactoring plan | PROJECT_INDEX + tree |
| **API development** | "API", "endpoint", "REST", "backend" | backend-developer | supabase-architect | ✅ Yes | API spec + implementation | PROJECT_INDEX |
| **Testing** | "test", "verify", "validate", "QA" | testing-qa-agent | requirements-spec-agent | ✅ Yes | Test report + coverage | PROJECT_INDEX + VISUAL_ASSETS |

## Standard Workflows

### 1. Feature Implementation Workflow

```yaml
name: feature-implementation
description: Complete feature development from research to deployment
phases:
  - name: research_and_analysis
    parallel: true
    agents:
      - researcher: 
          task: "Research best practices for {feature_type}"
          output: "best_practices_brief.json"
      - context-manager:
          task: "Load current architecture and dependencies"
          output: "architecture_context.json"
      - requirements-spec-agent:
          task: "Gather and structure feature requirements"
          output: "requirements_spec.json"
      - tree-of-thought-agent:
          task: "Analyze implementation complexity"
          output: "complexity_analysis.json"
  
  - name: planning_and_design
    parallel: false
    checkpoint: true
    agents:
      - planning-task-agent:
          task: "Create detailed implementation plan"
          input: ["research_results", "requirements"]
          output: "implementation_plan.json"
      - invocation-chain-generator:
          task: "Design optimal execution sequence"
          output: "execution_chain.json"
  
  - name: specification_preparation
    parallel: true
    agents:
      - design-system-architect:
          task: "Create UI specifications and component designs"
          output: "ui_specifications.json"
      - database-supabase-agent:
          task: "Design schema and migrations if needed"
          output: "database_spec.json"
      - context-manager:
          task: "Build comprehensive implementation brief"
          input: ["all_specifications"]
          output: "implementation_brief.json"
  
  - name: implementation
    parallel: false
    checkpoint: true
    executor: main-agent
    tasks:
      - "Implement based on implementation_brief.json"
      - "Create all necessary files and components"
      - "Apply database migrations if needed"
  
  - name: validation_and_testing
    parallel: true
    agents:
      - testing-qa-agent:
          task: "Run comprehensive test suite"
          output: "test_report.json"
      - design-system-architect:
          task: "Validate UI compliance"
          output: "ui_validation.json"
      - repository-conformance-agent:
          task: "Check code standards"
          output: "conformance_report.json"
  
  - name: documentation_and_archival
    parallel: false
    agents:
      - documentation-maintainer:
          task: "Update all documentation"
          output: "documentation_updates.json"
      - context-manager:
          task: "Archive iteration and update context"
          output: "context_archived.json"
```

### 2. Bug Fix Workflow

```yaml
name: bug-fix
description: Rapid bug identification and resolution
phases:
  - name: bug_analysis
    parallel: true
    agents:
      - context-manager:
          task: "Load bug context and reproduction steps"
          output: "bug_context.json"
      - tree-of-thought-agent:
          task: "Analyze root cause"
          output: "root_cause_analysis.json"
      - researcher:
          task: "Research similar issues and solutions"
          output: "similar_issues.json"
  
  - name: solution_design
    parallel: false
    checkpoint: true
    agents:
      - brainstormer:
          task: "Generate multiple fix approaches"
          input: ["root_cause_analysis"]
          output: "fix_approaches.json"
      - requirements-spec-agent:
          task: "Define fix acceptance criteria"
          output: "fix_criteria.json"
  
  - name: fix_preparation
    parallel: false
    agents:
      - context-manager:
          task: "Build focused fix brief"
          input: ["selected_approach", "fix_criteria"]
          output: "fix_brief.json"
  
  - name: fix_implementation
    parallel: false
    executor: main-agent
    tasks:
      - "Apply fix based on fix_brief.json"
      - "Update affected components"
  
  - name: fix_validation
    parallel: false
    agents:
      - testing-qa-agent:
          task: "Verify fix and check for regressions"
          output: "fix_validation.json"
      - reflection-agent:
          task: "Review solution quality"
          output: "solution_review.json"
```

### 3. Research & Analysis Workflow

```yaml
name: deep-research
description: Comprehensive research for technical decisions
phases:
  - name: discovery
    parallel: true
    agents:
      - researcher:
          task: "Broad topic research across authoritative sources"
          output: "research_findings.json"
      - tree-of-thought-agent:
          task: "Map problem space and dependencies"
          output: "problem_map.json"
      - context-manager:
          task: "Gather existing project knowledge"
          output: "existing_knowledge.json"
  
  - name: synthesis
    parallel: false
    checkpoint: true
    agents:
      - brainstormer:
          task: "Generate potential approaches"
          input: ["research_findings", "problem_map"]
          output: "approaches.json"
      - reflection-agent:
          task: "Evaluate and rank options"
          output: "evaluation.json"
  
  - name: documentation
    parallel: false
    agents:
      - documentation-maintainer:
          task: "Create comprehensive research report"
          output: "research_report.md"
      - graph-memory-agent:
          task: "Store findings in knowledge graph"
          output: "knowledge_stored.json"
```

### 4. Performance Optimization Workflow

```yaml
name: performance-optimization
description: Identify and fix performance bottlenecks
phases:
  - name: performance_analysis
    parallel: true
    agents:
      - testing-qa-agent:
          task: "Run performance benchmarks"
          output: "performance_baseline.json"
      - researcher:
          task: "Research optimization techniques"
          output: "optimization_techniques.json"
      - tree-of-thought-agent:
          task: "Analyze bottlenecks"
          output: "bottleneck_analysis.json"
  
  - name: optimization_planning
    parallel: false
    checkpoint: true
    agents:
      - planning-task-agent:
          task: "Create optimization plan"
          input: ["bottleneck_analysis", "techniques"]
          output: "optimization_plan.json"
      - requirements-spec-agent:
          task: "Define performance targets"
          output: "performance_targets.json"
  
  - name: implementation_prep
    parallel: false
    agents:
      - context-manager:
          task: "Build optimization brief"
          output: "optimization_brief.json"
  
  - name: optimization_implementation
    parallel: false
    executor: main-agent
    tasks:
      - "Apply optimizations from brief"
      - "Refactor performance-critical code"
  
  - name: validation
    parallel: true
    agents:
      - testing-qa-agent:
          task: "Measure performance improvements"
          output: "performance_results.json"
      - reflection-agent:
          task: "Validate optimization quality"
          output: "optimization_review.json"
```

### 5. Security Audit Workflow

```yaml
name: security-audit
description: Comprehensive security assessment and remediation
phases:
  - name: security_assessment
    parallel: true
    agents:
      - testing-qa-agent:
          task: "Run security vulnerability scans"
          output: "vulnerability_report.json"
      - researcher:
          task: "Research latest security threats"
          output: "threat_landscape.json"
      - requirements-spec-agent:
          task: "Define security requirements"
          output: "security_requirements.json"
  
  - name: risk_analysis
    parallel: false
    checkpoint: true
    agents:
      - tree-of-thought-agent:
          task: "Analyze security risks"
          input: ["vulnerability_report", "threats"]
          output: "risk_analysis.json"
      - planning-task-agent:
          task: "Prioritize security fixes"
          output: "fix_priority.json"
  
  - name: remediation_planning
    parallel: false
    agents:
      - context-manager:
          task: "Build security fix brief"
          input: ["priority_fixes"]
          output: "security_fix_brief.json"
  
  - name: security_implementation
    parallel: false
    executor: main-agent
    checkpoint: true
    tasks:
      - "Apply security fixes from brief"
      - "Update security configurations"
  
  - name: security_validation
    parallel: false
    agents:
      - testing-qa-agent:
          task: "Verify security fixes"
          output: "security_validation.json"
```

### 6. File Organization Cleanup Workflow

```yaml
name: file-organization-cleanup
description: Detect and fix file organization violations
triggers:
  - keywords: ["cleanup", "organize", "misplaced", "file organization", "root files"]
  - patterns: ["clean.*repository", "fix.*files", "organize.*project"]
phases:
  - name: detection
    parallel: false
    executor: main-agent
    tasks:
      - "Run file organization scanner"
      - "Identify all violations"
      - "Generate violation report"
    commands:
      - "./scripts/file-organization-scanner.sh"
  
  - name: correction
    parallel: false
    executor: main-agent
    checkpoint: true
    tasks:
      - "Move misplaced files to correct locations"
      - "Update file references if needed"
      - "Remove deprecated directories"
    commands:
      - "./scripts/auto-file-mover.sh"
  
  - name: index_update
    parallel: false
    executor: main-agent
    tasks:
      - "Regenerate 4-index system (v2.0)"
      - "Update project-tree.txt (no images)"
      - "Update PROJECT_INDEX.json (~160KB)"
      - "Update VISUAL_ASSETS_INDEX.json (~124KB)"
      - "Update context/project-index.md (depth-3 tree)"
    commands:
      - "./scripts/generate-indexes.sh"
  
  - name: validation
    parallel: false
    executor: main-agent
    tasks:
      - "Verify no violations remain"
      - "Check root file count ≤35"
      - "Ensure indexes are current"
    commands:
      - "./scripts/file-organization-scanner.sh"
  
  - name: documentation
    parallel: false
    agents:
      - documentation-maintainer:
          task: "Update file organization documentation"
          output: "file_org_updates.json"
```

### 7. Database Migration Workflow

```yaml
name: database-migration
description: Safe database schema updates
triggers:
  - keywords: ["database", "migration", "schema", "table", "column"]
  - patterns: ["add.*table", "modify.*schema", "create.*migration"]
phases:
  - name: schema_analysis
    parallel: true
    agents:
      - supabase-architect:
          self_prime: true
          task: "Analyze current schema and design changes"
          output: "schema_design.json"
      - requirements-spec-agent:
          self_prime: true
          task: "Define migration requirements"
          output: "migration_requirements.json"
      - researcher:
          self_prime: true
          task: "Research migration best practices"
          output: "migration_practices.json"
  
  - name: migration_design
    parallel: false
    checkpoint: true
    agents:
      - supabase-architect:
          self_prime: true
          task: "Design migration strategy with RLS policies"
          input: ["requirements", "current_schema"]
          output: "migration_strategy.json"
      - planning-task-agent:
          self_prime: true
          task: "Create rollback plan"
          output: "rollback_plan.json"
  
  - name: migration_prep
    parallel: false
    agents:
      - context-manager:
          task: "Build migration brief"
          output: "migration_brief.json"
  
  - name: migration_execution
    parallel: false
    executor: supabase-implementation-engineer
    checkpoint: true
    tasks:
      - "Execute migration from brief"
      - "Apply RLS policies"
      - "Update TypeScript types"
      - "Test migration in development"
  
  - name: migration_validation
    parallel: false
    agents:
      - supabase-architect:
          self_prime: true
          task: "Verify migration success and schema integrity"
          output: "migration_validation.json"
      - testing-qa-agent:
          self_prime: true
          task: "Test data integrity and performance"
          output: "integrity_report.json"
      - documentation-maintainer:
          self_prime: true
          task: "Update database documentation"
          output: "docs_updated.json"
```

## Context Brief Template

All subagents must provide information in this structured format:

```json
{
  "brief_id": "BRIEF-{timestamp}-{type}",
  "brief_type": "implementation|fix|optimization|research",
  "created_by": "{agent_name}",
  "timestamp": "ISO-8601",
  
  "objective": {
    "description": "Clear, single objective",
    "success_criteria": ["Measurable outcome 1", "Measurable outcome 2"]
  },
  
  "context": {
    "current_state": {
      "description": "Current system state",
      "relevant_files": ["file1.ts", "file2.tsx"],
      "key_symbols": ["Component1", "function2"]
    },
    "target_state": {
      "description": "Desired outcome",
      "changes_required": ["Change 1", "Change 2"]
    },
    "constraints": ["Constraint 1", "Constraint 2"]
  },
  
  "specifications": {
    "technical": {
      "architecture": "Architecture notes",
      "dependencies": ["dep1", "dep2"],
      "patterns": ["Pattern to follow"]
    },
    "design": {
      "ui_components": ["Component specs"],
      "styling": "Style requirements"
    },
    "testing": {
      "test_cases": ["Test 1", "Test 2"],
      "coverage_requirements": "80%"
    }
  },
  
  "implementation_steps": [
    {
      "step": 1,
      "action": "Specific action",
      "files": ["file_to_modify.ts"],
      "validation": "How to verify"
    }
  ],
  
  "validation": {
    "test_commands": ["npm test specific-test"],
    "success_indicators": ["All tests pass", "No console errors"],
    "rollback_procedure": "How to rollback if needed"
  }
}
```

## Parallel Execution Patterns

### Pattern 1: Independent Research
```javascript
// All research tasks can run simultaneously
const researchResults = await Promise.all([
  researcher.analyze({ topic: 'React 18 best practices' }),
  researcher.analyze({ topic: 'TypeScript 5 features' }),
  researcher.analyze({ topic: 'Performance optimization' })
]);
```

### Pattern 2: Conditional Parallelization
```javascript
// Run additional agents based on initial findings
const initial = await contextManager.analyze();
const tasks = [
  testingAgent.audit()
];

if (initial.needsDesign) {
  tasks.push(designSystemArchitect.specify());
}
if (initial.needsDatabase) {
  tasks.push(databaseAgent.plan());
}

const results = await Promise.all(tasks);
```

### Pattern 3: Staged Parallelization
```javascript
// Phase 1: Gather all information
const phase1 = await Promise.all([
  contextManager.load(),
  researcher.gather(),
  requirementsAgent.collect()
]);

// Phase 2: Process in parallel
const phase2 = await Promise.all([
  planningAgent.plan(phase1),
  designAgent.design(phase1),
  testingAgent.prepare(phase1)
]);

// Phase 3: Main agent implements
const implementation = await mainAgent.implement(phase2);
```

## Checkpoint & Recovery System

### Checkpoint Structure
```json
{
  "checkpoint_id": "CHK-{workflow_id}-{phase}",
  "workflow_id": "WF-feature-123",
  "phase": "specification_preparation",
  "timestamp": "2025-11-21T10:00:00Z",
  "status": "completed|in_progress|failed",
  
  "completed_agents": [
    {"agent": "researcher", "output": "research_brief.json"},
    {"agent": "context-manager", "output": "context.json"}
  ],
  
  "pending_agents": ["design-system-architect", "database-supabase-agent"],
  
  "context_snapshot": {
    "files_modified": ["file1.ts", "file2.tsx"],
    "memory_keys": ["task-123-research", "task-123-context"]
  },
  
  "recovery_instructions": {
    "resume_from": "specification_preparation",
    "skip_agents": ["researcher", "context-manager"],
    "restoration_commands": ["git stash pop", "npm install"]
  }
}
```

### Recovery Procedure
1. Load checkpoint from `context/checkpoints/{workflow_id}.json`
2. Restore context from memory MCP
3. Skip completed agents
4. Resume from pending agents
5. Continue workflow execution

## Workflow Trigger System

### Automatic Workflow Detection
The orchestrator MUST check for workflow triggers on EVERY user message:

```javascript
function detectWorkflow(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Check explicit workflow requests
  if (message.includes('workflow:')) {
    return message.split('workflow:')[1].trim();
  }
  
  // Check keyword triggers
  for (const [workflow, triggers] of workflowTriggers) {
    if (triggers.some(trigger => message.includes(trigger))) {
      return workflow;
    }
  }
  
  // Default to agent selection matrix
  return selectFromMatrix(message);
}
```

### Workflow Trigger Keywords

| Workflow | Primary Triggers | Secondary Triggers |
|----------|-----------------|-------------------|
| feature-implementation | "implement", "create feature", "add functionality" | "build", "develop", "new feature" |
| bug-fix | "bug", "error", "broken", "fix" | "issue", "problem", "not working" |
| deep-research | "research", "investigate", "explore" | "study", "analyze market", "best practices" |
| performance-optimization | "slow", "performance", "optimize" | "speed up", "improve performance", "bottleneck" |
| security-audit | "security", "vulnerability", "audit" | "penetration test", "compliance", "OWASP" |
| file-organization-cleanup | "cleanup", "organize", "misplaced files" | "root files", "file organization", "repository cleanup" |
| database-migration | "database", "migration", "schema change" | "add table", "modify column", "RLS policy" |

## Agent Self-Priming Protocol

EVERY agent MUST follow this protocol:

```yaml
protocol: agent-self-prime-v2
steps:
  1. check_context:
      - Load PROJECT_INDEX.json (~160KB) for code structure
      - Load VISUAL_ASSETS_INDEX.json (~124KB) if UI work
      - Check context/project-tree.txt (~36KB) for navigation
      - Review context/project-index.md for overview
      - Check memory MCP for relevant context
  
  2. expand_context:
      - Use Serena tools to find relevant symbols
      - Load only necessary files/sections
      - Keep under 100KB total context
  
  3. validate_context:
      - Verify all required information present
      - Request missing context from orchestrator
      - Confirm readiness before proceeding
```

## Automatic Documentation Protocol

AFTER EVERY implementation:

```yaml
protocol: auto-documentation
triggers:
  - After code generation
  - After file modification
  - After workflow completion
  - After bug fix
  
steps:
  1. invoke documentation-maintainer:
      task: "Update relevant documentation"
      scope: "Changed files and dependencies"
  
  2. update context files:
      - Update todo.md (mark completed)
      - Update CLAUDE-planning.md (reflect changes)
      - Update event-stream.md (log actions)
  
  3. archive obsolete docs:
      - Move superseded docs to archive/
      - Update doc-ref.md index
```

## Usage Guidelines

1. **MANDATORY Workflow Check**: Orchestrator MUST check for workflow triggers on EVERY message
2. **MANDATORY Self-Prime**: ALL agents MUST self-prime before starting work
3. **MANDATORY Documentation**: documentation-maintainer MUST be invoked after EVERY implementation
4. **Use Agent Selection Matrix**: For quick agent routing when no workflow matches
5. **Prefer Parallel Execution**: Run independent tasks simultaneously
6. **Create Checkpoints**: For any workflow taking >30 minutes
7. **Follow Brief Template**: All agents must provide structured briefs
8. **Track Metrics**: Monitor workflow trigger accuracy and completion rates

## Workflow Metrics

Track these metrics to optimize workflows:
- **Parallel Execution Rate**: Target 40% of all tasks
- **Context Window Usage**: Keep below 30%
- **Workflow Completion Time**: Measure and optimize
- **Checkpoint Recovery Success**: Should be 100%
- **Agent Invocation Accuracy**: Right agent first time