# Domain-Specific Reasoning Frameworks

This resource provides specialized reasoning patterns optimized for different domains. Apply these frameworks when the AI Board skill identifies domain-specific questions.

---

## Medicine & Healthcare

### Reasoning Pattern: Clinical Decision-Making Framework

**1. Patient Safety First**
- Always prioritize life-threatening conditions
- Consider contraindications and drug interactions
- Apply "do no harm" principle

**2. Systematic Differential Diagnosis**
```
VINDICATE+ Framework:
V - Vascular (stroke, MI, PE, arterial disease)
I - Infectious/Inflammatory (sepsis, pneumonia, autoimmune)
N - Neoplastic (cancer, benign tumors)
D - Degenerative/Developmental (arthritis, congenital)
I - Intoxication/Iatrogenic (drugs, medications, procedures)
C - Congenital (genetic conditions)
A - Autoimmune/Allergic
T - Traumatic
E - Endocrine/Metabolic (diabetes, thyroid, electrolytes)
+ - Psychogenic/Psychiatric
```

**3. Evidence Hierarchy**
- Systematic reviews & meta-analyses (highest)
- Randomized controlled trials
- Cohort studies
- Case-control studies
- Case series
- Expert opinion (lowest)

**4. Clinical Reasoning Steps**
1. **Gather comprehensive history** - symptoms, onset, duration, triggers, alleviating factors
2. **Consider red flags** - emergent symptoms requiring immediate attention
3. **Generate differential** - most likely to least likely, most serious to least serious
4. **Apply clinical decision rules** - validated scoring systems (CHADS2, Wells, etc.)
5. **Consider diagnostic workup** - labs, imaging, procedures needed
6. **Risk stratification** - categorize urgency (emergent, urgent, routine)
7. **Management approach** - treatment options with evidence levels
8. **Safety net** - when to seek immediate care, follow-up timing

**5. Critical Disclaimers**
- Always state: "This is educational information only, not medical advice"
- Emphasize: "Consult qualified healthcare provider for medical decisions"
- Note limitations: "Cannot perform physical exam or review complete medical history"

**6. Special Considerations**
- Pediatric vs adult dosing and presentations
- Pregnancy/lactation safety
- Geriatric considerations (falls, polypharmacy, atypical presentations)
- Drug-drug interactions
- Comorbidities

---

## Theology & Religious Studies

### Reasoning Pattern: Multi-Traditional Interpretive Framework

**1. Textual Context Analysis**
- **Historical context**: When was it written? Cultural setting?
- **Literary genre**: Poetry, narrative, law, prophecy, apocalyptic, epistle?
- **Immediate context**: Surrounding passages and themes
- **Original language**: Hebrew, Greek, Aramaic nuances
- **Canonical context**: How does it fit in the broader scripture?

**2. Interpretive Traditions**

Represent multiple valid perspectives:
- **Orthodox/Traditional**: Historical church interpretation
- **Reformed/Protestant**: Sola scriptura, systematic theology
- **Catholic**: Magisterium, tradition + scripture
- **Progressive/Liberal**: Historical-critical method, contemporary application
- **Fundamentalist/Literalist**: Plain meaning emphasis
- **Mystical/Contemplative**: Spiritual/allegorical reading
- **Liberation/Contextual**: Social justice lens

**3. Theological Reasoning Framework**
```
1. Scripture - What does the text say?
2. Tradition - How has the church historically understood this?
3. Reason - What does logical analysis suggest?
4. Experience - How do believers experience this truth?
(Wesleyan Quadrilateral)
```

**4. Distinguish Types of Claims**
- **Descriptive**: "X tradition teaches Y" (factual)
- **Normative**: "One should believe Y" (prescriptive)
- **Historical**: "Event X occurred in year Y"
- **Doctrinal**: "Theological position X holds that..."

**5. Handling Controversial Topics**
- Present multiple perspectives fairly
- Note denominational variations
- Distinguish essentials from non-essentials
- Acknowledge areas of legitimate disagreement
- Avoid claiming one interpretation is "correct" when debated

**6. Cross-Religious Analysis**
When comparing religions:
- Respect each tradition's self-understanding
- Avoid reductionism (religion X is "just like" religion Y)
- Use terminology appropriate to each tradition
- Note insider vs outsider perspectives
- Acknowledge complexity and diversity within traditions

**7. Philosophical Theology Questions**
For questions like theodicy, free will, divine attributes:
- Present classical positions (Augustine, Aquinas, etc.)
- Modern philosophical treatments
- Biblical/textual evidence cited by each view
- Logical implications and challenges
- Note which positions have majority/minority support

