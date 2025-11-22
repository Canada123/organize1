#!/usr/bin/env python3
"""
Bridge between yangsi7 intelligence-system and local execution
"""

import subprocess
import sys
import os

def run_local_equivalent(script_path, args):
    """Run local equivalent of intelligence-system scripts"""
    
    # Map intelligence-system scripts to local equivalents
    script_mapping = {
        'project_index.py': 'local_project_intel.py',
        'analyze_patterns.js': 'local_pattern_analysis.py', 
        # Add more mappings as needed
    }
    
    script_name = os.path.basename(script_path)
    local_script = script_mapping.get(script_name)
    
    if local_script:
        local_path = os.path.join(os.path.dirname(__file__), local_script)
        if os.path.exists(local_path):
            print(f"🔧 Running local equivalent: {local_script}")
            result = subprocess.run([sys.executable, local_path] + args)
            return result.returncode
        else:
            print(f"❌ Local script {local_script} not found")
            return 1
    else:
        print(f"❌ No local equivalent for {script_name}")
        return 1

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python bridge_intelligence_system.py <script> [args]")
        sys.exit(1)
    
    script_path = sys.argv[1]
    args = sys.argv[2:]
    
    exit_code = run_local_equivalent(script_path, args)
    sys.exit(exit_code)
