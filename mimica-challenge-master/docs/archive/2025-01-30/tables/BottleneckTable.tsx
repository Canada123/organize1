'use client'

import { useFilteredMetrics } from '@/hooks/useMetrics'
import { formatDuration } from '@/lib/data'

export function BottleneckTable() {
  const { bottlenecks } = useFilteredMetrics()
  
  // Sort by average duration descending
  const sortedBottlenecks = [...bottlenecks].sort((a, b) => b.avg_duration - a.avg_duration)
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border-primary">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Step Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Average Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Median Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Frequency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Impact Score
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-border-primary">
          {sortedBottlenecks.slice(0, 10).map((bottleneck, index) => {
            const impactScore = (bottleneck.avg_duration * bottleneck.count / 1000).toFixed(1)
            const isTopBottleneck = index < 3
            
            return (
              <tr 
                key={bottleneck.action_name}
                className={isTopBottleneck ? 'bg-red-50' : 'hover:bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  {bottleneck.action_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  <span className={isTopBottleneck ? 'font-semibold text-red-600' : ''}>
                    {formatDuration(bottleneck.avg_duration)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {formatDuration(bottleneck.median_duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {bottleneck.count.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <span className={isTopBottleneck ? 'font-semibold text-red-600' : 'text-text-secondary'}>
                      {impactScore}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isTopBottleneck ? 'bg-red-500' : 'bg-primary-blue'}`}
                        style={{ width: `${Math.min(100, parseFloat(impactScore) * 10)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}