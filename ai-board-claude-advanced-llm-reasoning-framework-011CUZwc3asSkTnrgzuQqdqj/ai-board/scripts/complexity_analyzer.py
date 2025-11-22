#!/usr/bin/env python3
"""
AI Board Complexity Analyzer

Analyzes questions to determine complexity level and recommend appropriate
reasoning techniques for the AI Board framework.

This script provides a reference implementation for complexity assessment.
In practice, complexity assessment should be done by the LLM using the
guidelines in resources/complexity-assessment.md, but this script can help
with initial classification or validation.
"""

import re
from typing import Dict, List, Tuple
from enum import Enum


class ComplexityLevel(Enum):
    """Question complexity levels"""
    SIMPLE = "Simple"
    MODERATE = "Moderate"
    COMPLEX = "Complex"
    EXPERT = "Expert"


class Domain(Enum):
    """Question domains"""
    MEDICINE = "Medicine"
    THEOLOGY = "Theology"
    PHILOSOPHY = "Philosophy"
    MATHEMATICS = "Mathematics"
    SCIENCE = "Science"
    LAW = "Law"
    COMPUTER_SCIENCE = "Computer Science"
    CREATIVE = "Creative"
    GENERAL = "General"


# Keywords that indicate different domains
DOMAIN_KEYWORDS = {
    Domain.MEDICINE: [
        'patient', 'diagnosis', 'treatment', 'symptom', 'disease', 'medical',
        'drug', 'medication', 'clinical', 'healthcare', 'doctor', 'hospital',
        'surgical', 'therapeutic', 'pharmaceutical', 'physiological'
    ],
    Domain.THEOLOGY: [
        'god', 'religion', 'scripture', 'bible', 'theology', 'faith', 'church',
        'spiritual', 'divine', 'prayer', 'worship', 'salvation', 'sin',
        'religious', 'biblical', 'theological', 'doctrine'
    ],
    Domain.PHILOSOPHY: [
        'philosophy', 'ethics', 'moral', 'metaphysics', 'epistemology',
        'consciousness', 'free will', 'determinism', 'truth', 'knowledge',
        'justice', 'virtue', 'philosophical', 'ontology', 'existential'
    ],
    Domain.MATHEMATICS: [
        'prove', 'theorem', 'equation', 'calculate', 'derivative', 'integral',
        'matrix', 'vector', 'probability', 'statistics', 'mathematical',
        'algebra', 'geometry', 'calculus', 'topology', 'number theory'
    ],
    Domain.SCIENCE: [
        'experiment', 'hypothesis', 'theory', 'physics', 'chemistry', 'biology',
        'evolution', 'quantum', 'molecule', 'atom', 'energy', 'force',
        'scientific', 'research', 'empirical', 'photosynthesis'
    ],
    Domain.LAW: [
        'legal', 'law', 'court', 'statute', 'precedent', 'jurisdiction',
        'constitutional', 'contract', 'liability', 'plaintiff', 'defendant',
        'attorney', 'judicial', 'legislation', 'tort', 'criminal'
    ],
    Domain.COMPUTER_SCIENCE: [
        'algorithm', 'code', 'programming', 'software', 'database', 'api',
        'function', 'class', 'debug', 'compile', 'runtime', 'data structure',
        'complexity', 'recursion', 'variable', 'computer', 'system design'
    ],
    Domain.CREATIVE: [
        'creative', 'design', 'art', 'story', 'brainstorm', 'innovative',
        'aesthetic', 'composition', 'narrative', 'artistic', 'imagination'
    ]
}

# Keywords indicating high complexity
COMPLEXITY_INDICATORS = {
    'expert': ['prove', 'design', 'analyze in depth', 'comprehensive', 'optimize',
               'differential diagnosis', 'evaluate competing', 'synthesize'],
    'complex': ['explain why', 'compare and contrast', 'evaluate', 'analyze',
                'how does', 'what are the implications', 'design', 'create'],
    'moderate': ['how', 'why', 'what is the process', 'explain', 'calculate',
                 'describe the steps'],
    'simple': ['what is', 'define', 'who', 'when', 'where', 'what does x stand for']
}

