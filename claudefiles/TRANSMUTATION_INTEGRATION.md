# Integration with TheGreaterBookOfTransmutation
## Using Your Unified Index as Association Database

This guide shows how to use the entities and links from your unified index as the association database for the transmutation recipe generator.

---

## Overview

TheGreaterBookOfTransmutation uses association data (word → related words) to generate absurdist crafting recipes. Your unified index contains entity relationships discovered from your 70k JSON files, which can serve as a much richer association source than the default USF database.

---

## Data Flow

```
Your JSON Files (70k)
    ↓
create_unified_index.py
    ↓
entity_index.json + link_graph.json
    ↓
convert_to_association_format.py
    ↓
associations.txt (TheGreaterBookOfTransmutation format)
    ↓
TheGreaterBookOfTransmutation → Recipes
```

---

## Conversion Script

Create this file: `convert_to_association_format.py`

```python
#!/usr/bin/env python3
import json
from collections import defaultdict
from pathlib import Path

def load_index():
    """Load entity index and link graph"""
    with open("UNIFIED_INDEX/entity_index.json") as f:
        entities = json.load(f)
    
    with open("UNIFIED_INDEX/link_graph.json") as f:
        links = json.load(f)
    
    return entities, links

def build_associations(entities, links):
    """Convert index to association format"""
    associations = defaultdict(list)
    
    # Method 1: Co-occurrence based associations
    # Entities in same file are associated
    file_entities = defaultdict(list)
    
    for entity_id, data in entities.items():
        name = data["name"].upper()
        for file_uri in data["occurrences"]:
            file_entities[file_uri].append(name)
    
    # Create associations from co-occurrence
    for file_uri, entity_names in file_entities.items():
        for i, name1 in enumerate(entity_names):
            for name2 in entity_names[i+1:]:
                # Bidirectional association
                if name2 not in [x[0] for x in associations[name1]]:
                    associations[name1].append((name2, 0.7))
                if name1 not in [x[0] for x in associations[name2]]:
                    associations[name2].append((name1, 0.7))
    
    # Method 2: Direct links
    # Use the link graph for stronger associations
    entity_id_to_name = {
        eid: data["name"].upper()
        for eid, data in entities.items()
    }
    
    for link in links:
        if link["type"] == "contains":
            from_id = link.get("from")
            to_id = link.get("to")
            
            if from_id in entity_id_to_name and to_id in entity_id_to_name:
                from_name = entity_id_to_name[from_id]
                to_name = entity_id_to_name[to_id]
                
                # Higher weight for direct containment
                associations[from_name].append((to_name, 0.9))
    
    return associations

def calculate_strengths(associations):
    """Normalize association strengths"""
    normalized = {}
    
    for cue, targets in associations.items():
        # Count total occurrences
        total = sum(weight for _, weight in targets)
        
        # Normalize
        normalized[cue] = [
            (target, weight / total if total > 0 else 0)
            for target, weight in targets
        ]
        
        # Sort by strength
        normalized[cue].sort(key=lambda x: x[1], reverse=True)
    
    return normalized

def export_for_transmutation(associations, output_file):
    """Export in TheGreaterBookOfTransmutation format"""
    
    # Format: CUE\tTARGET\tSTRENGTH
    with open(output_file, "w") as f:
        for cue, targets in sorted(associations.items()):
            for target, strength in targets:
                f.write(f"{cue}\t{target}\t{strength:.4f}\n")
    
    print(f"Exported {len(associations)} cues")
    print(f"Total associations: {sum(len(t) for t in associations.values())}")

def create_pos_tags(associations, output_file):
    """Create part-of-speech tags file"""
    
    # Infer POS from entity names
    pos_tags = {}
    
    for cue in associations.keys():
        # Simple heuristics
        if cue.endswith("ING"):
            pos_tags[cue] = "VBG"  # Verb gerund
        elif cue.endswith("ED"):
            pos_tags[cue] = "VBD"  # Verb past tense
        elif cue.isupper() and len(cue) > 1:
            pos_tags[cue] = "NN"   # Noun (most entities)
        else:
            pos_tags[cue] = "NN"   # Default to noun
    
    with open(output_file, "w") as f:
        for word, tag in sorted(pos_tags.items()):
            f.write(f"{word}\t{tag}\n")

def main():
    print("Converting unified index to transmutation format...")
    
    # Load data
    entities, links = load_index()
    print(f"Loaded {len(entities)} entities and {len(links)} links")
    
    # Build associations
    print("Building associations...")
    associations = build_associations(entities, links)
    
    # Normalize strengths
    print("Normalizing strengths...")
    associations = calculate_strengths(associations)
    
    # Export
    output_dir = Path("TheGreaterBookOfTransmutation/data")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    export_for_transmutation(
        associations,
        output_dir / "associations_from_index.txt"
    )
    
    create_pos_tags(
        associations,
        output_dir / "pos_tags_from_index.txt"
    )
    
    print(f"\nOutput files created in {output_dir}/")
    print("  - associations_from_index.txt")
    print("  - pos_tags_from_index.txt")
    
    print("\nTo use in TheGreaterBookOfTransmutation:")
    print("  1. Copy files to transmutation/data/")
    print("  2. Modify main.py to load these files")
    print("  3. Run recipe generation")

if __name__ == "__main__":
    main()
```

