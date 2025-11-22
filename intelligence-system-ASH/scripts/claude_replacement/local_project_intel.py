#!/usr/bin/env python3
"""
Jim Simons Quantitative Ingestion Engine
-----------------------------------------
This script is specifically designed to parse the 'reponameproject_index.json' files
and load their rich, structured data into a proper analytical database.

It correctly handles:
- The 'reponame' encoded in the filename.
- The 'root' path key from within the JSON.
- The full JSON object for deep, quantitative analysis.
"""

import json
import os
import sqlite3
from pathlib import Path
import sys

# --- CONFIGURATION ---
# The path to your 2000+ renamed index files. This is correct.
INDEXES_DIRECTORY = '/Users/ashleygeness/Desktop/datalakes_stage1'

# The name of the database file that will be created.
DB_FILE = 'quantitative_inventory.db'
# --- END CONFIGURATION ---

def setup_database(db_path):
    """
    Initializes the database with a schema designed for your specific JSON structure.
    This creates the foundation for your comparative analysis.
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # This schema is built for your data.
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repo_name TEXT NOT NULL UNIQUE,      -- 'reponame' from the filename
        datalake_file_path TEXT NOT NULL,  -- The full path to the index file in your datalake
        root_path_from_json TEXT,          -- The value of the 'root' key
        full_json_data TEXT NOT NULL       -- The complete JSON data for querying
    )
    ''')
    # Create indexes for faster querying
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_repo_name ON projects (repo_name)")
    conn.commit()
    print(f"✅ Analytical database initialized at: {db_path}")
    return conn

def ingest_indexes(conn, indexes_dir):
    """
    Scans the datalake, parses each specific index file, and loads it into the database.
    This is the core of the data-driven methodology.
    """
    cursor = conn.cursor()
    # This wildcard pattern correctly finds all your renamed files.
    glob_pattern = "**/*project_index.json"
    index_files = list(Path(indexes_dir).glob(glob_pattern))
    total_files = len(index_files)

    if total_files == 0:
        print(f"❌ FATAL: No files ending with 'project_index.json' were found in '{indexes_dir}'.", file=sys.stderr)
        return 0

    print(f"🚀 Found {total_files} repository indexes. Beginning ingestion.")
    ingested_count = 0

    for index_file in index_files:
        try:
            # Step 1: Extract the repo name from the filename.
            repo_name = index_file.name.replace('project_index.json', '')
            
            # Step 2: Load the entire JSON content.
            with open(index_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Step 3: Extract the 'root' key, handling cases where it might be missing.
            root_path = data.get('root', 'NOT_SPECIFIED')

            # Step 4: Insert all relevant data into the database for analysis.
            cursor.execute(
                """
                INSERT OR REPLACE INTO projects 
                (repo_name, datalake_file_path, root_path_from_json, full_json_data) 
                VALUES (?, ?, ?, ?)
                """,
                (repo_name, str(index_file), root_path, json.dumps(data))
            )
            ingested_count += 1
            print(f"   -> Ingested [{ingested_count}/{total_files}]: {repo_name}")

        except Exception as e:
            print(f"⚠️ SKIPPING: Critical error processing {index_file.name}. Reason: {e}", file=sys.stderr)
            
    conn.commit()
    return ingested_count

if __name__ == "__main__":
    claude_replacement_dir = os.path.dirname(__file__)
    db_path = os.path.join(claude_replacement_dir, DB_FILE)
    
    connection = setup_database(db_path)
    
    if not os.path.isdir(INDEXES_DIRECTORY):
        print(f"❌ FATAL: The source directory '{INDEXES_DIRECTORY}' does not exist.", file=sys.stderr)
        sys.exit(1)
        
    final_count = ingest_indexes(connection, INDEXES_DIRECTORY)
    
    connection.close()
    
    print("\n--- INGESTION COMPLETE ---")
    if final_count > 0:
        print(f"✅ Successfully ingested {final_count} repositories into '{DB_FILE}'.")
        print("You can now connect to this database and run SQL queries against the 'full_json_data' column to begin your comparative analysis.")
    else:
        print("❌ Ingestion failed. No data was loaded.")
