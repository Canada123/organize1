#!/bin/bash

#######################################
# Next.js Intelligence Toolkit - Installation Validator
# Version: 1.0.0
# Purpose: Validate installation completeness and correctness
#######################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TEST_CATEGORIES=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNED_TESTS=0

# Report file
REPORT_FILE="INSTALLATION-VALIDATION-REPORT.md"

# Start report
cat > "$REPORT_FILE" << 'EOF'
# Installation Validation Report

**Generated**: $(date +"%Y-%m-%d %H:%M:%S")
**Validator Version**: 1.0.0

---

## Summary

EOF

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Next.js Intelligence Toolkit - Installation Validator${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

#######################################
# Helper Functions
#######################################

test_start() {
    local test_name="$1"
    ((TOTAL_TEST_CATEGORIES++))
    echo -e "${BLUE}[Test $TOTAL_TEST_CATEGORIES] $test_name${NC}"
}

test_pass() {
    local message="$1"
    ((PASSED_TESTS++))
    echo -e "${GREEN}  ✓ PASS: $message${NC}"
    echo "- ✅ **PASS**: $message" >> "$REPORT_FILE"
}

test_fail() {
    local message="$1"
    ((FAILED_TESTS++))
    echo -e "${RED}  ✗ FAIL: $message${NC}"
    echo "- ❌ **FAIL**: $message" >> "$REPORT_FILE"
}

test_warn() {
    local message="$1"
    ((WARNED_TESTS++))
    echo -e "${YELLOW}  ⚠ WARN: $message${NC}"
    echo "- ⚠️  **WARN**: $message" >> "$REPORT_FILE"
}

#######################################
# Test 1: Skill Discovery
#######################################

test_start "Skill Discovery - nextjs-project-setup skill exists"

echo "" >> "$REPORT_FILE"
echo "### Test 1: Skill Discovery" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

SKILL_PATH_LOCAL=".claude/skills/nextjs-project-setup/SKILL.md"
SKILL_PATH_USER="$HOME/.claude/skills/nextjs-project-setup/SKILL.md"

if [ -f "$SKILL_PATH_LOCAL" ]; then
    # Check YAML frontmatter
    if head -n 10 "$SKILL_PATH_LOCAL" | grep -q "^name: nextjs-project-setup"; then
        test_pass "Local skill found with valid YAML frontmatter"

        # Check description field
        if head -n 10 "$SKILL_PATH_LOCAL" | grep -q "^description:"; then
            test_pass "Description field present (enables auto-invocation)"
        else
            test_warn "Description field missing (skill may not auto-invoke)"
        fi

        # Check file size (should be substantial)
        SKILL_SIZE=$(wc -l < "$SKILL_PATH_LOCAL")
        if [ "$SKILL_SIZE" -gt 100 ]; then
            test_pass "Skill content substantial ($SKILL_SIZE lines)"
        else
            test_warn "Skill content seems small ($SKILL_SIZE lines)"
        fi
    else
        test_fail "Local skill missing valid YAML frontmatter"
    fi
elif [ -f "$SKILL_PATH_USER" ]; then
    test_pass "User-level skill found at $SKILL_PATH_USER"
else
    test_fail "nextjs-project-setup skill not found (neither local nor user-level)"
fi

#######################################
# Test 2: Progressive Disclosure
#######################################

test_start "Progressive Disclosure - Support files present"

echo "" >> "$REPORT_FILE"
echo "### Test 2: Progressive Disclosure" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Check docs/
DOCS_PATH_LOCAL=".claude/skills/nextjs-project-setup/docs"
DOCS_PATH_USER="$HOME/.claude/skills/nextjs-project-setup/docs"

if [ -d "$DOCS_PATH_LOCAL" ] || [ -d "$DOCS_PATH_USER" ]; then
    DOCS_PATH="$DOCS_PATH_LOCAL"
    [ ! -d "$DOCS_PATH_LOCAL" ] && DOCS_PATH="$DOCS_PATH_USER"

    # Check simple-setup.md
    if [ -f "$DOCS_PATH/simple-setup.md" ]; then
        test_pass "simple-setup.md found"
    else
        test_fail "simple-setup.md missing"
    fi

    # Check complex phase docs (should be 4 consolidated files)
    COMPLEX_DOCS=("foundation-and-template.md" "design-and-wireframes.md" "implementation-and-qa.md" "documentation.md")
    FOUND_COMPLEX=0

    for doc in "${COMPLEX_DOCS[@]}"; do
        if [ -f "$DOCS_PATH/complex/$doc" ]; then
            ((FOUND_COMPLEX++))
        fi
    done

    if [ "$FOUND_COMPLEX" -eq 4 ]; then
        test_pass "All 4 consolidated complex docs found"
    elif [ "$FOUND_COMPLEX" -gt 0 ]; then
        test_warn "Only $FOUND_COMPLEX/4 complex docs found"
    else
        test_fail "No complex phase docs found"
    fi
else
    test_fail "docs/ directory not found"
fi

# Check templates/ (within skill directory)
TEMPLATES_PATH_LOCAL=".claude/skills/nextjs-project-setup/templates"
TEMPLATES_PATH_USER="$HOME/.claude/skills/nextjs-project-setup/templates"

if [ -d "$TEMPLATES_PATH_LOCAL" ] || [ -d "$TEMPLATES_PATH_USER" ]; then
    TEMPLATES_PATH="$TEMPLATES_PATH_LOCAL"
    [ ! -d "$TEMPLATES_PATH_LOCAL" ] && TEMPLATES_PATH="$TEMPLATES_PATH_USER"

    EXPECTED_TEMPLATES=("design-showcase.md" "wireframe-template.md" "report-template.md" "claude-md-template.md")
    FOUND_TEMPLATES=0

    for template in "${EXPECTED_TEMPLATES[@]}"; do
        if [ -f "$TEMPLATES_PATH/$template" ]; then
            ((FOUND_TEMPLATES++))
        fi
    done

    if [ "$FOUND_TEMPLATES" -eq 4 ]; then
        test_pass "All 4 templates found"
    elif [ "$FOUND_TEMPLATES" -gt 0 ]; then
        test_warn "Only $FOUND_TEMPLATES/4 templates found"
    else
        test_fail "No templates found"
    fi
else
    test_fail "templates/ directory not found"
fi

#######################################
# Test 3: Dependencies - Agents
#######################################

test_start "Dependencies - 3 agents present (not 7)"

echo "" >> "$REPORT_FILE"
echo "### Test 3: Dependencies - Agents" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

AGENTS_PATH_LOCAL=".claude/agents"
AGENTS_PATH_USER="$HOME/.claude/agents"

if [ -d "$AGENTS_PATH_LOCAL" ] || [ -d "$AGENTS_PATH_USER" ]; then
    AGENTS_PATH="$AGENTS_PATH_LOCAL"
    [ ! -d "$AGENTS_PATH_LOCAL" ] && AGENTS_PATH="$AGENTS_PATH_USER"

    EXPECTED_AGENTS=("nextjs-design-ideator.md" "nextjs-qa-validator.md" "nextjs-doc-auditor.md")
    FOUND_AGENTS=0

    for agent in "${EXPECTED_AGENTS[@]}"; do
        if [ -f "$AGENTS_PATH/$agent" ]; then
            ((FOUND_AGENTS++))
        fi
    done

    # Check for old research agents (should NOT exist)
    OLD_AGENTS=("nextjs-research-vercel.md" "nextjs-research-shadcn.md" "nextjs-research-supabase.md" "nextjs-research-design.md")
    FOUND_OLD=0

    for old_agent in "${OLD_AGENTS[@]}"; do
        if [ -f "$AGENTS_PATH/$old_agent" ]; then
            ((FOUND_OLD++))
        fi
    done

    if [ "$FOUND_AGENTS" -eq 3 ]; then
        test_pass "All 3 required agents found"

        if [ "$FOUND_OLD" -eq 0 ]; then
            test_pass "No old research agents present (correct - 7→3 reduction)"
        else
            test_warn "$FOUND_OLD old research agents still present (should be deleted)"
        fi
    else
        test_fail "Only $FOUND_AGENTS/3 required agents found"
    fi
else
    test_fail "agents/ directory not found"
fi

#######################################
# Test 4: Agents - Clarification Protocol
#######################################

test_start "Agents - Clarification protocol present"

echo "" >> "$REPORT_FILE"
echo "### Test 4: Agents - Clarification Protocol" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ -d "$AGENTS_PATH" ]; then
    AGENTS_WITH_PROTOCOL=0

    for agent in "${EXPECTED_AGENTS[@]}"; do
        if [ -f "$AGENTS_PATH/$agent" ]; then
            if grep -q "\[CLARIFY:" "$AGENTS_PATH/$agent" 2>/dev/null; then
                ((AGENTS_WITH_PROTOCOL++))
            fi
        fi
    done

    if [ "$AGENTS_WITH_PROTOCOL" -eq 3 ]; then
        test_pass "All 3 agents have clarification protocol"
    elif [ "$AGENTS_WITH_PROTOCOL" -gt 0 ]; then
        test_warn "Only $AGENTS_WITH_PROTOCOL/3 agents have clarification protocol"
    else
        test_warn "No agents have clarification protocol (Phase C may be incomplete)"
    fi
