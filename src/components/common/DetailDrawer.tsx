import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface DetailDrawerProps {
  open: boolean
  title: string
  children: ReactNode
  width?: string
  onClose: () => void
}

export default function DetailDrawer({
  open,
  title,
  children,
  width = 'w-[640px]',
  onClose,
}: DetailDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        className={`relative bg-white h-full ${width} max-w-full shadow-xl flex flex-col animate-slide-in`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

/** 详情卡片分组 */
export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="bg-gray-50/50 rounded-lg p-4">{children}</div>
    </div>
  )
}

/** 详情字段行 */
export function DetailField({
  label,
  value,
  highlight,
  mono,
}: {
  label: string
  value: ReactNode
  highlight?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex items-start py-1.5">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <span
        className={`text-sm ${highlight ? 'text-lg font-semibold text-gray-900' : 'text-gray-700'} ${mono ? 'font-mono' : ''}`}
      >
        {value || '-'}
      </span>
    </div>
  )
}
