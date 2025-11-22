# Update Memory Bank - JSON System v2.0

Update CLAUDE.md and JSON memory bank files (memory/*.json) following the tiered memory architecture and 8-phase process workflow.

## Memory System Architecture (v2.0)

### Core JSON Memory Files
- **memory/active.json** (8K tokens) - Current session state, active tasks, event logs
- **memory/patterns.json** (2K tokens) - Frequently used patterns with usage statistics
- **memory/knowledge.json** (32K tokens) - Configuration, troubleshooting, research
- **memory/decisions.json** (8K tokens) - Architecture decisions with confidence scores
- **memory/agent-groups.json** (8K tokens) - Agent organization and capabilities

## Update Process

### Phase 1: Context Gathering (MANDATORY)
```bash
# Load current memory state
1. Check memory/active.json for session context
2. Load relevant memory tiers based on update scope
3. Use PROJECT_INDEX.json for code structure awareness
4. Detect workflow triggers from WORKFLOWS.md
```

### Phase 2: Analysis
```bash
# Identify what needs updating
1. Use Serena MCP tools to scan for changes:
   - mcp__serena__find_symbol for code changes
   - mcp__serena__search_for_pattern for pattern detection
2. Compare current state vs memory records
3. Identify new patterns, decisions, or knowledge
```

### Phase 3: Memory Update Strategy

#### Update memory/active.json
```json
{
  "session": {
    "last_updated": "[current_timestamp]",
    "phase": "[current_phase]",
    "task": {
      "id": "[task_id]",
      "status": "[status]",
      "progress": [0-1]
    }
  },
  "current_goals": [
    {
      "id": "[goal_id]",
      "status": "completed|in_progress|pending",
      "completion": [0-1]
    }
  ],
  "recent_completions": [
    {
      "task": "[task_name]",
      "completed": "[date]",
      "impact": "critical|high|medium|low"
    }
  ]
}
```

#### Update memory/patterns.json
```json
{
  "[pattern_name]": {
    "name": "[Pattern Name]",
    "category": "[category]",
    "confidence": [0-1],
    "usage_count": [number],
    "last_used": "[timestamp]",
    "example": "[code_example]",
    "mcp_tools": ["serena", "playwright"]
  }
}
```

#### Update memory/knowledge.json
```json
{
  "troubleshooting": {
    "[issue_id]": {
      "problem": "[description]",
      "solution": "[solution]",
      "date_resolved": "[date]",
      "mcp_tools_used": ["tool_names"]
    }
  },
  "research": {
    "[topic]": {
      "findings": "[research_results]",
      "sources": ["urls"],
      "date": "[date]",
      "confidence": [0-1]
    }
  }
}
```

#### Update memory/decisions.json
```json
{
  "[decision_id]": {
    "decision": "[description]",
    "rationale": "[why]",
    "confidence": [0-1],
    "ttl_days": [number],
    "created": "[date]",
    "alternatives_considered": ["alt1", "alt2"]
  }
}
```

### Phase 4: CLAUDE.md Update

Update main documentation with:
1. New system capabilities
2. Updated MCP tool references
3. Current memory system status
4. Active workflow patterns

### Phase 5: Validation

Use these MCP tools to validate updates:
```bash
# Code validation
- Serena MCP: mcp__serena__find_referencing_symbols
# Test validation  
- Playwright MCP: mcp__playwright__navigate, mcp__playwright__screenshot
# Documentation check
- Context7 MCP: mcp__context7__get-library-docs
```

## MCP Tools Integration

### Recommended MCP Tools for Memory Updates

1. **Serena MCP** - Code exploration and pattern detection
   - `mcp__serena__search_for_pattern` - Find new patterns
   - `mcp__serena__get_symbols_overview` - Understand code structure

2. **Brave Search MCP** - External research for knowledge base
   - `mcp__brave-search__brave_web_search` - Research best practices

3. **Context7 MCP** - Library documentation updates
   - `mcp__context7__resolve-library-id` - Find library IDs
   - `mcp__context7__get-library-docs` - Get latest docs

4. **Calculator MCP** - Metrics and statistics
   - `mcp__calculator__calculate` - Calculate confidence scores

## Automatic Triggers

Memory updates should occur:
- After completing significant tasks
- When new patterns are identified
- After architectural decisions
- When troubleshooting issues are resolved
- After successful research phases

## Quality Gates

Before finalizing updates:
- [ ] All JSON files valid (proper structure)
- [ ] Confidence scores calculated (0-1 range)
- [ ] TTL set for time-sensitive decisions
- [ ] Request IDs tracked for traceability
- [ ] MCP tools properly referenced
- [ ] CLAUDE.md reflects current state

## Archive Strategy

For obsolete information:
```bash
# Create archive with date stamp
mkdir -p archive/$(date +%Y-%m-%d)/
# Move deprecated content
mv [obsolete_file] archive/$(date +%Y-%m-%d)/
# Update references in memory/knowledge.json
```

## Usage Examples

### Quick Pattern Update
```bash
/update-memory-bank pattern="atomic_design" confidence=0.95 usage_count=42
```

### Full System Update
```bash
/update-memory-bank scope="full" include="patterns,decisions,knowledge"
```

### Session State Update
```bash
/update-memory-bank session="active" task="completed" goals="update"
```

## Important Notes

1. **Tiered Loading**: Load only relevant memory tiers to stay within token budget
2. **Self-Prime Protocol**: All agents must include `self_prime: true`
3. **Request Tracking**: Every operation needs a unique request_id
4. **Confidence Scoring**: Track pattern confidence (0-1) based on success rate
5. **TTL Management**: Set expiry for time-sensitive decisions
6. **MCP Integration**: Use appropriate MCP tools for validation and research

Remember: The JSON memory system is the single source of truth for project state, patterns, and decisions. Keep it updated, validated, and properly structured.