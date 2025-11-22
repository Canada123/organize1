# User rejections (strong negative)
REJECTION_PATTERN = r'\b(nooo?|no\b|wrong|not that|reject|hate|stupid|slop)\b.*?(?=\n|$)'
# User approvals (strong positive)  
APPROVAL_PATTERN = r'\b(yes|love|perfect|exactly|right|approve|yesss|THIS)\b.*?(?=\n|$)'
# Output: {"type": "rejection", "target_module": "inferred", "reason": "context sentence"}