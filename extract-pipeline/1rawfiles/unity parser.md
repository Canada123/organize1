What You're Proposing
You want a script that takes the current PROJECT_INDEX format (from scripts/project_index.py:414-494) and transforms it into a Unity-specific hierarchical structure that explicitly captures:

File-level Unity metadata: is_unity_script, using statements, unity_attributes
Game development taxonomy: engine, frameworks, patterns
Class hierarchy: inherits, unity_base_class
Unity lifecycle methods: Awake, Start, Update, FixedUpdate, OnCollisionEnter
This is much smarter than trying to convert to Neo4j or GraphRAG directly because it creates a domain-specific intermediate format that's optimized for Unity analysis.

Why This Approach Works
1. Preserves Unity-Specific Context

The current PROJECT_INDEX format from scripts/project_index.py:436-493 is generic - it doesn't distinguish between Unity lifecycle methods and regular methods, or between MonoBehaviour classes and regular C# classes.

Your proposed format explicitly captures:

Unity attributes as a separate array
Base class inheritance with Unity-specific detection
Lifecycle methods as distinct from regular methods
2. Enables Pattern-Based Queries

With the game_dev.patterns field, you can query across your 200 Unity repos for specific architectural patterns:

# Find all state machines  
state_machines = [f for f in indexes if "state_machine" in f.get("game_dev", {}).get("patterns", [])]  
  
# Find all event systems  
event_systems = [f for f in indexes if "observer" in f.get("game_dev", {}).get("patterns", [])]
3. Solves the "Looping and Redoing" Problem

By explicitly tagging Unity-specific patterns, Claude Code will stop treating Unity code as generic C# and understand the architectural context, reducing the thrashing you've been experiencing.

The Parser Script You Need
Here's the structure for scripts/unity_index_parser.py:

#!/usr/bin/env python3  
"""  
Unity-Aware PROJECT_INDEX Parser  
Transforms generic PROJECT_INDEX.json into Unity-specific hierarchical format.  
"""  
  
import json  
from pathlib import Path  
from typing import Dict, List, Set  
  
# Unity lifecycle methods to detect  
UNITY_LIFECYCLE_METHODS = {  
    'Awake', 'Start', 'Update', 'FixedUpdate', 'LateUpdate',  
    'OnEnable', 'OnDisable', 'OnDestroy',  
    'OnCollisionEnter', 'OnCollisionExit', 'OnCollisionStay',  
    'OnTriggerEnter', 'OnTriggerExit', 'OnTriggerStay',  
    'OnApplicationQuit', 'OnApplicationPause'  
}  
  
# Unity base classes  
UNITY_BASE_CLASSES = {  
    'MonoBehaviour', 'ScriptableObject', 'Editor', 'EditorWindow',  
    'PropertyDrawer', 'NetworkBehaviour'  
}  
  
# Unity attributes  
UNITY_ATTRIBUTES = {  
    'SerializeField', 'Header', 'Tooltip', 'Range', 'HideInInspector',  
    'RequireComponent', 'ExecuteInEditMode', 'AddComponentMenu'  
}  
  
