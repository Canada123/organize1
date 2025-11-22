import React from 'react'
import { 
  MousePointer, 
  FileInput, 
  GitBranch, 
  Monitor, 
  Globe, 
  Route 
} from 'lucide-react'

interface CountsGridProps {
  counts: {
    actions: number
    semiStructuredInputs: number
    decisions: number
    applications: number
    websites: number
    decisionPaths: number
  }
}

export function CountsGrid({ counts }: CountsGridProps) {
  const items = [
    {
      icon: MousePointer,
      label: 'Actions',
      value: counts.actions,
      color: 'text-secondary-green',
      bgColor: 'bg-secondary-green-light',
    },
    {
      icon: FileInput,
      label: 'Semi-structured Inputs',
      value: counts.semiStructuredInputs,
      color: 'text-primary-blue',
      bgColor: 'bg-primary-blue-light',
    },
    {
      icon: GitBranch,
      label: 'Decisions',
      value: counts.decisions,
      color: 'text-warning-orange',
      bgColor: 'bg-warning-orange-light',
    },
    {
      icon: Monitor,
      label: 'Applications',
      value: counts.applications,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Globe,
      label: 'Websites',
      value: counts.websites,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Route,
      label: 'Decision Paths',
      value: counts.decisionPaths,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <div
            key={index}
            className="bg-bg-secondary rounded-lg p-4 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{item.value}</div>
              <div className="text-sm text-text-secondary">{item.label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}