#!/usr/bin/env python3
"""
EXTRACT THE 4 KEY THINGS FROM EACH REPO:
1. WHAT IT DOES (functionality/purpose)
2. WHAT TOOLS IT USES (libraries/frameworks)  
3. WHAT IT HAS (data/content)
4. WHAT THEME (domain/genre)
"""

import os
import json
from pathlib import Path

def scan_repo(repo_path):
    """Extract the 4 key things from a repo"""
    repo_name = os.path.basename(repo_path)
    
    result = {
        'name': repo_name,
        'does': None,      # What it does
        'tools': [],      # What tools it uses
        'has': [],        # What it has
        'theme': None     # What theme
    }
    
    # Quick scan of files
    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
        
        for file in files[:50]:  # Check first 50 files
            
            # WHAT IT HAS - check file types
            if file.endswith('.json'):
                if 'item' in file.lower(): result['has'].append('item-data')
                elif 'dialogue' in file.lower(): result['has'].append('dialogue-data')
                elif 'quest' in file.lower(): result['has'].append('quest-data')
                elif 'npc' in file.lower(): result['has'].append('npc-data')
                elif 'spell' in file.lower(): result['has'].append('spell-data')
                elif 'weapon' in file.lower(): result['has'].append('weapon-data')
                else: result['has'].append('json-data')
            
            if file.endswith(('.pl', '.pro', '.prolog')):
                result['has'].append('prolog-rules')
                result['tools'].append('prolog')
            
            if file.endswith(('.owl', '.n3', '.ttl')):
                result['has'].append('ontology')
            
            # WHAT TOOLS - check by extension
            if file.endswith('.py'):
                if 'python' not in result['tools']:
                    result['tools'].append('python')
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                if 'javascript' not in result['tools']:
                    result['tools'].append('javascript')
            
            # Try to read file for more info
            if file.endswith(('.py', '.js', '.md', '.txt', '.json')):
                try:
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read(5000).lower()  # Read first 5KB
                        
                        # WHAT IT DOES - check content
                        if not result['does']:
                            if 'parse' in content and 'token' in content:
                                result['does'] = 'parser'
                            elif 'generate' in content and ('random' in content or 'create' in content):
                                result['does'] = 'generator'
                            elif 'validate' in content or 'check' in content:
                                result['does'] = 'validator'
                            elif 'scrape' in content or 'extract' in content:
                                result['does'] = 'extractor'
                            elif 'game' in content and 'player' in content:
                                result['does'] = 'game-system'
                            elif 'dialogue' in content and 'response' in content:
                                result['does'] = 'dialogue-system'
                        
                        # WHAT THEME - check content
                        if not result['theme']:
                            if any(x in content for x in ['dragon', 'wizard', 'magic', 'spell', 'fantasy']):
                                result['theme'] = 'fantasy'
                            elif any(x in content for x in ['space', 'alien', 'robot', 'cyber', 'sci-fi']):
                                result['theme'] = 'scifi'
                            elif any(x in content for x in ['game', 'player', 'level', 'quest']):
                                result['theme'] = 'gaming'
                            elif any(x in content for x in ['education', 'learn', 'teach', 'student']):
                                result['theme'] = 'education'
                        
                        # MORE TOOLS - check imports
                        if 'tensorflow' in content or 'keras' in content:
                            result['tools'].append('ml')
                        if 'scrapy' in content or 'beautifulsoup' in content:
                            result['tools'].append('scraping')
                        if 'django' in content or 'flask' in content:
                            result['tools'].append('web')
                        if 'pygame' in content or 'unity' in content:
                            result['tools'].append('game-engine')
                        
                except:
                    pass
    
    # Dedupe lists
    result['has'] = list(set(result['has']))
    result['tools'] = list(set(result['tools']))
    
    # If still no function detected, check repo name
    if not result['does']:
        name_lower = repo_name.lower()
        if 'parser' in name_lower: result['does'] = 'parser'
        elif 'generator' in name_lower: result['does'] = 'generator'
        elif 'validator' in name_lower: result['does'] = 'validator'
        elif 'scraper' in name_lower: result['does'] = 'scraper'
        elif 'game' in name_lower: result['does'] = 'game'
        else: result['does'] = 'unknown'
    
    return result

def main(base_path):
    """Main extraction"""
    repos = []
    
    repo_dirs = [d for d in Path(base_path).iterdir() 
                 if d.is_dir() and not d.name.startswith('.')]
    
    print(f"Extracting from {len(repo_dirs)} repositories...\n")
    
    for i, repo_dir in enumerate(repo_dirs):
        print(f"[{i+1}/{len(repo_dirs)}] {repo_dir.name}")
        
        info = scan_repo(str(repo_dir))
        repos.append(info)
        
        # Print what we found
        print(f"  DOES: {info['does']}")
        if info['tools']: print(f"  TOOLS: {', '.join(info['tools'])}")
        if info['has']: print(f"  HAS: {', '.join(info['has'])}")
        if info['theme']: print(f"  THEME: {info['theme']}")
        print()
    
    # Save to JSON
    with open('repo_extraction.json', 'w') as f:
        json.dump(repos, f, indent=2)
    
    # Create text reports
    with open('WHAT_THEY_DO.txt', 'w') as f:
        f.write("=== WHAT EACH REPO DOES ===\n\n")
        by_function = {}
        for repo in repos:
            func = repo['does'] or 'unknown'
            if func not in by_function:
                by_function[func] = []
            by_function[func].append(repo['name'])
        
        for func, names in sorted(by_function.items()):
            f.write(f"\n{func.upper()} ({len(names)} repos):\n")
            for name in names:
                f.write(f"  - {name}\n")
    
    with open('WHAT_THEY_HAVE.txt', 'w') as f:
        f.write("=== WHAT CONTENT REPOS HAVE ===\n\n")
        content_types = {}
        for repo in repos:
            for content in repo['has']:
                if content not in content_types:
                    content_types[content] = []
                content_types[content].append(repo['name'])
        
        for content, names in sorted(content_types.items()):
            f.write(f"\n{content.upper()} ({len(names)} repos):\n")
            for name in names[:10]:  # Show first 10
                f.write(f"  - {name}\n")
            if len(names) > 10:
                f.write(f"  ... and {len(names)-10} more\n")
    
    print("\n=== EXTRACTION COMPLETE ===")
    print("Created files:")
    print("  - repo_extraction.json (all data)")
    print("  - WHAT_THEY_DO.txt (grouped by function)")
    print("  - WHAT_THEY_HAVE.txt (grouped by content)")

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python extract_4_things.py /path/to/repos")
        sys.exit(1)
    
    main(sys.argv[1])
