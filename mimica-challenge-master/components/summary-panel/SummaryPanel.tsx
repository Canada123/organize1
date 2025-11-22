'use client'

import React, { useState } from 'react'
import { useProcessData } from '@/contexts/ProcessContext'
import { TimeSavedCard } from './TimeSavedCard'
import { EaseOfDeploymentGauge } from './EaseOfDeploymentGauge'
import { CountsGrid } from './CountsGrid'
import { ApplicationChart } from './ApplicationChart'
import { WebsiteChart } from './WebsiteChart'
import ProcessMap from '@/components/process-map/ProcessMap'

interface SummaryPanelProps {
  processId: string
}

export function SummaryPanel({ processId }: SummaryPanelProps) {
  const { processes, processMetrics } = useProcessData()
  const [activeTab, setActiveTab] = useState<'summary' | 'map' | 'variants' | 'bottlenecks'>('summary')
  
  const process = processes.find(p => p.id === processId)
  const metrics = processMetrics[processId]
  
  if (!process || !metrics) {
    return <div className="p-6">Loading process data...</div>
  }
  
  return (
    <div className="flex flex-col h-full bg-bg-primary">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{process.name}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
              <span>Mapper Completed</span>
              <span>•</span>
              <span>{process.version}</span>
              <span>•</span>
              <span className="bg-secondary-green text-white px-2 py-0.5 rounded text-xs">published</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium text-text-primary border border-border-primary rounded-md hover:bg-bg-secondary">
              View
            </button>
            <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary">
              Share
            </button>
            <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary">
              •••
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 mt-4">
          <button
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'summary'
                ? 'text-primary-blue border-primary-blue'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'map'
                ? 'text-primary-blue border-primary-blue'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('map')}
          >
            Map
          </button>
          <button
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'variants'
                ? 'text-primary-blue border-primary-blue'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('variants')}
          >
            Variants
          </button>
          <button
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'bottlenecks'
                ? 'text-primary-blue border-primary-blue'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('bottlenecks')}
          >
            Bottlenecks
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'summary' && (
          <div className="p-6 space-y-6">
            {/* Metadata */}
            <div className="flex gap-6 text-sm text-text-secondary">
              <div>
                <span className="font-medium">Created:</span> {process.created.toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Recorded SMEs:</span> PM FE VL (and 1 other)
              </div>
              <div>
                <span className="font-medium">Frequency:</span> {process.frequency} per day
              </div>
            </div>
            
            {/* Time Saved Card */}
            <TimeSavedCard metrics={metrics} />
            
            {/* Ease of Deployment Gauge */}
            <div className="bg-bg-secondary rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Ease of Deployment</h3>
              <EaseOfDeploymentGauge metrics={metrics} />
            </div>
            
            {/* Counts Grid */}
            <CountsGrid counts={metrics.counts} />
            
            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-bg-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Applications</h3>
                <ApplicationChart data={metrics.applicationUsage} />
              </div>
              <div className="bg-bg-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Websites</h3>
                <WebsiteChart data={metrics.websiteUsage} />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'map' && (
          <div className="h-full p-6">
            <ProcessMap />
          </div>
        )}
        
        {activeTab === 'variants' && (
          <div className="p-6">
            <div className="text-center text-text-secondary py-12">
              Variant analysis coming soon...
            </div>
          </div>
        )}
        
        {activeTab === 'bottlenecks' && (
          <div className="p-6">
            <div className="text-center text-text-secondary py-12">
              Bottleneck detection coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}