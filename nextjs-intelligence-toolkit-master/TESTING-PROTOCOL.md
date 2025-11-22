# Testing Protocol: Next.js Project Setup System

**Purpose**: Validate improvements to nextjs-project-setup skill
**Audience**: AI agents and human testers
**Version**: 1.0 (Iteration 1)

---

## Overview

This protocol provides step-by-step instructions for testing the improved Next.js project setup system. Tests cover both **simple path** (15-30 min) and **complex path** (2-4 hours) workflows.

**Testing Approach**:
1. Install in new empty project
2. Run test scenarios
3. Provide results to AI agent for assessment
4. AI agent validates against success criteria

---

## Part 1: Test Environment Setup

### Prerequisites

**Required**:
- Claude Code installed and configured
- Node.js 18+ installed
- Git installed and configured
- Empty directory for testing

**Optional** (for complex path):
- Supabase account (if testing database features)
- Vercel account (if testing deployment)

### Installation Steps

#### Step 1: Create Test Project Directory

```bash
# Create fresh test directory
mkdir nextjs-test-project
cd nextjs-test-project

# Initialize git (required for rollback testing)
git init
git config user.name "Test User"
git config user.email "test@example.com"
```

#### Step 2: Copy Claude Code Intelligence Toolkit

```bash
# Copy the .claude/ directory from this project
cp -r /path/to/set-up-new-nextjs-project/.claude/ .

# Verify structure
ls -la .claude/
# Should see: agents/, commands/, skills/, templates/, shared-imports/
```

#### Step 3: Verify Critical Components

```bash
# Check that nextjs-project-setup skill exists
ls -la .claude/skills/nextjs-project-setup/SKILL.md

# Check that 3 agents exist (not 7)
ls -la .claude/agents/nextjs-*
# Should see ONLY: design-ideator, qa-validator, doc-auditor

# Check that /reports/ directory exists (if Phase A complete)
ls -la reports/
# Should see: README.md, .gitignore
```

#### Step 4: Create Initial CLAUDE.md

```bash
# Minimal CLAUDE.md to trigger skill
cat > CLAUDE.md << 'EOF'
# Test Project

This is a test project for validating the nextjs-project-setup skill improvements.

## Test Focus
- Validate critical infrastructure fixes
- Test flow clarity improvements
- Verify agent coordination
- Measure token efficiency
EOF
```

#### Step 5: Initialize Claude Code Session

```bash
# Start Claude Code in the test directory
claude-code

# Or if using Claude Code CLI
claude
```

---

## Part 2: Test Scenarios

### Test Scenario 1: Simple Path (Basic Validation)

**Objective**: Verify simple path completes without errors after Phase A fixes

**Duration**: 15-30 minutes

**User Prompt** (provide to Claude Code):
```
I want to set up a simple Next.js blog project.

Requirements:
- Personal blog
- Markdown content
- No database
- No authentication
- Simple design (use default templates)

Please set up the project using the nextjs-project-setup skill.
```

**Expected Behavior**:
1. Skill auto-triggers based on description
2. Complexity assessment: SIMPLE PATH (≤1 complex indicators)
3. Asks user to confirm simple path
4. Executes 5 simple steps:
   - Template selection
   - Setup
   - Core components (Shadcn)
   - Basic design (Tailwind)
   - Documentation (README + CLAUDE.md)

**Success Criteria** (Phase A):
- ✓ No error about missing /reports/ directory
- ✓ Workflow completes without crashes
- ✓ All 5 steps execute
- ✓ Final deliverables exist (see below)

**Deliverables to Check**:
```bash
# Check project structure
ls -la

# Should see:
# - package.json
# - next.config.js
# - tailwind.config.ts
# - components.json (Shadcn)
# - app/ directory
# - components/ui/ directory
# - README.md
# - CLAUDE.md

# Check Shadcn components installed
ls -la components/ui/
# Should see at least: button, card, separator

# Check documentation
cat CLAUDE.md
# Should have: Overview, Tech Stack, Development workflow, Conventions
```

**Results to Report**:
```
Test Scenario 1: Simple Path

Status: [PASS/FAIL]

Issues Encountered:
- [List any errors, warnings, or unexpected behavior]

Missing Deliverables:
- [List any expected files that don't exist]

Token Usage:
- Estimated tokens used: [if visible]

Time Taken:
- Actual duration: [minutes]
- Expected: 15-30 minutes

Additional Observations:
- [Any other relevant findings]
```

---

