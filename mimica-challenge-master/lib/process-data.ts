import { StepData, ProcessMetrics, StepType } from './types'

// Step type classification based on action name
const STEP_TYPE_MAP: Record<string, StepType> = {
  // Actions
  'read_email': 'Action',
  'download_attachment': 'Action',
  'open_file': 'Action',
  'approve_invoice': 'Action',
  'record_log': 'Action',
  'notify_requester': 'Action',
  
  // Semi-structured Inputs
  'validate_invoice_data': 'Semi-structured Input',
  'update_local_log': 'Semi-structured Input',
  'compile_summary': 'Semi-structured Input',
  
  // Decisions
  'check_tolerance': 'Decision',
  'manager_approval': 'Decision',
  'send_for_review': 'Decision',
  
  // Virtualised Actions
  'end_process': 'Virtualised Action',
}

export function classifyStepType(actionName: string): StepType {
  return STEP_TYPE_MAP[actionName] || 'Action'
}

export async function loadProcessData(): Promise<StepData[]> {
  try {
    const response = await fetch('/data/new_synthetic_invoice_data.json')
    if (!response.ok) {
      throw new Error('Failed to load process data')
    }
    const data = await response.json()
    return data as StepData[]
  } catch (error) {
    console.error('Error loading process data:', error)
    throw error
  }
}

export async function computeProcessMetrics(
  processId: string, 
  stepsData: StepData[]
): Promise<ProcessMetrics> {
  // Filter steps for this process
  const processSteps = stepsData.filter(step => step.task_id === processId)
  
  // Group by transaction to compute metrics
  const transactionGroups = groupBy(processSteps, 'transaction_id')
  const transactions = Object.values(transactionGroups)
  
  // Compute step type counts
  const stepTypeCounts = {
    actions: 0,
    semiStructuredInputs: 0,
    decisions: 0,
    virtualisedActions: 0,
  }
  
  const uniqueActions = new Set<string>()
  const uniqueApplications = new Set<string>()
  const decisionPaths = new Set<string>()
  
  processSteps.forEach(step => {
    const stepType = classifyStepType(step.action_name)
    uniqueActions.add(step.action_name)
    
    if (step.application && step.application !== '-') {
      uniqueApplications.add(step.application)
    }
    
    switch (stepType) {
      case 'Action':
        stepTypeCounts.actions++
        break
      case 'Semi-structured Input':
        stepTypeCounts.semiStructuredInputs++
        break
      case 'Decision':
        stepTypeCounts.decisions++
        if (step.decision_outcome) {
          decisionPaths.add(`${step.action_name}:${step.decision_outcome}`)
        }
        break
      case 'Virtualised Action':
        stepTypeCounts.virtualisedActions++
        break
    }
  })
  
  // Compute automatability rating
  const avgAutoScore = processSteps.reduce((sum, step) => sum + step.auto_score, 0) / processSteps.length
  const automatabilityRating = 
    avgAutoScore >= 0.8 ? 'Very High' :
    avgAutoScore >= 0.6 ? 'High' :
    avgAutoScore >= 0.4 ? 'Medium' : 'Low'
  
  // Compute time saved (mock calculation)
  const totalDuration = transactions.reduce((sum, steps) => {
    const transactionDuration = steps.reduce((s, step) => s + step.duration_sec, 0)
    return sum + transactionDuration
  }, 0)
  const avgDuration = totalDuration / transactions.length
  const minDuration = Math.min(...transactions.map(steps => 
    steps.reduce((s, step) => s + step.duration_sec, 0)
  ))
  const timeSaved = ((avgDuration - minDuration) * transactions.length * 250) / 3600 // Convert to hrs/y
  
  // Compute application usage
  const appDurations: Record<string, number> = {}
  processSteps.forEach(step => {
    if (step.application && step.application !== '-') {
      appDurations[step.application] = (appDurations[step.application] || 0) + step.duration_sec
    }
  })
  
  const totalAppDuration = Object.values(appDurations).reduce((sum, d) => sum + d, 0)
  const applicationUsage = Object.entries(appDurations)
    .map(([name, duration]) => ({
      name,
      percentage: (duration / totalAppDuration) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4)
  
  // Mock website usage (treat some apps as websites)
  const websiteUsage = [
    { name: 'SharePoint.mycompany.com', percentage: 42 },
    { name: 'SAP Portal', percentage: 26 },
    { name: 'Internal Wiki', percentage: 20 },
    { name: 'Other', percentage: 12 },
  ]
  
  // Get unique SMEs
  const uniqueSMEs = new Set(processSteps.map(s => s.user_id)).size
  
  return {
    timeSaved: Math.round(timeSaved),
    automatabilityRating,
    perSMEPerDay: Math.round(timeSaved / uniqueSMEs / 250), // Assuming 250 working days
    numberOfSMEs: uniqueSMEs,
    easeOfDeployment: {
      actions: (stepTypeCounts.actions / processSteps.length) * 100,
      semiStructuredInputs: (stepTypeCounts.semiStructuredInputs / processSteps.length) * 100,
      decisions: (stepTypeCounts.decisions / processSteps.length) * 100,
      virtualisedActions: (stepTypeCounts.virtualisedActions / processSteps.length) * 100,
    },
    counts: {
      actions: stepTypeCounts.actions,
      semiStructuredInputs: stepTypeCounts.semiStructuredInputs,
      decisions: stepTypeCounts.decisions,
      applications: uniqueApplications.size,
      websites: 4, // Mock
      decisionPaths: decisionPaths.size,
    },
    applicationUsage,
    websiteUsage,
  }
}

// Helper function to group array by key
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}