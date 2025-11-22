#!/usr/bin/env python3
"""
SCRAPE CATEGORIES AND TAGS FROM YOUR EXISTING DOCS
This comes FIRST - before analyzing repos!
"""

import os
import json
import re
from pathlib import Path

def scrape_markdown_docs(file_path):
    """Extract categories, tags, keywords from markdown files"""
    extracted = {
        'categories': [],
        'tags': [],
        'keywords': [],
        'repo_names': [],
        'functions': [],
        'themes': [],
        'tools': []
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Find categories (usually in headers or lists)
            # Look for patterns like "Category: X" or "## Categories"
            category_patterns = [
                r'[Cc]ategor(?:y|ies):\s*([^\n]+)',
                r'## Categories\n([^#]+)',
                r'\* Category:\s*([^\n]+)',
                r'- Category:\s*([^\n]+)'
            ]
            
            for pattern in category_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    # Split on common delimiters
                    cats = re.split(r'[,;|]', match)
                    extracted['categories'].extend([c.strip() for c in cats])
            
            # Find tags (various formats)
            tag_patterns = [
                r'[Tt]ags?:\s*([^\n]+)',
                r'#([a-zA-Z0-9_-]+)',  # Hashtags
                r'\[tag:([^\]]+)\]',   # [tag:something]
                r'`tag:([^`]+)`'       # `tag:something`
            ]
            
            for pattern in tag_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    if isinstance(match, str):
                        tags = re.split(r'[,;|\s]+', match)
                        extracted['tags'].extend([t.strip() for t in tags if t.strip()])
            
            # Find repo names (common patterns)
            repo_patterns = [
                r'([a-zA-Z0-9_-]+)-master',
                r'([a-zA-Z0-9_-]+)-main',
                r'repo:\s*([a-zA-Z0-9_-]+)',
                r'repository:\s*([a-zA-Z0-9_-]+)',
                r'github\.com/[^/]+/([a-zA-Z0-9_-]+)'
            ]
            
            for pattern in repo_patterns:
                matches = re.findall(pattern, content)
                extracted['repo_names'].extend(matches)
            
            # Find function types
            function_words = [
                'parser', 'generator', 'validator', 'extractor', 'scraper',
                'simulator', 'analyzer', 'converter', 'transformer', 'builder',
                'creator', 'manager', 'processor', 'handler', 'solver'
            ]
            
            for word in function_words:
                if word in content.lower():
                    extracted['functions'].append(word)
            
            # Find themes
            theme_words = [
                'game', 'narrative', 'dialogue', 'fantasy', 'scifi', 'education',
                'business', 'science', 'combat', 'magic', 'dungeon', 'quest',
                'rpg', 'adventure', 'puzzle', 'strategy'
            ]
            
            for word in theme_words:
                if word in content.lower():
                    extracted['themes'].append(word)
            
            # Find tools/languages
            tool_patterns = [
                r'python', r'javascript', r'typescript', r'prolog', r'java',
                r'tensorflow', r'pytorch', r'react', r'django', r'unity',
                r'scrapy', r'beautifulsoup', r'pandas', r'numpy'
            ]
            
            for pattern in tool_patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    extracted['tools'].append(pattern)
            
            # Find keyword lists
            keyword_sections = re.findall(r'[Kk]eywords?:([^#\n]*(?:\n(?![#\n])[^#\n]*)*)', content)
            for section in keyword_sections:
                keywords = re.split(r'[,;|\n-*]', section)
                extracted['keywords'].extend([k.strip() for k in keywords if k.strip()])
    
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    return extracted

def scrape_json_docs(file_path):
    """Extract from JSON files like package.json"""
    extracted = {
        'categories': [],
        'tags': [],
        'keywords': [],
        'repo_names': [],
        'functions': [],
        'themes': [],
        'tools': []
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            # Get keywords from package.json
            if 'keywords' in data:
                extracted['keywords'].extend(data['keywords'])
                extracted['tags'].extend(data['keywords'])
            
            # Get name
            if 'name' in data:
                extracted['repo_names'].append(data['name'])
            
            # Get categories if present
            if 'categories' in data:
                if isinstance(data['categories'], list):
                    extracted['categories'].extend(data['categories'])
                else:
                    extracted['categories'].append(data['categories'])
            
            # Get tags if present
            if 'tags' in data:
                if isinstance(data['tags'], list):
                    extracted['tags'].extend(data['tags'])
                else:
                    extracted['tags'].append(data['tags'])
    
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    return extracted

def scrape_text_file(file_path):
    """Extract from CATEGORIES.md or similar text files"""
    extracted = {
        'categories': [],
        'tags': [],
        'keywords': [],
        'repo_names': [],
        'functions': [],
        'themes': [],
        'tools': []
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Look for table rows (markdown tables)
            # Format: | category_name | keywords | description |
            table_rows = re.findall(r'\|([^|]+)\|([^|]+)\|([^|]+)\|', content)
            for row in table_rows:
                if len(row) >= 2:
                    category = row[0].strip()
                    keywords = row[1].strip()
                    
                    # Skip header rows
                    if 'category' in category.lower() or '---' in category:
                        continue
                    
                    extracted['categories'].append(category)
                    
                    # Extract keywords
                    kw_list = re.split(r'[,;]', keywords)
                    extracted['keywords'].extend([k.strip() for k in kw_list])
            
            # Look for bullet point lists
            bullet_items = re.findall(r'^[\*\-]\s+(.+)$', content, re.MULTILINE)
            for item in bullet_items:
                # Check if it's a category definition
                if ':' in item:
                    parts = item.split(':', 1)
                    extracted['categories'].append(parts[0].strip())
                    if len(parts) > 1:
                        keywords = re.split(r'[,;]', parts[1])
                        extracted['keywords'].extend([k.strip() for k in keywords])
    
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    return extracted

def scrape_all_docs(docs_path):
    """Scrape all documentation files"""
    all_extracted = {
        'categories': set(),
        'tags': set(),
        'keywords': set(),
        'repo_names': set(),
        'functions': set(),
        'themes': set(),
        'tools': set()
    }
    
    # Find all relevant files
    for root, dirs, files in os.walk(docs_path):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            file_path = os.path.join(root, file)
            extracted = None
            
            # Process different file types
            if file.endswith('.md'):
                print(f"Scraping markdown: {file}")
                extracted = scrape_markdown_docs(file_path)
            elif file.endswith('.json'):
                print(f"Scraping JSON: {file}")
                extracted = scrape_json_docs(file_path)
            elif file == 'CATEGORIES.txt' or file == 'CATEGORIES.md':
                print(f"Scraping categories file: {file}")
                extracted = scrape_text_file(file_path)
            elif file.endswith('.txt') and 'categor' in file.lower():
                print(f"Scraping text file: {file}")
                extracted = scrape_text_file(file_path)
            
            # Merge results
            if extracted:
                for key in all_extracted:
                    all_extracted[key].update(extracted[key])
    
    # Convert sets to sorted lists
    result = {}
    for key, values in all_extracted.items():
        result[key] = sorted(list(values))
    
    return result

def save_scraped_data(data, output_dir='.'):
    """Save all scraped data to files"""
    
    # Save as JSON
    with open(os.path.join(output_dir, 'scraped_categories.json'), 'w') as f:
        json.dump(data, f, indent=2)
    
    # Save categories to text file
    with open(os.path.join(output_dir, 'SCRAPED_CATEGORIES.txt'), 'w') as f:
        f.write("=== CATEGORIES FOUND IN DOCS ===\n\n")
        for cat in data['categories']:
            f.write(f"- {cat}\n")
        
        f.write(f"\n=== TAGS FOUND IN DOCS ===\n\n")
        for tag in data['tags']:
            f.write(f"- {tag}\n")
        
        f.write(f"\n=== KEYWORDS FOUND IN DOCS ===\n\n")
        for kw in data['keywords']:
            f.write(f"- {kw}\n")
        
        f.write(f"\n=== REPO NAMES FOUND ===\n\n")
        for name in data['repo_names']:
            f.write(f"- {name}\n")
        
        f.write(f"\n=== FUNCTIONS DETECTED ===\n\n")
        for func in data['functions']:
            f.write(f"- {func}\n")
        
        f.write(f"\n=== THEMES DETECTED ===\n\n")
        for theme in data['themes']:
            f.write(f"- {theme}\n")
        
        f.write(f"\n=== TOOLS DETECTED ===\n\n")
        for tool in data['tools']:
            f.write(f"- {tool}\n")
    
    # Create a mapping file for use in repo scanning
    mapping = {
        'category_keywords': {},
        'function_keywords': {},
        'theme_keywords': {},
        'tool_keywords': {}
    }
    
    # Build keyword mappings
    for cat in data['categories']:
        mapping['category_keywords'][cat] = []
        # Find keywords that might relate to this category
        for kw in data['keywords']:
            if cat.lower() in kw.lower() or kw.lower() in cat.lower():
                mapping['category_keywords'][cat].append(kw)
    
    with open(os.path.join(output_dir, 'category_mappings.json'), 'w') as f:
        json.dump(mapping, f, indent=2)
    
    print(f"\n=== SCRAPING COMPLETE ===")
    print(f"Found {len(data['categories'])} categories")
    print(f"Found {len(data['tags'])} tags")
    print(f"Found {len(data['keywords'])} keywords")
    print(f"Found {len(data['repo_names'])} repo names")
    print(f"\nSaved to:")
    print(f"  - scraped_categories.json")
    print(f"  - SCRAPED_CATEGORIES.txt")
    print(f"  - category_mappings.json")

def main(docs_path):
    """Main function"""
    print(f"Scraping documentation from: {docs_path}\n")
    
    scraped_data = scrape_all_docs(docs_path)
    save_scraped_data(scraped_data)

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python scrape_docs.py /path/to/docs")
        print("This will scrape all .md, .json, and category files")
        sys.exit(1)
    
    main(sys.argv[1])
