import { useMemo } from 'react'
import { useMetrics as useMetricsContext } from '@/contexts/DataContext'
import { filterMetricsByRegion } from '@/lib/data'

/**
 * Custom hook for accessing filtered metrics
 */
export function useFilteredMetrics() {
  const { metrics, filters } = useMetricsContext()
  
  const filteredRegionMetrics = useMemo(() => {
    return filterMetricsByRegion(metrics.regionMetrics, filters.selectedRegion)
  }, [metrics.regionMetrics, filters.selectedRegion])
  
  const filteredVariantDistribution = useMemo(() => {
    return filterMetricsByRegion(metrics.variantDistribution, filters.selectedRegion)
  }, [metrics.variantDistribution, filters.selectedRegion])
  
  const filteredBottlenecks = useMemo(() => {
    if (!filters.selectedRegion) return metrics.bottlenecks
    
    // For bottlenecks, we need to filter based on transactions from the selected region
    // Since bottlenecks don't have region directly, we return all for now
    // In a real implementation, we'd need to join with transaction data
    return metrics.bottlenecks
  }, [metrics.bottlenecks, filters.selectedRegion])
  
  return {
    regionMetrics: filteredRegionMetrics,
    variantDistribution: filteredVariantDistribution,
    variantMetrics: metrics.variantMetrics,
    bottlenecks: filteredBottlenecks,
    stepMetrics: metrics.stepMetrics
  }
}