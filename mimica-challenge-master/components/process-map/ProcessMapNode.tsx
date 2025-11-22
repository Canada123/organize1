import React from 'react'
import { Handle, Position } from 'reactflow'

interface ProcessMapNodeProps {
  data: {
    label: string
    duration: number
    count: number
    autoScore: number
    stepType: string
    application?: string
    screenshot?: string
  }
}

export function ProcessMapNode({ data }: ProcessMapNodeProps) {
  const getNodeStyle = () => {
    const baseStyle = {
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      border: '2px solid',
      minWidth: '180px',
      textAlign: 'center' as const,
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
    }

    if (data.autoScore >= 0.8) {
      return {
        ...baseStyle,
        background: '#4CAF50',
        borderColor: '#388E3C'
      }
    } else if (data.autoScore >= 0.6) {
      return {
        ...baseStyle,
        background: '#2196F3',
        borderColor: '#1976D2'
      }
    } else if (data.autoScore >= 0.4) {
      return {
        ...baseStyle,
        background: '#FF9800',
        borderColor: '#F57C00'
      }
    } else {
      return {
        ...baseStyle,
        background: '#F44336',
        borderColor: '#D32F2F'
      }
    }
  }

  const getStepTypeIcon = () => {
    switch (data.stepType) {
      case 'Action':
        return '▶'
      case 'Semi-structured Input':
        return '✏'
      case 'Decision':
        return '◆'
      case 'Virtualised Action':
        return '○'
      default:
        return '•'
    }
  }

  return (
    <div style={getNodeStyle()} className="hover:scale-105 cursor-pointer">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
      
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg opacity-80">{getStepTypeIcon()}</span>
        <span>{data.label}</span>
      </div>
      
      <div className="flex items-center justify-center gap-3 mt-1 text-xs opacity-90">
        <span>{data.duration}s</span>
        <span>•</span>
        <span>{data.count}x</span>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
    </div>
  )
}