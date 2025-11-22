#!/bin/bash

# Next.js Intelligence Toolkit - Interactive Setup v2.0
# This script installs the nextjs-project-setup skill and supporting infrastructure
# With comprehensive validation, examples, and documentation

set -e

echo "=========================================="
echo "Next.js Intelligence Toolkit Setup v2.0"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# PHASE 1: Prerequisites Check (Enhanced)
# ============================================

echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Node.js 18+
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo -e "${YELLOW}  Please install Node.js 18+ first${NC}"
    echo "  Visit: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js version too old (found: v$NODE_VERSION, required: v18+)${NC}"
    echo -e "${YELLOW}  Please upgrade Node.js to version 18 or higher${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js v$NODE_VERSION${NC}"

# Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git not found${NC}"
    echo -e "${YELLOW}  Please install Git first${NC}"
    echo "  Visit: https://git-scm.com"
    exit 1
fi
echo -e "${GREEN}✓ Git $(git --version | cut -d' ' -f3)${NC}"

# Check Claude Code
CLAUDE_CMD=""
if command -v claude &> /dev/null; then
    CLAUDE_CMD="claude"
elif command -v claude-code &> /dev/null; then
    CLAUDE_CMD="claude-code"
else
    echo -e "${RED}✗ Claude Code not found${NC}"
    echo -e "${YELLOW}  Please install Claude Code first${NC}"
    echo "  Visit: https://claude.ai/download"
    exit 1
fi
echo -e "${GREEN}✓ Claude Code CLI${NC}"

echo ""
echo -e "${GREEN}All prerequisites met!${NC}"
echo ""

# ============================================
# PHASE 2: Interactive Questions (5 Questions)
# ============================================

echo -e "${BLUE}Let's configure your installation...${NC}"
echo ""

# Q1: Installation Scope
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Q1: Installation Scope${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Where should the Intelligence Toolkit be installed?"
echo "  1) Local project only (.claude/ in current directory)"
echo "  2) User-level (~/.claude/ for all your projects)"
echo "  3) Both (project + user-level)"
echo ""
read -p "Choose [1-3] (default: 1): " INSTALL_SCOPE
INSTALL_SCOPE=${INSTALL_SCOPE:-1}

case $INSTALL_SCOPE in
    1)
        SCOPE_NAME="Local project"
        INSTALL_LOCAL=true
        INSTALL_USER=false
        ;;
    2)
        SCOPE_NAME="User-level"
        INSTALL_LOCAL=false
        INSTALL_USER=true
        ;;
    3)
        SCOPE_NAME="Both local + user"
        INSTALL_LOCAL=true
        INSTALL_USER=true
        ;;
    *)
        echo -e "${YELLOW}Invalid choice, defaulting to local project${NC}"
        SCOPE_NAME="Local project"
        INSTALL_LOCAL=true
        INSTALL_USER=false
        ;;
esac

echo -e "${GREEN}✓ Scope: ${SCOPE_NAME}${NC}"
echo ""

# Q2: Global Skills Status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Q2: Global Skills Status${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "The nextjs-project-setup skill requires 3 global skills:"
echo "  - shadcn-ui (1,053 lines)"
echo "  - nextjs (1,129 lines)"
echo "  - tailwindcss (1,134 lines)"
echo ""
echo "Checking global skills..."

GLOBAL_SKILLS_PATH="$HOME/.claude/skills"
SHADCN_EXISTS=false
NEXTJS_EXISTS=false
TAILWIND_EXISTS=false

if [ -f "$GLOBAL_SKILLS_PATH/shadcn-ui/SKILL.md" ]; then
    echo -e "${GREEN}  ✓ shadcn-ui found${NC}"
    SHADCN_EXISTS=true
else
    echo -e "${YELLOW}  ✗ shadcn-ui not found${NC}"
fi

if [ -f "$GLOBAL_SKILLS_PATH/nextjs/SKILL.md" ]; then
    echo -e "${GREEN}  ✓ nextjs found${NC}"
    NEXTJS_EXISTS=true
else
    echo -e "${YELLOW}  ✗ nextjs not found${NC}"
fi

if [ -f "$GLOBAL_SKILLS_PATH/tailwindcss/SKILL.md" ]; then
    echo -e "${GREEN}  ✓ tailwindcss found${NC}"
    TAILWIND_EXISTS=true
