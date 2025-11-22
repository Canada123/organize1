#!/bin/bash
# Enhanced Index Generator with Visual Asset Separation
# PURPOSE: Generate project indexes with separate visual asset tracking
# VERSION: 2.0
# CREATED: 2025-08-25
# FEATURES: Modular functions, visual asset separation, high-level tree views

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
TREE_OUTPUT="context/project-tree.txt"
INDEX_MD="context/project-index.md"
INDEX_JSON="PROJECT_INDEX.json"
VISUAL_INDEX="VISUAL_ASSETS_INDEX.json"
TEMP_DIR="/tmp/index-gen-$$"

# Visual asset extensions
IMAGE_EXTENSIONS="jpg|jpeg|png|gif|webp|svg|ico|bmp|tiff"
VIDEO_EXTENSIONS="mp4|webm|avi|mov|mkv|flv"
VISUAL_EXTENSIONS="$IMAGE_EXTENSIONS|$VIDEO_EXTENSIONS"

echo "📚 Enhanced Index Generator v2.0"
echo "================================"
echo ""

# Check dependencies
check_dependencies() {
  local missing_deps=0
  
  if ! command -v tree &> /dev/null; then
    echo "${RED}❌ Error: 'tree' command not found${NC}"
    echo "Install with: brew install tree (macOS) or apt-get install tree (Linux)"
    missing_deps=1
  fi
  
  if ! command -v node &> /dev/null; then
    echo "${YELLOW}⚠️  Warning: Node.js not found - some features will be limited${NC}"
    SKIP_NODE=true
  else
    SKIP_NODE=false
  fi
  
  if [ $missing_deps -eq 1 ]; then
    exit 1
  fi
}

# Generate tree views (with image exclusion)
generate_trees() {
  echo "🌳 Generating tree views..."
  
  # Full tree without images for project-tree.txt
  echo "  Generating detailed tree (no images)..."
  tree -I "node_modules|.git|.cache|dist|build|coverage|.next|.nuxt|archive|*.${IMAGE_EXTENSIONS//|/|*.}|*.${VIDEO_EXTENSIONS//|/|*.}" \
       --dirsfirst \
       -F \
       --charset=utf-8 \
       > "$TREE_OUTPUT"
  
  TREE_SIZE=$(du -h "$TREE_OUTPUT" | cut -f1)
  echo "  ${GREEN}✓${NC} Generated $TREE_OUTPUT ($TREE_SIZE)"
  
  # High-level tree for project-index.md (depth 3)
  echo "  Generating high-level tree (depth 3)..."
  tree -L 3 \
       -I "node_modules|.git|.cache|dist|build|coverage|.next|.nuxt|archive|*.${IMAGE_EXTENSIONS//|/|*.}|*.${VIDEO_EXTENSIONS//|/|*.}" \
       --dirsfirst \
       -F \
       --charset=utf-8 \
       > "$TEMP_DIR/tree-highlevel.txt"
  
  echo "  ${GREEN}✓${NC} Generated high-level tree"
}

