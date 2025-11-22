#!/usr/bin/env python3
"""
discover_topics.py - Discover available topics in chat files.
Usage:
    python discover_topics.py                   # Show all topics found
    python discover_topics.py --min-mentions 3  # Topics with 3+ mentions
Output: topics_discovered.json (used by extractors for --topic filtering)
"""
import json
import re
from pathlib import Path
# Topic definitions
TOPIC_KEYWORDS = {
    'unity': ['unity', 'hierarchy', 'patterns', 'utils'],
    'validation': ['validation', 'checker', 'gate', 'pre_check', 'post_check'],
    'path_lists': ['path', 'file', 'directory', 'manager'],
    'architecture': ['extension', 'system', 'progressive', 'disclosure'],
    'workflows': ['pattern', 'dump', 'transfer', 'endpoint']
}
def discover_topics(chat_files_dir):
    """Scan files and count topic mentions."""
    input_dir = Path(chat_files_dir)
    chat_files = list(input_dir.glob("*.md")) + list(input_dir.glob("*.txt"))
    topic_counts = {topic: 0 for topic in TOPIC_KEYWORDS}
    topic_examples = {topic: [] for topic in TOPIC_KEYWORDS}
    for chat_file in chat_files:
        content = chat_file.read_text(encoding='utf-8', errors='ignore')
        for topic, keywords in TOPIC_KEYWORDS.items():
            matches = 0
            for keyword in keywords:
                found = re.findall(r'\b' + re.escape(keyword) + r'\b', content, re.IGNORECASE)
                matches += len(found)
            if matches > 0:
                topic_counts[topic] += matches
                if len(topic_examples[topic]) < 3:
                    topic_examples[topic].append(f"{chat_file.name} ({matches} mentions)")
    # Filter topics with actual mentions
    discovered = {
        topic: {
            "total_mentions": count,
            "example_files": topic_examples[topic]
        }
        for topic, count in topic_counts.items() 
        if count > 0
    }
    return discovered
if __name__ == '__main__':
    discovered = discover_topics("/Users/ashleygeness/Desktop/capture_evidence/chatfiles_raw")
    # Save discovery results
    output_file = Path("config/topics_discovered.json")
    output_file.parent.mkdir(exist_ok=True)
    json.dump(discovered, output_file.open('w'), indent=2)
    print("✅ Discovered topics:")
    print("=" * 40)
    for topic, data in discovered.items():
        print(f"{topic:15} {data['total_mentions']:3} mentions")
        for example in data['example_files'][:2]:
            print(f"                 → {example}")