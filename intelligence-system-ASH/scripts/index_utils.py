#!/usr/bin/env python3
"""
Shared utilities for project indexing.
Contains common functionality used by both project_index.py and hook scripts.
"""
from language_mappings import (
    PARSEABLE_LANGUAGES,
    AMBIGUOUS_EXTENSIONS,
    detect_language_from_content,
    CODE_EXTENSIONS  # Add this import
)
import re
import fnmatch
import json
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

# Try to import tree-sitter
try:
    from tree_sitter_languages import get_language, get_parser
    TREE_SITTER_AVAILABLE = True
except ImportError:
    TREE_SITTER_AVAILABLE = False
    get_language = None
    get_parser = None


IGNORE_DIRS = {
    '.git',
    'node_modules', 'bower_components', 'vendor', 'packages', 'pkg',
    '__pycache__', '.venv', 'venv', 'env', 'virtualenv',
    '.pytest_cache', 'eggs', '.eggs', '.tox', 'htmlcov',
    'build', 'dist', '.next', '.netlify', '.vercel', 'target', 'out', 'bin', 'obj',
    'coverage', '.nyc_output',
    '.idea', '.vscode', '.DS_Store', '.vs',
    'archive', '.archive', 'archived-sessions',
    '.serena'
}

TOOL_TAXONOMY_PATH = Path(__file__).parent / "tool_taxonomy.json"
  
def load_tool_taxonomy() -> Dict[str, Dict]:
    """Load tool taxonomy from tool_taxonomy.json."""
    if not TOOL_TAXONOMY_PATH.exists():
        return {}
    try:
        with open(TOOL_TAXONOMY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}
  
def detect_tools_from_taxonomy(
    file_path: Path,
    language: str,
    imports: List[str],
    content_snippet: str,
    taxonomy: Optional[Dict[str, Dict]] = None
) -> List[Dict]:
    """Detect which tools from taxonomy appear in this file."""
    if taxonomy is None:
        taxonomy = load_tool_taxonomy()
    if not taxonomy:
        return []
  
    fn = file_path.name.lower()
    path_str = str(file_path).lower()
    text = (content_snippet or "").lower()
    norm_imports = {str(imp).lower().split('.')[0] for imp in (imports or [])}
  
    hits: List[Dict] = []
  
    for category, info in taxonomy.items():
        for tool_name in info.get("tools", []):
            t_lower = tool_name.lower()
            reasons = []
  
            # Import-based match
            if any(t_lower.startswith(imp) or imp.startswith(t_lower) for imp in norm_imports):
                reasons.append("import")
  
            # Path/filename match
            if t_lower in fn or t_lower in path_str:
                reasons.append("path")
  
            # Content match
            if t_lower in text:
                reasons.append("content")
  
            if reasons:
                hits.append({
                    "category": category,
                    "tool_name": tool_name,
                    "file": str(file_path),
                    "language": language,
                    "reasons": reasons
                })
  
    # Deduplicate
    dedup = {}
    for h in hits:
        key = (h["category"], h["tool_name"], h["file"])
        if key not in dedup:
            dedup[key] = h
  
    return list(dedup.values())
    
ALGORITHM_TAXONOMY_PATH = Path(__file__).parent / "algorithm_taxonomy.json"
  
def load_algorithm_taxonomy() -> Dict[str, Dict]:
    """Load algorithm taxonomy from algorithm_taxonomy.json."""
    if not ALGORITHM_TAXONOMY_PATH.exists():
        return {}
    try:
        with open(ALGORITHM_TAXONOMY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}
  
def detect_algorithms_from_taxonomy(
    file_path: Path,
    language: str,
    content_snippet: str,
    taxonomy: Optional[Dict[str, Dict]] = None
) -> List[Dict]:
    """Detect which algorithms from taxonomy appear in this file."""
    if taxonomy is None:
        taxonomy = load_algorithm_taxonomy()
    if not taxonomy:
        return []
  
    fn = file_path.name.lower()
    path_str = str(file_path).lower()
    text = (content_snippet or "").lower()
  
    hits: List[Dict] = []
  
    for category, info in taxonomy.items():
        for algo_name in info.get("algorithms", []):
            a_lower = algo_name.lower()
            reasons = []
  
            # Path/filename match
            if a_lower in fn or a_lower in path_str:
                reasons.append("path")
  
            # Content match (algorithm names in comments/docstrings/code)
            if a_lower in text:
                reasons.append("content")
  
            if reasons:
                hits.append({
                    "category": category,
                    "algorithm_name": algo_name,
                    "file": str(file_path),
                    "language": language,
                    "reasons": reasons
                })
  
    # Deduplicate
    dedup = {}
    for h in hits:
        key = (h["category"], h["algorithm_name"], h["file"])
        if key not in dedup:
            dedup[key] = h
  
    return list(dedup.values())
    
GAME_DEV_TAXONOMY_PATH = Path(__file__).parent / "game_dev_taxonomy.json"
  
def load_game_dev_taxonomy() -> Dict[str, Dict]:
    """Load game development taxonomy."""
    if not GAME_DEV_TAXONOMY_PATH.exists():
        return {}
    try:
        with open(GAME_DEV_TAXONOMY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}
  
def detect_game_dev_tools(
    file_path: Path,
    language: str,
    imports: List[str],
    content_snippet: str,
    taxonomy: Optional[Dict[str, Dict]] = None
) -> List[Dict]:
    """Detect game development tools."""
    # Same implementation as detect_tools_from_taxonomy
    # but loads game_dev_taxonomy instead
    
 if taxonomy is None:
        taxonomy = load_game_dev_taxonomy()
    if not taxonomy:
        return []
    
    fn = file_path.name.lower()
    path_str = str(file_path).lower()
    text = (content_snippet or "").lower()
    norm_imports = {str(imp).lower().split('.')[0] for imp in (imports or [])}
    
    hits: List[Dict] = []
    
    for category, info in taxonomy.items():
        for tool_name in info.get("tools", []):
            t_lower = tool_name.lower()
            reasons = []
    
            # Import-based match
            if any(t_lower.startswith(imp) or imp.startswith(t_lower) for imp in norm_imports):
                reasons.append("import")
    
            # Path/filename match
            if t_lower in fn or t_lower in path_str:
                reasons.append("path")
    
            # Content match
            if t_lower in text:
                reasons.append("content")
    
            if reasons:
                hits.append({
                    "category": category,
                    "tool_name": tool_name,
                    "file": str(file_path),
                    "language": language,
                    "reasons": reasons
                })
    
    # Deduplicate
    dedup = {}
    for h in hits:
        key = (h["category"], h["tool_name"], h["file"])
        if key not in dedup:
            dedup[key] = h
    
    return list(dedup.values())

def extract_function_signatures_basic(content: str, language: str) -> List[Dict]:
    """Basic regex-based function extraction for languages without tree-sitter support."""
    functions = []
    
    if language == 'python':
        pattern = r'^\s*def\s+(\w+)\s*\('
        for i, line in enumerate(content.split('\n')):
            match = re.match(pattern, line)
            if match:
                functions.append({'name': match.group(1), 'line': i + 1})
    
    elif language in ['javascript', 'typescript']:
        patterns = [
            r'function\s+(\w+)\s*\(',
            r'const\s+(\w+)\s*=\s*(?:async\s+)?\(',
            r'(\w+)\s*:\s*function\s*\(',
        ]
        for i, line in enumerate(content.split('\n')):
            for pattern in patterns:
                match = re.search(pattern, line)
                if match:
                    functions.append({'name': match.group(1), 'line': i + 1})
                    break
    
    elif language == 'java':
        pattern = r'(?:public|private|protected)\s+(?:static\s+)?(?:\w+\s+)+(\w+)\s*\('
        for i, line in enumerate(content.split('\n')):
            match = re.search(pattern, line)
            if match:
                functions.append({'name': match.group(1), 'line': i + 1})
    
    elif language in ['c', 'cpp']:
        pattern = r'^\s*(?:\w+\s+)*(\w+)\s*\([^)]*\)\s*\{'
        for i, line in enumerate(content.split('\n')):
            match = re.match(pattern, line)
            if match and match.group(1) not in ['if', 'while', 'for', 'switch']:
                functions.append({'name': match.group(1), 'line': i + 1})
    
    return functions
    

def extract_class_names_basic(content: str, language: str) -> List[Dict]:
    """Basic regex-based class extraction for languages without tree-sitter support."""
    classes = []
    
    if language == 'python':
        pattern = r'^\s*class\s+(\w+)'
        for i, line in enumerate(content.split('\n')):
            match = re.match(pattern, line)
            if match:
                classes.append({'name': match.group(1), 'line': i + 1})
    
    elif language in ['javascript', 'typescript']:
        pattern = r'class\s+(\w+)'
        for i, line in enumerate(content.split('\n')):
            match = re.search(pattern, line)
            if match:
                classes.append({'name': match.group(1), 'line': i + 1})
    
    elif language == 'java':
        pattern = r'(?:public|private|protected)?\s*class\s+(\w+)'
        for i, line in enumerate(content.split('\n')):
            match = re.search(pattern, line)
            if match:
                classes.append({'name': match.group(1), 'line': i + 1})
    
    elif language in ['c', 'cpp', 'csharp']:
        patterns = [
            r'class\s+(\w+)',
            r'struct\s+(\w+)',
        ]
        for i, line in enumerate(content.split('\n')):
            for pattern in patterns:
                match = re.search(pattern, line)
                if match:
                    classes.append({'name': match.group(1), 'line': i + 1})
                    break
    
    return classes


