# F1 Quick Start Guide: Simple Path Test Execution

**Test Environment**: Ready ✅
**Location**: `/Users/yangsim/Nanoleq/sideProjects/nextjs-test-simple`
**Duration**: 15-30 minutes
**Purpose**: Validate simple path completes without errors after Phase A-E improvements

---

## Step 1: Navigate to Test Environment

```bash
cd /Users/yangsim/Nanoleq/sideProjects/nextjs-test-simple
```

---

## Step 2: Provide Test Prompt to Claude Code

**Copy and paste this EXACT prompt:**

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

---

## Step 3: Observe Skill Execution

### Critical Checkpoints (Phase A-E Validation)

**✅ Phase A1 Fix**: Watch for `/reports/` directory creation - should NOT error with "directory missing"

**✅ Phase B1 Fix**: Complexity assessment should show explicit decision:
```
[DECISION] Complexity Assessment
Simple indicators: 1 true
→ SIMPLE PATH
```

**✅ Phase B4 Fix**: Visual progress indicators should appear:
```
[██░░░░░░] 12.5% (Step 1/5)
[████░░░░] 25.0% (Step 2/5)
...etc
```

**✅ Workflow Completion**: All 5 steps should execute:
1. Template selection
2. Setup
3. Core components (Shadcn)
4. Basic design (Tailwind)
5. Documentation

---

## Step 4: Verify Deliverables

After skill completes, run these commands:

```bash
# 1. Verify project structure
ls -la

# Expected output should include:
# - package.json
# - next.config.js
# - tailwind.config.ts
# - components.json
# - app/
# - components/ui/
# - README.md
# - CLAUDE.md

# 2. Verify Shadcn components
ls -la components/ui/

# Expected: button, card, separator (minimum)

# 3. Verify documentation
cat CLAUDE.md

# Should have: Overview, Tech Stack, Development, Conventions sections
```

---

## Step 5: Record Results

Fill out the results file in the test directory:

```bash
# The results file is IN YOUR TEST DIRECTORY (same session)
# Location: ./F1-TEST-RESULTS.md

# Edit it during your test session
code F1-TEST-RESULTS.md
# OR
nano F1-TEST-RESULTS.md
```

**Important**: The results file is located IN the test directory so you can fill it out during the same Claude Code session where the test runs.

### Quick Pass/Fail Criteria

**PASS if ALL true**:
- ✅ No error about missing `/reports/` directory
- ✅ Complexity assessment was explicit
- ✅ Visual progress indicators displayed
- ✅ All 5 steps completed
- ✅ All expected deliverables present
- ✅ No blocking errors

**FAIL if ANY true**:
- ❌ Missing `/reports/` directory error
- ❌ Workflow crashed or couldn't complete
- ❌ Critical deliverables missing (package.json, CLAUDE.md, etc.)

**NEEDS IMPROVEMENT if**:
- ⚠️ Workflow completed but with warnings
- ⚠️ Some deliverables incomplete
- ⚠️ Non-blocking issues encountered

---

## Step 6: Report Back

After test completes, copy results to main project:

```bash
# Copy from test directory to main project
cp /Users/yangsim/Nanoleq/sideProjects/nextjs-test-simple/F1-TEST-RESULTS.md \
   /Users/yangsim/Nanoleq/sideProjects/set-up-new-nextjs-project/
```

Then navigate back to main project and share:
1. F1-TEST-RESULTS.md (copied from test directory)
2. Any error messages or logs
3. Overall assessment: PASS / FAIL / NEEDS IMPROVEMENT

---

## If Test Passes

Next steps:
- F2: Complex path test (2-4 hours)
- F3: Rollback test (20-30 minutes)
- F5: Token usage measurement

---

## If Test Fails

Required actions:
1. Document all failures in results template
2. Identify which phase improvement failed (A1, B1, B4, etc.)
3. Review corresponding SKILL.md sections
4. Fix issues before proceeding to F2

---

## Troubleshooting

**Issue**: Skill doesn't auto-trigger
**Solution**: Use explicit phrase: "Use the nextjs-project-setup skill to..."

**Issue**: Missing dependencies error
**Solution**: Ensure Node.js 18+ installed, npm accessible

**Issue**: Permission errors
**Solution**: Check file permissions in test directory

**Issue**: Git errors during execution
**Solution**: Git initialized in test environment ✅ (already done)

---

**Quick Start Complete** - You're ready to run F1!
