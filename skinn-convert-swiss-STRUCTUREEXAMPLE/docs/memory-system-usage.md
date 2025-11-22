# Memory System v2.0 Usage Examples

## Quick Start

The v2.0 JSON memory system provides efficient context management through tiered storage and MCP tools.

## Basic Usage

### Reading Memory
```typescript
// Using MCP memory tools
const searchResults = await mcp__memory__aim_search_nodes({
  query: "atomic_component",
  context: "design"
});
```

### Writing Memory
```typescript
// Store a new pattern
await mcp__memory__aim_create_entities({
  entities: [{
    name: "my_pattern",
    entityType: "code_pattern",
    observations: ["Pattern description", "Usage notes"]
  }]
});
```

### Creating Relations
```typescript
// Link entities
await mcp__memory__aim_create_relations({
  relations: [{
    from: "component_A",
    to: "component_B",
    relationType: "depends_on"
  }]
});
```

## Memory Files

### active.json (8K tokens)
Current session state and active tasks:
```json
{
  "session": {
    "id": "session-2025-08-26",
    "phase": "DELIVER",
    "task": {
      "description": "Current work",
      "status": "in_progress"
    }
  }
}
```

### patterns.json (2K tokens)  
Frequently used patterns:
```json
{
  "patterns": {
    "ui": {
      "atomic_component": {
        "rule": "Components must be ≤50 lines",
        "usage_count": 87
      }
    }
  }
}
```

### knowledge.json (32K tokens)
Long-term storage and archives:
```json
{
  "research_findings": [],
  "architectural_decisions": [],
  "historical_data": []
}
```

## Agent Integration

Agents automatically use the memory system through:
1. **Self-priming**: Load relevant context on invocation
2. **Request tracking**: Chain operations with request_id
3. **Event logging**: Record actions to memory/active.json

## Best Practices

1. **Use appropriate tiers**: 
   - Tier 1 (2K): Frequently accessed patterns
   - Tier 2 (8K): Active work context
   - Tier 3 (32K): Archives and research

2. **Keep memory focused**: Don't store temporary data
3. **Use relations**: Link related entities for better context
4. **Clean up regularly**: Archive old data to tier 3

## Troubleshooting

### Memory not persisting?
Check that you're using the correct location parameter:
- `"project"` for project-local storage
- `"global"` for system-wide storage

### Context too large?
Use tiered loading to stay within token limits:
- Load only tier 1 for quick operations
- Add tier 2 for active work
- Include tier 3 only when needed

### Can't find entities?
Use search with partial matching:
```typescript
await mcp__memory__aim_search_nodes({
  query: "partial_name",
  context: "optional_context"
});
```

---
*Memory System v2.0 - Simple, Efficient, Functional*