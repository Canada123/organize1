#!/usr/bin/env python3
"""  
discover_categories.py  
  
Analyzes all PROJECT_INDEX.json files and uses AI to discover meaningful categories.  
Focuses on semantic purpose (what the code does) rather than implementation language.  
"""
  
import json
import sys
from pathlib import Path
from collections import defaultdict, Counter
from typing import Dict, List, Set, Tuple
  
def load_all_indexes(staging_dir: Path) -> Dict[str, Dict]:
    """Load all PROJECT_INDEX.json files from staging directory."""
    indexes = {}
      
    for index_file in staging_dir.glob('*_PROJECT_INDEX.json'):
        repo_name = index_file.stem.replace('_PROJECT_INDEX', '')
        try:
            with open(index_file, 'r') as f:
                indexes[repo_name] = json.load(f)
        except Exception as e:
            print(f"⚠️  Failed to load {index_file.name}: {e}")
      
    return indexes
  
def extract_semantic_signals(repo_name: str, index: Dict) -> Dict[str, any]:
    """Extract semantic signals from index for category inference."""
    signals = {
        'repo_name': repo_name,
        'function_names': set(),
        'class_names': set(),
        'file_types': Counter(),
        'imports': set(),
        'total_files': 0,
        'languages': Counter(),
        'directory_purposes': set(),
        'has_tests': False,
        'has_docs': False,
        'complexity_score': 0
    }
      
    # Extract from compressed format ('f' key)
    files = index.get('f', {})
    signals['total_files'] = len(files)
      
    for file_path, file_info in files.items():
        # Language detection
        if isinstance(file_info, list) and len(file_info) > 0:
            lang = file_info[0]
            signals['languages'][lang] += 1
          
        # File type
        ext = Path(file_path).suffix
        signals['file_types'][ext] += 1
          
        # Symbols (functions, classes)
        if isinstance(file_info, list) and len(file_info) > 1:
            symbols = file_info[1] if isinstance(file_info[1], list) else []
            for symbol in symbols:
                symbol_name = symbol.split(':')[0]
                signals['function_names'].add(symbol_name)
                  
                # Detect classes (usually have uppercase first letter)
                if symbol_name and symbol_name[0].isupper():
                    signals['class_names'].add(symbol_name)
          
        # Test detection
        if any(test_marker in file_path.lower() for test_marker in ['test', 'spec', '__tests__']):
            signals['has_tests'] = True
          
        # Documentation detection
        if file_path.endswith(('.md', '.rst', '.txt')):
            signals['has_docs'] = True
      
    # Extract dependencies
    deps = index.get('deps', {})
    for file_path, modules in deps.items():
        if isinstance(modules, list):
            signals['imports'].update(modules)
      
    # Extract directory purposes
    dir_purposes = index.get('directory_purposes', {})
    signals['directory_purposes'] = set(dir_purposes.values())
      
    # Complexity score (rough estimate)
    signals['complexity_score'] = len(signals['function_names']) + len(signals['class_names'])
      
    return signals
  