# High-consequence keywords
HIGH_CONSEQUENCE_KEYWORDS = [
    'patient', 'emergency', 'urgent', 'life-threatening', 'critical',
    'safety', 'legal advice', 'lawsuit', 'criminal', 'diagnosis', 'treatment'
]


def count_reasoning_steps_estimate(question: str) -> int:
    """
    Estimate the number of reasoning steps required.
    This is a rough heuristic based on question complexity indicators.
    """
    question_lower = question.lower()

    # Base step count
    steps = 2

    # Multi-part questions
    if ' and ' in question_lower:
        steps += question_lower.count(' and ')

    # Sequential indicators
    if 'then' in question_lower or 'next' in question_lower:
        steps += 2

    # Comparison adds steps
    if 'compare' in question_lower or 'contrast' in question_lower:
        steps += 3

    # Analysis adds steps
    if 'analyze' in question_lower or 'evaluate' in question_lower:
        steps += 4

    # Proof or design adds many steps
    if 'prove' in question_lower or 'proof' in question_lower:
        steps += 10
    if 'design' in question_lower:
        steps += 8

    # Complex phrases
    if 'implications' in question_lower:
        steps += 3
    if 'differential diagnosis' in question_lower:
        steps += 10

    return steps


def detect_domain(question: str) -> Domain:
    """Detect the primary domain of the question based on keywords."""
    question_lower = question.lower()

    # Count keyword matches for each domain
    domain_scores = {}
    for domain, keywords in DOMAIN_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in question_lower)
        domain_scores[domain] = score

    # Return domain with highest score, or GENERAL if no matches
    max_score = max(domain_scores.values())
    if max_score == 0:
        return Domain.GENERAL

    return max(domain_scores.items(), key=lambda x: x[1])[0]


def assess_consequences(question: str, domain: Domain) -> str:
    """Assess the consequences of errors (Low, Moderate, High, Life-Critical)."""
    question_lower = question.lower()

    # Life-critical domains and keywords
    if domain == Domain.MEDICINE:
        if any(kw in question_lower for kw in ['patient', 'diagnosis', 'treatment']):
            return "Life-Critical"
        return "High"

    if domain == Domain.LAW:
        if any(kw in question_lower for kw in ['legal advice', 'case', 'lawsuit']):
            return "High"
        return "Moderate"

    # Check for high-consequence keywords
    if any(kw in question_lower for kw in HIGH_CONSEQUENCE_KEYWORDS):
        return "High"

    # Competition or academic
    if any(kw in question_lower for kw in ['olympiad', 'competition', 'thesis']):
        return "High"

    # Default
    if domain in [Domain.PHILOSOPHY, Domain.GENERAL, Domain.CREATIVE]:
        return "Low"

    return "Moderate"


def classify_complexity(
    steps: int,
    domain: Domain,
    consequences: str,
    question: str
) -> ComplexityLevel:
    """
    Classify question complexity based on multiple factors.

    Args:
        steps: Estimated number of reasoning steps
        domain: Detected domain
        consequences: Consequence level (Low, Moderate, High, Life-Critical)
        question: Original question text

    Returns:
        ComplexityLevel enum value
    """
    question_lower = question.lower()

    # Life-critical always elevates to Expert
    if consequences == "Life-Critical":
        return ComplexityLevel.EXPERT

    # Competition-level indicators
    competition_keywords = ['olympiad', 'competition', 'prove that', 'proof of']
    if any(kw in question_lower for kw in competition_keywords):
        return ComplexityLevel.EXPERT

    # Step-based classification with domain adjustments
    if steps >= 15:
        return ComplexityLevel.EXPERT
    elif steps >= 6:
        # High consequences can upgrade to Expert
        if consequences == "High":
            return ComplexityLevel.EXPERT
        return ComplexityLevel.COMPLEX
    elif steps >= 3:
        return ComplexityLevel.MODERATE
    else:
        return ComplexityLevel.SIMPLE


