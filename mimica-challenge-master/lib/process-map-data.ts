import { StepData } from './types'
import { Edge, Node, Position, MarkerType } from 'reactflow'

export interface ProcessNode extends Node {
  data: {
    label: string
    duration: number
    count: number
    autoScore: number
    stepType: string
    application?: string
  }
}

export interface ProcessMapData {
  nodes: ProcessNode[]
  edges: Edge[]
}

// Define the expected flow structure based on variants
const PROCESS_FLOW_TEMPLATE = {
  'read_email': ['download_attachment'],
  'download_attachment': ['open_invoice'],
  'open_invoice': ['validate_invoice_data'],
  'validate_invoice_data': ['check_tolerance'],
  'check_tolerance': ['manager_approval', 'approve_invoice'], // Decision point
  'manager_approval': ['send_for_review', 'approve_invoice'], // Decision point
  'send_for_review': ['approve_invoice'],
  'approve_invoice': ['record_log', 'update_local_log', 'notify_requester'],
  'record_log': ['notify_requester', 'end_process'],
  'update_local_log': ['notify_requester', 'compile_summary'],
  'compile_summary': ['notify_requester'],
  'notify_requester': ['end_process'],
  'end_process': []
}

// Color mapping for step types
const STEP_TYPE_COLORS = {
  'Action': '#4CAF50',
  'Semi-structured Input': '#2196F3',
  'Decision': '#FF9800',
  'Virtualised Action': '#9C27B0'
}

export function generateProcessMapData(steps: StepData[]): ProcessMapData {
  // Group steps by action to calculate aggregates
  const actionGroups = steps.reduce((acc, step) => {
    if (!acc[step.action_name]) {
      acc[step.action_name] = {
        steps: [],
        totalDuration: 0,
        count: 0,
        avgAutoScore: 0
      }
    }
    acc[step.action_name].steps.push(step)
    acc[step.action_name].totalDuration += step.duration_sec
    acc[step.action_name].count++
    acc[step.action_name].avgAutoScore += step.auto_score
    return acc
  }, {} as Record<string, any>)

  // Calculate averages
  Object.values(actionGroups).forEach((group: any) => {
    group.avgDuration = group.totalDuration / group.count
    group.avgAutoScore = group.avgAutoScore / group.count
  })

  // Create nodes
  const nodes: ProcessNode[] = []
  const nodePositions: Record<string, { x: number; y: number }> = {}
  
  // Define layout positions for a clean flow
  const layoutConfig = {
    'read_email': { x: 100, y: 100 },
    'download_attachment': { x: 300, y: 100 },
    'open_invoice': { x: 500, y: 100 },
    'validate_invoice_data': { x: 700, y: 100 },
    'check_tolerance': { x: 900, y: 100 },
    'manager_approval': { x: 1100, y: 50 },
    'approve_invoice': { x: 1100, y: 200 },
    'send_for_review': { x: 1300, y: 50 },
    'record_log': { x: 1300, y: 150 },
    'update_local_log': { x: 1300, y: 250 },
    'notify_requester': { x: 1500, y: 200 },
    'compile_summary': { x: 1300, y: 350 },
    'end_process': { x: 1700, y: 200 }
  }

  // Create nodes for each action
  Object.entries(actionGroups).forEach(([actionName, data]: [string, any]) => {
    const position = layoutConfig[actionName as keyof typeof layoutConfig] || { x: 0, y: 0 }
    const stepType = getStepType(actionName)
    
    nodes.push({
      id: actionName,
      type: 'default',
      position,
      data: {
        label: formatActionName(actionName),
        duration: Math.round(data.avgDuration * 10) / 10,
        count: data.count,
        autoScore: Math.round(data.avgAutoScore * 100) / 100,
        stepType,
        application: getMostCommonApplication(data.steps)
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    })
    
    nodePositions[actionName] = position
  })

  // Create edges based on the flow template
  const edges: Edge[] = []
  Object.entries(PROCESS_FLOW_TEMPLATE).forEach(([source, targets]) => {
    targets.forEach((target, index) => {
      if (actionGroups[source] && actionGroups[target]) {
        edges.push({
          id: `${source}-${target}`,
          source,
          target,
          type: 'smoothstep',
          animated: index === 0, // Animate primary path
          style: {
            stroke: index === 0 ? '#1E88E5' : '#9CA3AF',
            strokeWidth: 2
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: index === 0 ? '#1E88E5' : '#9CA3AF'
          }
        })
      }
    })
  })

  return { nodes, edges }
}

function getStepType(actionName: string): string {
  const decisionSteps = ['check_tolerance', 'manager_approval', 'send_for_review']
  const inputSteps = ['validate_invoice_data', 'update_local_log', 'compile_summary']
  const virtualSteps = ['end_process']
  
  if (decisionSteps.includes(actionName)) return 'Decision'
  if (inputSteps.includes(actionName)) return 'Semi-structured Input'
  if (virtualSteps.includes(actionName)) return 'Virtualised Action'
  return 'Action'
}

function getNodeColor(autoScore: number): string {
  if (autoScore >= 0.8) return '#4CAF50' // Green - High automation
  if (autoScore >= 0.6) return '#2196F3' // Blue - Medium-high
  if (autoScore >= 0.4) return '#FF9800' // Orange - Medium
  return '#F44336' // Red - Low automation
}

function formatActionName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getMostCommonApplication(steps: StepData[]): string {
  const appCounts = steps.reduce((acc, step) => {
    if (step.application && step.application !== '-') {
      acc[step.application] = (acc[step.application] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  
  const sortedApps = Object.entries(appCounts).sort((a, b) => b[1] - a[1])
  return sortedApps[0]?.[0] || 'N/A'
}