else
    test_fail "Cannot check agent protocols - agents/ directory not found"
fi

#######################################
# Test 5: MCP Tools Detection
#######################################

test_start "MCP Tools - Configuration files present"

echo "" >> "$REPORT_FILE"
echo "### Test 5: MCP Tools Detection" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Check for .mcp.json (if exists)
if [ -f ".mcp.json" ]; then
    test_pass "Local .mcp.json found"

    # Check for key MCP servers
    MCP_SERVERS=("vercel" "shadcn" "supabase" "21st-dev" "ref")
    FOUND_MCP=0

    for mcp in "${MCP_SERVERS[@]}"; do
        if grep -qi "$mcp" .mcp.json 2>/dev/null; then
            ((FOUND_MCP++))
        fi
    done

    if [ "$FOUND_MCP" -gt 0 ]; then
        test_pass "$FOUND_MCP/5 expected MCP servers configured"
    else
        test_warn "No expected MCP servers found in .mcp.json"
    fi
elif [ -f "$HOME/.mcp.json" ]; then
    test_pass "User-level .mcp.json found at $HOME/.mcp.json"
else
    test_warn ".mcp.json not found (MCP tools may not be configured)"
fi

#######################################
# Test 6: Global Skills Detection
#######################################

test_start "Global Skills - shadcn-ui, nextjs, tailwindcss"

