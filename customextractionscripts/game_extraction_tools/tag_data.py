import json
from pathlib import Path
from collections import defaultdict

class GameDataTagger:
    """Tag validated data so agents can query and use it"""
    
    def __init__(self, validation_report='validation_report.json'):
        with open(validation_report) as f:
            self.report = json.load(f)
        
        self.tagged_data = {
            "query_index": {},
            "by_purpose": {},
            "by_type": {},
            "implementation_ready": []
        }
    
    def tag_datasets(self):
        """Tag datasets by what they can be used for"""
        validated = self.report['validation_results']['validated']
        
        if 'ethics' in validated:
            self.tagged_data['query_index']['moral_scenarios'] = {
                "dataset": "ethics",
                "count": 131885,
                "categories": ["commonsense", "deontology", "justice", "virtue", "utilitarianism"],
                "use_cases": [
                    "npc_moral_decision_making",
                    "player_alignment_testing",
                    "dynamic_dilemma_generation"
                ],
                "access": {
                    "method": "load_dataset",
                    "code": "from datasets import load_dataset; ethics = load_dataset('hendrycks/ethics', 'commonsense')"
                }
            }
            
            self.tagged_data['by_purpose']['npc_behavior'] = {
                "source": "ethics_dataset",
                "what_it_provides": "moral reasoning patterns for NPC decision making",
                "example_use": "Generate NPC responses to player moral choices"
            }
            
            self.tagged_data['by_purpose']['player_testing'] = {
                "source": "ethics_dataset",
                "what_it_provides": "moral scenarios to test player values",
                "example_use": "Present dilemmas, track choices, build psychological profile"
            }
    
    def tag_mechanics(self):
        """Tag mechanics by measurement capability"""
        mechanics = self.report['validation_results']['validated'].get('mechanics', {})
        
        by_measurement = defaultdict(list)
        
        # Social mechanics
        if 'social' in mechanics.get('by_type', {}):
            by_measurement['trust_cooperation'].append({
                "measures": "player cooperation patterns",
                "implementation": "track team-up rates, resource sharing, alliance duration",
                "output": "trust_score, cooperation_tendency"
            })
        
        # Moral testing mechanics
        if 'moral_testing' in mechanics.get('by_type', {}):
            by_measurement['ethical_alignment'].append({
                "measures": "player moral framework",
                "implementation": "present moral dilemmas, track choice patterns",
                "output": "deontological_score, utilitarian_score, virtue_score"
            })
        
        # Economic mechanics
        if 'economic' in mechanics.get('by_type', {}):
            by_measurement['decision_making'].append({
                "measures": "planning and delayed gratification",
                "implementation": "track immediate vs delayed reward choices",
                "output": "planning_ability, impulsivity_score"
            })
        
        self.tagged_data['by_type']['measurement_mechanics'] = dict(by_measurement)
    
    def create_agent_query_api(self):
        """Create simple query interface for agents"""
        api = {
            "available_queries": {
                "get_moral_scenarios": {
                    "description": "Get moral scenarios by category",
                    "parameters": {
                        "category": ["commonsense", "deontology", "justice", "virtue", "utilitarianism"],
                        "count": "int (default 10)"
                    },
                    "returns": "list of scenario objects with labels"
                },
                "get_mechanics_for": {
                    "description": "Get mechanics that measure specific trait",
                    "parameters": {
                        "trait": ["trust", "cooperation", "planning", "ethics", "social_skill"]
                    },
                    "returns": "list of applicable mechanics with implementation details"
                },
                "check_data_availability": {
                    "description": "Check if specific data is validated and ready",
                    "parameters": {
                        "data_type": ["ethics", "moral_machine", "behaviors", "mechanics"]
                    },
                    "returns": "boolean and access instructions"
                }
            }
        }
        
        self.tagged_data['agent_api'] = api
    
    def generate_implementation_manifest(self):
        """Create manifest of what's actually buildable now"""
        manifest = {
            "immediately_buildable": [],
            "needs_data_download": [],
            "needs_implementation": []
        }
        
        validated = self.report['validation_results']['validated']
        
        # What can be built right now
        if 'code_examples' in validated and validated['code_examples']['working'] > 0:
            manifest['immediately_buildable'].append({
                "component": "Code templates",
                "count": validated['code_examples']['working'],
                "action": "Extract and adapt working code examples"
            })
        
        if 'mechanics' in validated and validated['mechanics']['actionable'] > 0:
            manifest['immediately_buildable'].append({
                "component": "Measurement mechanics",
                "count": validated['mechanics']['actionable'],
                "action": "Implement tracking logic for actionable mechanics"
            })
        
        # What needs download
        if 'ethics' not in validated:
            manifest['needs_data_download'].append({
                "component": "ETHICS dataset",
                "size": "131,885 scenarios",
                "command": "from datasets import load_dataset; load_dataset('hendrycks/ethics')"
            })
        
        # What needs more work
        vague_mechanics = validated.get('mechanics', {}).get('vague', 0)
        if vague_mechanics > 0:
            manifest['needs_implementation'].append({
                "component": "Vague mechanics",
                "count": vague_mechanics,
                "action": "Convert conceptual descriptions into measurable implementations"
            })
        
        return manifest
    
    def save_tagged_data(self, output_file='tagged_game_data.json'):
        """Save queryable, tagged data"""
        self.tag_datasets()
        self.tag_mechanics()
        self.create_agent_query_api()
        
        final_output = {
            "tagged_data": self.tagged_data,
            "implementation_manifest": self.generate_implementation_manifest(),
            "quick_access": {
                "get_moral_scenarios": {
                    "code": "from datasets import load_dataset\nethics = load_dataset('hendrycks/ethics', 'commonsense')\nscenarios = ethics['train']"
                },
                "measure_trust": {
                    "mechanic": "Track cooperation in multi-player scenarios",
                    "metric": "cooperation_rate = successful_teams / total_interactions"
                },
                "measure_ethics": {
                    "mechanic": "Present moral dilemmas, track consistency",
                    "metric": "alignment_score by framework (deontology/utilitarian/virtue)"
                }
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(final_output, f, indent=2)
        
        return final_output
    
    def print_usage_guide(self, tagged_data):
        """Print practical guide for using the tagged data"""
        print("\n" + "="*60)
        print("TAGGED DATA USAGE GUIDE")
        print("="*60)
        
        print("\n### Query moral scenarios:")
        if 'moral_scenarios' in tagged_data['tagged_data']['query_index']:
            print(tagged_data['tagged_data']['query_index']['moral_scenarios']['access']['code'])
        
        print("\n### Implement trust measurement:")
        if 'trust_cooperation' in tagged_data['tagged_data']['by_type'].get('measurement_mechanics', {}):
            mech = tagged_data['tagged_data']['by_type']['measurement_mechanics']['trust_cooperation'][0]
            print(f"Track: {mech['implementation']}")
            print(f"Output: {mech['output']}")
        
        print("\n### Implementation manifest:")
        manifest = tagged_data['implementation_manifest']
        print(f"Can build now: {len(manifest['immediately_buildable'])} components")
        for item in manifest['immediately_buildable']:
            print(f"  - {item['component']}: {item['count']} items ready")
        
        print(f"\nNeed to download: {len(manifest['needs_data_download'])} datasets")
        for item in manifest['needs_data_download']:
            print(f"  - {item['component']}")
        
        print(f"\nNeed work: {len(manifest['needs_implementation'])} items")
        for item in manifest['needs_implementation']:
            print(f"  - {item['component']}: {item['action']}")

if __name__ == "__main__":
    print("Creating agent-queryable tagged data...")
    tagger = GameDataTagger()
    tagged_data = tagger.save_tagged_data()
    tagger.print_usage_guide(tagged_data)
    
    print(f"\n\nTagged data saved to: tagged_game_data.json")
    print("Agents can now query this file for:")
    print("  - Available datasets and how to access them")
    print("  - Mechanics and what they measure")
    print("  - What's buildable right now vs what needs work")
