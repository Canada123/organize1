# Verification Methods for AI Board Reasoning

Comprehensive validation approaches to ensure accuracy and reliability of AI Board responses. Apply these methods based on task complexity and accuracy requirements.

---

## Verification Hierarchy

Apply verification layers based on complexity and consequences:

**Simple tasks:** Sanity check only
**Moderate tasks:** Logic validation + sanity check
**Complex tasks:** Multi-method validation + cross-perspective check
**Expert tasks:** Full validation stack with all applicable methods

---

## Layer 1: Logic & Consistency Validation

### Method: Logical Soundness Check

**What to verify:**
1. **Premises are stated clearly**
   - All assumptions explicit
   - No hidden premises

2. **Conclusions follow from premises**
   - Each step justified
   - No logical leaps
   - Valid inference rules used

3. **No logical fallacies**
   - No circular reasoning
   - No strawman arguments
   - No false dichotomies
   - No equivocation (shifting definitions)
   - No ad hominem
   - No appeal to authority (unless appropriate)

**Verification template:**
```
Argument structure:
P1: [premise 1]
P2: [premise 2]
...
C: [conclusion]

Validity check:
□ Does C logically follow from premises?
□ Are all premises true/supported?
□ Are there hidden assumptions?
□ What fallacies might be present?
```

**Example:**
```
Claim: "All humans are mortal. Socrates is human. Therefore Socrates is mortal."

Validation:
✓ P1 (all humans mortal) - supported
✓ P2 (Socrates human) - supported
✓ Valid syllogism structure
✓ Conclusion follows necessarily
✓ No fallacies detected

VERIFIED: Logically sound
```

---

### Method: Internal Consistency Check

**What to verify:**
1. **No contradictions within the response**
   - Statement X doesn't contradict statement Y
   - Definitions used consistently
   - Numbers/facts don't conflict

2. **Consistent framework application**
   - Same principles applied throughout
   - No cherry-picking

3. **Terminology stable**
   - Terms mean the same thing throughout
   - No equivocation

**Verification template:**
```
Consistency audit:
□ Check all factual claims against each other
□ Verify numbers/calculations consistent
□ Ensure terminology usage stable
□ Confirm principles applied uniformly

Contradictions found: [list or "none"]
Resolution: [how to fix]
```

---

## Layer 2: Factual Verification

### Method: External Knowledge Validation

**For factual claims that can be verified:**

1. **Check against known facts**
   - Historical dates and events
   - Scientific facts and laws
   - Mathematical truths
   - Established definitions

2. **Identify uncertainty**
   - Distinguish certain from probable from speculative
   - Note confidence levels

3. **Flag unverifiable claims**
   - Mark speculative statements
   - Note when evidence is weak

**Verification template:**
```
Fact: [claim to verify]

Knowledge check:
□ Is this within established knowledge?
□ Confidence level: Certain / Probable / Speculative
□ If uncertain, what would confirm/refute?

Sources that would support: [list]
Contradictory information: [if any]

VERDICT: Verified / Probable / Uncertain / Contradicted
```

**Example:**
```
Fact: "The speed of light is approximately 299,792,458 meters per second."

Verification:
✓ Within established knowledge (physics)
✓ Confidence: Certain (precisely measured)
✓ Matches known constant 'c'

VERDICT: Verified
```

---

### Method: Chain of Verification (CoVe)

**For hallucination-prone responses:**

**Process:**
1. Generate baseline response
2. Extract verifiable claims
3. Create verification questions for each claim
4. Answer verification questions independently
5. Check for consistency
6. Revise if discrepancies found

**Template:**
```
Baseline response: [initial answer]

Extracted claims:
1. [claim 1]
2. [claim 2]
3. [claim 3]

Verification questions:
Q1: [verification for claim 1]
Q2: [verification for claim 2]
Q3: [verification for claim 3]

Independent verification:
A1: [answer - does it match claim 1?]
A2: [answer - does it match claim 2?]
A3: [answer - does it match claim 3?]

Discrepancies: [list any mismatches]

Revised response: [corrected version]
```

**When to use:**
- List-based questions (easy to miss items)
- Long-form generation
- Factual QA where accuracy critical
- Historical or biographical information

---

## Layer 3: Mathematical & Computational Verification

### Method: Independent Recalculation

**For any mathematical or numerical claims:**

