#!/bin/bash

# Complete System Runner - Includes ALL content
# Indexes files + project knowledge + integrates everything

set -e

echo "========================================"
echo "COMPLETE INDEXING SYSTEM"
echo "Including Project Knowledge Base"
echo "========================================"
echo

EXPECTED_DIR="/Users/ashleygeness/Desktop/ontology index"

if [ "$PWD" != "$EXPECTED_DIR" ]; then
    echo "ERROR: Must run from: $EXPECTED_DIR"
    echo "Current directory: $PWD"
    exit 1
fi

# Step 1: Index files
echo "STEP 1: Indexing Files"
echo "========================================"
if [ -f "create_unified_index.py" ]; then
    python3 create_unified_index.py
else
    echo "ERROR: create_unified_index.py not found"
    exit 1
fi

# Step 2: Build link database
echo
echo "STEP 2: Building Link Database"
echo "========================================"
python3 link_database_builder.py

# Step 3: Generate ontology
echo
echo "STEP 3: Generating Ontology"
echo "========================================"
python3 schema_ontology_mapper.py

# Step 4: Index project knowledge
echo
echo "STEP 4: Indexing Project Knowledge"
echo "========================================"
python3 index_project_knowledge.py

# Step 5: Integrate everything
echo
echo "STEP 5: Master Integration"
echo "========================================"
python3 integrate_all_sources.py

echo
echo "========================================"
echo "COMPLETE"
echo "========================================"
echo
echo "Created 3 index directories:"
echo "  1. UNIFIED_INDEX/           - File-based index"
echo "  2. PROJECT_KNOWLEDGE_INDEX/ - Knowledge base index"
echo "  3. MASTER_INDEX/            - Integrated master index"
echo
echo "Master database: MASTER_INDEX/master_index.db"
echo "Master overview: MASTER_INDEX/MASTER_INDEX.md"
echo "All URIs: MASTER_INDEX/all_uris.txt"
echo