# Scan and catalog visual assets
generate_visual_index() {
  echo "🖼️  Scanning visual assets..."
  
  # Create Node.js script for visual asset scanning
  cat > "$TEMP_DIR/scan-visual-assets.js" << 'EOF'
const fs = require('fs');
const path = require('path');

// Visual asset extensions
const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp', '.tiff'];
const videoExts = ['.mp4', '.webm', '.avi', '.mov', '.mkv', '.flv'];
const visualExts = [...imageExts, ...videoExts];

function getFileType(ext) {
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (ext === '.svg' || ext === '.ico') return 'icon';
  return 'other';
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function scanVisualAssets(dir, basePath = '') {
  const results = {
    version: '1.0',
    generated: new Date().toISOString(),
    summary: {
      totalAssets: 0,
      totalSize: 0,
      byType: {
        images: { count: 0, size: 0 },
        icons: { count: 0, size: 0 },
        videos: { count: 0, size: 0 }
      },
      byDirectory: {}
    },
    assets: {}
  };

  function scan(currentPath, relativePath = '') {
    try {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const relPath = path.join(relativePath, item);
        
        // Skip certain directories
        if (['node_modules', '.git', 'dist', 'build', '.cache', '.next'].includes(item)) {
          return;
        }
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scan(fullPath, relPath);
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            
            if (visualExts.includes(ext)) {
              const dirPath = path.dirname(relPath);
              const fileType = getFileType(ext);
              
              // Initialize directory in results if needed
              if (!results.assets[dirPath]) {
                results.assets[dirPath] = [];
                results.summary.byDirectory[dirPath] = { count: 0, size: 0 };
              }
              
              // Add asset info
              const assetInfo = {
                file: path.basename(item),
                size: stat.size,
                sizeFormatted: formatBytes(stat.size),
                format: ext.substring(1),
                type: fileType,
                modified: stat.mtime.toISOString()
              };
              
              results.assets[dirPath].push(assetInfo);
              
              // Update summary
              results.summary.totalAssets++;
              results.summary.totalSize += stat.size;
              results.summary.byDirectory[dirPath].count++;
              results.summary.byDirectory[dirPath].size += stat.size;
              
              if (fileType === 'image') {
                results.summary.byType.images.count++;
                results.summary.byType.images.size += stat.size;
              } else if (fileType === 'icon') {
                results.summary.byType.icons.count++;
                results.summary.byType.icons.size += stat.size;
              } else if (fileType === 'video') {
                results.summary.byType.videos.count++;
                results.summary.byType.videos.size += stat.size;
              }
            }
          }
        } catch (err) {
          // Skip files we can't access
        }
      });
    } catch (err) {
      console.error(`Error scanning ${currentPath}:`, err.message);
    }
  }

  scan(dir);
  
  // Format sizes in summary
  results.summary.totalSizeFormatted = formatBytes(results.summary.totalSize);
  results.summary.byType.images.sizeFormatted = formatBytes(results.summary.byType.images.size);
  results.summary.byType.icons.sizeFormatted = formatBytes(results.summary.byType.icons.size);
  results.summary.byType.videos.sizeFormatted = formatBytes(results.summary.byType.videos.size);
  
  // Format directory sizes
  Object.keys(results.summary.byDirectory).forEach(dir => {
    results.summary.byDirectory[dir].sizeFormatted = formatBytes(results.summary.byDirectory[dir].size);
  });
  
  // Sort assets by directory
  Object.keys(results.assets).sort().forEach(dir => {
    results.assets[dir].sort((a, b) => a.file.localeCompare(b.file));
  });
  
  return results;
}

// Generate visual assets index
const projectRoot = process.cwd();
const visualIndex = scanVisualAssets(projectRoot);

// Write JSON
fs.writeFileSync('VISUAL_ASSETS_INDEX.json', JSON.stringify(visualIndex, null, 2));

console.log(`Found ${visualIndex.summary.totalAssets} visual assets (${visualIndex.summary.totalSizeFormatted})`);
console.log(`  Images: ${visualIndex.summary.byType.images.count} (${visualIndex.summary.byType.images.sizeFormatted})`);
console.log(`  Icons: ${visualIndex.summary.byType.icons.count} (${visualIndex.summary.byType.icons.sizeFormatted})`);
console.log(`  Videos: ${visualIndex.summary.byType.videos.count} (${visualIndex.summary.byType.videos.sizeFormatted})`);
EOF

  if [ "$SKIP_NODE" = false ]; then
    cd "$(dirname "$0")/.." # Go to project root
    node "$TEMP_DIR/scan-visual-assets.js" 2>/dev/null
    
    if [ -f "$VISUAL_INDEX" ]; then
      VISUAL_SIZE=$(du -h "$VISUAL_INDEX" | cut -f1)
      echo "  ${GREEN}✓${NC} Generated $VISUAL_INDEX ($VISUAL_SIZE)"
    else
      echo "  ${YELLOW}⚠${NC} Failed to generate visual assets index"
    fi
  else
    echo "  ${YELLOW}⚠${NC} Skipping visual assets index (Node.js required)"
  fi
}

# Generate main project index (without images)
generate_project_index() {
  echo "🔧 Generating main project index..."
  
  cat > "$TEMP_DIR/generate-project-index.js" << 'EOF'
const fs = require('fs');
const path = require('path');

// Visual asset extensions to exclude
const visualExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp', '.tiff', '.mp4', '.webm', '.avi', '.mov', '.mkv', '.flv'];

function isVisualAsset(filename) {
  const ext = path.extname(filename).toLowerCase();
  return visualExts.includes(ext);
}

function scanDirectory(dir, basePath = '') {
  const results = {
    directories: {},
    files: {},
    stats: {
      totalFiles: 0,
      totalDirs: 0,
      codeFiles: 0,
      docFiles: 0,
      byExtension: {}
    }
  };

  function scan(currentPath, relativePath = '') {
    try {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const relPath = path.join(relativePath, item);
        
        // Skip certain directories
        if (['node_modules', '.git', 'archive', 'dist', 'build', '.cache'].includes(item)) {
          return;
        }
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            results.directories[relPath] = {
              path: relPath,
              fileCount: 0,
              subdirs: []
            };
            results.stats.totalDirs++;
            scan(fullPath, relPath);
          } else if (stat.isFile() && !isVisualAsset(item)) {
            const ext = path.extname(item);
            results.files[relPath] = {
              path: relPath,
              size: stat.size,
              extension: ext,
              modified: stat.mtime
            };
            results.stats.totalFiles++;
            
            // Count code and doc files
            if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
              results.stats.codeFiles++;
            } else if (['.md', '.mdx'].includes(ext)) {
              results.stats.docFiles++;
            }
            
            results.stats.byExtension[ext] = (results.stats.byExtension[ext] || 0) + 1;
            
            // Update parent directory file count
            const parentDir = path.dirname(relPath);
            if (parentDir !== '.' && results.directories[parentDir]) {
              results.directories[parentDir].fileCount++;
            }
          }
        } catch (err) {
          // Skip files we can't access
        }
      });
    } catch (err) {
      console.error(`Error scanning ${currentPath}:`, err.message);
    }
  }

  scan(dir);
  return results;
}

