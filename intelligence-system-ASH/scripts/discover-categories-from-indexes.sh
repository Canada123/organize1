#!/bin/bash
# discover-categories-from-indexes.sh
# Purpose: Query all indexed repos to discover categories and merge candidates
  
REPOS_DIR="${1:-.}"
OUTPUT_DIR="${2:-./category-analysis}"
  
mkdir -p "$OUTPUT_DIR"
  
echo "🔍 Discovering categories from indexed repos..."
echo "Repos directory: $REPOS_DIR"
echo "Output directory: $OUTPUT_DIR"
echo ""
  
# Find all repos with PROJECT_INDEX.json
repos_with_indexes=()
for repo_dir in "$REPOS_DIR"/*/; do
    if [[ -f "$repo_dir/PROJECT_INDEX.json" ]]; then
        repos_with_indexes+=("$repo_dir")
    fi
done
  
echo "Found ${#repos_with_indexes[@]} indexed repos"
echo ""
  
# Query each repo for categorization signals
for repo_dir in "${repos_with_indexes[@]}"; do
    repo_name=$(basename "$repo_dir")
    echo "=== Analyzing: $repo_name ==="
      
    cd "$repo_dir"
      
    # Search for categorization/classification tools
    project-intel.mjs --search "classify|categorize|organize|cluster" --json > "$OUTPUT_DIR/${repo_name}_categorization.json" 2>/dev/null
      
    # Get function metrics (most-called = most important)
    project-intel.mjs --metrics --json > "$OUTPUT_DIR/${repo_name}_metrics.json" 2>/dev/null
      
    # Search for ML/data science tools
    project-intel.mjs --search "kmeans|dbscan|pca|tsne|lda" --json > "$OUTPUT_DIR/${repo_name}_ml_tools.json" 2>/dev/null
      
    # Get overview stats
    project-intel.mjs --overview --json > "$OUTPUT_DIR/${repo_name}_overview.json" 2>/dev/null
      
    cd - > /dev/null
done
  
echo ""
echo "✅ Analysis complete. Results in: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Review *_categorization.json files to see which repos have classification tools"
echo "2. Review *_metrics.json to see function complexity and centrality"
echo "3. Compare *_overview.json to find repos with similar structure"
