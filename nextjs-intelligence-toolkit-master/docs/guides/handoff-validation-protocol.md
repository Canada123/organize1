# Agent Handoff Validation Protocol

**Purpose**: Ensure agent reports meet quality standards before being accepted by the main workflow, preventing malformed reports from blocking execution.

**Version**: 1.0.0
**Status**: ACTIVE
**Target Audience**: AI agents producing reports for main workflow consumption

---

## Overview

This protocol defines validation requirements for all agent-generated reports and handoff documents.

**Problem**: Malformed reports (missing sections, excessive length, no evidence) can block workflows or provide insufficient information for decision-making.

**Solution**: Mandatory validation checks before reports are accepted, with automatic rejection of invalid reports.

---

## Validation Model (CoD^Σ)

```
Report_Validation :=
  Structural_Validation
    ∧ Token_Validation
    ∧ Content_Validation
    ∧ Evidence_Validation
    → Valid_Report ∨ Rejection_With_Errors

Rejection_Flow := validation_failure → generate_error_report → agent_retry_with_fixes
```

---

## Validation Requirements

### 1. Structural Validation

**Required Sections** (all reports MUST have):

```markdown
# [Report Title]
**Generated**: [ISO 8601 timestamp]
**Agent**: [agent-name]
**Feature/Task**: [feature-id or task-id]

---

## Summary (2-3 sentences)
[Key findings or recommendations]

---

## [Main Content Section]
[Primary findings, analysis, or results]

---

## Recommendations
[Actionable recommendations or next steps]

---

## Evidence (CoD^Σ)
[File:line references, MCP query results, traced reasoning]
```

**Validation Checks**:
- ✅ Title present and descriptive
- ✅ Generated timestamp in ISO 8601 format
- ✅ Agent name matches executing agent
- ✅ Feature/Task ID provided
- ✅ Summary section exists and ≤ 500 characters
- ✅ Main content section exists
- ✅ Recommendations section exists
- ✅ Evidence section exists with at least 1 reference

**Validation Script** (to be run before accepting report):

```bash
#!/bin/bash
# validate-report.sh

REPORT_FILE=$1

# Check required sections
required_sections=(
  "# "
  "**Generated**:"
  "**Agent**:"
  "## Summary"
  "## Recommendations"
  "## Evidence"
)

for section in "${required_sections[@]}"; do
  if ! grep -q "$section" "$REPORT_FILE"; then
    echo "ERROR: Missing required section: $section"
    exit 1
  fi
done

echo "✓ Structural validation passed"
```

### 2. Token Validation

**Token Limits** (strictly enforced):

| Report Type | Maximum Tokens | Reasoning |
|-------------|----------------|-----------|
| Agent Reports | 2500 tokens | Main workflow readability |
| Handover Documents | 600 tokens | Context transfer efficiency |
| Clarification Requests | 200 tokens | Focused questions only |
| Clarification Answers | 1000 tokens | Sufficient detail |
| Continuation Responses | 1500 tokens | Additional details on-demand |

**Validation Script**:

```bash
#!/bin/bash
# validate-tokens.sh

REPORT_FILE=$1
MAX_TOKENS=$2  # e.g., 2500 for agent reports

# Estimate tokens (rough: 4 chars = 1 token)
char_count=$(wc -c < "$REPORT_FILE")
estimated_tokens=$((char_count / 4))

if [ $estimated_tokens -gt $MAX_TOKENS ]; then
  echo "ERROR: Report exceeds token limit"
  echo "  Estimated: $estimated_tokens tokens"
  echo "  Maximum: $MAX_TOKENS tokens"
  echo "  Excess: $((estimated_tokens - MAX_TOKENS)) tokens"
  exit 1
fi

echo "✓ Token validation passed ($estimated_tokens / $MAX_TOKENS tokens)"
```

**Token Budget Breakdown**:

```
Agent_Report (≤2500 tokens) := {
  Header: ~50 tokens,
  Summary: ~200 tokens,
  Main_Content: ~1500 tokens,
  Recommendations: ~400 tokens,
  Evidence: ~350 tokens
}

If exceeded → Truncate main content → Add [TRUNCATED] marker → Require [CONTINUE] request
```

### 3. Content Validation

**Summary Requirements**:
- ✅ 2-3 sentences (no more, no less)
- ✅ Answers: "What did this agent do and what's the key result?"
- ✅ No implementation details (save for main content)
- ✅ No jargon without definition

**Example - Good Summary**:
```markdown
## Summary
Analyzed authentication implementation and identified 3 critical security issues:
missing CSRF protection on login endpoint, weak password policy (min 6 chars),
and session tokens stored in localStorage. Recommend implementing CSRF tokens,
increasing password minimum to 12 chars, and migrating to httpOnly cookies.
```

