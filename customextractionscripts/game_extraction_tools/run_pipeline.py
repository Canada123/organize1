#!/usr/bin/env python3
"""
Game Data Extraction Pipeline
Extracts, validates, and tags game content from messy notes
"""

import sys
import json
from pathlib import Path

def run_pipeline(vault_path):
    """Run full extraction → validation → tagging pipeline"""
    
    print("="*60)
    print("GAME DATA EXTRACTION PIPELINE")
    print("="*60)
    print(f"Processing vault: {vault_path}\n")
    
    # Step 1: Extract
    print("STEP 1: Extracting data from notes...")
    print("-" * 60)
    
    from extract_game_data import GameDataExtractor
    extractor = GameDataExtractor(vault_path)
    extractor.extract_all()
    report = extractor.generate_report()
    
    print(f"✓ Extracted:")
    print(f"  - {report['summary']['datasets_found']} dataset references")
    print(f"  - {report['summary']['mechanics_found']} game mechanics")
    print(f"  - {report['summary']['models_extracted']} data models")
    print(f"  - {report['summary']['code_examples']} code examples")
    
    # Step 2: Validate
    print("\n" + "="*60)
    print("STEP 2: Validating extracted data...")
    print("-" * 60)
    
    from validate_data import DataValidator
    validator = DataValidator()
    validation = validator.run_all_validations()
    
    validated = validation['validation_results']['validated']
    failed = validation['validation_results']['failed']
    
    print(f"✓ Validation results:")
    print(f"  - {len(validated)} components validated")
    print(f"  - {len(failed)} components failed")
    print(f"  - Completeness: {validation['validation_results']['completeness']['requirements_met']}/4")
    
    # Step 3: Tag
    print("\n" + "="*60)
    print("STEP 3: Creating agent-queryable tags...")
    print("-" * 60)
    
    from tag_data import GameDataTagger
    tagger = GameDataTagger()
    tagged = tagger.save_tagged_data()
    
    manifest = tagged['implementation_manifest']
    print(f"✓ Tagged and organized:")
    print(f"  - {len(manifest['immediately_buildable'])} components ready to use")
    print(f"  - {len(manifest['needs_data_download'])} datasets need download")
    print(f"  - {len(manifest['needs_implementation'])} items need work")
    
    # Summary
    print("\n" + "="*60)
    print("PIPELINE COMPLETE")
    print("="*60)
    
    print("\nGenerated files:")
    print("  1. game_data_extracted.json   - Raw extracted data")
    print("  2. validation_report.json     - Validation results + implementation plan")
    print("  3. tagged_game_data.json      - Agent-queryable tagged data")
    
    print("\nWhat you can do now:")
    
    if manifest['immediately_buildable']:
        print("\n✓ BUILD IMMEDIATELY:")
        for item in manifest['immediately_buildable']:
            print(f"  - {item['component']} ({item.get('count', '?')} items)")
            print(f"    Action: {item['action']}")
    
    if manifest['needs_data_download']:
        print("\n⚠ DOWNLOAD FIRST:")
        for item in manifest['needs_data_download']:
            print(f"  - {item['component']}")
            if 'command' in item:
                print(f"    $ python -c \"{item['command']}\"")
    
    if manifest['needs_implementation']:
        print("\n⚡ NEEDS WORK:")
        for item in manifest['needs_implementation']:
            print(f"  - {item['component']} ({item.get('count', '?')} items)")
            print(f"    Action: {item['action']}")
    
    print("\n" + "="*60)
    return {
        'extracted': report,
        'validated': validation,
        'tagged': tagged
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        vault = input("Enter Obsidian vault path: ").strip()
    else:
        vault = sys.argv[1]
    
    if not Path(vault).exists():
        print(f"Error: Path not found: {vault}")
        sys.exit(1)
    
    results = run_pipeline(vault)
    
    print("\nQuery your data:")
    print("  python -c \"import json; print(json.dumps(json.load(open('tagged_game_data.json'))['quick_access'], indent=2))\"")
