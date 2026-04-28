import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Inbox } from 'lucide-react'

interface Column<T> {
  key: string
  title: string
  dataIndex?: keyof T | string
  width?: string
  render?: (value: unknown, record: T, index: number) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  dataSource: T[]
  loading?: boolean
  rowKey?: keyof T | ((record: T) => string)
  pagination?: {
    page: number
    pageSize: number
    total: number
    onChange: (page: number) => void
  }
  emptyText?: string
  className?: string
}

export default function DataTable<T>({
  columns,
  dataSource,
  loading = false,
  rowKey = 'id' as keyof T,
  pagination,
  emptyText = '暂无数据',
  className = '',
}: DataTableProps<T>) {
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 0

  function getRowKey(record: T, index: number): string {
    if (typeof rowKey === 'function') return rowKey(record)
    return String(record[rowKey] ?? index)
  }

  function getValue(record: T, col: Column<T>): unknown {
    if (col.dataIndex) {
      return record[col.dataIndex as keyof T]
    }
    return (record as Record<string, unknown>)[col.key]
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-400">加载中...</p>
                </td>
              </tr>
            ) : dataSource.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <Inbox className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="mt-2 text-sm text-gray-400">{emptyText}</p>
                </td>
              </tr>
            ) : (
              dataSource.map((record, idx) => (
                <tr
                  key={getRowKey(record, idx)}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">
                      {col.render
                        ? col.render(getValue(record, col), record, idx)
                        : String(getValue(record, col) ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            共 {pagination.total} 条，第 {pagination.page}/{totalPages} 页
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, pagination.page - 2)
              const end = Math.min(totalPages, start + 4)
              const pageNum = Math.max(start, Math.min(end, start + i))
              if (pageNum > end) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => pagination.onChange(pageNum)}
                  className={`w-7 h-7 text-xs rounded ${
                    pageNum === pagination.page
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => pagination.onChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
