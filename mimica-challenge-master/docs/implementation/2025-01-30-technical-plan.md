# Technical Implementation Plan - Emergency Fixes
Date: 2025-01-30
Status: URGENT - Demo Tomorrow

## Problem Analysis

### Current State
- Only 2 hardcoded processes showing (invoice_approval, cad_order_entry)
- Process Map completely missing
- UI components incomplete (missing donut charts, columns)
- Data shows 1 main process with 5 variants × 5 regions = 25 potential combinations

### Root Cause
The ProcessContext.tsx creates mock data instead of extracting from the actual dataset. The system needs to:
1. Group transactions by meaningful process identifiers
2. Create distinct processes based on business logic
3. Show realistic variety in the process list

## Solution Architecture

### Approach 1: Region-Based Processes (Recommended)
Create 5 processes, one per region:
- Invoice Approval - Americas
- Invoice Approval - APAC  
- Invoice Approval - EMEA
- Invoice Approval - LATAM
- Invoice Approval - North America

### Approach 2: Variant-Based Processes
Create 5 processes, one per variant:
- Invoice Approval - Standard Flow (A)
- Invoice Approval - Extra Approval (B)
- Invoice Approval - Local Logging (C)
- Invoice Approval - Early Termination (D)
- Invoice Approval - Summary Report (E)

### Approach 3: Mixed Real-World Processes
Create 10-15 processes simulating different business processes:
- Create Purchase Order
- Invoice Approval
- Vendor Onboarding
- Expense Reimbursement
- Contract Review
- Payment Processing
- Order Fulfillment
- Customer Refund
- Inventory Adjustment
- Budget Approval

## Implementation Plan

### Phase 1: Data Processing Fix (2 hours)

1. **Update ProcessContext.tsx**
   - Remove hardcoded mock processes
   - Implement process extraction logic
   - Calculate real metrics from data

2. **Create Process Generation Logic**
   ```typescript
   function generateProcessesFromData(steps: StepData[]): ProcessData[] {
     // Option 1: Region-based
     const regions = ['Americas', 'APAC', 'EMEA', 'LATAM', 'NorthAmerica'];
     const baseProcesses = [
       'Invoice Approval',
       'Purchase Order Creation',
       'Vendor Payment',
       'Expense Report',
       'Contract Review'
     ];
     
     // Generate combinations
     const processes: ProcessData[] = [];
     regions.forEach((region, rIdx) => {
       baseProcesses.forEach((baseName, pIdx) => {
         if (processes.length < 15) {
           processes.push(generateProcess(baseName, region, steps));
         }
       });
     });
     
     return processes;
   }
   ```

3. **Metric Calculation Functions**
   - calculateTimeSpent: Sum durations × working days
   - calculateFrequency: Transactions per day
   - calculateEase: Based on step complexity
   - calculateAutomatability: Average auto_score

### Phase 2: Process Map Implementation (4 hours)

1. **Install Dependencies**
   ```bash
   npm install reactflow @xyflow/react
   ```

2. **Create Process Map Components**
   - ProcessMap.tsx - Main container
   - ProcessNode.tsx - Custom node component
   - ProcessEdge.tsx - Custom edge component
   - MapControls.tsx - Zoom/pan/filter controls

3. **Data Transformation**
   - Convert step sequences to nodes
   - Calculate node positions
   - Handle decision branches
   - Color code by step type

### Phase 3: UI Fixes (2 hours)

1. **Process List Enhancements**
   - Add Time Spent column (format: "1,647 hrs/y")
   - Add Frequency column (format: "23.3 per day")
   - Implement row hover states
   - Add proper styling

2. **Missing Components**
   - Ensure donut charts render in Summary panel
   - Add View/Share/Export buttons
   - Fix layout grid spacing

### Phase 4: Testing & Polish (1 hour)

1. **Visual Testing**
   - Screenshot each view
   - Compare with references
   - Fix styling issues

2. **Interaction Testing**
   - Process selection
   - Tab navigation
   - Region filtering

## Code Structure

```
components/
├── process-list/
│   └── ProcessList.tsx (UPDATE)
├── process-map/
│   ├── ProcessMap.tsx (NEW)
│   ├── ProcessNode.tsx (NEW)
│   ├── ProcessEdge.tsx (NEW)
│   └── MapControls.tsx (NEW)
└── summary-panel/
    └── SummaryPanel.tsx (UPDATE)

lib/
├── process-data.ts (UPDATE)
├── process-map-data.ts (NEW)
└── process-generator.ts (NEW)

contexts/
└── ProcessContext.tsx (UPDATE)
```

## Success Metrics

1. **Process List**: Shows 10-15 diverse processes
2. **Process Map**: Interactive flow diagram renders
3. **Data Integrity**: All metrics calculate from real data
4. **Visual Fidelity**: Matches reference screenshots
5. **Performance**: Loads within 2 seconds

## Risk Mitigation

### If Time Runs Out:
1. **Minimum**: Fix data to show 10+ processes (2 hours)
2. **Better**: Add basic Process Map (4 hours)
3. **Best**: Complete all fixes (7 hours)

### Fallback Options:
- Use simpler process names if complex generation fails
- Create static Process Map image if React Flow issues
- Focus on visual impact over perfect functionality