# Advanced Reasoning Techniques Reference

Comprehensive descriptions of modern LLM reasoning techniques (2024-2025 state-of-the-art). Use this reference to understand when and how to apply each technique.

---

## Foundational Techniques

### Direct Prompting (Baseline)

**What it is:** Answer the question immediately without explicit reasoning steps.

**When to use:**
- Simple factual questions
- Baseline accuracy >90%
- Speed/efficiency is critical
- Question requires 1-2 steps maximum

**Cost:** 1x (baseline)

**Example:**
```
Q: What is the capital of France?
A: Paris.
```

**Do NOT use for:**
- Multi-step reasoning
- Complex analysis
- Questions where accuracy is critical

---

## Chain-of-Thought Techniques

### Zero-Shot Chain-of-Thought

**What it is:** Add "Let's think step by step" (or similar) to prompt explicit reasoning without providing examples.

**Template:**
```
Question: [question]
Let's think step by step:
[reasoning steps]
Therefore, [answer]
```

**Performance:**
- 5-10% improvement on reasoning tasks
- Works with models >50B parameters
- No example creation needed

**Cost:** ~3-5x baseline (461 tokens vs 15 for direct)

**Alternative phrases:**
- "Let's work this out step by step"
- "Let's break this down"
- "Let's solve this systematically"

**When to use:**
- Quick reasoning baseline needed
- No time to create examples
- Moderate complexity (3-5 steps)
- Testing if reasoning helps

**Example:**
```
Q: If a train travels 120 miles in 2 hours, what is its speed?
Let's think step by step:
1. Speed = Distance / Time
2. Distance = 120 miles
3. Time = 2 hours
4. Speed = 120 / 2 = 60 miles per hour
Therefore, the speed is 60 mph.
```

---

### Few-Shot Chain-of-Thought

**What it is:** Provide 3-8 examples showing explicit reasoning steps before the target question.

**Template:**
```
Q: [example 1 question]
A: [step-by-step reasoning]
Therefore, [answer]

Q: [example 2 question]
A: [step-by-step reasoning]
Therefore, [answer]

[2-6 more examples]

Q: [actual question]
A: [model generates reasoning]
```

**Performance:**
- 15-25% improvement over direct prompting
- Gold standard for most reasoning tasks
- GSM8K: 58% (vs 17.9% direct)

**Cost:** ~30x baseline for reasoning, but answers are better

**When to use:**
- Maximum accuracy needed
- Can create/find quality examples
- Domain-specific reasoning patterns
- Complex but structured tasks

**Example creation tips:**
- Use diverse examples
- Show explicit reasoning for each step
- Match examples to target domain
- Include edge cases
- Quality > quantity (3 great examples > 8 mediocre)

---

### Auto-CoT (Automated Chain-of-Thought)

**What it is:** Automatically generate examples using clustering and Zero-Shot CoT rather than manual creation.

**Process:**
1. Cluster questions using embeddings
2. Sample representative from each cluster
3. Generate reasoning with Zero-Shot CoT
4. Use these as few-shot examples

**When to use:**
- Need Few-Shot benefits without manual work
- Large-scale deployment across question types
- Diverse question distribution
- Manual example creation impractical

**Performance:** Matches or exceeds manual Few-Shot CoT

---

### Least-to-Most Prompting

**What it is:** Decompose complex problems into sequential subproblems, solving each in order where each solution provides context for the next.

**Two-stage process:**
1. **Decomposition:** "To solve [question], what subproblems must we solve?"
2. **Sequential solving:** Solve each subproblem using previous answers as context

**Template:**
```
Question: [complex question]

Step 1 - Decomposition:
To solve this, we need to:
1. [subproblem 1]
2. [subproblem 2]
3. [subproblem 3]

Step 2 - Sequential Solving:
Subproblem 1: [question]
Answer: [solution]

Subproblem 2 (using answer from 1): [question]
Answer: [solution]

Subproblem 3 (using answers from 1 and 2): [question]
Answer: [solution]

Final Answer: [synthesis]
```

**Performance:**
- Last letter concatenation: 34% → 74%
- SCAN benchmark: 6% → 76%

