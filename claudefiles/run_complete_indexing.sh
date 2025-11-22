#!/bin/bash

# Complete Indexing System Runner
# Runs all three steps in sequence

set -e  # Exit on error

echo "========================================"
echo "COMPLETE INDEXING SYSTEM"
echo "========================================"
echo

# Check if we're in the right directory
EXPECTED_DIR="/Users/ashleygeness/Desktop/ontology index"

if [ "$PWD" != "$EXPECTED_DIR" ]; then
    echo "ERROR: Must run from: $EXPECTED_DIR"
    echo "Current directory: $PWD"
    echo
    echo "To fix:"
    echo "  cd '$EXPECTED_DIR'"
    echo "  ./run_complete_indexing.sh"
    exit 1
fi

# Check if files exist
if [ ! -d "Rcorpa" ]; then
    echo "ERROR: Rcorpa directory not found"
    echo "Expected at: $EXPECTED_DIR/Rcorpa"
    exit 1
fi

if [ ! -d "owl and ontology tools" ]; then
    echo "ERROR: owl and ontology tools directory not found"
    echo "Expected at: $EXPECTED_DIR/owl and ontology tools"
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 not found"
    echo "Install Python 3 first"
    exit 1
fi

echo "Starting complete indexing process..."
echo

# Step 1: Create Unified Index
echo "========================================"
echo "STEP 1: Creating Unified Index"
echo "========================================"
echo

if [ -f "create_unified_index.py" ]; then
    python3 create_unified_index.py
else
    echo "ERROR: create_unified_index.py not found"
    echo "Make sure all scripts are in current directory"
    exit 1
fi

if [ ! -d "UNIFIED_INDEX" ]; then
    echo "ERROR: Unified index creation failed"
    exit 1
fi

echo
echo "✓ Unified index created"
echo

# Step 2: Build Link Database
echo "========================================"
echo "STEP 2: Building Link Database"
echo "========================================"
echo

if [ -f "link_database_builder.py" ]; then
    python3 link_database_builder.py
else
    echo "ERROR: link_database_builder.py not found"
    exit 1
fi

if [ ! -f "UNIFIED_INDEX/link_database.db" ]; then
    echo "ERROR: Link database creation failed"
    exit 1
fi

echo
echo "✓ Link database created"
echo

# Step 3: Generate Ontology Schemas
echo "========================================"
echo "STEP 3: Generating Ontology Schemas"
echo "========================================"
echo

if [ -f "schema_ontology_mapper.py" ]; then
    python3 schema_ontology_mapper.py
else
    echo "ERROR: schema_ontology_mapper.py not found"
    exit 1
fi

if [ ! -d "ONTOLOGY_SCHEMAS" ]; then
    echo "ERROR: Ontology schema generation failed"
    exit 1
fi

echo
echo "✓ Ontology schemas created"
echo

# Summary
echo
echo "========================================"
echo "COMPLETE"
echo "========================================"
echo
echo "Output directories:"
echo "  1. UNIFIED_INDEX/        - Master index with URIs"
echo "  2. UNIFIED_INDEX/        - Link database (SQLite)"
echo "  3. ONTOLOGY_SCHEMAS/     - Discovered ontology"
echo
echo "Files created:"
echo "  - entity_index.json      - All entities"
echo "  - file_registry.json     - All files with URIs"
echo "  - link_graph.json        - Cross-references"
echo "  - link_database.db       - Queryable database"
echo "  - discovered_ontology.json"
echo "  - MASTER_INDEX.md"
echo "  - ONTOLOGY_MAP.md"
echo "  - uri_mappings.txt       - For Hookmark import"
echo
echo "Next steps:"
echo "  1. Review UNIFIED_INDEX/MASTER_INDEX.md"
echo "  2. Import uri_mappings.txt into Hookmark"
echo "  3. Query link_database.db with SQL"
echo "  4. Use schemas in ONTOLOGY_SCHEMAS/"
echo
echo "See COMPLETE_INDEXING_SYSTEM.md for full documentation"
echo