### Test Scenario 2: Complex Path - Phase 1 Only (Infrastructure Test)

**Objective**: Verify Phase 1 (Foundation Research) works with Phase A fixes

**Duration**: 5-10 minutes

**User Prompt**:
```
I want to set up a complex Next.js SaaS application.

Requirements:
- Database required (Supabase)
- User authentication
- Multi-tenant architecture
- Custom design system
- E-commerce features (subscriptions)

For now, just complete Phase 1 (Foundation Research) and show me the research report.
```

**Expected Behavior**:
1. Skill auto-triggers
2. Complexity assessment: COMPLEX PATH (≥2 complex indicators)
3. Asks user to confirm complex path
4. Executes Phase 1 ONLY:
   - Reviews global skills (shadcn-ui, nextjs, tailwindcss)
   - Queries MCP tools (Vercel, Shadcn, Supabase)
   - Synthesizes context
   - Creates /reports/foundation-research.md

**Success Criteria** (Phase A critical fix):
- ✓ /reports/ directory exists
- ✓ Phase 1 completes without errors
- ✓ foundation-research.md created successfully
- ✓ Report contains: template options, component strategy, database approach, design considerations

**Deliverables to Check**:
```bash
# Check /reports/ directory was created
ls -la reports/
# Should see: README.md, .gitignore, foundation-research.md

# Check report content
cat reports/foundation-research.md

# Should contain:
# - Available Templates summary
# - Component Strategy (references global skills)
# - Database Setup approach
# - Design System starting point
# - Token usage note (1,500 tokens vs 8,000 old)
```

**Results to Report**:
```
Test Scenario 2: Complex Path Phase 1

Status: [PASS/FAIL]

Critical Checks:
- [ ] /reports/ directory exists
- [ ] foundation-research.md created
- [ ] Report is 700-1000 tokens (concise)
- [ ] References global skills (doesn't duplicate)

Issues Encountered:
- [List any errors]

Token Efficiency:
- Estimated tokens used: [if visible]
- Expected: ~1,500 tokens
- Savings vs old approach: ~6,500 tokens (81%)

Additional Observations:
- [Any other findings]
```

---

### Test Scenario 3: Agent Clarification Protocol (Phase C Feature)

**Objective**: Verify agent clarification mechanism works (after Phase C complete)

**Duration**: 10-15 minutes

**Prerequisites**: Phase C must be complete

**User Prompt**:
```
I want to test the agent clarification protocol.

Use the nextjs-design-ideator agent to generate design system options.

If the agent's report is unclear or missing details, request clarification using the new protocol.
```

**Expected Behavior**:
1. Design-ideator agent dispatched
2. Agent generates design options report
3. IF report unclear (simulated):
   - Main agent sends: "[CLARIFY: Please provide more details on color palette rationale]"
   - Agent responds with focused clarification (≤1000 tokens)
4. IF report truncated at 2500 tokens:
   - Report ends with: "[TRUNCATED - Request [CONTINUE] for more]"
   - Main agent sends: "[CONTINUE]"
   - Agent provides next segment

**Success Criteria** (Phase C):
- ✓ Agent supports [CLARIFY: question] requests
- ✓ Agent provides focused responses (≤1000t)
- ✓ Reports truncate at 2500t with marker
- ✓ Agent supports [CONTINUE] for truncated reports

**Results to Report**:
```
Test Scenario 3: Agent Clarification

Status: [PASS/FAIL]

Clarification Request:
- Request sent: [CLARIFY: question]
- Response received: [YES/NO]
- Response size: [tokens]
- Response quality: [Focused/Unclear]

Truncation Test:
- Report truncated: [YES/NO]
- Marker present: [YES/NO]
- Continue worked: [YES/NO]

Issues:
- [List any problems]
```

---

### Test Scenario 4: Rollback Procedure (Phase A Feature)

**Objective**: Verify rollback procedures work for Phase 4 failure

**Duration**: 20-30 minutes

**Prerequisites**: Phase A complete, complex project setup in progress

**User Prompt**:
```
I want to test the rollback procedure for Phase 4 (Design System).

Set up a complex Next.js project and proceed through Phases 1-3 normally.

When you reach Phase 4, simulate a failure after the design-ideator agent completes.

Then execute the Phase 4 rollback procedure and verify the project state is restored correctly.
```

**Expected Behavior**:
1. Phases 1-3 complete normally
2. Phase 4 starts, design-ideator agent completes
3. Simulated failure occurs
4. Rollback procedure executes:
   - Delete design-system.md
   - Delete tailwind.config.ts changes
   - Delete components.json changes
   - Keep Phase 1-3 deliverables intact
