# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SKIIN Switzerland is a production-ready multi-language marketing website for Myant Health's Swiss heart health screening service, featuring comprehensive eligibility questionnaire, S&W Design system, and Swiss healthcare compliance.

## Memory System v2.0 (JSON-Based)

This project uses a tiered JSON memory system for efficient context management and agent coordination:

### JSON Memory Architecture

#### Core Memory Files (memory/)
- **memory/active.json** (8K tokens) - Current session state, active tasks, event logs
- **memory/patterns.json** (2K tokens) - Frequently used patterns with usage statistics
- **memory/knowledge.json** (32K tokens) - Configuration, troubleshooting, research
- **memory/decisions.json** (8K tokens) - Architecture decisions with confidence scores
- **memory/agent-groups.json** (8K tokens) - Agent organization and capabilities

#### Key Features
- **Tiered Storage**: 2K/8K/32K token boundaries for efficient context loading
- **Request Tracking**: Every operation includes request_id for traceability
- **Auto-Persistence**: Session state preserved across invocations
- **Confidence Scoring**: Patterns and decisions tracked with confidence metrics
- **TTL Management**: Automatic expiry for time-sensitive decisions

### Active Context Files
- **context/event-stream.md** - Event stream tracking all actions and observations
- **context/WORKFLOWS.md** - Workflow orchestration patterns and triggers
- **context/project-index.md** - High-level project overview and structure

**@context/project-index.md** deep dive --> For planning/analysis work, utilize:
- High-level overview from context/project-index.md
- Architectural structure from PROJECT_INDEX.json
- Clean tree view from context/project-tree.txt


**CRITICAL WORKFLOW:**
1. Check memory/active.json for current session state
2. Load relevant memory tier based on task complexity
3. Update memory/active.json with progress after each significant step
4. Record new patterns in patterns.json with confidence scores
5. Document decisions in decisions.json with TTL and confidence
6. Add troubleshooting to knowledge.json as issues arise 
   

**Important:** The JSON memory system automatically loads relevant tiers based on context needs. Session continuity is maintained through memory/active.json.

**Note:** Research artifacts and findings are stored permanently in memory/knowledge.json under the 'research' section for future reference.

### Memory System Management

**Automatic Synchronization:**
- Session state updates in real-time to memory/active.json
- Pattern usage statistics updated with each implementation
- Decision confidence scores adjusted based on outcomes
- Knowledge base expands automatically with troubleshooting

**Manual Synchronization Required:**
- After major architectural changes
- When deprecating patterns or decisions
- After significant feature implementations
- When reorganizing agent groups



## MCP Tools Integration

This project leverages Model Context Protocol (MCP) tools for enhanced capabilities. Each MCP serves specific purposes and should be used strategically.

### Core MCP Tools

#### 1. Serena MCP - Code Exploration & Symbolic Tools
**Purpose**: Precise code navigation and manipulation
**Key Tools**: 
- `mcp__serena__find_symbol` - Locate specific symbols in codebase
- `mcp__serena__search_for_pattern` - Find code patterns
- `mcp__serena__get_symbols_overview` - Get project structure overview
- `mcp__serena__find_referencing_symbols` - Find usage references
**Used By**: code-searcher, main agents, testing-qa-agent
**Best Practices**: Use for symbol-first navigation before file edits

#### 2. Supabase MCP - Database Operations
**Purpose**: All Supabase database interactions
**Key Tools**:
- `mcp__supabase__execute_sql` - Run SQL queries
- `mcp__supabase__list_tables` - View database structure  
- `mcp__supabase__apply_migration` - Apply schema changes
- `mcp__supabase__list_edge_functions` - Manage edge functions
**Used By**: supabase-architect, supabase-implementation-engineer
**Best Practices**: Always use for database operations instead of raw SQL