// Generate index
const projectRoot = process.cwd();
const index = {
  version: '2.0',
  generated: new Date().toISOString(),
  project: 'SKIIN Switzerland Marketing Website',
  visualAssetsIndex: 'VISUAL_ASSETS_INDEX.json',
  ...scanDirectory(projectRoot),
  structure: {
    description: 'Tree view excludes visual assets. See VISUAL_ASSETS_INDEX.json for images/videos.',
    tree: fs.existsSync('context/project-tree.txt') 
      ? fs.readFileSync('context/project-tree.txt', 'utf8').split('\n').slice(0, 100).join('\n')
      : 'Run generate-indexes.sh to create tree view'
  }
};

// Write JSON (compact for agents)
fs.writeFileSync('PROJECT_INDEX.json', JSON.stringify(index, null, 2));

const sizeKB = Math.round(JSON.stringify(index).length / 1024);
console.log(`Generated PROJECT_INDEX.json (${sizeKB}KB)`);
console.log(`  Total files: ${index.stats.totalFiles} (excluding visual assets)`);
console.log(`  Code files: ${index.stats.codeFiles}`);
console.log(`  Doc files: ${index.stats.docFiles}`);
EOF

  if [ "$SKIP_NODE" = false ]; then
    cd "$(dirname "$0")/.." # Go to project root
    node "$TEMP_DIR/generate-project-index.js" 2>/dev/null
    
    if [ -f "$INDEX_JSON" ]; then
      JSON_SIZE=$(du -h "$INDEX_JSON" | cut -f1)
      echo "  ${GREEN}✓${NC} Generated $INDEX_JSON ($JSON_SIZE)"
    else
      echo "  ${YELLOW}⚠${NC} Failed to generate project index"
    fi
  fi
}

