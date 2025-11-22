# shadcn MCP Server Guide

**Last Updated**: 2025-10-31
**Status**: Production
**Purpose**: Comprehensive guide for using shadcn MCP tools effectively in Claude Code

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Available Tools](#available-tools)
- [Optimal Workflows](#optimal-workflows)
- [Registry System](#registry-system)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Anti-Patterns](#anti-patterns)
- [Real-World Examples](#real-world-examples)
- [Troubleshooting](#troubleshooting)

---

## Overview

The shadcn MCP (Model Context Protocol) server provides AI assistants with structured access to shadcn/ui components, blocks, demos, and metadata through a registry-based system.

### Why Use shadcn MCP?

**Token Efficiency**: Query lightweight metadata before reading component source
**Discoverability**: Search and browse available components across registries
**Consistency**: Install components with proper dependencies and configuration
**Examples**: Access usage demos and implementation patterns
**Validation**: Audit checklist ensures correct setup

### What It Does

1. **Search** for components across configured registries
2. **View** component details, files, and dependencies
3. **Discover** usage examples and demos
4. **Generate** CLI commands for installation
5. **Validate** setup with audit checklists

### What It Doesn't Do

- **Does NOT** install components directly (generates CLI commands instead)
- **Does NOT** modify files (you run the generated commands)
- **Does NOT** manage dependencies (handled by shadcn CLI)

---

## Prerequisites

### Required: components.json

The shadcn MCP requires a `components.json` file in your project root:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate"
  },
  "registries": {
    "@shadcn": "https://ui.shadcn.com/registry/items/{name}.json"
  }
}
```

**If Missing**: Run `npx shadcn@latest init` to create it.

### Registry Configuration

Registries are configured in `components.json` under the `registries` field:

```json
{
  "registries": {
    "@shadcn": "https://ui.shadcn.com/registry/items/{name}.json",
    "@v0": "https://v0.dev/chat/b/{name}",
    "@acme": "https://registry.acme.com/{name}.json"
  }
}
```

**Default Registry**: `@shadcn` (official shadcn/ui components)

---

## Available Tools

### 1. get_project_registries

**Purpose**: Get list of configured registry names from components.json

**Parameters**: None

**Returns**: Array of registry names (e.g., `["@shadcn", "@v0"]`)

**Usage**:
```javascript
mcp__shadcn__get_project_registries()
```

**When to Use**:
- Start of session to see available registries
- Before searching to verify registry configuration
- When user asks "what registries are available?"

**Example Response**:
```json
["@shadcn", "@v0", "@acme"]
```

---

### 2. list_items_in_registries

**Purpose**: List all available items in specified registries with pagination

**Parameters**:
- `registries` (required): Array of registry names
- `limit` (optional): Max items to return (default varies)
- `offset` (optional): Skip N items for pagination

**Returns**: Array of items with name, description, type

**Usage**:
```javascript
mcp__shadcn__list_items_in_registries({
  registries: ["@shadcn"],
  limit: 20,
  offset: 0
})
```

**When to Use**:
- Browse all available components
- Paginate through large registries
- Initial discovery ("what components exist?")

**When NOT to Use**:
- Searching for specific component (use search_items instead)
- Need component details (use view_items instead)

---

### 3. search_items_in_registries

**Purpose**: Fuzzy search for components matching query string

**Parameters**:
- `registries` (required): Array of registry names
- `query` (required): Search string (2-4 words max)
- `limit` (optional): Max results
- `offset` (optional): Pagination offset

**Returns**: Array of matching items with name, description, type

**Usage**:
```javascript
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "button",
  limit: 10
})
```

**Search Tips**:
- Use 2-4 word queries for best results
- Searches both names and descriptions
- Fuzzy matching (handles typos)
- Returns most relevant matches first

**Example Queries**:
- `"button"` - Find button components
- `"form input"` - Find form inputs
- `"data table"` - Find data tables
- `"dialog modal"` - Find dialog/modal components

**When to Use**:
- Finding specific component by name
- Discovering related components
- User asks "find me a..." or "I need a..."

---

### 4. view_items_in_registries

**Purpose**: View detailed information about specific items including file contents

**Parameters**:
- `items` (required): Array of items with registry prefix (e.g., `["@shadcn/button"]`)

**Returns**: Detailed item info including:
- Name, description, type
- File contents (complete source code)
- Dependencies (npm packages)
- Registry dependencies (other components)
- CSS variables
- Tailwind configuration

**Usage**:
```javascript
mcp__shadcn__view_items_in_registries({
  items: ["@shadcn/button", "@shadcn/card"]
})
```

**When to Use**:
- Need to see component source code
- Understanding component structure
- Checking dependencies before installation
- Analyzing component implementation

**When NOT to Use**:
- Just need usage examples (use get_item_examples instead)
- Just need install command (use get_add_command instead)
- Browsing available components (use search/list instead)

**Token Warning**: Returns full source code - can be large. Use sparingly.

---

### 5. get_item_examples_from_registries

**Purpose**: Find usage examples and demos with complete implementation code

**Parameters**:
- `registries` (required): Array of registry names
- `query` (required): Search pattern for examples

**Returns**: Example/demo items with:
- Complete implementation code
- Dependencies
- Usage patterns

**Usage**:
```javascript
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "button demo"
})
```

**Query Patterns**:
- `"{component}-demo"` - e.g., "accordion-demo", "button-demo"
- `"{component} example"` - e.g., "card example", "form example"
- `"example-{component}"` - e.g., "example-hero", "example-booking-form"

**Common Examples**:
- `"accordion-demo"` - Accordion usage demo
- `"button demo"` - Button variations
- `"card example"` - Card layouts
- `"example-booking-form"` - Booking form implementation
- `"example-hero"` - Hero section examples

**When to Use**:
- Learning how to use a component
- Finding implementation patterns
- Need complete working examples
- User asks "show me how to use..."

**Best Practice**: Always check examples before implementing complex components.

---

### 6. get_add_command_for_items

**Purpose**: Generate shadcn CLI command to install components

**Parameters**:
- `items` (required): Array of items with registry prefix (e.g., `["@shadcn/button"]`)

**Returns**: CLI command string to execute

**Usage**:
```javascript
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/button", "@shadcn/card"]
})
```

**Example Output**:
```bash
npx shadcn@latest add button card
```

**Workflow**:
1. Call this tool to get command
2. Present command to user
3. User executes with Bash tool
4. Run audit checklist after execution

**When to Use**:
- After deciding which components to install
- Final step before installation
- User confirms they want to add components

---

### 7. get_audit_checklist

**Purpose**: Get validation checklist after creating/adding components

**Parameters**: None

**Returns**: Checklist of items to verify

**Usage**:
```javascript
mcp__shadcn__get_audit_checklist()
```

**When to Use**:
- After running add command
- After creating new components
- After modifying component setup
- User reports issues with components

**Typical Checklist Items**:
- ✓ components.json exists and is valid
- ✓ Tailwind CSS configured correctly
- ✓ Component files in correct location
- ✓ Dependencies installed
- ✓ Import paths working
- ✓ Styles loading correctly

---

## Optimal Workflows

### Workflow 1: Adding a Known Component

**Scenario**: User says "Add a button component"

```
1. Search for component
   → mcp__shadcn__search_items_in_registries({
       registries: ["@shadcn"],
       query: "button"
     })

