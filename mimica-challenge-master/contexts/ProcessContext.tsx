'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ProcessData, ProcessMetrics, StepData } from '@/lib/types'
import { loadProcessData, computeProcessMetrics } from '@/lib/process-data'
import { generateProcessesFromData } from '@/lib/process-generator'

interface ProcessContextType {
  processes: ProcessData[]
  processMetrics: Record<string, ProcessMetrics>
  stepsData: StepData[]
  isLoading: boolean
  error: Error | null
}

const ProcessContext = createContext<ProcessContextType | undefined>(undefined)

export function ProcessProvider({ children }: { children: React.ReactNode }) {
  const [processes, setProcesses] = useState<ProcessData[]>([])
  const [processMetrics, setProcessMetrics] = useState<Record<string, ProcessMetrics>>({})
  const [stepsData, setStepsData] = useState<StepData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        
        // Load the raw step data
        const steps = await loadProcessData()
        setStepsData(steps)
        
        // Generate diverse processes from the actual data
        const generatedProcesses = generateProcessesFromData(steps)
        setProcesses(generatedProcesses)
        
        // Compute metrics for each process
        const metrics: Record<string, ProcessMetrics> = {}
        for (const process of generatedProcesses) {
          // For demo purposes, we'll compute metrics for the invoice_approval process
          // and apply variations for other processes
          const baseMetrics = await computeProcessMetrics('invoice_approval', steps)
          
          // Add some variation to make each process unique
          const variation = generatedProcesses.indexOf(process) * 0.1
          metrics[process.id] = {
            ...baseMetrics,
            timeSaved: Math.round(baseMetrics.timeSaved * (0.8 + variation)),
            numberOfSMEs: process.recordedSMEs,
          }
        }
        setProcessMetrics(metrics)
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'))
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  return (
    <ProcessContext.Provider value={{ processes, processMetrics, stepsData, isLoading, error }}>
      {children}
    </ProcessContext.Provider>
  )
}

export function useProcessData() {
  const context = useContext(ProcessContext)
  if (context === undefined) {
    throw new Error('useProcessData must be used within a ProcessProvider')
  }
  return context
}