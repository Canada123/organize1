import re
import json
from pathlib import Path
from collections import defaultdict

class GameDataExtractor:
    """Extract and validate structured game content from messy notes"""
    
    def __init__(self, vault_path):
        self.vault_path = Path(vault_path)
        self.data = {
            "datasets": {},
            "mechanics": {},
            "scenarios": [],
            "models": {},
            "unvalidated": []
        }
    
    def extract_dataset_refs(self, content):
        """Find dataset references with actual numbers"""
        patterns = {
            'ethics': r'ETHICS.*?(\d+,?\d*)\s*scenarios',
            'moral_machine': r'Moral Machine.*?(\d+,?\d*)\s*scenarios',
            'behaviors': r'(\d+,?\d*)\s*behavio(?:r|ral)\s*(?:terms|ontology)',
        }
        
        found = {}
        for name, pattern in patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                count = int(match.group(1).replace(',', ''))
                found[name] = {"count": count, "source": "text_claim"}
        
        return found
    
    def extract_data_structures(self, content):
        """Extract JSON structures and code blocks"""
        structures = []
        
        # JSON blocks
        json_pattern = r'```(?:json)?\s*(\{[\s\S]*?\})\s*```'
        for match in re.finditer(json_pattern, content):
            try:
                data = json.loads(match.group(1))
                structures.append({
                    "type": "json_structure",
                    "data": data,
                    "validated": True
                })
            except:
                structures.append({
                    "type": "json_structure", 
                    "data": match.group(1),
                    "validated": False
                })
        
        # Code examples
        code_pattern = r'```python\s*([\s\S]*?)```'
        for match in re.finditer(code_pattern, content):
            code = match.group(1)
            structures.append({
                "type": "code_example",
                "data": code,
                "validated": self._validate_code(code)
            })
        
        return structures
    
    def extract_mechanics(self, content):
        """Extract game mechanics descriptions"""
        mechanics = []
        
        # Pattern: "**Mechanic Name**:" followed by description
        pattern = r'\*\*([A-Z][^*]+?)\*\*:?\s*→?\s*([^\n]+)'
        
        for match in re.finditer(pattern, content):
            name = match.group(1).strip()
            desc = match.group(2).strip()
            
            # Filter for actual mechanics
            mechanic_keywords = ['test', 'measure', 'track', 'detect', 'evaluate', 'assess']
            if any(kw in desc.lower() for kw in mechanic_keywords):
                mechanics.append({
                    "name": name,
                    "description": desc,
                    "type": self._classify_mechanic(desc)
                })
        
        return mechanics
    
    def _validate_code(self, code):
        """Check if code has real imports/logic"""
        has_import = 'import' in code or 'from' in code
        has_logic = any(kw in code for kw in ['def ', 'class ', 'for ', 'if '])
        return has_import and has_logic
    
    def _classify_mechanic(self, desc):
        """Classify mechanic by what it measures"""
        if any(w in desc.lower() for w in ['trust', 'cooperat', 'team']):
            return 'social'
        elif any(w in desc.lower() for w in ['decision', 'choice', 'moral', 'ethical']):
            return 'moral_testing'
        elif any(w in desc.lower() for w in ['resource', 'economic', 'invest']):
            return 'economic'
        else:
            return 'general'
    
    def extract_all(self):
        """Process all markdown files"""
        for md_file in self.vault_path.rglob('*.md'):
            try:
                content = md_file.read_text(encoding='utf-8')
                
                # Skip if mostly URLs or very short
                if content.count('\n') < 10 or content.count('http') > len(content) / 50:
                    continue
                
                # Extract datasets
                datasets = self.extract_dataset_refs(content)
                if datasets:
                    self.data['datasets'][md_file.name] = datasets
                
                # Extract structures
                structures = self.extract_data_structures(content)
                if structures:
                    for struct in structures:
                        if struct['validated']:
                            if struct['type'] == 'json_structure':
                                self._merge_json_data(struct['data'])
                            elif struct['type'] == 'code_example':
                                self.data['scenarios'].append({
                                    "source": md_file.name,
                                    "code": struct['data']
                                })
                        else:
                            self.data['unvalidated'].append({
                                "file": md_file.name,
                                "content": struct['data'][:200]
                            })
                
                # Extract mechanics
                mechanics = self.extract_mechanics(content)
                if mechanics:
                    self.data['mechanics'][md_file.name] = mechanics
                    
            except Exception as e:
                print(f"Error processing {md_file}: {e}")
        
        return self.data
    
    def _merge_json_data(self, json_data):
        """Intelligently merge JSON structures"""
        if isinstance(json_data, dict):
            # Check for known structures
            if 'scenario_parameters' in json_data or 'agent_characteristics' in json_data:
                self.data['models']['moral_machine'] = json_data
            elif any(k in json_data for k in ['commonsense', 'deontology', 'justice']):
                self.data['models']['ethics'] = json_data
            elif 'triggers' in str(json_data) or 'complex' in str(json_data).lower():
                if 'psychological_complexes' not in self.data['models']:
                    self.data['models']['psychological_complexes'] = {}
                self.data['models']['psychological_complexes'].update(json_data)
    
    def generate_report(self, output_file='game_data_extracted.json'):
        """Generate validated data report"""
        report = {
            "summary": {
                "datasets_found": len(self.data['datasets']),
                "mechanics_found": sum(len(m) for m in self.data['mechanics'].values()),
                "models_extracted": len(self.data['models']),
                "code_examples": len(self.data['scenarios']),
                "unvalidated_items": len(self.data['unvalidated'])
            },
            "validated_data": {
                "datasets": self.data['datasets'],
                "models": self.data['models'],
                "mechanics_by_type": self._group_mechanics_by_type()
            },
            "implementation_ready": {
                "has_ethics_data": 'ethics' in self.data['models'],
                "has_moral_machine": 'moral_machine' in self.data['models'],
                "has_mechanics": len(self.data['mechanics']) > 0,
                "has_code": len(self.data['scenarios']) > 0
            },
            "next_steps": self._generate_next_steps()
        }
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def _group_mechanics_by_type(self):
        """Group mechanics by classification"""
        grouped = defaultdict(list)
        for file, mechanics in self.data['mechanics'].items():
            for mech in mechanics:
                grouped[mech['type']].append({
                    "name": mech['name'],
                    "description": mech['description'],
                    "source": file
                })
        return dict(grouped)
    
    def _generate_next_steps(self):
        """Determine what's needed next"""
        steps = []
        
        if not self.data['models'].get('ethics'):
            steps.append({
                "action": "Download ETHICS dataset",
                "command": "pip install datasets && python -c \"from datasets import load_dataset; load_dataset('hendrycks/ethics', 'commonsense')\""
            })
        
        if not self.data['models'].get('moral_machine'):
            steps.append({
                "action": "Clone Moral Machine repo",
                "command": "git clone https://github.com/path/to/moral-machine"
            })
        
        if len(self.data['mechanics']) < 10:
            steps.append({
                "action": "Define more game mechanics",
                "focus": "Need specific measurement mechanics for psychological testing"
            })
        
        return steps

if __name__ == "__main__":
    vault = input("Obsidian vault path: ").strip()
    
    print("Extracting game data from notes...")
    extractor = GameDataExtractor(vault)
    extractor.extract_all()
    
    print("Generating validation report...")
    report = extractor.generate_report()
    
    print(f"\n{'='*60}")
    print("EXTRACTION COMPLETE")
    print(f"{'='*60}")
    print(f"Datasets found: {report['summary']['datasets_found']}")
    print(f"Mechanics extracted: {report['summary']['mechanics_found']}")
    print(f"Models extracted: {report['summary']['models_extracted']}")
    print(f"Code examples: {report['summary']['code_examples']}")
    print(f"\nImplementation ready:")
    for key, value in report['implementation_ready'].items():
        print(f"  {key}: {value}")
    
    print(f"\nFull report saved to: game_data_extracted.json")