2. Get add command
   → mcp__shadcn__get_add_command_for_items({
       items: ["@shadcn/button"]
     })

3. Present command to user
   → "Run this command: npx shadcn@latest add button"

4. User executes command

5. Run audit checklist
   → mcp__shadcn__get_audit_checklist()
```

**Token Efficiency**: ~500 tokens (search + command + audit)

---

### Workflow 2: Discovering Components

**Scenario**: User says "What UI components are available?"

```
1. Get available registries
   → mcp__shadcn__get_project_registries()

2. List items from default registry
   → mcp__shadcn__list_items_in_registries({
       registries: ["@shadcn"],
       limit: 20
     })

3. Present list to user
   → Show component names and descriptions
```

**Token Efficiency**: ~1000 tokens (registries + 20 items)

---

### Workflow 3: Learning Component Usage

**Scenario**: User says "Show me how to use the accordion component"

```
1. Search for examples
   → mcp__shadcn__get_item_examples_from_registries({
       registries: ["@shadcn"],
       query: "accordion-demo"
     })

2. Present example code
   → Show complete implementation with dependencies

3. Optional: Search for related demos
   → mcp__shadcn__get_item_examples_from_registries({
       registries: ["@shadcn"],
       query: "accordion example"
     })
```

**Token Efficiency**: ~2000 tokens (examples with code)

---

### Workflow 4: Complex Component Implementation

**Scenario**: User says "I need a data table with sorting and filtering"

```
1. Search for component
   → mcp__shadcn__search_items_in_registries({
       registries: ["@shadcn"],
       query: "data table"
     })

