'use client'

import React, { useEffect, useState } from 'react'
import { ProcessMap } from './ProcessMap'
import { generateProcessMapData, ProcessMapData } from '@/lib/process-map-data'
import { useProcessData } from '@/contexts/ProcessContext'

interface ProcessMapViewProps {
  processId: string
}

export function ProcessMapView({ processId }: ProcessMapViewProps) {
  const { stepsData } = useProcessData()
  const [mapData, setMapData] = useState<ProcessMapData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (stepsData && stepsData.length > 0) {
      // Filter steps for this process
      const processSteps = stepsData.filter(step => step.task_id === processId)
      
      if (processSteps.length > 0) {
        const data = generateProcessMapData(processSteps)
        setMapData(data)
      }
      setIsLoading(false)
    }
  }, [stepsData, processId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary">Loading process map...</div>
      </div>
    )
  }

  if (!mapData || mapData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary">No process data available</div>
      </div>
    )
  }

  return (
    <div className="h-full bg-bg-secondary">
      <ProcessMap nodes={mapData.nodes} edges={mapData.edges} />
    </div>
  )
}