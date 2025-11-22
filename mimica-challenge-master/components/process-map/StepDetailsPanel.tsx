import React from 'react'
import { X, Clock, Activity, Cpu, Layers } from 'lucide-react'
import { ProcessNode } from '@/lib/process-map-data'

interface StepDetailsPanelProps {
  node: ProcessNode
  onClose: () => void
}

export function StepDetailsPanel({ node, onClose }: StepDetailsPanelProps) {
  const automationLevel = 
    node.data.autoScore >= 0.8 ? 'Fully Automatable' :
    node.data.autoScore >= 0.6 ? 'Partially Automatable' :
    node.data.autoScore >= 0.4 ? 'Assisted' : 'Manual'
  
  const automationColor = 
    node.data.autoScore >= 0.8 ? 'text-green-600 bg-green-50' :
    node.data.autoScore >= 0.6 ? 'text-blue-600 bg-blue-50' :
    node.data.autoScore >= 0.4 ? 'text-orange-600 bg-orange-50' : 
    'text-red-600 bg-red-50'

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{node.data.label}</h2>
            <p className="text-sm text-gray-500 mt-1">Step Details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Automation Score */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Automation Potential</h3>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${automationColor}`}>
            <Cpu className="w-4 h-4" />
            {automationLevel} ({Math.round(node.data.autoScore * 100)}%)
          </div>
        </div>
        
        {/* Metrics */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Avg Duration</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{node.data.duration}s</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Occurrences</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{node.data.count}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <Layers className="w-4 h-4" />
                <span className="text-sm">Step Type</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{node.data.stepType}</span>
            </div>
          </div>
        </div>
        
        {/* Application */}
        {node.data.application && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Primary Application</h3>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">{node.data.application}</p>
            </div>
          </div>
        )}
        
        {/* Impact Analysis */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Impact Analysis</h3>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900">
              Total time spent: <span className="font-semibold">{Math.round(node.data.duration * node.data.count)}s</span>
            </p>
            <p className="text-sm text-amber-900 mt-1">
              Potential time saved with automation: <span className="font-semibold">
                {Math.round(node.data.duration * node.data.count * node.data.autoScore)}s
              </span>
            </p>
          </div>
        </div>
        
        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h3>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-900">
              {node.data.autoScore >= 0.8 
                ? '✓ High automation potential. Consider RPA or API integration.'
                : node.data.autoScore >= 0.6
                ? '✓ Good candidate for partial automation. Focus on repetitive subtasks.'
                : node.data.autoScore >= 0.4
                ? '⚡ Consider process optimization before automation.'
                : '⚠️ Manual process. Evaluate for redesign opportunities.'}
            </p>
          </div>
        </div>
        
        {/* Add Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Step Description</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Add a description for this step..."
          />
        </div>
      </div>
    </div>
  )
}