def recommend_technique(
    complexity: ComplexityLevel,
    domain: Domain,
    question: str
) -> List[str]:
    """
    Recommend reasoning techniques based on complexity and domain.

    Returns:
        List of recommended technique names
    """
    question_lower = question.lower()
    techniques = []

    if complexity == ComplexityLevel.SIMPLE:
        techniques.append("Direct Prompting")

    elif complexity == ComplexityLevel.MODERATE:
        techniques.append("Few-Shot Chain-of-Thought (best quality)")
        techniques.append("Zero-Shot CoT (quick alternative)")
        if domain != Domain.GENERAL:
            techniques.append("Domain-Adapted CoT")

    elif complexity == ComplexityLevel.COMPLEX:
        # Check for exploration needs
        if any(kw in question_lower for kw in ['design', 'create', 'develop']):
            techniques.append("Tree of Thoughts (if cost acceptable)")
            techniques.append("Algorithm of Thoughts (cost-efficient alternative)")

        # Check for principle-based needs
        if domain in [Domain.SCIENCE, Domain.MATHEMATICS, Domain.PHILOSOPHY]:
            techniques.append("Step-Back Prompting")

        # Multi-perspective for complex analysis
        techniques.append("Multi-Perspective Analysis (2-3 perspectives)")

        # Reliability for high-stakes
        techniques.append("Self-Consistency (n=5) for reliability")

    elif complexity == ComplexityLevel.EXPERT:
        techniques.append("Full AI Board Framework:")
        techniques.append("  - Multi-Perspective Analysis (4-5 perspectives)")
        techniques.append("  - Tree of Thoughts (if exploratory)")
        techniques.append("  - Self-Consistency validation")
        techniques.append("  - Constitutional AI principles")
        techniques.append("  - Iterative refinement")
        techniques.append("  - Complete verification stack")

    # Domain-specific additions
    if domain == Domain.MEDICINE:
        techniques.append("⚠️  REQUIRED: Medical safety verification + disclaimer")
    elif domain == Domain.LAW:
        techniques.append("⚠️  REQUIRED: Legal disclaimer + jurisdiction specification")

    return techniques


def analyze_question(question: str) -> Dict:
    """
    Comprehensive question analysis.

    Args:
        question: The question to analyze

    Returns:
        Dictionary containing analysis results
    """
    # Detect domain
    domain = detect_domain(question)

    # Estimate steps
    steps = count_reasoning_steps_estimate(question)

    # Assess consequences
    consequences = assess_consequences(question, domain)

    # Classify complexity
    complexity = classify_complexity(steps, domain, consequences, question)

    # Recommend techniques
    techniques = recommend_technique(complexity, domain, question)

    # Estimate cost multiplier
    cost_multipliers = {
        ComplexityLevel.SIMPLE: "1x",
        ComplexityLevel.MODERATE: "3-30x",
        ComplexityLevel.COMPLEX: "30-300x",
        ComplexityLevel.EXPERT: "300-600x"
    }

    return {
        'question': question,
        'domain': domain.value,
        'estimated_steps': steps,
        'consequences': consequences,
        'complexity': complexity.value,
        'recommended_techniques': techniques,
        'estimated_cost': cost_multipliers[complexity]
    }


def print_analysis(analysis: Dict) -> None:
    """Pretty print the analysis results."""
    print("\n" + "="*70)
    print("AI BOARD COMPLEXITY ANALYSIS")
    print("="*70)
    print(f"\nQuestion: {analysis['question']}")
    print(f"\nDomain: {analysis['domain']}")
    print(f"Estimated Reasoning Steps: {analysis['estimated_steps']}")
    print(f"Error Consequences: {analysis['consequences']}")
    print(f"\n>>> COMPLEXITY LEVEL: {analysis['complexity']} <<<")
    print(f"\nEstimated Cost: {analysis['estimated_cost']} baseline")
    print("\nRecommended Techniques:")
    for i, technique in enumerate(analysis['recommended_techniques'], 1):
        print(f"  {i}. {technique}")
    print("\n" + "="*70 + "\n")


def main():
    """Example usage and testing."""
    test_questions = [
        "What is the capital of France?",
        "If a train travels 120 miles in 2 hours, what is its average speed?",
        "Design a recommendation system for e-commerce with real-time personalization.",
        "A 45-year-old patient presents with chest pain and elevated troponin. What is your assessment?",
        "Prove that there are infinitely many prime numbers.",
        "Explain the philosophical debate between free will and determinism."
    ]

    print("\nAI Board Complexity Analyzer - Test Suite\n")

    for question in test_questions:
        analysis = analyze_question(question)
        print_analysis(analysis)


if __name__ == "__main__":
    main()
