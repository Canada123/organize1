#!/usr/bin/env python3
import os
import json
import hashlib
from pathlib import Path
from urllib.parse import quote

# CONFIGURATION - SET YOUR ACTUAL PATHS
BASE_PATH = Path("/Users/ashleygeness/Desktop/ontology index")
RCORPA_PATH = BASE_PATH / "Rcorpa"
TOOLS_PATH = BASE_PATH / "owl and ontology tools"
OUTPUT_PATH = BASE_PATH / "UNIFIED_INDEX"

class UnifiedIndexer:
    def __init__(self):
        self.index = {
            "entities": {},  # All unique entities found
            "files": {},     # All files with their hookmark-style URIs
            "links": [],     # Cross-references between entities
            "schemas": {},   # Schema definitions
            "repos": {}      # Repository metadata
        }
    
    def generate_uri(self, filepath):
        """Generate Hookmark-style URI"""
        rel_path = str(filepath.relative_to(BASE_PATH))
        return f"x-ontology:///{quote(rel_path)}"
    
    def generate_entity_id(self, name, source):
        """Generate stable entity identifier"""
        stable_string = f"{source}:{name}"
        return hashlib.sha256(stable_string.encode()).hexdigest()[:16]
    
    def index_json_file(self, filepath):
        """Extract entities from JSON and create links"""
        uri = self.generate_uri(filepath)
        
        # Store file metadata
        self.index["files"][uri] = {
            "path": str(filepath),
            "size": filepath.stat().st_size,
            "type": "json",
            "entities": []
        }
        
        try:
            with open(filepath) as f:
                data = json.load(f)
            
            # Extract top-level keys as entity types
            if isinstance(data, dict):
                for key, value in data.items():
                    entity_id = self.generate_entity_id(key, filepath.parent.name)
                    
                    if entity_id not in self.index["entities"]:
                        self.index["entities"][entity_id] = {
                            "name": key,
                            "type": "json_field",
                            "occurrences": []
                        }
                    
                    self.index["entities"][entity_id]["occurrences"].append(uri)
                    self.index["files"][uri]["entities"].append(entity_id)
                    
                    # Create cross-links for nested structures
                    if isinstance(value, dict):
                        for nested_key in value.keys():
                            nested_id = self.generate_entity_id(nested_key, filepath.parent.name)
                            self.index["links"].append({
                                "from": entity_id,
                                "to": nested_id,
                                "type": "contains",
                                "source_file": uri
                            })
        
        except Exception as e:
            self.index["files"][uri]["error"] = str(e)
    
    def index_schema_file(self, filepath):
        """Index JSON schema files"""
        uri = self.generate_uri(filepath)
        
        try:
            with open(filepath) as f:
                schema = json.load(f)
            
            schema_id = self.generate_entity_id(
                schema.get("title", filepath.stem),
                "schema"
            )
            
            self.index["schemas"][schema_id] = {
                "uri": uri,
                "title": schema.get("title"),
                "type": schema.get("type"),
                "properties": list(schema.get("properties", {}).keys())
            }
        
        except Exception as e:
            pass
    
    def scan_directory(self, path, pattern="**/*.json"):
        """Recursively scan directory"""
        print(f"Scanning: {path}")
        count = 0
        
        for filepath in Path(path).glob(pattern):
            if filepath.is_file():
                if "schema" in str(filepath).lower():
                    self.index_schema_file(filepath)
                else:
                    self.index_json_file(filepath)
                count += 1
                
                if count % 1000 == 0:
                    print(f"  Indexed {count} files...")
        
        print(f"  Total: {count} files")
        return count
    
    def build_cross_reference_table(self):
        """Build entity-to-entity cross-reference"""
        print("\nBuilding cross-references...")
        
        # Find entities that appear in multiple files
        for entity_id, data in self.index["entities"].items():
            if len(data["occurrences"]) > 1:
                # This entity appears in multiple places - create links
                for i, uri1 in enumerate(data["occurrences"]):
                    for uri2 in data["occurrences"][i+1:]:
                        self.index["links"].append({
                            "from": uri1,
                            "to": uri2,
                            "type": "shares_entity",
                            "entity": entity_id
                        })
    
    def export_hookmark_format(self, output_dir):
        """Export in Hookmark-compatible format"""
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # 1. Entity Index (like Hookmark's bookmark database)
        with open(output_dir / "entity_index.json", "w") as f:
            json.dump(self.index["entities"], f, indent=2)
        
        # 2. File Registry (all files with URIs)
        with open(output_dir / "file_registry.json", "w") as f:
            json.dump(self.index["files"], f, indent=2)
        
        # 3. Link Graph (cross-references)
        with open(output_dir / "link_graph.json", "w") as f:
            json.dump(self.index["links"], f, indent=2)
        
        # 4. Schema Registry
        with open(output_dir / "schema_registry.json", "w") as f:
            json.dump(self.index["schemas"], f, indent=2)
        
        # 5. Human-readable master index
        with open(output_dir / "MASTER_INDEX.md", "w") as f:
            f.write("# Unified Ontology Index\n\n")
            
            f.write(f"## Statistics\n")
            f.write(f"- Total Files: {len(self.index['files'])}\n")
            f.write(f"- Total Entities: {len(self.index['entities'])}\n")
            f.write(f"- Total Links: {len(self.index['links'])}\n")
            f.write(f"- Total Schemas: {len(self.index['schemas'])}\n\n")
            
            f.write(f"## Top Entities\n")
            sorted_entities = sorted(
                self.index["entities"].items(),
                key=lambda x: len(x[1]["occurrences"]),
                reverse=True
            )[:50]
            
            for entity_id, data in sorted_entities:
                f.write(f"\n### {data['name']}\n")
                f.write(f"- ID: `{entity_id}`\n")
                f.write(f"- Occurrences: {len(data['occurrences'])}\n")
                f.write(f"- Files: {', '.join(data['occurrences'][:3])}\n")
        
        # 6. URI mapping file for Hookmark integration
        with open(output_dir / "uri_mappings.txt", "w") as f:
            for uri, data in self.index["files"].items():
                f.write(f"{uri}\t{data['path']}\n")
        
        print(f"\nIndex exported to: {output_dir}")
        print(f"Files:")
        print(f"  - entity_index.json (all entities with occurrences)")
        print(f"  - file_registry.json (all files with URIs)")
        print(f"  - link_graph.json (cross-references)")
        print(f"  - schema_registry.json (schema definitions)")
        print(f"  - MASTER_INDEX.md (human-readable overview)")
        print(f"  - uri_mappings.txt (Hookmark-style URI mappings)")

def main():
    indexer = UnifiedIndexer()
    
    # Scan Rcorpa (your 70k JSON files)
    if RCORPA_PATH.exists():
        indexer.scan_directory(RCORPA_PATH)
    
    # Scan schema generators in tools
    if TOOLS_PATH.exists():
        indexer.scan_directory(TOOLS_PATH, "**/*.json")
    
    # Build cross-references
    indexer.build_cross_reference_table()
    
    # Export
    indexer.export_hookmark_format(OUTPUT_PATH)
    
    print("\n" + "="*80)
    print("COMPLETE")
    print(f"Unified index created at: {OUTPUT_PATH}")
    print(f"\nTo use with Hookmark:")
    print(f"1. Open Hookmark")
    print(f"2. Import uri_mappings.txt")
    print(f"3. Use MASTER_INDEX.md to navigate")

if __name__ == "__main__":
    main()
