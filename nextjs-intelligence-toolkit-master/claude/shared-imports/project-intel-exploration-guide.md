# Project-Intel.mjs Intelligence Exploration Guide

## Purpose

**Token-Efficient Codebase Intelligence** - Achieve 80%+ token savings by querying lightweight intelligence indexes before reading files.

**When to Use**: ALWAYS as the first step before reading any files.

---

## Token Comparison

**Traditional**: Read 4 files = 22,000 tokens
**Intelligence-First**: Query + targeted read = 600 tokens (97% savings)

---

## Core Workflow: Adaptive Intelligence Gathering

### Phase 1: Initial Assessment (150 tokens)

```bash
# ALWAYS START HERE
project-intel.mjs stats --json           # 50 tokens - baseline
project-intel.mjs tree --max-depth 2     # 100 tokens - structure
```

### Phase 2: Task-Specific Routing

Choose pattern based on task:

| Task | Query Sequence | Tokens |
|------|----------------|---------|
| 🐛 **Bug Diagnosis** | search → debug → callers/callees → trace | ~350 |
| 🚀 **Feature Planning** | tree → search → summarize → imports/importers | ~300 |
| 🏗️ **Architecture Review** | stats → report → metrics → map-imports | ~550 |
| ✅ **Quality Audit** | metrics → dead → sanitize → report | ~500 |
| ♻️ **Refactoring Impact** | callers → importers → dead → search | ~300 |

### Phase 3: Iterative Deepening

**Coverage Check**:
- ✓ Understand purpose? → If NO: `investigate <terms>`
- ✓ Know dependencies? → If NO: `imports` + `importers`
- ✓ Know usage? → If NO: `callers` + `callees`
- ✓ Know execution paths? → If NO: `trace <fn1> <fn2>`

**Stop when**: Can answer task without file reads OR identified specific lines to read.

### Phase 4: Targeted File Read

Only after intelligence gathering, read specific file:line ranges identified by queries.

---

## Command Reference

### Structure Discovery
```bash
stats                # Project overview
tree [--max-depth n] # Directory hierarchy
summarize <path>     # Directory/file summary
```

### Dependency Analysis
```bash
imports <file>            # What file imports
importers <module>        # Who imports module
callers <fn>              # Who calls function
callees <fn>              # What function calls
trace <fn1> <fn2>         # Call path between functions
```

### Quality Assessment
```bash
metrics          # Complexity hotspots
dead [-l n]      # Unused exports
sanitize [--tests] # Dead code + test inventory
report [--focus <path>] # Repository health
```

### Content Search
```bash
search <term> [--regex] [-l n]     # Files/symbols matching term
investigate <term...> [-l n]       # Multi-term deep search
debug <fn|file>                    # Focused analysis
docs <term>                        # Documentation search
```

### Specialized
```bash
map-imports <type>  # Recursive import mapping (memory|skills|commands|agents)
```

---

## Detailed Patterns

### 🐛 Bug Diagnosis
```bash
# Step 1: Locate component
project-intel.mjs search "LoginForm" --json

# Step 2: Analyze function
project-intel.mjs debug handleLogin --json

# Step 3: Trace execution
project-intel.mjs callers handleLogin --json
project-intel.mjs callees handleLogin --json

# Step 4: Find execution path
project-intel.mjs trace ComponentMount handleLogin

# Result: ~350 tokens, identified bug location before file read
```

### 🚀 Feature Planning
```bash
# Step 1: Find similar features
project-intel.mjs search "similar-feature" --json

# Step 2: Understand structure
project-intel.mjs summarize src/features/similar --json

# Step 3: Map dependencies
project-intel.mjs imports src/features/similar/index.ts --json

# Step 4: Find usage
project-intel.mjs importers @/features/similar --json

# Result: ~300 tokens, know where new feature fits
```

### ♻️ Refactoring Impact
```bash
# Step 1: Find direct dependents
project-intel.mjs callers targetFunction --json

# Step 2: Find module dependents
project-intel.mjs importers @/module/target --json

# Step 3: Trace downstream (repeat for each caller)
project-intel.mjs callers caller1 --json

# Result: ~300 tokens, full impact radius mapped
```

---

## Advanced Patterns

### Parallel Queries
```bash
# Execute independent queries simultaneously
project-intel.mjs search "auth" --json &
project-intel.mjs search "payment" --json &
wait
```

### Call Graph Reconstruction
```bash
# Build complete execution path
project-intel.mjs callees main --json  # Get called functions
# Then trace each: project-intel.mjs callees <fn> --json
```

### Impact Radius Mapping
```bash
# Find what breaks if X changes
project-intel.mjs callers targetFn --json    # Direct callers
# Then: project-intel.mjs callers <caller> --json (recursive)
project-intel.mjs importers @/module --json  # Module dependents
```

### Dead Code Identification
```bash
project-intel.mjs dead -l 100 --json         # Functions with no callers
project-intel.mjs sanitize --tests --json    # + test inventory
```

---

## Best Practices

### Token Budgeting
- Initial assessment: 150 tokens
- Targeted search: 50-100 tokens
- Deep investigation: 150-200 tokens
- **Goal**: <500 tokens before file reads

### Query Sequencing
1. Broad → Narrow (stats → search → debug)
2. Structure → Content (tree → search → investigate)
3. Static → Dynamic (imports → callers → trace)

### Output Management
```bash
# Always use --json for parseable output
project-intel.mjs search "term" --json | jq '.[] | select(.type=="symbol")'

# Limit output to prevent overflow
project-intel.mjs callers popular_fn -l 20 --json

# Save for reuse
project-intel.mjs report --json > report.json
```

### Progressive Disclosure
```
Level 1 (150 tokens): stats + tree
Level 2 (300 tokens): search + summarize
Level 3 (600 tokens): investigate + debug
Level 4: File read (only specific lines)
```

---

## Integration with Agents

### code-analyzer.md
**When**: Bug diagnosis, architecture analysis
**Pattern**: stats → search → debug → callers/callees → targeted read

### tree-of-thought-agent.md
**When**: System understanding, complex decomposition
**Pattern**: stats → report → tree → map dependencies → build hierarchical model

### index-analyzer.md
**When**: Deep codebase analysis
**Pattern**: Adaptive routing based on request type → progressive disclosure

---

## Quick Reference

### Task → Commands Cheat Sheet

```
Bug:          search → debug → callers → trace
Feature:      tree → search → summarize → imports
Architecture: stats → report → metrics → map-imports
Quality:      metrics → dead → sanitize → report
Refactor:     callers → importers → dead → search
```

### Command Options

```
--json        : JSON output (always use)
-l <n>        : Limit results
--regex       : Regex pattern matching
--max-depth n : Tree depth limit
--focus <path>: Report focus area
--tests       : Include test files (sanitize)
--force       : Bypass output warnings
```

---

## Remember

1. **Query before read** - 80%+ token savings
2. **Adapt your approach** - Different tasks need different patterns
3. **Iterate progressively** - Start broad, narrow down
4. **Validate findings** - Cross-reference before file reads

**Goal**: Build complete understanding with <500 tokens of queries before reading files.

---

*Version: 1.0 | Compatible with: project-intel.mjs v1.0+*