5. Project state restored to post-Phase 3

**Success Criteria** (Phase A):
- ✓ Rollback procedure documented in SKILL.md
- ✓ Rollback actually works when executed
- ✓ Phase 1-3 deliverables preserved
- ✓ Phase 4 artifacts removed
- ✓ Can retry Phase 4 after rollback

**Results to Report**:
```
Test Scenario 4: Rollback

Status: [PASS/FAIL]

Before Rollback:
- Files present: [list Phase 4 files]

Rollback Executed:
- Procedure found in SKILL.md: [YES/NO]
- Procedure executed: [YES/NO]
- Errors during rollback: [list any]

After Rollback:
- Phase 4 files removed: [YES/NO]
- Phase 1-3 files intact: [YES/NO]
- Project in valid state: [YES/NO]
- Can retry Phase 4: [YES/NO]

Issues:
- [List any problems]
```

---

### Test Scenario 5: Full Complex Path (End-to-End)

**Objective**: Complete end-to-end test of complex path with all improvements

**Duration**: 2-4 hours

**Prerequisites**: All phases (A-E) complete

**User Prompt**:
```
I want to build a complete Next.js SaaS application with the following requirements:

**Project**: Task Management SaaS (similar to Trello)

**Requirements**:
- Database: Supabase (PostgreSQL)
- Authentication: Email/password + OAuth (Google)
- Multi-tenant: Workspaces with team members
- Features:
  - User management
  - Workspace/board creation
  - Task lists and cards
  - Drag-and-drop interface
  - Real-time collaboration
  - File attachments
- Design: Modern, professional (dark mode support)
- Tech Stack: Next.js 14+, TypeScript, Tailwind CSS, Shadcn UI

Please set up the complete project using the nextjs-project-setup skill, following all 8 phases.
```

**Expected Behavior**:
1. Complexity assessment: COMPLEX PATH (all 6 indicators true)
2. User confirms complex path
3. Executes all 8 phases:
   - Phase 1: Foundation research (30 min)
   - Phase 2-3: Template selection + specification (45 min)
   - Phase 4-5: Design system + wireframes (1h 45min)
   - Phase 6-7: Implementation + QA (2-3 hours)
   - Phase 8: Documentation (30 min)
4. Progress indicators show after each phase
5. QA agent validates continuously during Phase 6-7
6. All deliverables created

**Success Criteria** (All phases):
- ✓ All 16 success metrics PASS (4 UX, 4 DX, 4 AI Agent, 4 Token)
- ✓ Complete project setup
- ✓ All tests passing
- ✓ Documentation comprehensive
- ✓ No critical issues

**Deliverables to Check**:
```bash
# Project structure
tree -L 2

# Should see:
# ├── app/
# ├── components/
# │   └── ui/
# ├── lib/
# ├── public/
# ├── docs/
# │   ├── architecture.md
# │   ├── product-spec.md
# │   ├── constitution.md
# │   ├── features.md
# │   ├── design-system.md
# │   ├── template-selection.md
# │   └── wireframes/
# ├── reports/
# │   └── foundation-research.md
# ├── CLAUDE.md
# ├── README.md
# ├── package.json
# ├── tailwind.config.ts
# ├── components.json
# └── ... (other Next.js files)

# Check tests exist and pass
npm test

# Check build succeeds
npm run build

# Check Supabase integration
cat .env.local
# Should have: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# Check documentation
cat CLAUDE.md
# Should be comprehensive (following template)
```

**16 Success Metrics Checklist**:

**UX Metrics**:
- [ ] Simple path completes without errors
- [ ] Complex path decision is clear
- [ ] No missing file errors
- [ ] Visual progress indicators present

**DX Metrics**:
- [ ] Documentation has clear rationale
- [ ] Templates are consistent
- [ ] Phase docs consolidated (7 → 4)
- [ ] No broken @ references

**AI Agent Metrics**:
- [ ] Agent follows flows without confusion
- [ ] Agent requests clarification when needed
- [ ] Agent coordinates parallel execution
- [ ] Agent respects token limits

**Token Efficiency Metrics**:
- [ ] Import depth limited to 5 levels
- [ ] Agent reports ≤2500 tokens
- [ ] Progressive disclosure budget documented
- [ ] Cleanup strategy implemented

