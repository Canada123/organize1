# Planning - Mimica Analytics Platform v5

## Project Overview
Building a two-phase analytics platform:
- **Phase 1**: Clone Mimica's existing Mapper module UI with exact design system
- **Phase 2**: Extend with cross-region process standardization analytics

## Current Phase: Emergency Fixes for Demo
- Status: **⚠️ CRITICAL GAPS IDENTIFIED - URGENT ACTION REQUIRED**
- Phase 1: Partially complete (60-70%) - Missing Process Map, data issues
- Phase 2: Analytics complete (90%) but needs data foundation fixes
- Demo Readiness: 40% - Major work needed before tomorrow

### Critical Issues Found (Jan 30 Audit):
1. **Data Processing**: Only 2 hardcoded processes showing instead of all from dataset
2. **Process Map**: Completely missing - this is a CORE feature
3. **UI Components**: Missing donut charts, columns, buttons
4. **Visual Design**: Doesn't match reference screenshots closely enough

## Key Changes from v5 Requirements

### Phase 1 - Platform Clone (Priority)
1. **Process List Page**
   - Left sidebar with search/filter
   - Table columns: Process name, Ease badge, Automatability badge, Time Spent
   - Clicking process opens summary panel

2. **Summary Panel**
   - Time Saved card (large metric display)
   - Automatability rating
   - SME metrics
   - Ease of Deployment gauge (semi-circular)
   - Counts grid (Actions, Inputs, Decisions, Apps, Websites, Paths)
   - Donut charts for Applications & Websites

3. **Process Map View**
   - Interactive flowchart with react-flow
   - Step details panel (right side)
   - Toolbar for zoom/pan/filter
   - Color-coded nodes by automata score

### Phase 2 - Analytics Extension
1. Cross-region comparison dashboard
2. Variant analysis and distribution
3. Bottleneck detection table
4. Process overlay for multiple regions

## Technical Architecture (Updated)

### Frontend Stack
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with design tokens
- **Components**: 21st.dev (primary), shadcn/ui (fallback)
- **Charts**: react-chartjs-2 or @21stdev/react-charts
- **Process Map**: react-flow for flowchart
- **State**: React Context + custom hooks

### Data Architecture
- Static JSON files in public/data/
- Enhanced synthetic dataset (4,153 steps, 500 transactions)
- Pre-computed metrics for performance
- Step type classification system
- Variant logic (A-E) implemented

### Design System v5
- Colors: primary-blue (#1E88E5), secondary-green (#4CAF50), warning-orange (#FB8C00), info-purple (#8E24AA)
- Typography: Inter or IBM Plex Sans
- Spacing: 4px base unit
- WCAG 2.1 AA compliance
- Responsive 12-column grid

## Implementation Plan

### Week 1-2: Foundation & Process List
- [ ] Remove existing dashboard implementation
- [ ] Set up new project structure matching Mimica
- [ ] Implement design tokens and theme
- [ ] Build Process List page with search/filter
- [ ] Create badge components (Ease, Automatability)

### Week 3-4: Summary Panel
- [ ] Build Time Saved card component
- [ ] Implement Ease of Deployment gauge
- [ ] Create counts grid components
- [ ] Build donut charts for apps/websites
- [ ] Wire up data from synthetic dataset

### Week 5-6: Process Map
- [ ] Integrate react-flow library
- [ ] Build process map from step data
- [ ] Implement step details panel
- [ ] Add interactive tooltips
- [ ] Color nodes by automata score

### Week 7-8: Data Processing & Optimization
- [ ] Process synthetic data for all metrics
- [ ] Compute derived metrics (time saved, ease score)
- [ ] Optimize performance for large datasets
- [ ] Add loading states and error handling

### Week 9-10: Phase 2 Foundation
- [ ] Build analytics dashboard layout
- [ ] Implement region comparison charts
- [ ] Create variant distribution visualization
- [ ] Build bottleneck detection table

### Week 11-12: Testing & Polish
- [ ] Unit tests for data processing
- [ ] Component tests with React Testing Library
- [ ] E2E tests with Playwright
- [ ] Accessibility audit and fixes
- [ ] Performance optimization

## Success Metrics
- **Phase 1**: Exact replication of Mimica Mapper UI/UX
- **Phase 2**: Process Variation Reduction Index (PVRI) visualization
- **Performance**: LCP < 2.5s, TTI < 3s
- **Accessibility**: WCAG 2.1 AA compliance
- **Code Quality**: 80%+ test coverage

## Risks & Mitigations
1. **UI Complexity**: React-flow integration may be complex
   - Mitigation: Early prototype, fallback to simpler visualization
2. **Data Processing**: Large dataset performance
   - Mitigation: Pre-compute metrics, implement pagination
3. **Design Fidelity**: Matching exact Mimica aesthetic
   - Mitigation: Use screenshots as reference, iterate with feedback

## Next Immediate Steps
1. Archive current implementation
2. Set up new project structure
3. Implement design system tokens
4. Build Process List page
5. Create reusable badge components