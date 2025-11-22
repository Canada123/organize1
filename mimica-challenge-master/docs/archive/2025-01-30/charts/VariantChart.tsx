'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useFilteredMetrics } from '@/hooks/useMetrics'
import { useMetrics } from '@/contexts/DataContext'
import { VariantKey } from '@/lib/types'

const VARIANT_COLORS = {
  A: '#87CEEB', // Blue - Standard
  B: '#98D8C8', // Green - Extra Approval
  C: '#B19CD9', // Purple - Local Logging
  D: '#FFB347', // Orange - Early Termination
  E: '#FF9FB5'  // Pink - Summary Report
}

const VARIANT_LABELS = {
  A: 'Standard',
  B: 'Extra Approval',
  C: 'Local Logging',
  D: 'Early Termination',
  E: 'Summary Report'
}

export function VariantChart() {
  const { variantDistribution } = useFilteredMetrics()
  const { filters } = useMetrics()
  
  const data = variantDistribution
  
  const variants: VariantKey[] = ['A', 'B', 'C', 'D', 'E']
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-white p-3 border border-border-primary rounded shadow-sm">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{VARIANT_LABELS[entry.name as VariantKey]}:</span>
              <span className="font-medium">{entry.value}</span>
              <span className="text-text-secondary">
                ({((entry.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-border-primary text-sm">
            <span>Total: {total}</span>
          </div>
        </div>
      )
    }
    return null
  }
  
  const CustomLegend = (props: any) => {
    const { payload } = props
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{VARIANT_LABELS[entry.value as VariantKey]}</span>
          </div>
        ))}
      </div>
    )
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
        <YAxis label={{ value: 'Transaction Count', angle: -90, position: 'insideLeft' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        {variants.map(variant => (
          <Bar
            key={variant}
            dataKey={variant}
            stackId="a"
            fill={VARIANT_COLORS[variant]}
            opacity={filters.selectedRegion ? 1 : 0.9}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}