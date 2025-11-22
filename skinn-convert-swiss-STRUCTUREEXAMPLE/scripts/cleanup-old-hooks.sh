#!/bin/bash
# Cleanup script for old PROJECT_INDEX.json automation remnants
# Created: 2025-08-25

echo "🧹 Cleaning up old PROJECT_INDEX.json automation remnants..."

# Kill any Python processes related to old hooks
echo "Checking for lingering Python processes..."
pkill -f "claude-code-project-index" 2>/dev/null || echo "  No lingering processes found"

# Remove old cache directories if they exist
if [ -d "$HOME/.claude-code-project-index" ]; then
    echo "  Removing old cache directory..."
    rm -rf "$HOME/.claude-code-project-index"
fi

# Check Claude's internal hook registry (if accessible)
if [ -d "$HOME/.claude/hooks" ]; then
    echo "  Checking for old hook references..."
    grep -r "run_python.sh" "$HOME/.claude/hooks" 2>/dev/null && \
        echo "  ⚠️  Found references - you may need to restart Claude Code"
fi

# Clear any environment variables
unset CLAUDE_PROJECT_INDEX 2>/dev/null
unset CLAUDE_PROJECT_NAVIGATOR 2>/dev/null

echo "✅ Cleanup complete!"
echo ""
echo "If you still see errors after running this:"
echo "  1. Restart Claude Code completely"
echo "  2. The error should disappear on next session"
echo ""
echo "The error is harmless and won't affect your work."