#!/bin/bash
# Demonstrates the hanging bug (with timeouts for safety)

echo "=== Claude CLI Hanging Bug Test ==="
echo

# Test 1: Background process
echo "Test 1: Background process"
if timeout 5s bash -c 'claude -p "What is 2+2?" & wait $!' 2>/dev/null; then
    echo "✅ Background process worked"
else
    echo "❌ Background process hung/failed"
fi
echo

# Test 2: Parallel execution (most likely to fail)
echo "Test 2: Parallel agents"
if timeout 10s bash -c 'claude -p "Agent 1" & p1=$!; claude -p "Agent 2" & p2=$!; wait $p1 $p2' 2>/dev/null; then
    echo "✅ Parallel execution worked"
else
    echo "❌ Parallel execution hung"
fi
echo

# Test 3: Output redirection
echo "Test 3: Output redirection"
if timeout 5s bash -c 'claude -p "What is 3+3?" > /tmp/test_output.txt' 2>/dev/null; then
    echo "✅ Output redirection worked"
    rm -f /tmp/test_output.txt
else
    echo "❌ Output redirection hung"
fi
echo

# Test 4: Subshell capture
echo "Test 4: Subshell capture"
if timeout 5s bash -c 'result=$(claude -p "What is 4+4?"); echo "$result"' 2>/dev/null; then
    echo "✅ Subshell capture worked"
else
    echo "❌ Subshell capture hung"
fi

echo
echo "=== Results ==="
echo "If you see failures above, that's the bug preventing multi-agent AI!"
echo "See wrapper-fix/ for the solution."