1. **Identify all calculations**
2. **Recalculate independently** (don't just check - actually compute)
3. **Verify each step**
4. **Check arithmetic**

**Template:**
```
Original calculation:
[calculation as presented]

Independent recalculation:
[redo from scratch]

Comparison:
Original result: [X]
Verified result: [Y]
Match: Yes / No

If no match:
Error location: [where]
Correct result: [correct value]
```

**Example:**
```
Claim: "Average of 15, 23, 31 is 24"

Verification:
Independent calculation:
(15 + 23 + 31) / 3
= 69 / 3
= 23

Original: 24
Verified: 23
Match: NO

CORRECTED: The average is 23, not 24
```

---

### Method: Dimensional Analysis

**For physics and engineering problems:**

1. **Check units throughout**
2. **Verify dimensional consistency**
3. **Confirm final units match expectation**

**Template:**
```
Quantity: [what's being calculated]
Expected units: [should be]

Calculation with units:
[equation with units shown]

Final units: [result]

Dimensional check:
□ Units consistent throughout?
□ Final units match expected?
□ Conversions correct?

VERDICT: Dimensionally consistent / Error found
```

**Example:**
```
Problem: "Force = mass × acceleration"
Mass = 5 kg, Acceleration = 2 m/s²

Calculation:
F = 5 kg × 2 m/s²
F = 10 kg⋅m/s²
F = 10 N ✓

Expected units: Newtons (kg⋅m/s²)
Final units: Newtons
VERDICT: Dimensionally consistent ✓
```

---

### Method: Boundary & Edge Case Testing

**For algorithms, code, or mathematical solutions:**

1. **Test extreme values**
   - n = 0
   - n = 1
   - Very large n
   - Negative numbers
   - Empty input

2. **Test special cases**
   - Null/undefined
   - Maximum values
   - Minimum values

**Template:**
```
Solution: [algorithm or formula]

Edge cases to test:
□ n = 0: Result = [?], Expected = [?], Match = [Y/N]
□ n = 1: Result = [?], Expected = [?], Match = [Y/N]
□ Large n: Result = [?], Expected = [?], Match = [Y/N]
□ Negative: Result = [?], Expected = [?], Match = [Y/N]
□ Empty: Result = [?], Expected = [?], Match = [Y/N]

Edge cases passed: [X/5]
Issues found: [describe any]
```

---

## Layer 4: Multi-Perspective Validation

### Method: Cross-Perspective Consistency

**When using multiple perspectives:**

1. **Identify consensus points**
   - What do all perspectives agree on?

2. **Analyze disagreements**
   - Where do perspectives differ?
   - Why do they differ?
   - Which has stronger support?

3. **Assess for bias**
   - Is one perspective ignoring evidence?
   - Are all relevant viewpoints represented?

**Template:**
```
Perspectives analyzed: [list]

Consensus points:
✓ [point 1 - all agree]
✓ [point 2 - all agree]

Disagreements:
✗ [topic]: Perspective A says [X], Perspective B says [Y]
  Analysis: [which has better support?]

✗ [topic]: [describe disagreement and resolution]

Missing perspectives: [any important viewpoints not considered?]

Confidence levels:
- Consensus points: High confidence
- Resolved disagreements: Medium confidence
- Unresolved disagreements: Low confidence - state both views
```

---

### Method: Devil's Advocate Challenge

**Actively try to find flaws:**

1. **What are the weakest points?**
2. **What assumptions could be wrong?**
3. **What alternative explanations exist?**
4. **What evidence contradicts this?**

**Template:**
```
Primary conclusion: [main answer]

Devil's Advocate challenges:
1. Weakest assumption: [identify]
   If wrong: [what changes?]

2. Alternative explanation: [propose]
   Why might this be better: [argue]
   Why primary conclusion still stronger: [defend]

3. Contradictory evidence: [list]
   How to reconcile: [explain]

4. Edge case that breaks it: [identify]
   How to handle: [address]

Result:
□ Challenges successfully addressed → Confidence increased
□ Valid challenges found → Revise conclusion
□ Fundamental flaw found → Reject and restart
```

---

## Layer 5: Domain-Specific Validation

### Medical Verification

**Safety-critical checks:**

1. **Contraindications verified**
   - Drug interactions checked
   - Allergy considerations
   - Comorbidity interactions

2. **Dosing accuracy**
   - Age-appropriate
   - Weight-based if needed
   - Renal/hepatic adjustment

3. **Red flag recognition**
   - Life-threatening symptoms identified
   - Urgency appropriately classified

4. **Evidence level stated**
   - Recommendations have evidence backing
   - Uncertainty acknowledged

**Template:**
```
Medical recommendation: [recommendation]

Safety verification:
□ Contraindications checked
□ Interactions verified
□ Dosing appropriate
□ Red flags addressed
□ Evidence level: [RCT / Cohort / Expert opinion / etc.]

Disclaimer present: □ Yes □ No
If no: ADD DISCLAIMER

Risk level: Low / Moderate / High / Life-threatening
If High or Life-threatening: Escalate urgency in response
```

---

### Mathematical Proof Verification

**Rigor requirements:**

1. **Each step justified**
   - Axiom
   - Definition
   - Previously proved theorem
   - Logical rule

2. **No gaps in logic**
3. **Covers all cases**
4. **Handles edge cases**

**Template:**
```
Proof claim: [theorem to prove]

Verification:
□ All terms defined
□ Starting assumptions stated
□ Each step justified with: [axiom/theorem/definition]
□ No logical leaps
□ All cases covered
□ Edge cases handled
□ Conclusion follows

Common proof errors checked:
□ Not begging the question
□ Not proving converse instead
□ Not assuming what's to be proved
□ Induction base case verified
□ Induction step sound

VERDICT: Proof valid / Flaw found at [step X]
```

---

### Code Verification

**Correctness checks:**

1. **Syntax valid**
2. **Logic correct**
3. **Edge cases handled**
4. **Performance acceptable**
5. **Security considerations**

**Template:**
```
Code functionality: [what it should do]

Verification:
□ Syntax valid (no errors)
□ Logic correct (does what intended)
□ Handles empty input
□ Handles null/undefined
□ Handles max values
□ Performance: O(?) acceptable
□ Security: input validation, injection prevention
□ Error handling present

Test cases:
Input: [test 1] → Output: [result] → Expected: [expected] → ✓/✗
Input: [test 2] → Output: [result] → Expected: [expected] → ✓/✗

VERDICT: Code correct / Issues found
```

---

### Legal Verification

**Accuracy requirements:**

1. **Jurisdiction specified**
2. **Current law cited**
3. **Precedent relevant**
4. **Disclaimer present**

**Template:**
```
Legal conclusion: [conclusion]

Verification:
□ Jurisdiction specified
□ Relevant statutes cited
□ Precedent applicable to jurisdiction
□ Case law current (not overruled)
□ Alternative interpretations considered
□ Disclaimer present: "This is not legal advice"

Confidence:
□ Clear statutory guidance: High
□ Established precedent: Medium-High
□ Unclear/evolving area: Low (state uncertainty)

REQUIRED: Recommend consulting attorney
```

---

## Layer 6: Confidence Calibration

### Method: Uncertainty Quantification

**For every major claim:**

1. **Assign confidence level**
   - Certain (99%+): Established facts, proven mathematics
   - High (90-99%): Strong evidence, expert consensus
   - Medium (70-90%): Good evidence, some debate
   - Low (50-70%): Weak evidence, significant debate
   - Speculative (\u003c50%): Hypothesis, little evidence

2. **Justify the confidence level**
   - Why certain vs probable?
   - What evidence supports this level?

3. **State conditions for certainty**
   - What would make this certain?
   - What would refute this?

**Template:**
```
Claim: [statement]

Confidence level: Certain / High / Medium / Low / Speculative

Justification:
Supporting evidence: [list]
Quality of evidence: [RCT, consensus, logic, etc.]
Contradictory evidence: [if any]
Expert consensus: [if applicable]

Conditions for higher confidence: [what would increase certainty]
Potential refutation: [what would disprove this]

STATED IN RESPONSE: "This answer is [confidence level] because [brief justification]"
```

---

### Method: Limitation Acknowledgment

**Explicitly state what is NOT known:**

**Template:**
```
What we know with confidence: [list]

What remains uncertain: [list]

Assumptions made: [list]

Limitations of this analysis:
- [limitation 1]
- [limitation 2]

When to seek additional expertise:
- [condition 1]
- [condition 2]

Include in response: "This analysis has limitations: [key limitations]"
```

---

## Verification Selection Guide

### By Complexity Level

**Simple:**
- Sanity check only
- Basic fact verification

**Moderate:**
- Logical soundness
- Consistency check
- Fact verification
- Mathematical recalculation

**Complex:**
- All Moderate methods
- Cross-perspective consistency
- Devil's advocate challenge
- Domain-specific validation

**Expert:**
- All Complex methods
- Multiple validation methods
- Independent verification
- Confidence calibration
- Limitation acknowledgment

---

### By Domain

**Mathematics:**
- Independent recalculation (mandatory)
- Proof verification
- Edge case testing
- Alternative solution methods

**Medicine:**
- Medical safety verification (mandatory)
- Evidence hierarchy check
- Contraindication check
- Disclaimer verification (mandatory)

**Code:**
- Syntax validation
- Logic verification
- Edge case testing
- Security check

**Factual/Historical:**
- External knowledge validation
- Chain of Verification
- Cross-reference checking

**Philosophy/Ethics:**
- Logical soundness
- Cross-perspective consistency
- Devil's advocate
- Representation fairness

**Legal:**
- Legal verification (mandatory)
- Jurisdiction specification
- Current law verification
- Disclaimer verification (mandatory)

---

## Red Flags Requiring Additional Verification

**Confidence red flags:**
- No uncertainty acknowledged (overconfident)
- "Always" or "never" statements (too absolute)
- Complex topic treated as simple
- Contradictions not addressed

**Factual red flags:**
- Specific numbers without sources
- Historical claims without dates
- Scientific claims without mechanisms
- Legal claims without jurisdiction

**Logical red flags:**
- Circular reasoning detected
- False dichotomy presented
- Strawman argument used
- Ad hominem present

**When red flags detected:**
1. Stop and verify before proceeding
2. Apply additional validation layers
3. Consider restarting analysis
4. Downgrade confidence levels

---

## Verification Workflow

### Standard Verification Process

```
1. GENERATE response using selected reasoning technique

2. APPLY Layer 1 - Logic & Consistency
   ├─ Pass → Continue
   └─ Fail → Revise and retest

3. APPLY Layer 2 - Factual Verification
   ├─ Pass → Continue
   └─ Fail → Correct facts and retest

4. APPLY Layer 3 - Mathematical (if applicable)
   ├─ Pass → Continue
   └─ Fail → Recalculate and retest

5. APPLY Layer 4 - Multi-Perspective (if Complex/Expert)
   ├─ Consensus → High confidence
   └─ Disagreement → State both views, lower confidence

6. APPLY Layer 5 - Domain-Specific (if applicable)
   ├─ Pass → Continue
   └─ Fail → Apply domain corrections

7. APPLY Layer 6 - Confidence Calibration
   ├─ Assign confidence levels
   └─ State limitations

8. FINAL CHECK
   □ All required disclaimers present
   □ Confidence levels stated
   □ Limitations acknowledged
   □ Uncertainties noted

9. DELIVER verified response
```

---

## Verification Checklist by Task Type

### Medical Question
- [ ] Safety verification complete
- [ ] Evidence levels stated
- [ ] Contraindications checked
- [ ] Red flags identified
- [ ] Disclaimer: "Not medical advice, consult healthcare provider"
- [ ] Recommendation: "Seek care if [urgent symptoms]"

### Mathematical Problem
- [ ] All calculations independently verified
- [ ] Each proof step justified
- [ ] Edge cases tested
- [ ] Alternative solution attempted
- [ ] Dimensional analysis (if applicable)

### Code Problem
- [ ] Syntax validated
- [ ] Logic verified
- [ ] Edge cases tested (null, empty, max, negative)
- [ ] Security considerations addressed
- [ ] Performance acceptable

### Factual Question
- [ ] Facts verified against knowledge
- [ ] Confidence levels assigned
- [ ] Uncertainties noted
- [ ] Sources identifiable (even if not cited)

### Philosophical Question
- [ ] Multiple perspectives presented
- [ ] Arguments logically sound
- [ ] No fallacies present
- [ ] Positions fairly represented
- [ ] Disagreements acknowledged

### Legal Question
- [ ] Jurisdiction specified
- [ ] Current law verified
- [ ] Precedent applicable
- [ ] Disclaimer: "Not legal advice, consult attorney"
- [ ] Alternative interpretations noted

---

## Self-Verification Questions

Ask yourself before finalizing:

1. **Have I checked my logic?** Can I defend each step?
2. **Have I verified facts?** Are claims supported?
3. **Have I checked calculations?** Did I recalculate independently?
4. **Have I considered alternatives?** What could I be missing?
5. **Have I stated confidence honestly?** Am I overconfident?
6. **Have I acknowledged limitations?** What don't I know?
7. **Have I included required disclaimers?** (Medical, legal, etc.)
8. **Would I bet money on this answer?** If not, why not?

---

**Verification is not optional for Complex and Expert tasks. Better to spend 2x time on thorough verification than deliver confident but wrong answers.**

---

**Verification Methods Version:** 1.0.0
