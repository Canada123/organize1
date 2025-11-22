'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { ProcessData } from '@/lib/types'
import { useProcessData } from '@/contexts/ProcessContext'
import { Badge } from '@/components/shared/Badge'

interface ProcessListProps {
  selectedProcessId: string | null
  onSelectProcess: (processId: string) => void
}

export function ProcessList({ selectedProcessId, onSelectProcess }: ProcessListProps) {
  const { processes } = useProcessData()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'completed' | 'in-progress'>('completed')

  const filteredProcesses = processes.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border-primary">
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'completed'
              ? 'text-text-primary border-b-2 border-primary-blue'
              : 'text-text-secondary'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'in-progress'
              ? 'text-text-primary border-b-2 border-primary-blue'
              : 'text-text-secondary'
          }`}
          onClick={() => setActiveTab('in-progress')}
        >
          In Progress
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border-primary">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search projects"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm bg-bg-secondary border border-border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue"
          />
        </div>
      </div>

      {/* Process List Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary sticky top-0">
            <tr className="text-left text-text-secondary">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Ease</th>
              <th className="px-3 py-2 font-medium">Auto</th>
              <th className="px-3 py-2 font-medium text-right">Time Spent</th>
              <th className="px-3 py-2 font-medium text-right">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.map((process) => (
              <ProcessRow
                key={process.id}
                process={process}
                isSelected={selectedProcessId === process.id}
                onSelect={() => onSelectProcess(process.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface ProcessRowProps {
  process: ProcessData
  isSelected: boolean
  onSelect: () => void
}

function ProcessRow({ process, isSelected, onSelect }: ProcessRowProps) {
  return (
    <tr
      className={`cursor-pointer hover:bg-hover-primary transition-colors border-b border-border-primary ${
        isSelected ? 'bg-primary-blue bg-opacity-5' : ''
      }`}
      onClick={onSelect}
    >
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="text-text-primary">{process.name}</span>
          <span className="text-xs text-text-secondary">{process.version}</span>
        </div>
      </td>
      <td className="px-3 py-3">
        <Badge variant="ease" value={process.ease} />
      </td>
      <td className="px-3 py-3">
        <Badge variant="automatability" value={process.automatability} />
      </td>
      <td className="px-3 py-3 text-right text-text-primary font-medium">
        {process.timeSpent.toLocaleString()} hrs/y
      </td>
      <td className="px-3 py-3 text-right text-text-primary">
        {process.frequency} per day
      </td>
    </tr>
  )
}