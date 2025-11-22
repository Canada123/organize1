#!/usr/bin/env python3
import os
import re
from pathlib import Path

def fix_code_blocks(file_path):
    """Fix broken code blocks in markdown files - NO BACKUPS."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False

    # Pattern 1: Language identifier on its own line without backticks
    # Matches: "python" followed by code until blank line or heading
    pattern = r'^(python|yaml|bash|json|javascript|js|css|html|sql|java|c\+\+|c#|php|ruby|go|rust)\s*\n(.*?)(?=^(#|\n|\.\.\.|$))'
    
    def replace_block(match):
        lang = match.group(1)
        code = match.group(2)
        # Skip if already properly fenced
        if code.strip().startswith('```'):
            return match.group(0)
        return f'```{lang}\n{code.strip()}\n```\n\n'
    
    new_content = re.sub(pattern, replace_block, content, flags=re.MULTILINE | re.DOTALL)
    
    # Pattern 2: Code blocks missing closing backticks
    lines = new_content.split('\n')
    fixed_lines = []
    in_block = False
    block_lang = ""
    
    for i, line in enumerate(lines):
        # Opening fence
        if re.match(r'^```(python|yaml|bash|json|javascript|js|css|html|sql|java|c\+\+|c#|php|ruby|go|rust)?$', line.strip()):
            if not in_block:
                in_block = True
                block_lang = line.strip()
                fixed_lines.append(line)
                continue
        
        # Closing fence
        if line.strip() == '```' and in_block:
            in_block = False
            fixed_lines.append(line)
            continue
        
        # If we hit a blank line or heading while in block, close it
        if in_block and (line.strip() == '' or line.strip().startswith('#')):
            if i > 0 and not lines[i-1].strip().startswith('```'):
                fixed_lines.append('```')
                in_block = False
        
        fixed_lines.append(line)
    
    # Close any remaining open blocks
    if in_block:
        fixed_lines.append('```')
    
    new_content = '\n'.join(fixed_lines)
    
    # Write back immediately - NO BACKUP
    if new_content != content:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"🔧 FIXED: {file_path}")
            return True
        except Exception as e:
            print(f"❌ ERROR: {file_path} - {e}")
            return False
    else:
        print(f"✓ OK: {file_path}")
        return False

def scan_and_fix(folder='.'):
    """Scan all markdown files and fix them."""
    path = Path(folder).resolve()
    files = list(path.rglob("*.md"))
    
    print(f"🔍 Scanning {len(files)} markdown files...\n")
    
    fixed = 0
    for f in files:
        if fix_code_blocks(f):
            fixed += 1
    
    print(f"\n🎉 Complete! Fixed {fixed} files.")

if __name__ == "__main__":
    scan_and_fix(".")
