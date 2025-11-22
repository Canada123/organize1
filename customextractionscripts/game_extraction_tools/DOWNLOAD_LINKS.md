# Game Extraction Tools - Download Links

## All Tools (Single Download)
[Download game_extraction_tools.zip](computer:///mnt/user-data/outputs/game_extraction_tools.zip) - 36KB, contains everything

## Individual Files

### Mechanics Extraction (Start Here)
- [extract_mechanics.py](computer:///mnt/user-data/outputs/extract_mechanics.py) - Extract 199 action modules + code
- [mechanics_extracted.json](computer:///mnt/user-data/outputs/mechanics_extracted.json) - Already extracted from your file (77KB)
- [query_mechanics.py](computer:///mnt/user-data/outputs/query_mechanics.py) - Query extracted mechanics
- [MECHANICS_README.md](computer:///mnt/user-data/outputs/MECHANICS_README.md) - How to use mechanics extractor

### Dataset Extraction
- [extract_game_data.py](computer:///mnt/user-data/outputs/extract_game_data.py) - Extract dataset references
- [validate_data.py](computer:///mnt/user-data/outputs/validate_data.py) - Validate datasets work
- [tag_data.py](computer:///mnt/user-data/outputs/tag_data.py) - Make data agent-queryable
- [run_pipeline.py](computer:///mnt/user-data/outputs/run_pipeline.py) - Run full pipeline

### Examples
- [EXAMPLE_tagged_output.json](computer:///mnt/user-data/outputs/EXAMPLE_tagged_output.json) - Example output format
- [README.md](computer:///mnt/user-data/outputs/README.md) - Dataset extractor docs

## Quick Start

1. Download mechanics_extracted.json (already has 199 actions, 8 patterns, 44 code examples)
2. Download query_mechanics.py to explore it
3. Run: `python query_mechanics.py`

## What's In mechanics_extracted.json

Already extracted from your uploaded file:
- 199 action modules (betray, witness, validate, etc.)
- 8 distributed system repos (Redisson, Zookeeper, etcd, etc.)
- 44 code templates (Java, Python, Go)
- Chain dynamics examples

No need to run extraction again - it's done.
