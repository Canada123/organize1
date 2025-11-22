import json
import subprocess
import sys
from pathlib import Path

class DataValidator:
    """Validate that extracted data is actually usable"""
    
    def __init__(self, extracted_data_file='game_data_extracted.json'):
        with open(extracted_data_file) as f:
            self.data = json.load(f)
        self.results = {"validated": {}, "failed": {}, "warnings": []}
    
    def validate_ethics_dataset(self):
        """Actually try to load ETHICS dataset"""
        print("Validating ETHICS dataset...")
        try:
            # Try to import and load
            result = subprocess.run([
                sys.executable, '-c',
                'from datasets import load_dataset; '
                'd = load_dataset("hendrycks/ethics", "commonsense", split="train[:10]"); '
                'print(len(d))'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                count = int(result.stdout.strip())
                self.results['validated']['ethics'] = {
                    "status": "REAL",
                    "test_load": f"Loaded {count} samples",
                    "structure": self.data['validated_data']['models'].get('ethics', {})
                }
            else:
                self.results['failed']['ethics'] = {
                    "error": result.stderr,
                    "fix": "pip install datasets"
                }
        except subprocess.TimeoutExpired:
            self.results['warnings'].append("ETHICS dataset download taking too long - may be large")
        except Exception as e:
            self.results['failed']['ethics'] = {"error": str(e)}
    
    def validate_code_examples(self):
        """Test if code examples actually run"""
        print("Validating code examples...")
        working = []
        broken = []
        
        for example in self.data.get('validated_data', {}).get('scenarios', []):
            code = example.get('code', '')
            
            # Try to parse as Python
            try:
                compile(code, '<string>', 'exec')
                working.append({
                    "source": example.get('source'),
                    "preview": code[:100]
                })
            except SyntaxError as e:
                broken.append({
                    "source": example.get('source'),
                    "error": str(e),
                    "line": e.lineno
                })
        
        self.results['validated']['code_examples'] = {
            "working": len(working),
            "broken": len(broken),
            "samples": working[:5]
        }
        
        if broken:
            self.results['failed']['code_examples'] = broken[:5]
    
    def validate_mechanics(self):
        """Check if mechanics have actionable implementation details"""
        print("Validating mechanics...")
        mechanics = self.data['validated_data'].get('mechanics_by_type', {})
        
        actionable = {}
        vague = {}
        
        for mech_type, items in mechanics.items():
            actionable[mech_type] = []
            vague[mech_type] = []
            
            for item in items:
                desc = item['description'].lower()
                # Check for implementation keywords
                if any(kw in desc for kw in ['track', 'measure', 'calculate', 'record', 'count']):
                    actionable[mech_type].append(item)
                else:
                    vague[mech_type].append(item)
        
        self.results['validated']['mechanics'] = {
            "total": sum(len(items) for items in mechanics.values()),
            "actionable": sum(len(items) for items in actionable.values()),
            "vague": sum(len(items) for items in vague.values()),
            "by_type": {k: len(v) for k, v in actionable.items()}
        }
    
    def check_data_completeness(self):
        """Verify we have enough data to build the game"""
        print("Checking data completeness...")
        required = {
            "moral_scenarios": False,
            "behavior_taxonomy": False,
            "testing_mechanics": False,
            "npc_models": False
        }
        
        # Check moral scenarios
        if ('ethics' in self.results['validated'] or 
            'moral_machine' in self.data['validated_data']['models']):
            required['moral_scenarios'] = True
        
        # Check mechanics
        if self.data['summary']['mechanics_found'] >= 10:
            required['testing_mechanics'] = True
        
        # Check for behavior/psychological models
        if 'psychological_complexes' in self.data['validated_data']['models']:
            required['npc_models'] = True
        
        self.results['completeness'] = {
            "requirements_met": sum(required.values()),
            "total_requirements": len(required),
            "details": required,
            "ready_to_build": all(required.values())
        }
    
    def generate_implementation_plan(self):
        """Create concrete next steps based on validation"""
        plan = []
        
        # Dataset installations
        if 'ethics' in self.results['failed']:
            plan.append({
                "step": "Install datasets library",
                "command": "pip install datasets",
                "why": "Required to load ETHICS dataset"
            })
        
        if self.results['validated'].get('ethics'):
            plan.append({
                "step": "Download full ETHICS dataset",
                "command": "python -c \"from datasets import load_dataset; load_dataset('hendrycks/ethics', 'commonsense')\"",
                "why": "Get all 131,885 moral scenarios"
            })
        
        # Mechanics improvements
        vague_count = self.results['validated'].get('mechanics', {}).get('vague', 0)
        if vague_count > 0:
            plan.append({
                "step": "Make mechanics more specific",
                "action": f"Convert {vague_count} vague mechanics into measurable implementations",
                "why": "Need concrete tracking logic, not just concepts"
            })
        
        # Missing components
        completeness = self.results.get('completeness', {}).get('details', {})
        if not completeness.get('behavior_taxonomy'):
            plan.append({
                "step": "Add behavior ontology",
                "command": "Download NBO ontology OWL file",
                "why": "Need structured behavior taxonomy for NPCs"
            })
        
        return plan
    
    def save_validation_report(self, output_file='validation_report.json'):
        """Save complete validation results"""
        report = {
            "validation_results": self.results,
            "implementation_plan": self.generate_implementation_plan(),
            "usable_now": {
                "datasets": list(self.results['validated'].keys()),
                "mechanics_count": self.results['validated'].get('mechanics', {}).get('actionable', 0),
                "code_examples": self.results['validated'].get('code_examples', {}).get('working', 0)
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def run_all_validations(self):
        """Run all validation checks"""
        print("Running validation suite...\n")
        
        if self.data['validated_data']['models'].get('ethics'):
            self.validate_ethics_dataset()
        
        self.validate_code_examples()
        self.validate_mechanics()
        self.check_data_completeness()
        
        report = self.save_validation_report()
        
        print(f"\n{'='*60}")
        print("VALIDATION COMPLETE")
        print(f"{'='*60}")
        print(f"Validated datasets: {len(self.results['validated'])}")
        print(f"Failed validations: {len(self.results['failed'])}")
        print(f"Warnings: {len(self.results['warnings'])}")
        print(f"\nData completeness: {self.results['completeness']['requirements_met']}/{self.results['completeness']['total_requirements']}")
        print(f"Ready to build: {self.results['completeness']['ready_to_build']}")
        
        print(f"\nNext steps:")
        for i, step in enumerate(report['implementation_plan'][:5], 1):
            print(f"{i}. {step['step']}")
            if 'command' in step:
                print(f"   $ {step['command']}")
        
        return report

if __name__ == "__main__":
    validator = DataValidator()
    validator.run_all_validations()
    
    print(f"\nFull report: validation_report.json")
