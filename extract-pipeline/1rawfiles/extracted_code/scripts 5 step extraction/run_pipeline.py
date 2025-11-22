#!/usr/bin/env python3
"""
Main extraction pipeline - orchestrates all extractors.
Usage: python main_pipeline.py [--config PATH] [--dry-run] [--topic TOPIC]
Options:
    --config PATH: Path to config file (default: config/extraction_config.json)
    --dry-run: Show what would be extracted without writing files
    --topic TOPIC: Filter all extractors by specific topic
"""
import argparse
import json
import sys
from pathlib import Path
from extractors import module_extractor, action_item_extractor, architecture_extractor, file_path_extractor, next_steps_extractor
def run_pipeline(config_path: str = None, dry_run: bool = False, topic: str = None):
    """Run all extractors in sequence."""
    try:
        # Load config
        if config_path:
            config = json.loads(Path(config_path).read_text())
        else:
            config = json.loads(Path('config/extraction_config.json').read_text())
        # Create output directory
        output_dir = Path(config['module_extractor']['output_dir'])
        output_dir.mkdir(parents=True, exist_ok=True)
        # Base arguments
        base_args = argparse.Namespace()
        base_args.config = config_path
        base_args.dry_run = dry_run
        base_args.topic = topic
        print("=" * 60)
        print("EXTRACTION PIPELINE")
        print("=" * 60)
        # Phase 1: Extract modules (no dependencies)
        print("\n🔹 Phase 1: Extracting modules...")
        module_extractor.main()
        # Phase 2: Extract action items (depends on modules)
        print("\n🔹 Phase 2: Extracting action items...")
        action_item_extractor.main()
        # Phase 3: Extract architecture decisions (independent)
        print("\n🔹 Phase 3: Extracting architecture decisions...")
        architecture_extractor.main()
        # Phase 4: Extract file paths (independent)
        print("\n🔹 Phase 4: Extracting file paths...")
        file_path_extractor.main()
        # Phase 5: Extract next steps (independent)
        print("\n🔹 Phase 5: Extracting next steps...")
        next_steps_extractor.main()
        # Summary
        print("\n" + "=" * 60)
        print("PIPELINE COMPLETE")
        print("=" * 60)
        if not dry_run:
            # Load all outputs for summary
            outputs = {
                'modules': 'modules_extracted.json',
                'action_items': 'action_items_by_module.json',
                'architecture': 'architecture_decisions.json',
                'file_paths': 'file_paths_categorized.json',
                'next_steps': 'next_steps_by_phase.json'
            }
            for name, filename in outputs.items():
                try:
                    file_path = output_dir / filename
                    if file_path.exists():
                        data = json.loads(file_path.read_text())
                        if name == 'modules':
                            count = len(data)
                        elif name == 'action_items':
                            count = sum(len(v) for v in data.values()) if isinstance(data, dict) else 0
                        elif name == 'architecture':
                            count = len(data)
                        elif name == 'file_paths':
                            count = sum(len(v) for v in data.values()) if isinstance(data, dict) else 0
                        elif name == 'next_steps':
                            count = sum(len(v) for v in data.values()) if isinstance(data, dict) else 0
                        print(f"   ✅ {name.replace('_', ' ').title()}: {count}")
                except:
                    pass
        print("\n🎉 All extractors completed successfully!")
    except Exception as e:
        print(f"❌ Pipeline failed: {e}", file=sys.stderr)
        sys.exit(1)
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the complete extraction pipeline')
    parser.add_argument('--config', help='Path to config file')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be extracted')
    parser.add_argument('--topic', help='Filter all extractors by topic')
    args = parser.parse_args()
    run_pipeline(config_path=args.config, dry_run=args.dry_run, topic=args.topic)