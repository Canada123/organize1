import React from 'react'
import { ProcessMetrics } from '@/lib/types'

interface EaseOfDeploymentGaugeProps {
  metrics: ProcessMetrics
}

export function EaseOfDeploymentGauge({ metrics }: EaseOfDeploymentGaugeProps) {
  const { easeOfDeployment } = metrics
  
  // Calculate the angle for the gauge (180 degrees total)
  const totalPercentage = 100
  const gaugeRadius = 80
  const strokeWidth = 12
  const centerX = 100
  const centerY = 100
  
  // Create segments for each step type
  const segments = [
    { type: 'Actions', percentage: easeOfDeployment.actions, color: '#4CAF50' },
    { type: 'Semi-structured Inputs', percentage: easeOfDeployment.semiStructuredInputs, color: '#2196F3' },
    { type: 'Decisions', percentage: easeOfDeployment.decisions, color: '#FF9800' },
    { type: 'Virtualised Actions', percentage: easeOfDeployment.virtualisedActions, color: '#9C27B0' },
  ].filter(seg => seg.percentage > 0)
  
  // Calculate path for each segment
  let currentAngle = -90 // Start at top
  const segmentPaths = segments.map(segment => {
    const startAngle = currentAngle
    const sweepAngle = (segment.percentage / totalPercentage) * 180
    currentAngle += sweepAngle
    
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (currentAngle * Math.PI) / 180
    
    const x1 = centerX + gaugeRadius * Math.cos(startAngleRad)
    const y1 = centerY + gaugeRadius * Math.sin(startAngleRad)
    const x2 = centerX + gaugeRadius * Math.cos(endAngleRad)
    const y2 = centerY + gaugeRadius * Math.sin(endAngleRad)
    
    const largeArcFlag = sweepAngle > 180 ? 1 : 0
    
    return {
      ...segment,
      path: `M ${centerX} ${centerY} L ${x1} ${y1} A ${gaugeRadius} ${gaugeRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    }
  })
  
  return (
    <div className="flex items-center justify-between">
      {/* Gauge */}
      <div className="relative">
        <svg width="200" height="120" viewBox="0 20 200 100">
          {/* Background arc */}
          <path
            d={`M ${centerX - gaugeRadius} ${centerY} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${centerX + gaugeRadius} ${centerY}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          
          {/* Segments */}
          {segmentPaths.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill={segment.color}
              opacity={0.8}
            />
          ))}
          
          {/* Center text */}
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            className="text-2xl font-bold fill-text-primary"
          >
            {Math.round(easeOfDeployment.actions)}%
          </text>
          <text
            x={centerX}
            y={centerY + 25}
            textAnchor="middle"
            className="text-xs fill-text-secondary"
          >
            Actions
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm text-text-secondary">{segment.type}</span>
            <span className="text-sm font-medium text-text-primary ml-auto">
              {segment.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}