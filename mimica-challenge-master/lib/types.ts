// Types for Mimica Analytics Platform v5

// Process list types
export interface ProcessData {
  id: string
  name: string
  version: 'As-Is' | 'To-Be' | 'v1'
  ease: 'Low' | 'Medium' | 'High'
  automatability: 'Low' | 'Medium' | 'High' | 'Very High'
  timeSpent: number // hrs/y
  created: Date
  recordedSMEs: number
  frequency: number // per day
}

// Raw step data from synthetic dataset
export interface StepData {
  task_id: string
  transaction_id: string
  region: 'Americas' | 'EMEA' | 'APAC' | 'LATAM' | 'North America'
  user_id: string
  role: string
  variant: 'A' | 'B' | 'C' | 'D' | 'E'
  step_index: number
  action_name: string
  application: string
  duration_sec: number
  start_time_sec: number
  end_time_sec: number
  decision_outcome?: string
  auto_score: number
}

// Step type classification
export type StepType = 'Action' | 'Semi-structured Input' | 'Decision' | 'Virtualised Action'

// Process metrics
export interface ProcessMetrics {
  timeSaved: number // hrs/y
  automatabilityRating: 'Low' | 'Medium' | 'High' | 'Very High'
  perSMEPerDay: number
  numberOfSMEs: number
  easeOfDeployment: {
    actions: number
    semiStructuredInputs: number
    decisions: number
    virtualisedActions: number
  }
  counts: {
    actions: number
    semiStructuredInputs: number
    decisions: number
    applications: number
    websites: number
    decisionPaths: number
  }
  applicationUsage: Array<{
    name: string
    percentage: number
  }>
  websiteUsage: Array<{
    name: string
    percentage: number
  }>
}

// Region metrics from processed data
export interface RegionMetric {
  region: string
  avg_duration: number
  median_duration: number
  max_duration: number
  min_duration: number
  avg_step_count: number
  transaction_count: number
}

// Variant metrics
export interface VariantMetric {
  variant: string
  avg_duration: number
  median_duration: number
  step_count: number
  transaction_count: number
}

// Variant distribution
export interface VariantDistribution {
  region: string
  A: number
  B: number
  C: number
  D: number
  E: number
}

// Bottleneck
export interface Bottleneck {
  action_name: string
  avg_duration: number
  median_duration: number
  count: number
  type: StepType
  impact_score?: number
}

// Process map node
export interface ProcessNode {
  id: string
  type: 'action' | 'decision' | 'start' | 'end'
  data: {
    label: string
    duration?: number
    automataScore?: number
    application?: string
    decisionOutcomes?: string[]
  }
  position: { x: number; y: number }
}

// Process map edge
export interface ProcessEdge {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
  style?: React.CSSProperties
}