---

## Modifying TheGreaterBookOfTransmutation

In `main.py`, replace the USF data loading with:

```python
# Load associations from unified index
associations = {}
pos_tags = {}

# Load associations
with open('data/associations_from_index.txt', 'r') as f:
    for line in f:
        parts = line.strip().split('\t')
        if len(parts) == 3:
            cue, target, strength = parts
            if cue not in associations:
                associations[cue] = []
            associations[cue].append((target, float(strength)))

# Load POS tags
with open('data/pos_tags_from_index.txt', 'r') as f:
    for line in f:
        parts = line.strip().split('\t')
        if len(parts) == 2:
            word, tag = parts
            pos_tags[word] = tag
```

---

## Hybrid Mode (USF + Your Index)

To use BOTH data sources:

```python
def load_hybrid_associations():
    """Combine USF and index associations"""
    combined = defaultdict(list)
    
    # Load USF
    for cue, targets in usf_associations.items():
        combined[cue].extend([(t, s * 0.5) for t, s in targets])
    
    # Load index
    for cue, targets in index_associations.items():
        combined[cue].extend([(t, s * 0.5) for t, s in targets])
    
    # Merge duplicates
    merged = {}
    for cue, targets in combined.items():
        target_weights = defaultdict(float)
        for target, weight in targets:
            target_weights[target] += weight
        
        merged[cue] = [(t, w) for t, w in target_weights.items()]
        merged[cue].sort(key=lambda x: x[1], reverse=True)
    
    return merged
```

---

## Source Tracking

To track which source provided each association:

```python
def load_with_provenance():
    """Load associations with source tracking"""
    associations = {}
    
    with open('data/associations_from_index.txt') as f:
        for line in f:
            cue, target, strength = line.strip().split('\t')
            if cue not in associations:
                associations[cue] = []
            associations[cue].append({
                'target': target,
                'strength': float(strength),
                'source': 'INDEX',
                'source_files': get_source_files(cue, target)
            })
    
    return associations

def get_source_files(cue, target):
    """Look up which files link cue to target"""
    with open('UNIFIED_INDEX/link_graph.json') as f:
        links = json.load(f)
    
    sources = []
    for link in links:
        # Check if this link connects cue and target
        if matches_link(link, cue, target):
            sources.append(link.get('source_file'))
    
    return sources
```

---

## Recipe Provenance

Add source tracking to generated recipes:

```python
def generate_recipe_with_sources(target):
    recipe = {
        'target': target,
        'materials': [],
        'tools': [],
        'provenance': {}
    }
    
    # Track where each material came from
    for material, quantity in materials:
        source_files = get_material_sources(material)
        recipe['materials'].append({
            'name': material,
            'quantity': quantity,
            'sources': source_files
        })
    
    return recipe
```

---

## Example Output

With your unified index, a recipe for "BOOK" might include:

```
Materials:
- 15 portions of READING (from: items/books.json)
- 8 fragments of KNOWLEDGE (from: concepts/learning.json)
- 23 essence of PAPER (from: materials/crafting.json)

Tools:
- Binding Press (from: tools/bookmaking.json)
- Ink Transmuter (from: alchemy/writing.json)

Sources:
- Index entities: 142
- Original associations: 28
- Hybrid strength: 0.87
```

---

## Comparison Mode

Run both systems and compare:

```bash
# Generate with USF only
python3 main.py --source usf --target BOOK > recipe_usf.txt

# Generate with index only
python3 main.py --source index --target BOOK > recipe_index.txt

# Generate hybrid
python3 main.py --source hybrid --target BOOK > recipe_hybrid.txt

# Compare
diff recipe_usf.txt recipe_index.txt
```

---

## Integration Checklist

- [ ] Run `create_unified_index.py`
- [ ] Run `convert_to_association_format.py`
- [ ] Copy association files to transmutation/data/
- [ ] Modify main.py to load new associations
- [ ] Test with single target word
- [ ] Compare output with USF baseline
- [ ] Enable hybrid mode
- [ ] Add source tracking
- [ ] Generate test recipes
- [ ] Document new associations in README

---

## Advanced: Multi-Source Selection

Select associations based on context:

```python
def select_association_source(cue, context):
    """Choose which source to use based on cue type"""
    
    # If cue is from RPG domain, prefer index
    if cue in rpg_entities:
        return 'index'
    
    # If cue is common word, prefer USF
    elif cue in common_words:
        return 'usf'
    
    # Otherwise use hybrid
    else:
        return 'hybrid'
```

---

## Troubleshooting

### "No associations found"
- Check entity_index.json has data
- Verify conversion script ran
- Ensure file paths are correct

### "Associations too weak"
- Increase co-occurrence weight
- Lower normalization threshold
- Add more link types

### "Too many associations"
- Filter by occurrence count
- Set minimum strength threshold
- Limit to top N per cue

---

## Performance

**Expected metrics:**
- 70k entities → ~5k-10k unique cues
- ~50k-100k total associations
- Recipe generation: <1 second
- Load time: ~2-3 seconds

---

## Files Summary

1. `convert_to_association_format.py` - Conversion script
2. `associations_from_index.txt` - Association data
3. `pos_tags_from_index.txt` - Part-of-speech tags
4. Modified `main.py` - Updated loader
5. Recipe comparison outputs