else
    echo -e "${YELLOW}  ✗ tailwindcss not found${NC}"
fi

if [ "$SHADCN_EXISTS" = false ] || [ "$NEXTJS_EXISTS" = false ] || [ "$TAILWIND_EXISTS" = false ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Missing global skills${NC}"
    echo "The nextjs-project-setup skill will work but with reduced token efficiency."
    echo "You can install global skills later for 81% token savings (6,500 tokens)."
    echo ""
    read -p "Continue anyway? (Y/n): " CONTINUE_WITHOUT_GLOBAL
    CONTINUE_WITHOUT_GLOBAL=${CONTINUE_WITHOUT_GLOBAL:-Y}
    if [[ ! $CONTINUE_WITHOUT_GLOBAL =~ ^[Yy] ]]; then
        echo "Installation cancelled. Please install global skills first."
        exit 0
    fi
fi
echo ""

# Q3: MCP Tools Status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Q3: MCP Tools Status${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "The nextjs-project-setup skill integrates with MCP tools:"
echo ""
echo "  Essential:"
echo "    [ ] Vercel MCP - Template discovery"
echo "    [ ] Shadcn MCP - Component installation"
echo ""
echo "  Database (if needed):"
echo "    [ ] Supabase MCP - Database & auth"
echo ""
echo "  Design (optional):"
echo "    [ ] 21st Dev MCP - Design ideation"
echo "    [ ] Ref MCP - Library documentation"
echo ""
echo "Have you configured MCP tools in Claude Code?"
read -p "(Y/n): " MCP_CONFIGURED
MCP_CONFIGURED=${MCP_CONFIGURED:-Y}

if [[ ! $MCP_CONFIGURED =~ ^[Yy] ]]; then
    echo -e "${YELLOW}⚠️  MCP tools not configured${NC}"
    echo "The skill will work with limited functionality."
    echo "You can configure MCP tools later via Claude Code settings."
fi
echo ""

# Q4: Install Examples
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Q4: Install Example Projects${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Example projects demonstrate the skill workflows:"
echo "  1) None - Just install the toolkit"
echo "  2) Simple blog example (~5MB)"
echo "  3) Complex SaaS example Phase 1-3 (~15MB)"
echo "  4) Both examples (~20MB)"
echo ""
read -p "Choose [1-4] (default: 1): " INSTALL_EXAMPLES
INSTALL_EXAMPLES=${INSTALL_EXAMPLES:-1}

case $INSTALL_EXAMPLES in
    1)
        EXAMPLES_CHOICE="None"
        INSTALL_SIMPLE_EXAMPLE=false
        INSTALL_COMPLEX_EXAMPLE=false
        ;;
    2)
        EXAMPLES_CHOICE="Simple blog"
        INSTALL_SIMPLE_EXAMPLE=true
        INSTALL_COMPLEX_EXAMPLE=false
        ;;
    3)
        EXAMPLES_CHOICE="Complex SaaS"
        INSTALL_SIMPLE_EXAMPLE=false
        INSTALL_COMPLEX_EXAMPLE=true
        ;;
    4)
        EXAMPLES_CHOICE="Both"
        INSTALL_SIMPLE_EXAMPLE=true
        INSTALL_COMPLEX_EXAMPLE=true
        ;;
    *)
        echo -e "${YELLOW}Invalid choice, defaulting to none${NC}"
        EXAMPLES_CHOICE="None"
        INSTALL_SIMPLE_EXAMPLE=false
        INSTALL_COMPLEX_EXAMPLE=false
        ;;
esac

echo -e "${GREEN}✓ Examples: ${EXAMPLES_CHOICE}${NC}"
echo ""

