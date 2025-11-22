'use client'

import { useState } from 'react'
import { ProcessList } from '@/components/process-list/ProcessList'
import { SummaryPanel } from '@/components/summary-panel/SummaryPanel'
import { ProcessProvider } from '@/contexts/ProcessContext'

export default function HomePage() {
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null)

  return (
    <ProcessProvider>
      <div className="flex flex-col h-screen bg-bg-secondary">
        {/* Top Header */}
        <div className="h-14 bg-bg-primary border-b border-border-primary flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-text-primary">Mimica</h1>
            <div className="flex gap-2">
              <button className="text-sm text-text-secondary hover:text-text-primary">MINER</button>
              <button className="text-sm text-primary-blue font-semibold border-b-2 border-primary-blue pb-1">MAPPER</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-blue rounded hover:bg-blue-600">
              + New Project
            </button>
            <button className="px-4 py-2 text-sm font-medium text-text-primary border border-border-primary rounded hover:bg-bg-secondary">
              View
            </button>
            <button className="px-4 py-2 text-sm font-medium text-text-primary border border-border-primary rounded hover:bg-bg-secondary">
              Share
            </button>
            <button className="px-4 py-2 text-sm font-medium text-text-primary border border-border-primary rounded hover:bg-bg-secondary">
              Export
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-bg-primary border-r border-border-primary flex flex-col">
            {/* Navigation */}
            <nav className="px-4 py-4 border-b border-border-primary">
            <a 
              href="/analytics" 
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
            >
              Cross-Region Analytics
              <span className="text-xs bg-primary-blue text-white px-2 py-0.5 rounded">New</span>
            </a>
          </nav>
          
          <ProcessList 
            selectedProcessId={selectedProcessId}
            onSelectProcess={setSelectedProcessId}
          />
        </div>
        
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {selectedProcessId ? (
              <SummaryPanel processId={selectedProcessId} />
            ) : (
              <div className="flex items-center justify-center h-full text-text-secondary">
                Select a process to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </ProcessProvider>
  )
}