def extract_imports_basic(content: str, language: str) -> List[str]:
    """Basic regex-based import extraction for languages without tree-sitter support."""
    imports = []
    
    if language == 'python':
        patterns = [
            r'^import\s+([\w.]+)',
            r'^from\s+([\w.]+)\s+import',
        ]
        for line in content.split('\n'):
            for pattern in patterns:
                match = re.match(pattern, line.strip())
                if match:
                    imports.append(match.group(1))
    
    elif language in ['javascript', 'typescript']:
        patterns = [
            r'import\s+.*\s+from\s+[\'"]([^\'"]+)[\'"]',
            r'require\s*\([\'"]([^\'"]+)[\'"]\)',
        ]
        for line in content.split('\n'):
            for pattern in patterns:
                match = re.search(pattern, line)
                if match:
                    imports.append(match.group(1))
    
    elif language == 'java':
        pattern = r'^import\s+([\w.]+);'
        for line in content.split('\n'):
            match = re.match(pattern, line.strip())
            if match:
                imports.append(match.group(1))
    
    elif language in ['c', 'cpp']:
        pattern = r'#include\s+[<"]([^>"]+)[>"]'
        for line in content.split('\n'):
            match = re.search(pattern, line)
            if match:
                imports.append(match.group(1))
    
    return imports


# In index_utils.py, add this function
def extract_with_tree_sitter(content: str, language: str, file_path: str) -> Dict:
    """Extract symbols using tree-sitter for supported languages"""
    if not TREE_SITTER_AVAILABLE:
        return {'chunk': content[:500]}  # Fallback to chunk
      
    try:
        # Map your language names to tree-sitter language names
        ts_lang_map = {
            'python': 'python',
            'javascript': 'javascript',
            'typescript': 'typescript',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'rust': 'rust',
            'go': 'go',
            'ruby': 'ruby',
            'php': 'php',
            # Add more mappings as needed
        }
          
        ts_lang = ts_lang_map.get(language)
        if not ts_lang:
            return {'chunk': content[:500]}
          
        # Get parser for this language
        parser = get_parser(ts_lang)
        tree = parser.parse(bytes(content, 'utf8'))
          
        # Extract function/class definitions
        functions = []
        classes = []
          
        def traverse(node):
            if node.type == 'function_definition':
                func_name = None
                for child in node.children:
                    if child.type == 'identifier':
                        func_name = content[child.start_byte:child.end_byte]
                        break
                if func_name:
                    functions.append({
                        'name': func_name,
                        'line': node.start_point[0] + 1
                    })
            elif node.type == 'class_definition':
                class_name = None
                for child in node.children:
                    if child.type == 'identifier':
                        class_name = content[child.start_byte:child.end_byte]
                        break
                if class_name:
                    classes.append({
                        'name': class_name,
                        'line': node.start_point[0] + 1
                    })
              
            for child in node.children:
                traverse(child)
          
        traverse(tree.root_node)
          
        return {
            'functions': functions,
            'classes': classes,
            'parsed_with': 'tree-sitter'
        }
          
    except Exception as e:
        return {'error': str(e), 'chunk': content[:500]}
        

# Markdown files to analyze
MARKDOWN_EXTENSIONS = {'.md', '.markdown', '.rst'}

# Add new category for instructional metadata
INSTRUCTIONAL_DIRS = {
    '.claude',
    'docs',
    'documentation'
}

# Common directory purposes
DIRECTORY_PURPOSES = {
    'auth': 'Authentication and authorization logic',
    'models': 'Data models and database schemas',
    'views': 'UI views and templates',
    'controllers': 'Request handlers and business logic',
    'services': 'Business logic and external service integrations',
    'utils': 'Shared utility functions and helpers',
    'helpers': 'Helper functions and utilities',
    'tests': 'Test files and test utilities',
    'test': 'Test files and test utilities',
    'spec': 'Test specifications',
    'docs': 'Project documentation',
    'api': 'API endpoints and route handlers',
    'components': 'Reusable UI components',
    'lib': 'Library code and shared modules',
    'src': 'Source code root directory',
    'static': 'Static assets (images, CSS, etc.)',
    'public': 'Publicly accessible files',
    'config': 'Configuration files and settings',
    'scripts': 'Build and utility scripts',
    'middleware': 'Middleware functions and handlers',
    'migrations': 'Database migration files',
    'fixtures': 'Test fixtures and sample data'
}

def extract_function_calls_python(body: str, all_functions: Set[str]) -> List[str]:
    """Extract function calls from Python code body."""
    calls = set()
    
    # Pattern for function calls: word followed by (
    # Excludes: control flow keywords, built-ins we don't care about
    call_pattern = r'\b(\w+)\s*\('
    exclude_keywords = {
        'if', 'elif', 'while', 'for', 'with', 'except', 'def', 'class',
        'return', 'yield', 'raise', 'assert', 'print', 'len', 'str', 
        'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'type',
        'isinstance', 'issubclass', 'super', 'range', 'enumerate', 'zip',
        'map', 'filter', 'sorted', 'reversed', 'open', 'input', 'eval'
    }
    
    for match in re.finditer(call_pattern, body):
        func_name = match.group(1)
        if func_name in all_functions and func_name not in exclude_keywords:
            calls.add(func_name)
    
    # Also catch method calls like self.method() or obj.method()
    method_pattern = r'(?:self|cls|\w+)\.(\w+)\s*\('
    for match in re.finditer(method_pattern, body):
        method_name = match.group(1)
        if method_name in all_functions:
            calls.add(method_name)
    
    return sorted(list(calls))


def extract_function_calls_javascript(body: str, all_functions: Set[str]) -> List[str]:
    """Extract function calls from JavaScript/TypeScript code body."""
    calls = set()
    
    # Pattern for function calls
    call_pattern = r'\b(\w+)\s*\('
    exclude_keywords = {
        'if', 'while', 'for', 'switch', 'catch', 'function', 'class',
        'return', 'throw', 'new', 'typeof', 'instanceof', 'void',
        'console', 'Array', 'Object', 'String', 'Number', 'Boolean',
        'Promise', 'Math', 'Date', 'JSON', 'parseInt', 'parseFloat'
    }
    
    for match in re.finditer(call_pattern, body):
        func_name = match.group(1)
        if func_name in all_functions and func_name not in exclude_keywords:
            calls.add(func_name)
    
    # Method calls: obj.method() or this.method()
    method_pattern = r'(?:this|\w+)\.(\w+)\s*\('
    for match in re.finditer(method_pattern, body):
        method_name = match.group(1)
        if method_name in all_functions:
            calls.add(method_name)
    
    return sorted(list(calls))
    
# For Prolog files
def extract_prolog_predicates(content: str) -> Dict:
    """Extract predicate signatures from Prolog"""
    predicates = {}
    # Rules (with :-)
    pattern = r'(\w+)\((.*?)\)\s*:-'
    for match in re.finditer(pattern, content):
        pred_name = match.group(1)
        predicates[pred_name] = {
            'type': 'rule',
            'arity': len([a for a in match.group(2).split(',') if a.strip()]),
            'line': content[:match.start()].count('\n') + 1
        }
    # Facts (without :-)
    fact_pattern = r'^(\w+)\((.*?)\)\.'
    for match in re.finditer(fact_pattern, content, re.MULTILINE):
        pred_name = match.group(1)
        if pred_name not in predicates:
            predicates[pred_name] = {
                'type': 'fact',
                'arity': len([a for a in match.group(2).split(',') if a.strip()]),
                'line': content[:match.start()].count('\n') + 1
            }
    return {'predicates': predicates}
  
# For ontology files (requires rdflib)
def extract_ontology_metadata(content: str, file_path: str) -> Dict:
    """Extract classes/properties from OWL/RDF"""
    try:
        from rdflib import Graph
        from rdflib.namespace import RDF, OWL
          
        g = Graph()
        g.parse(data=content, format='turtle')  # or detect format from extension
          
        return {
            'classes': [str(s) for s in g.subjects(RDF.type, OWL.Class)][:100],
            'properties': [str(s) for s in g.subjects(RDF.type, OWL.ObjectProperty)][:100],
            'axiom_count': len(list(g.triples((None, None, None))))
        }
    except Exception as e:
        return {'error': str(e)}
  
# For JSON files
def extract_json_schema(content: str) -> Dict:
    """Extract top-level keys from JSON"""
    try:
        data = json.loads(content)
        return {
            'top_level_keys': list(data.keys())[:50] if isinstance(data, dict) else [],
            'type': type(data).__name__,
            'size': len(str(data))
        }
    except:
        return {}
def extract_unity_components(content: str, file_path: str) -> Dict:
    """Extract Unity components from .unity/.prefab files"""
    import yaml
    try:
        data = yaml.safe_load(content)
        components = []
        game_objects = []
          
        # Unity files have multiple YAML documents
        for doc in data:
            if 'GameObject' in doc:
                game_objects.append(doc['GameObject'].get('m_Name', 'Unknown'))
            if 'MonoBehaviour' in doc:
                script = doc['MonoBehaviour'].get('m_Script', {})
                components.append(script.get('m_Name', 'Unknown'))
          
        return {
            'game_objects': game_objects[:50],
            'components': components[:50],
            'type': 'unity-scene'
        }
    except:
        return {'chunk': content[:500]}

def build_call_graph(functions: Dict, classes: Dict) -> Tuple[Dict, Dict]:
    """Build bidirectional call graph from extracted functions and methods."""
    calls_map = {}
    called_by_map = {}
    
    # Build calls_map from functions
    for func_name, func_info in functions.items():
        if isinstance(func_info, dict) and 'calls' in func_info:
            calls_map[func_name] = func_info['calls']
    
    # Build calls_map from class methods
    for class_name, class_info in classes.items():
        if isinstance(class_info, dict) and 'methods' in class_info:
            for method_name, method_info in class_info['methods'].items():
                if isinstance(method_info, dict) and 'calls' in method_info:
                    full_method_name = f"{class_name}.{method_name}"
                    calls_map[full_method_name] = method_info['calls']
    
    # Build the reverse index (called_by_map)
    for func_name, called_funcs in calls_map.items():
        for called_func in called_funcs:
            if called_func not in called_by_map:
                called_by_map[called_func] = []
            if func_name not in called_by_map[called_func]:
                called_by_map[called_func].append(func_name)
    
    return calls_map, called_by_map


