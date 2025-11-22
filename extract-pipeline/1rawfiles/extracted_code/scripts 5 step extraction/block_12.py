# Tag any mention that connects domains (biology ↔ AI ↔ systems)
CROSS_DOMAIN_PATTERN = r'\b(biology|AI|systems?|agents?|cells?|patterns?|morphospace|cognition)\b.*?(?:and|or|→|leads to).*?\b(biology|AI|systems?|agents?|cells?|patterns?|morphospace|cognition)\b'
# Output: {"connection": ["biology", "AI"], "context": "full sentence"}