**Example - Bad Summary**:
```markdown
## Summary
I looked at the auth code and there's some problems. The CSRF thing isn't there
and passwords are too short and we're using localStorage which is bad for security.
You should probably fix these things because they're important for keeping users safe.
```

**Recommendations Requirements**:
- ✅ Actionable (specify exact next steps)
- ✅ Prioritized (P1, P2, P3 if multiple)
- ✅ Estimated effort (if applicable)
- ✅ No vague suggestions ("improve security" → "Add CSRF token validation to login endpoint")

**Validation Checks**:

```python
def validate_content(report):
    # Summary check
    summary = extract_section(report, "## Summary")
    sentences = summary.split('. ')
    if not (2 <= len(sentences) <= 3):
        return ValidationError("Summary must be 2-3 sentences")

    # Recommendations check
    recommendations = extract_section(report, "## Recommendations")
    if not recommendations or len(recommendations.strip()) < 100:
        return ValidationError("Recommendations too short or missing")

    # Check for actionable recommendations
    action_verbs = ["implement", "add", "remove", "update", "fix", "create", "migrate"]
    if not any(verb in recommendations.lower() for verb in action_verbs):
        return ValidationError("Recommendations not actionable (no action verbs found)")

    return ValidationSuccess()
```

### 4. Evidence Validation

**Constitution Article II Compliance**:
All claims MUST have traceable evidence in CoD^Σ format.

**Required Evidence Types** (at least 1):
- ✅ File:line references (e.g., `auth.ts:45-52`)
- ✅ MCP query results with timestamps
- ✅ Intelligence query outputs (project-intel.mjs)
- ✅ Test execution results with exit codes
- ✅ Compiler/linter error messages
- ✅ Git history and diffs

**Evidence Format Requirements**:

```markdown
## Evidence (CoD^Σ)

### Finding 1: Missing CSRF protection
**Claim**: Login endpoint lacks CSRF token validation
**Evidence**:
  - File: app/actions/auth.ts:23-45 (signIn function)
  - Grep result: No matches for "csrf|CSRF" in app/actions/
  - Constitution: Article II.1 (evidence-based reasoning)
**Reasoning**:
  signIn@auth.ts:23 ∘ no_csrf_check@auth.ts:30 → vulnerability

### Finding 2: Weak password policy
**Claim**: Password minimum length is 6 characters
**Evidence**:
  - File: lib/validation.ts:12 (PASSWORD_MIN_LENGTH = 6)
  - Test: validation.test.ts:45 (validates 6-char passwords pass)
**Reasoning**:
  validation.ts:12 → PASSWORD_MIN_LENGTH=6 < OWASP_recommended(12)
```

**Validation Script**:

```bash
#!/bin/bash
# validate-evidence.sh

REPORT_FILE=$1

# Check for Evidence section
if ! grep -q "## Evidence" "$REPORT_FILE"; then
  echo "ERROR: Missing Evidence section"
  exit 1
fi

# Check for at least one file reference
if ! grep -qE "[a-zA-Z0-9_-]+\.(ts|tsx|js|jsx|md):[0-9]+" "$REPORT_FILE"; then
  echo "ERROR: No file:line references found in Evidence section"
  exit 1
fi

# Check for CoD^Σ reasoning (presence of operators)
cod_operators=("∘" "⊕" "→" "⇄" "∥" "≫")
operator_found=false
for op in "${cod_operators[@]}"; do
  if grep -q "$op" "$REPORT_FILE"; then
    operator_found=true
    break
  fi
done

if ! $operator_found; then
  echo "WARNING: No CoD^Σ operators found (consider adding reasoning traces)"
fi

echo "✓ Evidence validation passed"
```

**Anti-Patterns** (automatic rejection):
- ❌ "Probably", "should be", "likely" without evidence
- ❌ References to non-existent files
- ❌ Assumptions marked as facts
- ❌ Empty Evidence section
- ❌ Generic statements without specific file references

---

## Validation Workflow

### Step 1: Agent Generates Report

