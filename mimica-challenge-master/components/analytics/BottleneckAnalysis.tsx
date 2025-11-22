import React from 'react'
import { Bottleneck } from '@/lib/types'
import { AlertTriangle, Clock, Activity } from 'lucide-react'

interface BottleneckAnalysisProps {
  bottlenecks: Bottleneck[]
  selectedRegion: string | null
}

export function BottleneckAnalysis({ bottlenecks, selectedRegion }: BottleneckAnalysisProps) {
  // In a real app, we'd filter bottlenecks by region
  // For now, we'll show all bottlenecks with a note about region filtering
  const topBottlenecks = bottlenecks.slice(0, 5)
  
  // Calculate impact scores if not present
  const bottlenecksWithImpact = topBottlenecks.map(b => ({
    ...b,
    impact_score: b.impact_score || (b.avg_duration * b.count) / 1000
  }))
  
  const maxImpact = Math.max(...bottlenecksWithImpact.map(b => b.impact_score || 0))
  
  return (
    <div>
      {selectedRegion && (
        <div className="mb-4 p-3 bg-info-purple-light rounded-lg">
          <p className="text-sm text-info-purple flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Showing global bottlenecks. Region-specific filtering coming soon.
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        {bottlenecksWithImpact.map((bottleneck, index) => {
          const impactPercentage = ((bottleneck.impact_score || 0) / maxImpact) * 100
          const stepTypeColor = {
            'Action': 'text-secondary-green',
            'Semi-structured Input': 'text-primary-blue',
            'Decision': 'text-warning-orange',
            'Virtualised Action': 'text-info-purple',
          }[bottleneck.type] || 'text-text-secondary'
          
          return (
            <div
              key={bottleneck.action_name}
              className="p-4 bg-bg-secondary rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">
                      {index + 1}. {bottleneck.action_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className={`text-xs ${stepTypeColor}`}>
                      {bottleneck.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Avg: {bottleneck.avg_duration.toFixed(1)}s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>Count: {bottleneck.count}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-text-secondary mb-1">Impact Score</div>
                  <div className="text-lg font-bold text-warning-orange">
                    {(bottleneck.impact_score || 0).toFixed(0)}
                  </div>
                </div>
              </div>
              
              {/* Impact Bar */}
              <div className="mt-3">
                <div className="w-full bg-bg-primary rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-warning-orange-light to-warning-orange transition-all duration-500"
                    style={{ width: `${impactPercentage}%` }}
                  />
                </div>
              </div>
              
              {/* Recommendations */}
              {index < 3 && (
                <div className="mt-3 p-2 bg-bg-primary rounded text-xs text-text-secondary">
                  💡 Consider automating this step or optimizing the workflow to reduce processing time
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-bg-primary rounded-lg border border-border-primary">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Bottleneck Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Total Impact Time:</span>
            <span className="ml-2 font-medium text-text-primary">
              {bottlenecksWithImpact.reduce((sum, b) => sum + b.avg_duration * b.count, 0).toFixed(0)}s
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Avg Duration:</span>
            <span className="ml-2 font-medium text-text-primary">
              {(bottlenecksWithImpact.reduce((sum, b) => sum + b.avg_duration, 0) / bottlenecksWithImpact.length).toFixed(1)}s
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Most Common Type:</span>
            <span className="ml-2 font-medium text-text-primary">
              {bottlenecksWithImpact[0]?.type || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Total Occurrences:</span>
            <span className="ml-2 font-medium text-text-primary">
              {bottlenecksWithImpact.reduce((sum, b) => sum + b.count, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}