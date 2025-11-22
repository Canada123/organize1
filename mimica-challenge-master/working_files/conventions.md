# **Code & Documentation Conventions – Mimica Analytics Platform**

**VERSION**: 1.0  \> **LAST UPDATED**: 2025‑07‑29

These conventions govern the organisation of code, documentation and processes in the Mimica Analytics Platform repository. They complement the universal process and playbook. **Follow them rigorously** to ensure a clean, maintainable and secure codebase.

## 1 Repository structure & file organisation

### 1.1 Top‑level directories

repository/  
├─ app/                    \# Next.js App Router pages and layouts  
│  ├─ layout.tsx          \# Root layout (HTML, body wrapper, global styles)  
│  ├─ page.tsx            \# Landing page; links to /dashboard  
│  └─ dashboard/  
│     ├─ page.tsx         \# Main dashboard page  
│     └─ hooks.ts         \# Custom hooks for data and filters  
├─ components/            \# Reusable UI primitives and domain components  
│  ├─ DataProvider.tsx    \# Context provider for metrics and selected filters  
│  ├─ RegionChart.tsx     \# Bar chart per region  
│  ├─ VariantChart.tsx    \# Stacked bar chart per variant  
│  ├─ BottleneckTable.tsx \# Table listing bottlenecks  
│  ├─ SummaryCards.tsx    \# Optional cards with summary statistics  
│  └─ Layout.tsx          \# Dashboard layout (header, sidebar)  
├─ lib/                   \# Domain logic and helpers  
│  ├─ data.ts             \# Functions to fetch JSON files; compute metrics  
│  └─ types.ts            \# TypeScript interfaces for step records & metrics  
├─ public/  
│  └─ data/  
│     ├─ raw/  
│     │   └─ new\_synthetic\_invoice\_data.json  
│     └─ processed/  
│         ├─ processed\_region\_metrics.json  
│         ├─ processed\_variant\_distribution.json  
│         ├─ processed\_variant\_metrics.json  
│         ├─ processed\_step\_metrics.json  
│         └─ processed\_top\_bottlenecks.json  
├─ styles/                \# Global styles or Tailwind configuration  
│  └─ globals.css  
├─ docs/  
│  ├─ research/           \# Research notes, synthetic data design  
│  ├─ implementation/     \# Technical guides, component specs  
│  ├─ design/             \# Design tokens, version history  
│  ├─ bugs/               \# Bug logs, todo and fix plans  
│  ├─ archive/            \# Archived docs  
│  └─ assets/             \# Images and videos for documentation  
├─ working\_files/         \# Live development context (see playbook)  
│  ├─ todo.md  
│  ├─ planning.md  
│  ├─ conventions.md  
│  ├─ event-stream.md  
│  └─ doc-ref.md  
├─ tests/                 \# Unit and integration tests  
├─ package.json  
└─ tsconfig.json

### 1.2 File naming

* **Components** – Files: kebab-case.tsx (e.g. region-chart.tsx); Components: PascalCase (e.g. RegionChart). Always use named exports.

* **Pages** – Follow Next.js conventions (page.tsx, layout.tsx). Dynamic routes use \[param\] notation.

* **Helpers & services** – Files: kebab-case.ts (e.g. fetch-metrics.ts); Classes: PascalCase (e.g. MetricService); Functions: camelCase (e.g. computeRegionMetrics).

* **Types** – Declare interfaces and types in lib/types.ts; use PascalCase names without I prefixes. Use type for unions and generics.

* **Docs** – New markdown files must start with YYYY‑MM‑DD- and a concise slug. Place them in the appropriate docs/ subdirectory and update doc-ref.md.

### 1.3 Directory conventions

* Keep **domain logic** (data fetching, metrics computation) in lib/, separate from UI components.

* Place **reusable UI primitives** in components/. Domain-specific composites (e.g. InvoiceSummaryCard) may live in nested folders under components/.

* Put any **publicly served assets** (images, CSVs, JSONs) in public/.

* Maintain **tests** alongside code (in \_\_tests\_\_/ directories or in a separate tests/ folder) using the same file structure as src/.

* Avoid clutter in working\_files/. Only the canonical files (todo, planning, conventions, event-stream, doc-ref) belong there. Bug logs go under docs/bugs/.

## 2 TypeScript & coding standards

### 2.1 Strict mode

Enable strict TypeScript settings in tsconfig.json:

{  
  "compilerOptions": {  
    "strict": true,  
    "noImplicitAny": true,  
    "strictNullChecks": true,  
    "strictFunctionTypes": true,  
    "exactOptionalPropertyTypes": true,  
    "noFallthroughCasesInSwitch": true  
  }  
}

### 2.2 Interfaces vs types

* Use **interfaces** for object shapes that may be extended (e.g. StepRecord, RegionMetric).

* Use **types** for unions, intersections and utility compositions (e.g. type Region \= 'Americas' | 'EMEA' | ...).

* Name generics with single letters (T) or descriptive names (TData, TError).

### 2.3 React patterns

* Always use **functional components** with explicit props interfaces. Provide sensible defaults via parameter defaults.

* Use **custom hooks** (prefixed with use) for encapsulating stateful logic, e.g. useMetrics for computing or filtering data.

* Keep components small (≤ 50 LOC) and focused on a single responsibility. Extract complex logic into helpers or hooks.

* Implement **error boundaries** for top‑level pages to catch and log errors; display fallback UI.

* Use **context** to share state across the dashboard (e.g. metrics and selected region). Wrap the dashboard in DataProvider.

### 2.4 State management

* **Local state** – Use useState for UI‑only state (e.g. modal visibility).

* **Global state** – Use React context via DataProvider to store metrics and filters. Avoid prop drilling.

