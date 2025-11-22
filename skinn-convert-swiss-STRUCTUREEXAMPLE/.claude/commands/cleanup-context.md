# Memory Bank & Context Optimization - JSON System v2.0

You are a memory bank optimization specialist tasked with reducing token usage in the project's JSON memory system and documentation while maintaining all essential information and improving organization.

## Task Overview

Analyze the project's memory system (memory/*.json files and CLAUDE.md) to identify and eliminate token waste through:

1. **Duplicate content removal**
2. **Obsolete data elimination**
3. **Content consolidation**
4. **Archive strategy implementation**
5. **JSON structure optimization**

## Memory System Structure (v2.0)

### Core JSON Memory Files
- **memory/active.json** (8K tokens) - Session state and event logs
- **memory/patterns.json** (2K tokens) - Code patterns with confidence scores
- **memory/knowledge.json** (32K tokens) - Research, troubleshooting, configuration
- **memory/decisions.json** (8K tokens) - Architecture decisions with TTL
- **memory/agent-groups.json** (8K tokens) - Agent capabilities and MCP mappings

### 4-Index System Files
- **PROJECT_INDEX.json** (~160KB) - Code structure, no images
- **VISUAL_ASSETS_INDEX.json** (~124KB) - All visual assets
- **context/project-tree.txt** (~36KB) - Directory tree
- **context/project-index.md** (~10KB) - High-level overview

## Analysis Phase

### 1. Initial Assessment

```bash
# Get comprehensive memory size analysis
for file in memory/*.json; do
  echo "$file: $(wc -c < "$file") bytes, $(jq 'keys | length' "$file" 2>/dev/null || echo "N/A") top-level keys"
done

# Check CLAUDE.md and context files
wc -c CLAUDE.md context/*.md
```

**Examine for:**
- Stale session data in memory/active.json
- Patterns with confidence < 0.3 in memory/patterns.json
- Obsolete research in memory/knowledge.json
- Expired decisions (TTL exceeded) in memory/decisions.json
- Duplicate entries across JSON files
- Verbose descriptions that could be streamlined

### 2. Identify Optimization Opportunities

**High-Impact Targets (prioritize first):**
- Session data older than 7 days in memory/active.json
- Low-confidence patterns (< 0.3) rarely used
- Expired architectural decisions past TTL
- Duplicate knowledge entries across sections
- Completed goals that are fully documented

**Medium-Impact Targets:**
- Research findings superseded by newer information
- Patterns with similar functionality (consolidate)
- Verbose troubleshooting entries

**Low-Impact Targets:**
- Minor JSON structure optimizations
- Description shortening without information loss

## Optimization Strategy

### Phase 1: Clean Active Session Data (Highest Impact)

**Target:** memory/active.json cleanup

**Actions:**
1. Archive completed goals to memory/knowledge.json if valuable
2. Remove recent_completions older than 30 days
3. Clear stale next_actions already completed
4. Reset tokens_used counter if session is new

**Example Cleanup:**
```json
{
  "session": {
    "id": "current-session-id",
    "last_updated": "current-timestamp",
    "phase": "active-phase-only"
  },
  "current_goals": [
    // Only active goals, completed ones archived
  ],
  "recent_completions": [
    // Last 30 days only
  ]
}
```

**Expected Savings:** 2-4KB typically

### Phase 2: Consolidate Patterns (High Impact)

**Target:** memory/patterns.json optimization

**Actions:**
1. Remove patterns with confidence < 0.3 AND usage_count < 3
2. Merge similar patterns (e.g., multiple validation patterns)
3. Archive unused patterns to memory/knowledge.json
4. Update confidence scores based on recent usage

**Consolidation Example:**
```json
{
  "validation_patterns": {
    "name": "Consolidated Validation Patterns",
    "category": "security",
    "confidence": 0.85,
    "variants": ["input", "auth", "data"],
    "mcp_tools": ["serena", "playwright"]
  }
  // Instead of separate input_validation, auth_validation, data_validation
}
```

**Expected Savings:** 1-2KB typically

### Phase 3: Streamline Knowledge Base (Medium Impact)

**Target:** memory/knowledge.json optimization

**Actions:**
1. Deduplicate troubleshooting entries with same solution
2. Archive obsolete research to archive/YYYY-MM-DD/research.json
3. Consolidate configuration into structured format
4. Update MCP tool references to latest versions

**Structure Optimization:**
```json
{
  "troubleshooting": {
    // Group by category, not individual issues
    "authentication": {
      "common_issues": [...],
      "solutions": {...}
    }
  },
  "research": {
    // Archive findings older than 90 days
    "current": {...}
  }
}
```

**Expected Savings:** 5-10KB typically

### Phase 4: Clean Architecture Decisions (Medium Impact)

**Target:** memory/decisions.json TTL enforcement

**Actions:**
1. Archive decisions with expired TTL
2. Update confidence scores based on validation
3. Consolidate related decisions
4. Remove alternatives_considered for finalized decisions

