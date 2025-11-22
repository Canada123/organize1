# language_mappings.py
"""  
Master language extension mappings for project indexing.  
Handles conflicts and ambiguous extensions with explicit tagging.  
"""
  
# Extensions with known conflicts - require disambiguation
AMBIGUOUS_EXTENSIONS = {
    '.pl': ['perl', 'prolog'],      # Most common conflict
    '.m': ['objective-c', 'matlab'], # Objective-C vs MATLAB
    '.tsx': ['typescript', 'tiled-tileset'],
    '.v': ['vlang', 'verilog'],      # Vlang vs Verilog HDL
    '.fs': ['fsharp', 'forth'],      # F# vs Forth
    '.t': ['perl', 'tera'],          # Perl test vs Tera templates
}
  
PARSEABLE_LANGUAGES = {
    # === Systems & General-Purpose Languages ===
    '.c': 'c',
    '.h': 'c',
    '.cpp': 'cpp',
    '.cxx': 'cpp',
    '.cc': 'cpp',
    '.hpp': 'cpp',
    '.hxx': 'cpp',
    '.cs': 'csharp',
    '.go': 'go',
    '.rs': 'rust',
    '.rlib': 'rust',
      
    # === Python ===
    '.py': 'python',
    '.pyw': 'python',
    '.pyx': 'python',
    '.pyd': 'python',
    '.ipynb': 'jupyter',
      
    # === JavaScript/TypeScript ===
    '.js': 'javascript',
    '.mjs': 'javascript',
    '.cjs': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.d.ts': 'typescript',
      
    # === Web ===
    '.html': 'html',
    '.htm': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.sass': 'sass',
    '.less': 'less',
    '.vue': 'vue',
    '.svelte': 'svelte',
      
    # === Shell ===
    '.sh': 'shell',
    '.bash': 'shell',
    '.zsh': 'shell',
    '.fish': 'shell',
      
    # === Prolog ===
    '.pl': 'prolog',
    '.pro': 'prolog',
    '.prolog': 'prolog',
      
    # === Ontology/RDF ===
    '.owl': 'ontology',
    '.ttl': 'ontology',
    '.rdf': 'ontology',
    '.n3': 'ontology',
    '.nt': 'ontology',
    '.jsonld': 'ontology',
      
    # === Data Formats ===
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.xml': 'xml',
    '.csv': 'csv',
    '.tsv': 'tsv',
    '.toml': 'toml',
    '.ini': 'ini',
      
    # === Unity (KEEP ONLY THIS ONE) ===
    '.unity': 'unity-scene',
    '.prefab': 'unity-prefab',
    '.asset': 'unity-asset',
    '.mat': 'unity-material',
    '.anim': 'unity-animation',
    '.controller': 'unity-animator',
    '.shader': 'unity-shader',
    '.cginc': 'unity-shader-include',
    '.compute': 'unity-compute',
    '.meta': 'unity-meta',
      
    # === Godot (KEEP ONLY THIS ONE) ===
    '.gd': 'gdscript',
    '.tscn': 'godot-scene',
    '.tres': 'godot-resource',
      
    # === Other Game Engines ===
    '.gml': 'gamemaker',
    '.rpy': 'renpy',
    '.ink': 'ink',
    '.yarn': 'yarn',
    '.lua': 'lua',
      
    # === Other Languages ===
    '.java': 'java',
    '.kt': 'kotlin',
    '.swift': 'swift',
    '.rb': 'ruby',
    '.php': 'php',
    '.r': 'r',
    '.R': 'r',
    '.sql': 'sql',
    '.scala': 'scala',
    '.clj': 'clojure',
    '.cljs': 'clojurescript',
    '.erl': 'erlang',
    '.ex': 'elixir',
    '.dart': 'dart',
    '.jl': 'julia',
    '.zig': 'zig',
    '.nim': 'nim',
    '.cr': 'crystal',
    '.v': 'vlang',
    '.verilog': 'verilog',
    '.sv': 'systemverilog',
    '.vhdl': 'vhdl',
    '.vhd': 'vhdl',
    '.asm': 'assembly',
    '.s': 'assembly',
    '.S': 'assembly',
    '.forth': 'forth',
    '.4th': 'forth',
    '.fs': 'fsharp',
    '.fsx': 'fsharp',
    '.fsi': 'fsharp',
    '.ml': 'ocaml',
    '.mli': 'ocaml',
    '.hs': 'haskell',
    '.lhs': 'haskell',
    '.elm': 'elm',
    '.purs': 'purescript',
    '.re': 'reason',
    '.rei': 'reason',
    '.groovy': 'groovy',
    '.gradle': 'gradle',
    '.proto': 'protobuf',
    '.thrift': 'thrift',
    '.sol': 'solidity',
    '.move': 'move',
}

