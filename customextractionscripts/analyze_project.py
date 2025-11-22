#!/usr/bin/env python3
"""
Unity Project Index Analyzer - Batch Processor
Extracts UI modules, services, containers, and unique features from all PROJECT_INDEX.json files in current directory
"""

import json
import sys
import re
import os
import glob
from collections import defaultdict

class UnityProjectAnalyzer:
    def __init__(self, index_file):
        with open(index_file, 'r', encoding='utf-8') as f:
            self.data = json.load(f)

        self.code_files = self.data.get('f', {})
        self.dependencies = self.data.get('g', [])
        self.filename = os.path.basename(index_file)

    def analyze_dependencies(self, class_name):
        """Get all dependencies for a class"""
        deps = set()
        for dep in self.dependencies:
            if len(dep) >= 2:
                source = dep[0]
                target = dep[1]

                # If source contains the class name
                if class_name in source:
                    # Extract target class/method
                    if '.' in target:
                        target_class = target.split('.')[0]
                        deps.add(target_class)
                    else:
                        deps.add(target)

        return sorted(list(deps))[:10]  # Limit to top 10

    def get_class_methods(self, class_name, file_data):
        """Get all methods from a class"""
        if len(file_data) < 2 or not isinstance(file_data[1], dict):
            return []

        entities = file_data[1]
        if class_name not in entities:
            return []

        entity_info = entities[class_name]
        if len(entity_info) < 2:
            return []

        methods = entity_info[1]
        if not isinstance(methods, list):
            return []

        method_names = []
        for method in methods:
            if isinstance(method, str) and ':' in method:
                method_name = method.split(':')[0]
                method_names.append(method_name)

        return method_names

    def is_extractable(self, deps, file_path):
        """Determine if a UI component is extractable"""
        # If it has very few dependencies and isn't in core game logic
        if len(deps) <= 3:
            return "Yes"
        if len(deps) <= 6 and not any(x in file_path.lower() for x in ['core', 'game', 'player', 'network']):
            return "Maybe"
        return "No"

    def is_attachable(self, deps, class_name):
        """Determine if a service can be attached to containers"""
        # Managers with few dependencies are usually modular
        if len(deps) <= 4:
            return "Yes"
        if 'Singleton' in class_name or 'Static' in class_name:
            return "No"
        if len(deps) <= 8:
            return "Maybe"
        return "No"

    def detect_scriptable_object(self, file_path, class_name, methods):
        """Detect if a class is a ScriptableObject"""
        # Check file path or class name patterns
        if 'scriptableobject' in file_path.lower() or 'scriptable' in file_path.lower():
            return "Yes"
        if 'SO_' in class_name or class_name.startswith('SO'):
            return "Yes"
        if '/SO/' in file_path or 'ScriptableObjects/' in file_path:
            return "Yes"
        # Check for CreateAssetMenu method
        if any('CreateAssetMenu' in m for m in methods):
            return "Yes"
        return "No"

    def get_description_from_path(self, file_path):
        """Extract description from file path"""
        parts = file_path.split('/')

        # Find meaningful directories
        relevant = []
        for part in parts:
            if part in ['Assets', 'Scripts', 'Code', 'src']:
                continue
            if part.endswith('.cs'):
                continue
            relevant.append(part)

        if relevant:
            return ' > '.join(relevant[-3:])  # Last 3 levels
        return "Root"

    def detect_unique_features(self):
        """Detect unique/clever features"""
        features = []

        for file_path, file_data in self.code_files.items():
            if len(file_data) < 2 or not isinstance(file_data[1], dict):
                continue

            entities = file_data[1]

            for class_name, entity_info in entities.items():
                methods = self.get_class_methods(class_name, file_data)
                methods_str = ' '.join(methods)

                # Zenject/DI patterns
                if any(x in class_name for x in ['Installer', 'Injector', 'Container']) or \
                   any(x in methods_str for x in ['Inject', 'Bind', 'Install']):
                    features.append(f"Dependency Injection (Zenject/VContainer) in {file_path}")

                # Reactive patterns
                if any(x in class_name for x in ['Observable', 'Reactive', 'Signal', 'Event']) or \
                   any(x in methods_str for x in ['Subscribe', 'Observe', 'OnNext']):
                    features.append(f"Reactive Programming (UniRx/Signals) in {file_path}")

                # Articy integration
                if 'Articy' in class_name or 'articy' in file_path.lower():
                    features.append(f"Articy:Draft Integration in {file_path}")

                # Figma Bridge
                if 'Figma' in class_name or 'figma' in file_path.lower():
                    features.append(f"Figma Bridge/Integration in {file_path}")

                # Backend integration
                if any(x in class_name for x in ['Backend', 'API', 'Http', 'Rest', 'GraphQL']) or \
                   any(x in methods_str for x in ['FetchAPI', 'PostRequest', 'GetRequest']):
                    features.append(f"Backend/API Integration in {file_path}")

                # Custom event systems
                if 'EventBus' in class_name or 'EventDispatcher' in class_name or 'MessageBroker' in class_name:
                    features.append(f"Custom Event Bus System: {class_name} in {file_path}")

                # State machines
                if 'StateMachine' in class_name or 'FSM' in class_name:
                    features.append(f"State Machine: {class_name} in {file_path}")

                # Object pooling
                if 'Pool' in class_name and any(x in methods_str for x in ['Get', 'Return', 'Spawn']):
                    features.append(f"Object Pooling System: {class_name} in {file_path}")

                # Command pattern
                if 'Command' in class_name and any(x in methods_str for x in ['Execute', 'Undo', 'Redo']):
                    features.append(f"Command Pattern: {class_name} in {file_path}")

        return list(set(features))  # Deduplicate

    def analyze_ui_modules(self):
        """Find and analyze UI modules"""
        ui_modules = []

        ui_patterns = ['ui', 'panel', 'view', 'screen', 'window', 'menu', 'popup', 'dialog', 'hud']

        for file_path, file_data in self.code_files.items():
            if not file_path.endswith('.cs'):
                continue

            # Check if file path or class name contains UI patterns
            path_lower = file_path.lower()
            is_ui = any(pattern in path_lower for pattern in ui_patterns)

            if not is_ui:
                continue

            if len(file_data) < 2 or not isinstance(file_data[1], dict):
                continue

            entities = file_data[1]

            for class_name in entities.keys():
                class_lower = class_name.lower()
                is_ui_class = any(pattern in class_lower for pattern in ui_patterns)

                if is_ui or is_ui_class:
                    deps = self.analyze_dependencies(class_name)
                    description = self.get_description_from_path(file_path)
                    extractable = self.is_extractable(deps, file_path)

                    ui_modules.append({
                        'file': file_path,
                        'class': class_name,
                        'description': description,
                        'dependencies': deps,
                        'extractable': extractable
                    })

        return ui_modules

    def analyze_service_systems(self):
        """Find and analyze service systems"""
        services = []

        service_patterns = ['service', 'manager', 'system', 'controller', 'handler']

        for file_path, file_data in self.code_files.items():
            if not file_path.endswith('.cs'):
                continue

            if len(file_data) < 2 or not isinstance(file_data[1], dict):
                continue

            entities = file_data[1]

            for class_name in entities.keys():
                class_lower = class_name.lower()
                is_service = any(pattern in class_lower for pattern in service_patterns)

                if is_service:
                    deps = self.analyze_dependencies(class_name)
                    methods = self.get_class_methods(class_name, file_data)

                    # Infer what it manages from name and methods
                    manages = []
                    if 'timer' in class_lower or any('timer' in m.lower() for m in methods):
                        manages.append('Timers')
                    if 'cooldown' in class_lower or any('cooldown' in m.lower() for m in methods):
                        manages.append('Cooldowns')
                    if 'quest' in class_lower or any('quest' in m.lower() for m in methods):
                        manages.append('Quests')
                    if 'audio' in class_lower or 'sound' in class_lower:
                        manages.append('Audio/Sound')
                    if 'save' in class_lower or 'load' in class_lower:
                        manages.append('Save/Load')
                    if 'network' in class_lower or 'multiplayer' in class_lower:
                        manages.append('Networking')
                    if 'input' in class_lower:
                        manages.append('Input')
                    if 'scene' in class_lower or any('scene' in m.lower() for m in methods):
                        manages.append('Scenes')
                    if 'pool' in class_lower or any('pool' in m.lower() for m in methods):
                        manages.append('Object Pooling')
                    if 'event' in class_lower:
                        manages.append('Events')
                    if 'dialogue' in class_lower or 'dialog' in class_lower:
                        manages.append('Dialogue')
                    if 'inventory' in class_lower:
                        manages.append('Inventory')
                    if 'game' in class_lower:
                        manages.append('Game State')

                    manages_str = ', '.join(manages) if manages else 'General Logic'
                    attachable = self.is_attachable(deps, class_name)

                    services.append({
                        'file': file_path,
                        'class': class_name,
                        'manages': manages_str,
                        'dependencies': deps,
                        'attachable': attachable
                    })

        return services

    def analyze_containers(self):
        """Find and analyze data containers"""
        containers = []

        container_patterns = ['container', 'data', 'model', 'state', 'config', 'settings']

        for file_path, file_data in self.code_files.items():
            if not file_path.endswith('.cs'):
                continue

            if len(file_data) < 2 or not isinstance(file_data[1], dict):
                continue

            entities = file_data[1]

            for class_name in entities.items():
                class_lower = class_name.lower()
                is_container = any(pattern in class_lower for pattern in container_patterns)

                if is_container:
                    methods = self.get_class_methods(class_name, file_data)

                    # Try to infer fields from methods (getters/setters)
                    fields = []
                    for method in methods:
                        if method.startswith('Get') or method.startswith('Set'):
                            field = method[3:]
                            if field and field not in fields:
                                fields.append(field)

                    # Look for common field patterns in method names
                    common_fields = []
                    methods_str = ' '.join(methods).lower()
                    if 'name' in methods_str:
                        common_fields.append('name')
                    if 'id' in methods_str:
                        common_fields.append('id')
                    if 'value' in methods_str:
                        common_fields.append('value')
                    if 'count' in methods_str or 'amount' in methods_str:
                        common_fields.append('count/amount')
                    if 'time' in methods_str or 'duration' in methods_str:
                        common_fields.append('time/duration')

                    all_fields = fields[:5] + common_fields  # Limit fields
                    fields_str = ', '.join(list(set(all_fields))[:8]) if all_fields else 'Unknown'

                    is_so = self.detect_scriptable_object(file_path, class_name, methods)

                    containers.append({
                        'file': file_path,
                        'class': class_name,
                        'fields': fields_str,
                        'scriptable_object': is_so
                    })

        return containers

    def generate_report(self):
        """Generate full analysis report"""
        report = []
        report.append("="*80)
        report.append(f"UNITY PROJECT ANALYSIS: {self.filename}")
        report.append("="*80)
        report.append("")

        # UI Modules
        ui_modules = self.analyze_ui_modules()
        report.append("UI_MODULES:")
        report.append("-" * 80)
        for ui in ui_modules:
            deps_str = ', '.join(ui['dependencies'][:5]) if ui['dependencies'] else 'None'
            report.append(f"File: {ui['file']}")
            report.append(f"  Class: {ui['class']} | Desc: {ui['description']}")
            report.append(f"  Deps: {deps_str} | Extractable: {ui['extractable']}")
            report.append("")

        if not ui_modules:
            report.append("  (No UI modules found)")
            report.append("")

        # Service Systems
        services = self.analyze_service_systems()
        report.append("SERVICE_SYSTEMS:")
        report.append("-" * 80)
        for svc in services:
            deps_str = ', '.join(svc['dependencies'][:5]) if svc['dependencies'] else 'None'
            report.append(f"File: {svc['file']}")
            report.append(f"  Class: {svc['class']} | Manages: {svc['manages']}")
            report.append(f"  Deps: {deps_str} | Attachable: {svc['attachable']}")
            report.append("")

        if not services:
            report.append("  (No service systems found)")
            report.append("")

        # Containers
        containers = self.analyze_containers()
        report.append("CONTAINERS:")
        report.append("-" * 80)
        for cont in containers:
            report.append(f"File: {cont['file']}")
            report.append(f"  Class: {cont['class']} | Fields: {cont['fields']}")
            report.append(f"  ScriptableObject: {cont['scriptable_object']}")
            report.append("")

        if not containers:
            report.append("  (No containers found)")
            report.append("")

        # Unique Features
        unique_features = self.detect_unique_features()
        report.append("UNIQUE:")
        report.append("-" * 80)
        for feature in unique_features:
            report.append(f"  • {feature}")

        if not unique_features:
            report.append("  (No unique features detected)")

        report.append("")
        report.append("="*80)
        report.append(f"Summary: {len(ui_modules)} UI modules, {len(services)} services, {len(containers)} containers, {len(unique_features)} unique features")
        report.append("="*80)
        
        return "\n".join(report)

