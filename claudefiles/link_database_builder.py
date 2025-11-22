#!/usr/bin/env python3
import json
import sqlite3
from pathlib import Path
from collections import defaultdict

class LinkDatabaseBuilder:
    """Build SQLite database for cross-referencing like Hookmark"""
    
    def __init__(self, index_path):
        self.index_path = Path(index_path)
        self.db_path = self.index_path / "link_database.db"
        self.conn = None
    
    def create_database(self):
        """Create database schema"""
        self.conn = sqlite3.connect(self.db_path)
        cursor = self.conn.cursor()
        
        # Files table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS files (
                uri TEXT PRIMARY KEY,
                path TEXT NOT NULL,
                type TEXT,
                size INTEGER,
                entity_count INTEGER
            )
        """)
        
        # Entities table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS entities (
                entity_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT,
                occurrence_count INTEGER
            )
        """)
        
        # Entity occurrences (many-to-many)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS entity_occurrences (
                entity_id TEXT,
                file_uri TEXT,
                FOREIGN KEY (entity_id) REFERENCES entities(entity_id),
                FOREIGN KEY (file_uri) REFERENCES files(uri)
            )
        """)
        
        # Links table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS links (
                link_id INTEGER PRIMARY KEY AUTOINCREMENT,
                from_ref TEXT NOT NULL,
                to_ref TEXT NOT NULL,
                link_type TEXT,
                context TEXT
            )
        """)
        
        # Schemas table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS schemas (
                schema_id TEXT PRIMARY KEY,
                uri TEXT,
                title TEXT,
                schema_type TEXT,
                properties TEXT
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_entity_name ON entities(name)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_link_from ON links(from_ref)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_link_to ON links(to_ref)")
        
        self.conn.commit()
        print("Database schema created")
    
    def load_index_data(self):
        """Load all index JSON files"""
        with open(self.index_path / "entity_index.json") as f:
            self.entities = json.load(f)
        
        with open(self.index_path / "file_registry.json") as f:
            self.files = json.load(f)
        
        with open(self.index_path / "link_graph.json") as f:
            self.links = json.load(f)
        
        with open(self.index_path / "schema_registry.json") as f:
            self.schemas = json.load(f)
    
    def populate_database(self):
        """Populate database from index files"""
        cursor = self.conn.cursor()
        
        print("Populating files...")
        for uri, data in self.files.items():
            cursor.execute("""
                INSERT OR REPLACE INTO files (uri, path, type, size, entity_count)
                VALUES (?, ?, ?, ?, ?)
            """, (
                uri,
                data["path"],
                data.get("type", "unknown"),
                data.get("size", 0),
                len(data.get("entities", []))
            ))
        
        print("Populating entities...")
        for entity_id, data in self.entities.items():
            cursor.execute("""
                INSERT OR REPLACE INTO entities (entity_id, name, type, occurrence_count)
                VALUES (?, ?, ?, ?)
            """, (
                entity_id,
                data["name"],
                data.get("type", "json_field"),
                len(data["occurrences"])
            ))
            
            # Add occurrences
            for file_uri in data["occurrences"]:
                cursor.execute("""
                    INSERT INTO entity_occurrences (entity_id, file_uri)
                    VALUES (?, ?)
                """, (entity_id, file_uri))
        
        print("Populating links...")
        for link in self.links:
            cursor.execute("""
                INSERT INTO links (from_ref, to_ref, link_type, context)
                VALUES (?, ?, ?, ?)
            """, (
                link.get("from"),
                link.get("to"),
                link.get("type"),
                json.dumps(link.get("metadata", {}))
            ))
        
        print("Populating schemas...")
        for schema_id, data in self.schemas.items():
            cursor.execute("""
                INSERT OR REPLACE INTO schemas (schema_id, uri, title, schema_type, properties)
                VALUES (?, ?, ?, ?, ?)
            """, (
                schema_id,
                data.get("uri"),
                data.get("title"),
                data.get("type"),
                json.dumps(data.get("properties", []))
            ))
        
        self.conn.commit()
        print("Database populated")
    
    def create_query_interface(self):
        """Create SQL query examples file"""
        queries_file = self.index_path / "QUERY_EXAMPLES.sql"
        
        with open(queries_file, "w") as f:
            f.write("""-- Hookmark-Style Query Examples
-- Run these with: sqlite3 link_database.db < QUERY_EXAMPLES.sql

-- 1. Find all files containing a specific entity
SELECT f.path, e.name
FROM files f
JOIN entity_occurrences eo ON f.uri = eo.file_uri
JOIN entities e ON eo.entity_id = e.entity_id
WHERE e.name LIKE '%Shadow%';

-- 2. Find all files linked to a specific file
SELECT DISTINCT f2.path
FROM files f1
JOIN links l ON (f1.uri = l.from_ref OR f1.uri = l.to_ref)
JOIN files f2 ON (f2.uri = l.from_ref OR f2.uri = l.to_ref)
WHERE f1.path LIKE '%specific_file.json%'
  AND f2.uri != f1.uri;

-- 3. Find most connected entities (hub entities)
SELECT e.name, COUNT(DISTINCT eo.file_uri) as file_count
FROM entities e
JOIN entity_occurrences eo ON e.entity_id = eo.entity_id
GROUP BY e.entity_id
ORDER BY file_count DESC
LIMIT 20;

-- 4. Find entities that co-occur in files
SELECT e1.name, e2.name, COUNT(*) as co_occurrence_count
FROM entity_occurrences eo1
JOIN entity_occurrences eo2 ON eo1.file_uri = eo2.file_uri
JOIN entities e1 ON eo1.entity_id = e1.entity_id
JOIN entities e2 ON eo2.entity_id = e2.entity_id
WHERE e1.entity_id < e2.entity_id
GROUP BY e1.entity_id, e2.entity_id
ORDER BY co_occurrence_count DESC
LIMIT 50;

-- 5. Find all schemas related to an entity
SELECT DISTINCT s.title, s.uri
FROM entities e
JOIN entity_occurrences eo ON e.entity_id = eo.entity_id
JOIN files f ON eo.file_uri = f.uri
JOIN schemas s ON f.uri LIKE '%' || s.title || '%'
WHERE e.name = 'YourEntityName';

-- 6. Get full link network for a file
SELECT 
    l.link_type,
    f1.path as from_path,
    f2.path as to_path
FROM links l
JOIN files f1 ON l.from_ref = f1.uri
JOIN files f2 ON l.to_ref = f2.uri
WHERE f1.path LIKE '%your_file%' OR f2.path LIKE '%your_file%';
""")
        
        print(f"Query examples saved to: {queries_file}")
    
    def generate_stats(self):
        """Generate database statistics"""
        cursor = self.conn.cursor()
        
        stats = {}
        
        cursor.execute("SELECT COUNT(*) FROM files")
        stats["total_files"] = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM entities")
        stats["total_entities"] = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM links")
        stats["total_links"] = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM schemas")
        stats["total_schemas"] = cursor.fetchone()[0]
        
        cursor.execute("""
            SELECT e.name, COUNT(*) as count
            FROM entity_occurrences eo
            JOIN entities e ON eo.entity_id = e.entity_id
            GROUP BY e.entity_id
            ORDER BY count DESC
            LIMIT 10
        """)
        stats["top_entities"] = cursor.fetchall()
        
        return stats

def main():
    BASE_PATH = Path("/Users/ashleygeness/Desktop/ontology index")
    INDEX_PATH = BASE_PATH / "UNIFIED_INDEX"
    
    if not INDEX_PATH.exists():
        print(f"ERROR: Index not found at {INDEX_PATH}")
        print("Run create_unified_index.py first")
        return
    
    builder = LinkDatabaseBuilder(INDEX_PATH)
    builder.create_database()
    builder.load_index_data()
    builder.populate_database()
    builder.create_query_interface()
    
    stats = builder.generate_stats()
    
    print("\n" + "="*80)
    print("DATABASE CREATED")
    print(f"Location: {builder.db_path}")
    print(f"\nStatistics:")
    print(f"  Files: {stats['total_files']}")
    print(f"  Entities: {stats['total_entities']}")
    print(f"  Links: {stats['total_links']}")
    print(f"  Schemas: {stats['total_schemas']}")
    print(f"\nTop 10 Entities:")
    for name, count in stats['top_entities']:
        print(f"  {name}: {count} occurrences")
    print(f"\nQuery examples: {INDEX_PATH}/QUERY_EXAMPLES.sql")

if __name__ == "__main__":
    main()
