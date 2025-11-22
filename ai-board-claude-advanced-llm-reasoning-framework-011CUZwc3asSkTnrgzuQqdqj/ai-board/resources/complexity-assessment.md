# Complexity Assessment Guide

How to evaluate question difficulty and determine appropriate reasoning depth for the AI Board framework.

---

## The Four Complexity Levels

### Level 1: Simple (1-2 reasoning steps)

**Characteristics:**
- Direct factual lookup
- Single-step calculation
- Straightforward definition
- Basic classification
- Pattern matching from training

**Baseline accuracy:** Typically >90%

**Examples:**
- "What is the capital of France?"
- "What does API stand for?"
- "What is 15 + 27?"
- "Is a tomato a fruit or vegetable botanically?"

**Recommended technique:** Direct prompting or Zero-Shot CoT for quick check

**Why advanced reasoning doesn't help:**
- Model already knows the answer
- Additional steps add cost without accuracy gain
- Over-engineering wastes resources

**Red flags for misclassification:**
- If question seems simple but requires domain expertise → upgrade to Moderate
- If question has "trick" or counter-intuitive element → upgrade to Moderate/Complex

---

### Level 2: Moderate (3-5 reasoning steps)

**Characteristics:**
- Multi-step calculation or logic
- Requires connecting 2-3 concepts
- Standard problem-solving patterns
- Common reasoning types (deduction, induction, analogy)
- Explicit methodology exists

**Baseline accuracy:** 60-80% without reasoning, 75-90% with CoT

**Examples:**
- "If a train travels 120 miles in 2 hours, and then 90 miles in 1.5 hours, what is its average speed?"
- "Explain why ice floats on water."
- "What are the implications of the First Amendment for social media companies?"
- "How does photosynthesis work?"
- "Debug this code: [simple code with clear error]"

**Recommended technique:**
- **Quick/efficient:** Zero-Shot CoT
- **Best quality:** Few-Shot CoT
- **Domain-specific:** Auto-CoT or domain-adapted prompts

**Why advanced reasoning helps:**
- Breaks down multi-step process
- Prevents skipped steps
- 15-25% accuracy improvement
- Cost justified by quality gain

**Indicators:**
- Question uses "why" or "how" (requires explanation)
- Involves 2-3 sequential operations
- Standard textbook problem type
- Has clear solution methodology
- Requires showing work

**Upgrade to Complex if:**
- Multiple valid solution paths exist
- Requires exploration or backtracking
- Counter-intuitive or trick elements present
- Domain expertise significantly affects approach

---

### Level 3: Complex (6-15 reasoning steps)

**Characteristics:**
- Multiple solution paths to explore
- Requires strategic thinking or planning
- May need backtracking from dead ends
- Connects many concepts across domains
- Non-obvious solution approach
- Benefits from multiple perspectives

**Baseline accuracy:** 30-60%, improves 20-50% with advanced techniques

**Examples:**
- "Design a database schema for a multi-tenant SaaS application with role-based access control."
- "Explain the philosophical problem of free will vs determinism and evaluate major positions."
- "A patient presents with X, Y, Z symptoms. What is your differential diagnosis and recommended workup?"
- "Prove that there are infinitely many prime numbers."
- "What are the ethical implications of CRISPR gene editing in humans?"
- "Design an algorithm to solve [non-trivial problem] optimally."

**Recommended techniques:**
- **Exploration needed:** Tree of Thoughts or Algorithm of Thoughts
- **Reliability critical:** Self-Consistency (n=5-10)
- **Principle-based:** Step-Back Prompting
- **Multi-faceted:** Multi-Perspective Analysis (2-3 perspectives)
- **Verification needed:** Chain of Verification

**Why advanced reasoning helps:**
- Explores solution space systematically
- Catches errors through multiple perspectives
- Considers edge cases and exceptions
- Synthesizes cross-domain knowledge
- 20-50% accuracy improvement

**Indicators:**
- "Design," "Analyze," "Evaluate," "Compare" prompts
- Multiple stakeholder perspectives relevant
- Trade-offs must be balanced
- No single obviously correct answer
- Requires creativity + rigor
- Domain expertise significantly affects quality
- 5+ steps to complete solution