# Q5: Create Test Project
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Q5: Create Test Project${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Create a test project to try the skill immediately?"
read -p "(y/N): " CREATE_TEST_PROJECT
CREATE_TEST_PROJECT=${CREATE_TEST_PROJECT:-N}

if [[ $CREATE_TEST_PROJECT =~ ^[Yy] ]]; then
    echo ""
    read -p "Project name (e.g., my-test-app): " TEST_PROJECT_NAME
    TEST_PROJECT_NAME=${TEST_PROJECT_NAME:-test-nextjs-app}

    echo ""
    echo "Project type:"
    echo "  1) Simple (blog, portfolio)"
    echo "  2) Complex SaaS (database, auth)"
    read -p "Choose [1-2] (default: 1): " TEST_PROJECT_TYPE
    TEST_PROJECT_TYPE=${TEST_PROJECT_TYPE:-1}

    echo -e "${GREEN}✓ Will create: ${TEST_PROJECT_NAME}${NC}"
else
    echo -e "${GREEN}✓ No test project${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Installation Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Scope:          ${SCOPE_NAME}"
echo "  Global Skills:  $([ "$SHADCN_EXISTS" = true ] && [ "$NEXTJS_EXISTS" = true ] && [ "$TAILWIND_EXISTS" = true ] && echo "All found" || echo "Some missing")"
echo "  MCP Tools:      $([ "$MCP_CONFIGURED" = "Y" ] || [ "$MCP_CONFIGURED" = "y" ] && echo "Configured" || echo "Not configured")"
echo "  Examples:       ${EXAMPLES_CHOICE}"
echo "  Test Project:   $([ "$CREATE_TEST_PROJECT" = "Y" ] || [ "$CREATE_TEST_PROJECT" = "y" ] && echo "${TEST_PROJECT_NAME}" || echo "None")"
echo ""
read -p "Proceed with installation? (Y/n): " PROCEED
PROCEED=${PROCEED:-Y}

if [[ ! $PROCEED =~ ^[Yy] ]]; then
    echo "Installation cancelled."
    exit 0
fi

echo ""

# ============================================
# PHASE 3: File Installation Pipeline
# ============================================

echo -e "${BLUE}Installing Intelligence Toolkit...${NC}"
echo ""

REPO_BASE="https://raw.githubusercontent.com/yangsi7/nextjs-intelligence-toolkit/master"

# Progress tracking
TOTAL_STAGES=6
CURRENT_STAGE=0

# Helper function for downloading files
download_file() {
    local url="$1"
    local output="$2"
    if command -v curl &> /dev/null; then
        curl -fsSL "$url" -o "$output" 2>/dev/null || {
            echo -e "${RED}    Failed to download: $output${NC}"
            return 1
        }
    elif command -v wget &> /dev/null; then
        wget -q "$url" -O "$output" 2>/dev/null || {
            echo -e "${RED}    Failed to download: $output${NC}"
            return 1
        }
    else
        echo -e "${RED}    Neither curl nor wget found${NC}"
        return 1
    fi
}

# Stage 1: Core Skill
((CURRENT_STAGE++))
echo -e "${BLUE}[Stage $CURRENT_STAGE/$TOTAL_STAGES] Installing core skill...${NC}"

if [ "$INSTALL_LOCAL" = true ]; then
    mkdir -p .claude/skills/nextjs-project-setup/docs/complex
    mkdir -p .claude/skills/nextjs-project-setup/templates
    mkdir -p .claude/skills/nextjs-project-setup/references

    # Download SKILL.md
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/SKILL.md" \
        ".claude/skills/nextjs-project-setup/SKILL.md"

    # Download docs
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/simple-setup.md" \
        ".claude/skills/nextjs-project-setup/docs/simple-setup.md"

    # Download complex phase docs (4 files after consolidation)
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/complex/foundation-and-template.md" \
        ".claude/skills/nextjs-project-setup/docs/complex/foundation-and-template.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/complex/design-and-wireframes.md" \
        ".claude/skills/nextjs-project-setup/docs/complex/design-and-wireframes.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/complex/implementation-and-qa.md" \
        ".claude/skills/nextjs-project-setup/docs/complex/implementation-and-qa.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/complex/documentation.md" \
        ".claude/skills/nextjs-project-setup/docs/complex/documentation.md"

    echo -e "${GREEN}  ✓ Core skill installed (local)${NC}"
fi

if [ "$INSTALL_USER" = true ]; then
    mkdir -p ~/.claude/skills/nextjs-project-setup/docs/complex
    mkdir -p ~/.claude/skills/nextjs-project-setup/templates
    mkdir -p ~/.claude/skills/nextjs-project-setup/references

    # Download SKILL.md
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/SKILL.md" \
        "$HOME/.claude/skills/nextjs-project-setup/SKILL.md"

    # Download docs
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/simple-setup.md" \
        "$HOME/.claude/skills/nextjs-project-setup/docs/simple-setup.md"

    # Download complex phase docs (4 files)
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/complex/foundation-and-template.md" \
        "$HOME/.claude/skills/nextjs-project-setup/docs/complex/foundation-and-template.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/complex/design-and-wireframes.md" \
        "$HOME/.claude/skills/nextjs-project-setup/docs/complex/design-and-wireframes.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/complex/implementation-and-qa.md" \
        "$HOME/.claude/skills/nextjs-project-setup/docs/complex/implementation-and-qa.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/docs/complex/documentation.md" \
        "$HOME/.claude/skills/nextjs-project-setup/docs/complex/documentation.md"

    echo -e "${GREEN}  ✓ Core skill installed (user-level)${NC}"
fi

# Stage 2: Templates
((CURRENT_STAGE++))
echo -e "${BLUE}[Stage $CURRENT_STAGE/$TOTAL_STAGES] Installing templates...${NC}"

if [ "$INSTALL_LOCAL" = true ]; then
    mkdir -p .claude/templates

    # Download templates
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/templates/design-showcase.md" \
        ".claude/templates/design-showcase.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/templates/wireframe-template.md" \
        ".claude/templates/wireframe-template.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/templates/report-template.md" \
        ".claude/templates/report-template.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/templates/claude-md-template.md" \
        ".claude/templates/claude-md-template.md"

    echo -e "${GREEN}  ✓ Templates installed (local)${NC}"
fi

if [ "$INSTALL_USER" = true ]; then
    mkdir -p ~/.claude/templates

    # Download templates
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/templates/design-showcase.md" \
        "$HOME/.claude/templates/design-showcase.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/templates/wireframe-template.md" \
        "$HOME/.claude/templates/wireframe-template.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/templates/report-template.md" \
        "$HOME/.claude/templates/report-template.md"
    download_file "$REPO_BASE/.claude/skills/nextjs-project-setup/templates/claude-md-template.md" \
        "$HOME/.claude/templates/claude-md-template.md"

    echo -e "${GREEN}  ✓ Templates installed (user-level)${NC}"
fi

# Stage 3: Agents
((CURRENT_STAGE++))
echo -e "${BLUE}[Stage $CURRENT_STAGE/$TOTAL_STAGES] Installing agents...${NC}"

if [ "$INSTALL_LOCAL" = true ]; then
    mkdir -p .claude/agents

    # Download agents
    download_file "$REPO_BASE/.claude/agents/nextjs-design-ideator.md" \
        ".claude/agents/nextjs-design-ideator.md"
    download_file "$REPO_BASE/.claude/agents/nextjs-qa-validator.md" \
        ".claude/agents/nextjs-qa-validator.md"
    download_file "$REPO_BASE/.claude/agents/nextjs-doc-auditor.md" \
        ".claude/agents/nextjs-doc-auditor.md"

    echo -e "${GREEN}  ✓ Agents installed (local)${NC}"
fi

if [ "$INSTALL_USER" = true ]; then
    mkdir -p ~/.claude/agents

    # Download agents
    download_file "$REPO_BASE/.claude/agents/nextjs-design-ideator.md" \
        "$HOME/.claude/agents/nextjs-design-ideator.md"
    download_file "$REPO_BASE/.claude/agents/nextjs-qa-validator.md" \
        "$HOME/.claude/agents/nextjs-qa-validator.md"
    download_file "$REPO_BASE/.claude/agents/nextjs-doc-auditor.md" \
        "$HOME/.claude/agents/nextjs-doc-auditor.md"

    echo -e "${GREEN}  ✓ Agents installed (user-level)${NC}"
fi

# Stage 4: Shared Frameworks
((CURRENT_STAGE++))
echo -e "${BLUE}[Stage $CURRENT_STAGE/$TOTAL_STAGES] Installing shared frameworks...${NC}"

if [ "$INSTALL_LOCAL" = true ]; then
    mkdir -p .claude/shared-imports

    # Download frameworks
    download_file "$REPO_BASE/.claude/shared-imports/CoD_Σ.md" \
        ".claude/shared-imports/CoD_Σ.md"
    download_file "$REPO_BASE/.claude/shared-imports/constitution.md" \
        ".claude/shared-imports/constitution.md"

    echo -e "${GREEN}  ✓ Frameworks installed (local)${NC}"
fi

if [ "$INSTALL_USER" = true ]; then
    mkdir -p ~/.claude/shared-imports

    # Download frameworks
    download_file "$REPO_BASE/.claude/shared-imports/CoD_Σ.md" \
        "$HOME/.claude/shared-imports/CoD_Σ.md"
    download_file "$REPO_BASE/.claude/shared-imports/constitution.md" \
        "$HOME/.claude/shared-imports/constitution.md"

    echo -e "${GREEN}  ✓ Frameworks installed (user-level)${NC}"
fi

# Stage 5: Infrastructure
((CURRENT_STAGE++))
echo -e "${BLUE}[Stage $CURRENT_STAGE/$TOTAL_STAGES] Setting up infrastructure...${NC}"

if [ "$INSTALL_LOCAL" = true ]; then
    mkdir -p reports

    cat > reports/README.md << 'EOF'
# Reports Directory

This directory contains generated reports from the nextjs-project-setup skill:
- foundation-research.md (Phase 1 output)
- design-ideator-report-[timestamp].md
- qa-report-[timestamp].md
- doc-audit-report-[timestamp].md
EOF

    cat > reports/.gitignore << 'EOF'
# Ignore all timestamp reports
*-[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]*.md

# Keep README and foundation research
!README.md
!foundation-research.md
EOF

    # Generate CLAUDE.md for project
    cat > CLAUDE.md << 'EOF'
# Next.js Intelligence Toolkit Test Project

## Project Overview

This project was created by the Next.js Intelligence Toolkit setup script.

**Main Product**: nextjs-project-setup skill

## Tech Stack

- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Components: Shadcn UI

## Intelligence Toolkit

This project leverages the nextjs-project-setup skill which provides:

- **Simple Path** (15-30 min): Template → Setup → Components → Design → Docs
- **Complex Path** (2-4 hours): 8 phases including specs, design system, wireframes, TDD, QA, docs

## Development Workflow

### Initial Setup
Run the nextjs-project-setup skill (see initial-prompt.md for details)

### Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm test         # Run tests
```

### Conventions
- Mobile-first responsive design
- Use Shadcn components from @ui registry
- Global Tailwind CSS variables only (no inline custom colors)
- TDD approach (tests before implementation)

## MCP Tools Available

- **Shadcn MCP**: Component search and installation (Search → View → Example → Install)
- **Vercel MCP**: Template discovery and deployment
- **21st Dev MCP**: Design ideation and inspiration
- **Ref MCP**: Library documentation (Next.js, React, TypeScript)

## Anti-Patterns

❌ **Hardcoded colors** (use CSS variables)
   **Why**: Breaks theme switching and design system consistency

❌ **Skipping Shadcn Example step**
   **Why**: Examples reveal usage patterns and prevent integration issues

## Next Steps

1. Fill out **initial-prompt.md** with your project details
2. Run the kickstart command in Claude Code
3. Follow the workflow

See **initial-prompt.md** for the exact kickstart prompt.
EOF

    # Generate initial-prompt.md template
    cat > initial-prompt.md << 'EOF'
# Next.js Project: [Your Project Name]

**Created**: [DATE]
**Project Type**: [Simple | Complex SaaS | E-commerce | Custom]
**Recommended Path**: [simple | complex]

---

## 1. What I Want to Build

<!-- Describe your vision here. Be specific about:
- What problem does this solve?
- Who are the users?
- What are the core features?
- What makes this unique?
-->

[Your project description here]

---

## 2. Complexity Indicators

Based on your requirements:

- [ ] Database required
- [ ] Custom authentication
- [ ] Multi-tenant architecture
- [ ] E-commerce features
- [ ] Complex design system
- [ ] Multiple third-party integrations

**Path Recommendation**: [SIMPLE or COMPLEX based on checked indicators]

---

## 3. Tech Stack Preferences

### Framework & Template
- **Next.js Version**: 14+ (App Router)
- **Vercel Template**: [Let Claude choose | Specify template name]

### Frontend
- **Styling**: Tailwind CSS (default)
- **Components**: Shadcn UI (@ui registry)
- **Design System**: [Custom | Use defaults | Specify inspiration]

---

## 4. Feature Requirements

<!-- List the main features in priority order (P1, P2, P3...) -->

### P1 Features (Must Have - MVP)
1. [Feature 1 description]
2. [Feature 2 description]
3. [Feature 3 description]

### P2 Features (Should Have - Enhancement)
1. [Feature 1 description]
2. [Feature 2 description]

### P3 Features (Nice to Have - Future)
1. [Feature 1 description]
2. [Feature 2 description]

---

## 5. Kickstart Command

Once you've filled out sections 1-4 above, **paste this command into Claude Code**:

```
Use the nextjs-project-setup skill to create a [PROJECT_TYPE] Next.js project based on @initial-prompt.md.

Project name: [YOUR_PROJECT_NAME]
Recommended path: [simple | complex]

Follow the nextjs-project-setup skill's workflow, using:
- Shadcn MCP for components (Search → View → Example → Install)
- Vercel MCP for templates
- 21st Dev MCP for design inspiration
- Ref MCP for Next.js/React documentation

Apply TDD throughout implementation.
```

---

## Notes

- The **nextjs-project-setup skill** will guide you through the entire process
- For complex projects, expect 2-4 hours with user feedback loops
- For simple projects, expect 15-30 minutes
- All workflows enforce TDD, visual validation, and quality gates

Ready? Copy the kickstart command above and paste it into Claude Code!
EOF

    echo -e "${GREEN}  ✓ Infrastructure set up (local)${NC}"
fi

# Stage 6: Examples
((CURRENT_STAGE++))
echo -e "${BLUE}[Stage $CURRENT_STAGE/$TOTAL_STAGES] Installing examples...${NC}"

if [ "$INSTALL_SIMPLE_EXAMPLE" = true ]; then
    mkdir -p examples/simple-blog
    cat > examples/simple-blog/README.md << 'EOF'
# Simple Blog Example

This example demonstrates the **simple path** workflow (15-30 min).

## What's Included

- Next.js Blog Starter Kit template
- Shadcn UI components (button, card, separator)
- Basic Tailwind CSS design system
- Minimal documentation

## How It Was Created

1. Run setup.sh
2. Choose "Simple" project type
3. Run kickstart command in Claude Code
4. Skill completed in 20 minutes

## Try It Yourself

```bash
cd examples/simple-blog
npm install
npm run dev
```

Visit http://localhost:3000
EOF
    echo -e "${GREEN}  ✓ Simple blog example installed${NC}"
fi

if [ "$INSTALL_COMPLEX_EXAMPLE" = true ]; then
    mkdir -p examples/complex-saas
    cat > examples/complex-saas/README.md << 'EOF'
# Complex SaaS Example (Phase 1-3)

This example demonstrates the **complex path** workflow (Phases 1-3).

## What's Included

- Phase 1: Foundation research report
- Phase 2: Template selection (Next.js SaaS template)
- Phase 3: Product spec, constitution, features, architecture

## Documentation

- `/reports/foundation-research.md` - Intelligence-first research
- `/docs/product-spec.md` - Product specification
- `/docs/constitution.md` - Project principles
- `/docs/features.md` - Feature breakdown (P1, P2, P3)
- `/docs/architecture.md` - System design

## How It Was Created

1. Run setup.sh with complex SaaS options
2. Run kickstart command in Claude Code
3. Completed Phases 1-3 (1 hour)
4. Ready for Phases 4-8 (design, wireframes, implementation, QA, docs)

## Next Steps

Continue with Phases 4-8 to complete the SaaS application.
EOF
    echo -e "${GREEN}  ✓ Complex SaaS example installed${NC}"
fi

if [ "$INSTALL_SIMPLE_EXAMPLE" = false ] && [ "$INSTALL_COMPLEX_EXAMPLE" = false ]; then
    echo -e "${GREEN}  ✓ No examples installed (skipped)${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✓ Installation Complete!"
echo "==========================================${NC}"
echo ""

# ============================================
# PHASE 4: Post-Install Summary & Next Steps
# ============================================

echo -e "${BLUE}Installation Summary:${NC}"
echo ""
echo "  Files Installed:"
[ "$INSTALL_LOCAL" = true ] && echo "    ✓ .claude/ (local project)"
[ "$INSTALL_USER" = true ] && echo "    ✓ ~/.claude/ (user-level)"
[ "$INSTALL_LOCAL" = true ] && echo "    ✓ CLAUDE.md"
[ "$INSTALL_LOCAL" = true ] && echo "    ✓ initial-prompt.md"
[ "$INSTALL_LOCAL" = true ] && echo "    ✓ reports/ directory"
[ "$INSTALL_SIMPLE_EXAMPLE" = true ] && echo "    ✓ examples/simple-blog/"
[ "$INSTALL_COMPLEX_EXAMPLE" = true ] && echo "    ✓ examples/complex-saas/"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo ""

if [ "$INSTALL_LOCAL" = true ]; then
    echo "1. ${YELLOW}Edit initial-prompt.md${NC} with your project details"
    echo "2. Open Claude Code in this directory: ${YELLOW}$CLAUDE_CMD${NC}"
    echo "3. Paste the kickstart command from initial-prompt.md"
fi

if [ "$INSTALL_USER" = true ]; then
    echo "1. The skill is now available in all Claude Code sessions"
    echo "2. Create a new Next.js project directory"
    echo "3. In Claude Code, the nextjs-project-setup skill will auto-trigger"
fi

echo ""

if [ "$CREATE_TEST_PROJECT" = "Y" ] || [ "$CREATE_TEST_PROJECT" = "y" ]; then
    echo -e "${BLUE}Creating test project: ${TEST_PROJECT_NAME}${NC}"
    mkdir -p "$TEST_PROJECT_NAME"
    cd "$TEST_PROJECT_NAME"

    # Copy CLAUDE.md and initial-prompt.md to test project
    cp ../CLAUDE.md .
    cp ../initial-prompt.md .

    # Update initial-prompt.md with test project name
    sed -i.bak "s/\[Your Project Name\]/$TEST_PROJECT_NAME/g" initial-prompt.md
    sed -i.bak "s/\[YOUR_PROJECT_NAME\]/$TEST_PROJECT_NAME/g" initial-prompt.md
    rm initial-prompt.md.bak

    if [ "$TEST_PROJECT_TYPE" = "1" ]; then
        sed -i.bak "s/\[Simple | Complex SaaS | E-commerce | Custom\]/Simple/g" initial-prompt.md
        sed -i.bak "s/\[simple | complex\]/simple/g" initial-prompt.md
        sed -i.bak "s/\[PROJECT_TYPE\]/Simple/g" initial-prompt.md
    else
        sed -i.bak "s/\[Simple | Complex SaaS | E-commerce | Custom\]/Complex SaaS/g" initial-prompt.md
        sed -i.bak "s/\[simple | complex\]/complex/g" initial-prompt.md
        sed -i.bak "s/\[PROJECT_TYPE\]/Complex SaaS/g" initial-prompt.md
    fi
    rm initial-prompt.md.bak

    echo -e "${GREEN}✓ Test project created: ${TEST_PROJECT_NAME}/${NC}"
    echo ""
    echo "To get started:"
    echo "  cd $TEST_PROJECT_NAME"
    echo "  $CLAUDE_CMD"
fi

echo ""
echo -e "${GREEN}The nextjs-project-setup skill is ready!${NC}"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  • README: https://github.com/yangsi7/nextjs-intelligence-toolkit"
[ "$INSTALL_LOCAL" = true ] && echo "  • CLAUDE.md: Project-specific context"
[ "$INSTALL_LOCAL" = true ] && echo "  • .claude/skills/nextjs-project-setup/SKILL.md: Complete skill docs"
echo ""

if [ "$SHADCN_EXISTS" = false ] || [ "$NEXTJS_EXISTS" = false ] || [ "$TAILWIND_EXISTS" = false ]; then
    echo -e "${YELLOW}⚠️  Optimization Tip:${NC}"
    echo "Install global skills for 81% token savings (6,500 tokens per run):"
    echo "  • shadcn-ui, nextjs, tailwindcss"
    echo "See: https://github.com/yangsi7/nextjs-intelligence-toolkit#global-skills"
    echo ""
fi

if [[ ! $MCP_CONFIGURED =~ ^[Yy] ]]; then
    echo -e "${YELLOW}⚠️  MCP Tools Tip:${NC}"
    echo "Configure MCP tools in Claude Code for full functionality:"
    echo "  • Vercel MCP (template discovery)"
    echo "  • Shadcn MCP (component installation)"
    echo "  • Supabase MCP (database & auth)"
    echo "See: https://github.com/yangsi7/nextjs-intelligence-toolkit#mcp-tools"
    echo ""
fi
