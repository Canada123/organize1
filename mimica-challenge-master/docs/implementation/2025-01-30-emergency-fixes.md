# Emergency Fix Plan - Mimica Analytics Platform
Date: 2025-01-30
Status: URGENT - Demo Tomorrow

## Critical Issues to Fix

### 1. Data Processing - Extract All Processes from Dataset (2 hours)

**Problem**: Only showing 2 hardcoded processes instead of all unique processes from the 4,153 steps.

**Fix Required**:
```typescript
// In ProcessContext.tsx, replace lines 34-58:
// Extract unique processes from the dataset
const uniqueProcesses = new Map<string, ProcessData>()

steps.forEach(step => {
  const processKey = `${step.task_id}_${step.version}`
  if (!uniqueProcesses.has(processKey)) {
    uniqueProcesses.set(processKey, {
      id: processKey,
      name: formatProcessName(step.task_id),
      version: step.version || 'As-Is',
      ease: calculateEase(steps, step.task_id),
      automatability: calculateAutomatability(steps, step.task_id),
      timeSpent: calculateTimeSpent(steps, step.task_id),
      created: new Date('2024-04-04'), // Mock date
      recordedSMEs: countUniqueSMEs(steps, step.task_id),
      frequency: calculateFrequency(steps, step.task_id),
    })
  }
})

const processes = Array.from(uniqueProcesses.values())
```

**Helper Functions Needed**:
- `formatProcessName()` - Convert task_id to readable format
- `calculateEase()` - Determine Low/Medium/High based on step complexity
- `calculateAutomatability()` - Based on average auto_score
- `calculateTimeSpent()` - Sum duration * frequency * working days
- `countUniqueSMEs()` - Count unique user_ids per process
- `calculateFrequency()` - Transactions per day

### 2. Process Map Implementation (4-6 hours)

**Missing Component**: The entire Map tab with React Flow visualization

**Implementation Steps**:
1. Install dependencies:
   ```bash
   npm install reactflow @reactflow/core @reactflow/controls @reactflow/minimap
   ```

2. Create components/process-map/ProcessMap.tsx:
   ```typescript
   - Convert step sequences to nodes and edges
   - Color code by step type (green=action, blue=input, orange=decision)
   - Show duration and frequency on nodes
   - Add zoom/pan controls
   - Implement variant overlay
   ```

3. Create lib/process-map-data.ts:
   ```typescript
   - Transform steps into flow graph structure
   - Calculate node positions
   - Determine edge paths
   - Handle decision branches
   ```

### 3. Missing Donut Charts (1 hour)

**Components**: ApplicationChart.tsx and WebsiteChart.tsx

**Implementation**:
```typescript
// Already have the structure, just need to ensure they render
// Check if they're being hidden or not included in Summary panel
// May need to adjust layout grid to show them
```

### 4. Process List UI Fixes (1 hour)

**Missing Elements**:
- Time Spent column (hrs/y format)
- Frequency column (per day)
- More processes (should show 10-15)
- Proper row hover states

**CSS Updates**:
```css
/* Add to ProcessList.tsx styles */
.process-row:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.time-spent {
  font-weight: 500;
  color: #666;
}
```

### 5. Visual Polish (1 hour)

**Design System Alignment**:
- Match exact colors from screenshots
- Fix font sizes and weights
- Add proper shadows to cards
- Improve spacing between components
- Add missing header buttons (New Project, View, Share, Export)

## Implementation Priority

### Phase 1: Data Foundation (Complete First!)
1. Fix ProcessContext to extract all processes
2. Verify 10-15 processes appear in list
3. Ensure metrics calculate correctly

### Phase 2: Core Features
1. Implement Process Map with React Flow
2. Add missing donut charts to Summary
3. Fix Process List columns

### Phase 3: Polish
1. Visual design alignment
2. Add missing buttons and controls
3. Test all interactions

## Testing Checklist

- [ ] At least 10 processes show in list
- [ ] Time Spent and Frequency columns display
- [ ] Process Map renders with nodes and edges
- [ ] Donut charts show in Summary panel
- [ ] All tabs are functional
- [ ] Region filtering works in Analytics
- [ ] Visual design matches screenshots

## Risk Mitigation

If time runs out:
1. **Minimum Viable**: Fix data to show all processes
2. **Good Enough**: Add Process Map even if basic
3. **Nice to Have**: Visual polish and minor features

## File Modifications Required

1. `/contexts/ProcessContext.tsx` - Replace mock data with dynamic extraction
2. `/components/process-list/ProcessList.tsx` - Add missing columns
3. `/components/process-map/ProcessMap.tsx` - Create new component
4. `/components/summary-panel/SummaryPanel.tsx` - Include donut charts
5. `/lib/process-map-data.ts` - Create data transformation
6. `/app/page.tsx` - Add header buttons

## Commands to Run

```bash
# Install dependencies
npm install reactflow @reactflow/core @reactflow/controls

# Run development server
npm run dev

# Test the application
# 1. Check process list shows 10+ items
# 2. Click process to see summary
# 3. Click Map tab to see flow diagram
# 4. Navigate to Analytics page
# 5. Test region filtering
```

## Success Criteria

**Demo Ready When**:
- Shows realistic number of processes (10+)
- Process Map displays flow diagram
- All UI components present
- Smooth interactions
- Professional appearance

**Time Estimate**: 9-13 hours total
**Recommended**: Start with data fix, then Process Map