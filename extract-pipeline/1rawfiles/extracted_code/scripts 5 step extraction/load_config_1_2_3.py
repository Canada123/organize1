#!/usr/bin/env python3
"""
Extract file paths and categorize by type.
Usage:
    python file_path_extractor.py [--topic TOPIC_NAME] [--config PATH] [--dry-run]
Examples:
    python file_path_extractor.py
    python file_path_extractor.py --topic path_lists
    python file_path_extractor.py --config custom_config.json
Boundaries:
    - ONLY extracts paths mentioned in conversation
    - Does NOT verify paths exist
    - Does NOT extract file contents
Limitations:
    - Cannot determine if paths are valid
    - Cannot detect duplicate paths across categories
    - Limited to 4 path categories
"""
import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Any
# Path patterns by category
PATH_CATEGORIES = {
    'input': r'(?:input|source|raw|chat)[/_\\]?[^\s\"\']+',
    'output': r'(?:output|dest|result|extracted)[/_\\]?[^\s\"\']+',
    'extraction': r'(?:extract|pipeline|script)[/_\\]?[^\s\"\']+',
    'reference': r'(?:docs?|ref|reference|assets?)[/_\\]?[^\s\"\']+'
}
# File extensions to prioritize
RELEVANT_EXTENSIONS = ['.md', '.txt', '.py', '.js', '.json', '.yaml', '.yml', '.ts']
def load_config(config_path: str = None) -> Dict[str, Any]:
    """Load configuration."""
    defaults = {
        "input_dir": "/Users/ashleygeness/Desktop/capture_evidence/chatfiles_raw",
        "output_dir": "/Users/ashleygeness/Desktop/capture_evidence/extracted",
        "output_file": "file_paths_categorized.json",
        "max_paths": 200,
        "categories": ["input", "output", "extraction", "reference"],
        "skip_patterns": ["temp_", "cache_", ".tmp"]
    }
    if config_path and Path(config_path).exists():
        try:
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                return {**defaults, **user_config.get("file_path_extractor", {})}
        except (json.JSONDecodeError, IOError) as e:
            print(f"⚠️  Warning: Could not load config {config_path}: {e}")
    return defaults
def normalize_path(path_str: str) -> str:
    """Normalize path string."""
    # Remove quotes
    path_str = path_str.strip('\'"')
    # Convert to forward slashes
    path_str = path_str.replace('\\', '/')
    # Remove trailing punctuation
    path_str = path_str.rstrip('.,;:!?')
    return path_str
def extract_paths(content: str, categories: List[str], topic_filter: str = None) -> Dict[str, List[Dict]]:
    """Extract and categorize file paths."""
    extracted = {cat: [] for cat in categories}
    seen_paths = set()
    # Generic path pattern
    generic_pattern = r'[A-Za-z]:[\\/][^\s"\']+|(?:/|\\|~|\.{1,2})[A-Za-z0-9_\-/\\]+(?:\.[A-Za-z0-9]+)?'
    matches = re.finditer(generic_pattern, content)
    for match in matches:
        path_str = match.group(0)
        # Skip if too short or malformed
        if len(path_str) < 5 or ' ' in path_str:
            continue
        # Normalize
        normalized = normalize_path(path_str)
        # Skip duplicates
        if normalized.lower() in seen_paths:
            continue
        seen_paths.add(normalized.lower())
        # Determine category
        category = 'reference'  # Default
        for cat, pattern in PATH_CATEGORIES.items():
            if cat not in categories:
                continue
            if re.search(pattern, normalized, re.IGNORECASE):
                category = cat
                break
        # Apply topic filter
        if topic_filter:
            if topic_filter == 'path_lists' and not normalized.endswith(tuple(RELEVANT_EXTENSIONS)):
                continue
        # Extract context
        line_num = content[:match.start()].count('\n') + 1
        context_start = max(0, match.start() - 80)
        context_end = min(len(content), match.end() + 80)
        context = content[context_start:context_end].strip()
        extracted[category].append({
            "path": normalized,
            "original": path_str,
            "line_number": line_num,
            "context": context
        })
    return extracted
def validate_extraction(results: Dict[str, List[Dict]], config: Dict[str, Any]) -> bool:
    """Validate extracted paths."""
    total_paths = sum(len(paths) for paths in results.values())
    checks = {
        'has_results': total_paths > 0,
        'valid_structure': all(
            'path' in p for paths in results.values() for p in paths
        ),
        'max_paths_ok': total_paths <= config['max_paths'],
        'valid_categories': all(
            cat in results for cat in config['categories']
        )
    }
    if not all(checks.values()):
        failed = [k for k, v in checks.items() if not v]
        raise ValueError(f"Path extraction validation failed: {failed}")
    return True
def main():
    parser = argparse.ArgumentParser(description='Extract file paths')
    parser.add_argument('--topic', help='Filter by topic')
    parser.add_argument('--config', help='Path to config file')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    try:
        config = load_config(args.config)
        input_dir = Path(config['input_dir'])
        chat_files = sorted(input_dir.glob("*.md")) + sorted(input_dir.glob("*.txt"))
        output_dir = Path(config['output_dir'])
        output_dir.mkdir(exist_ok=True)
        processed_log = output_dir / "file_path_extractor_processed.json"
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        all_paths = {cat: [] for cat in config['categories']}
        for i, chat_file in enumerate(chat_files, 1):
            if chat_file.name in processed:
                print(f"⏭️  ({i}/{len(chat_files)}) Skipping {chat_file.name}")
                continue
            try:
                content = chat_file.read_text(encoding='utf-8')
                paths = extract_paths(content, config['categories'], args.topic)
                # Merge results
                for category, path_list in paths.items():
                    all_paths[category].extend(path_list)
                processed.append(chat_file.name)
            except Exception as e:
                print(f"⚠️  Warning: Error processing {chat_file.name}: {e}")
                continue
        # Deduplicate within each category
        for category in all_paths:
            unique = {p['path'].lower(): p for p in all_paths[category]}
            all_paths[category] = list(unique.values())
        # Apply global max
        total = sum(len(v) for v in all_paths.values())
        if total > config['max_paths']:
            print(f"⚠️  Total paths {total} exceeds max, limiting per category...")
            for cat in all_paths:
                all_paths[cat] = all_paths[cat][:config['max_paths'] // len(config['categories'])]
        validate_extraction(all_paths, config)
        output_file = output_dir / config['output_file']
        if args.dry_run:
            total = sum(len(v) for v in all_paths.values())
            print(f"\n📝 DRY RUN: Would extract {total} file paths")
            print(f"   Would write to: {output_file}")
            for cat, paths in list(all_paths.items())[:3]:
                print(f"   {cat}: {len(paths)} paths")
        else:
            with open(processed_log, 'w') as f:
                json.dump(processed, f, indent=2)
            with open(output_file, 'w') as f:
                json.dump(all_paths, f, indent=2)
            total = sum(len(v) for v in all_paths.values())
            print(f"\n✅ Extracted {total} file paths")
            print(f"   Output: {output_file}")
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
if __name__ == '__main__':
    main()