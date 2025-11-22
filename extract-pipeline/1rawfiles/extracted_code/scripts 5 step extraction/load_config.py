#!/usr/bin/env python3
"""
Extract module and component mentions from chat files.
Usage:
    python module_extractor.py [--topic TOPIC_NAME] [--config PATH] [--dry-run]
Examples:
    python module_extractor.py                    # Extract all modules
    python module_extractor.py --topic unity      # Only Unity patterns
    python module_extractor.py --topic validation # Only validation patterns
    python module_extractor.py --config custom_config.json --dry-run
Boundaries:
    - ONLY extracts module names and categories
    - Does NOT extract implementation details
    - Does NOT extract action items
Limitations:
    - Cannot determine if modules are actually implemented
    - Cannot validate module relationships
    - Maximum 8 module categories
"""
import argparse
import json
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any
# Available topics for incremental extraction
AVAILABLE_TOPICS = {
    'unity': ['unity', 'hierarchy', 'patterns', 'utils'],
    'validation': ['validation', 'checker', 'gate', 'pre_check', 'post_check'],
    'path_lists': ['path', 'file', 'directory', 'manager'],
    'architecture': ['extension', 'system', 'progressive', 'disclosure'],
    'workflows': ['pattern', 'dump', 'transfer', 'endpoint']
}
# Module categories as defined in boundaries
MODULE_CATEGORIES = {
    'core': r'\b(core|base|foundation)\b',
    'unity': r'\b(unity|hierarchy|patterns?|utils?)\b',
    'patterns': r'\b(patterns?|extractors?|validators?)\b',
    'paths': r'\b(paths?|files?|directories?)\b',
    'workflows': r'\b(workflows?|pipelines?|orchestrat(?:e|ion))\b',
    'integration': r'\b(integration|mcp|api|connector)\b',
    'conversation': r'\b(conversation|chat|dialogue)\b',
    'nextjs': r'\b(nextjs?|react|component|page)\b'
}
def load_config(config_path: Optional[str] = None) -> Dict[str, Any]:
    """Load configuration from file or use defaults."""
    defaults = {
        "input_dir": "/Users/ashleygeness/Desktop/capture_evidence/chatfiles_raw",
        "output_dir": "/Users/ashleygeness/Desktop/capture_evidence/extracted",
        "output_file": "modules_extracted.json",
        "max_modules": 200,
        "max_categories": 8,
        "skip_patterns": ["test_", "debug_", "temp_"]
    }
    if config_path and Path(config_path).exists():
        try:
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                return {**defaults, **user_config.get("module_extractor", {})}
        except (json.JSONDecodeError, IOError) as e:
            print(f"⚠️  Warning: Could not load config {config_path}: {e}")
            print("   Using default configuration...")
    return defaults
def get_chat_files(input_dir: str, skip_patterns: List[str]) -> List[Path]:
    """Get all chat files from input directory."""
    input_path = Path(input_dir)
    if not input_path.is_dir():
        raise FileNotFoundError(f"Input directory not found: {input_dir}")
    chat_files = []
    for pattern in ["*.md", "*.txt"]:
        chat_files.extend(input_path.glob(pattern))
    # Filter out skipped patterns
    filtered_files = []
    for file in chat_files:
        if not any(skip in file.name for skip in skip_patterns):
            filtered_files.append(file)
    return sorted(filtered_files)
def extract_modules_from_content(content: str, topic_filter: Optional[str] = None) -> List[Dict]:
    """Extract module mentions from file content."""
    import re
    extracted = []
    seen_modules = set()
    # Apply topic filter if specified
    search_terms = []
    if topic_filter:
        if topic_filter not in AVAILABLE_TOPICS:
            print(f"❌ Unknown topic: {topic_filter}")
            print(f"Available topics: {', '.join(AVAILABLE_TOPICS.keys())}")
            sys.exit(1)
        search_terms = AVAILABLE_TOPICS[topic_filter]
    # Find module patterns
    for category, pattern in MODULE_CATEGORIES.items():
        if topic_filter and not any(term in pattern for term in search_terms):
            continue
        matches = re.finditer(pattern, content, re.IGNORECASE)
        for match in matches:
            module_name = match.group(0).lower()
            # Avoid duplicates
            module_id = f"{category}:{module_name}"
            if module_id in seen_modules:
                continue
            seen_modules.add(module_id)
            # Extract context (20 chars before and after)
            start = max(0, match.start() - 20)
            end = min(len(content), match.end() + 20)
            context = content[start:end].strip()
            extracted.append({
                "id": module_id,
                "name": module_name,
                "category": category,
                "context": context,
                "source_line": content[:match.start()].count('\n') + 1
            })
    return extracted