**TTL Cleanup:**
```bash
# Identify expired decisions
jq '.[] | select(.ttl_days != null and 
  (now - (.created | fromdateiso8601)) / 86400 > .ttl_days)' \
  memory/decisions.json
```

**Expected Savings:** 2-3KB typically

### Phase 5: Archive Strategy Implementation

**Target:** Historical data preservation

**Actions:**
1. Create timestamped archive directory
```bash
mkdir -p archive/$(date +%Y-%m-%d)/memory-snapshot/
```

2. Archive obsolete but valuable data
```bash
# Archive old session data
jq '.archived_sessions = .session | del(.session)' \
  memory/active.json > archive/$(date +%Y-%m-%d)/session-archive.json

# Archive low-confidence patterns
jq 'map(select(.confidence < 0.3))' \
  memory/patterns.json > archive/$(date +%Y-%m-%d)/patterns-archive.json
```

3. Create archive index
```json
{
  "archive_date": "YYYY-MM-DD",
  "reason": "routine_optimization",
  "contents": {
    "sessions": "count",
    "patterns": "count",
    "decisions": "count"
  }
}
```

**Expected Savings:** 10-20KB moved to archive

## Implementation Process

### 1. Plan and Validate

```bash
# Use TodoWrite for tracking
TodoWrite with optimization phases:
- [ ] Analyze current memory usage
- [ ] Clean active session data
- [ ] Optimize patterns
- [ ] Streamline knowledge
- [ ] Enforce decision TTLs
- [ ] Implement archival
- [ ] Validate results
```

### 2. Execute with MCP Tools

Use appropriate MCP tools for validation:
- **Serena MCP**: Verify code patterns still exist
  - `mcp__serena__find_symbol` - Validate pattern references
- **Calculator MCP**: Recalculate confidence scores
  - `mcp__calculator__calculate` - Update statistics

### 3. Update References

After optimization:
1. Update CLAUDE.md memory section if structure changed
2. Verify all agent files still reference valid memory paths
3. Update memory/agent-groups.json if capabilities changed
4. Test workflow detection with optimized memory

### 4. Validate Results

```bash
# Calculate total savings
echo "Before: $(du -sh memory/)"
# Run optimization
./optimize-memory.sh
echo "After: $(du -sh memory/)"
echo "Archived: $(du -sh archive/$(date +%Y-%m-%d)/)"

# Validate JSON structure
for file in memory/*.json; do
  jq empty "$file" && echo "✓ $file valid" || echo "✗ $file invalid"
done
```

## Expected Outcomes

### Typical Optimization Results

- **20-30% reduction** in active memory size
- **Improved lookup speed** through consolidated structures
- **Better organization** with categorical grouping
- **Preserved history** via timestamped archives
- **Maintained functionality** with all essential data retained

### Success Metrics

- Total KB savings in memory/ directory
- Number of entries consolidated
- Archive size vs removed data
- JSON validation passing
- No broken agent references

## Quality Assurance

### Information Preservation Checklist

- [ ] All high-confidence patterns preserved (> 0.7)
- [ ] Active troubleshooting solutions retained
- [ ] Current research findings maintained
- [ ] Valid architectural decisions kept
- [ ] MCP tool mappings updated

### Structure Validation Checklist

- [ ] All JSON files pass validation
- [ ] Request IDs maintained for traceability
- [ ] Confidence scores in 0-1 range
- [ ] TTL dates properly formatted
- [ ] No duplicate keys within files

## Post-Optimization Maintenance

### Regular Schedule

- **Daily**: Clean session data in memory/active.json
- **Weekly**: Review pattern confidence scores
- **Monthly**: Archive completed research
- **Quarterly**: Full memory optimization

### Automation Scripts

Create optimization helpers:
```bash
#!/bin/bash
# optimize-memory.sh

# Clean old session data
jq '.recent_completions = .recent_completions[-10:]' \
  memory/active.json > memory/active.tmp && \
  mv memory/active.tmp memory/active.json

# Update pattern confidence
jq 'map_values(if .usage_count > 10 
  then .confidence = ([.confidence, 0.9] | min)
  else . end)' memory/patterns.json > memory/patterns.tmp && \
  mv memory/patterns.tmp memory/patterns.json

echo "Memory optimization complete"
```

## Warning Signs for Re-optimization

- memory/active.json exceeding 10KB
- memory/knowledge.json exceeding 40KB  
- Pattern confidence scores not updated in 30 days
- Decision TTLs not enforced
- Duplicate troubleshooting entries appearing

## Integration with 8-Phase Process

This optimization aligns with Phase 1 (Context Gathering) of CLAUDE_PROCESS.md:
- Ensures efficient memory loading
- Maintains token budget compliance
- Supports tiered memory architecture
- Enables quick context retrieval

Remember: The JSON memory system is designed for efficiency. Keep it lean, structured, and actively maintained through regular optimization cycles.