def extract_python_signatures(content: str) -> Dict[str, Dict]:
    """Extract Python function and class signatures with full details for all files."""
    result = {
        'imports': [],
        'functions': {}, 
        'classes': {}, 
        'constants': {}, 
        'variables': [],
        'type_aliases': {},
        'enums': {},
        'call_graph': {}  # Track function calls for flow analysis
    }
    
    # Split into lines for line-by-line analysis
    lines = content.split('\n')
    
    # Track current class context
    current_class = None
    current_class_indent = -1
    class_stack = []  # For nested classes
    
    # First pass: collect all function and method names for call detection
    all_function_names = set()
    for line in lines:
        func_match = re.match(r'^(?:[ \t]*)(async\s+)?def\s+(\w+)\s*\(', line)
        if func_match:
            all_function_names.add(func_match.group(2))
    
    # Patterns
    class_pattern = r'^([ \t]*)class\s+(\w+)(?:\s*\((.*?)\))?:'
    func_pattern = r'^([ \t]*)(async\s+)?def\s+(\w+)\s*\((.*?)\)(?:\s*->\s*([^:]+))?:'
    property_pattern = r'^([ \t]*)(\w+)\s*:\s*([^=\n]+)'
    # Module-level constants (UPPERCASE_NAME = value)
    module_const_pattern = r'^([A-Z_][A-Z0-9_]*)\s*=\s*(.+)$'
    # Module-level variables with type annotations
    module_var_pattern = r'^(\w+)\s*:\s*([^=]+)\s*='
    # Class-level constants
    class_const_pattern = r'^([ \t]+)([A-Z_][A-Z0-9_]*)\s*=\s*(.+)$'
    # Import patterns
    import_pattern = r'^(?:from\s+([^\s]+)\s+)?import\s+(.+)$'
    # Type alias pattern
    type_alias_pattern = r'^(\w+)\s*=\s*(?:Union|Optional|List|Dict|Tuple|Set|Type|Callable|Literal|TypeVar|NewType|TypedDict|Protocol)\[.+\]$'
    # Decorator pattern
    decorator_pattern = r'^([ \t]*)@(\w+)(?:\(.*\))?$'
    # Docstring pattern (matches next line after function/class)
    docstring_pattern = r'^([ \t]*)(?:\'\'\'|""")(.+?)(?:\'\'\'|""")'
    
    # Dunder methods to skip (unless in critical files)
    skip_dunder = {'__repr__', '__str__', '__hash__', '__eq__', '__ne__', 
                   '__lt__', '__le__', '__gt__', '__ge__', '__bool__'}
    
    # First pass: Extract imports
    for line in lines:
        import_match = re.match(import_pattern, line.strip())
        if import_match:
            module, items = import_match.groups()
            if module:
                # from X import Y style
                result['imports'].append(module)
            else:
                # import X style
                for item in items.split(','):
                    item = item.strip().split(' as ')[0]  # Remove aliases
                    result['imports'].append(item)
    
    # Track decorators for next function/method
    pending_decorators = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Skip comments and docstrings
        if line.strip().startswith('#') or line.strip().startswith('"""') or line.strip().startswith("'''"):
            i += 1
            continue
        
        # Check for decorators
        decorator_match = re.match(decorator_pattern, line)
        if decorator_match:
            _, decorator_name = decorator_match.groups()
            pending_decorators.append(decorator_name)
            i += 1
            continue
        
        # Check for module-level constants (before checking classes)
        if not current_class:  # Only at module level
            # Check for type aliases first
            type_alias_match = re.match(type_alias_pattern, line)
            if type_alias_match:
                alias_name = type_alias_match.group(1)
                result['type_aliases'][alias_name] = line.split('=', 1)[1].strip()
                i += 1
                continue
            
            const_match = re.match(module_const_pattern, line)
            if const_match:
                const_name, const_value = const_match.groups()
                # Clean up the value (remove comments, strip quotes for readability)
                const_value = const_value.split('#')[0].strip()
                # Determine type from value
                if const_value.startswith(('{', '[')):
                    const_type = 'collection'
                elif const_value.startswith(("'", '"')):
                    const_type = 'str'
                elif const_value.replace('.', '').replace('-', '').isdigit():
                    const_type = 'number'
                else:
                    const_type = 'value'
                result['constants'][const_name] = const_type
                i += 1
                continue
            
            # Check for module-level typed variables
            var_match = re.match(module_var_pattern, line)
            if var_match:
                var_name, var_type = var_match.groups()
                if var_name not in result['variables'] and not var_name.startswith('_'):
                    result['variables'].append(var_name)
                i += 1
                continue
        
        # Check for class definition
        class_match = re.match(class_pattern, line)
        if class_match:
            indent, name, bases = class_match.groups()
            indent_level = len(indent)
            
            # Handle nested classes - pop from stack if dedented
            while class_stack and indent_level <= class_stack[-1][1]:
                class_stack.pop()
            
            # Only process top-level classes for the index
            if indent_level == 0:
                class_info = {'methods': {}, 'class_constants': {}}
                
                # Check for decorators on the class
                if pending_decorators:
                    class_info['decorators'] = pending_decorators.copy()
                    pending_decorators.clear()
                
                # Add inheritance info and check special types
                if bases:
                    base_list = [b.strip() for b in bases.split(',') if b.strip()]
                    if base_list:
                        class_info['inherits'] = base_list
                        
                        # Check for special class types
                        base_names_lower = [b.lower() for b in base_list]
                        if 'enum' in base_names_lower or any('enum' in b for b in base_names_lower):
                            class_info['type'] = 'enum'
                            # We'll extract enum values later
                        elif 'exception' in base_names_lower or 'error' in base_names_lower or any('exception' in b or 'error' in b for b in base_names_lower):
                            class_info['type'] = 'exception'
                        elif 'abc' in base_names_lower or 'protocol' in base_names_lower:
                            class_info['abstract'] = True
                
                # Extract docstring
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    doc_match = re.match(docstring_pattern, lines[i + 1])
                    if doc_match:
                        _, doc_content = doc_match.groups()
                        class_info['doc'] = doc_content.strip()
                
                class_info['line'] = i + 1  # Store line number (1-based)
                result['classes'][name] = class_info
                current_class = name
                current_class_indent = indent_level
            
            # Add to stack
            class_stack.append((name, indent_level))
            i += 1
            continue
        
        # Check if we've left the current class (dedented to module level)
        if current_class and line.strip() and len(line) - len(line.lstrip()) <= current_class_indent:
            # Check if it's not just a blank line or comment
            if not line.strip().startswith('#'):
                current_class = None
                current_class_indent = -1
        
        # Check for class-level constants or enum values
        if current_class:
            # For enums, capture all uppercase attributes as values
            if result['classes'][current_class].get('type') == 'enum':
                # Enum value pattern (NAME = value or just NAME)
                enum_val_pattern = r'^([ \t]+)([A-Z_][A-Z0-9_]*)\s*(?:=\s*(.+))?$'
                enum_match = re.match(enum_val_pattern, line)
                if enum_match:
                    indent, enum_name, enum_value = enum_match.groups()
                    if len(indent) > current_class_indent:
                        if 'values' not in result['classes'][current_class]:
                            result['classes'][current_class]['values'] = []
                        result['classes'][current_class]['values'].append(enum_name)
                        i += 1
                        continue
            
            class_const_match = re.match(class_const_pattern, line)
            if class_const_match:
                indent, const_name, const_value = class_const_match.groups()
                if len(indent) > current_class_indent:
                    # Clean up the value
                    const_value = const_value.split('#')[0].strip()
                    # Determine type
                    if const_value.startswith(('{', '[')):
                        const_type = 'collection'
                    elif const_value.startswith(("'", '"')):
                        const_type = 'str'
                    elif const_value.replace('.', '').replace('-', '').isdigit():
                        const_type = 'number'
                    else:
                        const_type = 'value'
                    result['classes'][current_class]['class_constants'][const_name] = const_type
                    i += 1
                    continue
        
        # Check for function/method definition
        # First check if this line starts a function definition
        func_start_pattern = r'^([ \t]*)(async\s+)?def\s+(\w+)\s*\('
        func_start_match = re.match(func_start_pattern, line)
        
        if func_start_match:
            indent, is_async, name = func_start_match.groups()
            indent_level = len(indent)
            
            # Collect the full signature across multiple lines
            full_sig = line.rstrip()
            j = i
            
            # Keep collecting lines until we find the colon that ends the signature
            while j < len(lines) and not re.search(r'\).*:', lines[j]):
                j += 1
                if j < len(lines):
                    full_sig += ' ' + lines[j].strip()
            
            # Make sure we have a complete signature
            if j >= len(lines):
                i += 1
                continue
                
            # Now parse the complete signature
            complete_match = re.match(func_pattern, full_sig)
            if complete_match:
                indent, is_async, name, params, return_type = complete_match.groups()
                i = j  # Skip to the last line we processed
            else:
                # Failed to parse, skip this function
                i += 1
                continue
            
            # Clean params
            params = re.sub(r'\s+', ' ', params).strip()
            
            # Skip certain dunder methods (except __init__)
            if name in skip_dunder and name != '__init__':
                i += 1
                continue
            
            # Build function/method info
            func_info = {
                'line': i + 1  # Store line number (1-based)
            }
            
            # Build full signature
            signature = f"({params})"
            if return_type:
                signature += f" -> {return_type.strip()}"
            if is_async:
                signature = "async " + signature
            
            # Add decorators if any
            if pending_decorators:
                func_info['decorators'] = pending_decorators.copy()
                # Check for abstractmethod
                if 'abstractmethod' in pending_decorators:
                    if current_class:
                        result['classes'][current_class]['abstract'] = True
                pending_decorators.clear()
            
            # Extract docstring
            if i + 1 < len(lines):
                doc_match = re.match(docstring_pattern, lines[i + 1])
                if doc_match:
                    _, doc_content = doc_match.groups()
                    func_info['doc'] = doc_content.strip()
            
            # Extract function body to find calls
            func_body_start = i + 1
            func_body_lines = []
            func_indent = len(indent) if indent else 0
            
            # Skip past any docstring (but include it in body for now)
            body_idx = func_body_start
            
            # Collect function body - everything indented more than the def line
            while body_idx < len(lines):
                body_line = lines[body_idx]
                
                # Skip empty lines
                if not body_line.strip():
                    func_body_lines.append(body_line)
                    body_idx += 1
                    continue
                
                # Check indentation to see if we're still in the function
                line_indent = len(body_line) - len(body_line.lstrip())
                
                # If we hit a line that's not indented more than the function def, we're done
                if line_indent <= func_indent and body_line.strip():
                    break
                    
                func_body_lines.append(body_line)
                body_idx += 1
            
            # Extract calls from the body
            if func_body_lines:
                func_body = '\n'.join(func_body_lines)
                calls = extract_function_calls_python(func_body, all_function_names)
                if calls:
                    func_info['calls'] = calls
            
            # Always store as dict to include line number
            func_info['signature'] = signature
            
            # Determine where to place this function
            if current_class and indent_level > current_class_indent:
                # It's a method of the current class
                result['classes'][current_class]['methods'][name] = func_info
            elif indent_level == 0:
                # It's a module-level function
                result['functions'][name] = func_info
        
        # Check for class properties
        if current_class:
            prop_match = re.match(property_pattern, line)
            if prop_match:
                indent, prop_name, prop_type = prop_match.groups()
                if len(indent) > current_class_indent and not prop_name.startswith('_'):
                    if 'properties' not in result['classes'][current_class]:
                        result['classes'][current_class]['properties'] = []
                    result['classes'][current_class]['properties'].append(prop_name)
        
        i += 1
    
    # Post-process - remove empty collections
    for class_name, class_info in result['classes'].items():
        if 'properties' in class_info and not class_info['properties']:
            del class_info['properties']
        if 'class_constants' in class_info and not class_info['class_constants']:
            del class_info['class_constants']
        if 'decorators' in class_info and not class_info['decorators']:
            del class_info['decorators']
        if 'values' in class_info and not class_info['values']:
            del class_info['values']
    
    # Remove empty module-level collections
    if not result['constants']:
        del result['constants']
    if not result['variables']:
        del result['variables']
    if not result['type_aliases']:
        del result['type_aliases']
    if not result['enums']:
        del result['enums']
    if not result['imports']:
        del result['imports']
    
    # Move enum classes to enums section
    enums_to_move = {}
    for class_name, class_info in list(result['classes'].items()):
        if class_info.get('type') == 'enum':
            enums_to_move[class_name] = {
                'values': class_info.get('values', []),
                'doc': class_info.get('doc', '')
            }
            del result['classes'][class_name]
    
    if enums_to_move:
        result['enums'] = enums_to_move
    
    return result