**When to use:**
- Hierarchical problems
- Subproblems build on each other
- Compositional generalization needed
- Planning tasks with dependencies

**Example:**
```
Q: What is the last letter of the concatenation of "Amy" and "Roberto"?

Decomposition:
1. Concatenate "Amy" and "Roberto"
2. Find the last letter

Solving:
1. "Amy" + "Roberto" = "AmyRoberto"
2. Last letter of "AmyRoberto" is "o"

Answer: o
```

---

### Step-Back Prompting

**What it is:** Before answering the specific question, first answer a high-level "step-back question" about principles or concepts.

**Two-stage process:**
1. **Step-back question:** "What are the general principles/concepts relevant to this?"
2. **Apply to specific:** Use principles to answer original question

**Template:**
```
Original Question: [specific question]

Step-Back: What are the key principles/concepts related to this?
[high-level answer]

Now applying these principles to the specific question:
[detailed answer using principles]
```

**Performance:**
- MMLU Physics: +7%
- MMLU Chemistry: +11%
- TimeQA: +27%
- MuSiQue multi-hop: +7%

**When to use:**
- Principle-based reasoning
- Scientific/technical questions
- Multi-hop reasoning
- Questions requiring abstract concepts first
- Combine with RAG (retrieve principles easier than details)

**Cost:** ~1.5x standard CoT

**Example:**
```
Q: Why does ice float on water?

Step-Back: What are the principles of density and molecular structure?
- Density = mass/volume
- Less dense materials float on more dense materials
- Water's molecular structure changes when freezing

Applying to specific question:
When water freezes into ice, its molecular structure forms a crystalline lattice with more space between molecules. This increases volume while mass stays the same, decreasing density. Since ice is less dense than liquid water, it floats.
```

---

## Advanced Exploration Techniques

### Tree of Thoughts (ToT)

**What it is:** Explore multiple reasoning paths systematically with lookahead, evaluation, and backtracking (like a search algorithm).

**Four components:**
1. **Thought decomposition:** Break into intermediate steps
2. **Thought generation:** Generate multiple candidate thoughts per step
3. **State evaluation:** Evaluate each thought (value or vote)
4. **Search algorithm:** BFS, DFS, or beam search

**Template:**
```
Problem: [question]

Step 1 candidates:
a) [thought a] - Evaluation: [promising/maybe/dead-end]
b) [thought b] - Evaluation: [promising/maybe/dead-end]
c) [thought c] - Evaluation: [promising/maybe/dead-end]

Selecting [thought a] as most promising.

Step 2 candidates (building from thought a):
a) [thought a.1] - Evaluation: [promising/maybe/dead-end]
b) [thought a.2] - Evaluation: [promising/maybe/dead-end]

[If dead-end, backtrack to step 1 and try thought b]

Continue until solution found.
```

**Performance:**
- Game of 24: 4% → 74% (18.5x improvement!)
- Mini Crosswords: 16% → 78% (4.9x)

**Cost:** 50-100x baseline (!!!) - very expensive

**When to use:**
- Strategic lookahead required
- Multiple solution paths to explore
- Backtracking prevents failure
- Complex planning tasks
- High-value problems where accuracy >> cost

**Do NOT use for:**
- Simple tasks
- Real-time applications (too slow)
- High-volume processing (too expensive)
- Linear reasoning (no branching needed)

**Search strategies:**
- **BFS (Breadth-First):** Explore all options at each level
- **DFS (Depth-First):** Explore one path fully before trying others
- **Beam Search:** Keep top-k candidates at each step

---

### Graph of Thoughts (GoT)

**What it is:** Generalization of ToT allowing arbitrary graph structures - thoughts can merge, split, loop, and aggregate.

**Operations:**
- **Aggregate:** Combine multiple thoughts into one
- **Merge:** Synthesize insights from different paths
- **Split:** Branch a thought into multiple directions
- **Loop:** Iterative refinement with feedback

**Performance:**
- Sorting 32 numbers: ToT 12% → GoT 62% (5.2x improvement)
- >31% fewer LLM calls than ToT

