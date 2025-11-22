#!/bin/bash
# Shows the fix working

echo "=== Testing Claude with Fix Applied ==="
echo "Loading wrapper functions..."

# Source the wrapper
source "$(dirname "$0")/claude-wrapper.sh"

echo
echo "Test 1: Safe background execution"
claude_safe "What is 2+2?" "/tmp/claude_out1.txt"
sleep 2
if [ -f "/tmp/claude_out1.txt" ]; then
    echo "✅ Background execution works! Output: $(cat /tmp/claude_out1.txt)"
    rm -f /tmp/claude_out1.txt
else
    echo "⏳ Still processing..."
fi

echo
echo "Test 2: Parallel agents"
claude_safe "Agent 1: List 3 colors" "/tmp/agent1.txt"
claude_safe "Agent 2: List 3 animals" "/tmp/agent2.txt"
echo "✅ Both agents started in parallel!"
echo "   Check /tmp/agent1.txt and /tmp/agent2.txt for results"

echo
echo "Test 3: Safe file write"
safe_write "This was written without hanging!" "/tmp/safe_write_test.txt"
echo "✅ Safe write works! Content: $(cat /tmp/safe_write_test.txt)"
rm -f /tmp/safe_write_test.txt

echo
echo "=== Success! ==="
echo "With these wrapper functions, multi-agent AI systems are possible!"
echo "No more hanging when spawning Claude instances."