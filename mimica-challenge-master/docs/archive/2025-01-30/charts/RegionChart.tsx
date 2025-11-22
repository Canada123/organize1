'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFilteredMetrics } from '@/hooks/useMetrics'
import { useMetrics } from '@/contexts/DataContext'
import { formatDuration } from '@/lib/data'

const COLORS = ['#87CEEB', '#98D8C8', '#B19CD9', '#FFB347', '#FF9FB5']

export function RegionChart() {
  const { regionMetrics } = useFilteredMetrics()
  const { filters, setSelectedRegion } = useMetrics()
  
  const data = regionMetrics.map((metric, index) => ({
    region: metric.region,
    avgDuration: metric.avg_duration,
    transactionCount: metric.transaction_count,
    color: COLORS[index % COLORS.length]
  }))
  
  const handleClick = (data: any) => {
    if (filters.selectedRegion === data.region) {
      setSelectedRegion(null)
    } else {
      setSelectedRegion(data.region)
    }
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-border-primary rounded shadow-sm">
          <p className="font-semibold">{data.region}</p>
          <p className="text-sm">Avg Duration: {formatDuration(data.avgDuration)}</p>
          <p className="text-sm">Transactions: {data.transactionCount}</p>
        </div>
      )
    }
    return null
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="region" 
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          tickFormatter={(value) => `${value}s`}
          label={{ value: 'Average Duration (seconds)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="avgDuration" 
          onClick={handleClick}
          cursor="pointer"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              opacity={filters.selectedRegion === null || filters.selectedRegion === entry.region ? 1 : 0.3}
              stroke={filters.selectedRegion === entry.region ? '#3B82F6' : 'none'}
              strokeWidth={filters.selectedRegion === entry.region ? 3 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}