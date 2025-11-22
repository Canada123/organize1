'use client'

import React, { useState } from 'react'
import { RegionMetrics } from '@/components/analytics/RegionMetrics'
import { RegionComparison } from '@/components/analytics/RegionComparison'
import { VariantDistribution } from '@/components/analytics/VariantDistribution'
import { BottleneckAnalysis } from '@/components/analytics/BottleneckAnalysis'
import { ProcessInsights } from '@/components/analytics/ProcessInsights'
import { useAnalyticsData } from '@/hooks/useAnalyticsData'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const { regionMetrics, variantDistribution, bottlenecks, isLoading, error } = useAnalyticsData()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-text-secondary">Loading analytics data...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-error-red">Error loading data: {error.message}</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <div className="bg-bg-primary border-b border-border-primary">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Processes
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary">Cross-Region Analytics</h1>
              <p className="text-sm text-text-secondary mt-1">
                Invoice Approval Process Standardization Insights
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Region Metrics Summary */}
        <RegionMetrics 
          metrics={regionMetrics} 
          selectedRegion={selectedRegion}
          onRegionSelect={setSelectedRegion}
        />
        
        {/* Region Comparison Chart */}
        <div className="bg-bg-primary rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Regional Performance Comparison</h2>
          <RegionComparison 
            metrics={regionMetrics}
            selectedRegion={selectedRegion}
            onRegionSelect={setSelectedRegion}
          />
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Variant Distribution */}
          <div className="bg-bg-primary rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Process Variant Distribution</h2>
            <VariantDistribution 
              data={variantDistribution}
              selectedRegion={selectedRegion}
            />
          </div>
          
          {/* Bottleneck Analysis */}
          <div className="bg-bg-primary rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Top Bottlenecks</h2>
            <BottleneckAnalysis 
              bottlenecks={bottlenecks}
              selectedRegion={selectedRegion}
            />
          </div>
        </div>
        
        {/* Process Insights & Recommendations */}
        <ProcessInsights 
          regionMetrics={regionMetrics}
          variantDistribution={variantDistribution}
          selectedRegion={selectedRegion}
        />
      </div>
    </div>
  )
}