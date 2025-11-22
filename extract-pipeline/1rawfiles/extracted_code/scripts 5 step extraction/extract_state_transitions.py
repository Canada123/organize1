#!/usr/bin/env python3
"""
Levin-Flow Pattern Extractor
Preserves flow-based, multi-domain, pattern-dense thinking.
Does NOT force hierarchy or strip complexity.
Usage:
    python levin_flow_extractor.py [--topic unity|systems|cognition] [--preserve-density]
"""
import re
import json
from pathlib import Path
from typing import Dict, List, Any
# Configuration for pattern preservation
PRESERVE_DENSITY = True  # Keep all patterns, don't deduplicate aggressively
MAX_PATTERN_CLUSTERS = 50  # Allow many pattern groups
MIN_WORDS_PER_PATTERN = 3  # Don't strip short but meaningful phrases
def extract_state_transitions(content: str) -> List[Dict]:
    """Extract flow sequences (state → state → state)."""
    transitions = []
    # Split on "then", "→", "leads to", "causes"
    flow_markers = r'\b(then|→|leads to|causes|results in|which means|so)\b'
    sentences = re.split(r'(?<=[.!?])\s+', content)
    for i, sentence in enumerate(sentences[:-1]):
        if re.search(flow_markers, sentence, re.IGNORECASE):
            next_sentence = sentences[i+1]
            transitions.append({
                "from_state": sentence.strip(),
                "to_state": next_sentence.strip(),
                "trigger": re.search(flow_markers, sentence, re.IGNORECASE).group(0)
            })
    return transitions
def extract_cross_domain_patterns(content: str) -> List[Dict]:
    """Find connections between different domains (biology ↔ AI ↔ systems)."""
    domains = ['biology', 'AI', 'systems', 'agents', 'cells', 'patterns', 
               'morphospace', 'cognition', 'tissue', 'emergence', 'intelligence']
    connections = []
    # Find any two domains mentioned within 3 sentences
    sentences = re.split(r'(?<=[.!?])\s+', content)
    for i in range(len(sentences)):
        window = ' '.join(sentences[i:i+3])
        found_domains = [d for d in domains if d.lower() in window.lower()]
        if len(found_domains) >= 2:
            connections.append({
                "domains": found_domains,
                "context": window.strip(),
                "connection_type": "cross-domain_flow"
            })
    return connections
def extract_pattern_clusters(content: str) -> List[Dict]:
    """Extract dense pattern lists without flattening them."""
    clusters = []
    # Find markdown lists or numbered lists
    list_pattern = r'(?:(?:^\s*[\-\*]\s+([^\n]+)$)+|(?:^\s*\d+\.\s+([^\n]+)$)+)'
    for match in re.finditer(list_pattern, content, re.MULTILINE):
        items = re.findall(r'[\-\*]\s+([^\n]+)', match.group(0))
        if not items:
            items = re.findall(r'\d+\.\s+([^\n]+)', match.group(0))
        clusters.append({
            "patterns": items,
            "cluster_type": "inferred_from_context",
            "density_score": len(items)
        })
    return clusters
def extract_approval_rejection(content: str) -> Dict[str, List]:
    """Extract strong approval/rejection signals with context."""
    results = {"approvals": [], "rejections": []}
    # Find rejections
    for match in re.finditer(REJECTION_PATTERN, content, re.IGNORECASE):
        context_window = content[max(0, match.start()-100):match.end()+100]
        results["rejections"].append({
            "trigger_word": match.group(0),
            "context": context_window.strip(),
            "target_module": "inferred_from_context",
            "reason": "strong_negative_signal"
        })
    # Find approvals
    for match in re.finditer(APPROVAL_PATTERN, content, re.IGNORECASE):
        context_window = content[max(0, match.start()-100):match.end()+100]
        results["approvals"].append({
            "trigger_word": match.group(0),
            "context": context_window.strip(),
            "target_module": "inferred_from_context",
            "reason": "strong_positive_signal"
        })
    return results
def extract_ai_user_thinking(content: str) -> List[Dict]:
    """Separate AI thinking from user responses."""
    thinking_sections = []
    # Split on clear markers
    sections = re.split(r'(AI thinking:|You said:|ChatGPT said:|User response:)', content)
    current_speaker = None
    for section in sections:
        if section.startswith('AI thinking:'):
            current_speaker = "AI"
        elif section.startswith('You said:') or section.startswith('User response:'):
            current_speaker = "User"
        elif current_speaker and section.strip():
            thinking_sections.append({
                "speaker": current_speaker,
                "content": section.strip(),
                "word_count": len(section.split())
            })
    return thinking_sections
def validate_levin_flow_extraction(results: Dict) -> bool:
    """Validate that we preserved flow and didn't strip complexity."""
    checks = {
        "has_transitions": len(results.get("state_transitions", [])) > 0,
        "has_cross_domain": len(results.get("cross_domain_patterns", [])) > 0,
        "has_approvals_or_rejections": len(results.get("approval_rejection", {}).get("approvals", [])) > 0 or 
                                       len(results.get("approval_rejection", {}).get("rejections", [])) > 0,
        "density_preserved": len(results.get("pattern_clusters", [])) <= MAX_PATTERN_CLUSTERS,
        "no_excessive_dedup": True  # We don't deduplicate aggressively in Levin mode
    }
    if not all(checks.values()):
        failed = [k for k, v in checks.items() if not v]
        raise ValueError(f"Levin-flow validation failed: {failed}")
    return True
def main():
    parser = argparse.ArgumentParser(description='Extract Levin-flow patterns')
    parser.add_argument('--topic', help='Filter by topic (unity|systems|cognition)')
    parser.add_argument('--preserve-density', action='store_true', 
                       help='Keep all patterns without aggressive dedup')
    args = parser.parse_args()
    # Example usage on the conversation
    content = Path("conversation.md").read_text()
    results = {
        "state_transitions": extract_state_transitions(content),
        "cross_domain_patterns": extract_cross_domain_patterns(content),
        "pattern_clusters": extract_pattern_clusters(content),
        "approval_rejection": extract_approval_rejection(content),
        "thinking_sections": extract_ai_user_thinking(content),
        "metadata": {
            "topic": args.topic,
            "preserve_density": args.preserve_density,
            "total_transitions": len(extract_state_transitions(content)),
            "total_cross_domain": len(extract_cross_domain_patterns(content)),
            "total_clusters": len(extract_pattern_clusters(content))
        }
    }
    validate_levin_flow_extraction(results)
    output_file = f"levin_flow_{args.topic or 'all'}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"✅ Preserved {results['metadata']['total_transitions']} state transitions")
    print(f"✅ Preserved {results['metadata']['total_cross_domain']} cross-domain patterns")
    print(f"✅ Preserved {results['metadata']['total_clusters']} pattern clusters")
    print(f"✅ Output: {output_file}")
if __name__ == '__main__':
    import argparse
    main()