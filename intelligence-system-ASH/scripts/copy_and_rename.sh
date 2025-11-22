#!/bin/bash

# Simple copy and rename script for PROJECT_INDEX.json files
# Run this from any folder - it will copy FROM the current directory

DEST_DIR="/Users/ashleygeness/Desktop/datalakes_stage1"

echo "📁 Copying and renaming PROJECT_INDEX.json files..."
echo "Source: Current directory ($(pwd))"
echo "Destination: $DEST_DIR"

# Create destination directory
mkdir -p "$DEST_DIR"

# Check if current directory has any repos
if [ -z "$(ls -A)" ]; then
    echo "❌ Current directory is empty!"
    exit 1
fi

# Process each repo directory in the current location
for repo_dir in */; do
    if [ -d "$repo_dir" ]; then
        repo_name=$(basename "$repo_dir")
        echo "Processing repo: $repo_name"
        
        # Find all PROJECT_INDEX.json files in this repo (only in root, not subdirectories)
        files=("$repo_dir"PROJECT_INDEX.json*)
        
        # If no index files found, skip this repo
        if [ ${#files[@]} -eq 0 ] || [ ! -f "${files[0]}" ]; then
            echo "  ⚠️  No PROJECT_INDEX.json files found in $repo_name"
            continue
        fi
        
        echo "  Found ${#files[@]} index file(s) in $repo_name"
        
        # Process the files in this repo
        counter=1
        for file in "${files[@]}"; do
            if [ -f "$file" ]; then
                if [ $counter -eq 1 ]; then
                    new_name="${repo_name}project_index.json"
                else
                    new_name="${repo_name}$((counter-1))project_index.json"
                fi
                cp "$file" "$DEST_DIR/$new_name"
                echo "  ✅ Copied: $(basename "$file") -> $new_name"
                counter=$((counter + 1))
            fi
        done
    fi
done

echo "🎉 Done! All index files from all repos copied and renamed in: $DEST_DIR"
