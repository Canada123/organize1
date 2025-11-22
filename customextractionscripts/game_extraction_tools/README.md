# Game Data Extraction System

Extract usable game content from messy research notes.

## Problem

Your notes have tons of content mixed with slop:
- Dataset references (ETHICS, Moral Machine)
- Game mechanics descriptions
- Code examples
- Psychological models

But you can't:
1. Validate if data is real/usable
2. Tag it so agents can find it
3. Know what's ready to build vs needs work

## Solution: 3-Step Pipeline

### Step 1: Extract
Pulls structured data from notes:
- Dataset references with counts
- Game mechanics with descriptions
- Code examples (JSON, Python)
- Psychological models

### Step 2: Validate
Tests if extracted data actually works:
- Downloads and tests datasets
- Checks code syntax
- Verifies mechanics are actionable
- Identifies what's missing

### Step 3: Tag
Makes data agent-queryable:
- Tags by purpose (NPC behavior, player testing)
- Tags by measurement (trust, ethics, planning)
- Creates simple query API
- Generates implementation manifest

## Quick Start

```bash
python run_pipeline.py /path/to/obsidian/vault
```

Or run steps individually:
```bash
python extract_game_data.py  # Extract from notes
python validate_data.py      # Validate it works
python tag_data.py           # Make it queryable
```

## Output Files

**game_data_extracted.json**
- Raw extracted data
- What was found where
- Unvalidated items flagged

**validation_report.json**
- What works vs what's broken
- Data completeness check
- Implementation plan with commands

**tagged_game_data.json**
- Agent-queryable format
- Quick access snippets
- Implementation manifest

## What You Get

**Immediately buildable:**
- Working code examples
- Actionable mechanics
- Validated data structures

**Needs download:**
- ETHICS dataset (with exact command)
- Other datasets (with instructions)

**Needs work:**
- Vague mechanics → make measurable
- Missing components → what to add

## Example Queries

Once tagged, agents can query:
```python
# Get moral scenarios
from datasets import load_dataset
ethics = load_dataset('hendrycks/ethics', 'commonsense')

# Measure trust
cooperation_rate = successful_teams / total_interactions

# Check data availability
tagged_data['query_index']['moral_scenarios']
```

## Focus

Ignores URL slop, extracts only:
- Numbered datasets (131,885 scenarios)
- Concrete mechanics (track X, measure Y)
- Working code (valid Python/JSON)
- Structured models (with fields)

Skips:
- Files that are mostly URLs
- Vague descriptions
- Broken code
- Marketing content
