#!/usr/bin/env python3
import json
from pathlib import Path
from collections import defaultdict

class SchemaOntologyMapper:
    """Maps between different schema systems and creates ontology"""
    
    def __init__(self, index_path):
        self.index_path = Path(index_path)
        self.entity_index = self.load_json("entity_index.json")
        self.schema_registry = self.load_json("schema_registry.json")
        self.link_graph = self.load_json("link_graph.json")
        
        self.ontology = {
            "classes": {},
            "properties": {},
            "relationships": []
        }
    
    def load_json(self, filename):
        path = self.index_path / filename
        if path.exists():
            with open(path) as f:
                return json.load(f)
        return {}
    
    def discover_classes(self):
        """Discover ontology classes from entity patterns"""
        print("Discovering ontology classes...")
        
        # Group entities by common patterns
        patterns = defaultdict(list)
        
        for entity_id, data in self.entity_index.items():
            name = data["name"]
            
            # Pattern detection
            if name.endswith("ID") or name.endswith("Id"):
                patterns["Identifier"].append(entity_id)
            elif name.endswith("Type") or name.endswith("Category"):
                patterns["Classification"].append(entity_id)
            elif name.startswith("is") or name.startswith("has"):
                patterns["Property"].append(entity_id)
            elif len(data["occurrences"]) > 10:
                patterns["CoreConcept"].append(entity_id)
            else:
                patterns["Entity"].append(entity_id)
        
        # Create classes
        for pattern, entities in patterns.items():
            self.ontology["classes"][pattern] = {
                "instances": entities,
                "count": len(entities)
            }
        
        print(f"  Discovered {len(self.ontology['classes'])} classes")
    
    def discover_relationships(self):
        """Extract relationships from link graph"""
        print("Discovering relationships...")
        
        relationship_types = defaultdict(int)
        
        for link in self.link_graph:
            rel_type = link.get("type", "unknown")
            relationship_types[rel_type] += 1
            
            self.ontology["relationships"].append({
                "from": link["from"],
                "to": link["to"],
                "type": rel_type
            })
        
        print(f"  Found {len(self.ontology['relationships'])} relationships")
        print("  Types:", dict(relationship_types))
    
    def map_to_optolith_schema(self):
        """Generate Optolith-compatible schema definitions"""
        print("\nMapping to Optolith schema format...")
        
        optolith_schemas = {}
        
        for class_name, class_data in self.ontology["classes"].items():
            # Sample entities to extract structure
            sample_entities = class_data["instances"][:5]
            
            properties = {}
            for entity_id in sample_entities:
                entity_name = self.entity_index[entity_id]["name"]
                
                # Infer property type
                properties[entity_name] = {
                    "type": "string",  # Default
                    "description": f"Property discovered from {entity_id}"
                }
            
            optolith_schemas[class_name] = {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "title": class_name,
                "type": "object",
                "properties": properties
            }
        
        return optolith_schemas
    
    def export(self, output_dir):
        """Export ontology and mappings"""
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Export ontology
        with open(output_dir / "discovered_ontology.json", "w") as f:
            json.dump(self.ontology, f, indent=2)
        
        # Export Optolith schemas
        optolith_schemas = self.map_to_optolith_schema()
        schemas_dir = output_dir / "optolith_schemas"
        schemas_dir.mkdir(exist_ok=True)
        
        for class_name, schema in optolith_schemas.items():
            with open(schemas_dir / f"{class_name}.schema.json", "w") as f:
                json.dump(schema, f, indent=2)
        
        # Export human-readable ontology
        with open(output_dir / "ONTOLOGY_MAP.md", "w") as f:
            f.write("# Discovered Ontology\n\n")
            
            f.write("## Classes\n\n")
            for class_name, class_data in self.ontology["classes"].items():
                f.write(f"### {class_name}\n")
                f.write(f"- Instance Count: {class_data['count']}\n")
                f.write(f"- Sample Entities: {', '.join(class_data['instances'][:5])}\n\n")
            
            f.write("## Relationship Summary\n\n")
            rel_types = defaultdict(int)
            for rel in self.ontology["relationships"]:
                rel_types[rel["type"]] += 1
            
            for rel_type, count in sorted(rel_types.items(), key=lambda x: x[1], reverse=True):
                f.write(f"- {rel_type}: {count} occurrences\n")
        
        print(f"\nOntology exported to: {output_dir}")

def main():
    BASE_PATH = Path("/Users/ashleygeness/Desktop/ontology index")
    INDEX_PATH = BASE_PATH / "UNIFIED_INDEX"
    OUTPUT_PATH = BASE_PATH / "ONTOLOGY_SCHEMAS"
    
    if not INDEX_PATH.exists():
        print(f"ERROR: Index not found at {INDEX_PATH}")
        print("Run create_unified_index.py first")
        return
    
    mapper = SchemaOntologyMapper(INDEX_PATH)
    mapper.discover_classes()
    mapper.discover_relationships()
    mapper.export(OUTPUT_PATH)
    
    print("\n" + "="*80)
    print("COMPLETE")
    print(f"Ontology schemas created at: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
