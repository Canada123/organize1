#!/bin/bash
# File Organization Scanner
# PURPOSE: Detect misplaced files and report violations
# VERSION: 1.0
# CREATED: 2025-08-24

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
REPORT_FILE="file-organization-report.txt"
MAX_ROOT_FILES=35

echo "🔍 File Organization Scanner v1.0"
echo "================================"
echo ""

# Initialize counters
TOTAL_VIOLATIONS=0
VIOLATIONS_DETAIL=""

# Function to add violation
add_violation() {
  local file=$1
  local correct_location=$2
  TOTAL_VIOLATIONS=$((TOTAL_VIOLATIONS + 1))
  VIOLATIONS_DETAIL="${VIOLATIONS_DETAIL}
  ${file} → ${correct_location}"
}

# Check for images in root
echo "Checking for misplaced images..."
for ext in jpg jpeg png gif webp svg; do
  for file in *.$ext; do
    if [ -f "$file" ]; then
      add_violation "$file" "/public/assets/images/"
      echo "  ${RED}✗${NC} Found image: $file"
    fi
  done
done

# Check for SQL files in root
echo "Checking for misplaced SQL files..."
for file in *.sql; do
  if [ -f "$file" ]; then
    add_violation "$file" "/supabase/migrations/ or /supabase/schemas/"
    echo "  ${RED}✗${NC} Found SQL: $file"
  fi
done

# Check for test files in root
echo "Checking for misplaced test files..."
for file in *test*.js *test*.ts *spec*.js *spec*.ts; do
  if [ -f "$file" ] && [ "$file" != "vitest.config.ts" ]; then
    add_violation "$file" "/tests/ or /scripts/tests/"
    echo "  ${RED}✗${NC} Found test: $file"
  fi
done

# Check for report/spec files in root
echo "Checking for misplaced documentation..."
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
      if [[ "$file" == *"REPORT"* ]] || [[ "$file" == *"Report"* ]]; then
        add_violation "$file" "/docs/reports/"
        echo "  ${RED}✗${NC} Found report: $file"
      elif [[ "$file" == *"SPEC"* ]] || [[ "$file" == *"Spec"* ]]; then
        add_violation "$file" "/docs/specs/"
        echo "  ${RED}✗${NC} Found spec: $file"
      else
        add_violation "$file" "/docs/ or /context/"
        echo "  ${YELLOW}⚠${NC} Found documentation: $file"
      fi
    fi
  fi
done

# Check for Python scripts in root
echo "Checking for misplaced Python scripts..."
for file in *.py; do
  if [ -f "$file" ]; then
    add_violation "$file" "/scripts/"
    echo "  ${RED}✗${NC} Found Python script: $file"
  fi
done

# Check for deprecated directories
echo "Checking for deprecated directories..."
if [ -d "working_files" ]; then
  TOTAL_VIOLATIONS=$((TOTAL_VIOLATIONS + 1))
  echo "  ${RED}✗${NC} Found deprecated directory: working_files/"
  VIOLATIONS_DETAIL="${VIOLATIONS_DETAIL}
  working_files/ → /context/"
fi

# Count total files in root
ROOT_FILES=$(ls -1 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "📊 Root Directory Statistics:"
echo "  Total files in root: $ROOT_FILES"
if [ "$ROOT_FILES" -gt "$MAX_ROOT_FILES" ]; then
  echo "  ${YELLOW}⚠${NC} Warning: Exceeds recommended maximum ($MAX_ROOT_FILES)"
else
  echo "  ${GREEN}✓${NC} Within recommended limit (≤$MAX_ROOT_FILES)"
fi

# Generate report
echo ""
if [ "$TOTAL_VIOLATIONS" -eq 0 ]; then
  echo "${GREEN}✅ No file organization violations found!${NC}"
  echo ""
  echo "Repository structure is compliant with file-organization-framework.md"
else
  echo "${RED}❌ Found $TOTAL_VIOLATIONS file organization violations!${NC}"
  echo ""
  echo "Violations:"
  echo "$VIOLATIONS_DETAIL"
  echo ""
  echo "${YELLOW}To fix automatically, run:${NC}"
  echo "  ${BLUE}./scripts/auto-file-mover.sh${NC}"
  
  # Write report to file
  {
    echo "File Organization Scan Report"
    echo "Generated: $(date)"
    echo "=========================="
    echo ""
    echo "Total Violations: $TOTAL_VIOLATIONS"
    echo ""
    echo "Details:"
    echo "$VIOLATIONS_DETAIL"
  } > "$REPORT_FILE"
  
  echo ""
  echo "Report saved to: $REPORT_FILE"
fi

# Check if indexes need updating
echo ""
echo "📚 Index Status:"
if [ ! -f "context/project-tree.txt" ] || [ $(find . -newer context/project-tree.txt -type f 2>/dev/null | head -5 | wc -l) -gt 0 ]; then
  echo "  ${YELLOW}⚠${NC} project-tree.txt needs updating"
  echo "  Run: ${BLUE}./scripts/generate-indexes.sh${NC}"
else
  echo "  ${GREEN}✓${NC} project-tree.txt is current"
fi

exit $TOTAL_VIOLATIONS