**Results to Report**:
```
Test Scenario 5: Full Complex Path

Status: [PASS/FAIL]

Phase Completion:
- [ ] Phase 1: Foundation Research
- [ ] Phase 2-3: Template + Specification
- [ ] Phase 4-5: Design + Wireframes
- [ ] Phase 6-7: Implementation + QA
- [ ] Phase 8: Documentation

Time Taken:
- Total duration: [hours:minutes]
- Expected: 2-4 hours
- Variance: [+/- minutes]

Token Usage:
- Phase 1: ~1,500 tokens
- Total estimated: [tokens]
- Efficiency vs baseline: [%]

16 Success Metrics:
[Paste checklist above with ✓ or ✗ for each]

Issues Encountered:
- [List all issues]

Deliverables Missing:
- [List any missing files or incomplete features]

Quality Assessment:
- Tests passing: [YES/NO, count]
- Build successful: [YES/NO]
- Documentation complete: [YES/NO]
- Ready for production: [YES/NO]

Recommendations:
- [Any improvements needed]
```

---

## Part 3: Assessment Criteria

### How to Interpret Results

**PASS Criteria**:
- All critical success criteria met (no ✗ on critical items)
- Workflow completes without blocking errors
- Deliverables exist and are functional
- Token efficiency improvements realized

**FAIL Criteria**:
- Blocking errors prevent completion
- Critical deliverables missing
- No improvement over baseline (or regression)
- Success metrics show <80% pass rate

**Needs Improvement**:
- Workflow completes but with warnings
- Some deliverables incomplete
- Token efficiency gains but less than target
- Success metrics 80-95% pass rate

### Reporting Template

For each test scenario, provide results using this format:

```markdown
## Test Results: [Scenario Name]

**Date**: [YYYY-MM-DD HH:MM]
**Tester**: [Your name or "AI Agent"]
**Phase Completion Status**: [A/B/C/D/E/F complete]

### Status: [PASS / FAIL / NEEDS IMPROVEMENT]

### Detailed Results

**Success Criteria Met**: [X/Y]
- [List each criterion with ✓ or ✗]

**Issues Encountered**:
1. [Issue 1 with severity: CRITICAL / MAJOR / MINOR]
2. [Issue 2...]

**Deliverables Status**:
- [Deliverable 1]: [EXISTS / MISSING / INCOMPLETE]
- [Deliverable 2]: ...

**Performance Metrics**:
- Duration: [actual] vs [expected]
- Token usage: [actual] vs [expected]
- Efficiency gain: [%]

### Evidence

**Files Created**:
```
[Paste ls -la output of key directories]
```

**Error Logs** (if any):
```
[Paste error messages]
```

**Screenshots** (optional):
- [Attach screenshots if helpful]

### Recommendations

**For Iteration 2**:
- [Recommendation 1]
- [Recommendation 2]

**Immediate Fixes Needed**:
- [Fix 1 with severity]
- [Fix 2...]
```

---

## Part 4: Testing Phases by Implementation Phase

### After Phase A Complete

**Run**:
- Test Scenario 1 (Simple Path - Basic)
- Test Scenario 2 (Complex Path Phase 1 Only)
- Test Scenario 4 (Rollback - Phase A feature)

**Focus**: Verify critical infrastructure fixes

### After Phase B Complete

**Run**:
- Test Scenario 1 (verify decision tree used)
- Test Scenario 2 (verify optional component logic)

**Focus**: Verify flow clarity improvements

### After Phase C Complete

**Run**:
- Test Scenario 3 (Agent Clarification Protocol)
- Test Scenario 2 (verify agent coordination)

**Focus**: Verify agent coordination protocol

### After Phase D Complete

**Run**:
- Test Scenario 2 (verify consolidated docs)
- Test Scenario 5 (if time permits, full path)

**Focus**: Verify documentation improvements

### After Phase E Complete

**Run**:
- Test Scenario 2 (verify depth limits, truncation)
- Test Scenario 5 (verify progressive disclosure budget)

**Focus**: Verify progressive disclosure guards

### After Phase F (Full Validation)

**Run**:
- Test Scenario 1 (full simple path)
- Test Scenario 5 (full complex path)
- Test Scenario 4 (rollback from any phase)
- Measure all 16 success metrics
- Create ITERATION-1-VALIDATION-REPORT.md

**Focus**: Complete end-to-end validation

---

## Part 5: Quick Test Commands

### One-Line Test Commands