#### 3. Stripe MCP - Payment Integration
**Purpose**: Stripe payment processing
**Key Tools**:
- `mcp__stripe__create_customer` - Customer management
- `mcp__stripe__create_payment_intent` - Payment processing
- `mcp__stripe__search_stripe_documentation` - API documentation
**Used By**: main agent when handling payments
**Best Practices**: Use for all payment-related operations

#### 4. Playwright MCP - Frontend Testing
**Purpose**: E2E testing and visual validation (replaces Puppeteer)
**Key Tools**:
- `mcp__playwright__navigate` - Navigate to pages
- `mcp__playwright__screenshot` - Capture visual states
- `mcp__playwright__evaluate` - Execute browser JS
**Used By**: testing-qa-agent, main agent for visual verification
**Best Practices**: Use for all E2E testing and visual regression

#### 5. Brave Search MCP - External Research
**Purpose**: Online information gathering
**Key Tools**:
- `mcp__brave-search__brave_web_search` - General web search
- `mcp__brave-search__brave_local_search` - Local business search
**Used By**: researcher, brainstormer
**Best Practices**: Cross-reference multiple sources

#### 6. Context7 MCP - Library Documentation
**Purpose**: Fetch up-to-date library documentation
**Key Tools**:
- `mcp__context7__resolve-library-id` - Find library IDs
- `mcp__context7__get-library-docs` - Get documentation
**Used By**: researcher, code-searcher
**Best Practices**: Always check latest docs before implementation

#### 7. Calculator MCP - Mathematical Operations
**Purpose**: Complex calculations and metrics
**Key Tools**:
- `mcp__calculator__calculate` - Evaluate expressions
**Used By**: Any agent needing calculations
**Best Practices**: Use for all non-trivial calculations

#### 8. Package Version MCP - Dependency Management
**Purpose**: Check and manage package versions
**Key Tools**:
- `mcp__package-version__check_npm_versions` - NPM packages
- `mcp__package-version__check_python_versions` - Python packages
**Used By**: main agent, documentation-maintainer
**Best Practices**: Check before updating dependencies

### MCP Usage Patterns

1. **Code Modification Flow**:
   - Use Serena MCP to find symbols
   - Use Read/Edit tools for changes
   - Use Playwright MCP to verify UI changes

2. **Research Flow**:
   - Use Brave Search for general research
   - Use Context7 for library documentation
   - Document findings in memory/knowledge.json

3. **Database Flow**:
   - Use supabase-architect for design
   - Use Supabase MCP for implementation
   - Document schemas in specs/

4. **Testing Flow**:
   - Use testing-qa-agent for test design
   - Use Playwright MCP for E2E tests
   - Store results in memory/active.json

## Critical principles & guard-rails

1.  **Iteration > Creation**
    *Search, extend, parameterise, only then create.*
2.  **Design-system fidelity**
    Review the design system before any design work
3.  **Atomic components**
    New UI component → new file, ≤ 50 LOC, Tailwind + shadcn/ui.
4.  **Mobile-first** responsive design.
    Start at 375px, progressive enhancement to desktop.
5.  **Research-first methodology** – Always gather context (data schema, metrics, design guidelines) before writing code. Record findings in docs/research and reference the file in project-index.md.
6.  **Context priming & persistence** – At the start of each session, load relevant memory tiers from JSON files.
7.  **Component quality standards** – Components must be ≤ 50 LOC, adopt minimalistic aesthetic with consistent typography and accessible colors. Use 21st.dev design tokens by default; fall back to prebuilt shadcn/ui components.
8.  **Variant & region awareness** – Implement components that react to region and variant filters. The RegionChart, VariantChart and BottleneckTable should update when a region is selected and provide clear feedback to the user (e.g. highlight selected bars).
9.  **Documentation integrity** – Code is not "done" until event-stream.md & all memory files updated. Archive superseded docs in docs/archive/YYYY-MM-DD/ and update project-index.md
10.  **Test-driven & visual validation** – Write unit tests for data helpers and component logic. Use Playwright MCP to capture snapshots of each implemented component, verifying against initial requirements. Use the component and make sure all is as expected. All features must be responsive and accessible (ARIA labels, keyboard navigation, colour contrast).

