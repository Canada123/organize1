#!/usr/bin/env python3
"""
SCRAPE EXISTING REPO METADATA AND TAGS
From README files, package.json, and any existing tracking
"""

import os
import json
import re
from pathlib import Path

def extract_from_readme(readme_path):
    """Extract info from README files including REPO-TRACKER sections"""
    info = {
        'uuid': None,
        'categories': [],
        'tags': [],
        'description': None,
        'files_listed': [],
        'keywords': [],
        'repo_name': None
    }
    
    try:
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Extract from REPO-TRACKER section
            tracker_match = re.search(r'<!-- REPO-TRACKER-START -->(.+?)<!-- REPO-TRACKER-END -->', 
                                     content, re.DOTALL)
            if tracker_match:
                tracker_content = tracker_match.group(1)
                
                # Extract UUID
                uuid_match = re.search(r'UUID:\s*([a-f0-9-]+)', tracker_content)
                if uuid_match:
                    info['uuid'] = uuid_match.group(1)
                
                # Extract Categories
                cat_match = re.search(r'Categories:\s*([^\n]+)', tracker_content)
                if cat_match:
                    cats = cat_match.group(1).strip()
                    if cats and cats.lower() != 'none':
                        info['categories'] = [c.strip() for c in cats.split(',')]
                
                # Extract Tags
                tag_match = re.search(r'Tags:\s*([^\n]+)', tracker_content)
                if tag_match:
                    tags = tag_match.group(1).strip()
                    if tags and tags.lower() != 'none':
                        info['tags'] = [t.strip() for t in tags.split(',')]
            
            # Extract repo name from header
            name_match = re.search(r'^#\s+(.+?)$', content, re.MULTILINE)
            if name_match:
                info['repo_name'] = name_match.group(1).strip()
            
            # Extract description
            desc_match = re.search(r'## Description\s*\n([^#]+)', content)
            if desc_match:
                desc = desc_match.group(1).strip()
                if desc != '[Add description here]':
                    info['description'] = desc
            
            # Extract file list
            files_section = re.search(r'## Files.*?\n((?:[^\n]+\n)+)', content)
            if files_section:
                files_text = files_section.group(1)
                files = re.findall(r'^[-*]\s+(.+)$', files_text, re.MULTILINE)
                info['files_listed'] = files
            
            # Look for any keywords mentioned
            keyword_patterns = [
                r'[Kk]eywords?:\s*([^\n]+)',
                r'[Tt]ags?:\s*([^\n]+)',
                r'[Tt]opics?:\s*([^\n]+)'
            ]
            
            for pattern in keyword_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    keywords = re.split(r'[,;|]', match)
                    info['keywords'].extend([k.strip() for k in keywords])
    
    except Exception as e:
        print(f"Error reading {readme_path}: {e}")
    
    return info

def extract_from_package_json(json_path):
    """Extract from package.json files"""
    info = {
        'name': None,
        'keywords': [],
        'description': None,
        'version': None
    }
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            info['name'] = data.get('name')
            info['keywords'] = data.get('keywords', [])
            info['description'] = data.get('description')
            info['version'] = data.get('version')
    
    except Exception as e:
        print(f"Error reading {json_path}: {e}")
    
    return info