* **Server state** – If the application calls APIs in the future, prefer **React Query** or **SWR** for caching, revalidation and mutation. Keep fetch logic in lib/.

## 3 Services, data & API patterns

* Wrap all data fetching in helper functions (e.g. fetchRegionMetrics) that return typed promises. Provide fallback computation functions (e.g. computeRegionMetrics) to be used if the pre‑computed files are unavailable.

* Catch and handle errors in fetch functions; return descriptive error messages. Provide loading and error states in the UI.

* Encapsulate any transformation logic in lib/ (e.g. computing top bottlenecks from stepMetrics). Do not compute metrics in components.

* Document all public functions with JSDoc, including param types, return types and usage examples.

## 4 Styling conventions

* Use **Tailwind CSS** or **CSS Modules** for styling. Do not embed inline styles or use unscoped CSS classes. Use design tokens provided by 21st.dev when available.

* Base spacing on a **4 px grid**. Compose classes using Tailwind’s utility system (e.g. p-4, mt-6, grid-cols-2 gap-8).

* Derive colours from the design palette (pastel blues, greens, purples, oranges). Use CSS variables for theme colours and support dark mode via media queries or data attributes.

* Keep component style definitions co‑located with components or in a dedicated CSS module file (e.g. region-chart.module.css).

## 5 Testing guidelines

* **Unit tests** – Use Vitest or Jest. Write tests for each utility function (e.g. computeRegionMetrics). Mock data to avoid network calls. Use describe and it blocks with clear names.

* **Component tests** – Use React Testing Library. Test that charts render correct elements when given sample data; test interactivity (region selection updates other components).

* **End‑to‑end tests** – Use Playwright or Puppeteer. Simulate a user visiting the dashboard, selecting a region and verifying that other components update. Capture screenshots and compare against baselines.

* **Visual regression** – Incorporate snapshot testing for charts and tables. Use puppeteer\_screenshot to capture key states and compare pixel differences.

## 6 Documentation & context engineering

* **Working files** – Maintain todo.md and planning.md as the single sources of truth for tasks and high‑level plans. Update these files at the end of each agentic loop. Use event-stream.md to record every action, observation, plan, reflection and memory/graph operation on one line.

* **Doc‑ref index** – Keep doc-ref.md up to date. Each entry should list the file path, description and status (Active/Archived/Superseded). Move superseded documents to docs/archive/YYYY‑MM‑DD/.

* **Memory & knowledge graph** – Use memory.store to save research summaries, design decisions and plan versions (keyed by date and topic). Represent entities (e.g. component, metric, variant, page) in the graph with context7.create\_entities and link them with context7.create\_relations (e.g. component:VariantChart uses metric:VariantDistribution).

* **Context gathering** – At the start of each session, run shell commands like ls \-R and tree \-L 2 to explore the repository structure. Use GitHub search via the API connector to find relevant files. Use grep or ripgrep to locate code patterns. Record findings in event-stream.md and RESEARCH.md.

* **Documentation updates** – Write separate markdown files for new research or implementation details (e.g. docs/research/2025-07-29-metrics-analysis.md). Link them in doc-ref.md and mention them in event-stream.md. Persist a summary via memory.store.

## 7 Git & collaboration

* **Branch naming** – Use descriptive branches: feature/region-chart, fix/variant-filter, chore/update-deps.

* **Commit messages** – Follow the convention: feat: implement RegionChart component, fix: correct variant filtering logic, docs: add research on bottlenecks.

* **Pull requests** – Write meaningful descriptions summarising the change, include screenshots of new UI, list testing steps and link related issues. Use GitHub Actions or the CI pipeline to run tests and audits on each PR.

* **Code reviews** – Provide constructive feedback focused on correctness, readability, performance and design consistency. Ensure that any TODOs or comments are addressed before merging.

## 8 Performance, security & accessibility

* **Memoisation** – Use useMemo and useCallback for expensive calculations and event handlers. Avoid recomputing metrics on every render.

* **Code splitting** – Leverage Next.js dynamic imports to load heavy components (e.g. chart libraries) only when needed.

* **Image optimisation** – Use Next.js \<Image\> component for static assets; specify dimensions and placeholders.

* **Security** – Keep synthetic data anonymised. Never expose real user data or internal file paths. Avoid storing any secrets or tokens in the client; use environment variables and secret management for back‑end services.

* **Accessibility** – Run automated audits using axe-core. Ensure all interactive elements have roles and aria labels. Provide focus outlines and keyboard support. Avoid motion that causes discomfort; honour prefers‑reduced‑motion.

## 9 Bug management & post‑mortems

* **Bug logging** – Record defects in docs/bugs/bugs.md with fields: ID, title, description, severity (P0–P3), reproduction steps, impacted files and links to screenshots or logs.

* **Active bug tracking** – Maintain a checklist in docs/bugs/bugs\_todo.md with status per bug. Include a link to the fix plan.

* **Fix planning** – For each high‑priority bug, create an entry in docs/bugs/bug\_fix\_planning.md outlining the root cause, proposed fix, affected modules, tests to add and any refactors required.

* **Integration with tasks** – Add bug fix tasks to todo.md and plan them alongside feature work. Do not progress to new features until P0 or P1 bugs are resolved and tested.

* **Post‑mortems** – For significant incidents or regressions, write a post‑mortem in docs/post-mortems/ using the template from the universal process (summary, timeline, root cause, lessons learned, action items). Update the continuous learning module with insights.

## 10 Continuous improvement

* Regularly review and refine these conventions based on project learnings and community best practices. Document new patterns in docs/patterns/ and update the knowledge graph accordingly. Encourage the team to contribute suggestions for improving the architecture, testing strategy, documentation or process.

---