def infer_category_from_signals(signals: Dict) -> Tuple[str, float, str]:
    """  
    Infer category from semantic signals.  
    Returns: (category, confidence, reasoning)  
    """
    repo_name = signals['repo_name'].lower()
    function_names = {fn.lower() for fn in signals['function_names']}
    class_names = {cn.lower() for cn in signals['class_names']}
    imports = {imp.lower() for imp in signals['imports']}
      
    # Category detection patterns
    categories = []
      
    # Language Tools Detection
    language_tool_signals = [
        any(kw in repo_name for kw in ['nlp', 'language', 'text', 'parse', 'tokenize', 'translate']),
        any(kw in function_names for kw in ['parse', 'tokenize', 'translate', 'analyze_text', 'process_text']),
        any(kw in imports for kw in ['nltk', 'spacy', 'transformers', 'langchain'])
    ]
    if sum(language_tool_signals) >= 2:
        categories.append(('language-tools', 0.8, 'NLP/text processing patterns detected'))
      
    # Story Generation Tools Detection
    story_gen_signals = [
        any(kw in repo_name for kw in ['story', 'narrative', 'plot', 'character', 'dialogue']),
        any(kw in function_names for kw in ['generate_story', 'create_narrative', 'generate_dialogue', 'build_plot']),
        any(kw in class_names for kw in ['storygenerat', 'narrativeengin', 'plotstructur', 'charactergenerat'])
    ]
    if sum(story_gen_signals) >= 2:
        categories.append(('story-generation', 0.85, 'Story/narrative generation patterns detected'))
      
    # Code Conversion/Transformation Tools Detection
    conversion_signals = [
        any(kw in repo_name for kw in ['convert', 'transform', 'transpile', 'compile', 'translate']),
        any(kw in function_names for kw in ['convert', 'transform', 'transpile', 'parse_ast', 'generate_code']),
        any(kw in imports for kw in ['ast', 'babel', 'typescript', 'esprima'])
    ]
    if sum(conversion_signals) >= 2:
        categories.append(('code-conversion', 0.8, 'Code transformation/conversion patterns detected'))
      
    # Validation/Testing Tools Detection
    validation_signals = [
        any(kw in repo_name for kw in ['validate', 'verify', 'check', 'lint', 'test']),
        any(kw in function_names for kw in ['validate', 'verify', 'check', 'lint', 'test']),
        signals['has_tests'],
        any(kw in imports for kw in ['pytest', 'jest', 'mocha', 'validator'])
    ]
    if sum(validation_signals) >= 2:
        categories.append(('validation-tools', 0.75, 'Validation/testing patterns detected'))
      
    # Requirements/Specification Tools Detection
    requirements_signals = [
        any(kw in repo_name for kw in ['requirement', 'spec', 'specification', 'plan']),
        any(kw in function_names for kw in ['generate_requirements', 'create_spec', 'parse_requirements']),
        signals['has_docs'] and signals['total_files'] < 50
    ]
    if sum(requirements_signals) >= 2:
        categories.append(('requirements-tools', 0.7, 'Requirements/specification patterns detected'))
      
    # Ontology/Knowledge Representation Detection
    ontology_signals = [
        any(kw in repo_name for kw in ['ontology', 'rdf', 'owl', 'n3', 'knowledge']),
        '.n3' in signals['file_types'] or '.owl' in signals['file_types'] or '.rdf' in signals['file_types'],
        any(kw in function_names for kw in ['parse_ontology', 'extract_triples', 'reason'])
    ]
    if sum(ontology_signals) >= 2:
        categories.append(('ontology-knowledge', 0.9, 'Ontology/RDF patterns detected'))
      
    # Game Mechanics Detection
    game_signals = [
        any(kw in repo_name for kw in ['game', 'faction', 'dialogue', 'character', 'rpg', 'ttrpg']),
        any(kw in function_names for kw in ['faction', 'dialogue', 'character', 'combat', 'inventory']),
        any(kw in class_names for kw in ['faction', 'character', 'dialogue', 'gamemanager'])
    ]
    if sum(game_signals) >= 2:
        categories.append(('game-mechanics', 0.8, 'Game mechanics patterns detected'))
      
    # Unity Project Detection
    unity_signals = [
        '.unity' in signals['file_types'] or '.prefab' in signals['file_types'],
        any(kw in repo_name for kw in ['unity', 'unreal', 'godot']),
        any(kw in imports for kw in ['unityengine', 'unity'])
    ]
    if sum(unity_signals) >= 1:
        categories.append(('unity-projects', 0.95, 'Unity/game engine patterns detected'))
      
    # Intelligence/AI System Detection
    intelligence_signals = [
        any(kw in repo_name for kw in ['agent', 'ai', 'ml', 'intelligence', 'reasoning', 'orchestrat']),
        any(kw in class_names for kw in ['agent', 'orchestrator', 'reasoningengine', 'modelpool']),
        signals['complexity_score'] > 100,
        any(kw in imports for kw in ['openai', 'anthropic', 'langchain', 'transformers'])
    ]
    if sum(intelligence_signals) >= 2:
        categories.append(('intelligence-systems', 0.75, 'AI/ML orchestration patterns detected'))
      
    # Documentation/Planning Detection
    doc_signals = [
        signals['has_docs'] and signals['total_files'] < 20,
        any(kw in repo_name for kw in ['doc', 'plan', 'spec', 'guide']),
        signals['file_types']['.md'] > signals['total_files'] * 0.5
    ]
    if sum(doc_signals) >= 2:
        categories.append(('documentation-planning', 0.6, 'Documentation/planning patterns detected'))
      
    # Generic Utility Detection (fallback)
    if not categories:
        categories.append(('utilities', 0.3, 'No specific patterns detected - generic utility'))
      
    # Return highest confidence category
    categories.sort(key=lambda x: x[1], reverse=True)
    return categories[0]
  
