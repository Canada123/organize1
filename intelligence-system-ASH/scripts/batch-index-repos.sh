#!/bin/bash
# Fixed batch-index-repos.sh

REPOS_DIR="${1:-.}"
cd "$REPOS_DIR"

INDEX_SCRIPT="/Users/ashleygeness/Desktop/intelligence/intelligence-system-ASH/scripts/project_index.py"

for dir in */; do
    [ ! -d "$dir" ] && continue
    
    echo "=== Indexing: $dir ==="
    
    (
        cd "$dir"
        rm -f PROJECT_INDEX.json
        python3 "$INDEX_SCRIPT" .
        
        if [ -f PROJECT_INDEX.json ]; then
            echo "✅ Success"
        else
            echo "❌ Failed"
        fi
    )
    
    echo ""
done

echo "Done"
