import { useState, useEffect } from 'react'
import { RegionMetric, VariantDistribution, Bottleneck } from '@/lib/types'

interface AnalyticsData {
  regionMetrics: RegionMetric[]
  variantDistribution: VariantDistribution[]
  bottlenecks: Bottleneck[]
  isLoading: boolean
  error: Error | null
}

export function useAnalyticsData(): AnalyticsData {
  const [regionMetrics, setRegionMetrics] = useState<RegionMetric[]>([])
  const [variantDistribution, setVariantDistribution] = useState<VariantDistribution[]>([])
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        
        // Load all analytics data in parallel
        const [metricsRes, variantRes, bottlenecksRes] = await Promise.all([
          fetch('/data/processed_region_metrics.json'),
          fetch('/data/processed_variant_distribution.json'),
          fetch('/data/processed_top_bottlenecks.json'),
        ])
        
        if (!metricsRes.ok || !variantRes.ok || !bottlenecksRes.ok) {
          throw new Error('Failed to load analytics data')
        }
        
        const [metrics, variants, bottleneckData] = await Promise.all([
          metricsRes.json(),
          variantRes.json(),
          bottlenecksRes.json(),
        ])
        
        setRegionMetrics(metrics)
        setVariantDistribution(variants)
        setBottlenecks(bottleneckData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  return {
    regionMetrics,
    variantDistribution,
    bottlenecks,
    isLoading,
    error,
  }
}