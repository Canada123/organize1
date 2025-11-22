# Detect "then does" sequences
TRANSITION_PATTERN = r'(?:then|→|→ |leads to|causes|results in)\s+([^.!?]+[.!?])'
# Extract as: {"from_state": "A", "to_state": "B", "trigger": "action"}