```bash
# Test 1: Simple path (blog)
echo "Set up a simple Next.js blog. No database, no auth, simple design." | claude-code

# Test 2: Complex Phase 1 only
echo "Set up complex Next.js SaaS with database (Supabase), auth, multi-tenant. Stop after Phase 1 research." | claude-code

# Test 3: Verify /reports/ exists (Phase A)
ls -la reports/ && cat reports/README.md

# Test 4: Verify 3 agents only (not 7)
ls -la .claude/agents/nextjs-* | wc -l  # Should output: 3

# Test 5: Verify phase docs consolidated (Phase D)
ls -la .claude/skills/nextjs-project-setup/docs/complex/ | wc -l  # Should output: 4 (down from 7)

# Test 6: Check SKILL.md for rollback procedures (Phase A)
grep -n "Rollback" .claude/skills/nextjs-project-setup/SKILL.md

# Test 7: Check for import depth enforcement (Phase E)
grep -n "max_depth: 5" .claude/skills/nextjs-project-setup/SKILL.md
```

---

## Part 6: Troubleshooting

### Common Issues

**Issue**: Claude Code doesn't trigger nextjs-project-setup skill

**Solution**:
- Ensure SKILL.md is in `.claude/skills/nextjs-project-setup/SKILL.md`
- Check YAML frontmatter is valid
- Use explicit trigger: "Use the nextjs-project-setup skill to..."

---

**Issue**: /reports/ directory missing error

**Solution**:
- Phase A not complete yet
- Manually create: `mkdir reports && touch reports/README.md`
- Or wait for Phase A implementation

---

**Issue**: Too many agents (7 instead of 3)

**Solution**:
- Old agents not deleted
- Manually delete: `rm .claude/agents/nextjs-research-*.md`
- Verify 3 remain: design-ideator, qa-validator, doc-auditor

---

**Issue**: Phase docs not consolidated

**Solution**:
- Phase D not complete yet
- Should see 4 files in `docs/complex/` not 7
- Check: `ls .claude/skills/nextjs-project-setup/docs/complex/`

---

## Part 7: AI Agent Assessment Guide

When AI agent receives test results, assess using this framework:

```python
def assess_test_results(results):
    """
    Assess test results and determine next actions
    """

    # Parse results
    success_criteria_met = results['success_criteria_met']
    total_criteria = results['total_criteria']
    issues = results['issues']
    deliverables_status = results['deliverables']

    # Calculate pass rate
    pass_rate = success_criteria_met / total_criteria

    # Determine status
    if pass_rate >= 0.95 and len([i for i in issues if i['severity'] == 'CRITICAL']) == 0:
        status = "PASS"
        action = "Proceed to next phase"
    elif pass_rate >= 0.80:
        status = "NEEDS_IMPROVEMENT"
        action = "Fix identified issues before proceeding"
    else:
        status = "FAIL"
        action = "Stop and address critical issues"

    # Analyze issues by category
    infrastructure_issues = [i for i in issues if 'infrastructure' in i['category']]
    flow_issues = [i for i in issues if 'flow' in i['category']]
    agent_issues = [i for i in issues if 'agent' in i['category']]
    doc_issues = [i for i in issues if 'documentation' in i['category']]
    token_issues = [i for i in issues if 'token' in i['category']]

    # Generate recommendations
    recommendations = []
    if infrastructure_issues:
        recommendations.append(f"Fix {len(infrastructure_issues)} infrastructure issues in Phase A")
    if flow_issues:
        recommendations.append(f"Address {len(flow_issues)} flow clarity issues in Phase B")
    # ... etc for other categories

    return {
        'status': status,
        'pass_rate': pass_rate,
        'action': action,
        'recommendations': recommendations,
        'critical_issues': [i for i in issues if i['severity'] == 'CRITICAL'],
        'proceed_to_iteration_2': pass_rate >= 0.95
    }
```

---

## Summary

**Testing Flow**:
1. Set up test environment (Part 1)
2. Run appropriate test scenarios (Part 2) based on phase completion
3. Report results using templates (Part 3)
4. AI agent assesses results (Part 7)
5. Fix issues or proceed to next phase
6. After Phase F, create Iteration 1 validation report

**Key Principles**:
- Test incrementally after each phase
- Focus on success criteria for that phase
- Document all issues with severity
- Measure token efficiency improvements
- Validate against baseline (before improvements)

**Ultimate Goal**: All 16 success metrics PASS by end of Phase F

---

**Testing Protocol Version**: 1.0
**Last Updated**: 2025-10-30
**Next Review**: After Phase F completion