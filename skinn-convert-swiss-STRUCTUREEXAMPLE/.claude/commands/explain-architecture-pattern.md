# Explain Architecture Pattern

Identify and explain architectural patterns, design patterns, and structural decisions found in the codebase. This helps understand the "why" behind code organization and design choices.

## Memory System Integration (v2.0)

### Load Existing Patterns
```bash
# Check memory for documented architecture patterns
jq '.[] | select(.category == "architecture")' memory/patterns.json
jq '.[] | select(.category == "architecture")' memory/decisions.json
```

### Use MCP Tools for Analysis
- **Serena MCP**: Code exploration and pattern detection
  - `mcp__serena__get_symbols_overview` - Understand file structure
  - `mcp__serena__find_symbol` - Locate pattern implementations
  - `mcp__serena__find_referencing_symbols` - Trace pattern usage
  
### Update Memory with Findings
```json
// memory/patterns.json
{
  "architecture_[pattern_name]": {
    "name": "[Pattern Name]",
    "category": "architecture",
    "confidence": 0.85,
    "usage_count": 10,
    "example": "[code reference]",
    "mcp_tools": ["serena"]
  }
}

// memory/decisions.json
{
  "arch_decision_[id]": {
    "decision": "Use [pattern] for [purpose]",
    "rationale": "[why chosen]",
    "confidence": 0.9,
    "alternatives_considered": ["pattern1", "pattern2"]
  }
}
```

## Usage Examples

### Basic Usage
"Explain the architecture pattern used in this project"
"What design patterns are implemented in the auth module?"
"Analyze the folder structure and explain the architecture"

### Specific Pattern Analysis
"Is this using MVC, MVP, or MVVM?"
"Explain the microservices architecture here"
"What's the event-driven pattern in this code?"
"How is the repository pattern implemented?"

## Instructions for Claude

When explaining architecture patterns:

1. **Check Memory First**: Load patterns from memory/patterns.json and memory/decisions.json
2. **Use 4-Index System**: Load PROJECT_INDEX.json for code structure awareness
3. **Analyze with Serena MCP**: Use symbolic tools for precise pattern detection
4. **Identify Patterns**: Recognize common architectural and design patterns
5. **Explain Rationale**: Describe why these patterns might have been chosen
6. **Visual Representation**: Use ASCII diagrams or markdown to illustrate relationships
7. **Practical Examples**: Show how the pattern is implemented with code examples
8. **Update Memory**: Store new patterns with confidence scores in memory system

### Common Architecture Patterns

#### Application Architecture
- **MVC (Model-View-Controller)**
- **MVP (Model-View-Presenter)**
- **MVVM (Model-View-ViewModel)**
- **Clean Architecture**
- **Hexagonal Architecture**
- **Microservices**
- **Monolithic**
- **Serverless**
- **Event-Driven**
- **Domain-Driven Design (DDD)**

#### Design Patterns
- **Creational**: Factory, Singleton, Builder, Prototype
- **Structural**: Adapter, Decorator, Facade, Proxy
- **Behavioral**: Observer, Strategy, Command, Iterator
- **Concurrency**: Producer-Consumer, Thread Pool
- **Architectural**: Repository, Unit of Work, CQRS

#### Frontend Patterns
- **Component-Based Architecture**
- **Flux/Redux Pattern**
- **Module Federation**
- **Micro-Frontends**
- **State Management Patterns**

#### Backend Patterns
- **RESTful Architecture**
- **GraphQL Schema Design**
- **Service Layer Pattern**
- **Repository Pattern**
- **Dependency Injection**

### Analysis Areas

#### Code Organization
- Project structure rationale
- Module boundaries and responsibilities
- Separation of concerns
- Dependency management
- Configuration patterns

#### Data Flow
- Request/response cycle
- State management
- Event propagation
- Data transformation layers
- Caching strategies

#### Integration Points
- API design patterns
- Database access patterns
- Third-party integrations
- Message queue usage
- Service communication

### Output Format

Structure the explanation as:

```markdown
## Architecture Pattern Analysis

### Overview
Brief description of the overall architecture identified

### Primary Patterns Identified

#### 1. [Pattern Name]
**What it is**: Brief explanation
**Where it's used**: Specific locations in codebase
**Why it's used**: Benefits in this context

**Example**:
```language
// Code example showing the pattern
```

**Diagram**:
```
┌─────────────┐     ┌─────────────┐
│   Component │────▶│   Service   │
└─────────────┘     └─────────────┘
```

### Architecture Characteristics

#### Strengths
- [Strength 1]: How it benefits the project
- [Strength 2]: Specific advantages

#### Trade-offs
- [Trade-off 1]: What was sacrificed
- [Trade-off 2]: Complexity added

### Implementation Details

#### File Structure
```
src/
├── controllers/    # MVC Controllers
├── models/        # Data models
├── views/         # View templates
└── services/      # Business logic
```

#### Key Relationships
- How components interact
- Dependency flow
- Communication patterns

### Recommendations
- Patterns that could enhance current architecture
- Potential improvements
- Consistency suggestions
```

Remember to:
- Use clear, accessible language
- Provide context for technical decisions
- Show concrete examples from the actual code
- Explain benefits and trade-offs objectively