def detect_language_from_content(file_path: str, content: str) -> str:
    """  
    Detect language for ambiguous file extensions by analyzing content.  
    Returns the detected language name or None if can't determine.  
    """
    import re
    from pathlib import Path
      
    ext = Path(file_path).suffix.lower()
      
    # If not ambiguous, return the mapped language directly
    if ext not in AMBIGUOUS_EXTENSIONS:
        return PARSEABLE_LANGUAGES.get(ext)
      
    # Handle .pl conflict (Perl vs Prolog)
    if ext == '.pl':
        # Prolog patterns
        prolog_patterns = [
            r':-',  # Rules
            r'\?-',  # Queries
            r'assert\(',  # Dynamic predicates
            r'retract\(',
            r'findall\(',
            r'member\(',
        ]
        # Perl patterns
        perl_patterns = [
            r'use strict',
            r'use warnings',
            r'my \$',
            r'sub \w+\s*{',
            r'package \w+',
        ]
          
        prolog_score = sum(1 for p in prolog_patterns if re.search(p, content))
        perl_score = sum(1 for p in perl_patterns if re.search(p, content))
          
        if prolog_score > perl_score:
            return 'prolog'
        elif perl_score > prolog_score:
            return 'perl'
        else:
            return 'prolog'  # Default to prolog for your use case
      
    # Handle .m conflict (Objective-C vs MATLAB)
    if ext == '.m':
        objc_patterns = [r'@interface', r'@implementation', r'#import']
        matlab_patterns = [r'function\s+\w+', r'end\s*$', r'%']
          
        objc_score = sum(1 for p in objc_patterns if re.search(p, content))
        matlab_score = sum(1 for p in matlab_patterns if re.search(p, content))
          
        return 'objective-c' if objc_score > matlab_score else 'matlab'
      
    # Handle .tsx conflict (TypeScript vs Tiled tileset)
    if ext == '.tsx':
        if '<tileset' in content or '<tsx' in content:
            return 'tiled-tileset'
        return 'typescript'
      
    # Handle .v conflict (Vlang vs Verilog)
    if ext == '.v':
        # Verilog/SystemVerilog patterns
        verilog_patterns = [
            r'\bmodule\s+\w+',
            r'\b(?:wire|reg|logic)\s+',
            r'\balways\s*@',
            r'\bassign\s+',
            r'\bendmodule\b',
        ]
        # V language patterns
        vlang_patterns = [
            r'\bfn\s+\w+\(',
            r'\bpub\s+fn\b',
            r'\bimport\s+\w+',
            r'\bstruct\s+\w+\s*{',
        ]
        
        verilog_score = sum(1 for p in verilog_patterns if re.search(p, content))
        vlang_score = sum(1 for p in vlang_patterns if re.search(p, content))
        
        if verilog_score > vlang_score:
            return 'verilog'
        return 'vlang'
      
    # Handle .fs conflict (F# vs Forth)
    if ext == '.fs':
        # F# patterns
        fsharp_patterns = [
            r'\bmodule\s+\w+',
            r'\bnamespace\s+\w+',
            r'\blet\s+\w+\s*=',
            r'\btype\s+\w+\s*=',
            r'\bopen\s+\w+',
        ]
        # Forth patterns
        forth_patterns = [
            r':\s+\w+',
            r';\s*$',
            r'\bDUP\b',
            r'\bSWAP\b',
            r'\bDROP\b',
        ]
        
        fsharp_score = sum(1 for p in fsharp_patterns if re.search(p, content))
        forth_score = sum(1 for p in forth_patterns if re.search(p, content, re.IGNORECASE))
        
        if fsharp_score > forth_score:
            return 'fsharp'
        return 'forth'
      
    # Handle .t conflict (Perl test vs Tera templates)
    if ext == '.t':
        if 'use Test::' in content or 'use strict' in content:
            return 'perl'
        return 'tera'
      
    # Default: return first option from AMBIGUOUS_EXTENSIONS
    return AMBIGUOUS_EXTENSIONS[ext][0]
    
# Auto-generate from PARSEABLE_LANGUAGES to avoid duplication
CODE_EXTENSIONS = set(PARSEABLE_LANGUAGES.keys())
  
# Add additional extensions that should be recognized as code
CODE_EXTENSIONS.update({
    # Compiled/binary formats
    '.pyc', '.pyo', '.pyd',  # Python compiled
    '.class', '.jar',  # Java compiled
    '.o', '.so', '.dll', '.dylib',  # Compiled binaries
    '.rlib',  # Rust library
    '.wasm',  # WebAssembly
    
    # Build files without extensions (as strings, not Path objects)
    'Makefile', 'Dockerfile', 'Rakefile', 'Gemfile', 'Podfile',
    'CMakeLists.txt', 'BUILD', 'BUILD.bazel', 'WORKSPACE',
    'Vagrantfile', 'Brewfile', 'Procfile', 'Justfile',
    
    # Config files
    '.env', '.env.local', '.env.production', '.env.development',
    '.editorconfig', '.prettierrc', '.eslintrc', '.babelrc',
    '.npmrc', '.yarnrc', '.gitignore', '.dockerignore',
    
    # Additional game formats
    '.uasset', '.umap',  # Unreal Engine
    '.blend',  # Blender
    '.glb', '.gltf',  # 3D models
    '.fbx', '.obj', '.dae',  # 3D interchange formats
})
