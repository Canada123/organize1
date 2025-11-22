---
name: ai-board
description: Advanced reasoning framework that dynamically selects and combines optimal LLM reasoning techniques based on question complexity, domain, and accuracy requirements. Use for questions requiring deep analysis, multi-step reasoning, expert-level problem solving, or maximum accuracy across any domain (medicine, philosophy, theology, STEM, etc.).
metadata:
  version: "1.0.0"
  author: "AI Board Framework"
  category: "reasoning"
  complexity-levels: "simple, moderate, complex, expert"
  domains: "medicine, theology, philosophy, mathematics, science, general, creative"
---

# AI Board: Advanced LLM Reasoning Framework

A state-of-the-art reasoning system that combines the best modern LLM techniques (2024-2025) to deliver optimal answers through dynamic technique selection, multi-perspective analysis, and iterative refinement.

## Core Philosophy

**No single technique dominates** - success requires matching reasoning approaches to task complexity, combining complementary methods, and optimizing for the accuracy-efficiency frontier. This skill implements a hierarchical framework that automatically selects and orchestrates the most effective reasoning strategies.

## When to Use This Skill

Use the AI Board framework when:
- Questions require deep analysis or multi-step reasoning (5+ steps)
- Maximum accuracy is critical (medical, legal, scientific, theological decisions)
- The domain requires expert-level knowledge (STEM, philosophy, specialized fields)
- The question is counter-intuitive or requires exploring multiple solution paths
- Standard responses have proven insufficient or unreliable
- The problem involves complex planning, strategic thinking, or exploration

**Do NOT use for:**
- Simple factual lookups with straightforward answers
- Routine operations with >90% baseline accuracy
- High-volume low-stakes queries where speed matters more than depth
- Creative tasks that don't require logical rigor

## The Four-Phase Reasoning Process

### Phase 1: Request Analysis & Strategy Selection

**Automatically assess the question across five dimensions:**

1. **Domain Classification**
   - Identify primary domain: medicine, theology, philosophy, mathematics, science, law, general, creative, etc.
   - Consult [Domain Frameworks](resources/domain-frameworks.md) for domain-specific reasoning patterns
   - Note cross-domain questions requiring hybrid approaches

2. **Complexity Assessment**
   - **Simple** (1-2 steps): Direct answering sufficient, baseline >90% accuracy
   - **Moderate** (3-5 steps): Standard reasoning needed, 15-25% improvement expected
   - **Complex** (6-15 steps): Advanced techniques required, exploration valuable
   - **Expert** (15+ steps): Maximum rigor needed, competition-level difficulty
   - See [Complexity Assessment Guide](resources/complexity-assessment.md)

3. **Reasoning Type Identification**
   - Sequential (linear chain of logic)
   - Exploratory (multiple solution paths to investigate)
   - Verification-heavy (claims requiring fact-checking)
   - Principle-based (requiring abstract concepts first)
   - Computational (mathematical/algorithmic)

4. **Decision Value & Accuracy Requirements**
   - Routine: Standard approach acceptable
   - Important: Enhanced validation needed
   - Critical: Maximum accuracy, multiple validation layers

5. **Technique Selection Matrix**

Based on the above analysis, select the optimal combination from:

**For Simple Tasks:**
- Use direct structured analysis
- Skip complex reasoning overhead

**For Moderate Complexity:**
- **Chain of Thought (CoT)**: Step-by-step reasoning with explicit intermediate steps
- **Zero-Shot CoT**: Add "Let's think step by step" for 5-10% improvement
- **Domain-Adapted CoT**: Use domain-specific reasoning patterns from resources

**For Complex Tasks:**
- **Self-Consistency**: Generate 3-5 diverse reasoning paths, select most consistent
- **Step-Back Prompting**: First answer high-level principle questions, then apply to specific case
- **Least-to-Most**: Decompose into sequential subproblems, solve in order
- **Multi-Perspective Analysis**: Examine from multiple expert viewpoints (inspired by Mixture of Agents)

**For Expert-Level Tasks:**
- **Tree of Thoughts (ToT)**: Explore multiple branches with lookahead and backtracking
- **Analogical Reasoning**: Generate similar solved problems, apply insights
- **Constitutional Analysis**: Apply explicit principles and constraints
- **Iterative Refinement**: Generate → Critique → Refine cycles with external validation

