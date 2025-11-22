'use client'

import { useFilteredMetrics } from '@/hooks/useMetrics'
import { formatDuration } from '@/lib/data'

export function SummaryCards() {
  const { regionMetrics, variantMetrics, bottlenecks } = useFilteredMetrics()
  
  // Calculate summary statistics
  const totalTransactions = regionMetrics.reduce((sum, r) => sum + r.transaction_count, 0)
  const avgDuration = regionMetrics.length > 0
    ? regionMetrics.reduce((sum, r) => sum + r.avg_duration * r.transaction_count, 0) / totalTransactions
    : 0
  const totalRegions = regionMetrics.length
  const totalVariants = variantMetrics.length
  
  const cards = [
    {
      title: 'Total Transactions',
      value: totalTransactions.toLocaleString(),
      subtitle: `Across ${totalRegions} regions`,
      color: 'border-primary-blue'
    },
    {
      title: 'Average Duration',
      value: formatDuration(avgDuration),
      subtitle: 'Per transaction',
      color: 'border-primary-green'
    },
    {
      title: 'Process Variants',
      value: totalVariants.toString(),
      subtitle: 'Unique paths identified',
      color: 'border-primary-purple'
    },
    {
      title: 'Top Bottleneck',
      value: bottlenecks[0]?.action_name || 'N/A',
      subtitle: bottlenecks[0] ? formatDuration(bottlenecks[0].avg_duration) : '',
      color: 'border-primary-orange'
    }
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg shadow-sm border-l-4 ${card.color} p-6`}
        >
          <h3 className="text-sm font-medium text-text-secondary">
            {card.title}
          </h3>
          <p className="text-2xl font-bold text-text-primary mt-2">
            {card.value}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  )
}