# Generate markdown index with high-level view
generate_markdown_index() {
  echo "📝 Generating markdown index..."
  
  # Get statistics
  TOTAL_FILES=$(find . -type f -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/archive/*' | wc -l | tr -d ' ')
  TOTAL_DIRS=$(find . -type d -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/archive/*' | wc -l | tr -d ' ')
  CODE_FILES=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l | tr -d ' ')
  DOC_FILES=$(find docs -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  VISUAL_FILES=$(find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.svg" -o -iname "*.ico" \) -not -path '*/node_modules/*' -not -path '*/archive/*' 2>/dev/null | wc -l | tr -d ' ')
  
  # Read high-level tree
  HIGHLEVEL_TREE=$(cat "$TEMP_DIR/tree-highlevel.txt" 2>/dev/null || echo "Tree generation failed")
  
  # Create markdown index
  cat > "$INDEX_MD" << EOF
# Project Index - SKIIN Switzerland Marketing Website
VERSION: 2.1
LAST-UPDATED: $(date +%Y-%m-%d)
STATUS: ACTIVE
PURPOSE: High-level repository structure and organization reference
GENERATED: Auto-generated by scripts/generate-indexes.sh

## Repository Statistics

### Code & Documentation
- **Total Files**: $TOTAL_FILES (all files)
- **Total Directories**: $TOTAL_DIRS
- **Code Files**: $CODE_FILES (TypeScript/JavaScript)
- **Documentation Files**: $DOC_FILES (Markdown)

### Visual Assets
- **Visual Files**: $VISUAL_FILES (images, icons, videos)
- **Detailed Catalog**: See [VISUAL_ASSETS_INDEX.json](../VISUAL_ASSETS_INDEX.json)
- **Location**: Primarily in \`/public/assets/\`

## High-Level Repository Structure

\`\`\`
$HIGHLEVEL_TREE
\`\`\`

## Key Directories

### Core Application (\`/src/\`)
- **components/**: React components organized by feature (200+ components)
  - \`ui/\`: Base shadcn/ui components
  - \`features/\`: Feature-specific components
  - \`layout/\`: Layout components (Navbar, Footer)
  - \`progressive/\`: Animated/interactive components
- **pages/**: Route components (20+ pages)
- **hooks/**: Custom React hooks
- **services/**: API and business logic
- **translations/**: i18n files (en, de, fr, it)
- **types/**: TypeScript definitions
- **utils/**: Utility functions

### Documentation (\`/docs/\`)
- **api/**: API specifications
- **architecture/**: System design documents
- **content/**: Master copy documents (4 languages)
- **deployment/**: Production deployment guides
- **design/**: Design tokens and guidelines
- **design-system/**: Component specifications
- **reports/**: Analysis and audit reports
- **standards/**: Coding and quality standards

### Working Context (\`/context/\`)
- **Purpose**: Active working files
- **Key Files**: todo.md, CLAUDE-planning.md, conventions.md, requirements.md
- **Event Tracking**: event-stream.md
- **Checkpoints**: Workflow state management
- **Subagent Contexts**: Agent-specific context files

### Database & Backend (\`/supabase/\`)
- **migrations/**: SQL migration files
- **functions/**: Edge functions
- **schemas/**: Database schema definitions
- **scripts/**: Database utility scripts

### Visual Assets (\`/public/assets/\`)
- **images/**: Product, team, marketing images
- **videos/**: Educational and promotional videos
- **icons/**: SVG icons and graphics
- **📊 Full Catalog**: See [VISUAL_ASSETS_INDEX.json](../VISUAL_ASSETS_INDEX.json)

### Scripts & Automation (\`/scripts/\`)
- **File Organization**: Scanner and auto-mover scripts
- **Index Generation**: This generator script
- **Build Tools**: Build and deployment scripts
- **Tests**: Script testing utilities

## File Organization Rules

1. **Root Directory**: ≤35 files (configuration only)
2. **Images**: \`/public/assets/images/\`
3. **SQL Files**: \`/supabase/\`
4. **Test Files**: \`/tests/\` or \`/scripts/tests/\`
5. **Reports**: \`/docs/reports/\`
6. **Specifications**: \`/docs/specs/\`
7. **Scripts**: \`/scripts/\`

## Available Indexes

| Index File | Purpose | Content |
|------------|---------|---------|
| **project-tree.txt** | Detailed tree view | Complete directory structure (no images) |
| **PROJECT_INDEX.json** | Agent navigation | Structured data for AI agents (~50KB) |
| **project-index.md** | Human reference | This file - high-level overview |
| **VISUAL_ASSETS_INDEX.json** | Asset catalog | All images, videos, icons with metadata |

## Automation

To regenerate all indexes:
\`\`\`bash
./scripts/generate-indexes.sh
\`\`\`

This will update:
- Tree views (high-level and detailed)
- Project index JSON
- Visual assets catalog
- This markdown overview

---
*Generated automatically by scripts/generate-indexes.sh - do not edit manually*
EOF

  echo "  ${GREEN}✓${NC} Generated $INDEX_MD"
}

# Main execution
main() {
  check_dependencies
  
  # Create temp directory
  mkdir -p "$TEMP_DIR"
  
  # Generate all indexes
  generate_trees
  generate_visual_index
  generate_project_index
  generate_markdown_index
  
  # Clean up temp directory
  rm -rf "$TEMP_DIR"
  
  # Summary
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "${GREEN}✅ Enhanced index generation complete!${NC}"
  echo ""
  echo "Generated files:"
  echo "  ${CYAN}1.${NC} $TREE_OUTPUT - Detailed tree (no images)"
  echo "  ${CYAN}2.${NC} $INDEX_MD - High-level overview"
  if [ "$SKIP_NODE" = false ]; then
    echo "  ${CYAN}3.${NC} $INDEX_JSON - Code structure for agents"
    echo "  ${CYAN}4.${NC} $VISUAL_INDEX - Visual assets catalog"
  fi
  echo ""
  echo "Key improvements:"
  echo "  • Visual assets separated into dedicated index"
  echo "  • High-level tree view in project-index.md"
  echo "  • Cleaner main indexes without image clutter"
  echo "  • Better organization and navigation"
  echo ""
  echo "${YELLOW}💡 Tip: Add to git hooks for automatic updates:${NC}"
  echo "  Add './scripts/generate-indexes.sh' to .git/hooks/post-commit"
}

# Run main function
main

exit 0