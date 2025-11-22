# AI thinking sections
AI_THINKING_PATTERN = r'(?:AI thinking|Claude thought|(?:I|My) thinking):?\s*\n?(.+?)(?=User response|$)'
# User response sections  
USER_RESPONSE_PATTERN = r'(?:User response|You said):\s*\n?(.+?)(?=AI thinking|$)'
# Output: {"speaker": "AI", "content": "...", "timestamp": "inferred"}