**Upgrade to Expert if:**
- Competition-level difficulty
- Life-critical decision
- Requires cutting-edge knowledge
- Multiple complex domains intersect
- 15+ reasoning steps needed

---

### Level 4: Expert (15+ reasoning steps)

**Characteristics:**
- Competition-level difficulty (IMO, USAMO, Codeforces, etc.)
- Cutting-edge research questions
- Life-critical decisions (medical emergencies, legal, safety)
- Highly complex multi-domain synthesis
- Requires deep domain expertise
- Non-obvious insights needed

**Baseline accuracy:** \u003c30%, can improve 50-200% with full framework

**Examples:**
- "Solve this IMO problem: [International Math Olympiad question]"
- "A 45-year-old with chest pain, elevated troponin, and [complex presentation] - comprehensive assessment needed urgently."
- "Design a distributed consensus algorithm resilient to Byzantine failures with optimal latency."
- "Analyze this Supreme Court case and predict ruling based on precedent, constitutional interpretation, and judicial philosophy."
- "Prove the Riemann Hypothesis." (unsolved - would be expert-level even to make progress)
- "Design a fusion reactor containment system."

**Recommended technique:**
**Full AI Board Framework:**
1. Domain analysis + complexity recognition
2. Multi-perspective deep reasoning (4-5 perspectives)
3. Constitutional validation
4. Iterative refinement with verification
5. Synthesis with confidence levels

**Component techniques:**
- Tree of Thoughts for exploration
- Multi-Perspective Analysis (4-5 viewpoints)
- Self-Consistency for validation
- Constitutional AI for safety/ethics
- Chain of Verification for facts
- Reflexion for iterative improvement
- Domain-specific frameworks applied rigorously

**Why maximum rigor is justified:**
- Accuracy critical (lives, money, competition)
- Baseline approaches fail (often \u003c30%)
- 50-200% improvement possible
- Cost justified by decision value
- Errors have serious consequences

**Indicators:**
- Lives depend on the answer
- Competition or high-stakes exam question
- Research-level problem
- Requires synthesis of 5+ complex concepts
- 15+ discrete reasoning steps
- Multiple domain expert perspectives needed
- Cutting-edge knowledge required
- High cost of errors

---

## Multi-Dimensional Assessment

Beyond just step count, evaluate across these dimensions:

### Dimension 1: Domain Expertise Required

**Low expertise (Simple):**
- General knowledge
- Common sense
- Basic facts

**Moderate expertise (Moderate):**
- High school / undergraduate level
- Standard professional knowledge
- Textbook material

**High expertise (Complex):**
- Graduate level
- Specialized professional knowledge
- Multiple years of training needed

**Expert expertise (Expert):**
- PhD-level / research frontier
- Rare specialization
- Cutting-edge developments
- Multiple specialized domains combined

**Impact on complexity:** High expertise requirements upgrade complexity level

---

### Dimension 2: Uncertainty & Ambiguity

**Low uncertainty (Simple/Moderate):**
- Clear correct answer exists
- Verifiable facts
- Established consensus

**Moderate uncertainty (Complex):**
- Multiple valid approaches
- Debated topic with established positions
- Answer depends on assumptions/values

**High uncertainty (Expert):**
- Research frontier (answer unknown)
- High-stakes decisions under uncertainty
- Conflicting expert opinions
- Incomplete information

**Impact on complexity:** High uncertainty requires multiple perspectives, upgrades to Complex/Expert

---

### Dimension 3: Consequence of Errors

**Low consequence (Simple/Moderate):**
- Academic exercise
- Personal curiosity
- Low-stakes decision

**Moderate consequence (Complex):**
- Professional decision
- Financial implications
- Reputation impact

**High consequence (Expert):**
- Life or death (medical emergencies)
- Major financial ($1M+)
- Legal liability
- Public safety
- Irreversible decisions

**Impact on complexity:** High consequences justify maximum rigor, upgrade to Complex/Expert

---

### Dimension 4: Solution Space Structure

**Linear (Simple/Moderate):**
- Single clear path to solution
- Sequential steps
- Each step has obvious next step

**Branching (Complex):**
- Multiple valid approaches
- Strategic choices affect path
- May need backtracking
- Exploration beneficial

**Highly exploratory (Expert):**
- Many possible approaches
- Non-obvious which will succeed
- Requires trying multiple strategies
- Creativity needed to find solution

