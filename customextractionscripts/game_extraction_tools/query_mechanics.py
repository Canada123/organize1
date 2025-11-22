#!/usr/bin/env python3
"""
Query extracted game mechanics
"""

import json
import sys

def load_mechanics(filepath='mechanics_extracted.json'):
    """Load extracted mechanics"""
    with open(filepath) as f:
        return json.load(f)

def query_actions(mechanics, search=None):
    """Query action modules"""
    modules = mechanics['action_system']['modules']
    
    if search:
        modules = [m for m in modules if search.lower() in m['action'].lower()]
    
    print(f"\nFound {len(modules)} action modules:")
    for m in modules:
        print(f"\n{m['name'].upper()}")
        print(f"  Action: {m['action']}")
        if m.get('properties'):
            print(f"  Properties: {', '.join(m['properties'][:3])}")
    
    return modules

def query_patterns(mechanics, category=None):
    """Query distributed patterns"""
    patterns = mechanics['distributed_infrastructure']['patterns']
    
    if category:
        patterns = [p for p in patterns if category.lower() in ' '.join(p['concepts']).lower()]
    
    print(f"\nFound {len(patterns)} distributed patterns:")
    for p in patterns:
        print(f"\n{p['name']}")
        print(f"  Repo: {p['repo']}")
        print(f"  Concepts: {', '.join(p['concepts'])}")
        print(f"  Use: {p['use_case']}")
    
    return patterns

def query_code(mechanics, language=None, category=None):
    """Query code examples"""
    code = mechanics['code_templates']
    
    if not category:
        print(f"\nCode categories available:")
        for cat, examples in code['by_category'].items():
            print(f"  {cat}: {len(examples)} examples")
        return
    
    if category not in code['by_category']:
        print(f"Category '{category}' not found")
        return
    
    examples = code['by_category'][category]
    
    if language:
        examples = [e for e in examples if e['language'] == language]
    
    print(f"\nFound {len(examples)} {category} examples:")
    for e in examples:
        print(f"\n  [{e['language']}] {e['purpose']}")
        print(f"  Lines: {e['lines']}")
    
    return examples

def show_chains(mechanics):
    """Show chain examples"""
    chains = mechanics['chain_mechanics']['example_chains']
    
    print(f"\nFound {len(chains)} chain examples:")
    for i, chain in enumerate(chains, 1):
        print(f"\nChain {i}:")
        for step in chain[:10]:
            print(f"  {step['step']}. {step['action']}")
        if len(chain) > 10:
            print(f"  ... and {len(chain)-10} more steps")

def interactive():
    """Interactive query mode"""
    mechanics = load_mechanics()
    
    print("="*60)
    print("MECHANICS QUERY TOOL")
    print("="*60)
    print(f"\nTotal action modules: {mechanics['action_system']['total_modules']}")
    print(f"Distributed patterns: {mechanics['distributed_infrastructure']['total_patterns']}")
    print(f"Code examples: {mechanics['code_templates']['total_examples']}")
    
    while True:
        print("\n" + "="*60)
        print("Commands:")
        print("  actions [search]     - List action modules")
        print("  patterns [category]  - List distributed patterns")
        print("  code [category]      - List code examples")
        print("  chains               - Show chain examples")
        print("  quit                 - Exit")
        
        cmd = input("\n> ").strip().lower()
        
        if cmd.startswith('quit') or cmd == 'q':
            break
        elif cmd.startswith('actions'):
            search = cmd.replace('actions', '').strip() or None
            query_actions(mechanics, search)
        elif cmd.startswith('patterns'):
            category = cmd.replace('patterns', '').strip() or None
            query_patterns(mechanics, category)
        elif cmd.startswith('code'):
            category = cmd.replace('code', '').strip() or None
            query_code(mechanics, category=category)
        elif cmd == 'chains':
            show_chains(mechanics)
        else:
            print("Unknown command")

def main():
    if len(sys.argv) > 1:
        # Command line mode
        mechanics = load_mechanics()
        cmd = sys.argv[1].lower()
        
        if cmd == 'actions':
            search = sys.argv[2] if len(sys.argv) > 2 else None
            query_actions(mechanics, search)
        elif cmd == 'patterns':
            category = sys.argv[2] if len(sys.argv) > 2 else None
            query_patterns(mechanics, category)
        elif cmd == 'code':
            category = sys.argv[2] if len(sys.argv) > 2 else None
            query_code(mechanics, category=category)
        elif cmd == 'chains':
            show_chains(mechanics)
    else:
        interactive()

if __name__ == "__main__":
    main()
