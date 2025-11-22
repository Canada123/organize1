#!/usr/bin/env python3
import json
import re
from pathlib import Path
from collections import defaultdict

class ProjectKnowledgeIndexer:
    """Index all project knowledge base content"""
    
    def __init__(self, output_path):
        self.output_path = Path(output_path)
        self.output_path.mkdir(parents=True, exist_ok=True)
        
        self.documents = {}
        self.entities = defaultdict(list)
        self.concepts = defaultdict(set)
        self.cross_references = []
    
    def extract_content_from_text(self, text, doc_id):
        """Extract entities and concepts from text"""
        
        # Extract section headers
        headers = re.findall(r'^#{1,6}\s+(.+)$', text, re.MULTILINE)
        for header in headers:
            clean = header.strip()
            self.entities[clean].append(doc_id)
            self.concepts['SECTION'].add(clean)
        
        # Extract code blocks
        code_blocks = re.findall(r'```(\w+)?\n(.*?)```', text, re.DOTALL)
        for lang, code in code_blocks:
            if lang:
                self.concepts['CODE_LANGUAGE'].add(lang)
        
        # Extract URLs
        urls = re.findall(r'https?://[^\s\)]+', text)
        for url in urls:
            domain = re.search(r'https?://([^/]+)', url)
            if domain:
                self.concepts['DOMAIN'].add(domain.group(1))
        
        # Extract technical terms (capitalized phrases)
        terms = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b', text)
        for term in terms:
            if len(term.split()) >= 2:
                self.entities[term].append(doc_id)
                self.concepts['TECHNICAL_TERM'].add(term)
        
        # Extract key concepts (words in bold/emphasis)
        bold = re.findall(r'\*\*([^*]+)\*\*', text)
        emphasis = re.findall(r'_([^_]+)_', text)
        for term in bold + emphasis:
            clean = term.strip()
            if len(clean) > 3:
                self.entities[clean].append(doc_id)
                self.concepts['KEY_CONCEPT'].add(clean)
        
        # Extract list items
        lists = re.findall(r'^\s*[-*]\s+(.+)$', text, re.MULTILINE)
        for item in lists:
            # Extract first significant word
            words = item.split()
            if words and len(words[0]) > 3:
                self.concepts['LIST_ITEM'].add(words[0])
    
    def process_knowledge_base_content(self):
        """Process all the project knowledge content"""
        
        # This content was discovered through project_knowledge_search
        knowledge_items = [
            {
                'id': 'jung_transform_ontology',
                'title': 'Jung Transformation Ontology',
                'content': '''Complete specification for multi-source association engine
                integrating RPG databases, Tarot, Greek mythology, Thompson Motif Index,
                Jungian psychology, I Ching, Alchemy, Sacred geometry.
                Universal Association Format (UAF), Entity Properties Database (EPD).
                Shadow, Anima, Projection, Unconscious concepts.
                Individuation, Self-realization processes.''',
                'type': 'ONTOLOGY'
            },
            {
                'id': 'social_ontology',
                'title': 'Social Ontology',
                'content': '''Philosophy of social entities and construction.
                Individuals, aggregates, wholes. Building blocks of social world.
                Social construction, collective intentionality, institutional facts.
                What is meant by building of social world.''',
                'type': 'PHILOSOPHY'
            },
            {
                'id': 'story_parts_index',
                'title': 'Story Parts and Code Indexing',
                'content': '''Symbol extraction, AST generation, semantic analysis.
                Language Server Protocol (LSP), LSIF format.
                Trigram index for keyword search, inverted index, postings lists.
                Graph database for semantic relationships.
                Nodes and edges representing code locations and relationships.''',
                'type': 'TECHNICAL'
            },
            {
                'id': 'game_ontology',
                'title': 'Game Development Ontology',
                'content': '''Skill trees based on Dreyfus model.
                Novice, Advanced Beginner, Competent, Proficient, Expert stages.
                Database schema for skills, user progress, dependencies.
                Learning resources mapped to proficiency levels.
                Practice logs and reflection systems.''',
                'type': 'GAME_DESIGN'
            },
            {
                'id': 'transmutation_system',
                'title': 'TheGreaterBookOfTransmutation',
                'content': '''Association-based recipe generation using USF database.
                Material discovery through free association.
                Tool selection, action sequencing, spell generation.
                Recursive dependencies, material state tracking.
                LaTeX formatting, absurdist technical documentation.''',
                'type': 'SYSTEM'
            },
            {
                'id': 'optolith_schema',
                'title': 'Optolith Database Schema',
                'content': '''RPG database schema for The Dark Eye system.
                AnimistPower, magical actions, character creation.
                Equipment, skills, advantages, disadvantages.
                JSON Schema format with internationalization.
                TypeScript definitions and transpiler system.''',
                'type': 'RPG_SCHEMA'
            },
            {
                'id': 'taxonomy_learning',
                'title': 'Taxonomy Learning Methods',
                'content': '''Hypernym discovery, hierarchical relationships.
                Entity type classification, co-occurrence patterns.
                SemEval 2018 Hypernym Discovery benchmarks.
                CRIM hybrid approach, pattern-based extraction.
                Contextualise topic mapping system.''',
                'type': 'NLP'
            },
            {
                'id': 'repository_organization',
                'title': 'Repository Organization Strategies',
                'content': '''Multi-repository analysis and classification.
                Narrative sources, linguistic tools, game systems.
                Psychology frameworks, taxonomy tools.
                Machiavelli benchmark with 70k scenarios.
                Folder structure patterns and metadata extraction.''',
                'type': 'DATA_MANAGEMENT'
            }
        ]
        
        for item in knowledge_items:
            doc_id = item['id']
            self.documents[doc_id] = {
                'title': item['title'],
                'type': item['type'],
                'content_summary': item['content'][:200] + '...'
            }
            
            # Extract entities from content
            self.extract_content_from_text(item['content'], doc_id)
            
            # Add type as concept
            self.concepts['DOCUMENT_TYPE'].add(item['type'])
    
    def build_cross_references(self):
        """Find documents that share entities"""
        
        for entity, doc_list in self.entities.items():
            if len(doc_list) > 1:
                # This entity appears in multiple documents
                for i, doc1 in enumerate(doc_list):
                    for doc2 in doc_list[i+1:]:
                        self.cross_references.append({
                            'doc1': doc1,
                            'doc2': doc2,
                            'shared_entity': entity,
                            'type': 'SHARES_CONCEPT'
                        })
    
    def export_knowledge_index(self):
        """Export all discovered knowledge"""
        
        # 1. Document registry
        with open(self.output_path / 'knowledge_documents.json', 'w') as f:
            json.dump(self.documents, f, indent=2)
        
        # 2. Entity index
        entity_index = {
            entity: {
                'occurrences': docs,
                'count': len(docs)
            }
            for entity, docs in self.entities.items()
        }
        with open(self.output_path / 'knowledge_entities.json', 'w') as f:
            json.dump(entity_index, f, indent=2)
        
        # 3. Concept taxonomy
        concept_taxonomy = {
            category: sorted(list(concepts))
            for category, concepts in self.concepts.items()
        }
        with open(self.output_path / 'knowledge_concepts.json', 'w') as f:
            json.dump(concept_taxonomy, f, indent=2)
        
        # 4. Cross-references
        with open(self.output_path / 'knowledge_cross_refs.json', 'w') as f:
            json.dump(self.cross_references, f, indent=2)
        
        # 5. Human-readable index
        with open(self.output_path / 'KNOWLEDGE_INDEX.md', 'w') as f:
            f.write("# Project Knowledge Base Index\n\n")
            
            f.write("## Documents\n\n")
            for doc_id, data in self.documents.items():
                f.write(f"### {data['title']}\n")
                f.write(f"- ID: `{doc_id}`\n")
                f.write(f"- Type: {data['type']}\n")
                f.write(f"- Summary: {data['content_summary']}\n\n")
            
            f.write("## Key Entities\n\n")
            sorted_entities = sorted(
                self.entities.items(),
                key=lambda x: len(x[1]),
                reverse=True
            )[:50]
            
            for entity, docs in sorted_entities:
                f.write(f"- **{entity}**: appears in {len(docs)} documents\n")
            
            f.write("\n## Concept Categories\n\n")
            for category, concepts in sorted(self.concepts.items()):
                f.write(f"### {category}\n")
                f.write(f"- Count: {len(concepts)}\n")
                if len(concepts) <= 10:
                    f.write(f"- Items: {', '.join(sorted(concepts))}\n")
                f.write("\n")
            
            f.write(f"## Cross-References\n\n")
            f.write(f"Total cross-document links: {len(self.cross_references)}\n\n")
            
            # Group by shared entity
            by_entity = defaultdict(list)
            for ref in self.cross_references:
                by_entity[ref['shared_entity']].append((ref['doc1'], ref['doc2']))
            
            for entity, pairs in sorted(by_entity.items(), key=lambda x: len(x[1]), reverse=True)[:20]:
                f.write(f"### {entity}\n")
                f.write(f"Links {len(pairs)} document pairs\n\n")
        
        # 6. URI mappings for integration
        with open(self.output_path / 'knowledge_uris.txt', 'w') as f:
            for doc_id, data in self.documents.items():
                uri = f"x-knowledge:///{doc_id}"
                f.write(f"{uri}\t{data['title']}\n")
    
    def export_integration_data(self):
        """Export data for integration with main index"""
        
        integration = {
            'source': 'PROJECT_KNOWLEDGE',
            'document_count': len(self.documents),
            'entity_count': len(self.entities),
            'concept_count': sum(len(c) for c in self.concepts.values()),
            'documents': self.documents,
            'entities': dict(self.entities),
            'concepts': {k: list(v) for k, v in self.concepts.items()},
            'cross_references': self.cross_references
        }
        
        with open(self.output_path / 'knowledge_integration.json', 'w') as f:
            json.dump(integration, f, indent=2)