**When to use:**
- Problems benefit from thought merging (sorting, aggregation)
- Feedback loops valuable (iterative refinement)
- Complex dependency structures
- Graph-like problem structure

**Cost:** 30-60x baseline (expensive but more efficient than ToT)

---

### Algorithm of Thoughts (AoT)

**What it is:** Mimic algorithmic thinking within a single context, reducing external queries while maintaining exploration benefits.

**How it works:**
- In-context exploration using examples of algorithmic thinking
- DFS-like exploration within one generation
- Heuristics encoded via examples

**Performance:**
- Game of 24: 70-74% accuracy with **1 query** (vs ToT's 109 queries)
- 100x cost reduction vs ToT with comparable accuracy

**When to use:**
- Need ToT-like reasoning but cost-constrained
- Production environments with latency requirements
- Algorithmic problems
- Can encode good heuristics in examples

**Trade-off:** Slightly lower peak accuracy for massive cost savings

---

## Reliability & Verification Techniques

### Self-Consistency

**What it is:** Generate multiple diverse reasoning paths (typically 5-40), then select the most consistent answer via majority voting.

**Process:**
1. Generate n reasoning paths using temperature sampling (e.g., temp=0.7)
2. Extract final answer from each
3. Majority vote determines output

**Template:**
```
[Generate Path 1 with temperature=0.7]
Answer from Path 1: X

[Generate Path 2 with temperature=0.7]
Answer from Path 2: X

[Generate Path 3 with temperature=0.7]
Answer from Path 3: Y

[Generate Path 4 with temperature=0.7]
Answer from Path 4: X

[Generate Path 5 with temperature=0.7]
Answer from Path 5: X

Majority vote: X appears 4/5 times
Final Answer: X
```

**Performance:**
- GSM8K: +17.9% over CoT (reaching 74%)
- SVAMP: +11.0%
- AQuA: +12.2%

**Cost:** 5-40x CoT (very expensive)
- n=5: ~5x CoT cost
- n=40: ~40x CoT cost

**When to use:**
- High-stakes decisions requiring reliability
- Deterministic correct answers exist
- Can afford computational cost
- Want to boost confidence in answer

**Optimizations:**
- **Early stopping:** Stop when convergence detected
- **Adaptive sampling:** Increase n for uncertain questions
- **A*-decoding:** 3x fewer tokens with similar performance

---

### Chain of Verification (CoVe)

**What it is:** Generate baseline response, create verification questions, answer them independently, then revise answer based on verification results.

**Four-step process:**
1. **Baseline response:** Generate initial answer
2. **Plan verifications:** Create fact-checking questions
3. **Execute verifications:** Answer each verification independently (to avoid bias)
4. **Final response:** Incorporate verification results

**Template:**
```
Initial Answer: [baseline response]

Verification Questions:
1. [verification question 1]
2. [verification question 2]
3. [verification question 3]

Verification Answers (answered independently):
1. [answer to Q1]
2. [answer to Q2]
3. [answer to Q3]

Revised Answer: [updated answer incorporating verifications]
```

**Performance:**
- Closed-book QA F1: 0.39 → 0.48 (+23%)
- WikiData list questions: substantial error reduction
- Long-form generation: improved quality

**When to use:**
- Hallucination-prone tasks
- List-based questions (easy to miss items)
- Factual verification critical
- Long-form generation requiring accuracy

**Method variants:**
- **Joint:** Answer all verifications together (faster, less effective)
- **2-Step:** Answer verifications in one pass, revise in second (moderate)
- **Factor+Revise:** Answer each independently, then revise (best quality, most expensive)

---

## Multi-Perspective Techniques

### Multi-Agent Debate (Inspired)

**What it is:** Multiple perspectives debate the question, critique each other, then synthesize the best answer.

**Process:**
1. Generate initial response from multiple perspectives
2. Perspectives critique each other's reasoning
3. Each perspective refines based on critiques
4. Synthesize best insights from all perspectives

**Template:**
```
Perspective 1 - [Role]: [Initial reasoning]

Perspective 2 - [Role]: [Initial reasoning]

Perspective 3 - [Role]: [Initial reasoning]

Cross-Critique:
Perspective 1 critiques 2: [critique]
Perspective 2 critiques 3: [critique]
Perspective 3 critiques 1: [critique]

Refined Reasoning:
Perspective 1 (refined): [improved reasoning]
Perspective 2 (refined): [improved reasoning]
Perspective 3 (refined): [improved reasoning]

Synthesis: [Best insights from all perspectives]
```

**Performance:**
- GSM8K, Chess, Biography generation: significant improvements
- Most effective with 2-3 debate rounds
- 3-5 perspectives optimal

**When to use:**
- Deep contemplation needed
- Counter-intuitive problems
- Complex commonsense reasoning
- Multiple valid approaches exist

**Pitfalls:**
- Requires hyperparameter tuning (not plug-and-play)
- Degeneration-of-thought: if one perspective becomes overconfident in wrong answer
- Moderate debate intensity works best (not too aggressive, not too passive)

**Cost:** ~10-20x baseline (multiple perspectives + refinement)

---

### Multi-Persona Analysis

**What it is:** Generate responses from different expert personas, then select or synthesize the best.

**Jekyll & Hyde Pattern:**
1. Auto-generate appropriate persona for the question
2. Generate answer with persona
3. Generate answer without persona (neutral)
4. LLM judge with position-bias mitigation selects better answer

**Performance:**
- +9.98% average across 12 datasets (GPT-4)
- Symbolic reasoning: +60-75% (Last Letter, Coin Flip)
- Domain-specific with aligned personas: +5-20%

**When to use:**
- Complex reasoning (not factual QA)
- Domain expertise framing helps
- Open-ended tasks (advice, brainstorming)
- Problem decomposition

**Do NOT use for:**
- Factual QA (no benefit, possible harm)
- High-baseline tasks (>97% accuracy)
- Bias-sensitive applications (personas increase toxicity)
- Simple tasks

**Persona guidelines:**
- Use domain-aligned, work-related personas
- Gender-neutral when possible
- Avoid disadvantaged/incompetent roles
- Auto-generate rather than handcraft

---

## Self-Improvement Techniques

### Self-Refinement with External Feedback

**What it is:** Generate → Get feedback → Refine in iterative loops, using external validation.

**FEEDBACK → REFINE Loop:**
```
1. Generate initial output
2. Get external feedback (compiler, interpreter, search, etc.)
3. Refine output based on feedback
4. Repeat until satisfactory or max iterations
```

**Critical insight:** Intrinsic self-correction (without external feedback) often **degrades** performance. External validation is essential.

**When it works:**
- **Code generation** with compiler/interpreter feedback (+8.7 units on code optimization)
- **Math** with execution results
- **Fact-checking** with web search
- **Tool-based validation** (CRITIC framework)

**When it fails:**
- Pure reasoning without external validation
- Arithmetic reasoning (intrinsic)
- Closed-book QA (no external source)
- Planning and graph coloring
- Any domain where model can't evaluate better than it can generate

**Implementation:**
```
Output v1: [initial answer]

External Feedback: [compiler error / search result / execution output]

Analysis: [what the feedback reveals]

Output v2: [refined answer addressing feedback]

[Repeat if needed]
```

**Cost:** 2-5x baseline per iteration

---

### Reflection & Learning (Reflexion-Inspired)

**What it is:** Learn from past attempts by storing verbal reflections in episodic memory.

**Components:**
1. **Actor:** Generate response/action
2. **Evaluator:** Score the attempt
3. **Self-Reflection:** Analyze what went wrong/right
4. **Memory:** Store reflections for future attempts

**Template:**
```
Attempt 1:
[response]
Evaluation: Failed - [why]

Reflection: What went wrong?
[verbal analysis of mistakes]
[stored in memory]

Attempt 2 (using reflection):
[improved response based on learned lessons]
Evaluation: Success
```

**Performance:**
- HumanEval: 91% pass@1 (vs 80% baseline)
- AlfWorld: 97% task completion (130/134 tasks)
- LSAT-AR: 33% → 76% with solution reflection

**Reflection types (most to least effective):**
1. **Solution reflection:** Full step-by-step of correct solution
2. **Composite:** All reflection types combined
3. **Explanation:** Why the error occurred
4. **Instructions:** Ordered steps to avoid
5. **Advice:** General improvement suggestions
6. **Keywords:** Error type identification
7. **Retry:** Simply knowing an error occurred

**When to use:**
- Sequential decision-making
- Multi-step problems with interaction
- Learning from past attempts
- Clear error signals available
- Multiple tries allowed

**Cost:** ~2-4x per attempt (includes reflection generation)

---

### Analogical Reasoning

**What it is:** Self-generate relevant similar problems, solve them, then apply insights to the target problem.

**Three-stage process:**
1. **Recall:** "What similar problems have I seen?"
2. **Solve:** Generate solutions to analogous problems
3. **Apply:** Use insights to solve target problem

**Template:**
```
Problem: [target problem]

Similar problems:
1. [analogous problem 1]
   Solution: [solution]

2. [analogous problem 2]
   Solution: [solution]

Insights from analogies:
[patterns, techniques, approaches noticed]

Applying to target problem:
[solution using insights]
```

**Performance:**
- Outperforms both Zero-Shot and manual Few-Shot CoT on GSM8K, MATH, Codeforces
- No manual example creation needed
- Tailors examples to each specific problem

**When to use:**
- Math problem-solving
- Code generation
- Similar problems exist in training data
- Manual example creation impractical

---

## Constitutional & Safety Techniques

### Constitutional AI Principles

**What it is:** Apply explicit principles to critique and improve responses, ensuring alignment with values.

**Two-phase approach:**

**Phase 1 - Supervised Learning:**
1. Generate initial response
2. Critique against constitutional principles
3. Revise to better align with principles
4. Fine-tune on principle-aligned responses

**Phase 2 - RLAIF (RL from AI Feedback):**
1. Generate response pairs
2. AI evaluator judges which better follows principles
3. Train preference model
4. RL training using AI-generated preferences

**Example principles:**
- "Choose the most helpful, honest, and harmless response"
- "Avoid responses that are toxic, discriminatory, or illegal"
- "Provide balanced perspectives on controversial topics"
- "Prioritize user safety over engagement"

**Template:**
```
Initial Response: [response]

Constitutional Critique:
- Helpfulness: [assessment]
- Honesty: [assessment]
- Harmlessness: [assessment]
- [Other principles]: [assessment]

Issues identified: [problems]

Revised Response: [improved response addressing issues]
```

**When to use:**
- Safety-critical applications
- Multi-constraint alignment (helpful AND harmless AND unbiased)
- Content moderation
- Jailbreak defense
- Ethical guidelines enforcement

**Performance:**
- Jailbreak defense: 86% → 4.4% success rate (Constitutional Classifiers)
- Maintained helpfulness while improving safety
- Democratic constitution shows lower bias

**Cost:** ~23.7% overhead for critique-revise process

---

## Domain-Adaptive Techniques

### Meta-Reasoning Prompting (MRP)

**What it is:** Maintain a pool of reasoning methods, dynamically select the most suitable based on task characteristics.

**Process:**
1. **Method Pool:** Maintain descriptions of available techniques (CoT, ToT, Self-Refine, etc.)
2. **Task Analysis:** Evaluate question against method descriptions
3. **Selection:** Choose most suitable method
4. **Execution:** Apply selected method

**Template:**
```
Available Methods:
- Chain of Thought: Step-by-step reasoning. Best for: sequential logic.
- Tree of Thoughts: Exploration with backtracking. Best for: strategic planning.
- Self-Consistency: Multiple paths + voting. Best for: reliability.
- Step-Back: Principles first. Best for: scientific reasoning.

Task: [analyze question characteristics]
- Domain: [domain]
- Complexity: [level]
- Reasoning type: [type]

Best method: [selected method]
Rationale: [why this method fits]

Executing [selected method]:
[apply the chosen technique]
```

**Performance:**
- 77.2% macro average (vs 65-69% for individual methods)
- Best or second-best on diverse tasks without manual tuning
- Never worst performer

**When to use:**
- Diverse query types
- Need consistency across task types
- Can't hand-optimize per domain
- Have strong base model (GPT-4 class required)

**Limitation:** Requires sophisticated base model (GPT-3.5 only gets 43.3%)

---

## Technique Combination Patterns

### CoT + Self-Consistency + Verification

**Layered validation:**
1. Generate 5 reasoning paths with CoT
2. Select most consistent answer
3. Verify with external tools or CoVe
4. Final answer with high confidence

**When to use:** Maximum accuracy required, can afford cost

**Cost:** ~10-15x baseline

---

### Step-Back + RAG

**Principle-based retrieval:**
1. Generate step-back question about principles
2. Retrieve high-level concepts from knowledge base
3. Apply principles to specific question
4. Retrieve specific facts as needed

**When to use:** Knowledge-intensive tasks

**Performance:** Superior to retrieving details directly

---

### Multi-Perspective + Constitutional Validation

**Diverse perspectives with safety:**
1. Generate multiple perspective analyses
2. Apply constitutional principles to each
3. Filter out problematic reasoning
4. Synthesize aligned perspectives

**When to use:** Complex questions with ethical dimensions

---

### Iterative Refinement + External Tools (CRITIC)

**Grounded improvement:**
1. Generate initial answer
2. Use tools (search, calculator, code) to verify
3. Critique based on tool results
4. Refine answer
5. Repeat

**When to use:** Verifiable tasks with tool access

**Performance:** Consistently enhances accuracy

---

## Technique Selection Decision Tree

```
START: Analyze question

Is it simple (1-2 steps, baseline >90%)?
├─ YES → Direct Prompting
└─ NO → Continue

Is it moderate complexity (3-5 steps)?
├─ YES → Zero-Shot CoT (quick) or Few-Shot CoT (best quality)
└─ NO → Continue

Is exploration/backtracking needed?
├─ YES → Tree of Thoughts (if cost ok) or Algorithm of Thoughts (if cost-sensitive)
└─ NO → Continue

Does it require principles/concepts first?
├─ YES → Step-Back Prompting (combine with RAG if knowledge-intensive)
└─ NO → Continue

Is maximum reliability critical?
├─ YES → Self-Consistency (n=5-10)
└─ NO → Continue

Is it prone to hallucination?
├─ YES → Chain of Verification
└─ NO → Continue

Does domain expertise framing help?
├─ YES → Multi-Persona (but NOT for factual QA)
└─ NO → Continue

Can you verify with external tools?
├─ YES → Self-Refinement + External Feedback (CRITIC)
└─ NO → Continue

Is it expert-level (15+ steps, competition-level)?
├─ YES → Multi-Perspective Analysis + Constitutional Validation + Verification
└─ NO → Standard Few-Shot CoT

Have diverse query types?
└─ YES → Meta-Reasoning Prompting (automatic selection)
```

---

## Cost Summary

| Technique | Cost vs Baseline | When Worth It |
|-----------|-----------------|---------------|
| Direct | 1x | Simple tasks |
| Zero-Shot CoT | 3-5x | Quick reasoning |
| Few-Shot CoT | 30x | Most reasoning tasks |
| Self-Consistency (n=5) | 150x | High-stakes |
| Step-Back | 45x | Principle-based |
| Chain of Verification | 60-90x | Hallucination-prone |
| Tree of Thoughts | 50-100x | Strategic exploration |
| Multi-Perspective | 100-300x | Expert-level |
| Full Framework | 300-600x | Maximum accuracy critical |

---

## Key Principles

1. **Match technique to task complexity** - Don't use ToT for simple arithmetic
2. **External validation > intrinsic self-correction** - Always ground refinement
3. **Combine complementary techniques** - Step-back + RAG works better than either alone
4. **Cost-accuracy tradeoffs are real** - 100x cost for 20% accuracy gain is not always worth it
5. **Domain matters** - Apply domain-appropriate reasoning patterns
6. **Transparency matters** - Show your reasoning explicitly
7. **Know limitations** - State confidence levels and uncertainties

---

**Reference Version:** 1.0.0
**Based on:** 2024-2025 LLM reasoning research synthesis
