import React, { useState } from 'react'
import { X, ChevronDown, ChevronRight, Clock, User, Calendar } from 'lucide-react'
import { useProcessData } from '@/contexts/ProcessContext'

interface TransactionPanelProps {
  processId: string
  onClose: () => void
}

export function TransactionPanel({ processId, onClose }: TransactionPanelProps) {
  const { stepsData } = useProcessData()
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set())
  
  // Group steps by transaction ID
  const transactionGroups = stepsData?.reduce((acc, step) => {
    if (!acc[step.task_id]) {
      acc[step.task_id] = []
    }
    acc[step.task_id].push(step)
    return acc
  }, {} as Record<string, typeof stepsData>) || {}
  
  const toggleTransaction = (transactionId: string) => {
    const newExpanded = new Set(expandedTransactions)
    if (newExpanded.has(transactionId)) {
      newExpanded.delete(transactionId)
    } else {
      newExpanded.add(transactionId)
    }
    setExpandedTransactions(newExpanded)
  }
  
  const getVariantLabel = (variant: string) => {
    const labels: Record<string, string> = {
      'A': 'Standard Flow',
      'B': 'Manager Approval',
      'C': 'Local Logging',
      'D': 'Early Termination',
      'E': 'Summary Report'
    }
    return labels[variant] || variant
  }
  
  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      {/* Filter Bar */}
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(transactionGroups).slice(0, 20).map(([transactionId, steps]) => {
          const isExpanded = expandedTransactions.has(transactionId)
          const firstStep = steps[0]
          const totalDuration = steps.reduce((sum, step) => sum + step.duration_sec, 0)
          
          return (
            <div key={transactionId} className="border-b border-gray-200">
              {/* Transaction Header */}
              <button
                onClick={() => toggleTransaction(transactionId)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      Transaction {transactionId.slice(0, 8)}...
                    </div>
                    <div className="text-xs text-gray-500">
                      {getVariantLabel(firstStep.variant)} • {steps.length} steps
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.round(totalDuration)}s
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {firstStep.recorded_by || 'Unknown'}
                  </span>
                </div>
              </button>
              
              {/* Transaction Details */}
              {isExpanded && (
                <div className="px-4 pb-3 bg-gray-50">
                  <div className="space-y-2 mt-2">
                    {steps.map((step, index) => (
                      <div 
                        key={step.id} 
                        className="flex items-start gap-3 p-2 bg-white rounded border border-gray-200"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {step.action_name.split('_').map(w => 
                              w.charAt(0).toUpperCase() + w.slice(1)
                            ).join(' ')}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{step.duration_sec}s</span>
                            <span>•</span>
                            <span>{step.application || 'System'}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full ${
                              step.auto_score >= 0.8 ? 'bg-green-100 text-green-700' :
                              step.auto_score >= 0.6 ? 'bg-blue-100 text-blue-700' :
                              step.auto_score >= 0.4 ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {Math.round(step.auto_score * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          Showing {Math.min(20, Object.keys(transactionGroups).length)} of {Object.keys(transactionGroups).length} transactions
        </div>
      </div>
    </div>
  )
}