def discover_categories(staging_dir: Path) -> Dict[str, List[Dict]]:
    """Discover categories for all repos."""
    print("🔍 Loading indexes...")
    indexes = load_all_indexes(staging_dir)
    print(f"   Found {len(indexes)} indexes\n")
      
    print("🧠 Analyzing semantic patterns...")
    categorized = defaultdict(list)
      
    for repo_name, index in indexes.items():
        signals = extract_semantic_signals(repo_name, index)
        category, confidence, reasoning = infer_category_from_signals(signals)
          
        categorized[category].append({
            'repo_name': repo_name,
            'confidence': confidence,
            'reasoning': reasoning,
            'total_files': signals['total_files'],
            'languages': dict(signals['languages'].most_common(3)),
            'complexity': signals['complexity_score']
        })
          
        print(f"   {repo_name:50s} → {category:25s} ({confidence:.0%})")
      
    return dict(categorized)
  
def print_category_summary(categorized: Dict[str, List[Dict]]):
    """Print summary of discovered categories."""
    print("\n" + "="*80)
    print("📊 DISCOVERED CATEGORIES")
    print("="*80 + "\n")
      
    # Sort categories by repo count
    sorted_categories = sorted(categorized.items(), key=lambda x: len(x[1]), reverse=True)
      
    for category, repos in sorted_categories:
        print(f"## {category.upper().replace('-', ' ')}")
        print(f"   Repos: {len(repos)}")
        print(f"   Average confidence: {sum(r['confidence'] for r in repos) / len(repos):.0%}")
        print(f"   Total files: {sum(r['total_files'] for r in repos)}")
        print()
          
        # Show top 5 repos in this category
        repos_sorted = sorted(repos, key=lambda x: x['confidence'], reverse=True)
        for repo in repos_sorted[:5]:
            print(f"   • {repo['repo_name']}")
            print(f"     - Confidence: {repo['confidence']:.0%}")
            print(f"     - Reasoning: {repo['reasoning']}")
            print(f"     - Files: {repo['total_files']}, Languages: {repo['languages']}")
          
        if len(repos) > 5:
            print(f"   ... and {len(repos) - 5} more repos")
        print()
  
def save_categorization(categorized: Dict[str, List[Dict]], output_file: Path):
    """Save categorization results to JSON."""
    with open(output_file, 'w') as f:
        json.dump(categorized, f, indent=2)
    print(f"💾 Saved categorization to: {output_file}")
  
def main():
    if len(sys.argv) < 2:
        print("Usage: python discover_categories.py <staging_dir>")
        print("Example: python discover_categories.py /Users/ashleygeness/Desktop/datalakes_stage1")
        sys.exit(1)
      
    staging_dir = Path(sys.argv[1])
      
    if not staging_dir.exists():
        print(f"❌ Error: Directory not found: {staging_dir}")
        sys.exit(1)
      
    # Discover categories
    categorized = discover_categories(staging_dir)
      
    # Print summary
    print_category_summary(categorized)
      
    # Save results
    output_file = staging_dir / 'discovered_categories.json'
    save_categorization(categorized, output_file)
      
    print("\n✨ Category discovery complete!")
    print(f"\nNext steps:")
    print(f"1. Review discovered_categories.json")
    print(f"2. Adjust categories if needed")
    print(f"3. Run organization script to move repos into category folders")
  
if __name__ == '__main__':
    main()
