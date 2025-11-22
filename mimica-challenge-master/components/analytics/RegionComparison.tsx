import React from 'react'
import { RegionMetric } from '@/lib/types'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface RegionComparisonProps {
  metrics: RegionMetric[]
  selectedRegion: string | null
  onRegionSelect: (region: string | null) => void
}

export function RegionComparison({ metrics, selectedRegion, onRegionSelect }: RegionComparisonProps) {
  // Transform data for the chart
  const chartData = metrics.map(metric => ({
    region: metric.region,
    avgDuration: metric.avg_duration,
    medianDuration: metric.median_duration,
    transactions: metric.transaction_count,
    avgSteps: metric.avg_step_count,
  }))
  
  // Calculate global average for reference line
  const globalAvgDuration = metrics.reduce((sum, m) => sum + m.avg_duration, 0) / metrics.length
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-bg-primary border border-border-primary rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-text-primary mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Avg Duration:</span>
              <span className="font-medium text-text-primary">{data.avgDuration.toFixed(1)}s</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Median Duration:</span>
              <span className="font-medium text-text-primary">{data.medianDuration.toFixed(1)}s</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Transactions:</span>
              <span className="font-medium text-text-primary">{data.transactions}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Avg Steps:</span>
              <span className="font-medium text-text-primary">{data.avgSteps.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="region" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: 'Duration (seconds)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#6B7280', fontSize: 12 }
            }}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
          
          {/* Reference line for global average */}
          <line
            x1="0"
            y1={globalAvgDuration}
            x2="100%"
            y2={globalAvgDuration}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
          />
          
          <Bar 
            dataKey="avgDuration" 
            name="Average Duration"
            cursor="pointer"
            onClick={(data: any) => onRegionSelect(data.region)}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.region === selectedRegion ? '#1E88E5' : '#90CAF9'}
              />
            ))}
          </Bar>
          
          <Bar 
            dataKey="medianDuration" 
            name="Median Duration"
            cursor="pointer"
            onClick={(data: any) => onRegionSelect(data.region)}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.region === selectedRegion ? '#1565C0' : '#64B5F6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}