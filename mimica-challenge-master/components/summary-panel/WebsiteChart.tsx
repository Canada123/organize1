import React from 'react'

interface WebsiteChartProps {
  data: Array<{
    name: string
    percentage: number
  }>
}

export function WebsiteChart({ data }: WebsiteChartProps) {
  // Sort data by percentage descending
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage)
  
  // Colors for each segment
  const colors = ['#2196F3', '#00BCD4', '#009688', '#4CAF50', '#8BC34A']
  
  // Calculate angles for donut chart
  let currentAngle = -90 // Start at top
  const centerX = 100
  const centerY = 100
  const outerRadius = 80
  const innerRadius = 50
  
  const segments = sortedData.map((item, index) => {
    const startAngle = currentAngle
    const sweepAngle = (item.percentage / 100) * 360
    currentAngle += sweepAngle
    
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (currentAngle * Math.PI) / 180
    
    // Outer arc
    const x1 = centerX + outerRadius * Math.cos(startAngleRad)
    const y1 = centerY + outerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(endAngleRad)
    const y2 = centerY + outerRadius * Math.sin(endAngleRad)
    
    // Inner arc
    const x3 = centerX + innerRadius * Math.cos(endAngleRad)
    const y3 = centerY + innerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(startAngleRad)
    const y4 = centerY + innerRadius * Math.sin(startAngleRad)
    
    const largeArcFlag = sweepAngle > 180 ? 1 : 0
    
    const path = `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `
    
    return {
      ...item,
      path,
      color: colors[index % colors.length],
    }
  })
  
  return (
    <div className="flex items-center justify-between">
      {/* Donut Chart */}
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            </g>
          ))}
          
          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            className="text-2xl font-bold fill-text-primary"
          >
            {data.length}
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            className="text-sm fill-text-secondary"
          >
            Sites
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="space-y-2 min-w-[140px]">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm text-text-secondary truncate flex-1">
              {segment.name}
            </span>
            <span className="text-sm font-medium text-text-primary">
              {Math.round(segment.percentage)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}