def parse_unity_file(file_path: str, file_info: Dict) -> Dict:  
    """Transform generic file info into Unity-specific format."""  
      
    # Check if it's a Unity script  
    is_unity = False  
    using_statements = []  
    unity_attrs = []  
      
    # Detect Unity imports  
    if 'imports' in file_info:  
        for imp in file_info['imports']:  
            if 'UnityEngine' in imp or 'UnityEditor' in imp:  
                is_unity = True  
                using_statements.append(imp)  
      
    # Detect Unity attributes (from content or existing parsing)  
    if 'attributes' in file_info:  
        unity_attrs = [a for a in file_info['attributes'] if a in UNITY_ATTRIBUTES]  
      
    # Build Unity-aware structure  
    unity_file = {  
        'language': 'csharp',  
        'is_unity_script': is_unity,  
        'using': using_statements,  
        'unity_attributes': unity_attrs,  
        'game_dev': {}  
    }  
      
    # Add game dev taxonomy if present  
    if 'game_dev' in file_info:  
        unity_file['game_dev'] = file_info['game_dev']  
    elif is_unity:  
        unity_file['game_dev'] = {  
            'engine': 'Unity',  
            'frameworks': ['Unity3D'],  
            'patterns': []  
        }  
      
    # Process classes  
    if 'classes' in file_info:  
        unity_file['classes'] = {}  
          
        for class_name, class_data in file_info['classes'].items():  
            if not isinstance(class_data, dict):  
                continue  
                  
            # Detect Unity base class  
            inherits = class_data.get('inherits', [])  
            unity_base = None  
            for base in inherits:  
                if base in UNITY_BASE_CLASSES:  
                    unity_base = base  
                    break  
              
            # Build class structure  
            unity_class = {  
                'inherits': inherits,  
                'unity_base_class': unity_base,  
                'methods': {}  
            }  
              
            # Categorize methods  
            if 'methods' in class_data:  
                for method_name, method_data in class_data['methods'].items():  
                    if not isinstance(method_data, dict):  
                        continue  
                      
                    # Mark Unity lifecycle methods  
                    if method_name in UNITY_LIFECYCLE_METHODS:  
                        method_data['is_lifecycle'] = True  
                      
                    unity_class['methods'][method_name] = method_data  
              
            unity_file['classes'][class_name] = unity_class  
      
    return unity_file  
  
def transform_project_index(index_path: Path, output_path: Path):  
    """Transform entire PROJECT_INDEX.json to Unity format."""  
      
    # Load original index  
    with open(index_path) as f:  
        index = json.load(f)  
      
    # Transform each file  
    unity_index = {}  
      
    for file_path, file_info in index.get('files', {}).items():  
        # Only process C# files  
        if file_info.get('language') != 'csharp':  
            continue  
          
        unity_file = parse_unity_file(file_path, file_info)  
          
        # Only include Unity scripts  
        if unity_file['is_unity_script']:  
            unity_index[file_path] = unity_file  
      
    # Save transformed index  
    with open(output_path, 'w') as f:  
        json.dump(unity_index, f, indent=2)  
      
    print(f"✓ Transformed {len(unity_index)} Unity scripts")  
    print(f"💾 Saved to: {output_path}")  
  
if __name__ == '__main__':  
    import sys  
      
    if len(sys.argv) < 2:  
        print("Usage: python unity_index_parser.py PROJECT_INDEX.json [output.json]")  
        sys.exit(1)  
      
    index_path = Path(sys.argv[1])  
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('UNITY_INDEX.json')  
      
    transform_project_index(index_path, output_path)
How to Use It
1. Run on a single PROJECT_INDEX.json:

python scripts/unity_index_parser.py PROJECT_INDEX.json UNITY_INDEX.json
2. Batch process all 200 Unity repos:

# Create batch processor  
for dir in unity_repos/*/; do  
    if [ -f "$dir/PROJECT_INDEX.json" ]; then  
        python scripts/unity_index_parser.py "$dir/PROJECT_INDEX.json" "$dir/UNITY_INDEX.json"  
    fi  
done
3. Query the transformed indexes:

import json  
from pathlib import Path  
  
# Load all Unity indexes  
unity_indexes = {}  
for index_file in Path('unity_repos').rglob('UNITY_INDEX.json'):  
    with open(index_file) as f:  
        unity_indexes[index_file.parent.name] = json.load(f)  
  
# Find all GameManager singletons  
game_managers = []  
for repo, index in unity_indexes.items():  
    for file_path, file_info in index.items():  
        for class_name, class_data in file_info.get('classes', {}).items():  
            if 'GameManager' in class_name and class_data.get('unity_base_class') == 'MonoBehaviour':  
                game_managers.append((repo, file_path, class_name))  
  
print(f"Found {len(game_managers)} GameManager implementations")
Notes
This parser script is safe for Claude Code to generate because it's a pure transformation - it reads JSON, processes it, and writes JSON. No complex indentation, no state management, no file system traversal. It solves your "looping and redoing" problem by creating a Unity-first data structure that makes architectural patterns explicit rather than implicit.

The hierarchical format you proposed is perfect for this use case - it's queryable, type-safe, and domain-specific to Unity game development.
