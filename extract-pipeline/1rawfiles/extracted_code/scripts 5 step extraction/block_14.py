# Capture lists of related concepts without forcing hierarchy
PATTERN_CLUSTER_PATTERN = r'(?:(?:\*|\-|\d+\.)\s+([^\n]+)\n)+'
# Output: {"patterns": ["item1", "item2", "item3"], "cluster_type": "inferred"}