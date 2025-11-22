#!/usr/bin/env python3
"""
Base Extractor - All extractors inherit from this
"""

import json
import shutil
from pathlib import Path
from typing import Dict, List, Any

class BaseExtractor:
    def __init__(self, config_path: str, extractor_name: str):
        self.config_path = Path(config_path)
        self.extractor_name = extractor_name
        
        # Load config
        if not self.config_path.exists():
            raise FileNotFoundError(f"""
❌ CONFIG FILE NOT FOUND: {self.config_path}
Please create it with valid JSON.
""")
        
        self.config = json.loads(self.config_path.read_text(encoding='utf-8'))
        self.pipeline = self.config['pipeline']
        self.extractor_config = self.config['extractors'][extractor_name]
        
        # Setup directories
        self.input_dir = Path(self.pipeline['input_dir'])
        self.processed_dir = Path(self.pipeline['processed_dir'])
        self.output_dir = Path(self.pipeline['output_dir'])
        
        # Ensure directories exist
        for dir_path in [self.processed_dir, self.output_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def get_chat_files(self) -> List[Path]:
        """Get all unprocessed chat files"""
        processed_log = self.output_dir / self.extractor_config['processed_log']
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        
        files = []
        for ext in ['*.txt', '*.md']:
            files.extend(self.input_dir.glob(ext))
        
        return [f for f in files if f.name not in processed]
    
    def mark_processed(self, filename: str, move_file: bool = True):
        """Mark file as processed and move it to processed_dir"""
        processed_log = self.output_dir / self.extractor_config['processed_log']
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        
        if filename not in processed:
            processed.append(filename)
            
            # Move the file
            if move_file:
                src = self.input_dir / filename
                dst = self.processed_dir / filename
                
                if src.exists():
                    # Ensure processed directory exists
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Move it
                    shutil.move(str(src), str(dst))
                    print(f"   📁 MOVED: {filename}")
                    print(f"      → {dst}")
        
        # Save log
        with open(processed_log, 'w') as f:
            json.dump(processed, f, indent=2)
    
    def save_output(self, data: List[Any], dry_run: bool = False):
        """Save extraction results"""
        if dry_run:
            print(f"\n📝 DRY RUN: Would extract {len(data)} items")
            return
        
        output_file = self.output_dir / self.extractor_config['output_file']
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"\n💾 SAVED: {output_file} ({len(data)} items)")
