#!/usr/bin/env python3
"""
GRAB EVERYTHING FROM REPOS:
- WHAT IT DOES (functionality)
- WHAT TOOLS (libraries/frameworks used)
- WHAT IT HAS (data/content/files)
- THEME (domain/topic/genre)
"""

import os
import json
import sqlite3
from pathlib import Path
import re

def init_database():
    conn = sqlite3.connect('repos_complete.db')
    c = conn.cursor()
    
    # Drop old tables
    c.execute('DROP TABLE IF EXISTS repos')
    
    # Create comprehensive repo table
    c.execute('''CREATE TABLE repos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repo_name TEXT NOT NULL,
        repo_path TEXT NOT NULL,
        
        -- WHAT IT DOES
        does_parse BOOLEAN,
        does_generate BOOLEAN,
        does_validate BOOLEAN,
        does_extract BOOLEAN,
        does_transform BOOLEAN,
        does_simulate BOOLEAN,
        does_manage BOOLEAN,
        primary_function TEXT,
        
        -- WHAT TOOLS IT USES
        uses_python BOOLEAN,
        uses_javascript BOOLEAN,
        uses_prolog BOOLEAN,
        uses_ml_libraries BOOLEAN,
        uses_game_engines BOOLEAN,
        uses_web_frameworks BOOLEAN,
        tools_list TEXT,
        
        -- WHAT IT HAS
        has_json_data BOOLEAN,
        has_game_items BOOLEAN,
        has_dialogue BOOLEAN,
        has_ontology BOOLEAN,
        has_corpus BOOLEAN,
        has_rules BOOLEAN,
        has_templates BOOLEAN,
        content_types TEXT,
        
        -- THEME
        theme_game BOOLEAN,
        theme_narrative BOOLEAN,
        theme_education BOOLEAN,
        theme_business BOOLEAN,
        theme_science BOOLEAN,
        theme_fantasy BOOLEAN,
        theme_scifi BOOLEAN,
        main_theme TEXT,
        
        -- TAGS
        all_tags TEXT
    )''')
    
    conn.commit()
    return conn

