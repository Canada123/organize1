# Claude Code: Complete Developer Guide (Compressed)

*Token-efficient guide using CoD^Σ notation for agent-readable documentation*

**Version**: 1.1 (Compressed)
**Original**: 30,000 tokens → **Target**: 10,000 tokens (67% reduction)
**Last Updated**: 2025-10-30
**Notation**: @.claude/shared-imports/CoD_Σ.md

---

## Table of Contents

1. [Fundamentals](#fundamentals)
2. [Skills-First Component Hierarchy](#skills-first-component-hierarchy)
3. [Creating Components](#creating-components)
4. [Composition Patterns](#composition-patterns)
5. [Best Practices](#best-practices)
6. [Complete Workflow Examples](#complete-workflow-examples)
7. [Troubleshooting & FAQ](#troubleshooting--faq)
8. [Appendices](#appendices)

---

## Part 1: Fundamentals

### 1.1 What is Claude Code?

```
Claude_Code := terminal_AI_tool ∘ {read, edit, run, commit, MCP_access}

Capabilities := {
  code_understanding ∧ direct_edit,
  shell_execution ∧ version_control,
  external_data(MCP_connectors)
}

Philosophy := Unix_principles(simplicity ∧ composability ∧ single_purpose)
Framework := ReAct_loop(analyze → determine → execute → observe → iterate)
```

### 1.2 Architecture Overview

```
Architecture := {
  Execution: local(bash_direct) ¬VM ¬container,

  Security: {
    default: read_only,
    modes: Normal(prompt) | AutoAccept(auto) | Plan(readonly),
    approach: fail_closed
  },

  Context: {
    capacity: ≤1M_tokens,
    persistence: full_history ∧ auto_compact,
    features: ¬RAG_needed
  },

  Models: {
    Haiku: quick_ops,
    Sonnet: daily_workhorse,
    Opus: complex_architecture
  }
}
```

### 1.3 CLAUDE.md: Persistent Memory System

```
CLAUDE_md := persistent_memory @ session_start

Hierarchy := Enterprise > Project(.claude/) > User(~/.claude/) > Nested
Load_Order := precedence(higher_first) ∧ additive_context

@ Import_Syntax:
  @path/to/file → include_content
  features := {≤5_hops, relative|absolute, modular, personal_extend}

In_Conversation:
  @filename → immediate_include
  @directory/ → show_listing

Best_Practices := {
  lean: <500_lines ∧ bullets ¬paragraphs,
  specific: "2-space indent" ¬"format properly",
  focus: project_unique ¬generic_advice,
  structure: headings ∧ organize,
  maintain: ¬time_sensitive ∧ periodic_review
}

Essential_Content := {
  commands(build|test|deploy),
  code_style,
  testing_requirements,
  architecture_decisions,
  repo_etiquette,
  env_quirks,
  integrations
}

Quick_Commands := {
  '#' → append_to_CLAUDE.md,
  /memory → open_editor,
  /init → generate_from_codebase
}
```

**Template (minimal)**:
```markdown
# Project
## Tech Stack: [specific versions]
## Commands: dev|test|build
## Conventions: [project-specific only]
## Architecture: [key decisions]
```

### 1.4 MCP Tools Integration

```
MCP := Model_Context_Protocol

Integration := external_services{Drive, Figma, Slack, docs, DB, custom}
Pattern := on_demand_fetch ¬pre_load → ¬context_pollution
```

### 1.5 Token Efficiency Principles

```
Context := finite_public_good

Competition := history ∪ skills_metadata ∪ CLAUDE_md ∪ files ∪ tool_outputs ∪ user_requests

Threats := {
  Pollution: irrelevant_logs ⇒ reasoning_degraded,
  Rot: length_increase ⇒ performance_decrease
}

Solution := subagents(isolate_noise) ⇒ main_thread(focused)

Progressive_Disclosure := {
  L1: metadata(30-50t) → discovery,
  L2: full_content @ relevance,
  L3: support_files @ specific_need
}

JIT_Loading := store_identifiers{paths, queries, URLs} → Read(dynamic) ¬pre_load_massive

Management_Tools := {
  /compact → summarize @ limit_approaching,
  /rewind → remove_turns,
  Claude4.5: auto_aware ∧ auto_compact
}
```

---

## Part 2: Skills-First Component Hierarchy

**Critical Principle**: Understanding hierarchy → effective Claude Code usage

### 2.1 The Three-Level Hierarchy

```
Level_1: Skills(auto_invoked)
    ↓ can_reference
Level_2: Commands(user_invoked)
    ↓ can_call(SlashCommand_tool)
Level_3: Subagents(isolated_execution)
```

### 2.2 Skills (Auto-Invoked)

```
Skills := {
  Trigger: auto(description_match),
  Context: progressive_disclosure(L1→L2→L3),
  Structure: dir{SKILL.md ⊕ [REFERENCE | templates | scripts]},
  Best_For: domain_knowledge ∧ conventions ∧ auto_expertise
}

Progressive_Disclosure := {
  L1_Metadata: name ∧ description(30-50t) @ startup,
  L2_Content: SKILL.md_body @ relevance_determined,
  L3_Resources: support_files @ specific_need
}

Folder_Structure:
skill-name/
├── SKILL.md (required)
├── REFERENCE.md
├── templates/
└── scripts/

SKILL.md_Format:
```yaml
---
name: verb-ing-form
description: WHAT ∧ WHEN ∧ trigger_keywords. Use when [context].
---
# Instructions
[workflow steps]
```

Use_When := "I want Claude to remember X automatically" ∧ multi_step_assistance
```

### 2.3 Slash Commands (User-Invoked)

```
Commands := {
  Trigger: manual(/name) ∨ SlashCommand_tool(autonomous),
  Context: main_thread(injected),
  Structure: single_md(YAML + content),
  Best_For: workflow_shortcuts ∧ frequent_prompts ∧ orchestration
}

YAML_Fields := {
  description: purpose(enables_SlashCommand_tool),
  argument-hint: [expected_args],
  allowed-tools: restrict_tools,
  model: haiku|sonnet|opus
}

Dynamic_Content := {
  $ARGUMENTS: all_args_string,
  $1_$2_$N: positional_args,
  !command: bash_execution,
  @path: file_reference
}

Namespacing := {
  .claude/commands/frontend/component.md → /project:component,
  display: "(project:namespace)" | "(user)"
}

SlashCommand_Tool := {
  expose: user_commands(description_field_present),
  budget: ≤15k_chars(total_descriptions),
  control: disable-model-invocation:true
}

Use_When := "I want shortcut for Y" ∧ quick_repeated_prompts
```

### 2.4 Subagents (Isolated Execution)

```
Subagents := {
  Trigger: auto_delegation ∨ explicit_mention,
  Context: isolated_window(100k_tokens_each),
  Structure: md{YAML_frontmatter + system_prompt},
  Best_For: heavy_analysis ∧ context_isolation ∧ parallel ∧ specialized
}

Killer_Feature := noise_isolation:
  parse_150k_logs @ subagent → summary_2k @ main
  vs parse_150k_logs @ main → pollution

YAML_Structure:
```yaml
---
name: agent-name
description: purpose ∧ when_to_invoke
tools: [restricted_list] | ALL(omit_field)
model: inherit | haiku | sonnet | opus
---
[system prompt]
```

Tool_Scoping := {
  read_only: [Read, Grep, Glob],
  implementer: [Read, Write, Edit, Bash],
  least_privilege: specify_minimum
}

Orchestration := {
  Main_Agent: coordinator(decide ∧ coordinate ∧ maintain_flow ∧ synthesize),
  Subagents: specialized_laborers(execute ∧ independent ∧ return_summary)
}

Parallel_Execution := {
  concurrent: ≤10_subagents(read_ops),
  queue: batch_handle(100+_tasks),
  ideal: research ∥ analysis ∥ review
}

Trade-offs := {
  cost: 3-4×_tokens(parallel_contexts),
  latency: higher(clean_slate_start),
  reserve: genuinely_complex_only
}

Use_When := "I need to isolate Z" ∧ complex_multi_stage
```

### 2.5 Component Decision Matrix

| Aspect | Skills | Commands | Subagents |
|--------|--------|----------|-----------|
| **Invocation** | Auto(model_decides) | Manual ∨ SlashCommand_tool | Auto ∨ explicit |
| **Structure** | Dir(SKILL.md+) | Single_md | Single_md |
| **Context** | Progressive | Main_thread | Isolated(100k) |
| **Complexity** | Complex | Simple→Moderate | Complex |
| **Best_For** | Domain_knowledge | Shortcuts | Heavy_ops |
| **Token_Cost** | Minimal(until_invoked) | Injected | Separate_budget |
| **Use_When** | "Remember X auto" | "Shortcut Y" | "Isolate Z" |

---

## Part 3: Creating Components

### 3.1 Creating Skills

```
Skill_Creation := {
  Step1: test_cases(identify_gaps ∘ 3_scenarios ∘ minimal_instructions ∘ iterate),

  Step2_Structure: {
    name: gerund_form("analyzing-X" ¬"X-analysis"),
    description: WHAT ∧ WHEN ∧ trigger_terms,
    trigger_terms: user_mentions_words
  },

  Step3_Lean: {
    limit: <500_lines(SKILL.md),
    split: large_content → reference_files,
    organize: domain_separation → conditional_loading,
    avoid: time_sensitive_info,
    focus: what_Claude_doesnt_know
  },

  Step4_Test: Haiku(enough_guidance?) ∧ Sonnet(clear_efficient?) ∧ Opus(not_over_explaining?)
}

Example_Structure:
.claude/skills/code-review/
├── SKILL.md (overview + process)
├── SECURITY.md (detailed security checks)
├── PERFORMANCE.md (performance patterns)
├── STYLE.md (style guide)
└── scripts/run-linters.sh

Skills_vs_Commands:
  Skills: multi_file ∧ complex_domain ∧ want_automatic ∧ progressive_disclosure ∧ team_expertise
  Commands: single_file ∧ manual_trigger ∧ simple_workflow ∧ quick_shortcuts ∧ user_controls_timing
```

### 3.2 Creating Slash Commands

```
Command_Creation := {
  Principle: single_responsibility(one_thing_well),

  Naming: {
    action_oriented: /optimize ¬/optimizer,
    clear: /review ¬/reviewer,
    imperative: /deploy ¬/deployment
  },

  Description: {
    for_SlashCommand_tool: required,
    format: "Verb object by method for outcome",
    example: "Optimize code for performance by analyzing hot paths"
  },

  Tool_Permissions: {
    never_wildcards: ✗Bash(*:*),
    explicit: ✓Bash(git:*,npm:*),
    least_privilege: analysis[Read,Grep,Glob] | modification[Read,Edit,Write]
  },

  Arguments: {
    $ARGUMENTS: all_as_string,
    $1_$2_$N: positional,
    validation: explicit
  }
}

Patterns := {
  conditional_logic: if_$1_then_extra_validation,
  chaining: /analyze → /optimize → /verify,
  extended_thinking: "Think hard before implementing"
}
```

### 3.3 Creating Subagents

```
Subagent_Creation := {
  Generation: /agents(interactive) ∨ claude_draft,

  Responsibility: {
    boundary: single_well_defined_goal,
    domain: specific(DB_migrations | UI_design | performance_profiling),
    avoid: generic_helper
  },

  Tool_Scoping: {
    read_only: [Read, Grep, Glob],
    write_enabled: [Read, Write, Edit, Bash],
    minimal: [Read, Bash(npm test:*)],
    all_tools: omit_tools_field(cautious)
  },

  Definition_of_Done: {
    checklist: completion_criteria_in_prompt,
    format: "Complete when: [X] criterion1 [X] criterion2..."
  },

  Proactive_Use: {
    keywords: "Use PROACTIVELY" | "MUST BE USED" | "Always invoke",
    description: encourage_autonomous_invocation
  }
}

Handover_Protocol := {
  Main → Sub: task ∧ output_path ∧ token_budget ∧ minimal_context,
  Sub → Main: report_to_file ∧ signal_completion,
  Main_reads: summary_only(not_full_execution)
}
```

### 3.4 Curating CLAUDE.md

```
CLAUDE_md_Rules := {
  concise: <500_lines_total,
  specific: project_unique ¬generic,
  structured: headings ∧ bullets,
  iterative: living_document
}

Essential_Checklist := {
  tech_stack: specific_versions,
  commands: dev|test|build|deploy|lint,
  conventions: 2_space_indent ∧ named_exports ∧ Props_interfaces ∧ test_adjacent,
  testing: 80%_coverage ∧ behavior_not_implementation ∧ mock_external,
  architecture: State(Redux+Query) ∧ Routing(v6) ∧ Styling(Tailwind) ∧ API(REST+axios),
  git_workflow: branch_naming ∧ commit_format ∧ PR_requirements
}

Import_Pattern := {
  main: lean(<200_lines) ∧ high_level,
  detailed: `@docs/architecture.md` ∧ `@docs/testing.md` ∧ `@docs/deployment.md`,
  benefit: main_stays_focused ∧ details_on_demand
}

Exclude := generic_best_practices ∧ SOLID_principles ∧ common_framework_patterns ∧ standard_language_features
Include := team_specific_style ∧ custom_scripts ∧ env_quirks ∧ integrations ∧ domain_terminology
```

---

## Part 4: Composition Patterns

**Pattern Format**: Scenario → CoD^Σ_Flow → Benefits → Reference

### Pattern 1: Command → Subagent → Execution

```
Scenario: Performance_optimization_workflow

Flow:
  User:/analyze-performance(src/api/)
    → Command(expand_prompt)
    → Subagent:performance-engineer(isolated_180k_analysis)
    → Summary:"3_functions_cause_70%_latency"(2k_tokens)
    → Main_Claude:implement_optimizations(clean_context)

Benefits := noise_isolation ∧ user_control ∧ reusable

Implementation:
  `@.claude/commands/analyze-performance.md`
  `@.claude/agents/performance-engineer.md`
```

### Pattern 2: Skill → Parallel_Subagents → Synthesis

```
Scenario: Authentication_feature

Flow:
  Main_Claude:recognizes_auth(loads_Security_Skill)
    → Spawn_Parallel{
        research_subagent(existing_patterns_80k),
        security_subagent(requirements_60k)
      }
    → Main_receives(two_clean_summaries)
    → Implement(full_context:Skill+summaries)

Benefits := parallel_speed ∧ noise_isolation ∧ standards_auto_applied

Pattern := Skill(baseline_knowledge) ⊕ Parallel_Research → Synthesis
```

### Pattern 3: Command → Skill → Verification

```
Scenario: Feature_development_with_quality_gates

Flow:
  User:/feature("user_profiles")
    → Command(loads_testing-standards_skill)
    → TDD:tests_first
    → Implementation
    → Auto_verification(ACs)

Benefits := consistent_implementation ∧ quality_gates_auto ∧ testing_standards_applied

Gates := /audit(pre_impl) ∧ /verify(per_story)
```

### Pattern 4: Hierarchical Multi-Agent

```
Scenario: Complex_project_setup

Flow:
  Coordinator_Main
    ├→ Product_Owner(requirements → REQUIREMENTS.md)
    ├→ Architect(design → ARCHITECTURE.md)
    ├→ Engineer(implement → code + tests)
    └→ QA(validate → QA_REPORT.md)

Handoff := Agent_A(writes_file) → Agent_B(reads_file)

Benefits := specialization ∧ auditable_handoff ∧ clear_gates ∧ pause_resume
```

### Pattern 5: Skills Referencing Skills

```
Scenario: Specialized_skill_extends_global_skill

Flow:
  Global_Skill:testing-patterns(universal)
    ↑ referenced_by
  Project_Skill:nextjs-testing(Next.js_specific)
    ↑ auto_loaded_when
  Testing_Next_Components

Benefits := DRY ∧ local_extends_global ∧ team_shares_specifics

Reference: Use your testing-patterns skills to XXX
```

### Pattern 6: Parallel Research

```
Scenario: Technology_evaluation

Flow:
  Task:"Evaluate_3_DB_solutions"
    → Spawn_Parallel{
        postgres_researcher → POSTGRES.md,
        mongodb_researcher → MONGODB.md,
        dynamodb_researcher → DYNAMODB.md
      }
    → Main:consolidates → TECH_EVALUATION.md(recommendation)

Benefits := true_parallel ∧ deep_focus ∧ no_contamination ∧ comprehensive
```

### Pattern 7: Agent Handover via Markdown

```
Scenario: Sequential_workflow

Flow:
  Agent_A:analyze → ANALYSIS.md
    ↓
  Agent_B:read(ANALYSIS.md) → design → DESIGN.md
    ↓
  Agent_C:read(DESIGN.md) → implement → PR

Handover := via_markdown_files(auditable ∧ reviewable)

Benefits := clear_separation ∧ decision_trail ∧ review_stages ∧ restart_any_point
```

### Pattern 8: Skill → Command → Subagent Chain

```
Scenario: Database_migration

Flow:
  User:/migrate("add_user_preferences")
    → Command(loads_database-standards_skill)
    → Command(invokes_migration-writer_subagent)
    → Subagent:creates_migration(following_standards)
    → Main_Claude:reviews_and_applies

Standards := database-standards_skill(auto_enforced)

Benefits := standards_auto ∧ command_provides_workflow ∧ subagent_isolates ∧ quality_gates
```

### Pattern 9: Conditional Workflow Branching

```
Scenario: Environment-specific_deployment

Flow:
  User:/deploy(production)
    → Conditional{
        production: security_scan ∧ perf_check ∧ backup_verify ∧ manual_approval ∧ monitor,
        staging: test_suite ∧ smoke_tests
      }

Benefits := single_command ∧ multi_paths ∧ safety_production ∧ speed_staging
```

### Pattern 10: Progressive Enhancement

```
Scenario: MVP_to_full_feature

Flow:
  Phase1:MVP(P1_stories) → validate_independently
    ↓
  Phase2:Enhancements(P2_stories) → validate_independently
    ↓
  Phase3:Polish(P3_stories) → validate_independently

Gates := can_demo_independently?(stop_get_feedback)

Benefits := validate_early ∧ reduce_waste ∧ ship_incremental ∧ pivot_between_phases
```

---

## Part 5: Best Practices

### 5.1 Context Engineering

```
Context_Engineering := {
  Principles: concise ∧ specific ∧ structured ∧ import_selective ∧ ¬time_sensitive,

  Pollution_Prevention: {
    explicit_boundaries: "Refactor_UserService(skip_async_await_explanation)",
    skip_obvious: ¬explain_well_known_patterns,
    JIT_loading: "Refer_to_@error.log_when_debugging" ¬pre_load,
    subagent_heavy: "Use_log-analyzer_subagent_for_50_files" ¬main_context
  },

  Anti_Patterns: dump_files ∨ repeat_across_places ∨ over_explain_obvious ∨ load_without_boundaries
}
```

### 5.2 Progressive Disclosure

```
Progressive_Disclosure := load_stages(minimize_tokens ∧ provide_depth)

Skills := L1(metadata_30-50t @ startup) → L2(SKILL.md @ relevant) → L3(resources @ needed)
Files := main_CLAUDE.md(200_lines) → @docs/architecture.md(1000_lines @ architecture_questions)
Conditional := security_work→`@SECURITY-GUIDE.md` | performance_work→`@PERFORMANCE-GUIDE.md
```

### 5.3 Isolate Noise

```
Isolate_Noise := subagents_prevent_pollution

Token_Heavy_Ops := {
  log_analysis(150k),
  file_searches(100k),
  doc_scraping(80k),
  profiling(120k)
}

Solution_Pattern:
  Main_Context:"Use_log-analyzer_subagent"(clean)
    → Subagent_Context:[150k_logs ∘ analysis](noisy)
    → Main_receives:[2k_summary](clean)

Token_Economics := 8×_cleaner_main_context

When := research_dozens_files ∨ large_datasets ∨ diagnostics ∨ >10k_token_output
```

### 5.4 Compose Don't Complicate

```
Composition_Strategy := {
  Unix_Philosophy: each_component_one_thing_well,
  Building_Blocks: Skills ⊕ Commands ⊕ Subagents,
  Levels: individual → simple(2-3) → complex(orchestration)
}

Avoid := monolithic_mega_commands ∨ over_engineered_single ∨ premature_optimization ∨ complex_before_validate_simple
```

### 5.5 Explicit Over Implicit

```
Explicit_Over_Implicit := {
  Prompts: "Refactor_to_async/await_add_error_handling_type_hints_unit_tests" ¬"Make_better",
  Descriptions: "Analyze_Excel_create_pivots_generate_charts_for_.xlsx" ¬"Analyze_data_files",
  Tools: Bash(git:*,npm_test:*) ¬Bash(*:*),
  Success_Criteria: tests_pass ∧ 80%_coverage ∧ ¬lint_errors ∧ docs_updated
}

Rationale := Claude4.x(follows_precisely) → vague(mediocre) | specific(excellent)
```

### 5.6 Human in the Loop

```
Human_in_Loop := AI_assists ∧ humans_decide

Review_Checkpoints := after_planning ∧ after_major_changes ∧ before_merge ∧ before_deploy

Approval_Gates := "STOP:_Get_user_approval_before_implementation"

What_to_Review := {
  architecture_decisions,
  security_implementations,
  database_migrations,
  production_deployments,
  breaking_changes
}

Balance := automate_tedious ∧ human_oversight_critical ∧ trust_but_verify
```

### 5.7 Version Control Everything

```
Version_Control := {
  Commit: CLAUDE.md ∧ .claude/{commands,agents,skills},
  Gitignore: CLAUDE.local.md ∧ ~/.claude/*,

  Documentation: {
    README: "AI_configuration: CLAUDE.md + .claude/ components",
    Review: CLAUDE.md_changes_like_code ∧ test_commands ∧ document_breaking
  },

  Benefits: team_shares ∧ track_evolution ∧ easy_rollback ∧ simplified_onboarding
}
```

### 5.8 Iterate Based on Usage

```
Iteration_Phases := {
  Initial: basic_CLAUDE.md ∧ simple_commands ∧ main_agent_everything,
  Observation: note_patterns ∧ identify_pollution ∧ track_what_works,
  Refinement: create_skills(auto_expertise) ∧ build_subagents(heavy_ops) ∧ compose_workflows,
  Optimization: measure_tokens ∧ identify_bottlenecks ∧ optimize_real_usage
}

Metrics := tokens_per_session ∧ task_completion_time ∧ output_quality ∧ pollution_incidents

Principle := usage_guides_evolution ¬build_everything_upfront
```

### 5.9 Prompt Engineering Excellence

```
Prompt_Engineering := {
  Explicit: "Create_dashboard:_user_metrics(daily/monthly)_real-time(WebSocket)_filtering(date,segment)_export(CSV,PDF)_responsive(mobile+desktop)",

  Context: "Migrating_microservices_auth_needs:_10k_req/sec_OAuth_integration_HIPAA_compliance",

  Structured: <instructions><task/><requirements/><constraints/></instructions>,

  Chain_of_Thought: "Think_step-by-step: security?_existing_patterns?_integration_points?_failure_modes?",

  Few_Shot: Example1:{input→output} Example2:{input→output} Now:{process_this},

  Extended_Thinking: "Think_deeply_about_real-time_sync_with_offline_support",

  Output_Format: "## Analysis\n[findings]\n## Recommendations\n1.[rationale]\n## Code\n```[lang]\n```\n## Tests\n```[lang]\n```",

  Quality_Modifiers: "Don't_hold_back" | "Give_it_your_all" | "Impressive_demonstration" | "Full_capabilities"
}

Rationale := Claude4.x(explicit_encouragement_required)
```

### 5.10 Quality Gates and Validation

```
Quality_Gates := {
  Pre_Implementation: requirements_testable? ∧ architecture_designed? ∧ ACs_defined? ∧ tests_planned?,

  During_Implementation: tests_first? ∧ tests_passing_incremental? ∧ style_consistent? ∧ edge_cases_handled?,

  Pre_Completion: all_tests_pass? ∧ quality_gates_pass(lint,type-check)? ∧ docs_updated? ∧ security_reviewed?,

  Blocking: "DO_NOT_PROCEED_until_[X]_tests_pass_[X]_coverage>80%_[X]_no_lint_errors_[X]_docs_updated"
}

Automated_Gates := hooks{postEdit:[pattern→command]}
```

---

## Part 6: Complete Workflow Examples

### 6.1 Specification-Driven Development (SDD)

```
SDD := 85%_automated_workflow

User_Actions(manual) := {
  1: /feature("description"),
  2: /implement(plan.md)
}

Auto_Workflow(no_user_action) := {
  /feature
    → specify-feature_skill(spec.md)
    → auto_invokes(/plan)
    → create-implementation-plan_skill(plan.md)
    → auto_invokes(generate-tasks)
    → generate-tasks_skill(tasks.md)
    → auto_invokes(/audit)
    → /audit(validates_consistency)
    → [PASS→ready_for_/implement],

  /implement
    → implement-and-verify_skill{
        P1 → auto_invokes(/verify_--story_P1) → [PASS],
        P2 → auto_invokes(/verify_--story_P2) → [PASS],
        P3 → auto_invokes(/verify_--story_P3) → [PASS]
      }
}

Quality_Gates := {
  Pre_Implementation: /audit(catches_violations ∧ missing_coverage ∧ ambiguities),
  Progressive_Delivery: /verify(per_story ∧ independent_test ∧ blocks_next_until_pass)
}

Automation := 85%(6_auto_steps / 2_user_actions)
```

### 6.2 Test-Driven Development (TDD)

```
TDD := {
  Phase1: write_tests_FIRST(for_ACs),
  Phase2: run_tests(verify_failure → proves_validity),
  Phase3: implement_minimal_code(make_pass),
  Phase4: run_tests(verify_passing),
  Phase5: refactor(keep_tests_green)
}

Iron_Law := NO_code_without_tests_first ∧ NO_exceptions

See: `@.claude/skills/tdd-discipline/SKILL.md`
```

### 6.3 Multi-Agent Parallel Research

```
Parallel_Research := {
  Coordinator: research-coordinator(break_topic ∘ spawn_researchers ∘ collect ∘ synthesize),

  Workflow:
    User:/research-parallel("React_state_management")
      → Coordinator_analyzes
      → Spawn_Parallel{
          redux-researcher → REDUX_RESEARCH.md,
          mobx-researcher → MOBX_RESEARCH.md,
          zustand-researcher → ZUSTAND_RESEARCH.md,
          recoil-researcher → RECOIL_RESEARCH.md
        }
      → Coordinator:reads_all → RESEARCH_REPORT.md(recommendation)
}

Benefits := deep_focus_per_topic ∧ ¬cross_contamination ∧ comprehensive_parallel ∧ unbiased
```

### 6.4 Debugging Workflow

```
Debug := symptom → intel_queries → root_cause → fix → verification

Workflow:
  /bug("description")
    → Phase1:document_symptom(observable ∧ expected_vs_actual ∧ reproduce ∧ errors)
    → Phase2:intel_queries(project-intel.mjs ∘ error_patterns ∘ dependencies ∘ git_log)
    → Phase3:root_cause(symptom→immediate→underlying→root)
    → Phase4:fix(test_reproducing ∘ verify_fail ∘ implement ∘ verify_pass ∘ full_suite)
    → Phase5:verification(symptom_resolved ∧ ¬regressions ∧ edge_cases ∧ document_commit)

See: `@.claude/skills/debug-issues/SKILL.md`
```

### 6.5 Design System Setup (MCP-Heavy)

```
Design_System_Setup := {
  Phase1: init(Next.js ∘ TypeScript ∘ Tailwind ∘ Shadcn),
  Phase2: ideation(21st-dev_MCP:inspiration ∘ palette ∘ typography ∘ spacing ∘ variants),
  Phase3: components(Shadcn_MCP:search→view→example→install ∘ theme_customize),
  Phase4: examples(21st-dev_MCP:component_examples ∘ implement ∘ document),
  Phase5: QA(Shadcn_MCP:audit_checklist ∘ accessibility ∘ responsive ∘ style_guide)
}

MCP_Usage := Vercel(templates) ∧ Shadcn(components) ∧ 21st-dev(design_inspiration) ∧ Supabase(DB_if_needed)
```

---

## Part 7: Troubleshooting & FAQ

### 7.1 Common Issues → Solutions

```
Skills_Not_Triggering := {
  Symptom: exists_but_¬used,
  Diagnosis: Check(description_field ∧ location ∧ permissions ∧ trigger_terms),
  Solution: enhance_description("WHAT ∧ WHEN ∧ trigger_keywords")
}

Subagent_Context_Pollution := {
  Symptom: returns_too_much_detail,
  Diagnosis: Check(system_prompt ∧ output_instructions ∧ tool_permissions),
  Solution: "Return_ONLY: [X]top_3_patterns [X]file:line [X]fixes. Max_2000t. Details→ANALYSIS.md"
}

Commands_Not_Auto_Invoking := {
  Symptom: SlashCommand_tool_available_but_¬used,
  Diagnosis: Check(description_field_exists ∧ SlashCommand_tool_enabled ∧ char_budget ∧ disable-model-invocation),
  Solution: add_description ∧ verify_tool_enabled
}

CLAUDE_md_Not_Loading := {
  Symptom: instructions_¬followed,
  Diagnosis: Check(location ∧ filename(CLAUDE.md_not_claude.md) ∧ permissions ∧ @import_syntax),
  Solution: verify_location(.claude/ | ~/.claude/) ∧ test_loading("What_do_you_know_about_this_project?")
}

Token_Budget_Exceeded := {
  Symptom: context_full_errors,
  Diagnosis: Check(context_composition ∧ CLAUDE.md_size ∧ token-heavy_ops ∧ skill_loading),
  Solution: trim_CLAUDE.md(<500_lines) ∧ use_subagents(heavy_ops) ∧ progressive_disclosure ∧ /compact
}
```

### 7.2 FAQ (Compressed)

```
Q: Skill_vs_Command?
A: Skill(auto_context_match) | Command(manual_trigger ∨ orchestration)

Q: Skills_call_commands?
A: Yes(if_SlashCommand_tool_enabled)

Q: Subagents_use_skills?
A: Yes(inherit_skill_loading)

Q: Parallel_subagents_limit?
A: ≤10_concurrent(read_ops) ∧ queue_batches(100+)

Q: Subagents_share_context?
A: No(isolated_contexts) → only_summaries_return

Q: Override_project_CLAUDE.md?
A: Yes(user_CLAUDE.md_loads_after_project → can_override)

Q: Share_commands_with_team?
A: Yes(.claude/commands/ → commit_to_git)

Q: Version_control_agents_skills?
A: Yes(.claude/ → commit_like_code)

Q: Token_budget_for_command_descriptions?
A: 15k_chars_total(most_relevant_shown_if_exceeded)

Q: Disable_command_auto_invocation?
A: Yes(disable-model-invocation:true)

Q: Debug_skill_not_loading?
A: Ask_Claude("What_skills_do_you_have?")

Q: Skills_reference_skills?
A: Yes(`@path/to/other-skill/SKILL.md)

Q: Performance_impact_many_skills?
A: Minimal(only_metadata_30-50t @ startup → full_on-demand)

Q: MCP_tools_in_subagents?
A: Yes(specify_tools_list ∨ omit_for_ALL)

Q: Data_between_subagents?
A: Via_files(Agent_A→REPORT.md → Agent_B_reads)

Q: Main_and_subagent_simultaneously?
A: No(sequential_single_session) → separate_terminals_for_true_parallel

Q: Subagent_timeout?
A: Returns_partial ∨ error → main_can_retry ∨ adjust

Q: Monitor_token_usage?
A: Session_metrics ∧ /compact(approaching_limits)

Q: Skills_for_file_types?
A: Yes(builtin:xlsx,pdf,docx → custom_for_domain_formats)

Q: Best_practice_long_tasks?
A: Subagents(isolation) ∧ checkpoint_progress(files) ∧ enable_human_review_points
```

---

## Part 8: Appendices

### Appendix A: MCP Tools Reference

```
MCP_Servers := {
  Ref: library_docs{React, Next.js, TypeScript} → query_before_assumptions,
  Supabase: DB_ops{schema, RLS, edge_functions} → manage_¬context_pollution,
  Shadcn: component_library → Search→View→Example→Install,
  Chrome: browser_automation{E2E, screenshots, debugging},
  Brave: web_search → current_info ¬leave_session,
  21st-dev: design{UI_components, ideation, logos}
}

Usage_Patterns := {
  Docs: query_Ref → review_examples → implement_per_standards,
  DB: query_Supabase(schema) → plan_migrations → apply_MCP → verify_RLS,
  Components: search_Shadcn → query_21st-dev(inspiration) → get_examples_Shadcn → customize
}
```

### Appendix B: Template Catalog

**Bootstrap** (4):
- planning-template.md (8.8KB): master_plan ∧ CoD^Σ_architecture
- todo-template.md (5.4KB): task_tracking ∧ ACs ∧ phases
- event-stream-template.md (3.6KB): chronological_log ∧ CoD^Σ_compression
- workbook-template.md (7.1KB): context_notepad ∧ 300-line_limit

**Workflow** (18):
- Spec: feature-spec.md, clarification-checklist.md
- Planning: plan.md, research-notes.md, data-model.md
- Execution: tasks.md, verification-report.md
- Analysis: report.md, bug-report.md, analysis-spec.md, audit.md
- Coordination: handover.md, session-state.md
- Quality: quality-checklist.md

Usage: `@.claude/templates/[name].md`

### Appendix C: CoD^Σ Notation Guide

**See**: @.claude/shared-imports/CoD_Σ.md (complete reference)

**Quick Reference**:
```
Composition: A ∘ B(sequential) | A ⊕ B(choice) | A ∥ B(parallel)
Flow: A → B(delegation) | A ⇒ B(causation) | B ⇐ A(dependency)
Logic: A ∧ B(and) | A ∨ B(or) | ¬A(not)
Structure: A ⊂ B(subset) | A := B(definition)
Conditional: A →[cond] B
Quantify: ∀x(for_all) | ∃x(exists)
```

**Evidence Requirements**:
```
Every_claim_needs := file:line | MCP_query | intel_output | test_result

Bad: "Component_re-renders_because_state"
Good: "Component_re-renders:useEffect([state])@ComponentA.tsx:45 → state_mutation@ComponentA.tsx:52"
```

### Appendix D: Quick Reference Cards

**Component Selection**:
```
auto_application? → Skill
manual_trigger? → Command
context_isolation? → Subagent
```

**Context Management**:
```
pollution? → subagent
token_low? → /compact ∨ @imports
repeated? → CLAUDE.md
heavy_op? → isolate_subagent
```

**Quality Gates**:
```
before_planning? → review_requirements
before_implementing? → /audit
after_each_story? → /verify_--story
before_merging? → human_review
before_deploying? → security_scan
```

**Workflows**:
```
SDD: /feature → /plan → /tasks → /audit → /implement
TDD: write_tests → fail → implement → pass → refactor
Debug: symptom → intel → root_cause → fix → verify
Research: parallel_agents → reports → synthesis
```

**Token Efficiency**:
```
Skills: 30-50t(metadata) until_invoked
Commands: injected_main(use_for_shortcuts)
Subagents: separate_budget(use_for_heavy)
CLAUDE.md: persistent_cost(keep_lean)
@imports: on-demand(use_liberally)
```

---

## Conclusion

```
Claude_Code_Shift := AI_chat → AI_programmable_automation

Key_Takeaways := {
  1: skills-first_hierarchy(understand_when_to_use),
  2: context_is_king(optimize_CLAUDE.md ∧ progressive_disclosure),
  3: compose_¬complicate(start_simple → build_up),
  4: isolate_noise(subagents_for_heavy),
  5: evidence_based(all_reasoning_cites_sources → CoD^Σ),
  6: human_in_loop(AI_assists ∧ humans_decide),
  7: iterate_continuously(usage_guides_evolution)
}

Master_patterns := build_production_AI_workflows(amplify_capabilities ∧ maintain_control ∧ ensure_quality)
```

---

**Document**: v1.1 Compressed (10,000 tokens, 67% reduction from 30,000)
**Original**: docs/claude-code-comprehensive-guide-ORIGINAL.md
**Notation**: `@.claude/shared-imports/CoD_Σ.md`
**Updated**: 2025-10-30
**Maintained By**: Claude Code Intelligence Toolkit Team