def extract_game_script_metadata(content: str, file_path: str) -> Dict:
    """Phase 1: Extract basic structure only, no semantic analysis"""
      
    # Detect language (handles .pl conflicts, etc.)
    language = detect_language_from_content(content, file_path)
      
    result = {
        'language': language,
        'line_count': len(content.splitlines()),
        'has_main': 'if __name__ == "__main__"' in content,
        'file_size': len(content),
    }
      
    # Use tree-sitter for supported languages
    if language in ['python', 'javascript', 'typescript']:
        try:
            tree_sitter_data = extract_with_tree_sitter(content, language, file_path)
            result.update({
                'functions': tree_sitter_data.get('functions', []),
                'classes': tree_sitter_data.get('classes', []),
                'imports': tree_sitter_data.get('imports', []),
            })
        except Exception as e:
            # Fallback to basic extraction
            result.update({
                'functions': extract_function_signatures_basic(content, language),
                'classes': extract_class_names_basic(content, language),
                'imports': extract_imports_basic(content, language),
                'extraction_error': str(e)
            })
    else:
        # For non-tree-sitter languages, use basic regex extraction
        result.update({
            'functions': extract_function_signatures_basic(content, language),
            'classes': extract_class_names_basic(content, language),
            'imports': extract_imports_basic(content, language),
        })
      
    return result