echo "" >> "$REPORT_FILE"
echo "### Test 6: Global Skills Detection" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

GLOBAL_SKILLS_PATH="$HOME/.claude/skills"

if [ -d "$GLOBAL_SKILLS_PATH" ]; then
    EXPECTED_GLOBAL=("shadcn-ui" "nextjs" "tailwindcss")
    FOUND_GLOBAL=0

    for skill in "${EXPECTED_GLOBAL[@]}"; do
        if [ -f "$GLOBAL_SKILLS_PATH/$skill/SKILL.md" ]; then
            ((FOUND_GLOBAL++))
        fi
    done

    if [ "$FOUND_GLOBAL" -eq 3 ]; then
        test_pass "All 3 global skills found (shadcn-ui, nextjs, tailwindcss)"
    elif [ "$FOUND_GLOBAL" -gt 0 ]; then
        test_warn "Only $FOUND_GLOBAL/3 global skills found"
    else
        test_warn "No global skills found (80%+ token savings may not be realized)"
    fi
else
    test_warn "Global skills directory not found at $HOME/.claude/skills"
fi

#######################################
# Test 7: Simple Workflow Test
#######################################

test_start "Simple Workflow - simple-setup.md completeness"

echo "" >> "$REPORT_FILE"
echo "### Test 7: Simple Workflow Test" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ -f "$DOCS_PATH/simple-setup.md" ]; then
    # Check for key sections
    SECTIONS=("Template Selection" "Basic Setup" "Component Setup" "Quick Design System" "Minimal Documentation")
    FOUND_SECTIONS=0

    for section in "${SECTIONS[@]}"; do
        if grep -q "## .*$section" "$DOCS_PATH/simple-setup.md" 2>/dev/null; then
            ((FOUND_SECTIONS++))
        fi
    done

    if [ "$FOUND_SECTIONS" -eq 5 ]; then
        test_pass "simple-setup.md has all 5 required sections"
    elif [ "$FOUND_SECTIONS" -gt 0 ]; then
        test_warn "simple-setup.md missing $((5 - FOUND_SECTIONS)) sections"
    else
        test_fail "simple-setup.md missing all required sections"
    fi

    # Check file size (should be substantial)
    SIMPLE_SIZE=$(wc -l < "$DOCS_PATH/simple-setup.md")
    if [ "$SIMPLE_SIZE" -gt 200 ]; then
        test_pass "simple-setup.md substantial ($SIMPLE_SIZE lines)"
    else
        test_warn "simple-setup.md seems incomplete ($SIMPLE_SIZE lines)"
    fi
