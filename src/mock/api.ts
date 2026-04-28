import type { PageParams, PaginatedResult } from '@/types'
import { generateId, generateOrderNo } from '@/utils/format'

/** 模拟网络延迟 */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 搜索配置 */
export interface SearchConfig<T> {
  /** 关键词匹配字段列表 */
  keywordFields?: (keyof T)[]
  /** 日期字段名（日期范围筛选） */
  dateField?: keyof T
  /** 分类字段映射 */
  categoryFields?: Record<string, keyof T>
  /** 数值区间映射 */
  rangeFields?: Record<string, keyof T>
}

/**
 * 创建通用CRUD API工厂
 */
export function createCrudApi<T extends { id: string; status?: string }>(
  dataSet: T[],
  config: SearchConfig<T> = {},
) {
  let data = [...dataSet]

  function filterData(params: PageParams): { filtered: T[]; total: number } {
    let filtered = [...data]

    // 关键词模糊搜索
    if (params.keyword && config.keywordFields?.length) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter((item) =>
        config.keywordFields!.some((field) => {
          const val = item[field]
          return val != null && String(val).toLowerCase().includes(kw)
        }),
      )
    }

    // 分类字段筛选
    if (config.categoryFields) {
      for (const [paramKey, fieldKey] of Object.entries(config.categoryFields)) {
        if (params[paramKey]) {
          filtered = filtered.filter((item) => String(item[fieldKey] || '') === params[paramKey])
        }
      }
    }

    // status筛选
    if (params.status) {
      filtered = filtered.filter((item) => item.status === params.status)
    }

    // 日期范围筛选
    if (config.dateField && (params.dateFrom || params.dateTo)) {
      filtered = filtered.filter((item) => {
        const itemDate = String(item[config.dateField!] || '').substring(0, 10)
        if (params.dateFrom && itemDate < params.dateFrom) return false
        if (params.dateTo && itemDate > params.dateTo) return false
        return true
      })
    }

    // 数值区间筛选
    if (config.rangeFields) {
      for (const [paramKey, fieldKey] of Object.entries(config.rangeFields)) {
        const minKey = `min${paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}`
        const maxKey = `max${paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}`
        const minVal = params[minKey] as number | undefined
        const maxVal = params[maxKey] as number | undefined
        if (minVal != null) {
          filtered = filtered.filter((item) => Number(item[fieldKey]) >= minVal)
        }
        if (maxVal != null) {
          filtered = filtered.filter((item) => Number(item[fieldKey]) <= maxVal)
        }
      }
    }

    // 其他自定义字段精确匹配
    const customKeys = ['supplierName', 'customerName', 'warehouse', 'docStatus', 'bizType', 'dictCode', 'type', 'region', 'org', 'role']
    for (const key of customKeys) {
      if (params[key] && key in (filtered[0] || {})) {
        filtered = filtered.filter((item) => String((item as Record<string, unknown>)[key]) === params[key])
      }
    }

    return { filtered, total: filtered.length }
  }

  return {
    /** 分页列表查询 */
    async list(params: PageParams): Promise<PaginatedResult<T>> {
      await delay()
      const { filtered, total } = filterData(params)
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)
      return { list, total, page, pageSize }
    },

    /** 根据ID获取单条 */
    async getById(id: string): Promise<T | null> {
      await delay()
      return data.find((item) => item.id === id) || null
    },

    /** 新增 */
    async create(record: Omit<T, 'id'> & { id?: string }): Promise<T> {
      await delay()
      const newRecord = { ...record, id: record.id || generateId() } as T
      data.unshift(newRecord)
      return newRecord
    },

    /** 编辑 */
    async update(id: string, updates: Partial<T>): Promise<T | null> {
      await delay()
      const idx = data.findIndex((item) => item.id === id)
      if (idx === -1) return null
      data[idx] = { ...data[idx], ...updates }
      return data[idx]
    },

    /** 删除 */
    async remove(id: string): Promise<boolean> {
      await delay()
      const idx = data.findIndex((item) => item.id === id)
      if (idx === -1) return false
      data.splice(idx, 1)
      return true
    },

    /** 切换状态 */
    async toggleStatus(id: string): Promise<T | null> {
      await delay()
      const item = data.find((item) => item.id === id)
      if (!item) return null
      const newStatus = item.status === 'enabled' ? 'disabled' : 'enabled'
      item.status = newStatus as T['status']
      return item
    },

    /** 更新单据状态 */
    async updateStatus(id: string, newStatus: string): Promise<T | null> {
      await delay()
      const item = data.find((item) => item.id === id)
      if (!item) return null
      item.status = newStatus as T['status']
      return item
    },

    /** 生成单据号 */
    generateOrderNo,

    /** 获取全部数据（用于下拉选项等） */
    getAll(): T[] {
      return [...data]
    },

    /** 重置数据 */
    reset(initialData?: T[]) {
      data = [...(initialData || dataSet)]
    },
  }
}