## Project Type Detection (MANDATORY)

### Automatic Detection Requirements
The system MUST detect project type before any implementation to prevent architecture mismatches:

1. **Package.json Analysis**:
   - React Router: Check for `"react-router-dom"` in dependencies
   - Next.js: Check for `"next"` in dependencies
   - Vite: Check for `"vite"` in devDependencies

2. **Directory Structure Verification**:
   - React Router: Look for `src/routes/` or `src/App.tsx` with `<Routes>` component
   - Next.js: Look for `app/` or `pages/` directory structure
   - Current Project: Uses `src/` with React Router routing

3. **Configuration File Detection**:
   - React Router + Vite: Presence of `vite.config.js` or `vite.config.ts`
   - Next.js: Presence of `next.config.js` or `next.config.mjs`

4. **Routing Pattern Recognition**:
   - React Router: Client-side routing with `<BrowserRouter>`, `<Routes>`, `<Route>`
   - Next.js: File-based routing with server-side rendering capabilities

### Current Project Configuration
**Framework**: React Router + Vite + TypeScript
**Routing**: Client-side with react-router-dom v6
**Build Tool**: Vite 5.x
**Deployment**: Static site generation

### Implementation Guidelines by Project Type

#### For React Router Projects (Like This One):
- Use `react-router-dom` for all routing
- Implement client-side navigation patterns
- Use `<Link>` components from react-router-dom
- Define routes in `src/routes/index.tsx`
- Use dynamic imports for code splitting

#### For Next.js Projects (NOT This One):
- Use file-based routing in `app/` directory
- Implement server components where appropriate
- Use `next/link` for navigation
- Define API routes in `app/api/`
- Use Next.js image optimization

### Detection Implementation
```typescript
// Project type detection logic
function detectProjectType(): 'react-router' | 'nextjs' | 'unknown' {
  const packageJson = require('./package.json');
  
  if (packageJson.dependencies?.['next']) {
    return 'nextjs';
  }
  
  if (packageJson.dependencies?.['react-router-dom']) {
    return 'react-router';
  }
  
  return 'unknown';
}
```

## Planning

Process: Requirements Analysis -> Research -> system_understanding -> planning -> todo -> Update memory-bank

<system_understanding>
-   **Purpose**: To build a deep, structural understanding of complex problems before planning.
-   **Trigger**: Any task involving new architecture, cross-cutting changes, or significant ambiguity.
-   **Process**:
    1.  Identify all key entities (components, services, data models, user flows).
    2.  Map the relationships and dependencies between them.
    3.  Create a visual representation (e.g., Mermaid diagram) or a structured outline.
    4.  Save the artifact to `docs/diagrams/` and reference it in `planning.md`.
-   **Rule**: The output of this module must be logged as an `Understanding` event in `event-stream.md`.
</system_understanding>

<planning>
-   **Purpose**: To create and maintain a clear, actionable implementation plan.
-   **Rules**:
    -   The canonical plan lives in `CLAUDE-planning.md`. The actionable checklist lives in `@context/CLAUDE-todo.md`.
    -   Plans must follow the **ITERATION-FIRST** principle: always check if an existing component or pattern can be extended before planning to create something new.
    -   Break down work into logical phases where applicable: 1. Foundation (data, types), 2. Backend (logic, APIs), 3. Frontend (UI, state), 4. Testing (unit, integration, E2E).
    -   Log major plan updates as `Plan` events in `@context/event-stream.md`.
</planning>