**Impact on complexity:** Branching/exploratory structure requires ToT-style techniques

---

### Dimension 5: Verification Difficulty

**Easy to verify (Simple/Moderate):**
- Can check answer immediately
- Objective correctness criteria
- External validation available

**Moderate verification (Complex):**
- Requires expertise to verify
- Partial verification possible
- Multiple validation methods

**Hard to verify (Expert):**
- No immediate verification
- Requires extensive validation
- May need peer review
- Correctness uncertain even with verification

**Impact on complexity:** Hard verification requires multiple perspectives and rigorous validation

---

## Assessment Workflow

### Step 1: Initial Classification

Ask yourself:
1. How many reasoning steps are needed? (1-2 / 3-5 / 6-15 / 15+)
2. What is baseline accuracy without reasoning? (>90% / 60-80% / 30-60% / \u003c30%)
3. Is this a standard problem type or novel? (standard / novel)

**Quick classification:**
- 1-2 steps + >90% baseline → **Simple**
- 3-5 steps + 60-80% baseline → **Moderate**
- 6-15 steps + 30-60% baseline → **Complex**
- 15+ steps + \u003c30% baseline → **Expert**

### Step 2: Dimensional Upgrades

Check each dimension:
- [ ] **Expertise required** - Does it require specialized knowledge?
- [ ] **Uncertainty level** - Is the answer debatable or unknown?
- [ ] **Error consequences** - Are consequences serious?
- [ ] **Solution space** - Does it require exploration?
- [ ] **Verification difficulty** - Is correctness hard to determine?

**Upgrade rules:**
- 2+ dimensions trigger upgrade → increase complexity level by 1
- 4+ dimensions trigger upgrade → increase complexity level by 2
- Life-critical or competition-level → **Expert** regardless of other factors

### Step 3: Domain Context

Apply domain-specific assessment:

**Medicine:** Almost always Complex or Expert due to consequences and expertise required

**Mathematics:** Classify by problem difficulty:
- Basic algebra → Simple/Moderate
- Calculus/linear algebra → Moderate/Complex
- Competition math → Expert

**Philosophy:** Classify by question type:
- Definition questions → Simple/Moderate
- "Explain position X" → Moderate
- "Evaluate competing positions" → Complex
- "Resolve paradox" → Complex/Expert

**Code/Engineering:** Classify by novelty:
- Debug simple error → Moderate
- Design standard system → Complex
- Novel algorithm/optimization → Expert

### Step 4: Technique Selection

Based on final complexity level:

**Simple → Direct Prompting**

**Moderate:**
- Zero-Shot CoT (quick)
- Few-Shot CoT (best)

**Complex:**
- Self-Consistency
- Step-Back Prompting
- Multi-Perspective (2-3)
- Tree of Thoughts (if exploratory)

**Expert:**
- Full AI Board Framework
- Multi-Perspective (4-5)
- All validation layers

---

## Examples of Assessment

### Example 1: "What is photosynthesis?"

**Initial:**
- Steps: 3-4 (define, explain process, significance)
- Baseline: ~75%
- Type: Standard textbook

**Classification: Moderate**

**Dimensional check:**
- Expertise: Moderate (high school biology)
- Uncertainty: Low (well-established)
- Consequences: Low (academic)
- Solution space: Linear
- Verification: Easy

**No upgrades needed**

**Final: Moderate → Few-Shot CoT**

---

### Example 2: "Design a recommendation system for e-commerce"

**Initial:**
- Steps: 10-15 (requirements, architecture, algorithms, scaling, evaluation)
- Baseline: ~40%
- Type: Design problem (novel for each context)

**Classification: Complex**

**Dimensional check:**
- Expertise: High (ML + systems + business)
- Uncertainty: Moderate (multiple valid approaches)
- Consequences: Moderate (professional decision)
- Solution space: Branching (many design choices)
- Verification: Moderate (can prototype/test)

**2 dimension upgrades → stays Complex**

**Final: Complex → Multi-Perspective + Step-Back**

---

### Example 3: "45-year-old with chest pain and elevated troponin - assessment?"

**Initial:**
- Steps: 15+ (history, differential, risk stratification, workup, management)
- Baseline: Varies widely
- Type: Clinical decision-making

