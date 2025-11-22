import React from 'react'
import { VariantDistribution as VariantData } from '@/lib/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface VariantDistributionProps {
  data: VariantData[]
  selectedRegion: string | null
}

const VARIANT_COLORS = {
  A: '#4CAF50', // Standard flow
  B: '#2196F3', // Extra approval
  C: '#FF9800', // Local logging
  D: '#9C27B0', // Early termination
  E: '#F44336', // Summary report
}

const VARIANT_DESCRIPTIONS = {
  A: 'Standard flow',
  B: 'Extra approval',
  C: 'Local logging',
  D: 'Early termination',
  E: 'Summary report',
}

export function VariantDistribution({ data, selectedRegion }: VariantDistributionProps) {
  // Get data for selected region or aggregate all regions
  const variantData = selectedRegion
    ? data.find(d => d.region === selectedRegion)
    : data.reduce((acc, curr) => ({
        region: 'All Regions',
        A: acc.A + curr.A,
        B: acc.B + curr.B,
        C: acc.C + curr.C,
        D: acc.D + curr.D,
        E: acc.E + curr.E,
      }), { region: 'All Regions', A: 0, B: 0, C: 0, D: 0, E: 0 })
  
  if (!variantData) return null
  
  // Transform data for pie chart
  const pieData = Object.entries(VARIANT_COLORS).map(([variant, color]) => ({
    name: `Variant ${variant}`,
    value: variantData[variant as keyof typeof VARIANT_COLORS],
    color,
    description: VARIANT_DESCRIPTIONS[variant as keyof typeof VARIANT_DESCRIPTIONS],
  }))
  
  const total = pieData.reduce((sum, item) => sum + item.value, 0)
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-bg-primary border border-border-primary rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">{data.payload.description}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="text-text-secondary">Count:</span>{' '}
              <span className="font-medium text-text-primary">{data.value}</span>
            </p>
            <p className="text-sm">
              <span className="text-text-secondary">Percentage:</span>{' '}
              <span className="font-medium text-text-primary">{percentage}%</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }
  
  const renderCustomLabel = (entry: any) => {
    const percentage = ((entry.value / total) * 100)
    return percentage > 5 ? `${percentage.toFixed(0)}%` : ''
  }
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-text-secondary">
          {selectedRegion || 'All Regions'} - Total Transactions: {total}
        </h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={36}
              formatter={(value: string, entry: any) => (
                <span style={{ color: entry.color }}>
                  {value}: {entry.payload.description}
                </span>
              )}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Variant Details Table */}
      <div className="mt-4 space-y-2">
        {pieData.map((variant) => {
          const percentage = ((variant.value / total) * 100).toFixed(1)
          return (
            <div key={variant.name} className="flex items-center justify-between p-2 rounded hover:bg-bg-secondary">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: variant.color }}
                />
                <span className="text-sm font-medium text-text-primary">{variant.name}</span>
                <span className="text-xs text-text-secondary">({variant.description})</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-text-primary">{variant.value}</span>
                <span className="text-sm text-text-secondary">{percentage}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}