<todo>
  – **Purpose**: Manage fine-grained tasks associated with the plan.
  – **Rules**:
    * `@context/CLAUDE-todo.md` should be kept in sync with the TodoWrite tool's internal state but significantly expand on them breaking them up into relevant subtasks and grouping them by parent phases and deliverables. Updates happen when:
        - Tasks are added, modified, or completed
        - Status changes occur
        - Session continuity needs to be maintained
    * Maintain `todo.md` as a checklist of tasks derived from the plan. Each entry corresponds to a specific deliverable or subtask and may have sub-items.
    * Link tasks to their parent phases and deliverables.
    * After completing each item, update `@context/CLAUDE-todo.md` and check it off. 
    * If the plan changes or new tasks emerge, consider all tasks and reprioritize to make sure to have a clean consistent and coherent tasklist. Update `@context/CLAUDE-todo.md` accordingly. Invoke system_understanding if there is too much complexity or ambiguity

</todo>

    


--------------------------------------------------------------------------------
## <research_first_methodology>

### Research process

1.  **Current-State Review**: Scan codebase & docs referenced in `doc-ref.md`.
2.  **Gap Analysis**: Compare requirements vs. existing artifacts.
3.  **Target State Snapshot**: Draft architecture diagram & data flow.
4.  **Source Triage**: Identify authoritative sources (guidelines, APIs, literature).
5.  **Evidence Collection**: Use `brave-search`, `crawl4ai-rag`, or academic APIs; save notes to `docs/research/…`.
6.  **Synthesis**: Distil findings into actionable design choices.

*_No code generation occurs before step 6 is crystallised._*

</research_first_methodology>

### Research Best Practices

2. **Internal Research Protocol**:
   ```
   1. read @context/project-index.md for a high-level overview 
      - For a deeper dive on architectural structure read PROJECT_INDEX.json
      - For a clean tree view read context/project-tree.txt 
   2. Use the @code-explorer agent for complex code bases
   3. Use serena mcp tools to research dependencies
   ```

1. **External Research Protocol**:
   ```
   1. Use brave_web_search for initial discovery
   2. Use context7 to retrieve library documentation
   2. Use puppeteer for visual capture of competitor sites
   3. Save all findings to docs/research/[topic]/
   4. Create synthesis document with actionable insights
   ```

3. **Pattern Recognition**:
   - Always look for existing implementations first
   - Document reusable patterns in `docs/patterns/`
   - Create pattern library entries for common solutions
   - Reference patterns in implementation plans
### Requirements Evaluation Framework



--------------------------------------------------------------------------------
## <visual_excellence_module>

> **Purpose**: Implement conversion-focused, modern UI patterns that drive user engagement and business outcomes

### Core Visual Principles

<visual_principles>
| Principle | Implementation | Measurement |
|-----------|----------------|-------------|
| **Clarity** | • 8pt grid system<br>• Clear visual hierarchy<br>• Consistent spacing | Time to first action < 3s |
| **Movement** | • Scroll-triggered animations<br>• Micro-interactions<br>• Loading states | Engagement rate > 60% |
| **Trust** | • Social proof placement<br>• Security badges<br>• Professional typography | Trust score > 4.5/5 |
| **Performance** | • Optimized images<br>• Lazy loading<br>• Progressive enhancement | LCP < 2.5s, CLS < 0.1 |
</visual_principles>

### Conversion-Optimized Patterns

1. **Hero Section Pattern**:
   ```tsx
   // High-converting hero structure
   <section className="relative min-h-[600px] flex items-center">
     <div className="container grid lg:grid-cols-2 gap-12 items-center">
       <div className="space-y-6">
         <Badge>Trust indicator</Badge>
         <h1 className="text-4xl lg:text-6xl font-bold">
           <span className="text-primary">Benefit-focused</span> headline
         </h1>
         <p className="text-xl text-muted-foreground">Supporting value prop</p>
         <div className="flex gap-4">
           <Button size="lg">Primary CTA</Button>
           <Button variant="outline" size="lg">Secondary CTA</Button>
         </div>
         <div className="flex items-center gap-6 text-sm">
           <TrustSignal />
         </div>
       </div>
       <div className="relative">
         <ProductVisual />
       </div>
     </div>
   </section>
   ```

