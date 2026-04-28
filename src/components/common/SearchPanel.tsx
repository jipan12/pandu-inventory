import type { ReactNode } from 'react'
import { Search, RotateCcw } from 'lucide-react'

interface SearchPanelProps {
  children: ReactNode
  onSearch: () => void
  onReset: () => void
  loading?: boolean
}

export default function SearchPanel({ children, onSearch, onReset, loading }: SearchPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {children}
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          查询
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 text-xs font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置
        </button>
      </div>
    </div>
  )
}

/** 表单输入组件的容器 */
export function SearchField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