def extract_from_tag_file(tag_path):
    """Extract from .tag files if they exist"""
    info = {
        'categories': [],
        'languages': [],
        'type': None,
        'status': None,
        'keywords_matched': []
    }
    
    try:
        with open(tag_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Parse tag file format
            lines = content.split('\n')
            for line in lines:
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip().upper()
                    value = value.strip()
                    
                    if key == 'CATEGORIES':
                        info['categories'] = [c.strip() for c in value.split(',')]
                    elif key == 'LANGUAGES':
                        info['languages'] = [l.strip() for l in value.split(',')]
                    elif key == 'TYPE':
                        info['type'] = value
                    elif key == 'STATUS':
                        info['status'] = value
                    elif key == 'KEYWORDS_MATCHED':
                        info['keywords_matched'] = [k.strip() for k in value.split(',')]
    
    except Exception as e:
        print(f"Error reading {tag_path}: {e}")
    
    return info

def scan_repo_for_metadata(repo_path):
    """Scan a single repo for all existing metadata"""
    repo_name = os.path.basename(repo_path)
    
    combined_info = {
        'repo_name': repo_name,
        'repo_path': repo_path,
        'categories': set(),
        'tags': set(),
        'keywords': set(),
        'languages': set(),
        'description': None,
        'files': []
    }
    
    # Check for README
    for readme_name in ['README.md', 'readme.md', 'Readme.md']:
        readme_path = os.path.join(repo_path, readme_name)
        if os.path.exists(readme_path):
            readme_info = extract_from_readme(readme_path)
            combined_info['categories'].update(readme_info['categories'])
            combined_info['tags'].update(readme_info['tags'])
            combined_info['keywords'].update(readme_info['keywords'])
            if readme_info['description']:
                combined_info['description'] = readme_info['description']
            combined_info['files'].extend(readme_info['files_listed'])
            break
    
    # Check for package.json
    package_path = os.path.join(repo_path, 'package.json')
    if os.path.exists(package_path):
        package_info = extract_from_package_json(package_path)
        combined_info['keywords'].update(package_info['keywords'])
        if package_info['description'] and not combined_info['description']:
            combined_info['description'] = package_info['description']
    
    # Check for .tag file
    tag_path = os.path.join(repo_path, '.tag')
    if os.path.exists(tag_path):
        tag_info = extract_from_tag_file(tag_path)
        combined_info['categories'].update(tag_info['categories'])
        combined_info['languages'].update(tag_info['languages'])
        combined_info['keywords'].update(tag_info['keywords_matched'])
    
    # Convert sets to lists
    combined_info['categories'] = list(combined_info['categories'])
    combined_info['tags'] = list(combined_info['tags'])
    combined_info['keywords'] = list(combined_info['keywords'])
    combined_info['languages'] = list(combined_info['languages'])
    
    return combined_info

def scrape_all_repos(base_path):
    """Scrape metadata from all repos"""
    all_categories = set()
    all_tags = set()
    all_keywords = set()
    all_languages = set()
    repo_metadata = []
    
    repo_dirs = [d for d in Path(base_path).iterdir() 
                 if d.is_dir() and not d.name.startswith('.')]
    
    print(f"Scraping metadata from {len(repo_dirs)} repositories...\n")
    
    for i, repo_dir in enumerate(repo_dirs):
        print(f"[{i+1}/{len(repo_dirs)}] {repo_dir.name}")
        
        metadata = scan_repo_for_metadata(str(repo_dir))
        repo_metadata.append(metadata)
        
        # Collect all unique values
        all_categories.update(metadata['categories'])
        all_tags.update(metadata['tags'])
        all_keywords.update(metadata['keywords'])
        all_languages.update(metadata['languages'])
        
        # Show what we found
        if metadata['categories']:
            print(f"  Categories: {', '.join(metadata['categories'])}")
        if metadata['tags']:
            print(f"  Tags: {', '.join(metadata['tags'])}")
        if metadata['keywords']:
            print(f"  Keywords: {', '.join(metadata['keywords'][:5])}")
    
    return {
        'repos': repo_metadata,
        'all_categories': sorted(list(all_categories)),
        'all_tags': sorted(list(all_tags)),
        'all_keywords': sorted(list(all_keywords)),
        'all_languages': sorted(list(all_languages))
    }

def save_scraped_metadata(data):
    """Save all scraped metadata"""
    
    # Save full data as JSON
    with open('scraped_repo_metadata.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    # Save summary
    with open('SCRAPED_METADATA_SUMMARY.txt', 'w') as f:
        f.write("=== SCRAPED REPO METADATA SUMMARY ===\n\n")
        f.write(f"Total repos scanned: {len(data['repos'])}\n")
        f.write(f"Repos with categories: {len([r for r in data['repos'] if r['categories']])}\n")
        f.write(f"Repos with tags: {len([r for r in data['repos'] if r['tags']])}\n")
        f.write(f"Repos with keywords: {len([r for r in data['repos'] if r['keywords']])}\n")
        
        f.write(f"\n=== ALL CATEGORIES FOUND ({len(data['all_categories'])}) ===\n")
        for cat in data['all_categories']:
            count = len([r for r in data['repos'] if cat in r['categories']])
            f.write(f"  {cat}: {count} repos\n")
        
        f.write(f"\n=== ALL TAGS FOUND ({len(data['all_tags'])}) ===\n")
        for tag in data['all_tags']:
            count = len([r for r in data['repos'] if tag in r['tags']])
            f.write(f"  {tag}: {count} repos\n")
        
        f.write(f"\n=== TOP KEYWORDS ({min(50, len(data['all_keywords']))}) ===\n")
        keyword_counts = {}
        for kw in data['all_keywords']:
            count = len([r for r in data['repos'] if kw in r['keywords']])
            keyword_counts[kw] = count
        
        sorted_keywords = sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)
        for kw, count in sorted_keywords[:50]:
            f.write(f"  {kw}: {count} repos\n")
        
        f.write(f"\n=== LANGUAGES DETECTED ===\n")
        for lang in data['all_languages']:
            count = len([r for r in data['repos'] if lang in r['languages']])
            f.write(f"  {lang}: {count} repos\n")
    
    # Create a clean categories list
    with open('EXTRACTED_CATEGORIES.txt', 'w') as f:
        f.write("# CATEGORIES EXTRACTED FROM YOUR REPOS\n\n")
        for cat in data['all_categories']:
            f.write(f"{cat}\n")
    
    print(f"\n=== SCRAPING COMPLETE ===")
    print(f"Found {len(data['all_categories'])} unique categories")
    print(f"Found {len(data['all_tags'])} unique tags")
    print(f"Found {len(data['all_keywords'])} unique keywords")
    print(f"\nSaved to:")
    print(f"  - scraped_repo_metadata.json (full data)")
    print(f"  - SCRAPED_METADATA_SUMMARY.txt (summary)")
    print(f"  - EXTRACTED_CATEGORIES.txt (clean category list)")

def main(base_path):
    """Main function"""
    scraped_data = scrape_all_repos(base_path)
    save_scraped_metadata(scraped_data)

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python scrape_repo_metadata.py /path/to/repos")
        sys.exit(1)
    
    main(sys.argv[1])
