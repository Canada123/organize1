#!/usr/bin/env python3
"""
Extract and prioritize next steps by phase.
Usage:
    python next_steps_extractor.py [--topic TOPIC_NAME] [--config PATH] [--dry-run]
Examples:
    python next_steps_extractor.py
    python next_steps_extractor.py --topic validation
    python next_steps_extractor.py --config custom_config.json
Boundaries:
    - ONLY extracts next steps with phase assignments
    - Does NOT extract dependencies between steps
    - Does NOT estimate timelines
Limitations:
    - Cannot determine step completion status
    - Cannot validate phase ordering
    - Maximum 5 phases
"""
import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Any
# Phase patterns
PHASE_PATTERNS = {
    'Phase 1: Setup': r'(?:setup|init|config|prepare|environment)',
    'Phase 2: Core': r'(?:core|base|foundation|extract)',
    'Phase 3: Integration': r'(?:integrat|mcp|connect|workflow)',
    'Phase 4: Testing': r'(?:test|valid|debug|assert|check)',
    'Phase 5: Polish': r'(?:polish|optim|refactor|clean|document)'
}
NEXT_STEP_PATTERNS = [
    r'(?:[Nn]ext\s+[Ss]tep|[Ss]tep\s+\d+):\s*(.+?)(?=\n\n|\Z)',
    r'(?:priority|urgent|important):\s*(.+?)(?:\n|$)',
    r'(?:then|after|followed\s+by)\s+([^.!?]+[.!?])',
    r'\d+\.\s+(.+?)(?=\n\d+\.|\Z)'  # Numbered lists
]
def load_config(config_path: str = None) -> Dict[str, Any]:
    """Load configuration."""
    defaults = {
        "input_dir": "/Users/ashleygeness/Desktop/capture_evidence/chatfiles_raw",
        "output_dir": "/Users/ashleygeness/Desktop/capture_evidence/extracted",
        "output_file": "next_steps_by_phase.json",
        "max_phases": 5,
        "max_steps_per_phase": 20,
        "priority_keywords": ["critical", "urgent", "high", "medium", "low"],
        "skip_patterns": ["test_", "debug_"]
    }
    if config_path and Path(config_path).exists():
        try:
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                return {**defaults, **user_config.get("next_steps_extractor", {})}
        except (json.JSONDecodeError, IOError) as e:
            print(f"⚠️  Warning: Could not load config {config_path}: {e}")
    return defaults
def determine_priority(text: str, priority_keywords: List[str]) -> str:
    """Determine priority based on keywords."""
    text_lower = text.lower()
    for priority in priority_keywords:
        if priority in text_lower:
            return priority
    return 'medium'
def extract_next_steps(content: str, topic_filter: str = None) -> Dict[str, List[Dict]]:
    """Extract next steps and organize by phase."""
    next_steps = {phase: [] for phase in PHASE_PATTERNS.keys()}
    # Extract steps
    for pattern in NEXT_STEP_PATTERNS:
        matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
        for match in matches:
            step_text = match.group(1).strip()
            if len(step_text) < 10 or len(step_text) > 300:
                continue
            # Clean up
            step_text = re.sub(r'\s+', ' ', step_text)
            # Determine phase
            assigned_phase = 'Phase 3: Integration'  # Default
            for phase, phase_pattern in PHASE_PATTERNS.items():
                if re.search(phase_pattern, step_text, re.IGNORECASE):
                    assigned_phase = phase
                    break
            # Topic filter
            if topic_filter:
                if topic_filter == 'validation' and 'valid' not in step_text.lower():
                    continue
                elif topic_filter not in step_text.lower():
                    continue
            line_num = content[:match.start()].count('\n') + 1
            step = {
                "text": step_text,
                "line_number": line_num,
                "priority": determine_priority(step_text, ['critical', 'urgent', 'high', 'medium', 'low']),
                "estimated_duration": "tbd"
            }
            if assigned_phase not in next_steps:
                next_steps[assigned_phase] = []
            next_steps[assigned_phase].append(step)
    return next_steps
def validate_extraction(results: Dict[str, List[Dict]], config: Dict[str, Any]) -> bool:
    """Validate extracted next steps."""
    total_steps = sum(len(steps) for steps in results.values())
    phase_count = len([p for p, steps in results.items() if steps])
    checks = {
        'has_results': total_steps > 0,
        'valid_structure': all(
            'text' in step for steps in results.values() for step in steps
        ),
        'max_phases_ok': phase_count <= config['max_phases'],
        'max_steps_ok': all(
            len(steps) <= config['max_steps_per_phase']
            for steps in results.values()
        )
    }
    if not all(checks.values()):
        failed = [k for k, v in checks.items() if not v]
        raise ValueError(f"Next steps validation failed: {failed}")
    return True
def main():
    parser = argparse.ArgumentParser(description='Extract next steps by phase')
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
        processed_log = output_dir / "next_steps_extractor_processed.json"
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        all_steps = {phase: [] for phase in PHASE_PATTERNS.keys()}
        for i, chat_file in enumerate(chat_files, 1):
            if chat_file.name in processed:
                print(f"⏭️  ({i}/{len(chat_files)}) Skipping {chat_file.name}")
                continue
            try:
                content = chat_file.read_text(encoding='utf-8')
                steps = extract_next_steps(content, args.topic)
                # Merge results
                for phase, phase_steps in steps.items():
                    if phase in all_steps:
                        all_steps[phase].extend(phase_steps)
                processed.append(chat_file.name)
            except Exception as e:
                print(f"⚠️  Warning: Error processing {chat_file.name}: {e}")
                continue
        # Deduplicate and prioritize within each phase
        for phase in all_steps:
            # Remove duplicates
            unique = {step['text'][:80]: step for step in all_steps[phase]}
            all_steps[phase] = list(unique.values())
            # Sort by priority
            priority_order = {'critical': 0, 'urgent': 1, 'high': 2, 'medium': 3, 'low': 4}
            all_steps[phase].sort(key=lambda x: priority_order.get(x['priority'], 999))
            # Limit per phase
            all_steps[phase] = all_steps[phase][:config['max_steps_per_phase']]
        # Remove empty phases
        all_steps = {k: v for k, v in all_steps.items() if v}
        validate_extraction(all_steps, config)
        output_file = output_dir / config['output_file']
        if args.dry_run:
            total = sum(len(v) for v in all_steps.values())
            print(f"\n📝 DRY RUN: Would extract {total} next steps")
            print(f"   Would write to: {output_file}")
            for phase, steps in list(all_steps.items())[:3]:
                print(f"   {phase}: {len(steps)} steps")
        else:
            with open(processed_log, 'w') as f:
                json.dump(processed, f, indent=2)
            with open(output_file, 'w') as f:
                json.dump(all_steps, f, indent=2)
            total = sum(len(v) for v in all_steps.values())
            print(f"\n✅ Extracted {total} next steps across {len(all_steps)} phases")
            print(f"   Output: {output_file}")
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
if __name__ == '__main__':
    main()