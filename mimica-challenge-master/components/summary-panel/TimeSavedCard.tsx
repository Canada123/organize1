import React from 'react'
import { ProcessMetrics } from '@/lib/types'
import { Clock, TrendingUp } from 'lucide-react'

interface TimeSavedCardProps {
  metrics: ProcessMetrics
}

export function TimeSavedCard({ metrics }: TimeSavedCardProps) {
  return (
    <div className="bg-bg-secondary rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Time Saved</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-text-primary">{metrics.timeSaved.toLocaleString()}</span>
            <span className="text-lg text-text-secondary">hrs/y</span>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Automatability:</span>
              <span className={`text-sm font-medium ${
                metrics.automatabilityRating === 'Very High' ? 'text-secondary-green' :
                metrics.automatabilityRating === 'High' ? 'text-secondary-green' :
                metrics.automatabilityRating === 'Medium' ? 'text-warning-orange' :
                'text-text-secondary'
              }`}>
                {metrics.automatabilityRating}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Per SME/Day:</span>
              <span className="text-sm font-medium text-text-primary">{metrics.perSMEPerDay}h</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">SMEs:</span>
              <span className="text-sm font-medium text-text-primary">{metrics.numberOfSMEs}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center w-24 h-24 bg-primary-blue-light rounded-full">
          <Clock className="w-8 h-8 text-primary-blue" />
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-sm text-secondary-green">
        <TrendingUp className="w-4 h-4" />
        <span>High automation potential identified</span>
      </div>
    </div>
  )
}