2. **Progressive Disclosure Pattern**:
   ```tsx
   // Reveal complexity gradually
   const [expanded, setExpanded] = useState(false);
   
   return (
     <div className="space-y-4">
       <div className="visible-by-default">
         {/* Essential info */}
       </div>
       {expanded && (
         <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: "auto" }}
           transition={{ duration: 0.3 }}
         >
           {/* Additional details */}
         </motion.div>
       )}
     </div>
   );
   ```

3. **Social Proof Integration**:
   ```tsx
   // Strategic placement of trust signals
   const trustPlacements = {
     hero: "Below headline",
     form: "Near submit button", 
     pricing: "Under price points",
     checkout: "Above payment form"
   };
   ```

### Animation Guidelines

1. **Scroll-Triggered Animations**:
   - Use Intersection Observer for performance
   - Stagger delays: 150ms between elements
   - Duration: 600-1000ms for reveals
   - Easing: ease-out for natural feel

2. **Micro-Interactions**:
   - Hover states: 150ms transition
   - Click feedback: scale(0.98) on press
   - Loading states: skeleton screens > spinners
   - Success states: checkmark animation

3. **Performance Rules**:
   - CSS transforms only (no layout shifts)
   - Will-change for heavy animations
   - Reduce motion for accessibility
   - GPU acceleration for smoothness

### Responsive Design Strategy

```scss
// Mobile-first breakpoints
$breakpoints: (
  'sm': 640px,   // Tablet portrait
  'md': 768px,   // Tablet landscape
  'lg': 1024px,  // Desktop
  'xl': 1280px,  // Wide desktop
  '2xl': 1536px  // Ultra-wide
);

// Component scaling
.component {
  // Mobile: Full width, stacked
  @apply w-full flex-col;
  
  // Tablet: 2-column grid
  @screen md {
    @apply grid grid-cols-2 gap-8;
  }
  
  // Desktop: Enhanced spacing
  @screen lg {
    @apply gap-12 px-8;
  }
}
```

### Visual Testing Protocol

1. **Before Implementation**:
   - Screenshot competitor implementations
   - Create wireframe/mockup
   - Get stakeholder approval

2. **During Implementation**:
   - Use MCP Puppeteer for live preview
   - Test at all breakpoints
   - Verify animations performance

3. **After Implementation**:
   - Visual regression testing
   - Cross-browser verification
   - Performance audit
   - Accessibility scan

</visual_excellence_module>



## Commands

### Development
```bash
npm run dev              # Start development server (port 8080/8081)
npm run build           # Build for production
npm run preview         # Preview production build
```

### Testing & Quality
```bash
npm run test            # Run unit tests (Vitest)
npm run test:e2e        # Run E2E tests (Playwright) 
npm run test:coverage   # Run tests with coverage report
npm run lint            # ESLint check
npm run lint:fix        # ESLint with auto-fix
npm run format          # Prettier formatting
npm run typecheck       # TypeScript type checking
npm run check           # Run lint + typecheck + test:coverage
npm run check:all       # Run all checks + E2E tests
```

### Linting & Code Quality

**Zero-Tolerance Policy**: This project enforces strict linting rules with automated prevention:
- **Pre-commit Hooks**: Husky + lint-staged automatically fix and validate code
- **CI/CD Enforcement**: GitHub Actions block merges with linting errors
- **Auto-fix on PRs**: Bot automatically fixes formatting issues

**Key Rules**:
- ❌ No `any` types - use `unknown` or proper interfaces
- ❌ No console.log statements - only warn/error allowed
- ❌ No unused variables - remove or prefix with underscore
- ✅ Required Node.js 18+ (see `.nvmrc`)

**Quick Fixes**:
```bash
npm run lint:fix                        # Auto-fix all issues
node scripts/fix-eslint-issues.cjs     # Bulk fix common patterns
```

