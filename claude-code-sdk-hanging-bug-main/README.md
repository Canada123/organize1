# Claude CLI Hanging Bug - Blocks Multi-Agent AI

Claude CLI hangs when running multiple instances in parallel. This prevents building multi-agent AI systems.

## See The Bug (1 minute)

```bash
# Clone and test:
git clone https://github.com/ericbuess/claude-code-sdk-hanging-bug
cd claude-code-sdk-hanging-bug
./test-hanging.sh
```

You'll see:
- ❌ **Parallel execution hung** (the critical bug!)
- ✅ Single operations work fine

## See The Fix Working

```bash
# Run the fix demo:
./wrapper-fix/test-working.sh
```

All operations now work! ✅

## The Problem

When you try to run multiple Claude agents:
```bash
claude -p "Agent 1" & claude -p "Agent 2" &  # This hangs!
```

## The Solution

We use `dd` for I/O operations to bypass the shell mechanisms causing the hang. See `wrapper-fix/claude-wrapper.sh` for implementation.

## Why This Matters

Without fixing this, we cannot build:
- Parallel AI agents
- Multi-agent teams  
- Self-organizing systems

Example use case:
```bash
# What we want to build:
claude -p "Research agent: Find best practices" &
claude -p "Code agent: Implement solution" &
claude -p "Test agent: Validate the code" &
# All agents work together = powerful AI team
```

**This one bug blocks the entire future of multi-agent AI.**

## Technical Note

The issue appears to be file descriptor inheritance when spawning parallel processes. This behavior is undocumented and particularly affects Claude when it tries to spawn other Claude instances (recursive multi-agent systems).

**Important**: While some operations work when humans run them, they often fail when Claude attempts the same operations, making automated multi-agent systems unreliable.

## Request for Anthropic

Please fix parallel process spawning in Claude CLI to enable multi-agent AI systems. The wrapper demonstrates that proper process isolation solves the issue.