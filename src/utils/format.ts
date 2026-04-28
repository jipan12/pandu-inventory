/**
 * 格式化金额为人民币格式
 */
export function formatCurrency(value: number): string {
  if (value == null || isNaN(value)) return '¥0.00'
  return '¥' + value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * 格式化日期时间
 */
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

/**
 * 格式化日期（仅日期部分）
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 格式化数字，千分位
 */
export function formatNumber(value: number): string {
  if (value == null || isNaN(value)) return '0'
  return value.toLocaleString('zh-CN')
}

/**
 * 生成UUID（简易版）
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
}

/**
 * 生成单据号
 */
export function generateOrderNo(prefix: string): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  return `${prefix}${y}${m}${d}${seq}`
}