See [docs/standards/linting-guide.md](docs/standards/linting-guide.md) for complete guide.

### Index Generation (v2.0)
```bash
./scripts/generate-indexes.sh   # Generate all 4 project indexes
```

## Git Workflow & Best Practices

### Commit Standards
Maintain high-quality git history with frequent, atomic commits:

#### Commit Frequency
- **When to commit**: After each logical unit of work is complete
- **Atomic commits**: Each commit should represent one coherent change
- **Work in progress**: Use local commits frequently, squash before PR if needed

#### Commit Message Format
Follow conventional commits specification:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature or functionality
- `fix`: Bug fix
- `docs`: Documentation changes only
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (updating dependencies, build scripts, etc.)
- `perf`: Performance improvements

**Examples**:
```bash
git commit -m "feat(eligibility): add multi-language support for questionnaire"
git commit -m "fix(supabase): resolve OTP verification rate limiting issue"
git commit -m "docs: update CLAUDE.md with project type detection"
```

### Pull Request Workflow

#### When to Create PRs
- **Feature complete**: Create PR when a feature is fully implemented and tested
- **Major milestone**: After significant architectural changes or refactoring
- **Bug fix batch**: Group related bug fixes into a single PR

#### PR Best Practices
1. **Branch naming conventions**:
   ```
   feature/[feature-name]    # New features
   fix/[bug-description]      # Bug fixes
   docs/[doc-topic]          # Documentation updates
   refactor/[area]           # Code refactoring
   test/[test-scope]         # Test additions
   ```

2. **PR Description Template**:
   ```markdown
   ## Summary
   Brief description of changes
   
   ## Changes Made
   - Detailed list of modifications
   - File structure changes
   - API changes
   
   ## Testing
   - [ ] Unit tests pass
   - [ ] E2E tests pass
   - [ ] Manual testing completed
   
   ## Screenshots (if UI changes)
   Before/After screenshots
   
   ## Related Issues
   Closes #[issue-number]
   ```

3. **PR Size Guidelines**:
   - Keep PRs focused and manageable (< 500 lines ideally)
   - Split large features into multiple PRs if possible
   - Review your own PR first before requesting reviews

### Branch Management

#### Branch Strategy
```
main (or master)
├── feature/process-revamp     # Current feature branch
├── feature/gp-referral        # Feature branches
├── fix/auth-timeout          # Bug fix branches
└── docs/api-documentation    # Documentation branches
```

#### Branch Protection Rules
- **main branch**: Protected, requires PR reviews
- **Feature branches**: Regular commits, rebase from main frequently
- **Cleanup**: Delete branches after PR merge

### Git Commands Reference

#### Common Workflows
```bash
# Start new feature
git checkout -b feature/new-feature

# Regular commits during development
git add .
git commit -m "feat: implement new component"

# Keep branch updated with main
git fetch origin
git rebase origin/main

# Create PR
git push -u origin feature/new-feature
# Then create PR via GitHub/GitLab UI

# After PR approval and merge
git checkout main
git pull origin main
git branch -d feature/new-feature
```

#### Useful Commands
```bash
# View commit history
git log --oneline --graph --all

# Amend last commit
git commit --amend

# Interactive rebase to clean history
git rebase -i HEAD~3

# Stash work in progress
git stash
git stash pop

# Check branch status
git status
git branch -a
```

### Integration with AI Workflow
When working with AI agents:
1. **Commit after each agent task completion**
2. **Use descriptive commit messages that reference the task**
3. **Create PR when a complete feature is ready**
4. **Document architectural decisions in commit messages**

## Architecture & Code Organization