2. Get examples first (learn usage patterns)
   → mcp__shadcn__get_item_examples_from_registries({
       registries: ["@shadcn"],
       query: "data table demo"
     })

3. View component details (if needed)
   → mcp__shadcn__view_items_in_registries({
       items: ["@shadcn/data-table"]
     })

4. Get add command
   → mcp__shadcn__get_add_command_for_items({
       items: ["@shadcn/data-table"]
     })

5. Execute and audit
   → User runs command
   → mcp__shadcn__get_audit_checklist()
```

**Token Efficiency**: ~4000 tokens (search + examples + view + command + audit)

---

## Registry System

### Namespace Format

Registry items use `@namespace/item` format:
- `@shadcn/button` - Button from shadcn registry
- `@v0/dashboard` - Dashboard from v0 registry
- `@acme/auth-utils` - Auth utils from company registry

### Multiple Registry Setup

Configure multiple registries in components.json:

```json
{
  "registries": {
    "@shadcn": "https://ui.shadcn.com/registry/items/{name}.json",
    "@v0": "https://v0.dev/chat/b/{name}",
    "@acme": {
      "url": "https://registry.acme.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${ACME_TOKEN}"
      }
    }
  }
}
```

### Registry Types

**Public Registries**:
- `@shadcn` - Official shadcn/ui components
- `@v0` - v0.dev generated components

**Private Registries**:
- Company internal components
- Team-specific libraries
- Custom design systems

**Third-Party Registries**:
- Community component libraries
- Specialized UI frameworks
- Industry-specific components

### Authentication

For private registries, use environment variables:

```json
{
  "@private": {
    "url": "https://api.company.com/registry/{name}.json",
    "headers": {
      "Authorization": "Bearer ${REGISTRY_TOKEN}"
    }
  }
}
```

Then set in .env.local:
```
REGISTRY_TOKEN=your_token_here
```

---

## Best Practices

### 1. Always Search Before Installing

**Good**:
```javascript
// 1. Search to find exact component
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "button"
})

// 2. Get add command
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/button"]
})
```

**Bad**:
```javascript
// ❌ Guessing component names
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/btn"] // Wrong name
})
```

---

### 2. Use Examples for Complex Components

**Good**:
```javascript
// 1. Get examples first
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "data-table demo"
})

// 2. Understand usage patterns
// 3. Then install component
```

**Bad**:
```javascript
// ❌ Installing without understanding usage
// ❌ Reading full source code first (token waste)
```

---

### 3. Token-Efficient Tool Selection

**Use search/list for discovery** (low tokens):
```javascript
mcp__shadcn__search_items_in_registries({ ... }) // ~100 tokens
```

**Use examples for patterns** (medium tokens):
```javascript
mcp__shadcn__get_item_examples_from_registries({ ... }) // ~2000 tokens
```

**Use view as last resort** (high tokens):
```javascript
mcp__shadcn__view_items_in_registries({ ... }) // ~5000+ tokens
```

---

### 4. Always Run Audit After Installation

**Good**:
```javascript
// After user runs add command
mcp__shadcn__get_audit_checklist()
// Verify everything is set up correctly
```

**Bad**:
```javascript
// ❌ Assuming installation worked
// ❌ Not validating setup
```

---

### 5. Never Manually Create shadcn Components

**Good**:
```javascript
// Use MCP to get add command
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/button"]
})
// User executes: npx shadcn@latest add button
```

**Bad**:
```javascript
// ❌ Manually creating components/ui/button.tsx
// ❌ Copy/pasting from shadcn website
// ❌ Writing component from scratch
```

---

## Common Patterns

### Pattern 1: Multi-Component Installation

```javascript
// Search for related components
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "form"
})

// Returns: form, input, label, textarea, select, etc.

// Get add command for all
mcp__shadcn__get_add_command_for_items({
  items: [
    "@shadcn/form",
    "@shadcn/input",
    "@shadcn/label",
    "@shadcn/button"
  ]
})

// Output: npx shadcn@latest add form input label button
```

---

### Pattern 2: Example-Driven Development

```javascript
// 1. Find component
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "calendar"
})

// 2. Get usage examples
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "calendar-demo"
})