def validate_extraction(results: List[Dict], config: Dict) -> bool:
    """Validate extracted data meets requirements."""
    checks = {
        'has_results': len(results) > 0,
        'valid_structure': all('id' in r and 'category' in r for r in results),
        'no_duplicates': len(results) == len(set(r['id'] for r in results)),
        'max_modules_ok': len(results) <= config['max_modules']
    }
    if not all(checks.values()):
        failed = [k for k, v in checks.items() if not v]
        raise ValueError(f"Extraction validation failed: {failed}")
    return True
def main():
    parser = argparse.ArgumentParser(description='Extract module mentions from chat files')
    parser.add_argument('--topic', help='Extract only specific topic')
    parser.add_argument('--config', help='Path to config file')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be extracted')
    args = parser.parse_args()
    try:
        # Load configuration
        config = load_config(args.config)
        # Setup directories
        input_dir = Path(config['input_dir'])
        output_dir = Path(config['output_dir'])
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / config['output_file']
        # Get processed files log
        processed_log = output_dir / "module_extractor_processed.json"
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        # Get chat files
        chat_files = get_chat_files(config['input_dir'], config['skip_patterns'])
        print(f"📂 Found {len(chat_files)} chat files to process")
        if args.topic:
            print(f"🔍 Filtering for topic: {args.topic}")
        # Extract modules
        all_modules = []
        for i, chat_file in enumerate(chat_files, 1):
            if chat_file.name in processed:
                print(f"⏭️  ({i}/{len(chat_files)}) Skipping {chat_file.name} (already processed)")
                continue
            print(f"⚡ ({i}/{len(chat_files)}) Processing {chat_file.name}...")
            try:
                content = chat_file.read_text(encoding='utf-8')
                modules = extract_modules_from_content(content, args.topic)
                all_modules.extend(modules)
                # Mark as processed
                processed.append(chat_file.name)
            except UnicodeDecodeError:
                print(f"⚠️  Warning: Could not decode {chat_file.name}, skipping...")
                continue
        # Deduplicate by ID
        unique_modules = {m['id']: m for m in all_modules}.values()
        sorted_modules = sorted(unique_modules, key=lambda x: (x['category'], x['name']))
        # Apply max limit
        if len(sorted_modules) > config['max_modules']:
            print(f"⚠️  Found {len(sorted_modules)} modules, limiting to {config['max_modules']}")
            sorted_modules = sorted_modules[:config['max_modules']]
        # Validate results
        validate_extraction(sorted_modules, config)
        # Output results
        if args.dry_run:
            print(f"\n📝 DRY RUN: Would extract {len(sorted_modules)} modules")
            print(f"   Would write to: {output_file}")
            for module in sorted_modules[:5]:  # Show first 5
                print(f"   - {module['id']}")
        else:
            # Save processed log
            with open(processed_log, 'w') as f:
                json.dump(processed, f, indent=2)
            # Save results
            with open(output_file, 'w') as f:
                json.dump(sorted_modules, f, indent=2)
            print(f"\n✅ Successfully extracted {len(sorted_modules)} modules")
            print(f"   Output: {output_file}")
            print(f"   Processed log: {processed_log}")
        # Print summary by category
        from collections import Counter
        categories = [m['category'] for m in sorted_modules]
        print("\n📊 Summary by category:")
        for cat, count in sorted(Counter(categories).items()):
            print(f"   {cat}: {count}")
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
if __name__ == '__main__':
    main()