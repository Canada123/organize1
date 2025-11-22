# Game Mechanics Extraction System

Extract ACTUAL implementable content from notes:
- 199 action modules (witness, betray, validate, etc.)
- 8 distributed system patterns (Redlock, Zookeeper, etcd, etc.)
- 44 code templates (Java, Python, Go)
- Chain dynamics examples

## The Problem You Had

Notes full of:
1. Action modules buried in walls of text
2. Distributed system repos with no organization
3. Code examples without categorization
4. Chain mechanics without structure

Can't use any of it without massive manual extraction.

## Solution

```bash
# Extract from your mechanics notes
python extract_mechanics.py your_notes.txt

# Query what you extracted
python query_mechanics.py
```

## What Gets Extracted

**Action Modules (199 total):**
```
commitment, negotiation, validation, permission, betray, 
reveal, bluff, spy, sabotage, witness, investigate, help,
hinder, vote, bribe, expose, threaten, defend, frame,
challenge, support, oppose, compete, cooperate, merge,
split, block, bypass, queue, reserve, yield, persist,
abandon, reclaim, exchange, transform, combine...
```

**Distributed Patterns (8 repos):**
```
- Redisson: Distributed locking with auto-release
- Zookeeper: Ephemeral locks for commitment
- etcd: Lease-based with TTL
- Consul: Session-based with health checks
- Hazelcast: Fenced locks for ordering
- DynamoDB Lock Client: AWS-based locking
- Temporal: Workflow as commitment
- XState: State machine patterns
```

**Code Examples (44 templates):**
```
- distributed_locking: 9 Java examples
- commitment_system: 2 Python examples
- penalty_enforcement: 2 Python examples
- general_pattern: 31 Python examples
```

## Usage

**Query actions:**
```bash
python query_mechanics.py actions betray
# Shows: betray, betrayal modules with properties

python query_mechanics.py actions
# Shows all 199 action modules
```

**Query patterns:**
```bash
python query_mechanics.py patterns lock
# Shows lock-based distributed systems

python query_mechanics.py patterns
# Shows all 8 distributed patterns
```

**Query code:**
```bash
python query_mechanics.py code distributed_locking
# Shows 9 distributed locking code examples

python query_mechanics.py code
# Lists all code categories
```

**Interactive mode:**
```bash
python query_mechanics.py
# Opens interactive query shell
```

## Output Format

**mechanics_extracted.json structure:**
```json
{
  "action_system": {
    "total_modules": 199,
    "modules": [
      {
        "name": "Betray",
        "action": "betray",
        "properties": [
          "Immediate benefit",
          "Long-term reputation damage",
          "Creates vendetta chains"
        ]
      }
    ]
  },
  "distributed_infrastructure": {
    "patterns": [
      {
        "name": "Redisson",
        "repo": "https://github.com/redisson/redisson",
        "concepts": ["distributed_locking", "lease_based"],
        "use_case": "commitment_enforcement"
      }
    ]
  },
  "code_templates": {
    "by_category": {
      "distributed_locking": [...],
      "commitment_system": [...]
    }
  }
}
```

## What You Can Build

**Immediately:**
- Action system with 199 player actions
- Chain mechanics (actions trigger more actions)
- Distributed commitment enforcement using any of 8 patterns

**With downloaded repos:**
- Full lock-based commitment system
- Penalty enforcement for broken commitments
- Consensus mechanisms (Jack Dorsey style, not blockchain)

## Key Differences from Dataset Extractor

Dataset extractor: Finds ETHICS dataset references
Mechanics extractor: Finds ACTUAL game mechanics

This extracts the implementation details, not just data references.

## Example Extracted Content

**Witness Module:**
- Action: witness
- Properties: Creates evidence chains, can be challenged, starts investigations

**Distributed Locking (Redisson):**
```java
RLock lock = redisson.getLock("player:" + playerId);
boolean acquired = lock.tryLock(100, 30, TimeUnit.SECONDS);
// Must complete within 30s or lose lock
```

**Chain Example:**
1. Player A witnesses something
2. Player B doubts the claim
3. Player A investigates
4. Player C helps
5. Player D hinders
... chain continues organically

No forced endpoints, no arbitrary limits.
