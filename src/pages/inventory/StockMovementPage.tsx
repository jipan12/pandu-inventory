import { useEffect, useState, useCallback } from 'react'
import PageHeader from '@/components/common/PageHeader'
import SearchPanel, { SearchField } from '@/components/common/SearchPanel'
import DataTable from '@/components/common/DataTable'
import DetailDrawer, { DetailSection, DetailField } from '@/components/common/DetailDrawer'
import { createCrudApi } from '@/mock/api'
import { mockStockMovements } from '@/mock/data-more'
import { formatDateTime, formatNumber } from '@/utils/format'
import { BIZ_TYPE_OPTIONS } from '@/utils/constants'
import { FormInput, FormSelect } from '@/components/common/FormDialog'
import type { StockMovement, PageParams } from '@/types'

const api = createCrudApi<StockMovement>(mockStockMovements, {
  keywordFields: ['movementNo', 'productName', 'sourceNo'],
  dateField: 'operatedAt',
  categoryFields: { bizType: 'bizType' },
})

export default function StockMovementPage() {
  const [list, setList] = useState<StockMovement[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<StockMovement | null>(null)

  const fetchData = useCallback(async () => { setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false) }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }

  const columns = [
    { key: 'movementNo', title: '流水编号', dataIndex: 'movementNo' as keyof StockMovement },
    { key: 'bizType', title: '业务类型', dataIndex: 'bizType' as keyof StockMovement },
    { key: 'sourceType', title: '来源单据类型', dataIndex: 'sourceType' as keyof StockMovement },
    { key: 'sourceNo', title: '来源单据号', dataIndex: 'sourceNo' as keyof StockMovement },
    { key: 'warehouse', title: '仓库', dataIndex: 'warehouse' as keyof StockMovement },
    { key: 'productName', title: '商品名称', dataIndex: 'productName' as keyof StockMovement },
    { key: 'beforeQty', title: '变动前', render: (_: unknown, r: StockMovement) => formatNumber(r.beforeQty) },
    { key: 'changeQty', title: '变动量', render: (_: unknown, r: StockMovement) => (
      <span className={r.changeQty > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {r.changeQty > 0 ? '+' : ''}{formatNumber(r.changeQty)}
      </span>
    )},
    { key: 'afterQty', title: '变动后', render: (_: unknown, r: StockMovement) => formatNumber(r.afterQty) },
    { key: 'operator', title: '操作人', dataIndex: 'operator' as keyof StockMovement },
    { key: 'operatedAt', title: '操作时间', render: (_: unknown, r: StockMovement) => formatDateTime(r.operatedAt) },
    { key: 'actions', title: '操作', render: (_: unknown, r: StockMovement) => (
      <button onClick={() => { setDetail(r); setDetailOpen(true) }} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
    )},
  ]

  return (
    <div>
      <PageHeader title="库存流水" description="查询库存变动流水记录" />
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="流水号/商品名称/单号" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="业务类型"><FormSelect options={BIZ_TYPE_OPTIONS} value={params.bizType as string || ''} onChange={(e) => setParams((p) => ({ ...p, bizType: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <DetailDrawer open={detailOpen} title="库存流水详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="业务信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="流水编号" value={detail.movementNo} mono /><DetailField label="业务类型" value={detail.bizType} />
            <DetailField label="来源单据" value={`${detail.sourceType} ${detail.sourceNo}`} /><DetailField label="仓库" value={detail.warehouse} />
            <DetailField label="商品名称" value={detail.productName} /><DetailField label="操作人" value={detail.operator} />
            <DetailField label="操作时间" value={formatDateTime(detail.operatedAt)} />
          </div></DetailSection>
          <DetailSection title="库存变动">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">变动前</p>
                <p className="text-xl font-bold text-gray-700">{formatNumber(detail.beforeQty)}</p>
              </div>
              <div className={`border rounded-lg p-4 text-center ${detail.changeQty > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-xs mb-1 ${detail.changeQty > 0 ? 'text-green-600' : 'text-red-600'}`}>变动量</p>
                <p className={`text-xl font-bold ${detail.changeQty > 0 ? 'text-green-700' : 'text-red-700'}`}>{detail.changeQty > 0 ? '+' : ''}{formatNumber(detail.changeQty)}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">变动后</p>
                <p className="text-xl font-bold text-gray-700">{formatNumber(detail.afterQty)}</p>
              </div>
            </div>
          </DetailSection>
        </>)}
      </DetailDrawer>
    </div>
  )
}
