#!/usr/bin/env python3
"""
CODE BLOCK EXTRACTOR - Integrated Pipeline Component
Extracts all code blocks from chat files and saves them as separate files
"""

import json
import re
import shutil
import sys
import argparse
from pathlib import Path
from typing import List, Dict, Any

# Add utils to path
script_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(script_dir))

from utils.base_extractor import BaseExtractor

class CodeBlockExtractor(BaseExtractor):
    def __init__(self, config_path: str):
        super().__init__(config_path, 'code_block')
    
    def extract_blocks(self, content: str, file_id: str) -> List[Dict[str, Any]]:
        """Extract code blocks with full metadata"""
        blocks = []
        pattern = r'```(\w+)?\n(.*?)```'
        
        for i, match in enumerate(re.finditer(pattern, content, re.DOTALL), 1):
            lang = match.group(1) or 'unknown'
            code = match.group(2).strip()
            
            if not code:
                continue
                
            block = {
                'id': f"{file_id}_block{i}_{hash(code) % 1000}",
                'language': lang,
                'content': code,
                'lines': len(code.split('\n')),
                'type': self.categorize_code(code, lang)
            }
            blocks.append(block)
        
        return blocks
    
    def categorize_code(self, code: str, lang: str) -> str:
        """Categorize code by content analysis"""
        if 'class' in code and 'Extractor' in code:
            return 'extractor_script'
        if 'def extract_' in code:
            return 'extraction_function'
        if 'MonoBehaviour' in code:
            return 'unity_script'
        if 'config' in code or 'JSON' in code:
            return 'config_related'
        return f'{lang}_code'
    
    def save_as_files(self, blocks: List[Dict], output_dir: Path):
        """Save blocks as individual code files"""
        output_dir.mkdir(parents=True, exist_ok=True)
        
        for block in blocks:
            ext = block['language'].lower() or 'txt'
            if ext == 'python':
                ext = 'py'
            elif ext == 'bash':
                ext = 'sh'
            
            filename = f"{block['id']}.{ext}"
            filepath = output_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(block['content'])
            
            print(f"   💾 Saved: {filename} ({block['lines']} lines)")
    
    def run(self, dry_run: bool = False):
        """Execute full extraction"""
        chat_files = self.get_chat_files()
        print(f"\n📂 Found {len(chat_files)} unprocessed files")
        
        if not chat_files:
            print("⚠️  No files to process")
            return
        
        all_blocks = []
        for i, file in enumerate(chat_files, 1):
            print(f"\n⚡ ({i}/{len(chat_files)}) {file.name}")
            
            content = file.read_text(encoding='utf-8')
            blocks = self.extract_blocks(content, file.stem)
            
            if blocks:
                print(f"   📦 Found {len(blocks)} code blocks")
                all_blocks.extend(blocks)
                
                if not dry_run:
                    code_dir = self.output_dir / 'code_snippets'
                    self.save_as_files(blocks, code_dir)
            else:
                print("   ⚠️  No code blocks")
            
            self.mark_processed(file.name, move_file=not dry_run)
        
        # Save extraction metadata
        if not dry_run:
            metadata = {
                'total_blocks': len(all_blocks),
                'by_language': {},
                'by_type': {}
            }
            
            for block in all_blocks:
                metadata['by_language'][block['language']] = metadata['by_language'].get(block['language'], 0) + 1
                metadata['by_type'][block['type']] = metadata['by_type'].get(block['type'], 0) + 1
            
            meta_file = self.output_dir / 'code_extraction_summary.json'
            with open(meta_file, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            print(f"\n📊 Summary saved: {meta_file}")
        
        self.save_output(all_blocks, dry_run)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='extraction_config.json')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    
    extractor = CodeBlockExtractor(args.config)
    extractor.run(dry_run=args.dry_run)