**Classification: Expert (initial)**

**Dimensional check:**
- Expertise: Expert (requires MD-level training)
- Uncertainty: High (many possible conditions)
- **Consequences: LIFE-CRITICAL** ← automatic Expert
- Solution space: Highly exploratory
- Verification: Hard (requires clinical judgment)

**5 dimensions trigger upgrade + life-critical**

**Final: Expert → Full AI Board Framework + Disclaimer**

---

### Example 4: "What is 15 + 27?"

**Initial:**
- Steps: 1
- Baseline: 99.9%
- Type: Basic arithmetic

**Classification: Simple**

**Dimensional check:**
- All dimensions: trivial

**Final: Simple → Direct answer: 42**

---

## Common Misclassifications to Avoid

### False Simple (Actually Moderate/Complex)

**Trap:** Question seems simple but has subtle complexity

**Examples:**
- "Is a hot dog a sandwich?" (seems simple, actually requires definition analysis - Moderate)
- "What is consciousness?" (seems simple, actually deep philosophy - Complex)
- "Why is the sky blue?" (seems simple, requires optics explanation - Moderate)

**Solution:** If answer requires "it depends" or "there are multiple perspectives" → upgrade

---

### False Complex (Actually Simple/Moderate)

**Trap:** Question uses technical terms but is straightforward

**Examples:**
- "What is the time complexity of binary search?" (sounds complex, standard fact - Simple)
- "Define REST API" (technical but direct definition - Simple)
- "What is the mitochondria's function?" (biological but straightforward - Simple)

**Solution:** If question is just factual recall despite jargon → keep Simple/Moderate

---

### Underestimating Medical/Legal

**Trap:** Medical and legal questions seem moderate but have high consequences

**Rule:** Medical and legal questions are **minimum Complex**, usually Expert if:
- Patient-specific medical advice
- Legal advice for specific case
- Diagnosis or treatment decisions
- Legal strategy or interpretation

**Why:** High expertise + high consequences + verification difficulty

---

### Overestimating Creative Tasks

**Trap:** Open-ended creative tasks feel complex but don't need rigorous reasoning

**Examples:**
- "Write a creative story about X" (open-ended but not reasoning-heavy - Moderate)
- "Brainstorm product names" (creative but simple - Moderate)

**Solution:** Creative tasks rarely exceed Complex unless they also require rigorous analysis

---

## Calibration Over Time

**Track accuracy by complexity:**
- Simple: Should maintain >90% accuracy with direct prompting
- Moderate: Should achieve 75-90% with CoT
- Complex: Should achieve 60-85% with advanced techniques
- Expert: Should achieve 40-70% with full framework

**If accuracy is lower than expected:**
- Might be underestimating complexity → upgrade level
- Might need better technique selection
- Might be domain-specific knowledge gap

**If accuracy is higher than expected:**
- Might be overestimating complexity → downgrade level
- Can use cheaper techniques

---

## Decision Matrix

| Complexity | Steps | Baseline | Expertise | Consequences | Technique |
|-----------|-------|----------|-----------|--------------|-----------|
| Simple | 1-2 | >90% | Low | Low | Direct |
| Moderate | 3-5 | 60-80% | Moderate | Low | CoT |
| Complex | 6-15 | 30-60% | High | Moderate | Multi-Perspective |
| Expert | 15+ | \u003c30% | Expert | High | Full Framework |

---

## Quick Reference Card

```
QUESTION COMPLEXITY ASSESSMENT:

□ How many steps? _____
□ What's baseline accuracy? _____%
□ Domain expertise level? Low / Moderate / High / Expert
□ Error consequences? Low / Moderate / High / Life-critical
□ Solution space? Linear / Branching / Exploratory
□ Verification difficulty? Easy / Moderate / Hard

COMPLEXITY LEVEL: Simple / Moderate / Complex / Expert

RECOMMENDED TECHNIQUE: _________________

ESTIMATED COST: ____x baseline

EXPECTED ACCURACY IMPROVEMENT: _____%
```

---

**Use this assessment at the start of every AI Board task to ensure appropriate technique selection and resource allocation.**

**Remember: Better to upgrade complexity by one level (spend more) than underestimate and deliver poor accuracy on important questions.**

---

**Assessment Guide Version:** 1.0.0
