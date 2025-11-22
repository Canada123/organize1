#!/usr/bin/env python3
"""
SIMPLE TAG GRABBER
Just grab all the tags/categories from each repo
"""

import os
from pathlib import Path
import json

def grab_tags_from_repo(repo_path):
    """Extract all possible tags from a repo"""
    tags = set()
    repo_name = os.path.basename(repo_path)
    
    # Check repo name for clues
    name_lower = repo_name.lower()
    
    # Game-related
    if any(x in name_lower for x in ['game', 'rpg', 'dungeon', 'quest', 'combat']):
        tags.add('game')
    
    # Parser/Generator
    if 'parser' in name_lower or 'parse' in name_lower:
        tags.add('parser')
    if 'generator' in name_lower or 'gen' in name_lower:
        tags.add('generator')
    
    # Specific game names
    if 'chess' in name_lower: tags.add('chess')
    if 'queen' in name_lower: tags.add('8queens')
    if 'genetic' in name_lower: tags.add('genetic')
    if 'maze' in name_lower: tags.add('maze')
    if 'puzzle' in name_lower: tags.add('puzzle')
    
    # Tools
    if 'scraper' in name_lower or 'scrape' in name_lower:
        tags.add('scraper')
    if 'validator' in name_lower or 'valid' in name_lower:
        tags.add('validator')
    if 'extractor' in name_lower or 'extract' in name_lower:
        tags.add('extractor')
    
    # Domains
    if 'ai' in name_lower or 'ml' in name_lower:
        tags.add('ai')
    if 'nlp' in name_lower or 'language' in name_lower:
        tags.add('nlp')
    if 'dialogue' in name_lower or 'dialog' in name_lower:
        tags.add('dialogue')
    
    # Check files in repo
    try:
        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for file in files[:20]:  # Check first 20 files
                file_lower = file.lower()
                
                # Prolog files
                if file.endswith(('.pl', '.pro', '.prolog')):
                    tags.add('prolog')
                
                # Game data files
                if 'item' in file_lower: tags.add('items')
                if 'weapon' in file_lower: tags.add('weapons')
                if 'spell' in file_lower: tags.add('spells')
                if 'dialogue' in file_lower: tags.add('dialogue')
                if 'quest' in file_lower: tags.add('quests')
                if 'npc' in file_lower: tags.add('npcs')
                
                # Data files
                if file.endswith('.json'): tags.add('json-data')
                if file.endswith('.csv'): tags.add('csv-data')
                if file.endswith('.xml'): tags.add('xml-data')
                
                # Ontology files
                if file.endswith(('.owl', '.n3', '.ttl', '.rdf')):
                    tags.add('ontology')
                
                # Check specific filenames
                if 'corpus' in file_lower: tags.add('corpus')
                if 'words' in file_lower: tags.add('word-list')
                if 'names' in file_lower: tags.add('names')
                if 'template' in file_lower: tags.add('template')
    except:
        pass
    
    return list(tags)

def main(base_path):
    """Scan all repos and grab tags"""
    all_tags = {}
    tag_counts = {}
    
    repo_dirs = [d for d in Path(base_path).iterdir() 
                 if d.is_dir() and not d.name.startswith('.')]
    
    print(f"Grabbing tags from {len(repo_dirs)} repositories...\n")
    
    for repo_dir in repo_dirs:
        tags = grab_tags_from_repo(str(repo_dir))
        all_tags[repo_dir.name] = tags
        
        # Count tag frequency
        for tag in tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        if tags:
            print(f"{repo_dir.name}: {', '.join(tags)}")
    
    # Save results
    with open('repo_tags.json', 'w') as f:
        json.dump(all_tags, f, indent=2)
    
    # Print summary
    print(f"\n=== TAG SUMMARY ===")
    print(f"Total repos with tags: {len([r for r in all_tags.values() if r])}")
    print(f"\n=== MOST COMMON TAGS ===")
    
    sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)
    for tag, count in sorted_tags[:20]:
        print(f"  {tag}: {count} repos")
    
    print(f"\nSaved to repo_tags.json")

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python tag_grabber.py /path/to/repos")
        sys.exit(1)
    
    main(sys.argv[1])