See [Reasoning Techniques Reference](resources/reasoning-techniques.md) for detailed method descriptions.

### Phase 2: Multi-Perspective Deep Reasoning

**Apply the selected technique(s) with structured execution:**

1. **Establish Context & Constraints**
   - Explicitly state assumptions
   - Identify what information is certain vs uncertain
   - Note any domain-specific principles or constraints
   - Define success criteria

2. **Primary Reasoning Path** (Main Analysis)
   - Execute the selected primary technique
   - Show ALL intermediate steps explicitly
   - Maintain logical chain without skipping steps
   - Tag confidence levels for each step (certain/probable/speculative)

3. **Alternative Perspectives** (For Complex/Expert tasks)

   Generate 2-4 additional viewpoints:
   - **Devil's Advocate**: Challenge the primary reasoning, find flaws
   - **Domain Expert**: Apply specialized domain knowledge and best practices
   - **First Principles**: Reason from fundamental truths upward
   - **Analogical**: Compare to similar solved problems
   - **Skeptical Validator**: Question assumptions and verify claims

   For each perspective:
   - Clearly label the perspective being taken
   - Apply domain-appropriate reasoning patterns
   - Identify points of agreement AND disagreement with primary path
   - Note unique insights not captured in other perspectives

4. **Principle-Based Validation** (Constitutional AI)

   Evaluate reasoning against explicit principles:
   - **Accuracy**: Are factual claims verifiable and correct?
   - **Logical Soundness**: Do conclusions follow from premises?
   - **Completeness**: Have all relevant factors been considered?
   - **Domain Alignment**: Does reasoning follow domain best practices?
   - **Safety**: Are recommendations safe and ethical?
   - **Bias Check**: Have alternative explanations been fairly considered?

### Phase 3: Synthesis & Verification

**Integrate multiple reasoning paths into a coherent answer:**

1. **Cross-Perspective Analysis**
   - Identify consensus points (agreed across perspectives)
   - Highlight disagreements and analyze why they occur
   - Determine which perspective has strongest support for contested points
   - Note confidence levels: certain (all agree), probable (majority support), speculative (significant disagreement)

2. **Error Detection & Correction**
   - Review for logical fallacies or unsupported leaps
   - Check mathematical calculations independently
   - Verify factual claims against knowledge
   - Identify and correct inconsistencies
   - Apply [Verification Methods](resources/verification-methods.md)

3. **Final Synthesis**
   - Integrate the strongest reasoning from each perspective
   - Construct the most complete and accurate answer
   - Explicitly state confidence levels and uncertainties
   - Note areas where human expert consultation would be valuable

### Phase 4: Structured Response Delivery

**Present the final answer with full transparency:**

1. **Executive Summary**
   - Direct answer to the question (1-3 sentences)
   - Confidence level: High/Medium/Low with justification
   - Critical caveats or conditions

2. **Detailed Reasoning**
   - Primary reasoning path with key steps
   - Supporting evidence and logic
   - Critical decision points explained
   - Alternative perspectives considered

3. **Confidence & Limitations**
   - What we're certain about
   - What remains uncertain or debatable
   - Assumptions made
   - When expert human consultation is recommended
   - Domain-specific limitations

4. **For Complex/Expert Answers: Appendix**
   - Full reasoning traces from each perspective
   - Detailed verification steps
   - References to domain principles applied
   - Alternative solutions considered and why they were rejected

## Domain-Specific Enhancements

**Medicine & Healthcare:**
- Always emphasize "not medical advice, consult healthcare provider"
- Consider patient safety first
- Apply evidence-based medicine hierarchy
- Note differential diagnoses
- Consider contraindications and interactions

**Theology & Philosophy:**
- Acknowledge multiple valid interpretive traditions
- Distinguish descriptive claims from normative claims
- Consider historical and textual context
- Represent opposing viewpoints fairly
- Note denominational/philosophical school variations

**Mathematics & STEM:**
- Show all calculation steps
- Verify mathematical operations independently
- Use principle-based reasoning (axioms → theorems)
- Consider edge cases and boundary conditions
- Validate units and dimensional analysis

**Legal & Policy:**
- Emphasize "not legal advice, consult attorney"
- Consider jurisdiction-specific variations
- Note relevant case law or precedent
- Distinguish current law from ethical/policy considerations
- Highlight areas of legal uncertainty

