# scripts/validate_conversation.py
def validate_conversation_markers(content):
    """Ensure conversation has proper markers for extraction"""
    required = ['Topic:', '#todo', 'DECISION:', 'INPUT PATH:']
    missing = [marker for marker in required if marker not in content]
    if missing:
        print(f"❌ Missing markers: {missing}")
        print("Run extraction anyway? (y/n)")
        return input().lower() == 'y'
    return True