// 3. Learn from examples
// 4. Install component
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/calendar"]
})
```

---

### Pattern 3: Cross-Registry Discovery

```javascript
// Search across multiple registries
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn", "@v0", "@acme"],
  query: "authentication"
})

// Compare implementations from different sources
// Choose best fit for project
```

---

### Pattern 4: Progressive Enhancement

```javascript
// Start with basic component
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/button"]
})

// Later, add related components as needed
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/button-group"]
})
```

---

## Anti-Patterns

### ❌ Anti-Pattern 1: Manual Component Creation

**Don't**:
```tsx
// ❌ Creating components/ui/button.tsx manually
// ❌ Copy/pasting from shadcn docs
// ❌ Writing component from scratch
```

**Do**:
```javascript
// ✓ Use MCP to get add command
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/button"]
})
```

**Why**: Manual creation misses:
- Proper dependencies
- Correct Tailwind configuration
- CSS variables
- Design system integration

---

### ❌ Anti-Pattern 2: Modifying shadcn Internals

**Don't**:
```tsx
// ❌ Editing components/ui/button.tsx directly
// ❌ Changing shadcn component internals
```

**Do**:
```tsx
// ✓ Extend via composition
import { Button } from '@/components/ui/button';

export function CustomButton({ ... }) {
  return <Button className="custom-styles" {...props} />;
}
```

**Why**: Modifications break updates and make debugging difficult.

---

### ❌ Anti-Pattern 3: Skipping Examples

**Don't**:
```javascript
// ❌ Installing complex components without examples
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/data-table"]
})
// ❌ Then guessing how to use it
```

**Do**:
```javascript
// ✓ Get examples first
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "data-table demo"
})
// ✓ Learn usage patterns
// ✓ Then install
```

**Why**: Complex components have non-obvious usage patterns.

---

### ❌ Anti-Pattern 4: Reading Full Source First

**Don't**:
```javascript
// ❌ Token-inefficient approach
mcp__shadcn__view_items_in_registries({
  items: ["@shadcn/button"] // 5000+ tokens
})
// ❌ Just to see if it's the right component
```

**Do**:
```javascript
// ✓ Token-efficient approach
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "button" // ~100 tokens
})
// ✓ Only view if you need source details
```

**Why**: 50x token savings for discovery.

---

### ❌ Anti-Pattern 5: Not Running Audit

**Don't**:
```bash
# User runs: npx shadcn@latest add button
# ❌ Assume it worked
# ❌ Move on without validation
```

**Do**:
```bash
# User runs: npx shadcn@latest add button
# ✓ Run audit checklist
mcp__shadcn__get_audit_checklist()
# ✓ Verify setup
```

**Why**: Catches configuration issues early.

---

## Real-World Examples

### Example 1: Building a Login Form

**User Request**: "I need to build a login form with email and password fields"

**Optimal Approach**:
```javascript
// 1. Search for form components
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "form input"
})

// 2. Get login form examples
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "example login form"
})

// 3. Install required components
mcp__shadcn__get_add_command_for_items({
  items: [
    "@shadcn/form",
    "@shadcn/input",
    "@shadcn/label",
    "@shadcn/button"
  ]
})
// Output: npx shadcn@latest add form input label button

// 4. User executes command

// 5. Verify installation
mcp__shadcn__get_audit_checklist()
```

**Token Usage**: ~2500 tokens
**Result**: Complete login form with examples and validated setup

---

### Example 2: Adding Data Table with Features

**User Request**: "Add a data table with sorting, filtering, and pagination"

**Optimal Approach**:
```javascript
// 1. Search for data table
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "data table"
})

// 2. Get comprehensive examples
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "data-table demo"
})

// 3. Check if example includes sorting/filtering
// If yes, get that example
// If no, search for additional demos

// 4. Install data table
mcp__shadcn__get_add_command_for_items({
  items: ["@shadcn/data-table"]
})

// 5. User executes and audit
mcp__shadcn__get_audit_checklist()
```

**Token Usage**: ~3000 tokens
**Result**: Data table with implementation patterns for sorting/filtering/pagination

---

### Example 3: Exploring Available Components

**User Request**: "What UI components do we have available?"

**Optimal Approach**:
```javascript
// 1. Get configured registries
mcp__shadcn__get_project_registries()
// Returns: ["@shadcn", "@v0", "@acme"]