**Creative & Open-Ended:**
- Generate multiple diverse options
- Explore unconventional approaches
- Balance originality with practical constraints
- Consider audience and context
- Provide rationale for creative choices

See [Domain Frameworks](resources/domain-frameworks.md) for complete domain-specific reasoning patterns.

## Self-Improvement & Learning

**After delivering the answer:**

1. **Reflect on Process**
   - Did the selected technique match the task well?
   - Were there missed perspectives or considerations?
   - What would improve the analysis?

2. **Episodic Learning**
   - Note successful reasoning patterns for similar future questions
   - Identify failure modes to avoid
   - Update technique selection heuristics

## Advanced Techniques Reference

For detailed descriptions of reasoning methods, see:
- [Reasoning Techniques](resources/reasoning-techniques.md) - Comprehensive technique descriptions
- [Complexity Assessment](resources/complexity-assessment.md) - How to evaluate question difficulty
- [Domain Frameworks](resources/domain-frameworks.md) - Domain-specific reasoning patterns
- [Verification Methods](resources/verification-methods.md) - Validation approaches

## Examples

### Example 1: Medical Question (Expert-Level)

**Question:** "A 45-year-old patient presents with intermittent chest pain, shortness of breath, and fatigue. Recent labs show elevated troponin. What should be considered?"

**Analysis:**
- Domain: Medicine
- Complexity: Expert (life-critical, multiple differentials)
- Reasoning Type: Sequential diagnostic reasoning + verification
- Technique: Multi-perspective analysis + Constitutional validation

**Execution:**
1. **Primary Path**: Systematic differential diagnosis
2. **Perspectives**: Cardiologist view, Emergency medicine view, Devils advocate (alternative diagnoses)
3. **Constitutional Check**: Patient safety, evidence-based, completeness
4. **Synthesis**: Integrated assessment with urgency stratification

### Example 2: Philosophical Question (Complex)

**Question:** "Is free will compatible with determinism?"

**Analysis:**
- Domain: Philosophy
- Complexity: Complex (2500+ years of debate)
- Reasoning Type: Multi-perspective exploratory
- Technique: Multi-perspective analysis + Step-back prompting

**Execution:**
1. **Step-Back**: What are the fundamental concepts of free will and determinism?
2. **Perspectives**: Compatibilist, Hard determinist, Libertarian, Neuroscience-based
3. **Synthesis**: Map the conceptual landscape, clarify points of disagreement
4. **Conclusion**: Present major positions fairly, note which has strongest support

### Example 3: Mathematical Problem (Complex)

**Question:** "Prove that there are infinitely many prime numbers."

**Analysis:**
- Domain: Mathematics
- Complexity: Complex (requires proof construction)
- Reasoning Type: Principle-based sequential
- Technique: Chain of Thought + Verification

**Execution:**
1. **Primary Path**: Euclid's proof by contradiction
2. **Verification**: Check each logical step independently
3. **Alternative**: Mention Euler's analytic proof
4. **Final**: Present complete rigorous proof with verification

## Computational Efficiency Notes

This framework is optimized for **accuracy over speed**. For questions requiring maximum depth:

- Simple tasks: ~30-50 token overhead (minimal)
- Moderate tasks: ~3-5x standard response (CoT overhead)
- Complex tasks: ~5-10x standard response (multi-perspective)
- Expert tasks: ~10-20x standard response (full framework)

The accuracy gains (5-75% depending on task) justify the computational cost for high-stakes decisions.

## Implementation Guidelines

1. **Always start with Phase 1 analysis** - proper technique selection is critical
2. **Scale reasoning depth to task complexity** - don't over-engineer simple questions
3. **Make reasoning transparent** - show your work explicitly
4. **Use domain frameworks** - apply specialized knowledge patterns
5. **Validate rigorously** - especially for safety-critical domains
6. **State confidence honestly** - distinguish certain from probable from speculative
7. **Know when to escalate** - recommend human expert consultation when appropriate

---

**Framework Version:** 1.0.0
**Based on:** 2024-2025 LLM reasoning research (Chain-of-Thought, Tree-of-Thoughts, Mixture of Agents, Constitutional AI, Self-Consistency, Reflexion, Domain-Adaptive Reasoning)
**Optimized for:** Maximum accuracy on complex, high-stakes questions across all domains
