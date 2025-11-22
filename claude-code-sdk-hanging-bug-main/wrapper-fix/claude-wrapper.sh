#!/bin/bash
# Minimal fix for Claude hanging issue using dd for I/O

# Safe write using dd (replaces > redirect)
safe_write() {
    local content="$1"
    local file="$2"
    printf "%s" "$content" | dd of="$file" status=none 2>/dev/null
}

# Safe Claude spawn that doesn't hang
claude_safe() {
    local prompt="$1"
    local output_file="$2"
    
    # Create detached wrapper script
    local wrapper=$(mktemp)
    cat > "$wrapper" << EOF
#!/bin/bash
exec < /dev/null
exec > "$output_file"
exec 2>&1
claude -p "$prompt"
EOF
    
    chmod +x "$wrapper"
    nohup bash "$wrapper" > /dev/null 2>&1 &
    local pid=$!
    rm -f "$wrapper"
    
    echo "Started Claude (PID $pid, output: $output_file)"
    return 0
}

# Export functions for use
export -f safe_write
export -f claude_safe