### Project Structure
- **src/components/**: React components following atomic design (≤50 lines for atoms/molecules)
  - `ui/`: Base shadcn/ui components (50+ components)
  - `forms/eligibility/`: 6-stage eligibility workflow with 14 atomic components
  - `layout/`: Layout components (Navbar, Footer)
  - `features/`: Feature-specific components
- **supabase/**: Database schema (14 tables), migrations, RLS policies, edge functions
- **context/**: Active working files (event-stream.md, CLAUDE-planning.md, project-index.md)
- **docs/**: Reference documentation organized by category

### Context Navigation (4-Index System v2.0)

| Index File | Size | Purpose | When to Load |
|------------|------|---------|--------------|
| PROJECT_INDEX.json | ~160KB | Code structure, functions, dependencies (no images) | Code work |
| VISUAL_ASSETS_INDEX.json | ~124KB | All images, videos, icons with metadata | UI work |
| context/project-tree.txt | ~36KB | Directory tree without images | Navigation |
| context/project-index.md | ~10KB | High-level overview with depth-3 tree | Quick overview |

### Key Design Patterns

#### Component Architecture
- **Atomic Design**: Maximum 50 lines per atom/molecule component
- **Context + Reducer**: State management pattern for complex forms
- **TypeScript Strict Mode**: No `any` types, explicit return types required
- **Swiss Compliance**: VAT (7.7%), canton validation, 9 insurance providers

#### Multi-language Support
- **4 Languages**: English, German, French, Italian
- **Route Structure**: /[language]/[page] (e.g., /de/home)
- **98+ Routes**: Complete routing across all languages

#### Database (Supabase)
- **14 Tables**: Users, insurance, eligibility, sessions, OTP
- **RLS Policies**: Row-level security on all tables
- **Edge Functions**: OTP email, session management
- **Security**: bcrypt hashing, rate limiting (5 attempts/10 min)

## Development Guidelines

### Code Quality Requirements
- **ESLint**: Must pass with zero errors
- **TypeScript**: Must compile without errors
- **Test Coverage**: 80% for services, 70% for utilities
- **Performance**: LCP <2.5s, CLS <0.1, FID <100ms
- **Accessibility**: WCAG 2.1 AA compliance mandatory

### Security Standards
- **OTP Verification**: bcrypt hashing with rate limiting
- **PCI DSS Compliance**: Secure payment form patterns
- **No Secrets in Code**: Use environment variables
- **Session Management**: Secure cookie handling

### Testing Approach
- **Unit Tests**: Use Vitest for components and services
- **E2E Tests**: Use Playwright for critical user flows
- **Visual Regression**: Test design system consistency
- **Accessibility**: Run accessibility audits regularly

## AI Agent Workflow

### Critical Agent Usage with MCP Tools
- **@memory-bank-synchronizer** - MUST be invoked after EVERY significant code change, architectural pattern modification, or technical decision. Uses JSON memory directly (no MCP tools).
- **@code-searcher** - MUST be invoked BEFORE making any code modifications. Uses Serena MCP (`mcp__serena__*`) for precise code navigation and Context7 MCP for library docs.
- **@ux-design-expert** and **@design-system-architect** - Use proactively for design specifications. Use Playwright MCP for visual validation and Package Version MCP for dependency checks.
- **@supabase-architect** and **@supabase-implementation-engineer** - Invoke for backend work. Use full Supabase MCP toolkit (`mcp__supabase__*`) for database operations.
- **@testing-qa-agent** - Use for test specifications. Uses Playwright MCP (`mcp__playwright__*`) for E2E testing (replaces Puppeteer).
- **@researcher** - Use for information gathering. Uses Brave Search MCP for web research and Context7 MCP for documentation.

### Phase-Based Process (CLAUDE_PROCESS.md)
1. **Context Gathering**: Load indexes, detect workflows (check context/WORKFLOWS.md)
2. **Analysis**: Build entity relationships with tree-of-thought
3. **Research**: Gather best practices from authoritative sources
4. **Planning**: Create actionable tasks in CLAUDE-planning.md
5. **Execution**: Implement with quality gates and self-priming
6. **Review**: Expert panel assessment via reflection-agent
7. **Delivery**: Present final outputs and update documentation

### Mandatory Protocols
- **Workflow Detection**: Check context/WORKFLOWS.md on EVERY message
- **Self-Priming**: Include `self_prime: true` in ALL agent invocations
- **Documentation Update**: Run documentation-maintainer after EVERY code change
- **Index Updates**: Run `./scripts/generate-indexes.sh` after structural changes
- **Memory Bank Sync**: Run @memory-bank-synchronizer after significant changes

## Critical Files & References

### Core Context Files
- **context/event-stream.md**: Event tracking
- **context/CLAUDE-planning.md**: Active planning
- **context/project-index.md**: Project overview
- **context/CLAUDE_PROCESS.md**: Agent workflow process
- **context/WORKFLOWS.md**: Workflow orchestration patterns

### Reference Documentation (docs/)
- **docs/architecture/**: System architecture, database, API
- **docs/frontend/**: Component architecture, design system
- **docs/features/**: Eligibility, multi-language features
- **docs/testing/**: Test strategy, unit/E2E tests
- **docs/content/**: Translations and content management

### Key Scripts
- **scripts/generate-indexes.sh**: Generate project indexes
- **scripts/file-organization-scanner.sh**: Check file organization
- **scripts/auto-file-mover.sh**: Fix file organization violations
- **scripts/event-stream-api.py**: Event stream API utilities

### Database
- **supabase/migrations/**: SQL migration files
- **supabase/schemas/**: Database schema definitions
- **supabase/functions/**: Edge functions (OTP, session management)

## Important Constraints

### File Organization Rules
- **Root Directory**: Maximum 35 config files only
- **Images**: Must be in `/public/assets/images/`
- **SQL Files**: Must be in `/supabase/`
- **Tests**: Must be in `/tests/` or `/scripts/tests/`
- **Documentation**: Active in `/context/`, reference in `/docs/`

### Component Rules
- **Atomic Components**: ≤50 lines for atoms/molecules
- **Pure Functional**: No class components
- **TypeScript**: Explicit typing required
- **Tailwind Only**: No custom CSS except index.css

### Memory Management
- **Archive After 7 Days**: Move unused docs to `/archive/YYYY-MM-DD/`
- **Context Budget**: Load only relevant index sections (<100KB limit)
- **Auto Cleanup**: Remove .bak files and outdated references regularly

## Supabase Integration

### Authentication & Security
- **OTP System**: Email/phone verification with rate limiting
- **Session Management**: Secure cookie handling
- **RLS Policies**: Enforced on all tables

### Key Tables
- `users`: Core user data with Swiss compliance fields
- `insurance_providers`: 9 Swiss insurance companies
- `eligibility_submissions`: Form responses with scoring
- `otp_verifications`: Rate-limited OTP tracking
- `sessions`: Secure session management

### Edge Functions
- `send-otp-email`: Email OTP delivery
- `otp-security-handler`: Rate limiting enforcement
- `session-management`: Cookie handling

## Quick Reference

### Common Tasks
- **Add Component**: Create in appropriate `/src/components/` subdirectory, follow atomic design
- **Update Database**: Create migration in `/supabase/migrations/`, run with `apply_migration`
- **Add Translation**: Update all 4 language files in `/src/translations/`
- **Fix Accessibility**: Run `npm run test:a11y`, fix issues, verify WCAG compliance
- **Deploy**: Build with `npm run build`, verify with `npm run check:all`
- **Sync Memory Bank**: Run @memory-bank-synchronizer after code changes
- **Search Code**: Use @code-searcher before modifications

### Performance Monitoring
- **Core Web Vitals**: LCP, CLS, FID targets
- **Bundle Size**: Monitor with build output
- **Load Time**: Target 47ms (current achievement)

### Swiss Compliance
- **VAT**: 7.7% calculation required
- **Cantons**: 26 canton validation
- **Insurance**: 9 provider integration
- **Age Restrictions**: 18+ for eligibility
- **Languages**: DE, FR, IT, EN support
