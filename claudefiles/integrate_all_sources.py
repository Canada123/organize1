#!/usr/bin/env python3
import json
import sqlite3
from pathlib import Path
from collections import defaultdict

class MasterIntegrator:
    """Integrate project knowledge with file-based index"""
    
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.unified_index_path = self.base_path / "UNIFIED_INDEX"
        self.knowledge_index_path = self.base_path / "PROJECT_KNOWLEDGE_INDEX"
        self.master_path = self.base_path / "MASTER_INDEX"
        self.master_path.mkdir(parents=True, exist_ok=True)
        
        self.all_entities = {}
        self.all_files = {}
        self.all_links = []
        self.all_documents = {}
    
    def load_file_index(self):
        """Load file-based index"""
        print("Loading file index...")
        
        with open(self.unified_index_path / "entity_index.json") as f:
            file_entities = json.load(f)
        
        with open(self.unified_index_path / "file_registry.json") as f:
            file_registry = json.load(f)
        
        with open(self.unified_index_path / "link_graph.json") as f:
            file_links = json.load(f)
        
        # Add to master
        for entity_id, data in file_entities.items():
            self.all_entities[f"FILE:{entity_id}"] = {
                **data,
                'source': 'FILE_INDEX'
            }
        
        for uri, data in file_registry.items():
            self.all_files[uri] = {
                **data,
                'source': 'FILE_INDEX'
            }
        
        for link in file_links:
            self.all_links.append({
                **link,
                'source': 'FILE_INDEX'
            })
        
        print(f"  Loaded {len(file_entities)} file entities")
    
    def load_knowledge_index(self):
        """Load project knowledge index"""
        print("Loading knowledge index...")
        
        with open(self.knowledge_index_path / "knowledge_documents.json") as f:
            kb_docs = json.load(f)
        
        with open(self.knowledge_index_path / "knowledge_entities.json") as f:
            kb_entities = json.load(f)
        
        with open(self.knowledge_index_path / "knowledge_cross_refs.json") as f:
            kb_refs = json.load(f)
        
        # Add to master
        for entity, data in kb_entities.items():
            self.all_entities[f"KB:{entity}"] = {
                'name': entity,
                'occurrences': [f"x-knowledge:///{d}" for d in data['occurrences']],
                'source': 'KNOWLEDGE_BASE'
            }
        
        for doc_id, data in kb_docs.items():
            uri = f"x-knowledge:///{doc_id}"
            self.all_documents[uri] = {
                **data,
                'source': 'KNOWLEDGE_BASE'
            }
        
        for ref in kb_refs:
            self.all_links.append({
                'from': f"x-knowledge:///{ref['doc1']}",
                'to': f"x-knowledge:///{ref['doc2']}",
                'type': ref['type'],
                'entity': ref['shared_entity'],
                'source': 'KNOWLEDGE_BASE'
            })
        
        print(f"  Loaded {len(kb_entities)} knowledge entities")
    
    def find_cross_source_links(self):
        """Find entities that appear in both sources"""
        print("Finding cross-source links...")
        
        file_entities = {
            k.replace('FILE:', ''): v 
            for k, v in self.all_entities.items() 
            if k.startswith('FILE:')
        }
        
        kb_entities = {
            k.replace('KB:', ''): v 
            for k, v in self.all_entities.items() 
            if k.startswith('KB:')
        }
        
        # Find matching entity names
        cross_links = []
        for kb_name in kb_entities.keys():
            # Normalize for comparison
            kb_normalized = kb_name.upper().replace('_', ' ')
            
            for file_name in file_entities.keys():
                file_normalized = file_name.upper().replace('_', ' ')
                
                # Check for matches
                if kb_normalized == file_normalized or \
                   kb_normalized in file_normalized or \
                   file_normalized in kb_normalized:
                    
                    cross_links.append({
                        'kb_entity': kb_name,
                        'file_entity': file_name,
                        'type': 'CROSS_SOURCE_MATCH',
                        'kb_docs': kb_entities[kb_name]['occurrences'],
                        'file_occurrences': file_entities[file_name]['occurrences']
                    })
        
        print(f"  Found {len(cross_links)} cross-source links")
        return cross_links
    
    def create_master_database(self):
        """Create unified SQLite database"""
        print("Creating master database...")
        
        db_path = self.master_path / "master_index.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create unified schema
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS entities (
                entity_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                source TEXT,
                occurrence_count INTEGER
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS resources (
                uri TEXT PRIMARY KEY,
                type TEXT,
                source TEXT,
                title TEXT,
                path TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS entity_resources (
                entity_id TEXT,
                resource_uri TEXT,
                FOREIGN KEY (entity_id) REFERENCES entities(entity_id),
                FOREIGN KEY (resource_uri) REFERENCES resources(uri)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS links (
                link_id INTEGER PRIMARY KEY AUTOINCREMENT,
                from_ref TEXT,
                to_ref TEXT,
                link_type TEXT,
                source TEXT
            )
        """)
        
        # Populate entities
        for entity_id, data in self.all_entities.items():
            cursor.execute("""
                INSERT OR REPLACE INTO entities (entity_id, name, source, occurrence_count)
                VALUES (?, ?, ?, ?)
            """, (
                entity_id,
                data['name'],
                data['source'],
                len(data.get('occurrences', []))
            ))
            
            # Add entity-resource links
            for occurrence in data.get('occurrences', []):
                cursor.execute("""
                    INSERT INTO entity_resources (entity_id, resource_uri)
                    VALUES (?, ?)
                """, (entity_id, occurrence))
        
        # Populate resources (files + documents)
        for uri, data in self.all_files.items():
            cursor.execute("""
                INSERT OR REPLACE INTO resources (uri, type, source, title, path)
                VALUES (?, ?, ?, ?, ?)
            """, (
                uri,
                data.get('type', 'file'),
                data['source'],
                None,
                data['path']
            ))
        
        for uri, data in self.all_documents.items():
            cursor.execute("""
                INSERT OR REPLACE INTO resources (uri, type, source, title, path)
                VALUES (?, ?, ?, ?, ?)
            """, (
                uri,
                data.get('type', 'document'),
                data['source'],
                data['title'],
                None
            ))
        
        # Populate links
        for link in self.all_links:
            cursor.execute("""
                INSERT INTO links (from_ref, to_ref, link_type, source)
                VALUES (?, ?, ?, ?)
            """, (
                link.get('from'),
                link.get('to'),
                link.get('type'),
                link.get('source')
            ))
        
        conn.commit()
        conn.close()
        
        print(f"  Database created: {db_path}")
        return db_path
    
    def export_master_index(self, cross_links):
        """Export comprehensive master index"""
        
        # JSON export
        master_data = {
            'statistics': {
                'total_entities': len(self.all_entities),
                'total_files': len(self.all_files),
                'total_documents': len(self.all_documents),
                'total_links': len(self.all_links),
                'cross_source_links': len(cross_links)
            },
            'entities': self.all_entities,
            'files': self.all_files,
            'documents': self.all_documents,
            'links': self.all_links,
            'cross_source_links': cross_links
        }
        
        with open(self.master_path / "master_index.json", "w") as f:
            json.dump(master_data, f, indent=2)
        
        # Markdown export
        with open(self.master_path / "MASTER_INDEX.md", "w") as f:
            f.write("# Master Unified Index\n\n")
            f.write("Integration of file-based index and project knowledge base\n\n")
            
            f.write("## Statistics\n\n")
            stats = master_data['statistics']
            f.write(f"- Total Entities: {stats['total_entities']}\n")
            f.write(f"- Total Files: {stats['total_files']}\n")
            f.write(f"- Total Documents: {stats['total_documents']}\n")
            f.write(f"- Total Links: {stats['total_links']}\n")
            f.write(f"- Cross-Source Links: {stats['cross_source_links']}\n\n")
            
            f.write("## Cross-Source Connections\n\n")
            f.write("Entities that appear in both files and knowledge base:\n\n")
            
            for link in cross_links[:20]:
                f.write(f"### {link['kb_entity']}\n")
                f.write(f"- Knowledge Base: {len(link['kb_docs'])} documents\n")
                f.write(f"- File System: {len(link['file_occurrences'])} files\n\n")
            
            if len(cross_links) > 20:
                f.write(f"\n... and {len(cross_links) - 20} more\n\n")
            
            f.write("## Top Entities by Source\n\n")
            
            # Group entities by source
            by_source = defaultdict(list)
            for entity_id, data in self.all_entities.items():
                by_source[data['source']].append((entity_id, len(data.get('occurrences', []))))
            
            for source, entities in by_source.items():
                f.write(f"### {source}\n\n")
                sorted_entities = sorted(entities, key=lambda x: x[1], reverse=True)[:10]
                for entity_id, count in sorted_entities:
                    name = self.all_entities[entity_id]['name']
                    f.write(f"- {name}: {count} occurrences\n")
                f.write("\n")
        
        # URI mappings (combined)
        with open(self.master_path / "all_uris.txt", "w") as f:
            for uri, data in self.all_files.items():
                f.write(f"{uri}\t{data['path']}\n")
            for uri, data in self.all_documents.items():
                f.write(f"{uri}\t{data['title']}\n")

def main():
    BASE_PATH = Path("/Users/ashleygeness/Desktop/ontology index")
    
    # Check prerequisites
    required_paths = [
        BASE_PATH / "UNIFIED_INDEX",
        BASE_PATH / "PROJECT_KNOWLEDGE_INDEX"
    ]
    
    for path in required_paths:
        if not path.exists():
            print(f"ERROR: Required index not found: {path}")
            print("\nRun these first:")
            print("  1. ./run_complete_indexing.sh")
            print("  2. python3 index_project_knowledge.py")
            return
    
    integrator = MasterIntegrator(BASE_PATH)
    
    print("="*80)
    print("MASTER INDEX INTEGRATION")
    print("="*80)
    print()
    
    integrator.load_file_index()
    integrator.load_knowledge_index()
    
    cross_links = integrator.find_cross_source_links()
    
    db_path = integrator.create_master_database()
    integrator.export_master_index(cross_links)
    
    print()
    print("="*80)
    print("INTEGRATION COMPLETE")
    print("="*80)
    print(f"\nMaster index created at: {integrator.master_path}")
    print(f"\nFiles:")
    print(f"  - master_index.db (SQLite database)")
    print(f"  - master_index.json (Complete data)")
    print(f"  - MASTER_INDEX.md (Human-readable)")
    print(f"  - all_uris.txt (All URIs)")
    print(f"\nThis index includes:")
    print(f"  - All 70k+ JSON files from Rcorpa")
    print(f"  - All schema generators and tools")
    print(f"  - All project knowledge base content")
    print(f"  - Cross-references between all sources")

if __name__ == "__main__":
    main()
