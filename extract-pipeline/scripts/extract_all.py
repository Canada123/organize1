#!/usr/bin/env python3
"""
Simple Recursive Code Block Extractor
Run from any directory - processes all .md files recursively
Extracts ALL python code blocks with no filtering
"""

import re
import json
from pathlib import Path
from typing import List, Dict

def get_name_from_code(code: str) -> str:
    """Extract class or function name, or return None."""
    if match := re.search(r'class\s+(\w+)', code):
        return match.group(1)
    if match := re.search(r'def\s+(\w+)', code):
        return match.group(1)
    return None

def process_file(md_file: Path, output_base: Path) -> Dict:
    """Process a single markdown file."""
    content = md_file.read_text(encoding='utf-8', errors='ignore')
    
    # Find all python code blocks
    blocks = re.findall(r'```python\n(.*?)```', content, re.DOTALL)
    
    if not blocks:
        return None
    
    # Create output directory matching source structure
    rel_path = md_file.relative_to(Path.cwd())
    output_dir = output_base / rel_path.parent / rel_path.stem
    output_dir.mkdir(parents=True, exist_ok=True)
    
    extracted = []
    
    for i, code in enumerate(blocks, 1):
        code = code.strip()
        if not code:
            continue
        
        # Generate filename
        name = get_name_from_code(code)
        filename = f"{name}.py" if name else f"block_{i}.py"
        
        # Handle duplicates
        counter = 1
        while (output_dir / filename).exists():
            base, ext = filename.rsplit('.', 1)
            filename = f"{base}_{counter}.{ext}"
            counter += 1
        
        (output_dir / filename).write_text(code)
        extracted.append(str(Path(rel_path.stem) / filename))
    
    return {
        "source": str(rel_path),
        "blocks": len(blocks),
        "files": extracted
    }

def main():
    start_dir = Path.cwd()
    output_base = start_dir / "extracted_code"
    output_base.mkdir(exist_ok=True)
    
    md_files = list(start_dir.rglob("*.md"))
    
    # Skip our own output directory
    md_files = [f for f in md_files if 'extracted_code' not in str(f)]
    
    if not md_files:
        print(f"No markdown files found in {start_dir}")
        return
    
    manifest = {
        "root": str(start_dir),
        "timestamp": start_dir.stat().st_mtime,
        "processed": 0,
        "with_code": [],
        "total_files": 0
    }
    
    print(f"📂 Processing {len(md_files)} files from {start_dir}")
    
    for md_file in md_files:
        result = process_file(md_file, output_base)
        if result:
            manifest["processed"] += 1
            manifest["with_code"].append(result)
            manifest["total_files"] += len(result["files"])
            print(f"✅ {result['source']} → {len(result['files'])} files")
    
    # Save manifest
    manifest_file = output_base / "MANIFEST.json"
    manifest_file.write_text(json.dumps(manifest, indent=2))
    
    print(f"\n{'='*60}")
    print(f"✅ Done!")
    print(f"📁 {manifest['processed']} files had code")
    print(f"📝 {manifest['total_files']} Python files extracted")
    print(f"📄 Manifest: {manifest_file}")

if __name__ == '__main__':
    main()
