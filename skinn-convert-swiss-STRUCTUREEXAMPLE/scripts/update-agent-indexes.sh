#!/bin/bash
# Script to add Index Awareness section to all agent files
# Created: 2025-08-25
# Purpose: Update agent files with new v2.0 indexing system awareness

AGENT_DIR=".claude/agents"
UPDATED=0
SKIPPED=0

# Function to add index awareness section based on agent type
add_index_awareness() {
    local file=$1
    local agent_name=$(basename "$file" .md)
    
    # Skip if already has Index Awareness section
    if grep -q "## Project Index Awareness" "$file"; then
        echo "  ⏭️  Skipping $agent_name (already has Index Awareness)"
        ((SKIPPED++))
        return
    fi
    
    # Determine agent type and customize content
    case "$agent_name" in
        frontend-developer|design-system-architect)
            FOCUS="For frontend/UI work, focus on:
- Component structure in \`src/components/\` from PROJECT_INDEX.json
- UI asset inventory from VISUAL_ASSETS_INDEX.json
- Style and design token files from the code index"
            ;;
        backend-developer|database-supabase-agent)
            FOCUS="For backend work, focus on:
- API routes in \`src/api/\` from PROJECT_INDEX.json
- Database schemas in \`supabase/\` from the code index
- Service layer dependencies and relationships"
            ;;
        testing-qa-agent)
            FOCUS="For testing work, focus on:
- Test file locations in \`tests/\` from PROJECT_INDEX.json
- Component coverage from the code structure
- Visual regression assets from VISUAL_ASSETS_INDEX.json"
            ;;
        context-manager|documentation-maintainer)
            FOCUS="For context/documentation work, utilize:
- All 4 indexes for comprehensive project awareness
- High-level overview from context/project-index.md
- Detailed structure from PROJECT_INDEX.json
- Asset references from VISUAL_ASSETS_INDEX.json"
            ;;
        planning-task-agent|tree-of-thought-agent|brainstormer)
            FOCUS="For planning/analysis work, utilize:
- High-level overview from context/project-index.md
- Architectural structure from PROJECT_INDEX.json
- Clean tree view from context/project-tree.txt"
            ;;
        researcher|reflection-agent)
            FOCUS="For research/review work, utilize:
- Code patterns from PROJECT_INDEX.json
- Documentation structure from context/project-index.md
- Technology stack from dependency analysis"
            ;;
        *)
            FOCUS="Load indexes based on your specific domain:
- Code structure from PROJECT_INDEX.json
- Visual assets from VISUAL_ASSETS_INDEX.json
- High-level overview from context/project-index.md"
            ;;
    esac
    
    # Create the index awareness section
    INDEX_SECTION="

## Project Index Awareness (v2.0)

When analyzing the project, utilize the enhanced 4-index system:
- **PROJECT_INDEX.json** (~160KB): Code structure, functions, dependencies (no images)
- **VISUAL_ASSETS_INDEX.json** (~124KB): All images, videos, icons with metadata
- **context/project-tree.txt** (~36KB): Detailed directory tree without images
- **context/project-index.md**: High-level overview with depth-3 tree

$FOCUS"

    # Add section before the last line or at the end
    echo "  ✏️  Updating $agent_name..."
    
    # Create a temporary file
    TEMP_FILE=$(mktemp)
    
    # Add the content to temp file
    cat "$file" > "$TEMP_FILE"
    echo "$INDEX_SECTION" >> "$TEMP_FILE"
    
    # Replace the original file
    mv "$TEMP_FILE" "$file"
    
    ((UPDATED++))
    echo "  ✅ Updated $agent_name"
}

echo "🔄 Updating Agent Files with Index Awareness v2.0"
echo "================================================="
echo ""

# Process all agent files
for agent_file in "$AGENT_DIR"/*.md; do
    if [ -f "$agent_file" ]; then
        add_index_awareness "$agent_file"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Update Complete!"
echo "  Updated: $UPDATED files"
echo "  Skipped: $SKIPPED files (already had Index Awareness)"
echo ""
echo "All agents now aware of the v2.0 indexing system!"