def extract_javascript_signatures(content: str) -> Dict[str, any]:
    """Extract JavaScript/TypeScript function and class signatures with full details."""
    result = {
        'imports': [],
        'functions': {}, 
        'classes': {}, 
        'constants': {}, 
        'variables': [],
        'type_aliases': {},
        'interfaces': {},
        'enums': {},
        'call_graph': {}  # Track function calls for flow analysis
    }
    
    # Helper to convert character position to line number
    def pos_to_line(pos: int) -> int:
        return content[:pos].count('\n') + 1
    
    # First pass: collect all function names for call detection
    all_function_names = set()
    # Regular functions
    for match in re.finditer(r'(?:async\s+)?function\s+(\w+)', content):
        all_function_names.add(match.group(1))
    # Arrow functions and const functions
    for match in re.finditer(r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(', content):
        all_function_names.add(match.group(1))
    # Method names
    for match in re.finditer(r'(\w+)\s*\([^)]*\)\s*{', content):
        all_function_names.add(match.group(1))
    
    # Extract imports first
    # import X from 'Y', import {X} from 'Y', import * as X from 'Y'
    import_pattern = r'import\s+(?:([^{}\s]+)|{([^}]+)}|\*\s+as\s+(\w+))\s+from\s+[\'"]([^\'"]+)[\'"]'
    for match in re.finditer(import_pattern, content):
        default_import, named_imports, namespace_import, module = match.groups()
        if module:
            result['imports'].append(module)
    
    # require() style imports
    require_pattern = r'(?:const|let|var)\s+(?:{[^}]+}|\w+)\s*=\s*require\s*\([\'"]([^\'"]+)[\'"]\)'
    for match in re.finditer(require_pattern, content):
        result['imports'].append(match.group(1))
    
    # Extract type aliases (TypeScript) - improved pattern to capture all type aliases
    type_alias_pattern = r'(?:export\s+)?type\s+(\w+)\s*=\s*([^;]+);'

    for match in re.finditer(type_alias_pattern, content):
        alias_name, alias_type = match.groups()
        # Clean up the type definition
        clean_type = ' '.join(alias_type.strip().split())
        
        # If it starts with { but seems incomplete, try to capture the full object
        if clean_type.startswith('{') and clean_type.count('{') > clean_type.count('}'):
            # Find the position after the = sign
            start_pos = match.start(2)
            brace_count = 0
            end_pos = start_pos
            
            # Count braces to find the complete type
            for i, char in enumerate(content[start_pos:]):
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end_pos = start_pos + i + 1
                        break
            
            if end_pos > start_pos:
                complete_type = content[start_pos:end_pos].strip()
                clean_type = ' '.join(complete_type.split())
        
        result['type_aliases'][alias_name] = clean_type
    
    # Extract interfaces (TypeScript)
    interface_pattern = r'(?:export\s+)?interface\s+(\w+)(?:\s+extends\s+([^{]+))?\s*{'
    for match in re.finditer(interface_pattern, content):
        interface_name, extends = match.groups()
        interface_info = {}
        if extends:
            interface_info['extends'] = [e.strip() for e in extends.split(',')]
        # Extract first line of JSDoc if present
        jsdoc_match = re.search(r'/\*\*\s*\n?\s*\*?\s*([^@\n]+)', content[:match.start()])
        if jsdoc_match:
            interface_info['doc'] = jsdoc_match.group(1).strip()
        result['interfaces'][interface_name] = interface_info
    
    # Extract enums (TypeScript)
    enum_pattern = r'(?:export\s+)?enum\s+(\w+)\s*{'
    enum_matches = list(re.finditer(enum_pattern, content))
    for match in enum_matches:
        enum_name = match.group(1)
        # Find enum values
        start_pos = match.end()
        brace_count = 1
        end_pos = start_pos
        for i in range(start_pos, len(content)):
            if content[i] == '{':
                brace_count += 1
            elif content[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_pos = i
                    break
        
        enum_body = content[start_pos:end_pos]
        # Extract enum values
        value_pattern = r'(\w+)\s*(?:=\s*[^,\n]+)?'
        values = re.findall(value_pattern, enum_body)
        result['enums'][enum_name] = {'values': values}
    
    # Extract module-level constants and variables
    # const CONSTANT_NAME = value
    const_pattern = r'(?:export\s+)?const\s+([A-Z_][A-Z0-9_]*)\s*=\s*([^;]+)'
    for match in re.finditer(const_pattern, content):
        const_name, const_value = match.groups()
        const_value = const_value.strip()
        if const_value.startswith(('{', '[')):
            const_type = 'collection'
        elif const_value.startswith(("'", '"', '`')):
            const_type = 'str'
        elif const_value.replace('.', '').replace('-', '').isdigit():
            const_type = 'number'
        else:
            const_type = 'value'
        result['constants'][const_name] = const_type
    
    # let/const variables (not uppercase)
    var_pattern = r'(?:export\s+)?(?:let|const)\s+([a-z]\w*)\s*(?::\s*\w+)?\s*='
    for match in re.finditer(var_pattern, content):
        var_name = match.group(1)
        if var_name not in result['variables']:
            result['variables'].append(var_name)
    
    # Find all classes first with their boundaries
    class_pattern = r'(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?'
    class_positions = {}  # {class_name: (start_pos, end_pos)}
    
    for match in re.finditer(class_pattern, content):
        class_name, extends = match.groups()
        start_pos = match.start()
        
        # Find the class body (between { and })
        brace_count = 0
        in_class = False
        end_pos = start_pos
        
        for i in range(match.end(), len(content)):
            if content[i] == '{':
                if not in_class:
                    in_class = True
                brace_count += 1
            elif content[i] == '}':
                brace_count -= 1
                if brace_count == 0 and in_class:
                    end_pos = i
                    break
        
        class_positions[class_name] = (start_pos, end_pos)
        
        # Initialize class info
        class_info = {
            'line': pos_to_line(start_pos),
            'methods': {}, 
            'static_constants': {}
        }
        if extends:
            class_info['extends'] = extends
            # Check for exception classes
            if extends.lower() in ['error', 'exception'] or 'error' in extends.lower():
                class_info['type'] = 'exception'
        
        # Extract JSDoc comment
        jsdoc_match = re.search(r'/\*\*\s*\n?\s*\*?\s*([^@\n]+)', content[:start_pos])
        if jsdoc_match:
            class_info['doc'] = jsdoc_match.group(1).strip()
        
        result['classes'][class_name] = class_info
    
    # Extract methods from classes
    method_patterns = [
        # Regular methods: methodName(...) { or async methodName(...) {
        r'^\s*(async\s+)?(\w+)\s*\((.*?)\)\s*(?::\s*([^{]+))?\s*{',
        # Arrow function properties: methodName = (...) => {
        r'^\s*(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*(?::\s*([^=]+))?\s*=>',
        # Constructor
        r'^\s*(constructor)\s*\(([^)]*)\)\s*{'
    ]
    
    for class_name, (start, end) in class_positions.items():
        class_content = content[start:end]
        
        for pattern in method_patterns:
            for match in re.finditer(pattern, class_content, re.MULTILINE):
                # Extract method name and params based on pattern
                if 'constructor' in pattern:
                    method_name = '__init__'  # Convert to Python-style
                    params = match.group(2)
                    return_type = None
                elif '=' in pattern:
                    method_name = match.group(1)
                    params = match.group(2)
                    return_type = match.group(3)
                else:
                    is_async = match.group(1)
                    method_name = match.group(2)
                    params = match.group(3)
                    return_type = match.group(4)
                
                # Skip getters/setters and keywords
                if method_name in ['get', 'set', 'if', 'for', 'while', 'switch', 'catch', 'try']:
                    continue
                
                method_info = {
                    'line': pos_to_line(start + match.start())
                }
                
                # Build full signature
                params = re.sub(r'\s+', ' ', params).strip()
                signature = f"({params})"
                if return_type:
                    signature += f": {return_type.strip()}"
                if 'async' in str(match.group(0)):
                    signature = "async " + signature
                
                # Try to extract method body for call analysis
                method_start = match.end()
                # Find the opening brace
                brace_pos = class_content.find('{', method_start)
                if brace_pos != -1 and brace_pos - method_start < 100:
                    # Extract method body
                    brace_count = 1
                    body_start = brace_pos + 1
                    body_end = body_start
                    
                    for i in range(body_start, min(len(class_content), body_start + 3000)):
                        if class_content[i] == '{':
                            brace_count += 1
                        elif class_content[i] == '}':
                            brace_count -= 1
                            if brace_count == 0:
                                body_end = i
                                break
                    
                    if body_end > body_start:
                        method_body = class_content[body_start:body_end]
                        calls = extract_function_calls_javascript(method_body, all_function_names)
                        if calls:
                            method_info['calls'] = calls
                
                # Store method info
                if method_info:
                    method_info['signature'] = signature
                    result['classes'][class_name]['methods'][method_name] = method_info
                else:
                    result['classes'][class_name]['methods'][method_name] = signature
        
        # Extract static constants in class
        static_const_pattern = r'static\s+([A-Z_][A-Z0-9_]*)\s*=\s*([^;]+)'
        for match in re.finditer(static_const_pattern, class_content):
            const_name, const_value = match.groups()
            const_value = const_value.strip()
            if const_value.startswith(('{', '[')):
                const_type = 'collection'
            elif const_value.startswith(("'", '"', '`')):
                const_type = 'str'
            elif const_value.replace('.', '').replace('-', '').isdigit():
                const_type = 'number'
            else:
                const_type = 'value'
            result['classes'][class_name]['static_constants'][const_name] = const_type
    
    # Extract standalone functions (not inside classes)
    func_patterns = [
        # Function declarations
        r'(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*(?:<[^>]+>)?\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?',
        # Arrow functions assigned to const
        r'(?:export\s+)?const\s+(\w+)\s*(?::\s*[^=]+)?\s*=\s*(?:async\s+)?\(([^)]*)\)\s*(?::\s*([^=]+))?\s*=>'
    ]
    
    for pattern in func_patterns:
        for match in re.finditer(pattern, content):
            func_name = match.group(1)
            params = match.group(2) if match.lastindex >= 2 else ''
            return_type = match.group(3) if match.lastindex >= 3 else None
            
            # Check if this function is inside any class
            func_pos = match.start()
            inside_class = False
            for class_name, (start, end) in class_positions.items():
                if start <= func_pos <= end:
                    inside_class = True
                    break
            
            if not inside_class:
                func_info = {
                    'line': pos_to_line(func_pos)
                }
                
                # Build full signature
                params = re.sub(r'\s+', ' ', params).strip()
                signature = f"({params})"
                if return_type:
                    signature += f": {return_type.strip()}"
                if 'async' in match.group(0):
                    signature = "async " + signature
                
                # Try to extract function body for call analysis
                func_start = match.end()
                # Find the opening brace
                brace_pos = content.find('{', func_start)
                if brace_pos != -1 and brace_pos - func_start < 100:  # Reasonable distance
                    # Extract function body
                    brace_count = 1
                    body_start = brace_pos + 1
                    body_end = body_start
                    
                    for i in range(body_start, min(len(content), body_start + 5000)):  # Limit scan
                        if content[i] == '{':
                            brace_count += 1
                        elif content[i] == '}':
                            brace_count -= 1
                            if brace_count == 0:
                                body_end = i
                                break
                    
                    if body_end > body_start:
                        func_body = content[body_start:body_end]
                        calls = extract_function_calls_javascript(func_body, all_function_names)
                        if calls:
                            func_info['calls'] = calls
                
                # Store function info
                if func_info:
                    func_info['signature'] = signature
                    result['functions'][func_name] = func_info
                else:
                    result['functions'][func_name] = signature
    
    # Clean up empty collections
    for class_name, class_info in result['classes'].items():
        if 'static_constants' in class_info and not class_info['static_constants']:
            del class_info['static_constants']
    
    # Remove empty module-level collections
    if not result['constants']:
        del result['constants']
    if not result['variables']:
        del result['variables']
    if not result['imports']:
        del result['imports']
    if not result['type_aliases']:
        del result['type_aliases']
    if not result['interfaces']:
        del result['interfaces']
    if not result['enums']:
        del result['enums']
    
    return result


def extract_function_calls_shell(body: str, all_functions: Set[str]) -> List[str]:
    """Extract function calls from shell script body."""
    calls = set()
    
    # In shell, functions are called just by name (no parentheses)
    # We need to be careful to avoid false positives
    for func_name in all_functions:
        # Look for function name at start of line or after common shell operators
        patterns = [
            rf'^\s*{func_name}\b',  # Start of line
            rf'[;&|]\s*{func_name}\b',  # After operators
            rf'\$\({func_name}\b',  # Command substitution
            rf'`{func_name}\b',  # Backtick substitution
        ]
        for pattern in patterns:
            if re.search(pattern, body, re.MULTILINE):
                calls.add(func_name)
                break
    
    return sorted(list(calls))


def extract_shell_signatures(content: str) -> Dict[str, any]:
    """Extract shell script function signatures and structure."""
    result = {
        'functions': {},
        'variables': [],
        'exports': {},
        'sources': [],
        'call_graph': {}  # Track function calls
    }

    lines = content.split('\n')
    
    # First pass: collect all function names
    all_function_names = set()
    for line in lines:
        # Style 1: function_name() {
        match1 = re.match(r'^(\w+)\s*\(\)\s*\{?', line)
        if match1:
            all_function_names.add(match1.group(1))
        # Style 2: function function_name {
        match2 = re.match(r'^function\s+(\w+)\s*\{?', line)
        if match2:
            all_function_names.add(match2.group(1))
    
    # Function patterns
    # Style 1: function_name() { ... }
    func_pattern1 = r'^(\w+)\s*\(\)\s*\{?'
    # Style 2: function function_name { ... }
    func_pattern2 = r'^function\s+(\w+)\s*\{?'
    
    # Variable patterns
    # Export pattern: export VAR=value
    export_pattern = r'^export\s+([A-Z_][A-Z0-9_]*)(=(.*))?'
    # Regular variable: VAR=value (uppercase)
    var_pattern = r'^([A-Z_][A-Z0-9_]*)=(.+)$'
    
    # Source patterns - handle quotes and command substitution
    source_patterns = [
        r'^(?:source|\.)\s+([\'"])([^\'"]+)\1',  # Quoted paths
        r'^(?:source|\.)\s+(\$\([^)]+\)[^\s]*)',  # Command substitution like $(dirname "$0")/file
        r'^(?:source|\.)\s+([^\s]+)',  # Unquoted paths
    ]
    
    # Track if we're in a function
    in_function = False
    current_function = None
    function_start_line = -1
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Skip empty lines and pure comments
        if not stripped or stripped.startswith('#!'):
            continue
            
        # Check for function definition (style 1)
        match = re.match(func_pattern1, stripped)
        if match:
            func_name = match.group(1)
            # Extract documentation comment if present
            doc = None
            if i > 0 and lines[i-1].strip().startswith('#'):
                doc = lines[i-1].strip()[1:].strip()
            
            # Try to find parameters from the function body
            params = []
            brace_count = 0
            in_func_body = False
            
            # Look for $1, $2, etc. usage in the function body only
            for j in range(i+1, min(i+20, len(lines))):
                line_content = lines[j].strip()
                
                # Track braces to know when we're in the function
                if '{' in line_content:
                    brace_count += line_content.count('{')
                    in_func_body = True
                if '}' in line_content:
                    brace_count -= line_content.count('}')
                    if brace_count <= 0:
                        break  # End of function
                
                # Only look for parameters inside the function body
                if in_func_body:
                    param_matches = re.findall(r'\$(\d+)', lines[j])
                    for p in param_matches:
                        param_num = int(p)
                        if param_num > 0 and param_num not in params:
                            params.append(param_num)
            
            # Build signature
            if params:
                max_param = max(params)
                param_list = ' '.join(f'$1' if j == 1 else f'${{{j}}}' for j in range(1, max_param + 1))
                signature = f"({param_list})"
            else:
                signature = "()"
            
            # Extract function body for call analysis
            func_body_lines = []
            brace_count = 0
            in_func_body = False
            for j in range(i+1, len(lines)):
                line_content = lines[j]
                if '{' in line_content:
                    brace_count += line_content.count('{')
                    in_func_body = True
                if in_func_body:
                    func_body_lines.append(line_content)
                if '}' in line_content:
                    brace_count -= line_content.count('}')
                    if brace_count <= 0:
                        break
            
            func_info = {}
            if func_body_lines:
                func_body = '\n'.join(func_body_lines)
                calls = extract_function_calls_shell(func_body, all_function_names)
                if calls:
                    func_info['calls'] = calls
            
            if doc:
                func_info['doc'] = doc
            
            if func_info:
                func_info['signature'] = signature
                result['functions'][func_name] = func_info
            else:
                result['functions'][func_name] = signature
            continue
            
        # Check for function definition (style 2)
        match = re.match(func_pattern2, stripped)
        if match:
            func_name = match.group(1)
            # Extract documentation comment if present
            doc = None
            if i > 0 and lines[i-1].strip().startswith('#'):
                doc = lines[i-1].strip()[1:].strip()
            
            # Try to find parameters from the function body
            params = []
            brace_count = 0
            in_func_body = False
            
            # Look for $1, $2, etc. usage in the function body only
            for j in range(i+1, min(i+20, len(lines))):
                line_content = lines[j].strip()
                
                # Track braces to know when we're in the function
                if '{' in line_content:
                    brace_count += line_content.count('{')
                    in_func_body = True
                if '}' in line_content:
                    brace_count -= line_content.count('}')
                    if brace_count <= 0:
                        break  # End of function
                
                # Only look for parameters inside the function body
                if in_func_body:
                    param_matches = re.findall(r'\$(\d+)', lines[j])
                    for p in param_matches:
                        param_num = int(p)
                        if param_num > 0 and param_num not in params:
                            params.append(param_num)
            
            # Build signature
            if params:
                max_param = max(params)
                param_list = ' '.join(f'$1' if j == 1 else f'${{{j}}}' for j in range(1, max_param + 1))
                signature = f"({param_list})"
            else:
                signature = "()"
            
            # Extract function body for call analysis
            func_body_lines = []
            brace_count = 0
            in_func_body = False
            for j in range(i+1, len(lines)):
                line_content = lines[j]
                if '{' in line_content:
                    brace_count += line_content.count('{')
                    in_func_body = True
                if in_func_body:
                    func_body_lines.append(line_content)
                if '}' in line_content:
                    brace_count -= line_content.count('}')
                    if brace_count <= 0:
                        break
            
            func_info = {}
            if func_body_lines:
                func_body = '\n'.join(func_body_lines)
                calls = extract_function_calls_shell(func_body, all_function_names)
                if calls:
                    func_info['calls'] = calls
            
            if doc:
                func_info['doc'] = doc
            
            if func_info:
                func_info['signature'] = signature
                result['functions'][func_name] = func_info
            else:
                result['functions'][func_name] = signature
            continue
        
        # Check for exports
        match = re.match(export_pattern, stripped)
        if match:
            var_name = match.group(1)
            var_value = match.group(3) if match.group(3) else None
            if var_value:
                # Determine type
                if var_value.startswith(("'", '"')):
                    var_type = 'str'
                elif var_value.isdigit():
                    var_type = 'number'
                else:
                    var_type = 'value'
                result['exports'][var_name] = var_type
            continue
        
        # Check for regular variables (uppercase)
        match = re.match(var_pattern, stripped)
        if match:
            var_name = match.group(1)
            # Only track if not already in exports
            if var_name not in result['exports'] and var_name not in result['variables']:
                result['variables'].append(var_name)
            continue
        
        # Check for source/dot includes
        for source_pattern in source_patterns:
            match = re.match(source_pattern, stripped)
            if match:
                # Extract the file path based on which pattern matched
                if len(match.groups()) == 2:  # Quoted pattern
                    sourced_file = match.group(2)
                else:  # Unquoted or command substitution
                    sourced_file = match.group(1)
                
                sourced_file = sourced_file.strip()
                if sourced_file and sourced_file not in result['sources']:
                    result['sources'].append(sourced_file)
                break  # Found a match, no need to try other patterns
    
    # Clean up empty collections
    if not result['variables']:
        del result['variables']
    if not result['exports']:
        del result['exports']
    if not result['sources']:
        del result['sources']
    
    return result


def extract_function_calls_csharp(body: str, all_functions: Set[str]) -> List[str]:
    """Extract function/method calls from C# code body."""
    calls = set()
    
    # Pattern for function calls: word followed by (
    # Excludes: control flow keywords, built-ins we don't care about
    call_pattern = r'\b(\w+)\s*\('
    exclude_keywords = {
        'if', 'while', 'for', 'foreach', 'switch', 'catch', 'return',
        'throw', 'new', 'typeof', 'nameof', 'sizeof', 'using', 'lock',
        'Console', 'Debug', 'String', 'Int32', 'Convert', 'Math',
        'DateTime', 'Task', 'List', 'Dictionary', 'Array', 'Enum'
    }
    
    for match in re.finditer(call_pattern, body):
        func_name = match.group(1)
        if func_name in all_functions and func_name not in exclude_keywords:
            calls.add(func_name)
    
    # Also catch method calls like this.Method() or obj.Method()
    method_pattern = r'(?:this|\w+)\.(\w+)\s*\('
    for match in re.finditer(method_pattern, body):
        method_name = match.group(1)
        if method_name in all_functions:
            calls.add(method_name)
    
    return sorted(list(calls))


def extract_csharp_signatures(content: str) -> Dict[str, any]:
    """Extract C# class, method, and property signatures with full details."""
    result = {
        'using': [],  # Using statements (imports)
        'namespace': None,  # Namespace
        'functions': {},  # Top-level functions (rare in C#)
        'classes': {},
        'interfaces': {},
        'enums': {},
        'constants': {},
        'call_graph': {}
    }
    
    lines = content.split('\n')
    
    # Helper to convert character position to line number
    def pos_to_line(pos: int) -> int:
        return content[:pos].count('\n') + 1
    
    # First pass: collect all method names for call detection
    all_function_names = set()
    for line in lines:
        # Methods
        method_match = re.search(r'(?:public|private|protected|internal|static|virtual|override|abstract|async)\s+(?:\w+\s+)+(\w+)\s*(?:<[^>]+>)?\s*\(', line)
        if method_match:
            all_function_names.add(method_match.group(1))
    
    # Extract using statements
    using_pattern = r'^\s*using\s+(?:static\s+)?([^;=]+);'
    for line in lines:
        match = re.match(using_pattern, line)
        if match:
            using_stmt = match.group(1).strip()
            # Remove 'as' aliases
            if ' as ' in using_stmt:
                using_stmt = using_stmt.split(' as ')[0].strip()
            result['using'].append(using_stmt)
    
    # Extract namespace
    namespace_pattern = r'^\s*namespace\s+([\w.]+)'
    for line in lines:
        match = re.match(namespace_pattern, line)
        if match:
            result['namespace'] = match.group(1)
            break
    
    # Extract enums
    enum_pattern = r'(?:public|private|protected|internal)?\s*enum\s+(\w+)'
    enum_matches = list(re.finditer(enum_pattern, content))
    for match in enum_matches:
        enum_name = match.group(1)
        enum_info = {'line': pos_to_line(match.start())}
        
        # Find enum body
        start_pos = match.end()
        brace_pos = content.find('{', start_pos)
        if brace_pos != -1:
            brace_count = 1
            body_start = brace_pos + 1
            body_end = body_start
            
            for i in range(body_start, len(content)):
                if content[i] == '{':
                    brace_count += 1
                elif content[i] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        body_end = i
                        break
            
            if body_end > body_start:
                enum_body = content[body_start:body_end]
                # Extract enum values
                value_pattern = r'(\w+)\s*(?:=\s*[^,\n]+)?'
                values = re.findall(value_pattern, enum_body)
                enum_info['values'] = [v for v in values if v]
        
        result['enums'][enum_name] = enum_info
    
    # Find all classes and interfaces with their boundaries
    class_pattern = r'(?:public|private|protected|internal|abstract|sealed|static|partial)?\s*(class|interface|struct)\s+(\w+)(?:\s*:\s*([^{]+))?'
    type_positions = {}  # {type_name: (type_kind, start_pos, end_pos)}
    
    for match in re.finditer(class_pattern, content):
        type_kind = match.group(1)  # 'class', 'interface', or 'struct'
        type_name = match.group(2)
        inheritance = match.group(3)
        start_pos = match.start()
        
        # Find the type body (between { and })
        brace_count = 0
        in_type = False
        end_pos = start_pos
        
        for i in range(match.end(), len(content)):
            if content[i] == '{':
                if not in_type:
                    in_type = True
                brace_count += 1
            elif content[i] == '}':
                brace_count -= 1
                if brace_count == 0 and in_type:
                    end_pos = i
                    break
        
        type_positions[type_name] = (type_kind, start_pos, end_pos)
        
        # Initialize type info
        type_info = {
            'line': pos_to_line(start_pos),
            'methods': {},
            'properties': [],
            'constants': {}
        }
        
        if inheritance:
            bases = [b.strip() for b in inheritance.split(',')]
            type_info['inherits'] = bases
        
        # Extract XML doc comment or regular comment
        doc_match = re.search(r'///\s*<summary>\s*(.+?)\s*</summary>', content[:start_pos][-500:], re.DOTALL)
        if doc_match:
            type_info['doc'] = doc_match.group(1).strip()
        
        # Store in appropriate collection
        if type_kind == 'interface':
            result['interfaces'][type_name] = type_info
        else:
            result['classes'][type_name] = type_info
    
    # Extract methods, properties, and constants from classes/interfaces
    for type_name, (type_kind, start, end) in type_positions.items():
        type_content = content[start:end]
        
        # Determine where to store this type's info
        if type_kind == 'interface':
            type_info = result['interfaces'][type_name]
        else:
            type_info = result['classes'][type_name]
        
        # Extract methods
        # Pattern for method signatures with access modifiers
        method_pattern = r'(?:public|private|protected|internal)?\s*(?:static|virtual|override|abstract|async|sealed|partial)?\s*(?:static|virtual|override|abstract|async|sealed|partial)?\s*(\w+(?:<[^>]+>)?)\s+(\w+)\s*(?:<[^>]+>)?\s*\(([^)]*)\)'
        
        for match in re.finditer(method_pattern, type_content, re.MULTILINE):
            return_type = match.group(1)
            method_name = match.group(2)
            params = match.group(3)
            
            # Skip properties (get/set) and some keywords
            if method_name in ['get', 'set', 'if', 'while', 'for', 'foreach', 'switch', 'catch', 'lock', 'using']:
                continue
            
            # Skip constructor (same name as class)
            if method_name == type_name:
                method_name = '__init__'  # Convert to Python-style
            
            method_info = {
                'line': pos_to_line(start + match.start())
            }
            
            # Build signature
            params = re.sub(r'\s+', ' ', params).strip()
            signature = f"({params})"
            if return_type and return_type != 'void':
                signature += f": {return_type}"
            
            # Extract method body for call analysis
            method_start = match.end()
            brace_pos = type_content.find('{', method_start)
            if brace_pos != -1 and brace_pos - method_start < 100:
                brace_count = 1
                body_start = brace_pos + 1
                body_end = body_start
                
                for i in range(body_start, min(len(type_content), body_start + 5000)):
                    if type_content[i] == '{':
                        brace_count += 1
                    elif type_content[i] == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            body_end = i
                            break
                
                if body_end > body_start:
                    method_body = type_content[body_start:body_end]
                    calls = extract_function_calls_csharp(method_body, all_function_names)
                    if calls:
                        method_info['calls'] = calls
            
            # Extract XML doc comment
            doc_match = re.search(r'///\s*<summary>\s*(.+?)\s*</summary>', type_content[:match.start()][-200:], re.DOTALL)
            if doc_match:
                method_info['doc'] = doc_match.group(1).strip()
            
            method_info['signature'] = signature
            type_info['methods'][method_name] = method_info
        
        # Extract properties
        property_pattern = r'(?:public|private|protected|internal)?\s*(?:static|virtual|override|abstract)?\s*(\w+(?:<[^>]+>)?)\s+(\w+)\s*\{\s*(?:get|set)'
        for match in re.finditer(property_pattern, type_content):
            prop_type = match.group(1)
            prop_name = match.group(2)
            if prop_name not in type_info['properties']:
                type_info['properties'].append(prop_name)
        
        # Extract constants
        const_pattern = r'(?:public|private|protected|internal)?\s*const\s+(\w+)\s+([A-Z_][A-Z0-9_]*)\s*='
        for match in re.finditer(const_pattern, type_content):
            const_type = match.group(1)
            const_name = match.group(2)
            type_info['constants'][const_name] = const_type
    
    # Clean up empty collections
    for type_dict in [result['classes'], result['interfaces']]:
        for type_name, type_info in type_dict.items():
            if 'properties' in type_info and not type_info['properties']:
                del type_info['properties']
            if 'constants' in type_info and not type_info['constants']:
                del type_info['constants']
    
    if not result['using']:
        del result['using']
    if not result['namespace']:
        del result['namespace']
    if not result['functions']:
        del result['functions']
    if not result['interfaces']:
        del result['interfaces']
    if not result['enums']:
        del result['enums']
    if not result['constants']:
        del result['constants']
    
    return result
    
    
    """Extract shell script function signatures and structure."""
    result = {
        'functions': {},
        'variables': [],
        'exports': {},
        'sources': [],
        'call_graph': {}  # Track function calls
    }

    lines = content.split('\n')
    
    # First pass: collect all function names
    all_function_names = set()
    for line in lines:
        # Style 1: function_name() {
        match1 = re.match(r'^(\w+)\s*\(\)\s*\{?', line)
        if match1:
            all_function_names.add(match1.group(1))
        # Style 2: function function_name {
        match2 = re.match(r'^function\s+(\w+)\s*\{?', line)
        if match2:
            all_function_names.add(match2.group(1))
    
    # Function patterns
    # Style 1: function_name() { ... }
    func_pattern1 = r'^(\w+)\s*\(\)\s*\{?'
    # Style 2: function function_name { ... }
    func_pattern2 = r'^function\s+(\w+)\s*\{?'
    
    # Variable patterns
    # Export pattern: export VAR=value
    export_pattern = r'^export\s+([A-Z_][A-Z0-9_]*)(=(.*))?'
    # Regular variable: VAR=value (uppercase)
    var_pattern = r'^([A-Z_][A-Z0-9_]*)=(.+)$'
    
    # Source patterns - handle quotes and command substitution
    source_patterns = [
        r'^(?:source|\.)\s+([\'"])([^\'"]+)\1',  # Quoted paths
        r'^(?:source|\.)\s+(\$\([^)]+\)[^\s]*)',  # Command substitution like $(dirname "$0")/file
        r'^(?:source|\.)\s+([^\s]+)',  # Unquoted paths
    ]
    
    # Track if we're in a function
    in_function = False
    current_function = None
    function_start_line = -1
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Skip empty lines and pure comments
        if not stripped or stripped.startswith('#!'):
            continue
            
        # Check for function definition (style 1)
        match = re.match(func_pattern1, stripped)
        if match:
            func_name = match.group(1)
            # Extract documentation comment if present
            doc = None
            if i > 0 and lines[i-1].strip().startswith('#'):
                doc = lines[i-1].strip()[1:].strip()
            
            # Try to find parameters from the function body
            params = []
            brace_count = 0
            in_func_body = False
            
            # Look for $1, $2, etc. usage in the function body only
            for j in range(i+1, min(i+20, len(lines))):
                line_content = lines[j].strip()
                
                # Track braces to know when we're in the function
                if '{' in line_content:
                    brace_count += line_content.count('{')
                    in_func_body = True
                if '}' in line_content:
                    brace_count -= line_content.count('}')
                    if brace_count <= 0:
                        break  # End of function
                
                # Only look for parameters inside the function body
                if in_func_body:
                    param_matches = re.findall(r'\$(\d+)', lines[j])
                    for p in param_matches:
                        param_num = int(p)
                        if param_num > 0 and param_num not in params:
                            params.append(param_num)
            
            # Build signature
            if params:
                max_param = max(params)
                param_list = ' '.join(f'$1' if j == 1 else f'${{{j}}}' for j in range(1, max_param + 1))
                signature = f"({param_list})"
            else:
                signature = "()"
            
            # Extract function body for call analysis
            func_body_lines = []
            brace_count = 0
            in_func_body = False
            for j in range(i+1, len(lines)):
                line_content = lines[j]
                if '{' in line_content:
                    brace_count += line_content.count('{')
                    in_func_body = True
                if in_func_body:
                    func_body_lines.append(line_content)
                if '}' in line_content:
                    brace_count -= line_content.count('}')
                    if brace_count <= 0:
                        break
            
            func_info = {}
            if func_body_lines:
                func_body = '\n'.join(func_body_lines)
                calls = extract_function_calls_shell(func_body, all_function_names)
                if calls:
                    func_info['calls'] = calls
            
            if doc:
                func_info['doc'] = doc
            
            if func_info:
                func_info['signature'] = signature
                result['functions'][func_name] = func_info
            else:
                result['functions'][func_name] = signature
            continue
            
        # Check for function definition (style 2)
        match = re.match(func_pattern2, stripped)
        if match:
            func_name = match.group(1)
            # Extract documentation comment if present
            doc = None
            if i > 0 and lines[i-1].strip().startswith('#'):
                doc = lines[i-1].strip()[1:].strip()
            
            # Try to find parameters from the function body
            params = []
            brace_count = 0
            in_func_body = False
            
            # Look for $1, $2, etc. usage in the function body only
            for j in range(i+1, min(i+20, len(lines))):
                line_content = lines[j].strip()
                
                # Track braces to know when we're in the function
                if '{' in line_content:
                    brace_count += line_content.count('{')
                    in_func_body = True
                if '}' in line_content:
                    brace_count -= line_content.count('}')
                    if brace_count <= 0:
                        break  # End of function
                
                # Only look for parameters inside the function body
                if in_func_body:
                    param_matches = re.findall(r'\$(\d+)', lines[j])
                    for p in param_matches:
                        param_num = int(p)
                        if param_num > 0 and param_num not in params:
                            params.append(param_num)
            
            # Build signature
            if params:
                max_param = max(params)
                param_list = ' '.join(f'$1' if j == 1 else f'${{{j}}}' for j in range(1, max_param + 1))
                signature = f"({param_list})"
            else:
                signature = "()"
            
            # Extract function body for call analysis
            func_body_lines = []
            brace_count = 0
            in_func_body = False
            for j in range(i+1, len(lines)):
                line_content = lines[j]
                if '{' in line_content:
                    brace_count += line_content.count('{')
                    in_func_body = True
                if in_func_body:
                    func_body_lines.append(line_content)
                if '}' in line_content:
                    brace_count -= line_content.count('}')
                    if brace_count <= 0:
                        break
            
            func_info = {}
            if func_body_lines:
                func_body = '\n'.join(func_body_lines)
                calls = extract_function_calls_shell(func_body, all_function_names)
                if calls:
                    func_info['calls'] = calls
            
            if doc:
                func_info['doc'] = doc
            
            if func_info:
                func_info['signature'] = signature
                result['functions'][func_name] = func_info
            else:
                result['functions'][func_name] = signature
            continue
        
        # Check for exports
        match = re.match(export_pattern, stripped)
        if match:
            var_name = match.group(1)
            var_value = match.group(3) if match.group(3) else None
            if var_value:
                # Determine type
                if var_value.startswith(("'", '"')):
                    var_type = 'str'
                elif var_value.isdigit():
                    var_type = 'number'
                else:
                    var_type = 'value'
                result['exports'][var_name] = var_type
            continue
        
        # Check for regular variables (uppercase)
        match = re.match(var_pattern, stripped)
        if match:
            var_name = match.group(1)
            # Only track if not already in exports
            if var_name not in result['exports'] and var_name not in result['variables']:
                result['variables'].append(var_name)
            continue
        
        # Check for source/dot includes
        for source_pattern in source_patterns:
            match = re.match(source_pattern, stripped)
            if match:
                # Extract the file path based on which pattern matched
                if len(match.groups()) == 2:  # Quoted pattern
                    sourced_file = match.group(2)
                else:  # Unquoted or command substitution
                    sourced_file = match.group(1)
                
                sourced_file = sourced_file.strip()
                if sourced_file and sourced_file not in result['sources']:
                    result['sources'].append(sourced_file)
                break  # Found a match, no need to try other patterns
    
    # Clean up empty collections
    if not result['variables']:
        del result['variables']
    if not result['exports']:
        del result['exports']
    if not result['sources']:
        del result['sources']
    
    return result
    
    
def extract_markdown_structure(file_path: Path) -> Dict[str, List[str]]:
    """Extract headers and architectural hints from markdown files."""
    try:
        content = file_path.read_text(encoding='utf-8', errors='ignore')
    except:
        return {'sections': [], 'architecture_hints': []}
    
    # Extract headers (up to level 3)
    headers = re.findall(r'^#{1,3}\s+(.+)$', content[:5000], re.MULTILINE)  # Only scan first 5KB
    
    # Look for architectural hints
    arch_patterns = [
        r'(?:located?|found?|stored?)\s+in\s+`?([\w\-\./]+)`?',
        r'`?([\w\-\./]+)`?\s+(?:contains?|houses?|holds?)',
        r'(?:see|check|look)\s+(?:in\s+)?`?([\w\-\./]+)`?\s+for',
        r'(?:file|module|component)\s+`?([\w\-\./]+)`?',
    ]
    
    hints = set()
    for pattern in arch_patterns:
        matches = re.findall(pattern, content[:5000], re.IGNORECASE)
        for match in matches:
            if '/' in match and not match.startswith('http'):
                hints.add(match)
    
    return {
        'sections': headers[:10],  # Limit to prevent bloat
        'architecture_hints': list(hints)[:5]
    }


def infer_file_purpose(file_path: Path) -> Optional[str]:
    """Infer the purpose of a file from its name and location."""
    name = file_path.stem.lower()
    
    # Common file purposes
    if name in ['index', 'main', 'app']:
        return 'Application entry point'
    elif 'test' in name or 'spec' in name:
        return 'Test file'
    elif 'config' in name or 'settings' in name:
        return 'Configuration'
    elif 'route' in name:
        return 'Route definitions'
    elif 'model' in name:
        return 'Data model'
    elif 'util' in name or 'helper' in name:
        return 'Utility functions'
    elif 'middleware' in name:
        return 'Middleware'
    
    return None


def infer_directory_purpose(path: Path, files_within: List[str]) -> Optional[str]:
    """Infer directory purpose from naming patterns and contents."""
    dir_name = path.name.lower()
    
    # Check exact matches first
    if dir_name in DIRECTORY_PURPOSES:
        return DIRECTORY_PURPOSES[dir_name]
    
    # Check if directory name contains key patterns
    for pattern, purpose in DIRECTORY_PURPOSES.items():
        if pattern in dir_name:
            return purpose
    
    # Infer from contents
    if files_within:
        # Check for test files
        if any('test' in f.lower() or 'spec' in f.lower() for f in files_within):
            return 'Test files and test utilities'
        
        # Check for specific file patterns
        if any('model' in f.lower() for f in files_within):
            return 'Data models and schemas'
        elif any('route' in f.lower() or 'endpoint' in f.lower() for f in files_within):
            return 'API routes and endpoints'
        elif any('component' in f.lower() for f in files_within):
            return 'UI components'
    
    return None


def get_language_name(extension: str) -> str:
    """Get readable language name from extension."""
    if extension in PARSEABLE_LANGUAGES:
        return PARSEABLE_LANGUAGES[extension]
    return extension[1:] if extension else 'unknown'


# Global cache for gitignore patterns
_gitignore_cache = {}


def parse_gitignore(gitignore_path: Path) -> List[str]:
    """Parse a .gitignore file and return list of patterns."""
    if not gitignore_path.exists():
        return []
    
    patterns = []
    try:
        with open(gitignore_path, 'r') as f:
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if not line or line.startswith('#'):
                    continue
                patterns.append(line)
    except:
        pass
    
    return patterns


def load_gitignore_patterns(root_path: Path) -> Set[str]:
    """Load all gitignore patterns from project root and merge with defaults."""
    # Use cached patterns if available
    cache_key = str(root_path)
    if cache_key in _gitignore_cache:
        return _gitignore_cache[cache_key]
    
    # Start with default ignore patterns
    patterns = set(IGNORE_DIRS)
    
    # Add patterns from .gitignore in project root
    gitignore_path = root_path / '.gitignore'
    if gitignore_path.exists():
        for pattern in parse_gitignore(gitignore_path):
            # Handle negations (!) later if needed
            if not pattern.startswith('!'):
                patterns.add(pattern)
    
    # Cache the patterns
    _gitignore_cache[cache_key] = patterns
    return patterns


def matches_gitignore_pattern(path: Path, patterns: Set[str], root_path: Path) -> bool:
    """Check if a path matches any gitignore pattern."""
    # Get relative path from root
    try:
        rel_path = path.relative_to(root_path)
    except ValueError:
        # Path is not relative to root
        return False
    
    # Convert to string for pattern matching
    path_str = str(rel_path)
    path_parts = rel_path.parts
    
    for pattern in patterns:
        # Check if any parent directory matches the pattern
        # Strip trailing slash for directory patterns
        clean_pattern = pattern.rstrip('/')
        for part in path_parts:
            if part == clean_pattern or fnmatch.fnmatch(part, clean_pattern):
                return True
        
        # Check full path patterns
        if '/' in pattern:
            # Pattern includes directory separator
            if fnmatch.fnmatch(path_str, pattern):
                return True
            # Also check without leading slash
            if pattern.startswith('/') and fnmatch.fnmatch(path_str, pattern[1:]):
                return True
        else:
            # Pattern is just a filename/directory name
            # Check if the filename matches
            if fnmatch.fnmatch(path.name, pattern):
                return True
            # Check if it matches the full relative path
            if fnmatch.fnmatch(path_str, pattern):
                return True
            # Check with wildcards
            if fnmatch.fnmatch(path_str, f'**/{pattern}'):
                return True
    
    return False


def should_index_file(path: Path, root_path: Path = None) -> bool:
    """Check if we should index this file."""
    # Must be a code or markdown file
    if not (path.suffix in CODE_EXTENSIONS or path.suffix in MARKDOWN_EXTENSIONS):
        return False

    # Skip if in hardcoded ignored directory (for safety)
    for part in path.parts:
        if part in IGNORE_DIRS:
            return False

    # If root_path provided, check gitignore patterns
    if root_path:
        patterns = load_gitignore_patterns(root_path)
        if matches_gitignore_pattern(path, patterns, root_path):
            return False

    return True


def get_git_files(root_path: Path) -> Optional[List[Path]]:
    """Get list of files tracked by git (respects .gitignore).
    Returns None if not a git repository or git command fails."""
    try:
        import subprocess
        
        # Run git ls-files to get tracked and untracked files that aren't ignored
        result = subprocess.run(
            ['git', 'ls-files', '--cached', '--others', '--exclude-standard'],
            cwd=str(root_path),
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            files = []
            for line in result.stdout.strip().split('\n'):
                if line:
                    file_path = root_path / line
                    # Only include actual files (not directories)
                    if file_path.is_file():
                        files.append(file_path)
            return files
        else:
            return None
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        # Git not available or command failed
        return None
