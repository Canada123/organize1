*  **Technical Implementation Plan (v2) for Next.js Analytics Dashboard**

   This version of the implementation plan updates the previous specification to reflect the **enhanced synthetic dataset** and **pre‑computed metrics** produced in the second iteration. It also aligns the architecture with modern Next.js (13+) practices and incorporates the guidance from the **CLAUDE\_PROCESS** file for Claude Code. The goal is to build a production‑quality, interactive dashboard using **21st.dev** components (with **shadcn/ui** as fallback) that visualises cross‑region metrics, variant distributions and bottleneck statistics derived from the improved dataset.

   **1\. Objectives and Scope**

  1. **Features** – Implement the three MVP analytics components: **cross‑region comparison**, **variant analysis** and **bottleneck detection**. The flowchart overlay will be tackled in a subsequent iteration.

  2. **Data source** – Use the improved synthetic dataset (`new_synthetic_invoice_data.json`) located in `public/data/raw/` and the processed metric files (region, variant distribution, variant metrics, step metrics, top bottlenecks) in `public/data/processed/`. Metrics can be computed on the client if the raw dataset is loaded, but using pre‑computed JSONs simplifies the client code and reduces processing time.

  3. **UI framework** – Prefer the **21st.dev** component library for layout and primitives. Use their charting package if available (e.g., `@21stdev/react-charts`); otherwise fall back to **shadcn/ui** plus **react‑chartjs‑2** or **nivo** for charts. Maintain a minimalistic, airy design with consistent typography and accessible colours.

  4. **Architecture** – Adopt a modular, maintainable structure with the Next.js **App Router** (`app/` directory). Use a context provider to share data and filters across components. Each visual component should be self‑contained, receiving only the data it needs via props or context.

  5. **Interactivity** – Clicking on a region bar filters the variant chart and bottleneck table. Future iterations may add variant‑level drill‑downs or step‑level details; design the state management to accommodate additional filters.

**2\. Project Structure**

 Use the Next.js App Router to organise pages. A suggested directory tree is:

 pgsql  
CopyEdit  
`my‑analytics‑demo/`  
`├─ app/`  
`│  ├─ layout.tsx            # Root layout (html, body wrapper, global styles)`  
`│  ├─ page.tsx             # Landing page; redirect or link to /dashboard`  
`│  └─ dashboard/`  
`│     ├─ page.tsx          # Main dashboard page`  
`│     └─ hooks.ts          # Custom hooks (e.g., useMetrics)`  
`├─ components/`  
`│  ├─ DataProvider.tsx     # Context provider for data and selected region`  
`│  ├─ RegionChart.tsx      # Bar chart of average duration by region`  
`│  ├─ VariantChart.tsx     # Stacked bar chart of variant distribution per region`  
`│  ├─ BottleneckTable.tsx  # Table of top bottlenecks (action name, avg duration, count)`  
`│  ├─ SummaryCards.tsx     # Optional: display median/min/max durations per region`  
`│  ├─ Layout.tsx           # Dashboard layout with header & sidebar`  
`│  └─ Loading.tsx          # Loading skeletons/spinners for SSR`  
`├─ lib/`  
`│  ├─ data.ts              # Functions to fetch and parse JSON files; compute metrics if needed`  
`│  └─ types.ts             # TypeScript interfaces for raw steps and processed metrics`  
`├─ public/`  
`│  └─ data/`  
`│     ├─ raw/`  
`│     │   └─ new_synthetic_invoice_data.json`  
`│     └─ processed/`  
`│         ├─ processed_region_metrics.json`  
`│         ├─ processed_variant_distribution.json`  
`│         ├─ processed_variant_metrics.json`  
`│         ├─ processed_step_metrics.json`  
`│         └─ processed_top_bottlenecks.json`  
`├─ styles/`  
`│  └─ globals.css          # Custom global styles or Tailwind configuration`  
`├─ package.json`  
`└─ tsconfig.json`

