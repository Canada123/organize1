#!/usr/bin/env python3
"""
Extract action items organized by module.
Usage:
    python action_item_extractor.py [--topic TOPIC_NAME] [--config PATH] [--dry-run]
Examples:
    python action_item_extractor.py                    # Extract all action items
    python action_item_extractor.py --topic unity      # Only Unity-related actions
    python action_item_extractor.py --config custom_config.json
Boundaries:
    - ONLY extracts actionable tasks
    - Does NOT extract rationale or context
    - Does NOT prioritize tasks
Limitations:
    - Cannot determine task dependencies
    - Cannot estimate effort or complexity
    - Requires module_extractor.py output as input
"""
import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Any
# Action item patterns
ACTION_PATTERNS = [
    r'(?:TODO|FIXME|NOTE|HACK):\s*(.+?)(?:\n|$)',
    r'(?:need|required?|should|must)\s+(?:to\s+)?([^.!?]+[.!?])',
    r'(?:extract|create|implement|update|refactor|fix)\s+(.+?)(?:\n|$)',
    r'\[-\]\s*(.+?)(?:\n|$)',  # Markdown unchecked boxes
    r'Action\s+[Ii]tem:\s*(.+?)(?:\n|$)'
]
def load_config(config_path: str = None) -> Dict[str, Any]:
    """Load configuration."""
    defaults = {
        "input_dir": "/Users/ashleygeness/Desktop/capture_evidence/chatfiles_raw",
        "module_file": "modules_extracted.json",
        "output_dir": "/Users/ashleygeness/Desktop/capture_evidence/extracted",
        "output_file": "action_items_by_module.json",
        "max_items_per_module": 50,
        "skip_patterns": ["test_", "debug_"]
    }
    if config_path and Path(config_path).exists():
        try:
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                return {**defaults, **user_config.get("action_item_extractor", {})}
        except (json.JSONDecodeError, IOError) as e:
            print(f"⚠️  Warning: Could not load config {config_path}: {e}")
    return defaults
def load_modules(config: Dict[str, Any]) -> Dict[str, List[str]]:
    """Load modules from module_extractor output."""
    module_file = Path(config['output_dir']) / config['module_file']
    if not module_file.exists():
        raise FileNotFoundError(f"Required module file not found: {module_file}")
    try:
        with open(module_file, 'r') as f:
            modules = json.load(f)
        # Group by category
        modules_by_category = {}
        for module in modules:
            category = module['category']
            if category not in modules_by_category:
                modules_by_category[category] = []
            modules_by_category[category].append(module['name'])
        return modules_by_category
    except Exception as e:
        raise ValueError(f"Failed to load modules: {e}")
def extract_action_items(content: str, modules_by_category: Dict[str, List[str]], topic_filter: str = None) -> Dict[str, List[Dict]]:
    """Extract action items and organize by module category."""
    import re
    action_items = {}
    # Filter modules if topic specified
    relevant_categories = modules_by_category.keys()
    if topic_filter:
        # Map topics to categories
        topic_to_category = {
            'unity': ['unity'],
            'validation': ['patterns'],
            'path_lists': ['paths'],
            'architecture': ['core', 'patterns'],
            'workflows': ['workflows', 'integration']
        }
        relevant_categories = topic_to_category.get(topic_filter, [])
    # Extract all action items
    all_items = []
    for pattern in ACTION_PATTERNS:
        matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
        for match in matches:
            item_text = match.group(1).strip()
            # Skip if too short or too long
            if len(item_text) < 5 or len(item_text) > 200:
                continue
            # Determine which module category this belongs to
            assigned_category = 'uncategorized'
            for category, module_names in modules_by_category.items():
                if category not in relevant_categories and topic_filter:
                    continue
                if any(name.lower() in item_text.lower() for name in module_names):
                    assigned_category = category
                    break
            all_items.append({
                'text': item_text,
                'category': assigned_category,
                'source_pattern': pattern.split('(')[0][:30] + '...'
            })
    # Organize by category
    for category in modules_by_category.keys():
        if topic_filter and category not in relevant_categories:
            continue
        category_items = [item for item in all_items if item['category'] == category]
        # Deduplicate
        unique_items = {}
        for item in category_items:
            item_key = item['text'][:50].lower()
            if item_key not in unique_items:
                unique_items[item_key] = item
        action_items[category] = list(unique_items.values())[:config['max_items_per_module']]
    return action_items
def validate_extraction(results: Dict[str, List[Dict]], config: Dict[str, Any]) -> bool:
    """Validate extracted action items."""
    total_items = sum(len(items) for items in results.values())
    checks = {
        'has_results': total_items > 0,
        'valid_structure': all(
            'text' in item and 'category' in item
            for items in results.values()
            for item in items
        ),
        'max_items_ok': all(
            len(items) <= config['max_items_per_module']
            for items in results.values()
        )
    }
    if not all(checks.values()):
        failed = [k for k, v in checks.items() if not v]
        raise ValueError(f"Action item validation failed: {failed}")
    return True
def main():
    parser = argparse.ArgumentParser(description='Extract action items organized by module')
    parser.add_argument('--topic', help='Filter by topic')
    parser.add_argument('--config', help='Path to config file')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    try:
        config = load_config(args.config)
        modules_by_category = load_modules(config)
        print(f"📦 Loaded {sum(len(m) for m in modules_by_category.values())} modules across {len(modules_by_category)} categories")
        if args.topic:
            print(f"🔍 Filtering for topic: {args.topic}")
        # Get chat files
        input_dir = Path(config['input_dir'])
        chat_files = sorted(input_dir.glob("*.md")) + sorted(input_dir.glob("*.txt"))
        processed_log = Path(config['output_dir']) / "action_item_extractor_processed.json"
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        all_action_items = {}
        for i, chat_file in enumerate(chat_files, 1):
            if chat_file.name in processed:
                print(f"⏭️  ({i}/{len(chat_files)}) Skipping {chat_file.name}")
                continue
            try:
                content = chat_file.read_text(encoding='utf-8')
                items = extract_action_items(content, modules_by_category, args.topic)
                # Merge results
                for category, category_items in items.items():
                    if category not in all_action_items:
                        all_action_items[category] = []
                    all_action_items[category].extend(category_items)
                processed.append(chat_file.name)
            except Exception as e:
                print(f"⚠️  Warning: Error processing {chat_file.name}: {e}")
                continue
        # Deduplicate and limit
        for category in all_action_items:
            unique = {item['text'][:50]: item for item in all_action_items[category]}
            all_action_items[category] = list(unique.values())[:config['max_items_per_module']]
        # Remove empty categories
        all_action_items = {k: v for k, v in all_action_items.items() if v}
        validate_extraction(all_action_items, config)
        # Output
        output_file = Path(config['output_dir']) / config['output_file']
        if args.dry_run:
            total = sum(len(v) for v in all_action_items.values())
            print(f"\n📝 DRY RUN: Would extract {total} action items")
            print(f"   Would write to: {output_file}")
            for cat, items in list(all_action_items.items())[:3]:
                print(f"   {cat}: {len(items)} items")
        else:
            with open(processed_log, 'w') as f:
                json.dump(processed, f, indent=2)
            with open(output_file, 'w') as f:
                json.dump(all_action_items, f, indent=2)
            total = sum(len(v) for v in all_action_items.values())
            print(f"\n✅ Extracted {total} action items across {len(all_action_items)} categories")
            print(f"   Output: {output_file}")
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
if __name__ == '__main__':
    main()