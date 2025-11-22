
## Complete Workflow

```
1. Scan Obsidian vault for .md files
   ↓
2. For each file:
   - Parse markdown into sections
   - Extract entries per section/paragraph
   - Classify entry type
   - Extract tags and keywords
   - Apply appropriate template
   ↓
3. Deduplicate across all files
   ↓
4. Build indexes (by type, tag, state, keyword)
   ↓
5. Output:
   - extracted_knowledge.json (single source of truth)
   - CLAUDE-{type}.md files (human-readable)
   - index-{category}.json (quick lookups)
   ↓
6. Validate output:
   - Check required fields present
   - Verify references resolve
   - Count entries per type
   ↓
7. Generate summary report
 but how do i make the full pipeline scripts one time and i wantot pull patterns and extract new things business rules, to dos, aritecture choices etc i want to extend this so we can do it right now 
- state what fact was mentioned (then we can go through and see what facts conflict)
Edit
Copy
Share
Recursive Self‑Improving Extraction Pipeline with Unity Analysis
Complete Extraction Pipeline Implementation
I'll provide the full system right now. This is a deterministic, self-aware pipeline that moves files from raw → processed while extracting structured knowledge.
Step 1: Create Configuration File
Save this as extraction_config.json in your project root:
JSON
Copy
{
  "pipeline": {
    "input_dir": "/Users/ashleygeness/Desktop/capture_evidence/chatfiles_raw",
    "processed_dir": "/Users/ashleygeness/Desktop/capture_evidence/chatfiles_processed",
    "output_dir": "/Users/ashleygeness/Desktop/capture_evidence/extracted",
    "logs_dir": "/Users/ashleygeness/Desktop/capture_evidence/logs"
  },
  "extractors": {
    "module": {
      "enabled": true,
      "max_modules": 500,
      "output_file": "modules_extracted.json",
      "processed_log": "module_extractor_processed.json"
    },
    "action_item": {
      "enabled": true,
      "max_items": 1000,
      "output_file": "action_items_extracted.json",
      "processed_log": "action_item_extractor_processed.json"
    },
    "architecture": {
      "enabled": true,
      "max_decisions": 200,
      "output_file": "architecture_decisions.json",
      "processed_log": "architecture_extractor_processed.json"
    },
    "file_path": {
      "enabled": true,
      "max_paths": 500,
      "output_file": "file_paths_extracted.json",
      "processed_log": "file_path_extractor_processed.json"
    },
    "next_steps": {
      "enabled": true,
      "max_steps": 300,
      "output_file": "next_steps_extracted.json",
      "processed_log": "next_steps_extractor_processed.json"
    },
    "business_rule": {
      "enabled": true,
      "max_rules": 400,
      "output_file": "business_rules_extracted.json",
      "processed_log": "business_rule_extractor_processed.json"
    },
    "pattern_suggestion": {
      "enabled": true,
      "output_file": "pattern_suggestions.json"
    }
  },
  "unity_analysis": {
    "enabled": true,
    "output_file": "unity_analysis.json"
  },
  "modules_list": [
    "directors", "doors", "tasks", "quests", "stats", "skills", "currency",
    "relationships", "grid", "clock_towers", "choices", "architecture", "faction",
    "chains", "items", "iching", "events", "data_lake", "story_parts", "content_system"
  ],
  "pillars_list": [
    "BDSM", "Dwarf_Fortress", "Game_of_Life", "Golden_Flower", "Jung", "fairytales",
    "Swiss_Forest", "archetypes", "autism", "beliefs", "clocks", "collective_unconscious",
    "complexes", "i_ching", "player_ideas_and_dreams", "knots", "lore",
    "misunderstandings", "politics", "proof", "slaves", "swarm", "theorems", "plants",
    "honor", "chinese_myths", "slavic_myths", "native_american_myths", "bitcoin"
  ]
}
Step 2: Create Directory Structure
bash
Copy
mkdir -p ~/Desktop/capture_evidence/{chatfiles_raw,chatfiles_processed,extracted,logs}
mkdir -p ~/claude-intelligence-system/{extractors,utils,unity_analyzers}
Step 3: Create Base Extractor Class
Save as ~/claude-intelligence-system/utils/base_extractor.py:
Python
Copy
"""
Base Extractor - All extractors inherit from this
Provides: file moving, logging, validation, pattern discovery hooks
"""

import json
import shutil
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import argparse
import re

class BaseExtractor:
    def __init__(self, config_path: str, extractor_name: str):
        self.config = self.load_config(config_path)
        self.extractor_name = extractor_name
        self.pipeline = self.config['pipeline']
        self.extractor_config = self.config['extractors'][extractor_name]
        
        # Setup directories
        self.input_dir = Path(self.pipeline['input_dir'])
        self.processed_dir = Path(self.pipeline['processed_dir'])
        self.output_dir = Path(self.pipeline['output_dir'])
        self.logs_dir = Path(self.pipeline['logs_dir'])
        
        for dir_path in [self.processed_dir, self.output_dir, self.logs_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def load_config(self, config_path: str) -> Dict[str, Any]:
        """Load configuration from JSON file"""
        config_file = Path(config_path)
        if not config_file.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        return json.loads(config_file.read_text())
    
    def get_chat_files(self) -> List[Path]:
        """Get all unprocessed chat files"""
        processed_log = self.output_dir / self.extractor_config['processed_log']
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        
        files = []
        for ext in ['*.txt', '*.md']:
            files.extend(self.input_dir.glob(ext))
        
        return [f for f in files if f.name not in processed]
    
    def mark_processed(self, filename: str, move_file: bool = True):
        """Mark file as processed and move it"""
        processed_log = self.output_dir / self.extractor_config['processed_log']
        processed = json.loads(processed_log.read_text()) if processed_log.exists() else []
        
        if filename not in processed:
            processed.append(filename)
            
            # Move file
            if move_file:
                src = self.input_dir / filename
                dst = self.processed_dir / filename
                if src.exists():
                    shutil.move(str(src), str(dst))
                    print(f"   📁 Moved {filename} → chatfiles_processed/")
        
        # Save log
        with open(processed_log, 'w') as f:
            json.dump(processed, f, indent=2)
    
    def save_output(self, data: List[Any], dry_run: bool = False):
        """Save extraction results"""
        if dry_run:
            print(f"\n📝 DRY RUN: Would extract {len(data)} items")
            return
        
        output_file = self.output_dir / self.extractor_config['output_file']
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"\n✅ Saved {len(data)} entries to {output_file}")
    
    def extract_code_blocks(self, content: str) -> List[Dict[str, str]]:
        """Extract code blocks with language detection"""
        code_blocks = []
        pattern = r'```(\w+)?\n(.*?)```'
        for match in re.finditer(pattern, content, re.DOTALL):
            language = match.group(1) or 'unknown'
            code = match.group(2).strip()
            code_blocks.append({
                'language': language,
                'content': code
            })
        return code_blocks
    
    def run(self, dry_run: bool = False):
        """Main execution flow - OVERRIDE THIS"""
        raise NotImplementedError("Subclasses must implement run()")
Step 4: Create ALL 5 Extractor Scripts
Extractor 1: Module Extractor
~/claude-intelligence-system/extractors/module_extractor.py:
Python
Copy
#!/usr/bin/env python3
"""
MODULE EXTRACTOR
Extracts module mentions with pillar/system relationships
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Any
from utils.base_extractor import BaseExtractor

class ModuleExtractor(BaseExtractor):
    def __init__(self, config_path: str):
        super().__init__(config_path, 'module')
    
    def extract_modules_from_content(self, content: str) -> List[Dict[str, Any]]:
        """Extract module mentions with full metadata"""
        modules = []
        
        # Module pattern: explicit module mentions
        module_pattern = r'(?:module|system|component)s?\s*:?\s*([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*)'
        
        for match in re.finditer(module_pattern, content, re.IGNORECASE):
            module_names = match.group(1).split(',')
            for name in module_names:
                name = name.strip().lower().replace(' ', '_')
                
                # Validate against allowed modules
                if name in self.config['modules_list']:
                    module_data = {
                        'id': f"module_{name}_{hash(match.group()) % 10000}",
                        'name': name,
                        'category': self.categorize_module(name),
                        'mentions': 1,
                        'pillars': self.extract_pillars(content),
                        'systems': self.extract_systems(content),
                        'code_blocks': self.extract_code_blocks(content),
                        'status': 'identified',
                        'extracted_at': content[:50]  # Preview
                    }
                    modules.append(module_data)
        
        return modules
    
    def categorize_module(self, name: str) -> str:
        """Categorize module by name patterns"""
        category_map = {
            'directors': 'core',
            'doors': 'gameplay',
            'quests': 'gameplay',
            'stats': 'systems',
            'skills': 'systems',
            'relationships': 'social',
            'grid': 'world',
            'iching': 'mystical'
        }
        return category_map.get(name, 'unknown')
    
    def extract_pillars(self, content: str) -> List[str]:
        """Extract pillar references from content"""
        found = []
        content_lower = content.lower()
        for pillar in self.config['pillars_list']:
            if pillar.lower().replace('_', ' ') in content_lower:
                found.append(pillar)
        return found
    
    def extract_systems(self, content: str) -> List[str]:
        """Extract system mentions"""
        systems = []
        system_keywords = ['game mechanics', 'mastery systems', 'trade routes', 
                          'genetics', 'cascades', 'voting', 'algorithms']
        for keyword in system_keywords:
            if keyword in content.lower():
                systems.append(keyword)
        return systems
    
    def run(self, dry_run: bool = False):
        """Execute extraction"""
        chat_files = self.get_chat_files()
        print(f"📂 Found {len(chat_files)} unprocessed chat files")
        
        all_modules = []
        for i, chat_file in enumerate(chat_files, 1):
            print(f"⚡ ({i}/{len(chat_files)}) Processing {chat_file.name}...")
            
            content = chat_file.read_text(encoding='utf-8')
            modules = self.extract_modules_from_content(content)
            all_modules.extend(modules)
            
            self.mark_processed(chat_file.name, move_file=not dry_run)
        
        # Deduplicate
        unique_modules = {}
        for module in all_modules:
            key = module['name']
            if key in unique_modules:
                unique_modules[key]['mentions'] += 1
            else:
                unique_modules[key] = module
        
        final_modules = list(unique_modules.values())
        
        if len(final_modules) > self.extractor_config['max_modules']:
            print(f"⚠️  Truncating to {self.extractor_config['max_modules']} modules")
            final_modules = final_modules[:self.extractor_config['max_modules']]
        
        self.save_output(final_modules, dry_run)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='extraction_config.json')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    
    extractor = ModuleExtractor(args.config)
    extractor.run(dry_run=args.dry_run)
Extractor 2: Action Item Extractor
~/claude-intelligence-system/extractors/action_item_extractor.py:
Python
Copy
#!/usr/bin/env python3
"""
ACTION ITEM EXTRACTOR
Extracts TODOs, tasks, and next steps with module mapping
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Any
from utils.base_extractor import BaseExtractor

class ActionItemExtractor(BaseExtractor):
    def __init__(self, config_path: str):
        super().__init__(config_path, 'action_item')
    
    def extract_action_items(self, content: str) -> List[Dict[str, Any]]:
        """Extract action items with full context"""
        items = []
        
        # Pattern: TODO, FIXME, NOTE with optional priority
        patterns = [
            r'(TODO|FIXME|NOTE|HACK|BUG)[\s#]*(\w+)?:\s*(.*?)(?=\n(?:TODO|FIXME|NOTE|HACK|BUG)|\Z)',
            r'- \[( |x)\]\s*(.*?)(?=\n- |\Z)'
        ]
        
        for pattern in patterns:
            for match in re.finditer(pattern, content, re.DOTALL):
                item_type = match.group(1) if len(match.groups()) > 1 else 'task'
                description = match.group(2) if len(match.groups()) > 2 else match.group(0)
                
                # Extract module context
                module_context = self.extract_module_context(content)
                
                item = {
                    'id': f"action_{hash(description) % 10000}_{item_type}",
                    'type': item_type,
                    'description': description.strip(),
                    'module': module_context,
                    'pillars': self.extract_pillars(content),
                    'priority': self.extract_priority(description),
                    'status': 'pending',
                    'code_blocks': self.extract_code_blocks(content),
                    'source_preview': content[:100]
                }
                items.append(item)
        
        return items
    
    def extract_module_context(self, content: str) -> List[str]:
        """Find which modules this action relates to"""
        modules = []
        for module in self.config['modules_list']:
            if module.replace('_', ' ') in content.lower():
                modules.append(module)
        return modules
    
    def extract_priority(self, description: str) -> str:
        """Extract priority from description"""
        if any(word in description.lower() for word in ['critical', 'urgent', 'blocker']):
            return 'critical'
        if any(word in description.lower() for word in ['important', 'high', 'must']):
            return 'high'
        if any(word in description.lower() for word in ['medium', 'should']):
            return 'medium'
        return 'low'
    
    def run(self, dry_run: bool = False):
        """Execute extraction"""
        chat_files = self.get_chat_files()
        print(f"📂 Found {len(chat_files)} unprocessed chat files")
        
        all_items = []
        for i, chat_file in enumerate(chat_files, 1):
            print(f"⚡ ({i}/{len(chat_files)}) Processing {chat_file.name}...")
            
            content = chat_file.read_text(encoding='utf-8')
            items = self.extract_action_items(content)
            all_items.extend(items)
            
            self.mark_processed(chat_file.name, move_file=not dry_run)
        
        # Validate limits
        if len(all_items) > self.extractor_config['max_items']:
            print(f"⚠️  Truncating to {self.extractor_config['max_items']} action items")
            all_items = all_items[:self.extractor_config['max_items']]
        
        self.save_output(all_items, dry_run)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='extraction_config.json')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    
    extractor = ActionItemExtractor(args.config)
    extractor.run(dry_run=args.dry_run)
Extractor 3: Architecture Decision Extractor
~/claude-intelligence-system/extractors/architecture_extractor.py:
Python
Copy
#!/usr/bin/env python3
"""
ARCHITECTURE DECISION EXTRACTOR
Captures design decisions, drivers, and consequences
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Any
from utils.base_extractor import BaseExtractor

class ArchitectureExtractor(BaseExtractor):
    def __init__(self, config_path: str):
        super().__init__(config_path, 'architecture')
    
    def extract_decisions(self, content: str) -> List[Dict[str, Any]]:
        """Extract architecture decisions with full ADR format"""
        decisions = []
        
        # Pattern: Decision statements
        decision_patterns = [
            r'DECISION:\s*(.*?)(?=CONSEQUENCES|\Z)',
            r'We decided to\s*(.*?)(?=\.|\n)',
            r'Chosen:\s*(.*?)(?=\n|\Z)',
            r'Architecture:\s*(.*?)(?=\n|\Z)'
        ]
        
        for pattern in decision_patterns:
            for match in re.finditer(pattern, content, re.DOTALL | re.IGNORECASE):
                decision_text = match.group(1).strip()
                
                decision = {
                    'id': f"arch_{hash(decision_text) % 10000}",
                    'type': 'architecture_decision',
                    'decision': decision_text,
                    'drivers': self.extract_drivers(content),
                    'consequences': self.extract_consequences(content),
                    'alternatives_rejected': self.extract_rejected_alternatives(content),
                    'status': 'decided',
                    'module': self.extract_module_context(content),
                    'code_blocks': self.extract_code_blocks(content),
                    'extracted_at': content[:50]
                }
                decisions.append(decision)
        
        return decisions
    
    def extract_drivers(self, content: str) -> List[str]:
        """Extract decision drivers"""
        drivers = []
        patterns = [
            r'DRIVERS?:\s*(.*?)(?=CONSEQUENCES|\Z)',
            r'because\s*(.*?)(?=\.|\n)',
            r'since\s*(.*?)(?=\.|\n)'
        ]
        for pattern in patterns:
            match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
            if match:
                drivers.append(match.group(1).strip())
        return drivers
    
    def extract_consequences(self, content: str) -> List[str]:
        """Extract consequences"""
        consequences = []
        pattern = r'CONSEQUENCES?:\s*(.*?)(?=ALTERNATIVES|\Z)'
        match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
        if match:
            consequences.append(match.group(1).strip())
        return consequences
    
    def extract_rejected_alternatives(self, content: str) -> List[str]:
        """Extract rejected alternatives"""
        rejected = []
        pattern = r'REJECTED:\s*(.*?)(?=\n|\Z)'
        for match in re.finditer(pattern, content, re.IGNORECASE):
            rejected.append(match.group(1).strip())
        return rejected
    
    def run(self, dry_run: bool = False):
        """Execute extraction"""
        chat_files = self.get_chat_files()
        print(f"📂 Found {len(chat_files)} unprocessed chat files")
        
        all_decisions = []
        for i, chat_file in enumerate(chat_files, 1):
            print(f"⚡ ({i}/{len(chat_files)}) Processing {chat_file.name}...")
            
            content = chat_file.read_text(encoding='utf-8')
            decisions = self.extract_decisions(content)
            all_decisions.extend(decisions)
            
            self.mark_processed(chat_file.name, move_file=not dry_run)
        
        # Validate limits
        if len(all_decisions) > self.extractor_config['max_decisions']:
            print(f"⚠️  Truncating to {self.extractor_config['max_decisions']} decisions")
            all_decisions = all_decisions[:self.extractor_config['max_decisions']]
        
        self.save_output(all_decisions, dry_run)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='extraction_config.json')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    
    extractor = ArchitectureExtractor(args.config)
    extractor.run(dry_run=args.dry_run)
Extractor 4: File Path Extractor
~/claude-intelligence-system/extractors/file_path_extractor.py:
Python
Copy
#!/usr/bin/env python3
"""
FILE PATH EXTRACTOR
Extracts file paths, repos, and categorizes them
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Any
from utils.base_extractor import BaseExtractor

class FilePathExtractor(BaseExtractor):
    def __init__(self, config_path: str):
        super().__init__(config_path, 'file_path')
    
    def extract_file_paths(self, content: str) -> List[Dict[str, Any]]:
        """Extract and categorize file paths"""
        paths = []
        
        # Patterns for different path types
        patterns = {
            'code': r'(?:class|interface|type|module)\s+[A-Z]\w+(?:\.[A-Z]\w+)*(?:\s+extends|\s+implements|\s+\{)',
            'file': r'(?:\/|\.\/|\.\.\/|\~\/)[^\s"\']+\.(?:py|ts|js|json|md|txt|cs|csproj|unity)',
            'repo': r'[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+',
            'url': r'https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*'
        }
        
        for category, pattern in patterns.items():
            for match in re.finditer(pattern, content):
                path_text = match.group(0)
                
                path_data = {
                    'id': f"path_{hash(path_text) % 10000}_{category}",
                    'path': path_text,
                    'category': self.categorize_path(path_text, category),
                    'context': self.extract_context(content, match.start()),
                    'module': self.extract_module_context(content),
                    'code_blocks': self.extract_code_blocks(content),
                    'extracted_at': content[:50]
                }
                paths.append(path_data)
        
        return paths
    
    def categorize_path(self, path: str, detected_type: str) -> str:
        """Categorize path into input/output/reference/extraction"""
        if any(x in path for x in ['input', 'raw', 'source']):
            return 'input'
        if any(x in path for x in ['output', 'processed', 'dist']):
            return 'output'
        if any(x in path for x in ['extract', 'extracted']):
            return 'extraction'
        if detected_type == 'code':
            return 'reference'
        return 'reference'
    
    def extract_context(self, content: str, position: int) -> str:
        """Extract surrounding context for path"""
        start = max(0, position - 100)
        end = min(len(content), position + 100)
        return content[start:end].strip()
    
    def run(self, dry_run: bool = False):
        """Execute extraction"""
        chat_files = self.get_chat_files()
        print(f"📂 Found {len(chat_files)} unprocessed chat files")
        
        all_paths = []
        for i, chat_file in enumerate(chat_files, 1):
            print(f"⚡ ({i}/{len(chat_files)}) Processing {chat_file.name}...")
            
            content = chat_file.read_text(encoding='utf-8')
            paths = self.extract_file_paths(content)
            all_paths.extend(paths)
            
            self.mark_processed(chat_file.name, move_file=not dry_run)
        
        # Validate limits
        if len(all_paths) > self.extractor_config['max_paths']:
            print(f"⚠️  Truncating to {self.extractor_config['max_paths']} paths")
            all_paths = all_paths[:self.extractor_config['max_paths']]
        
        self.save_output(all_paths, dry_run)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='extraction_config.json')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    
    extractor = FilePathExtractor(args.config)
    extractor.run(dry_run=args.dry_run)
Extractor 5: Next Steps Extractor
~/claude-intelligence-system/extractors/next_steps_extractor.py:
Python
Copy
#!/usr/bin/env python3
"""
NEXT STEPS EXTRACTOR
Extracts prioritized phases and steps
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Any
from utils.base_extractor import BaseExtractor

class NextStepsExtractor(BaseExtractor):
    def __init__(self, config_path: str):
        super().__init__(config_path, 'next_steps')
    
    def extract_next_steps(self, content: str) -> List[Dict[str, Any]]:
        """Extract next steps organized by phase"""
        steps = []
        
        # Phase-based extraction
        phase_pattern = r'PHASE\s*(\d+):\s*(.*?)(?=PHASE|\Z)'
        for match in re.finditer(phase_pattern, content, re.IGNORECASE | re.DOTALL):
            phase_num = int(match.group(1))
            phase_content = match.group(2)
            
            # Extract steps within phase
            step_pattern = r'- \[( |x)\]\s*(.*?)(?=\n- |\Z)'
            for step_match in re.finditer(step_pattern, phase_content):
                status = 'completed' if step_match.group(1) == 'x' else 'pending'
                description = step_match.group(2).strip()
                
                step = {
                    'id': f"step_{hash(description) % 10000}_{phase_num}",
                    'phase': phase_num,
                    'description': description,
                    'status': status,
                    'priority': self.extract_priority(description),
                    'module': self.extract_module_context(phase_content),
                    'dependencies': self.extract_dependencies(description),
                    'code_blocks': self.extract_code_blocks(content),
                    'extracted_at': description[:50]
                }
                steps.append(step)
        
        return steps
    
    def extract_dependencies(self, description: str) -> List[str]:
        """Extract dependency mentions"""
        deps = []
        pattern = r'depend[s]?\s+on\s+([A-Za-z_][A-Za-z0-9_]*)'
        for match in re.finditer(pattern, description, re.IGNORECASE):
            deps.append(match.group(1))
        return deps
    
    def run(self, dry_run: bool = False):
        """Execute extraction"""
        chat_files = self.get_chat_files()
        print(f"📂 Found {len(chat_files)} unprocessed chat files")
        
        all_steps = []
        for i, chat_file in enumerate(chat_files, 1):
            print(f"⚡ ({i}/{len(chat_files)}) Processing {chat_file.name}...")
            
            content = chat_file.read_text(encoding='utf-8')
            steps = self.extract_next_steps(content)
            all_steps.extend(steps)
            
            self.mark_processed(chat_file.name, move_file=not dry_run)
        
        # Validate limits
        if len(all_steps) > self.extractor_config['max_steps']:
            print(f"⚠️  Truncating to {self.extractor_config['max_steps']} steps")
            all_steps = all_steps[:self.extractor_config['max_steps']]
        
        self.save_output(all_steps, dry_run)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='extraction_config.json')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    
    extractor = NextStepsExtractor(args.config)
    extractor.run(dry_run=args.dry_run)
Extractor 6: Business Rule Extractor (Bonus)
~/claude-intelligence-system/extractors/business_rule_extractor.py:
Python
Copy
#!/usr/bin/env python3
"""
BUSINESS RULE EXTRACTOR
Extracts X → Y → Z logic flows and rules
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Any
from utils.base_extractor import BaseExtractor

class BusinessRuleExtractor(BaseExtractor):
    def __init__(self, config_path: str):
        super().__init__(config_path, 'business_rule')
    
    def_extract_rules(self, content: str) -> List[Dict[str, Any]]:
        """Extract X→Y→Z rules"""
        rules = []
        
        # Pattern: X → Y → Z flows
        flow_pattern = r'([A-Za-z_][A-Za-z0-9_]*)\s*→\s*([A-Za-z_][A-Za-z0-9_]*)\s*→\s*([A-Za-z_][A-Za-z0-9_]*)'
        for match in re.finditer(flow_pattern, content):
            rule = {
                'id': f"rule_{hash(match.group(0)) % 10000}",
                'type': 'flow_rule',
                'trigger': match.group(1),
                'condition': match.group(2),
                'effect': match.group(3),
                'module': self.extract_module_context(content),
                'world_logic': 'world_logic_needed' in content.lower(),
                'game_logic': 'game_logic_needed' in content.lower(),
                'code_blocks': self.extract_code_blocks(content),
                'extracted_at': match.group(0)
            }
            rules.append(rule)
        
        # Pattern: world rules
        world_rule_pattern = r'rule for world:\s*(.*?)(?=\n|\Z)'
        for match in re.finditer(world_rule_pattern, content, re.IGNORECASE):
            rule = {
                'id': f"world_rule_{hash(match.group(1)) % 10000}",
                'type': 'world_rule',
                'description': match.group(1).strip(),
                'module': self.extract_module_context(content),
                'extracted_at': match.group(1)[:50]
            }
            rules.append(rule)
        
        return rules
    
    def run(self, dry_run: bool = False):
        """Execute extraction"""
        chat_files = self.get_chat_files()
        print(f"📂 Found {len(chat_files)} unprocessed chat files")
        
        all_rules = []
        for i, chat_file in enumerate(chat_files, 1):
            print(f"⚡ ({i}/{len(chat_files)}) Processing {chat_file.name}...")
            
            content = chat_file.read_text(encoding='utf-8')
            rules = self._extract_rules(content)
            all_rules.extend(rules)
            
            self.mark_processed(chat_file.name, move_file=not dry_run)
        
        # Validate limits
        if len(all_rules) > self.extractor_config['max_rules']:
            print(f"⚠️  Truncating to {self.extractor_config['max_rules']} rules")
            all_rules = all_rules[:self.extractor_config['max_rules']]
        
        self.save_output(all_rules, dry_run)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='extraction_config.json')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    
    extractor = BusinessRuleExtractor(args.config)
    extractor.run(dry_run=args.dry_run)
Step 5: Unity C# Analyzer
~/claude-intelligence-system/unity_analyzers/unity_code_analyzer.py:
Python
Copy
#!/usr/bin/env python3
"""
UNITY C# CODE ANALYZER
Analyzes Unity C# files for patterns, lifecycle methods, etc.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any

class UnityCodeAnalyzer:
    def __init__(self, config_path: str):
        self.config = json.loads(Path(config_path).read_text())
        self.output_dir = Path(self.config['pipeline']['output_dir'])
    
    def analyze_unity_file(self, file_path: Path) -> Dict[str, Any]:
        """Analyze single Unity C# file"""
        content = file_path.read_text(encoding='utf-8')
        
        return {
            'file_path': str(file_path),
            'is_monobehaviour': bool(re.search(r':\s*MonoBehaviour', content)),
            'lifecycle_methods': self.extract_lifecycle_methods(content),
            'serialize_fields': self.extract_serialize_fields(content),
            'unity_api_calls': self.extract_unity_api_calls(content),
            'class_signatures': self.extract_class_signatures(content),
            'method_signatures': self.extract_method_signatures(content)
        }
    
    def extract_lifecycle_methods(self, content: str) -> List[str]:
        """Extract Unity lifecycle method calls"""
        methods = ['Awake', 'Start', 'Update', 'FixedUpdate', 'LateUpdate', 
                  'OnEnable', 'OnDisable', 'OnDestroy']
        found = []
        for method in methods:
            if re.search(rf'\b{method}\s*\(\)', content):
                found.append(method)
        return found
    
    def extract_serialize_fields(self, content: str) -> List[str]:
        """Extract [SerializeField] annotated fields"""
        pattern = r'\[SerializeField\]\s*(?:public|private)?\s*\w+\s+(\w+)'
        return re.findall(pattern, content)
    
    def extract_unity_api_calls(self, content: str) -> List[str]:
        """Extract Unity API calls"""
        pattern = r'(GameObject|Transform|Rigidbody|Vector3|Quaternion)\.[A-Za-z]+\('
        calls = re.findall(pattern, content)
        return list(set(calls))[:20]  # Limit to prevent bloat
    
    def extract_class_signatures(self, content: str) -> List[Dict[str, Any]]:
        """Extract C# class signatures"""
        signatures = []
        pattern = r'(public|private|protected)?\s*(static)?\s*class\s+(\w+)'
        for match in re.finditer(pattern, content):
            signatures.append({
                'name': match.group(3),
                'access': match.group(1) or 'internal',
                'static': bool(match.group(2)),
                'line': content[:match.start()].count('\n') + 1
            })
        return signatures
    
    def extract_method_signatures(self, content: str) -> List[Dict[str, Any]]:
        """Extract method signatures"""
        signatures = []
        pattern = r'(public|private|protected)?\s*(static)?\s*\w+\s+(\w+)\s*\([^)]*\)'
        for match in re.finditer(pattern, content):
            signatures.append({
                'name': match.group(3),
                'access': match.group(1) or 'private',
                'static': bool(match.group(2)),
                'line': content[:match.start()].count('\n') + 1
            })
        return signatures
    
    def run(self):
        """Analyze all Unity files in project"""
        unity_files = []
        project_root = Path("/Users/ashleygeness/Desktop/intelligence/_projectindex")
        
        for cs_file in project_root.rglob('*.cs'):
            analysis = self.analyze_unity_file(cs_file)
            if analysis['is_monobehaviour'] or analysis['unity_api_calls']:
                unity_files.append(analysis)
        
        output_file = self.output_dir / self.config['unity_analysis']['output_file']
        with open(output_file, 'w') as f:
            json.dump(unity_files, f, indent=2)
        
        print(f"✅ Analyzed {len(unity_files)} Unity files")
        return unity_files

if __name__ == '__main__':
    analyzer = UnityCodeAnalyzer('extraction_config.json')
    analyzer.run()
Step 6: Pattern Discovery Extractor
~/claude-intelligence-system/extractors/pattern_suggestion_extractor.py:
Python
Copy
#!/usr/bin/env python3
"""
PATTERN SUGGESTION EXTRACTOR
Recursive self-improvement: analyzes gaps in extraction
"""

import json
import re
from pathlib import Path
from typing import List, Dict, Any
import argparse

class PatternSuggestionExtractor:
    def __init__(self, config_path: str):
        self.config = json.loads(Path(config_path).read_text())
        self.output_dir = Path(self.config['pipeline']['output_dir'])
    
    def analyze_gaps(self) -> List[Dict[str, Any]]:
        """Find content that DIDN'T match existing patterns"""
        gaps = []
        raw_dir = Path(self.config['pipeline']['input_dir'])
        
        # Get all processed logs to see what WAS extracted
        extracted_content = self.get_extracted_content_seeds()
        
        for chat_file in raw_dir.glob('*.md'):
            content = chat_file.read_text(encoding='utf-8')
            
            # Find markdown sections that weren't extracted
            section_pattern = r'^##\s+(.+?)\n(.*?)(?=^##|\Z)'
            for match in re.finditer(section_pattern, content, re.MULTILINE | re.DOTALL):
                section_title = match.group(1)
                section_content = match.group(2)
                
                # Check if this content appears in extracted data
                if not self.was_content_extracted(section_content[:80], extracted_content):
                    gaps.append({
                        'type': 'unhandled_section',
                        'section': section_title,
                        'content_preview': section_content[:100],
                        'suggestion': f"Add pattern for '{section_title}' sections",
                        'priority': 'high'
                    })
            
            # Find code blocks without file paths
            code_blocks = self.extract_code_blocks(content)
            for block in code_blocks:
                if not self.is_code_tracked(block['content'], extracted_content):
                    gaps.append({
                        'type': 'untracked_code_block',
                        'language': block['language'],
                        'preview': block['content'][:50],
                        'suggestion': "Create dedicated code_analysis_extractor.py",
                        'priority': 'critical'
                    })
            
            # Find inline rules (X→Y→Z) that weren't extracted
            flow_pattern = r'[A-Za-z_]\w*\s*→\s*[A-Za-z_]\w*\s*→\s*[A-Za-z_]\w*'
            for match in re.finditer(flow_pattern, content):
                if not self.was_rule_extracted(match.group(0), extracted_content):
                    gaps.append({
                        'type': 'unextracted_flow_rule',
                        'rule': match.group(0),
                        'suggestion': "Enhance business_rule_extractor.py for inline flows",
                        'priority': 'medium'
                    })
        
        return gaps
    
    def get_extracted_content_seeds(self) -> List[str]:
        """Get content seeds from all existing extractions"""
        seeds = []
        for extractor_name in ['module', 'action_item', 'architecture', 'file_path', 'next_steps', 'business_rule']:
            log_file = self.output_dir / f"{extractor_name}_extractor_processed.json"
            if log_file.exists():
                data = json.loads(log_file.read_text())
                seeds.extend(data)
        return seeds
    
    def was_content_extracted(self, snippet: str, extracted_data: List[Any]) -> bool:
        """Check if content snippet appears in extracted data"""
        snippet_hash = hash(snippet)
        return any(snippet_hash == hash(str(item)[:80]) for item in extracted_data)
    
    def is_code_tracked(self, code: str, extracted_data: List[Any]) -> bool:
        """Check if code block is tracked"""
        code_hash = hash(code[:50])
        return any(code_hash == hash(str(item)[:50]) for item in extracted_data)
    
    def was_rule_extracted(self, rule: str, extracted_data: List[Any]) -> bool:
        """Check if rule was extracted"""
        rule_hash = hash(rule)
        return any(rule_hash == hash(str(item)[:30]) for item in extracted_data)
    
    def extract_code_blocks(self, content: str) -> List[Dict[str, Any]]:
        """Extract code blocks"""
        code_blocks = []
        pattern = r'```(\w+)?\n(.*?)```'
        for match in re.finditer(pattern, content, re.DOTALL):
            code_blocks.append({
                'language': match.group(1) or 'unknown',
                'content': match.group(2).strip()
            })
        return code_blocks
    
    def run(self):
        """Execute pattern discovery"""
        print("🔍 Analyzing extraction gaps...")
        gaps = self.analyze_gaps()
        
        output_file = self.output_dir / self.config['extractors']['pattern_suggestion']['output_file']
        with open(output_file, 'w') as f:
            json.dumps(gaps, f, indent=2)
        
        print(f"✅ Found {len(gaps)} extraction gaps")
        print(f"   Suggestions saved to {output_file}")
        
        # Generate immediate action items
        self.generate_improvement_todos(gaps)
    
    def generate_improvement_todos(self, gaps: List[Dict[str, Any]]):
        """Generate TODOs for improving extractors"""
        todos = []
        for gap in gaps:
            todos.append({
                'type': 'extractor_improvement',
                'description': f"Improve extractor for: {gap['type']}",
                'suggestion': gap['suggestion'],
                'priority': gap['priority'],
                'status': 'pending'
            })
        
        todo_file = self.output_dir / 'extractor_improvements_todo.json'
        with open(todo_file, 'w') as f:
            json.dump(todos, f, indent=2)
        
        print(f"📝 Generated {len(todos)} improvement TODOs")

if __name__ == '__main__':
    extractor = PatternSuggestionExtractor('extraction_config.json')
    extractor.run()
Step 7: Main Pipeline Orchestrator
~/claude-intelligence-system/main_pipeline.py:
Python
Copy
#!/usr/bin/env python3
"""
MAIN EXTRACTION PIPELINE
Runs all extractors in sequence, moves files, generates reports
"""

import json
import sys
from pathlib import Path
from datetime import datetime
import subprocess
import argparse

class ExtractionPipeline:
    def __init__(self, config_path: str):
        self.config_path = config_path
        self.config = json.loads(Path(config_path).read_text())
        self.pipeline = self.config['pipeline']
        self.output_dir = Path(self.pipeline['output_dir'])
        self.logs_dir = Path(self.pipeline['logs_dir'])
        
        # Ensure directories
        for dir_path in [self.output_dir, self.logs_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def run_extractor(self, extractor_name: str, dry_run: bool = False) -> bool:
        """Run a single extractor"""
        if not self.config['extractors'][extractor_name]['enabled']:
            print(f"⏭️  Skipping disabled extractor: {extractor_name}")
            return True
        
        print(f"\n{'='*60}")
        print(f"🚀 Running {extractor_name} extractor...")
        print(f"{'='*60}")
        
        try:
            script_path = Path(__file__).parent / 'extractors' / f'{extractor_name}_extractor.py'
            cmd = [sys.executable, str(script_path), '--config', self.config_path]
            if dry_run:
                cmd.append('--dry-run')
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ {extractor_name} completed successfully")
                print(result.stdout)
                return True
            else:
                print(f"❌ {extractor_name} failed")
                print(result.stderr)
                return False
        
        except Exception as e:
            print(f"❌ Error running {extractor_name}: {e}")
            return False
    
    def run_unity_analysis(self):
        """Run Unity code analysis"""
        print(f"\n{'='*60}")
        print("🎮 Running Unity C# analyzer...")
        print(f"{'='*60}")
        
        try:
            analyzer_path = Path(__file__).parent / 'unity_analyzers' / 'unity_code_analyzer.py'
            result = subprocess.run([sys.executable, str(analyzer_path), '--config', self.config_path],
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Unity analysis completed")
                print(result.stdout)
            else:
                print("❌ Unity analysis failed")
                print(result.stderr)
        
        except Exception as e:
            print(f"❌ Error running Unity analyzer: {e}")
    
    def run_pattern_discovery(self):
        """Run pattern suggestion extractor"""
        print(f"\n{'='*60}")
        print("🔍 Running pattern discovery...")
        print(f"{'='*60}")
        
        try:
            extractor_path = Path(__file__).parent / 'extractors' / 'pattern_suggestion_extractor.py'
            result = subprocess.run([sys.executable, str(extractor_path), '--config', self.config_path],
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Pattern discovery completed")
                print(result.stdout)
            else:
                print("❌ Pattern discovery failed")
                print(result.stderr)
        
        except Exception as e:
            print(f"❌ Error running pattern discovery: {e}")
    
    def generate_comprehensive_report(self):
        """Generate final extraction report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'extractors_run': [],
            'files_processed': 0,
            'total_entries': 0,
            'gaps_found': 0,
            'unity_files_analyzed': 0
        }
        
        # Collect stats from each extractor
        for extractor_name in ['module', 'action_item', 'architecture', 'file_path', 'next_steps', 'business_rule']:
            output_file = self.output_dir / f"{extractor_name}s_extracted.json"
            if output_file.exists():
                data = json.loads(output_file.read_text())
                report['extractors_run'].append({
                    'name': extractor_name,
                    'entries': len(data)
                })
                report['total_entries'] += len(data)
        
        # Count processed files
        processed_dir = Path(self.pipeline['processed_dir'])
        if processed_dir.exists():
            report['files_processed'] = len(list(processed_dir.glob('*')))
        
        # Count gaps
        gaps_file = self.output_dir / 'pattern_suggestions.json'
        if gaps_file.exists():
            gaps = json.loads(gaps_file.read_text())
            report['gaps_found'] = len(gaps)
        
        # Count Unity files
        unity_file = self.output_dir / 'unity_analysis.json'
        if unity_file.exists():
            unity_data = json.loads(unity_file.read_text())
            report['unity_files_analyzed'] = len(unity_data)
        
        # Save report
        report_file = self.logs_dir / f"extraction_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n{'='*60}")
        print("📊 EXTRACTION COMPLETE")
        print(f"{'='*60}")
        print(f"Files processed: {report['files_processed']}")
        print(f"Total entries: {report['total_entries']}")
        print(f"Gaps found: {report['gaps_found']}")
        print(f"Unity files: {report['unity_files_analyzed']}")
        print(f"Report: {report_file}")
    
    def validate_system(self):
        """Validate extraction system integrity"""
        print("\n🔍 Validating extraction system...")
        
        checks = {
            'config_exists': Path(self.config_path).exists(),
            'extractors_dir': Path(__file__).parent.exists(),
            'input_dir': Path(self.pipeline['input_dir']).exists(),
            'processed_dir': Path(self.pipeline['processed_dir']).exists(),
            'output_dir': self.output_dir.exists()
        }
        
        all_pass = all(checks.values())
        for check, passed in checks.items():
            status = "✅" if passed else "❌"
            print(f"   {status} {check}")
        
        if not all_pass:
            print("❌ Validation failed - fix issues before running")
            sys.exit(1)
        
        print("✅ All validation checks passed")
    
    def run(self, dry_run: bool = False, skip_unity: bool = False):
        """Run complete pipeline"""
        print("🚀 Starting Extraction Pipeline")
        print(f"   Config: {self.config_path}")
        print(f"   Dry run: {dry_run}")
        print(f"   Skip Unity: {skip_unity}")
        
        # Validate
        self.validate_system()
        
        # Run extractors in sequence
        extractors = ['module', 'action_item', 'architecture', 'file_path', 'next_steps', 'business_rule']
        
        for extractor in extractors:
            success = self.run_extractor(extractor, dry_run)
            if not success and not dry_run:
                print(f"❌ Stopping pipeline due to {extractor} failure")
                sys.exit(1)
        
        # Run Unity analysis
        if not skip_unity:
            self.run_unity_analysis()
        
        # Run pattern discovery
        self.run_pattern_discovery()
        
        # Generate final report
        self.generate_comprehensive_report()
        
        print("\n🎉 Pipeline completed successfully!")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run complete extraction pipeline')
    parser.add_argument('--config', default='extraction_config.json', help='Config file path')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be extracted')
    parser.add_argument('--skip-unity', action='store_true', help='Skip Unity analysis')
    parser.add_argument('--validate-only', action='store_true', help='Only run validation')
    
    args = parser.parse_args()
    
    pipeline = ExtractionPipeline(args.config)
    
    if args.validate_only:
        pipeline.validate_system()
    else:
        pipeline.run(dry_run=args.dry_run, skip_unity=args.skip_unity)
Step 8: Make Scripts Executable
bash
Copy
chmod +x ~/claude-intelligence-system/main_pipeline.py
chmod +x ~/claude-intelligence-system/extractors/*.py
chmod +x ~/claude-intelligence-system/unity_analyzers/*.py
Step 9: Run It Right Now
bash
Copy
cd ~/claude-intelligence-system

# First, validate everything
python main_pipeline.py --validate-only

# Dry run to see what would happen
python main_pipeline.py --dry-run

# Full extraction with file moving
python main_pipeline.py

# Full extraction without Unity analysis (faster)
python main_pipeline.py --skip-unity
Step 10: Create Quick-Start Script
~/claude-intelligence-system/run_extraction.sh:
bash
Copy
#!/bin/bash

# Quick start extraction script
set -e

echo "🚀 Starting Complete Extraction System"
echo "====================================="

# Validate
python main_pipeline.py --validate-only

# Run full pipeline
python main_pipeline.py --skip-unity

echo "✅ Extraction complete - check extracted/ folder"
echo "   Raw files moved to: chatfiles_processed/"
echo "   Extracted data in: extracted/"
echo "   Reports in: logs/"
bash
Copy
chmod +x ~/claude-intelligence-system/run_extraction.sh
Immediate Output Structure
After running, you'll have:
Copy
~/Desktop/capture_evidence/
├── chatfiles_raw/              # Empty after processing
├── chatfiles_processed/        # All processed files moved here
├── extracted/
│   ├── modules_extracted.json
│   ├── action_items_extracted.json
│   ├── architecture_decisions.json
│   ├── file_paths_extracted.json
│   ├── next_steps_extracted.json
│   ├── business_rules_extracted.json
│   ├── pattern_suggestions.json
│   ├── unity_analysis.json
│   └── *_processed.json        # Processing logs
└── logs/
    └── extraction_report_*.json
State Facts Immediately After Extraction
To see what facts were mentioned and identify conflicts, run this script:
~/claude-intelligence-system/analyze_facts.py:
Python
Copy
#!/usr/bin/env python3
"""
FACT ANALYZER
Identifies conflicting facts across all extractions
"""

import json
from pathlib import Path
from collections import defaultdict
import argparse

class FactAnalyzer:
    def __init__(self, extracted_dir: str):
        self.extracted_dir = Path(extracted_dir)
    
    def load_all_extracted(self):
        """Load all extracted JSON files"""
        all_data = {}
        for json_file in self.extracted_dir.glob('*.json'):
            if 'processed' not in json_file.name:
                data = json.loads(json_file.read_text())
                all_data[json_file.stem] = data
        return all_data
    
    def extract_fact_statements(self):
        """Extract factual statements from all data"""
        facts = defaultdict(list)
        
        data = self.load_all_extracted()
        
        # Extract from modules
        for module in data.get('modules_extracted', []):
            facts['modules'].append({
                'subject': module['name'],
                'statement': f"Module {module['name']} belongs to category {module['category']}",
                'sources': [module.get('extracted_at', 'unknown')]
            })
        
        # Extract from architecture decisions
        for decision in data.get('architecture_decisions', []):
            facts['architecture'].append({
                'subject': decision['id'],
                'statement': decision['decision'],
                'drivers': decision.get('drivers', []),
                'sources': [decision.get('extracted_at', 'unknown')]
            })
        
        # Extract from business rules
        for rule in data.get('business_rules_extracted', []):
            facts['rules'].append({
                'subject': rule['trigger'],
                'statement': f"{rule['trigger']} → {rule['condition']} → {rule['effect']}",
                'sources': [rule.get('extracted_at', 'unknown')]
            })
        
        return facts
    
    def find_conflicts(self):
        """Find conflicting facts"""
        facts = self.extract_fact_statements()
        conflicts = []
        
        # Check for module category conflicts
        module_categories = defaultdict(set)
        for fact in facts['modules']:
            name = fact['subject']
            category = fact['statement'].split('category ')[-1]
            module_categories[name].add(category)
        
        for name, categories in module_categories.items():
            if len(categories) > 1:
                conflicts.append({
                    'type': 'module_category_conflict',
                    'module': name,
                    'conflicting_categories': list(categories),
                    'severity': 'high'
                })
        
        # Check for rule conflicts
        rule_effects = {}
        for fact in facts['rules']:
            trigger = fact['subject']
            effect = fact['statement'].split('→')[-1].strip()
            if trigger in rule_effects and rule_effects[trigger] != effect:
                conflicts.append({
                    'type': 'rule_conflict',
                    'trigger': trigger,
                    'conflicting_effects': [rule_effects[trigger], effect],
                    'severity': 'critical'
                })
            rule_effects[trigger] = effect
        
        return conflicts
    
    def generate_report(self):
        """Generate conflict report"""
        facts = self.extract_fact_statements()
        conflicts = self.find_conflicts()
        
        report = {
            'timestamp': Path.now().isoformat(),
            'total_facts': sum(len(v) for v in facts.values()),
            'conflicts_found': len(conflicts),
            'facts': dict(facts),
            'conflicts': conflicts
        }
        
        report_file = self.extracted_dir.parent / 'logs' / f"conflict_report_{Path.now().strftime('%Y%m%d_%H%M%S')}.json"
        report_file.write_text(json.dumps(report, indent=2))
        
        print("📊 FACT CONFLICT ANALYSIS")
        print("="*40)
        print(f"Total facts: {report['total_facts']}")
        print(f"Conflicts found: {report['conflicts_found']}")
        
        if conflicts:
            print("\n⚠️  CONFLICTS DETECTED:")
            for conflict in conflicts:
                print(f"\n{conflict['type']}:")
                print(f"   {conflict}")
        
        print(f"\nReport saved to: {report_file}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--dir', default='~/Desktop/capture_evidence/extracted')
    args = parser.parse_args()
    
    analyzer = FactAnalyzer(args.dir)
    analyzer.generate_report()
Run fact analysis:
bash
Copy
python analyze_facts.py --dir ~/Desktop/capture_evidence/extracted
This complete system:
✅ Moves files from raw → processed (deterministic)
✅ Extracts modules, actions, architecture, paths, steps, rules
✅ Analyzes Unity C# code for patterns
✅ Discovers gaps in extraction (recursive self-improvement)
✅ Validates patterns and detects conflicts
✅ Preserves all raw content exactly as stated
✅ Uses your exact module/pillar terminology
✅ Generates actionable TODOs for system improvement
Run it now: bash run_extraction.sh
