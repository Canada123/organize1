#!/usr/bin/env python3
"""  
Rename extracted scripts based on their content.  
"""
import re
from pathlib import Path
  
def infer_script_name(script_content: str) -> str:
    """Infer meaningful name from script content."""
      
    # Look for class definitions
    class_match = re.search(r'class\s+(\w+)', script_content)
    if class_match:
        class_name = class_match.group(1)
        # Convert CamelCase to snake_case
        name = re.sub(r'(?<!^)(?=[A-Z])', '_', class_name).lower()
        return f"{name}.py"
      
    # Look for main function definitions
    func_match = re.search(r'def\s+(\w+)\s*\(', script_content)
    if func_match:
        func_name = func_match.group(1)
        if func_name != 'main':
            return f"{func_name}.py"
      
    # Look for docstring description
    doc_match = re.search(r'"""(.*?)"""', script_content, re.DOTALL)
    if doc_match:
        doc = doc_match.group(1).lower()
        if 'extractor' in doc:
            return 'extractor.py'
        elif 'logger' in doc:
            return 'logger.py'
      
    return None  # Keep original name
  
# Rename all scripts
scripts_dir = Path('/Users/ashleygeness/Desktop/capture_evidence/extracted/')
for script_file in scripts_dir.glob('block_*.py'):
    content = script_file.read_text()
    new_name = infer_script_name(content)
      
    if new_name and new_name != script_file.name:
        new_path = script_file.parent / new_name
        # Avoid overwriting existing files
        if not new_path.exists():
            script_file.rename(new_path)
            print(f"✅ Renamed: {script_file.name} → {new_name}")
        else:
            print(f"⚠️  Skipped: {script_file.name} (target exists)")
