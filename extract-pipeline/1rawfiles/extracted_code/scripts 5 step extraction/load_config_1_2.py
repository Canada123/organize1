#!/usr/bin/env python3
"""
Extract architecture decisions and design patterns.
Usage:
    python architecture_extractor.py [--topic TOPIC_NAME] [--config PATH] [--dry-run]
Examples:
    python architecture_extractor.py
    python architecture_extractor.py --topic extension_system
    python architecture_extractor.py --config custom_config.json
Boundaries:
    - ONLY extracts decisions with context
    - Does NOT extract implementation code
    - Does NOT validate decisions
Limitations:
    - Cannot determine if decisions were actually implemented
    - Cannot detect conflicting decisions
    - Maximum 50 decisions per chat file
"""
import argparse
import json
import re
import sys
from pathlib import Path
from typing import List, Dict, Any
# Architecture decision patterns
DECISION_PATTERNS = [
    r'(?:[Dd]ecision|[Cc]hoice|[Ww]e\s+(?:chose|selected|decided)):\s*(.+?)(?=\n\n|\Z)',
    r'(?:[Aa]rchitecture|[Dd]esign):\s*(.+?)(?=\n\n|\Z)',
    r'(?:[Pp]attern|[Ii]mplement(?:ation)?):\s*(.+?)(?=\n\n|\Z)',
    r'>(.+?)(?=\n\n|\Z)'  # Blockquote decisions
]
# Topic filters for architecture
ARCHITECTURE_TOPICS = {
    'extension_system': r'extension|plugin|modular',
    'progressive_disclosure': r'progressive|disclosure|lazy|incremental',
    'validation_gates': r'validation|gate|check|assert',
    'intelligence_first': r'intelligence|mcp|analysis|intel'
}
def load_config(config_path: str = None) -> Dict[str, Any]:
    """Load configuration."""
    defaults = {
        "input_dir": "/Users/ashleygeness/Desktop/capture_evidence/chatfiles_raw",
        "output_dir": "/Users/ashleygeness/Desktop/capture_evidence/extracted",
        "output_file": "architecture_decisions.json",
        "max_decisions": 50,
        "include_context": True,
        "skip_patterns": ["test_", "debug_"]
    }
    if config_path and Path(config_path).exists():
        try:
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                return {**defaults, **user_config.get("architecture_extractor", {})}
        except (json.JSONDecodeError, IOError) as e:
            print(f"⚠️  Warning: Could not load config {config_path}: {e}")
    return defaults
def extract_decisions(content: str, topic_filter: str = None) -> List[Dict]:
    """Extract architecture decisions from content."""
    decisions = []
    seen = set()
    for pattern in DECISION_PATTERNS:
        matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
        for match in matches:
            decision_text = match.group(1).strip()
            # Clean up
            decision_text = re.sub(r'\s+', ' ', decision_text)
            if len(decision_text) < 20 or len(decision_text) > 500:
                continue
            # Topic filter
            if topic_filter:
                topic_regex = ARCHITECTURE_TOPICS.get(topic_filter)
                if topic_regex and not re.search(topic_regex, decision_text, re.IGNORECASE):
                    continue
            # Deduplicate
            decision_key = decision_text[:80].lower()
            if decision_key in seen:
                continue
            seen.add(decision_key)
            # Extract context
            line_num = content[:match.start()].count('\n') + 1
            context_start = max(0, match.start() - 100)
            context_end = min(len(content), match.end() + 100)
            context = content[context_start:context_end].strip()
            decisions.append({
                "id": f"dec_{len(decisions):03d}",
                "text": decision_text,
                "context": context,
                "line_number": line_num,
                "word_count": len(decision_text.split())
            })
    return decisions
def validate_extraction(results: List[Dict], config: Dict[str, Any]) -> bool:
    """Validate extracted decisions."""
    checks = {
        'has_results': len(results) > 0,
        'valid_structure': all('text' in r and 'id' in r for r in results),
        'max_decisions_ok': len(results) <= config['max_decisions'],
        'context_included': all('context' in r for r in results) if config['include_context'] else True
    }
    if not all(checks.values()):
        failed = [k for k, v in checks.items() if not v]
        raise ValueError(f"Architecture extraction validation failed: {failed}")
    return True
def main():
    parser = argparse.ArgumentParser(description='Extract architecture decisions')
    parser.add_argument('--topic', choices=list(ARCHITECTURE_TOPICS.keys()), 
                       help='Filter by architecture topic')
    parser.add_argument('--config', help='Path to config file')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    try:
        config = load_config(args.config)
        input_dir = Path(config['input_dir'])
        chat_files = sorted(input_dir.glob("*.md")) + sorted(input_dir.glob("*.txt"))
        output_dir = Path(config['output_dir'])
        output_dir.mkdir(exist_ok=True)
        processed_log = output_dir / "architecture_extractor_processed.json"
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        all_decisions = []
        skipped_files = 0
        for i, chat_file in enumerate(chat_files, 1):
            if chat_file.name in processed:
                print(f"⏭️  ({i}/{len(chat_files)}) Skipping {chat_file.name}")
                continue
            try:
                content = chat_file.read_text(encoding='utf-8')
                decisions = extract_decisions(content, args.topic)
                # Add source reference
                for decision in decisions:
                    decision['source_file'] = chat_file.name
                all_decisions.extend(decisions)
                # Check per-file limit
                if len(decisions) > config['max_decisions']:
                    print(f"⚠️  Warning: {chat_file.name} exceeded max_decisions")
                processed.append(chat_file.name)
            except Exception as e:
                print(f"⚠️  Warning: Error processing {chat_file.name}: {e}")
                continue
        # Sort by file then line number
        all_decisions.sort(key=lambda x: (x['source_file'], x['line_number']))
        # Apply max limit
        if len(all_decisions) > config['max_decisions']:
            print(f"⚠️  Total decisions {len(all_decisions)} exceeds max, limiting...")
            all_decisions = all_decisions[:config['max_decisions']]
        validate_extraction(all_decisions, config)
        output_file = output_dir / config['output_file']
        if args.dry_run:
            print(f"\n📝 DRY RUN: Would extract {len(all_decisions)} architecture decisions")
            print(f"   Would write to: {output_file}")
            for decision in all_decisions[:3]:
                print(f"   - {decision['id']}: {decision['text'][:60]}...")
        else:
            with open(processed_log, 'w') as f:
                json.dump(processed, f, indent=2)
            with open(output_file, 'w') as f:
                json.dump(all_decisions, f, indent=2)
            print(f"\n✅ Extracted {len(all_decisions)} architecture decisions")
            print(f"   Output: {output_file}")
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
if __name__ == '__main__':
    main()