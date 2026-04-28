interface StatusBadgeProps {
  status: string
  statusMap?: Record<string, { label: string; className: string }>
  className?: string
}

const defaultStatusMap: Record<string, { label: string; className: string }> = {
  enabled: { label: '启用', className: 'bg-green-100 text-green-700 ring-green-600/20' },
  disabled: { label: '禁用', className: 'bg-red-100 text-red-700 ring-red-600/20' },
}

export default function StatusBadge({ status, statusMap, className = '' }: StatusBadgeProps) {
  const map = statusMap || defaultStatusMap
  const info = map[status]
  if (!info) return <span className="text-gray-400 text-xs">-</span>

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${info.className} ${className}`}
    >
      {info.label}
    </span>
  )
}
