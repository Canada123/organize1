import React from 'react'
import { RegionMetric } from '@/lib/types'
import { Globe, Clock, Activity, TrendingUp } from 'lucide-react'

interface RegionMetricsProps {
  metrics: RegionMetric[]
  selectedRegion: string | null
  onRegionSelect: (region: string | null) => void
}

export function RegionMetrics({ metrics, selectedRegion, onRegionSelect }: RegionMetricsProps) {
  // Calculate global averages
  const globalMetrics = {
    avgDuration: metrics.reduce((sum, m) => sum + m.avg_duration, 0) / metrics.length,
    totalTransactions: metrics.reduce((sum, m) => sum + m.transaction_count, 0),
    avgStepCount: metrics.reduce((sum, m) => sum + m.avg_step_count, 0) / metrics.length,
  }
  
  const selectedMetric = selectedRegion ? metrics.find(m => m.region === selectedRegion) : null
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Global Summary Card */}
      <div 
        className={`bg-bg-primary rounded-lg p-4 cursor-pointer border-2 transition-all ${
          !selectedRegion ? 'border-primary-blue shadow-md' : 'border-transparent hover:border-border-secondary'
        }`}
        onClick={() => onRegionSelect(null)}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary-blue-light rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-blue" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">All Regions</h3>
            <p className="text-lg font-bold text-text-primary">{globalMetrics.totalTransactions}</p>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Avg Duration:</span>
            <span className="font-medium text-text-primary">{globalMetrics.avgDuration.toFixed(1)}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Avg Steps:</span>
            <span className="font-medium text-text-primary">{globalMetrics.avgStepCount.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      {/* Region Cards */}
      {metrics.map((metric) => {
        const isSelected = selectedRegion === metric.region
        const variance = ((metric.avg_duration - globalMetrics.avgDuration) / globalMetrics.avgDuration * 100)
        const isAboveAverage = variance > 0
        
        return (
          <div
            key={metric.region}
            className={`bg-bg-primary rounded-lg p-4 cursor-pointer border-2 transition-all ${
              isSelected ? 'border-primary-blue shadow-md' : 'border-transparent hover:border-border-secondary'
            }`}
            onClick={() => onRegionSelect(metric.region)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-primary">{metric.region}</h3>
              <div className={`flex items-center gap-1 text-xs ${
                isAboveAverage ? 'text-warning-orange' : 'text-secondary-green'
              }`}>
                <TrendingUp className={`w-3 h-3 ${isAboveAverage ? '' : 'rotate-180'}`} />
                <span>{Math.abs(variance).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-text-secondary" />
                <span className="text-2xl font-bold text-text-primary">{metric.transaction_count}</span>
                <span className="text-xs text-text-secondary">transactions</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-3 h-3 text-text-secondary" />
                <span className="text-text-secondary">Avg:</span>
                <span className="font-medium text-text-primary">{metric.avg_duration.toFixed(1)}s</span>
              </div>
              
              <div className="text-xs text-text-secondary">
                Steps: {metric.avg_step_count.toFixed(1)} • Range: {metric.min_duration.toFixed(0)}-{metric.max_duration.toFixed(0)}s
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}