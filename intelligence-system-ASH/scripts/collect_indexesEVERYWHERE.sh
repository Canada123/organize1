#!/bin/bash
OUTPUT_DIR="./_PROJECT_INDEXES"
mkdir -p "$OUTPUT_DIR"

echo "Searching for PROJECT_INDEX.json files..."
echo ""

find ~ -name "PROJECT_INDEX.json" -type f 2>/dev/null | while read file; do
  reponame=$(basename "$(dirname "$file")")
  cp "$file" "$OUTPUT_DIR/${reponame}_INDEX.json"
  echo "Copied: ${reponame}_INDEX.json"
done

echo ""
echo "ALL DONE - Files at: $OUTPUT_DIR"
open "$OUTPUT_DIR"