else
    test_fail "simple-setup.md not found - cannot test simple workflow"
fi

#######################################
# Test 8: Phase 1 Installation Test
#######################################

test_start "Phase 1 Installation - Core infrastructure"

echo "" >> "$REPORT_FILE"
echo "### Test 8: Phase 1 Installation Test" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Check /reports/ directory
if [ -d "reports" ]; then
    test_pass "reports/ directory exists"

    if [ -f "reports/README.md" ]; then
        test_pass "reports/README.md exists"
    else
        test_warn "reports/README.md missing"
    fi
else
    test_fail "reports/ directory missing (critical - blocks Phase 1)"
fi

# Check CLAUDE.md
if [ -f "CLAUDE.md" ]; then
    test_pass "CLAUDE.md generated"

    # Check for key content
    if grep -q "nextjs-project-setup" CLAUDE.md 2>/dev/null; then
        test_pass "CLAUDE.md references nextjs-project-setup skill"
    else
        test_warn "CLAUDE.md may be missing skill reference"
    fi
else
    test_warn "CLAUDE.md not generated"
fi

# Check initial-prompt.md
if [ -f "initial-prompt.md" ]; then
    test_pass "initial-prompt.md generated"
else
    test_warn "initial-prompt.md not generated"
fi

# Check .claude/shared-imports/
SHARED_IMPORTS_LOCAL=".claude/shared-imports"
SHARED_IMPORTS_USER="$HOME/.claude/shared-imports"

if [ -d "$SHARED_IMPORTS_LOCAL" ] || [ -d "$SHARED_IMPORTS_USER" ]; then
    SHARED_PATH="$SHARED_IMPORTS_LOCAL"
    [ ! -d "$SHARED_IMPORTS_LOCAL" ] && SHARED_PATH="$SHARED_IMPORTS_USER"

    EXPECTED_SHARED=("CoD_Σ.md" "constitution.md")
    FOUND_SHARED=0

    for shared in "${EXPECTED_SHARED[@]}"; do
        if [ -f "$SHARED_PATH/$shared" ]; then
            ((FOUND_SHARED++))
        fi
    done

    if [ "$FOUND_SHARED" -eq 2 ]; then
        test_pass "All 2 shared frameworks found (CoD_Σ.md, constitution.md)"
    elif [ "$FOUND_SHARED" -gt 0 ]; then
        test_warn "Only $FOUND_SHARED/2 shared frameworks found"
    else
        test_fail "No shared frameworks found"
    fi
else
    test_fail "shared-imports/ directory not found"
fi

#######################################
# Generate Summary
#######################################

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Validation Summary${NC}"
echo -e "${BLUE}========================================${NC}"