*  **File conventions**

  1. Use **TypeScript** for all components and utility files.

  2. Place reusable UI primitives in `components/` and domain logic in `lib/`.

  3. Keep data files in `public/data` so that `fetch('/data/...')` works both client‑ and server‑side.

  4. Follow **COLLECT** → **UNDERSTAND** → **PLAN** → **ACT** cycle outlined in `CLAUDE_PROCESS.md` when working with Claude Code (see Starting Prompt below).

**3\. Data Layer**

 **Types (`lib/types.ts`)**

 Define interfaces representing the raw step and processed metric objects:

 ts  
CopyEdit  
`export interface StepRecord {`  
  `task_id: string;`  
  `transaction_id: string;`  
  `region: string;`  
  `user_id: string;`  
  `role: string;`  
  `variant: string;`  
  `step_index: number;`  
  `action_name: string;`  
  `application: string;`  
  `duration_sec: number;`  
  `start_time_sec: number;`  
  `end_time_sec: number;`  
  `decision_outcome?: string;`  
  `auto_score: number;`  
`}`

`export interface RegionMetric {`  
  `region: string;`  
  `avg_duration: number;`  
  `median_duration: number;`  
  `max_duration: number;`  
  `min_duration: number;`  
  `avg_step_count: number;`  
  `transaction_count: number;`  
`}`

`export interface VariantDistribution {`  
  `region: string;`  
  `A?: number; B?: number; C?: number; D?: number; E?: number;`  
`}`

`export interface VariantMetric {`  
  `variant: string;`  
  `avg_duration: number;`  
  `median_duration: number;`  
  `step_count: number;`  
  `transaction_count: number;`  
`}`

`export interface StepMetric {`  
  `action_name: string;`  
  `avg_duration: number;`  
  `median_duration: number;`  
  `count: number;`  
`}`

`export interface BottleneckMetric extends StepMetric {}`  
 **Data fetching (`lib/data.ts`)**

 Implement helper functions to fetch raw and processed data. For example:

 ts  
CopyEdit  
`export async function fetchRawData(): Promise<StepRecord[]> {`  
  `const res = await fetch('/data/raw/new_synthetic_invoice_data.json');`  
  `return (await res.json()) as StepRecord[];`  
`}`

`export async function fetchRegionMetrics(): Promise<RegionMetric[]> {`  
  `const res = await fetch('/data/processed/processed_region_metrics.json');`  
  `return (await res.json()) as RegionMetric[];`  
`}`  
`// similar helpers for other processed files`

`export function computeRegionMetrics(raw: StepRecord[]): RegionMetric[] {`  
  `// fallback logic to compute region metrics client‑side`  
`}`

*  These functions allow the `DataProvider` to use either the pre‑computed metrics or compute them on the fly if the processed files are unavailable. All asynchronous calls should be wrapped in try/catch blocks and expose loading/error states.

   **4\. State Management & Context (`components/DataProvider.tsx`)**

   Create a context that stores:

  1. `rawData: StepRecord[]` – optional, loaded only if client needs to compute metrics.

  2. `regionMetrics: RegionMetric[]` – from processed JSON.

  3. `variantDistribution: VariantDistribution[]`.

  4. `variantMetrics: VariantMetric[]`.

  5. `stepMetrics: StepMetric[]`.

  6. `bottlenecks: BottleneckMetric[]` – top 5 items from `stepMetrics`.

  7. `selectedRegion: string | undefined` and `setSelectedRegion` – to filter charts.

