import React from 'react'
import { 
  MousePointer2, 
  Hand, 
  ZoomIn, 
  Search,
  Layers,
  FileText,
  Activity,
  Settings,
  Download,
  Upload,
  Shuffle,
  Eye,
  EyeOff,
  Grid3x3,
  List
} from 'lucide-react'

interface ProcessMapToolbarProps {
  onToggleDetail: () => void
  onToggleTransactions: () => void
  detailLevel: 'standard' | 'detailed'
}

export function ProcessMapToolbar({ 
  onToggleDetail, 
  onToggleTransactions,
  detailLevel 
}: ProcessMapToolbarProps) {
  return (
    <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-2 gap-1">
      {/* Selection Tools */}
      <div className="flex flex-col gap-1 pb-2 border-b border-gray-200 w-full items-center">
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <MousePointer2 className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Hand className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>
      
      {/* View Controls */}
      <div className="flex flex-col gap-1 pb-2 border-b border-gray-200 w-full items-center">
        <button 
          onClick={onToggleDetail}
          className={`p-2 rounded transition-colors ${
            detailLevel === 'detailed' 
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Toggle Detail Level"
        >
          <Layers className="w-5 h-5" />
        </button>
        <button 
          onClick={onToggleTransactions}
          className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
          title="Show Transactions"
        >
          <List className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Grid3x3 className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Eye className="w-5 h-5" />
        </button>
      </div>
      
      {/* Analysis Tools */}
      <div className="flex flex-col gap-1 pb-2 border-b border-gray-200 w-full items-center">
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Activity className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <FileText className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Shuffle className="w-5 h-5" />
        </button>
      </div>
      
      {/* Utility Tools */}
      <div className="flex flex-col gap-1 w-full items-center">
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Download className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Upload className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}