def analyze_content(file_path):
    """Read file and extract keywords"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read().lower()
    except:
        return ""

def detect_what_it_does(content):
    """Detect primary functionality"""
    functions = {
        'parse': ['parse', 'parser', 'tokenize', 'lexer', 'grammar', 'ast'],
        'generate': ['generate', 'create', 'build', 'produce', 'spawn', 'procedural'],
        'validate': ['validate', 'verify', 'check', 'assert', 'test', 'ensure'],
        'extract': ['extract', 'scrape', 'pull', 'fetch', 'harvest', 'mine'],
        'transform': ['transform', 'convert', 'translate', 'map', 'adapt'],
        'simulate': ['simulate', 'model', 'emulate', 'mimic', 'virtual'],
        'manage': ['manage', 'organize', 'track', 'monitor', 'control']
    }
    
    results = {}
    primary = None
    max_count = 0
    
    for func, keywords in functions.items():
        count = sum(1 for kw in keywords if kw in content)
        results[f'does_{func}'] = count > 0
        if count > max_count:
            max_count = count
            primary = func
    
    results['primary_function'] = primary
    return results

def detect_tools(content, files):
    """Detect tools and frameworks used"""
    tools = {
        'uses_python': any(f.endswith('.py') for f in files),
        'uses_javascript': any(f.endswith(('.js', '.jsx', '.ts', '.tsx')) for f in files),
        'uses_prolog': any(f.endswith(('.pl', '.pro', '.prolog')) for f in files),
        'uses_ml_libraries': any(lib in content for lib in ['tensorflow', 'pytorch', 'sklearn', 'keras', 'numpy', 'pandas']),
        'uses_game_engines': any(eng in content for eng in ['unity', 'unreal', 'godot', 'pygame', 'phaser']),
        'uses_web_frameworks': any(fw in content for fw in ['react', 'vue', 'angular', 'django', 'flask', 'express'])
    }
    
    # List specific tools found
    tool_list = []
    if 'tensorflow' in content: tool_list.append('tensorflow')
    if 'pytorch' in content: tool_list.append('pytorch')
    if 'react' in content: tool_list.append('react')
    if 'django' in content: tool_list.append('django')
    if 'unity' in content: tool_list.append('unity')
    if 'scrapy' in content: tool_list.append('scrapy')
    if 'beautifulsoup' in content: tool_list.append('beautifulsoup')
    
    tools['tools_list'] = ','.join(tool_list)
    return tools

def detect_content(content, files):
    """Detect what content/data it has"""
    has = {
        'has_json_data': any(f.endswith('.json') for f in files),
        'has_game_items': any(item in content for item in ['item', 'weapon', 'armor', 'spell', 'potion', 'equipment']),
        'has_dialogue': any(dial in content for dial in ['dialogue', 'conversation', 'speak', 'say', 'talk']),
        'has_ontology': any(f.endswith(('.owl', '.n3', '.ttl')) for f in files) or 'ontology' in content,
        'has_corpus': 'corpus' in content or 'corpora' in content or any('words' in f for f in files),
        'has_rules': 'rule' in content or any(f.endswith(('.pl', '.pro')) for f in files),
        'has_templates': 'template' in content or any('template' in f for f in files)
    }
    
    # List content types
    types = []
    if has['has_json_data']: types.append('json-data')
    if has['has_game_items']: types.append('game-items')
    if has['has_dialogue']: types.append('dialogue')
    if has['has_ontology']: types.append('ontology')
    if has['has_corpus']: types.append('corpus')
    if has['has_rules']: types.append('rules')
    if has['has_templates']: types.append('templates')
    
    has['content_types'] = ','.join(types)
    return has

def detect_theme(content, repo_name):
    """Detect main theme/domain"""
    themes = {
        'theme_game': ['game', 'player', 'level', 'quest', 'combat', 'dungeon', 'rpg', 'mmo'],
        'theme_narrative': ['story', 'narrative', 'plot', 'character', 'scene', 'chapter'],
        'theme_education': ['education', 'learn', 'teach', 'course', 'lesson', 'tutorial'],
        'theme_business': ['business', 'finance', 'market', 'trade', 'economy', 'invoice'],
        'theme_science': ['science', 'research', 'data', 'analysis', 'experiment', 'hypothesis'],
        'theme_fantasy': ['fantasy', 'magic', 'wizard', 'dragon', 'spell', 'mythical'],
        'theme_scifi': ['scifi', 'space', 'alien', 'robot', 'cyber', 'future']
    }
    
    results = {}
    main_theme = None
    max_count = 0
    
    for theme, keywords in themes.items():
        count = sum(1 for kw in keywords if kw in content or kw in repo_name.lower())
        results[theme] = count > 0
        if count > max_count:
            max_count = count
            main_theme = theme.replace('theme_', '')
    
    results['main_theme'] = main_theme
    return results

def generate_tags(repo_data):
    """Generate all tags for the repo"""
    tags = []
    
    # Add function tags
    if repo_data.get('primary_function'):
        tags.append(repo_data['primary_function'])
    
    # Add tool tags
    if repo_data.get('uses_python'): tags.append('python')
    if repo_data.get('uses_javascript'): tags.append('javascript')
    if repo_data.get('uses_prolog'): tags.append('prolog')
    
    # Add content tags
    if repo_data.get('has_game_items'): tags.append('game-items')
    if repo_data.get('has_dialogue'): tags.append('dialogue')
    if repo_data.get('has_ontology'): tags.append('ontology')
    
    # Add theme tags
    if repo_data.get('main_theme'):
        tags.append(repo_data['main_theme'])
    
    return ','.join(tags)

def scan_repo(repo_path):
    """Scan a single repository"""
    repo_name = os.path.basename(repo_path)
    
    # Collect all files
    all_files = []
    all_content = []
    
    for root, dirs, files in os.walk(repo_path):
        # Skip hidden and vendor directories
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', 'vendor', '__pycache__']]
        
        for file in files:
            if not file.startswith('.'):
                all_files.append(file)
                file_path = os.path.join(root, file)
                
                # Read text files
                if file.endswith(('.py', '.js', '.json', '.md', '.txt', '.pl', '.pro', '.owl', '.ttl')):
                    content = analyze_content(file_path)
                    if content:
                        all_content.append(content)
    
    # Combine all content
    combined_content = ' '.join(all_content)
    
    # Analyze everything
    repo_data = {
        'repo_name': repo_name,
        'repo_path': repo_path
    }
    
    # Detect what it does
    repo_data.update(detect_what_it_does(combined_content))
    
    # Detect tools
    repo_data.update(detect_tools(combined_content, all_files))
    
    # Detect content
    repo_data.update(detect_content(combined_content, all_files))
    
    # Detect theme
    repo_data.update(detect_theme(combined_content, repo_name))
    
    # Generate tags
    repo_data['all_tags'] = generate_tags(repo_data)
    
    return repo_data

def main(base_path):
    """Main scanning function"""
    conn = init_database()
    c = conn.cursor()
    
    # Get all directories
    repo_dirs = [d for d in Path(base_path).iterdir() if d.is_dir() and not d.name.startswith('.')]
    
    print(f"Scanning {len(repo_dirs)} repositories...")
    
    for i, repo_dir in enumerate(repo_dirs):
        print(f"[{i+1}/{len(repo_dirs)}] Scanning {repo_dir.name}")
        
        try:
            repo_data = scan_repo(str(repo_dir))
            
            # Insert into database
            columns = ', '.join(repo_data.keys())
            placeholders = ', '.join(['?' for _ in repo_data])
            values = list(repo_data.values())
            
            c.execute(f'INSERT INTO repos ({columns}) VALUES ({placeholders})', values)
            
        except Exception as e:
            print(f"  ERROR: {e}")
            continue
    
    conn.commit()
    
    # Print summary
    c.execute('SELECT COUNT(*) FROM repos')
    total = c.fetchone()[0]
    
    print(f"\n=== SCAN COMPLETE ===")
    print(f"Total repos scanned: {total}")
    
    # Show category counts
    print("\n=== PRIMARY FUNCTIONS ===")
    c.execute('SELECT primary_function, COUNT(*) FROM repos GROUP BY primary_function')
    for func, count in c.fetchall():
        if func:
            print(f"  {func}: {count}")
    
    print("\n=== MAIN THEMES ===")
    c.execute('SELECT main_theme, COUNT(*) FROM repos GROUP BY main_theme')
    for theme, count in c.fetchall():
        if theme:
            print(f"  {theme}: {count}")
    
    print("\n=== CONTENT TYPES ===")
    c.execute('SELECT COUNT(*) FROM repos WHERE has_json_data = 1')
    print(f"  JSON data: {c.fetchone()[0]}")
    c.execute('SELECT COUNT(*) FROM repos WHERE has_game_items = 1')
    print(f"  Game items: {c.fetchone()[0]}")
    c.execute('SELECT COUNT(*) FROM repos WHERE has_dialogue = 1')
    print(f"  Dialogue: {c.fetchone()[0]}")
    c.execute('SELECT COUNT(*) FROM repos WHERE has_prolog = 1')
    print(f"  Prolog: {c.fetchone()[0]}")
    
    conn.close()
    print(f"\nDatabase saved to: repos_complete.db")

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python grab_everything.py /path/to/repos")
        sys.exit(1)
    
    main(sys.argv[1])
