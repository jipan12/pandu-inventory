import type { ReactNode } from 'react'
import { X, Loader2 } from 'lucide-react'

interface FormDialogProps {
  open: boolean
  title: string
  children: ReactNode
  loading?: boolean
  confirmText?: string
  cancelText?: string
  maxWidth?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function FormDialog({
  open,
  title,
  children,
  loading = false,
  confirmText = '确定',
  cancelText = '取消',
  maxWidth = 'max-w-xl',
  onConfirm,
  onCancel,
}: FormDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div
        className={`relative bg-white rounded-lg shadow-xl w-full ${maxWidth} mx-4 max-h-[80vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

/** 表单分组容器 */
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h4>
      {children}
    </div>
  )
}

/** 表单字段容器 */
export function FormField({
  label,
  required,
  children,
  className = '',
}: {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

/** 标准输入框 */
export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 ${props.className || ''}`}
    />
  )
}

/** 标准下拉选择 */
export function FormSelect({
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[]
}) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 ${props.className || ''}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

/** 文本域 */
export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 resize-none ${props.className || ''}`}
      rows={props.rows || 3}
    />
  )
}
