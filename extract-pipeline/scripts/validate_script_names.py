import re
import sys
  
VALID_PATTERN = re.compile(r'^(extract|process|tag)_[a-z_]+\.py$')
FORBIDDEN_PATTERNS = [
    re.compile(r'^block_\d+\.py$'),
    re.compile(r'^script_\d+\.py$')
]
  
def validate_script_name(name: str) -> tuple[bool, str]:
    """Validate script follows naming convention."""
      
    # Check forbidden patterns
    for pattern in FORBIDDEN_PATTERNS:
        if pattern.match(name):
            return False, f"Generic name '{name}' not allowed. Use descriptive name like 'extract_code_blocks.py'"
      
    # Check valid pattern
    if not VALID_PATTERN.match(name):
        return False, f"Script name '{name}' must match pattern: (extract|process|tag)_<description>.py"
      
    return True, "Valid"
