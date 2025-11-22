#!/bin/bash

# Report Cleanup Script
# Purpose: Keep last 5 reports per type, delete older reports
# Usage: ./cleanup-reports.sh [--dry-run]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DRY_RUN=false

# Parse arguments
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "DRY RUN MODE - No files will be deleted"
    echo ""
fi

# Function to cleanup reports of a specific type
cleanup_report_type() {
    local pattern="$1"
    local type_name="$2"

    echo "Processing: $type_name reports (pattern: $pattern)"

    # Find all matching reports, sorted by modification time (newest first)
    local reports=$(ls -t "$SCRIPT_DIR"/$pattern 2>/dev/null || true)

    if [[ -z "$reports" ]]; then
        echo "  No reports found"
        return
    fi

    # Count total reports
    local count=$(echo "$reports" | wc -l | tr -d ' ')
    echo "  Found: $count reports"

    # Keep first 5 (newest), delete rest
    local to_delete=$(echo "$reports" | tail -n +6)

    if [[ -z "$to_delete" ]]; then
        echo "  All reports within limit (≤5), nothing to delete"
    else
        local delete_count=$(echo "$to_delete" | wc -l | tr -d ' ')
        echo "  Deleting: $delete_count older reports"

        while IFS= read -r file; do
            if [[ "$DRY_RUN" == true ]]; then
                echo "    [DRY RUN] Would delete: $(basename "$file")"
            else
                echo "    Deleting: $(basename "$file")"
                rm -f "$file"
            fi
        done <<< "$to_delete"
    fi

    echo ""
}

# Main cleanup
echo "=== Report Cleanup Script ==="
echo "Directory: $SCRIPT_DIR"
echo ""

# Foundation research reports (timestamp format: YYYYMMDD-HHMM)
cleanup_report_type "*-foundation-research.md" "Foundation Research"

# Design ideator reports
cleanup_report_type "*-design-ideator-report-*.md" "Design Ideator"

# QA validation reports
cleanup_report_type "*-qa-report-*.md" "QA Validation"

# Documentation audit reports
cleanup_report_type "*-doc-audit-report-*.md" "Documentation Audit"

# Generic timestamp reports (catch-all for any other types)
cleanup_report_type "[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-*.md" "Timestamp Reports"

echo "=== Cleanup Complete ==="

if [[ "$DRY_RUN" == true ]]; then
    echo ""
    echo "DRY RUN - No files were actually deleted"
    echo "Run without --dry-run to perform actual cleanup"
fi
