#!/usr/bin/env python3
"""
MAIN PIPELINE - Runs ALL extractors
Usage: python main_pipeline.py
"""

import subprocess
import sys
from pathlib import Path

def run_extractor(script_name: str):
    """Run a single extractor script"""
    print(f"\n{'='*60}")
    print(f"🚀 Running: {script_name}")
    print(f"{'='*60}")
    
    script_path = Path(__file__).parent / f"{script_name}.py"
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent
        )
        
        if result.returncode == 0:
            print(f"✅ {script_name} completed")
            print(result.stdout[-500:])  # Last 500 chars
        else:
            print(f"❌ {script_name} failed")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error running {script_name}: {e}")
        return False
    
    return True

if __name__ == '__main__':
    # All your extractors
    extractors = [
        'code_block_extractor',
        'module_extractor',
        'action_item_extractor',
        'architecture_extractor',
        'file_path_extractor',
        'next_steps_extractor'
    ]
    
    print("🎬 Starting Complete Extraction Pipeline")
    print("Processing ALL your notes...")
    
    success_count = 0
    for extractor in extractors:
        if run_extractor(extractor):
            success_count += 1
    
    print(f"\n{'='*60}")
    print(f"📊 PIPELINE COMPLETE: {success_count}/{len(extractors)} extractors succeeded")
    print(f"📁 Check your extracted files in: ~/Desktop/capture_evidence/extracted/")
    print(f"📁 Original files moved to: ~/Desktop/capture_evidence/chatfiles_processed/")
