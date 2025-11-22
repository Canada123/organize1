import React from 'react'
import { RegionMetric, VariantDistribution } from '@/lib/types'
import { Lightbulb, Target, TrendingUp, Users, AlertCircle } from 'lucide-react'

interface ProcessInsightsProps {
  regionMetrics: RegionMetric[]
  variantDistribution: VariantDistribution[]
  selectedRegion: string | null
}

export function ProcessInsights({ regionMetrics, variantDistribution, selectedRegion }: ProcessInsightsProps) {
  // Calculate Process Variation Reduction Index (PVRI)
  const calculatePVRI = () => {
    const avgDurations = regionMetrics.map(m => m.avg_duration)
    const mean = avgDurations.reduce((sum, val) => sum + val, 0) / avgDurations.length
    const variance = avgDurations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / avgDurations.length
    const stdDev = Math.sqrt(variance)
    const cv = (stdDev / mean) * 100 // Coefficient of variation
    
    // PVRI: Higher is better (100 - CV normalized to 0-100 scale)
    return Math.max(0, Math.min(100, 100 - cv * 10))
  }
  
  const pvri = calculatePVRI()
  const pvriStatus = pvri >= 80 ? 'Excellent' : pvri >= 60 ? 'Good' : pvri >= 40 ? 'Fair' : 'Poor'
  const pvriColor = pvri >= 80 ? 'text-secondary-green' : pvri >= 60 ? 'text-primary-blue' : pvri >= 40 ? 'text-warning-orange' : 'text-error-red'
  
  // Find regions with highest variation from mean
  const globalAvg = regionMetrics.reduce((sum, m) => sum + m.avg_duration, 0) / regionMetrics.length
  const regionDeviations = regionMetrics.map(m => ({
    region: m.region,
    deviation: Math.abs(m.avg_duration - globalAvg),
    percentDeviation: ((m.avg_duration - globalAvg) / globalAvg * 100),
  })).sort((a, b) => b.deviation - a.deviation)
  
  // Calculate variant consistency
  const variantConsistency = variantDistribution.map(dist => {
    const total = dist.A + dist.B + dist.C + dist.D + dist.E
    const variantA_percentage = (dist.A / total) * 100
    return {
      region: dist.region,
      standardAdoption: variantA_percentage,
      variantDiversity: Object.values({ A: dist.A, B: dist.B, C: dist.C, D: dist.D, E: dist.E })
        .filter(v => v > 0).length
    }
  })
  
  const recommendations = [
    {
      icon: Target,
      title: 'Standardize High-Variation Regions',
      description: `Focus on ${regionDeviations[0].region} and ${regionDeviations[1].region} which show ${regionDeviations[0].percentDeviation.toFixed(1)}% and ${regionDeviations[1].percentDeviation.toFixed(1)}% deviation from global average.`,
      impact: 'High',
      effort: 'Medium',
    },
    {
      icon: Users,
      title: 'Increase Variant A Adoption',
      description: `Promote standard flow (Variant A) adoption across regions. Current adoption ranges from ${Math.min(...variantConsistency.map(v => v.standardAdoption)).toFixed(0)}% to ${Math.max(...variantConsistency.map(v => v.standardAdoption)).toFixed(0)}%.`,
      impact: 'Medium',
      effort: 'Low',
    },
    {
      icon: TrendingUp,
      title: 'Process Optimization',
      description: 'Implement automation for top 3 bottlenecks to reduce average process duration by an estimated 15-20%.',
      impact: 'High',
      effort: 'High',
    },
  ]
  
  return (
    <div className="space-y-6">
      {/* PVRI Score Card */}
      <div className="bg-bg-primary rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              Process Variation Reduction Index (PVRI)
              <AlertCircle className="w-4 h-4 text-text-secondary" />
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Measures process standardization across regions (0-100)
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${pvriColor}`}>{pvri.toFixed(0)}</div>
            <div className={`text-sm ${pvriColor}`}>{pvriStatus}</div>
          </div>
        </div>
        
        {/* PVRI Progress Bar */}
        <div className="relative h-8 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-error-red via-warning-orange to-secondary-green transition-all duration-1000"
            style={{ width: '100%' }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-bg-secondary"
            style={{ left: `${pvri}%`, right: 0 }}
          />
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-1 h-10 bg-text-primary"
            style={{ left: `${pvri}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-text-secondary">
          <span>Poor (0)</span>
          <span>Fair (40)</span>
          <span>Good (60)</span>
          <span>Excellent (80+)</span>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-bg-primary rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning-orange" />
          Standardization Recommendations
        </h2>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon
            const impactColor = rec.impact === 'High' ? 'text-secondary-green' : rec.impact === 'Medium' ? 'text-primary-blue' : 'text-text-secondary'
            const effortColor = rec.effort === 'Low' ? 'text-secondary-green' : rec.effort === 'Medium' ? 'text-warning-orange' : 'text-error-red'
            
            return (
              <div key={index} className="p-4 bg-bg-secondary rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary mb-1">{rec.title}</h3>
                    <p className="text-sm text-text-secondary mb-2">{rec.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        Impact: <span className={`font-medium ${impactColor}`}>{rec.impact}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        Effort: <span className={`font-medium ${effortColor}`}>{rec.effort}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Benefits Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-primary rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-secondary-green mb-1">15-20%</div>
          <div className="text-sm text-text-secondary">Potential Time Reduction</div>
        </div>
        <div className="bg-bg-primary rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary-blue mb-1">$2.4M</div>
          <div className="text-sm text-text-secondary">Estimated Annual Savings</div>
        </div>
        <div className="bg-bg-primary rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning-orange mb-1">3-6 mo</div>
          <div className="text-sm text-text-secondary">Implementation Timeline</div>
        </div>
      </div>
    </div>
  )
}