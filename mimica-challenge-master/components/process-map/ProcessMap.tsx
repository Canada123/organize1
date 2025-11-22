'use client'

import React, { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { generateProcessMapData } from '@/lib/process-map-data'
import { useProcessData } from '@/contexts/ProcessContext'

function ProcessMapFlow() {
  const { stepsData } = useProcessData()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  useEffect(() => {
    if (stepsData && stepsData.length > 0) {
      const { nodes: mapNodes, edges: mapEdges } = generateProcessMapData(stepsData)
      setNodes(mapNodes)
      setEdges(mapEdges)
    }
  }, [stepsData, setNodes, setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as ProcessNode)
    
    // Highlight selected node
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: n.id === node.id ? 1 : 0.5,
          boxShadow: n.id === node.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
        }
      }))
    )
    
    // Highlight connected edges
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: {
          ...e.style,
          opacity: e.source === node.id || e.target === node.id ? 1 : 0.3
        }
      }))
    )
  }, [setNodes, setEdges])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    
    // Reset node opacity
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: 1,
          boxShadow: 'none'
        }
      }))
    )
    
    // Reset edge opacity
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: {
          ...e.style,
          opacity: 1
        }
      }))
    )
  }, [setNodes, setEdges])

  return (
    <div className="w-full h-full relative flex">
      {/* Main Process Map */}
      <div className="w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          attributionPosition="bottom-left"
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          minZoom={0.5}
          maxZoom={2}
        >
        <Background 
          variant={BackgroundVariant.Lines} 
          gap={20} 
          size={1}
          color="#f0f0f0"
        />
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="bottom-right"
          style={{
            bottom: '20px',
            right: '20px'
          }}
        />
        
        {/* Status Bar */}
        <Panel position="top-center" className="bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Viewing:</span>
            <span className="font-medium">Create Purchase Order</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">As-Is</span>
            <span className="text-gray-400">|</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-600 text-xs">FULLY AUTOMATABLE</span>
            </span>
          </div>
        </Panel>
      </ReactFlow>
      </div>
    </div>
  )
}

export default function ProcessMap() {
  return (
    <ReactFlowProvider>
      <ProcessMapFlow />
    </ReactFlowProvider>
  )
}