import re
import json
from pathlib import Path
from collections import defaultdict

class MechanicsExtractor:
    """Extract actual game mechanics, not just dataset references"""
    
    def __init__(self):
        self.mechanics = {
            "action_modules": [],
            "distributed_patterns": [],
            "consensus_mechanisms": [],
            "chain_dynamics": [],
            "code_examples": []
        }
    
    def extract_action_modules(self, content):
        """Extract module definitions like 'Witness Module', 'Bet Module', etc"""
        
        # Pattern: ### NUMBER. **Module Name** or **Module Name Module**
        pattern = r'###\s*\d+\.\s*\*\*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+Module\*\*'
        
        modules = []
        for match in re.finditer(pattern, content):
            module_name = match.group(1).strip()
            start_pos = match.end()
            
            # Get description (next 200 chars or until next module)
            next_module = re.search(r'###\s*\d+\.', content[start_pos:])
            end_pos = start_pos + (next_module.start() if next_module else 200)
            description = content[start_pos:end_pos].strip()
            
            # Extract bullet points
            bullets = re.findall(r'^\s*-\s*([^\n]+)', description, re.MULTILINE)
            
            modules.append({
                "name": module_name,
                "action": module_name.lower(),
                "description": description[:200],
                "properties": bullets if bullets else []
            })
        
        return modules
    
    def extract_distributed_patterns(self, content):
        """Extract distributed system patterns (locks, leases, consensus)"""
        
        patterns = []
        
        # GitHub repo references with descriptions
        repo_pattern = r'\*\*GitHub:\*\*\s*\[(https://github\.com/[^\]]+)\]'
        
        for match in re.finditer(repo_pattern, content):
            url = match.group(1)
            
            # Get surrounding context
            start = max(0, match.start() - 500)
            end = min(len(content), match.end() + 500)
            context = content[start:end]
            
            # Extract pattern name from headers
            header_match = re.search(r'###\s*\*\*\d+\.\s*([^*]+)\*\*', context)
            if header_match:
                pattern_name = header_match.group(1).strip()
            else:
                # Fallback: extract from repo name
                pattern_name = url.split('/')[-1]
            
            # Extract key concepts
            concepts = []
            if 'lock' in context.lower():
                concepts.append('distributed_locking')
            if 'lease' in context.lower():
                concepts.append('lease_based')
            if 'ttl' in context.lower():
                concepts.append('time_to_live')
            if 'fence' in context.lower():
                concepts.append('fencing')
            if 'session' in context.lower():
                concepts.append('session_based')
            
            patterns.append({
                "name": pattern_name,
                "repo": url,
                "concepts": concepts,
                "use_case": self._infer_use_case(context)
            })
        
        return patterns
    
    def _infer_use_case(self, context):
        """Infer use case from context"""
        if 'commit' in context.lower():
            return 'commitment_enforcement'
        elif 'penalty' in context.lower():
            return 'penalty_system'
        elif 'player' in context.lower():
            return 'player_action_locks'
        else:
            return 'general_distributed_lock'
    
    def extract_chain_dynamics(self, content):
        """Extract chain/sequence examples"""
        
        chains = []
        
        # Pattern: numbered sequences like "1. Player A **ACTION**"
        chain_pattern = r'(\d+)\.\s+(?:Player\s+\w+\s+)?\*\*([A-Z]+)\*\*'
        
        current_chain = []
        for match in re.finditer(chain_pattern, content):
            step_num = int(match.group(1))
            action = match.group(2)
            
            if step_num == 1 and current_chain:
                chains.append(current_chain)
                current_chain = []
            
            current_chain.append({
                "step": step_num,
                "action": action.lower()
            })
        
        if current_chain:
            chains.append(current_chain)
        
        return chains
    
    def extract_code_blocks(self, content):
        """Extract code with language and context"""
        
        code_blocks = []
        
        # Pattern: ```language\ncode\n```
        pattern = r'```(\w+)\s*\n(.*?)```'
        
        for match in re.finditer(pattern, content, re.DOTALL):
            lang = match.group(1)
            code = match.group(2).strip()
            
            # Get preceding context
            start = max(0, match.start() - 300)
            context = content[start:match.start()]
            
            # Extract what this demonstrates
            header = re.search(r'###?\s*\*?\*?([^*\n]+)', context)
            purpose = header.group(1).strip() if header else "unknown"
            
            # Classify by content
            category = self._classify_code(code, lang)
            
            code_blocks.append({
                "language": lang,
                "purpose": purpose,
                "category": category,
                "code": code,
                "length": len(code.split('\n'))
            })
        
        return code_blocks
    
    def _classify_code(self, code, lang):
        """Classify code by what it demonstrates"""
        code_lower = code.lower()
        
        if 'lock' in code_lower and 'acquire' in code_lower:
            return 'distributed_locking'
        elif 'penalty' in code_lower or 'punish' in code_lower:
            return 'penalty_enforcement'
        elif 'commit' in code_lower and 'terms' in code_lower:
            return 'commitment_system'
        elif 'monitor' in code_lower or 'watch' in code_lower:
            return 'monitoring_system'
        else:
            return 'general_pattern'
    
    def extract_consensus_patterns(self, content):
        """Extract consensus/voting/validation patterns"""
        
        patterns = []
        
        # Look for consensus-related keywords
        consensus_section = re.search(
            r'(consensus|voting|validation|rank|validate).*?(?=###|\Z)',
            content,
            re.IGNORECASE | re.DOTALL
        )
        
        if consensus_section:
            text = consensus_section.group(0)
            
            # Extract bullet points
            bullets = re.findall(r'^\s*-\s*([^\n]+)', text, re.MULTILINE)
            
            patterns.append({
                "type": "consensus_mechanism",
                "properties": bullets,
                "text_sample": text[:300]
            })
        
        return patterns
    
    def process_file(self, filepath):
        """Process single file"""
        content = Path(filepath).read_text(encoding='utf-8')
        
        self.mechanics['action_modules'].extend(
            self.extract_action_modules(content)
        )
        
        self.mechanics['distributed_patterns'].extend(
            self.extract_distributed_patterns(content)
        )
        
        self.mechanics['chain_dynamics'].extend(
            self.extract_chain_dynamics(content)
        )
        
        self.mechanics['code_examples'].extend(
            self.extract_code_blocks(content)
        )
        
        self.mechanics['consensus_mechanisms'].extend(
            self.extract_consensus_patterns(content)
        )
    
    def generate_implementation_guide(self):
        """Generate actionable implementation guide"""
        
        guide = {
            "action_system": {
                "total_modules": len(self.mechanics['action_modules']),
                "modules": self.mechanics['action_modules'],
                "implementation": "Each module is an action players can take in chains"
            },
            "distributed_infrastructure": {
                "total_patterns": len(self.mechanics['distributed_patterns']),
                "patterns": self.mechanics['distributed_patterns'],
                "implementation": "Use these repos for commitment/penalty enforcement"
            },
            "chain_mechanics": {
                "total_chains": len(self.mechanics['chain_dynamics']),
                "example_chains": self.mechanics['chain_dynamics'][:5],
                "implementation": "Chains emerge from player actions, no forced endpoints"
            },
            "code_templates": {
                "total_examples": len(self.mechanics['code_examples']),
                "by_category": self._group_code_by_category(),
                "implementation": "Working code to adapt for your system"
            },
            "consensus": {
                "patterns": self.mechanics['consensus_mechanisms'],
                "implementation": "Jack Dorsey-style consensus, not blockchain"
            }
        }
        
        return guide
    
    def _group_code_by_category(self):
        """Group code examples by category"""
        grouped = defaultdict(list)
        for code in self.mechanics['code_examples']:
            grouped[code['category']].append({
                "language": code['language'],
                "purpose": code['purpose'],
                "lines": code['length']
            })
        return dict(grouped)
    
    def save_extracted(self, output_file='mechanics_extracted.json'):
        """Save extracted mechanics"""
        
        guide = self.generate_implementation_guide()
        
        with open(output_file, 'w') as f:
            json.dump(guide, f, indent=2)
        
        print(f"\n{'='*60}")
        print("MECHANICS EXTRACTION COMPLETE")
        print(f"{'='*60}")
        print(f"Action modules: {guide['action_system']['total_modules']}")
        print(f"Distributed patterns: {guide['distributed_infrastructure']['total_patterns']}")
        print(f"Chain examples: {guide['chain_mechanics']['total_chains']}")
        print(f"Code templates: {guide['code_templates']['total_examples']}")
        
        print(f"\nCode by category:")
        for category, examples in guide['code_templates']['by_category'].items():
            print(f"  {category}: {len(examples)} examples")
        
        print(f"\nSaved to: {output_file}")
        
        return guide

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        filepath = input("Enter path to mechanics file: ").strip()
    else:
        filepath = sys.argv[1]
    
    extractor = MechanicsExtractor()
    extractor.process_file(filepath)
    extractor.save_extracted()