def find_project_index_files():
    """Find all PROJECT_INDEX.json files in current directory and subdirectories"""
    patterns = [
        "*PROJECT_INDEX.json",
        "PROJECT_INDEX.json",
        "*project_index.json"
    ]
    
    files = []
    for pattern in patterns:
        files.extend(glob.glob(pattern, recursive=True))
    
    # Also search in current directory
    for file in os.listdir('.'):
        if file.lower().endswith('project_index.json'):
            files.append(file)
    
    return list(set(files))  # Remove duplicates

def main():
    # Find all project index files in current directory
    project_files = find_project_index_files()
    
    if not project_files:
        print("No PROJECT_INDEX.json files found in current directory!")
        print("Looking for files with names containing 'PROJECT_INDEX.json'")
        sys.exit(1)
    
    print(f"Found {len(project_files)} project index files:")
    for i, file in enumerate(project_files, 1):
        print(f"  {i}. {file}")
    print()
    
    successful_analyses = 0
    failed_analyses = 0
    
    for project_file in project_files:
        try:
            print(f"Analyzing: {project_file}")
            print("-" * 60)
            
            analyzer = UnityProjectAnalyzer(project_file)
            report = analyzer.generate_report()
            print(report)
            print("\n" + "="*80 + "\n")
            
            successful_analyses += 1
            
        except FileNotFoundError:
            print(f"Error: File '{project_file}' not found")
            failed_analyses += 1
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in '{project_file}': {e}")
            failed_analyses += 1
        except Exception as e:
            print(f"Error analyzing '{project_file}': {e}")
            failed_analyses += 1
    
    print(f"Analysis complete: {successful_analyses} successful, {failed_analyses} failed")

if __name__ == "__main__":
    main()