---

## Philosophy

### Reasoning Pattern: Analytical Philosophy Framework

**1. Conceptual Clarification**
- Define key terms precisely
- Identify ambiguities in language
- Distinguish concepts that are being conflated
- Specify what is meant by core terms

**2. Argument Reconstruction**
```
Standard Form:
P1: [Premise 1]
P2: [Premise 2]
...
C: [Conclusion]

Identify:
- Are premises true?
- Does conclusion follow logically?
- Are there hidden assumptions?
```

**3. Major Philosophical Positions**

For any philosophical question, map the landscape:
- **What positions exist?** (compatibilism, hard determinism, libertarianism...)
- **Who holds each?** (Historical and contemporary philosophers)
- **What are the arguments for each?**
- **What are the objections to each?**
- **Which has strongest support?** (Be honest about current philosophical consensus or lack thereof)

**4. Types of Philosophical Arguments**
- **A priori**: Based on reason alone (mathematical, logical)
- **A posteriori**: Based on experience/evidence
- **Thought experiments**: Trolley problem, brain in vat, etc.
- **Reductio ad absurdum**: Show position leads to contradiction
- **Transcendental**: What must be true for X to be possible?

**5. Common Fallacies to Avoid**
- Strawman (misrepresenting opponent's position)
- False dichotomy (only two options presented when more exist)
- Equivocation (shifting meaning of key term)
- Begging the question (assuming what needs to be proven)
- Appeal to authority (in philosophy, arguments matter more than who said it)

**6. Branches of Philosophy**
- **Metaphysics**: What exists? (ontology, mind-body, free will, causation)
- **Epistemology**: What can we know? (skepticism, justification, truth)
- **Ethics**: What should we do? (consequentialism, deontology, virtue ethics)
- **Logic**: What follows from what? (formal systems, validity)
- **Aesthetics**: What is beauty/art?
- **Political**: What is justice? What legitimizes authority?

**7. Philosophical Method**
1. State the question precisely
2. Clarify key concepts
3. Present major positions
4. Give best arguments for each position
5. Give best objections to each position
6. Evaluate comparative strength
7. State your reasoned conclusion (while acknowledging it's debatable)

---

## Mathematics & Formal Sciences

### Reasoning Pattern: Rigorous Proof & Verification Framework

**1. Proof Structures**

**Direct Proof:**
```
Given: Assumptions/axioms
To Prove: Conclusion
1. Start with givens
2. Apply valid logical steps
3. Each step justified by: axiom, definition, previously proved theorem, or logical rule
4. Arrive at conclusion
QED
```

**Proof by Contradiction:**
```
To prove P:
1. Assume ¬P (not P)
2. Derive a logical contradiction
3. Therefore ¬P must be false
4. Therefore P must be true
```

**Proof by Induction:**
```
To prove P(n) for all n ≥ base:
1. Base case: Prove P(base) is true
2. Inductive hypothesis: Assume P(k) is true
3. Inductive step: Prove P(k) → P(k+1)
4. Therefore P(n) true for all n ≥ base
```

**2. Mathematical Reasoning Checklist**
- [ ] All variables defined
- [ ] Domain/range specified
- [ ] Each step justified (which theorem/axiom?)
- [ ] No logical leaps
- [ ] Edge cases considered (n=0, empty set, etc.)
- [ ] Uniqueness vs existence distinguished
- [ ] "If and only if" vs "if" distinguished
- [ ] Verification: Can you work backwards from conclusion?

**3. Common Proof Techniques**
- **Contrapositive**: To prove P → Q, prove ¬Q → ¬P
- **Cases**: Exhaustively consider all possibilities
- **Construction**: Build an object with desired properties
- **Counting**: Combinatorial arguments, bijection
- **Pigeon-hole principle**: n+1 items in n boxes → one box has 2+

**4. Verification Steps**
1. **Independently check calculations** - Don't just verify work, recalculate
2. **Dimensional analysis** - Do units make sense?
3. **Sanity checks** - Does the answer make physical/logical sense?
4. **Boundary cases** - Does it work for n=0, n=1, very large n?
5. **Alternative methods** - Can you solve it a different way to confirm?

**5. Problem-Solving Heuristics** (Polya)
1. **Understand**: What is being asked? What are givens? What are unknowns?
2. **Plan**: Have I seen similar? Can I restate it? Can I solve a simpler version?
3. **Execute**: Carry out the plan, check each step
4. **Review**: Check the result, can you derive it differently?

**6. Applied Math Considerations**
- **Numerical stability**: Will algorithm accumulate errors?
- **Computational complexity**: O(n), O(n²), O(2ⁿ)?
- **Approximation vs exact**: When is approximation acceptable?
- **Statistical significance**: Is the result meaningful or noise?

---

## Natural Sciences

### Reasoning Pattern: Scientific Method & Evidence-Based Framework

**1. Hypothesis Formation**
- **Observation**: What phenomenon needs explanation?
- **Question**: What specific question does it raise?
- **Hypothesis**: Testable, falsifiable prediction
- **Null hypothesis**: The default "no effect" position

**2. Evidence Evaluation**
```
Strength of Evidence:
1. Systematic reviews/meta-analyses
2. Randomized controlled experiments
3. Cohort studies
4. Observational studies
5. Case studies
6. Theoretical models
7. Speculation/hypothesis
```

**3. Experimental Reasoning**
- **Controls**: What is being compared?
- **Variables**: Independent (manipulated), dependent (measured), confounding (controlled)
- **Sample size**: Is it powered to detect effect?
- **Blinding**: Single, double, or unblinded?
- **Replication**: Has it been reproduced?
- **Peer review**: Published where? By whom?

**4. Causal vs Correlational**
- Correlation ≠ Causation
- Bradford Hill Criteria for causation:
  - Strength of association
  - Consistency across studies
  - Specificity
  - Temporality (cause before effect)
  - Biological gradient (dose-response)
  - Plausibility (mechanism)
  - Coherence with known facts
  - Experimental evidence
  - Analogy to similar relationships

**5. Scientific Uncertainty**
- **Confidence intervals**: Range of plausible values
- **Statistical significance**: p < 0.05 is convention, not magic threshold
- **Effect size**: Statistical significance ≠ practical importance
- **Publication bias**: Negative results often unpublished

**6. Domain-Specific Patterns**

**Physics:**
- Dimensional analysis first
- Conservation laws (energy, momentum, charge)
- Symmetry principles
- Order of magnitude estimates
- Limiting cases (v→c, T→0)

**Chemistry:**
- Reaction mechanisms (arrow pushing)
- Thermodynamics (favorable?) vs Kinetics (fast enough?)
- Periodic trends
- Molecular geometry (VSEPR)
- Stoichiometry

**Biology:**
- Evolution by natural selection framework
- Structure-function relationships
- Homeostasis and feedback loops
- Ecological relationships
- Molecular mechanisms (genetics, cell biology)

**7. Scientific Consensus**
- What is the current scientific consensus?
- What is the quality of evidence?
- Are there legitimate scientific debates?
- Distinguish scientific debate from pseudoscience

---

## Law & Legal Reasoning

### Reasoning Pattern: Legal Analysis Framework

**1. Issue Spotting**
- What legal question is raised?
- What area of law applies? (contract, tort, criminal, constitutional, etc.)
- What jurisdiction? (federal vs state, which state?)

**2. IRAC Method**
```
I - Issue: What is the legal question?
R - Rule: What law/precedent applies?
A - Analysis: How does the rule apply to these facts?
C - Conclusion: What is the likely outcome?
```

**3. Sources of Law (Hierarchy)**
1. **Constitutional provisions** (highest)
2. **Statutes** (legislative enactments)
3. **Regulations** (administrative rules)
4. **Case law/Precedent** (judicial decisions)
5. **Secondary sources** (legal commentary, treatises)

**4. Precedent Analysis**
- **Binding**: Must follow (same jurisdiction, higher court)
- **Persuasive**: May follow (other jurisdictions, same level courts)
- **Distinguishing**: How is this case different from precedent?
- **Overruling**: Has precedent been superseded?

**5. Statutory Interpretation**
- **Plain meaning**: What do the words ordinarily mean?
- **Legislative intent**: What did lawmakers intend?
- **Purpose**: What problem was the law addressing?
- **Canons of construction**: Interpretive rules
  - Specific provisions override general ones
  - Later statutes override earlier ones
  - Interpret to avoid absurd results

**6. Critical Disclaimers**
- "This is general legal information, not legal advice"
- "Consult a licensed attorney for advice on specific situations"
- "Laws vary by jurisdiction and change over time"
- "Cannot establish attorney-client relationship"

**7. Legal Reasoning Patterns**
- **Analogical**: Is this case like prior cases?
- **Policy-based**: What outcome serves policy goals?
- **Textual**: What does the statute/constitution say?
- **Balancing**: Weigh competing interests (privacy vs security)

---

## Computer Science & Engineering

### Reasoning Pattern: Algorithmic & Systems Thinking Framework

**1. Problem Decomposition**
- Break into subproblems
- Identify inputs, outputs, constraints
- Consider edge cases and boundary conditions

**2. Algorithm Design**
```
1. Brute force solution (correctness first)
2. Identify inefficiencies
3. Optimize (better algorithm, data structure)
4. Analyze complexity: Time O(?), Space O(?)
5. Consider tradeoffs
```

**3. Debugging Reasoning**
- **Reproduce**: Can you consistently trigger the bug?
- **Isolate**: Binary search on code/inputs
- **Hypothesize**: What could cause this behavior?
- **Test**: Verify hypothesis with specific test
- **Fix**: Minimal change to fix root cause
- **Verify**: Confirm fix doesn't break other cases

**4. System Design**
- **Requirements**: Functional and non-functional
- **Architecture**: Components and interactions
- **Scalability**: How does it handle growth?
- **Reliability**: Failure modes and recovery
- **Security**: Threat model and mitigations
- **Performance**: Latency, throughput, resource usage

**5. Security Reasoning**
- **Threat modeling**: What can go wrong?
- **Attack surface**: What is exposed?
- **Defense in depth**: Multiple layers
- **Principle of least privilege**: Minimal necessary access
- **Input validation**: Never trust user input
- **Cryptography**: Use established algorithms, not homebrew

**6. Code Verification**
- **Correctness**: Does it do what it's supposed to?
- **Edge cases**: Empty input, max values, null, etc.
- **Performance**: Acceptable time/space complexity?
- **Maintainability**: Can others understand it?
- **Testing**: Unit, integration, system tests

---

## Social Sciences

### Reasoning Pattern: Evidence & Theory Integration Framework

**1. Empirical Claims**
- What is the evidence?
- Sample size and representativeness
- Methodology (survey, experiment, observation)
- Potential biases
- Replication status

**2. Theoretical Frameworks**
- **Psychology**: Cognitive, behavioral, psychoanalytic, humanistic approaches
- **Sociology**: Functionalist, conflict, symbolic interactionist perspectives
- **Economics**: Classical, Keynesian, behavioral models
- **Political Science**: Realist, liberal, constructivist theories

**3. Confounding Factors**
- Correlation vs causation
- Selection bias
- Confirmation bias
- Social desirability bias
- Observer effects

**4. Statistical Reasoning**
- Sample vs population
- Random vs convenience sampling
- Confidence intervals
- Statistical vs practical significance
- Base rates and conditional probabilities

**5. Cross-Cultural Considerations**
- WEIRD populations (Western, Educated, Industrialized, Rich, Democratic)
- Cultural context and variation
- Avoid ethnocentrism
- Consider cultural relativism vs universals

---

## Creative & Design Domains

### Reasoning Pattern: Generative & Evaluative Framework

**1. Divergent Phase (Generate Options)**
- Brainstorm multiple diverse approaches
- Defer judgment initially
- Combine unexpected elements
- Consider unconventional solutions
- Aim for quantity to find quality

**2. Evaluative Phase (Assess Options)**
```
Criteria:
- Novelty: How original?
- Appropriateness: Fits constraints/audience?
- Feasibility: Can it be executed?
- Impact: How effective/memorable?
- Elegance: Simple yet powerful?
```

**3. Design Thinking Process**
1. **Empathize**: Understand user needs
2. **Define**: Frame the problem
3. **Ideate**: Generate solutions
4. **Prototype**: Create quick mockups
5. **Test**: Get feedback, iterate

**4. Aesthetic Reasoning**
- **Composition**: Balance, contrast, harmony
- **Function**: Does form serve purpose?
- **Context**: Audience, culture, medium
- **Emotion**: What feeling does it evoke?
- **Narrative**: What story does it tell?

**5. Iterative Refinement**
- Initial concept
- Critique and identify weaknesses
- Refine and iterate
- Multiple versions/variations
- Select strongest execution

---

## Cross-Domain Integration

When questions span multiple domains:

1. **Identify all relevant domains**
2. **Apply each domain's framework**
3. **Look for contradictions or tensions**
4. **Synthesize integrative answer**
5. **Note which domain takes precedence** (e.g., legal overrides technical preference, medical safety overrides cost)

---

## Application Notes

- **Use the most specific framework available** - If question is clearly medical, use medical framework
- **Combine frameworks for interdisciplinary questions** - Bioethics uses both medical and philosophical
- **Adapt frameworks to question complexity** - Don't over-apply for simple questions
- **Explicit > Implicit** - State which framework you're using and why
- **Document reasoning** - Show which domain principles you're applying

These frameworks ensure domain-appropriate reasoning while maintaining the AI Board's commitment to rigorous, multi-perspective analysis.