# Calculate totals
TOTAL_ASSERTIONS=$((PASSED_TESTS + FAILED_TESTS + WARNED_TESTS))

# Calculate pass rate (avoid division by zero)
if [ "$TOTAL_ASSERTIONS" -gt 0 ]; then
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_ASSERTIONS))
else
    PASS_RATE=0
fi

echo -e "${BLUE}Test Categories: $TOTAL_TEST_CATEGORIES${NC}"
echo -e "${BLUE}Total Assertions: $TOTAL_ASSERTIONS${NC}"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo -e "${YELLOW}Warnings: $WARNED_TESTS${NC}"
echo -e "${BLUE}Pass Rate: $PASS_RATE%${NC}"

# Update report
cat >> "$REPORT_FILE" << EOF

---

## Overall Results

- **Test Categories**: $TOTAL_TEST_CATEGORIES
- **Total Assertions**: $TOTAL_ASSERTIONS
- **Passed**: $PASSED_TESTS ✅
- **Failed**: $FAILED_TESTS ❌
- **Warnings**: $WARNED_TESTS ⚠️
- **Pass Rate**: $PASS_RATE%

---

## Status

EOF

if [ "$FAILED_TESTS" -eq 0 ]; then
    if [ "$WARNED_TESTS" -eq 0 ]; then
        echo "**Status**: ✅ **EXCELLENT** - All tests passed with no warnings" >> "$REPORT_FILE"
        echo -e "${GREEN}Status: EXCELLENT - All tests passed!${NC}"
    else
        echo "**Status**: ✅ **GOOD** - All tests passed with $WARNED_TESTS warnings" >> "$REPORT_FILE"
        echo -e "${GREEN}Status: GOOD - All tests passed with warnings${NC}"
    fi
else
    if [ "$FAILED_TESTS" -le 2 ]; then
        echo "**Status**: ⚠️  **ACCEPTABLE** - Minor issues detected ($FAILED_TESTS failures)" >> "$REPORT_FILE"
        echo -e "${YELLOW}Status: ACCEPTABLE - Minor issues detected${NC}"
    else
        echo "**Status**: ❌ **NEEDS ATTENTION** - Multiple failures detected ($FAILED_TESTS failures)" >> "$REPORT_FILE"
        echo -e "${RED}Status: NEEDS ATTENTION - Multiple failures detected${NC}"
    fi
fi

cat >> "$REPORT_FILE" << 'EOF'

---

## Recommendations

### If All Tests Passed:
- ✅ Installation is complete and functional
- ✅ Ready to use the nextjs-project-setup skill
- ✅ Try creating a simple Next.js project with: `Use the nextjs-project-setup skill to create a simple Next.js blog`

### If Warnings Present:
- Review warnings above to identify missing optional components
- Consider installing missing global skills (shadcn-ui, nextjs, tailwindcss) for 80%+ token savings
- Verify MCP tools configuration if .mcp.json warnings appeared

### If Failures Present:
- **Critical failures** (missing skill, agents, or docs): Re-run setup.sh
- **Missing reports/ directory**: Create manually: `mkdir reports && touch reports/README.md`
- **Old agents present**: Delete manually: `rm .claude/agents/nextjs-research-*.md`

---

## Next Steps

1. **Test the skill**: Open Claude Code and try the skill with a simple project
2. **Review documentation**: Check CLAUDE.md and initial-prompt.md for usage instructions
3. **Explore examples** (if installed): Review examples/ directory for reference implementations
4. **Configure MCP tools** (if warnings): Set up Vercel, Shadcn, Supabase MCPs for full functionality

---

**Report Generated**: $(date +"%Y-%m-%d %H:%M:%S")
**Validator**: validate-installation.sh v1.0.0
EOF

echo ""
echo -e "${BLUE}Full report saved to: $REPORT_FILE${NC}"
echo ""

# Exit with appropriate code
if [ "$FAILED_TESTS" -gt 0 ]; then
    exit 1
else
    exit 0
fi