* The provider should load the processed metrics in a `useEffect` and update state accordingly. Optionally, compute metrics on the fly when raw data is fetched. Provide helper selectors such as `getVariantDistribution(region?: string)` and `getBottlenecks(region?: string)` that filter the arrays based on `selectedRegion`.

   **5\. UI Components**

   **Layout**

   Use the `Layout` component as a wrapper. It can leverage 21st.dev components like `<SideNav>`, `<Header>`, `<Container>` or their equivalents. Ensure the layout is responsive; on smaller screens, the sidebar can collapse into a hamburger menu.

   **RegionChart**

  1. Use a bar chart component from 21st.dev or fallback to `react-chartjs-2`.

  2. Props: `metrics: RegionMetric[]`, `selectedRegion: string | undefined`, `onSelect: (region: string | undefined) => void`.

  3. Render bars for each region’s `avg_duration`. Highlight the selected bar (e.g. border thickness, colour change). Provide tooltips showing median, max and min durations.

* **VariantChart**

  1. Use a stacked bar chart. If 21st.dev provides a stacked bar component, use it; else use `react-chartjs-2` with type `'bar'` and options for `stacked` axes.

  2. Props: `distribution: VariantDistribution[]`, `selectedRegion?: string`.

  3. When `selectedRegion` is defined, filter the distribution to a single object and render a horizontal stacked bar (one region). Otherwise, render one stacked bar per region.

  4. Include a legend mapping colours to variants A–E.

* **BottleneckTable**

  1. Use a table component from 21st.dev or fallback to shadcn’s `<Table>`. Support sorting by duration or frequency.

  2. Props: `metrics: BottleneckMetric[]`, `selectedRegion?: string`.

  3. Display at least three columns: **Action Name**, **Average Duration (s)**, **Occurrences**. Format durations to one decimal place.

  4. If `selectedRegion` is defined, recompute the top bottlenecks by filtering the full `stepMetrics` (provided by context) to that region. Otherwise show global bottlenecks.

* **SummaryCards (optional)**

  1. For each region, display mini‑cards showing `median_duration`, `max_duration` and `min_duration`. Use 21st.dev card components with icons and subtle backgrounds.

  2. Could be placed above or beside the RegionChart for quick context.

* **6\. Styling and Theming**

  1. Use CSS Modules or TailwindCSS (if 21st.dev provides integration) to define global and component‑specific styles. Follow a **minimalistic and aerated** aesthetic: plenty of whitespace, consistent margins, pastel colour palette, and legible typography.

  2. Ensure accessible colour contrast and keyboard navigation. Use `role` attributes and ARIA labels for interactive elements.

  3. Provide dark‑mode support if feasible; 21st.dev components typically support theme toggling.

* **7\. Development Workflow for Claude Code**

   The developer (Claude Code) should follow the **Agent Life‑Cycle Loop** defined in `CLAUDE_PROCESS.md`. Key points:

  1. **Load context** – Before writing code, read the attached process file and the current iteration’s research (e.g., `RESEARCH_v2.md`, `data_transformation.md`). Use `memory.recall` and `context7.search_nodes` to retrieve relevant notes and the plan.

  2. **Understand requirements** – Summarise the user’s goals (MVP features, data files, design preferences). Clarify any ambiguities.

  3. **Plan** – Create a numbered plan mapping tasks (e.g., scaffold project, implement DataProvider, build RegionChart…) to modules and tools. Persist the plan via `memory.store` and add tasks to `todo.md`.

  4. **Execute** – Implement one component or helper at a time. Use the appropriate CLI or file editing tools. For UI work, run a local dev server and use `puppeteer` for visual validation. Write TypeScript with strict types.

  5. **Log and test** – After each action, update `event‑stream.md`. Run ESLint, Prettier and unit tests (if configured) to catch issues early. Use visual snapshot tests for components if available.

  6. **Optimise and review** – Profile performance only after the basic functionality is complete. Submit code for review via GitHub integration or peer AI review. Address feedback.

  7. **Document** – Update `README.md`, `CHANGELOG.md` and add comments in code. Record design decisions and trade‑offs via `memory.store` (keys like `decision‑[date]‑ui‑library`).

  8. **Deliver** – When ready, inform the user and provide instructions to run the demo (`npm install && npm run dev`). Attach relevant files or commit URLs.

