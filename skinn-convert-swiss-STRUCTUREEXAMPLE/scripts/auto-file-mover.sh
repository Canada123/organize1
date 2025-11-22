#!/bin/bash
# Auto File Mover
# PURPOSE: Automatically move misplaced files to correct locations
# VERSION: 1.0
# CREATED: 2025-08-24

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DRY_RUN=false
MOVED_COUNT=0
LOG_FILE="file-moves.log"

# Parse arguments
if [ "$1" = "--dry-run" ]; then
  DRY_RUN=true
  echo "${YELLOW}🔍 DRY RUN MODE - No files will be moved${NC}"
fi

echo "🤖 Auto File Mover v1.0"
echo "======================="
echo ""

# Function to move file with logging
move_file() {
  local source=$1
  local dest_dir=$2
  local description=$3
  
  # Create destination directory if it doesn't exist
  if [ "$DRY_RUN" = false ]; then
    mkdir -p "$dest_dir"
  fi
  
  if [ -f "$source" ]; then
    echo "  ${BLUE}→${NC} Moving $source to $dest_dir"
    if [ "$DRY_RUN" = false ]; then
      mv "$source" "$dest_dir/"
      echo "[$(date)] Moved $source to $dest_dir - $description" >> "$LOG_FILE"
      MOVED_COUNT=$((MOVED_COUNT + 1))
    fi
  fi
}

# Move images
echo "📷 Processing images..."
for ext in jpg jpeg png gif webp svg; do
  for file in *.$ext 2>/dev/null; do
    if [ -f "$file" ]; then
      move_file "$file" "public/assets/images" "Image file"
    fi
  done
done

# Move SQL files
echo "🗃️ Processing SQL files..."
for file in *.sql 2>/dev/null; do
  if [ -f "$file" ]; then
    if [[ "$file" == *"migration"* ]]; then
      move_file "$file" "supabase/migrations" "Migration SQL"
    else
      move_file "$file" "supabase/schemas" "Schema SQL"
    fi
  fi
done

# Move test files
echo "🧪 Processing test files..."
for pattern in "*test*.js" "*test*.ts" "*spec*.js" "*spec*.ts"; do
  for file in $pattern 2>/dev/null; do
    if [ -f "$file" ] && [ "$file" != "vitest.config.ts" ]; then
      if [[ "$file" == *.js ]]; then
        move_file "$file" "scripts/tests" "JavaScript test"
      else
        move_file "$file" "tests" "TypeScript test"
      fi
    fi
  done
done

# Move Python scripts
echo "🐍 Processing Python scripts..."
for file in *.py 2>/dev/null; do
  if [ -f "$file" ]; then
    move_file "$file" "scripts" "Python script"
  fi
done

# Move report files
echo "📊 Processing reports..."
for file in *REPORT*.md *Report*.md *report*.md 2>/dev/null; do
  if [ -f "$file" ]; then
    move_file "$file" "docs/reports" "Report document"
  fi
done

# Move specification files
echo "📋 Processing specifications..."
for file in *SPEC*.md *Spec*.md *spec*.md *SPEC*.json *spec*.json 2>/dev/null; do
  if [ -f "$file" ] && [ "$file" != "vitest.config.ts" ]; then
    move_file "$file" "docs/specs" "Specification document"
  fi
done

# Move test result JSON files
echo "📈 Processing test results..."
for file in *test*.json 2>/dev/null; do
  if [ -f "$file" ] && [[ "$file" != "package"* ]] && [[ "$file" != "tsconfig"* ]]; then
    move_file "$file" "docs/reports" "Test result"
  fi
done

# Move misplaced markdown files (excluding allowed root files)
echo "📝 Processing other documentation..."
ALLOWED_MD="README.md CLAUDE.md WORKFLOWS.md RELEASE_NOTES.md"
for file in *.md; do
  if [ -f "$file" ]; then
    is_allowed=false
    for allowed in $ALLOWED_MD; do
      if [ "$file" = "$allowed" ]; then
        is_allowed=true
        break
      fi
    done
    
    if [ "$is_allowed" = false ]; then
      # Skip if already processed as report or spec
      if [[ "$file" != *"REPORT"* ]] && [[ "$file" != *"Report"* ]] && 
         [[ "$file" != *"SPEC"* ]] && [[ "$file" != *"Spec"* ]]; then
        move_file "$file" "docs" "Documentation"
      fi
    fi
  fi
done

# Archive old project-tree.txt if it exists
if [ -f "project-tree.txt" ]; then
  echo "📦 Archiving old project-tree.txt..."
  ARCHIVE_DIR="archive/$(date +%Y-%m-%d)"
  move_file "project-tree.txt" "$ARCHIVE_DIR" "Obsolete project tree"
fi

# Clean up deprecated directories
if [ -d "working_files" ]; then
  echo "🗑️ Removing deprecated working_files directory..."
  if [ "$DRY_RUN" = false ]; then
    echo "${YELLOW}  Moving contents to /context/${NC}"
    for file in working_files/*; do
      if [ -f "$file" ]; then
        basename=$(basename "$file")
        if [ ! -f "context/$basename" ]; then
          mv "$file" "context/"
          echo "  Moved $basename to context/"
        else
          echo "  ${YELLOW}Skipped $basename (already exists in context/)${NC}"
        fi
      fi
    done
    rmdir working_files 2>/dev/null
  fi
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$DRY_RUN" = true ]; then
  echo "${YELLOW}DRY RUN COMPLETE${NC}"
  echo "Files that would be moved: Check output above"
  echo ""
  echo "To actually move files, run without --dry-run:"
  echo "  ${BLUE}./scripts/auto-file-mover.sh${NC}"
else
  echo "${GREEN}✅ File organization complete!${NC}"
  echo ""
  echo "Files moved: $MOVED_COUNT"
  if [ "$MOVED_COUNT" -gt 0 ]; then
    echo "Move log: $LOG_FILE"
    echo ""
    echo "${YELLOW}⚠️  Remember to:${NC}"
    echo "  1. Update imports/references if needed"
    echo "  2. Run tests to ensure nothing broke"
    echo "  3. Commit these changes"
    echo "  4. Update indexes: ${BLUE}./scripts/generate-indexes.sh${NC}"
  fi
fi

# Final check
echo ""
echo "Running quick scan..."
./scripts/file-organization-scanner.sh 2>/dev/null | tail -5

exit 0