```markdown
# QA Validation Report
**Generated**: 2025-10-30T14:30:00Z
**Agent**: nextjs-qa-validator
**Feature**: P2_user_profile

---

## Summary
Validation complete with 95% tests passing (38/40). Two critical failures:
Stripe webhook endpoint returns 404, SMTP credentials not configured for email
notifications. Recommend fixing webhook routing and adding SMTP env vars.

---

## Functional Tests: 95% passing (38/40)
...
[detailed results]
...

---

## Recommendations
1. [P1] Fix Stripe webhook routing in app/api/webhooks/stripe/route.ts (add POST handler)
2. [P1] Add SMTP credentials to .env.local (SMTP_HOST, SMTP_USER, SMTP_PASS)
3. [P2] Add E2E tests for checkout flow using Playwright

---

## Evidence (CoD^Σ)
### Stripe webhook failure
**Claim**: Webhook endpoint returns 404
**Evidence**:
  - Test output: stripe-webhook.test.ts:23 (POST /api/webhooks/stripe → 404)
  - File: app/api/webhooks/stripe/route.ts:1 (exports only GET handler)
**Reasoning**:
  test@stripe-webhook.test.ts:23 → POST_request ∘ route.ts@GET_only → 404_error
```

### Step 2: Validation Execution

```bash
# Run all validation checks
./validate-report.sh /reports/qa-validator-report-20251030-1430.md

# Check 1: Structure
✓ Structural validation passed

# Check 2: Tokens
✓ Token validation passed (2,341 / 2,500 tokens)

# Check 3: Content
✓ Summary: 2 sentences
✓ Recommendations: 3 actionable items found

# Check 4: Evidence
✓ Evidence section present
✓ File references: 2 found
✓ CoD^Σ operators: 3 found (∘, →)

VALIDATION RESULT: PASS ✅
```

### Step 3: Main Workflow Acceptance

```
Main_Agent_Workflow :=
  Receive_Report_Notification
    → Run_Validation_Script
    → IF validation_pass THEN
        Read_Report
        ∘ Extract_Recommendations
        ∘ Continue_Workflow
      ELSE
        Generate_Rejection_Report
        ∘ Notify_Agent_With_Errors
        ∘ Request_Retry
```

### Step 4: Rejection Handling (if validation fails)

**Rejection Report Format**:

```markdown
# Report Validation Failed

**Report**: /reports/qa-validator-report-20251030-1430.md
**Agent**: nextjs-qa-validator
**Timestamp**: 2025-10-30T14:35:00Z

---

## Validation Errors

### ERROR: Token limit exceeded
- Maximum: 2,500 tokens
- Actual: 3,200 tokens
- Excess: 700 tokens
- **Fix**: Reduce main content section or use [CONTINUE] protocol for details

### WARNING: Missing CoD^Σ reasoning
- Evidence section has file references but no reasoning traces
- **Fix**: Add CoD^Σ operators (∘, →, etc.) to show reasoning flow

---

## Required Actions

1. Reduce report length by 700 tokens (remove verbose details, keep summary focused)
2. Add CoD^Σ reasoning traces to Evidence section
3. Regenerate report and resubmit for validation

---

## Retry Instructions

Regenerate report with fixes applied, then signal completion:
```bash
# After fixes
touch /tmp/report-ready-for-validation.signal
```
```

**Agent Response**:
```
Agent receives rejection → Applies fixes → Regenerates report → Resubmits for validation
```

---

## Integration with Existing Protocols

### Handover Protocol Integration

**Update to handover.md template**:

Add validation checklist before handover:

```markdown
## Pre-Handover Validation

**Validation Script**: `./validate-report.sh [report-file] [max-tokens]`

**Checklist**:
- [ ] Structural validation: PASS
- [ ] Token validation: [X] / 2500 tokens
- [ ] Content validation: PASS
- [ ] Evidence validation: PASS

**If any validation fails**: Do NOT proceed with handover. Fix errors and retry.

**Validation Log**: [attach validation script output]
```

### Clarification Protocol Integration

**Validation for clarification requests** (≤200 tokens):

```bash
# Validate clarification request
./validate-tokens.sh /reports/clarification-request.md 200

# Additional checks
grep -q "\[CLARIFY:" /reports/clarification-request.md || echo "ERROR: Missing [CLARIFY:] marker"
grep -q "Options:" /reports/clarification-request.md || echo "WARNING: No options provided"
```

---

## Validation Script Suite

### Master Validation Script

**Location**: `/scripts/validate-agent-report.sh`

```bash
#!/bin/bash
# validate-agent-report.sh
# Master validation script for agent reports

set -e

REPORT_FILE=$1
REPORT_TYPE=${2:-"agent"}  # agent, handover, clarification

# Token limits by type
declare -A TOKEN_LIMITS
TOKEN_LIMITS[agent]=2500
TOKEN_LIMITS[handover]=600
TOKEN_LIMITS[clarification]=200

MAX_TOKENS=${TOKEN_LIMITS[$REPORT_TYPE]}

echo "Validating $REPORT_TYPE report: $REPORT_FILE"
echo "Max tokens: $MAX_TOKENS"
echo ""

# 1. Structural validation
echo "Running structural validation..."
bash scripts/validate-structure.sh "$REPORT_FILE" "$REPORT_TYPE"

# 2. Token validation
echo "Running token validation..."
bash scripts/validate-tokens.sh "$REPORT_FILE" "$MAX_TOKENS"

# 3. Content validation
echo "Running content validation..."
bash scripts/validate-content.sh "$REPORT_FILE"

# 4. Evidence validation
echo "Running evidence validation..."
bash scripts/validate-evidence.sh "$REPORT_FILE"

echo ""
echo "=========================="
echo "VALIDATION RESULT: PASS ✅"
echo "=========================="
```