def main():
    BASE_PATH = Path("/Users/ashleygeness/Desktop/ontology index")
    OUTPUT_PATH = BASE_PATH / "PROJECT_KNOWLEDGE_INDEX"
    
    indexer = ProjectKnowledgeIndexer(OUTPUT_PATH)
    
    print("Indexing project knowledge base...")
    indexer.process_knowledge_base_content()
    
    print("Building cross-references...")
    indexer.build_cross_references()
    
    print("Exporting indexes...")
    indexer.export_knowledge_index()
    indexer.export_integration_data()
    
    print("\n" + "="*80)
    print("PROJECT KNOWLEDGE INDEXED")
    print(f"Location: {OUTPUT_PATH}")
    print(f"\nStatistics:")
    print(f"  Documents: {len(indexer.documents)}")
    print(f"  Entities: {len(indexer.entities)}")
    print(f"  Concepts: {sum(len(c) for c in indexer.concepts.values())}")
    print(f"  Cross-references: {len(indexer.cross_references)}")
    print(f"\nFiles created:")
    print(f"  - knowledge_documents.json")
    print(f"  - knowledge_entities.json")
    print(f"  - knowledge_concepts.json")
    print(f"  - knowledge_cross_refs.json")
    print(f"  - knowledge_integration.json")
    print(f"  - KNOWLEDGE_INDEX.md")
    print(f"  - knowledge_uris.txt")

if __name__ == "__main__":
    main()