// 2. List components from each registry
mcp__shadcn__list_items_in_registries({
  registries: ["@shadcn"],
  limit: 50
})

// 3. Present organized list to user
// Group by type: UI components, blocks, examples
```

**Token Usage**: ~1500 tokens
**Result**: Complete inventory of available components

---

### Example 4: Custom Registry Setup

**User Request**: "Add our company's design system components"

**Optimal Approach**:
```javascript
// 1. User configures components.json
// Add to registries:
{
  "@company": {
    "url": "https://design.company.com/registry/{name}.json",
    "headers": {
      "Authorization": "Bearer ${COMPANY_TOKEN}"
    }
  }
}

// 2. Verify registry is available
mcp__shadcn__get_project_registries()
// Should include "@company"

// 3. Search company components
mcp__shadcn__search_items_in_registries({
  registries: ["@company"],
  query: "button"
})

// 4. Install from company registry
mcp__shadcn__get_add_command_for_items({
  items: ["@company/branded-button"]
})
```

**Result**: Integration of custom company design system

---

## Troubleshooting

### Issue 1: "Registry not configured"

**Error**: `Unknown registry "@v0". Make sure it is defined in components.json`

**Solution**:
1. Check components.json exists
2. Add registry to registries field:
```json
{
  "registries": {
    "@v0": "https://v0.dev/chat/b/{name}"
  }
}
```
3. Verify with `mcp__shadcn__get_project_registries()`

---

### Issue 2: "Component not found"

**Error**: `The item at https://registry.../button.json was not found`

**Solution**:
1. Search to find correct name:
```javascript
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "button"
})
```
2. Use exact name from search results

---

### Issue 3: "Authentication failed"

**Error**: `401 Unauthorized` or `403 Forbidden`

**Solution**:
1. Check environment variable is set:
```bash
echo $REGISTRY_TOKEN
```
2. Verify token in components.json:
```json
{
  "@private": {
    "url": "...",
    "headers": {
      "Authorization": "Bearer ${REGISTRY_TOKEN}"
    }
  }
}
```
3. Ensure token has required permissions

---

### Issue 4: "Component not working after installation"

**Symptoms**: Import errors, missing styles, TypeScript errors

**Solution**:
1. Run audit checklist:
```javascript
mcp__shadcn__get_audit_checklist()
```
2. Check common issues:
   - Tailwind CSS configured?
   - CSS imported in app?
   - Dependencies installed?
   - Import paths correct?
3. Re-run shadcn init if needed:
```bash
npx shadcn@latest init
```

---

### Issue 5: "Examples not helpful"

**Symptoms**: Example doesn't show desired usage pattern

**Solution**:
1. Try different query patterns:
```javascript
// Try: "{component}-demo"
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "button-demo"
})

// Try: "{component} example"
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "button example"
})

// Try: "example-{feature}"
mcp__shadcn__get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "example-loading-button"
})
```
2. View component source for full API:
```javascript
mcp__shadcn__view_items_in_registries({
  items: ["@shadcn/button"]
})
```

---

## Quick Reference

### Tool Selection Matrix

| Task | Tool | Token Cost | When to Use |
|------|------|------------|-------------|
| "What registries exist?" | `get_project_registries` | ~50 | Session start |
| "What components exist?" | `list_items_in_registries` | ~1000 | Discovery |
| "Find button component" | `search_items_in_registries` | ~100 | Searching |
| "How do I use it?" | `get_item_examples_from_registries` | ~2000 | Learning |
| "Show me the code" | `view_items_in_registries` | ~5000 | Deep dive |
| "Install component" | `get_add_command_for_items` | ~50 | Installation |
| "Verify setup" | `get_audit_checklist` | ~200 | Validation |

### Optimal Workflow Sequence

```
Discovery: get_project_registries → list_items_in_registries
Search: search_items_in_registries
Learn: get_item_examples_from_registries
Install: get_add_command_for_items → Bash execution
Validate: get_audit_checklist
```

### Token Efficiency Rules

1. **Always search before view** (50x savings)
2. **Use examples over source** (2x savings)
3. **List before view all** (5x savings)
4. **Batch component additions** (N→1 commands)

---

**End of Guide**

For questions or issues, refer to:
- Official shadcn docs: https://ui.shadcn.com/docs/mcp
- Registry namespace docs: https://ui.shadcn.com/docs/registry/namespace
- Claude Code documentation: https://docs.claude.com/