### Usage Examples

```bash
# Validate agent report
./scripts/validate-agent-report.sh /reports/qa-validator-report.md agent

# Validate handover document
./scripts/validate-agent-report.sh /reports/handover-analyzer-to-planner.md handover

# Validate clarification request
./scripts/validate-agent-report.sh /reports/clarification-request.md clarification
```

---

## Automated Validation Integration

### Pre-Commit Hook (Optional)

**Location**: `.git/hooks/pre-commit`

```bash
#!/bin/bash
# Validate all new/modified reports before commit

REPORTS=$(git diff --cached --name-only | grep "reports/.*\.md$")

if [ -z "$REPORTS" ]; then
  exit 0  # No reports to validate
fi

echo "Validating agent reports..."

for report in $REPORTS; do
  if [ -f "$report" ]; then
    # Detect report type from content
    if grep -q "**Agent**:" "$report"; then
      TYPE="agent"
    elif grep -q "\[CLARIFY:" "$report"; then
      TYPE="clarification"
    else
      TYPE="handover"
    fi

    ./scripts/validate-agent-report.sh "$report" "$TYPE" || {
      echo "Validation failed for: $report"
      echo "Fix errors and try again"
      exit 1
    }
  fi
done

echo "All reports validated successfully"
```

### Continuous Validation (Optional)

**Watch for new reports**:

```bash
#!/bin/bash
# watch-reports.sh
# Continuously monitor /reports/ for new files and validate

inotifywait -m /reports -e create -e modify |
  while read path action file; do
    if [[ "$file" =~ \.md$ ]]; then
      echo "New report detected: $file"
      ./scripts/validate-agent-report.sh "/reports/$file" agent || {
        echo "VALIDATION FAILED: $file"
        # Generate rejection report
        bash scripts/generate-rejection-report.sh "/reports/$file"
      }
    fi
  done
```

---

## Quality Metrics

**Track validation success rate**:

```bash
# Log validation results
LOG_FILE=/tmp/validation-metrics.log

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ),${REPORT_FILE},${REPORT_TYPE},PASS" >> $LOG_FILE

# Calculate success rate
total=$(wc -l < $LOG_FILE)
passed=$(grep -c ",PASS" $LOG_FILE)
rate=$((passed * 100 / total))
echo "Validation success rate: $rate% ($passed/$total)"
```

**Target Metrics**:
- ✅ 95%+ validation pass rate (first submission)
- ✅ <5% token limit violations
- ✅ 100% evidence requirement compliance
- ✅ <1% structural violations

---

## Troubleshooting

### Common Validation Failures

**1. Token limit exceeded**
```
ERROR: Report exceeds token limit
  Estimated: 3,200 tokens
  Maximum: 2,500 tokens
  Excess: 700 tokens
```
**Fix**: Reduce main content verbosity, move details to continuation protocol

**2. Missing Evidence section**
```
ERROR: Missing required section: ## Evidence
```
**Fix**: Add Evidence section with file:line references and CoD^Σ reasoning

**3. Summary too long**
```
ERROR: Summary must be 2-3 sentences
  Found: 5 sentences
```
**Fix**: Condense summary to 2-3 sentences, move details to main content

**4. No actionable recommendations**
```
ERROR: Recommendations not actionable (no action verbs found)
```
**Fix**: Rewrite recommendations with action verbs (implement, add, fix, etc.)

---

## Success Criteria

**Handoff validation is successful when**:
- ✅ All agent reports pass validation before acceptance
- ✅ <5% reports require retry after rejection
- ✅ Validation runs in <1 second per report
- ✅ Clear error messages guide agents to fix issues
- ✅ No workflow blocked by malformed reports

---

## References

- **Constitution**: @.claude/shared-imports/constitution.md (Article II: Evidence-Based Reasoning)
- **Handover Protocol**: @.claude/templates/handover.md
- **Clarification Protocol**: @.claude/agents/nextjs-design-ideator.md (Agent Clarification Protocol section)
- **Report Templates**: @.claude/templates/report.md, @.claude/templates/verification-report.md

---

**Protocol Status**: ACTIVE
**Last Updated**: 2025-10-30
**Version**: 1.0.0
