#!/usr/bin/env python3
"""
WORKING scanner that:
- Reads actual FILE CONTENTS (not names)
- Identifies what each repo DOES based on content
- Saves to SQLite database
- No JSON, no generic tags, no file counts
"""

import os
import sqlite3
from pathlib import Path
import sys

def init_database(db_path='repos_analysis.db'):
    """Create database with proper schema"""
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Drop old table if exists to start fresh
    c.execute('DROP TABLE IF EXISTS repos')
    
    # Create new table with useful columns
    c.execute('''CREATE TABLE repos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repo_name TEXT NOT NULL,
        repo_path TEXT NOT NULL,
        tool_type TEXT,
        primary_function TEXT,
        has_ontology BOOLEAN,
        has_parser BOOLEAN,
        has_generator BOOLEAN,
        has_extractor BOOLEAN,
        has_validator BOOLEAN,
        has_dialogue BOOLEAN,
        has_narrative BOOLEAN,
        has_prolog BOOLEAN,
        content_sample